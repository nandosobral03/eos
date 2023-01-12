<script lang="ts">
	import type { Note } from '$lib/models/ServerData';
	import { noteService } from '$lib/notes';
	import { currentNote } from '$lib/stores/stores';
	import { error } from '@sveltejs/kit';
    import DOMPurify from 'dompurify';
    import { marked } from 'marked';
	import { createEventDispatcher } from 'svelte';
	import { onMount } from 'svelte';
	export let note: Note;
    export let create:boolean = false;
    let titleError = false;
    let contentError = false;
    let previousContent = note.content
    $: noteContent =  DOMPurify.sanitize(marked.parse(note.content))
    let editing = false;
    const dispatch = createEventDispatcher()
    
    const handleEdit = () => {
        editing = true;
        currentNote.update((n) => {
            n.content = note.content
            return n
        })
    }
    
    onMount(() => {
        console.log(create)
        if(create){
            handleEdit()
        }
    })

    const handleSave = async () => {
        titleError = note.title.length === 0
        contentError = note.content.length === 0
        if(titleError || contentError){
            return
        }


        editing = false;
        currentNote.update((n) => {
            n.writing = false
            return n
        })
        previousContent = note.content
        noteContent = DOMPurify.sanitize(marked.parse(note.content))
        if(create){
            create = false;
            console.log(create)
            await noteService.createNote(note)
            goBack();
        }else{
            await noteService.updateNote(note)
        }
    }

    const handleContentChange = () => {
        contentError = note.content.length === 0;
        currentNote.update((n) => {
            n.content = note.content
            return n
        })
    }

    const handleCancel = () => {
        editing = false;
        note.content = previousContent
        currentNote.update((n) => {
            n.writing = false
            n.content = previousContent
            return n
        })
        if(create){
           goBack();
        }
    }

    const handleDelete = async () => {
        await noteService.deleteNote(note.id!)
        goBack();
    }

    const goBack = () => {
        dispatch('back')
    }


</script>

<div class="note">
    <div class="topbar">
        <div class="flex-container">
            <span class="back material-symbols-outlined" on:click={goBack} on:keydown={goBack}> arrow_back </span>
            {#if !editing}
                <span class="title">{note.title}</span>
            {:else}
                <input class="title" bind:value={note.title} placeholder="Title" class:error={titleError} on:change={() => titleError = note.title.length == 0}/>
            {/if}
            
        </div>
        <div class="flex-container"> 
        {#if editing}
            <span class="edit material-symbols-outlined" on:click = {handleSave} on:keydown={handleSave}> save </span>
            <span class="delete material-symbols-outlined" on:click = {handleCancel} on:keydown={handleCancel}> close </span>
            {:else}
            <span class="edit material-symbols-outlined" on:click = {handleEdit} on:keydown={handleEdit}> edit </span>
            <span class="delete material-symbols-outlined" on:click = {handleDelete} on:keydown={handleDelete}> delete </span>
        {/if}
        </div>
	</div>
    {#if !editing}
        <div class="content">
            {@html
                noteContent
            }
        </div>
    {:else}
        <div class="content">
            <textarea class="content-text-area" bind:value={note.content} on:keyup={handleContentChange}
                placeholder="Write your note here..."
                class:error={contentError}
                on:focus={() => {
                    currentNote.update((n) => {
                        n.writing = true
                        return n
                    })
                }}
                on:blur={() => {
                    currentNote.update((n) => {
                        n.writing = false
                        return n
                    })
                }}
            ></textarea>
        </div>
    {/if}
</div>

<style lang="scss">
    .topbar{
        width: 100%;
        height: 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
    }

	.material-symbols-outlined {
		font-variation-settings: 'FILL' 0, 'wght' 500, 'GRAD' 0, 'opsz' 48;
		font-size: 15px;
		user-select: none;
		cursor: pointer;
		&.delete {
			&:hover {
				color: var(--danger-color);
			}
		}
		&.edit {
			&:hover {
				color: var( --success-color);
			}
		}
        &.back {
            &:hover {
                color: var(--text-color);
            }
        }
	}

    .flex-container{
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 10px;
    }

    .note{
        padding: 10px;
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        gap: 10px;
        background-color: transparent;
        }
    
    .content{
        flex-grow: 1;
        padding: 0px 20px;
    }

    .content-text-area{
        width: 100%;
        height: 100%;
        padding: 1px;
        background-color: transparent;
        border: none;
        resize: none;
        color: var(--text-color);
        font-size: 15px;
        font-family: var(--font-family);
        &.error{
            border: 1px solid var(--danger-color); 
        }
    }

    .title{
        font-size: 1.2rem;
        line-height: 100%;
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: clamp(200px, 28vw, 350px);
        max-width: clamp(200px, 28vw, 350px);
        color: var(--text-color);
        border: none;
        flex-grow: 1;
        background-color: transparent;
        &.error{
            border: 1px solid var(--danger-color); 
        }
    }
</style>
