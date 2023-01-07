<script lang="ts">
	import type { RSSProvider } from "$lib/models/ServerData";
	import { createEventDispatcher, onMount } from "svelte";
	import { notifications } from "$lib/notifications";
	import { rssService } from "$lib/rss";
    export let provider:RSSProvider;
    export let editing = false;
	const dispatch = createEventDispatcher();
    let imageFile:File | null = null;
    let imageUploader: HTMLInputElement | null = null;
    onMount(async () => {
        imageUploader = document.getElementById(`provider-image-${provider.id || 0}`) as HTMLInputElement;
        imageUploader?.addEventListener("change", (e) => {
            const file = (e.target as HTMLInputElement).files![0];
            const reader = new FileReader();
            reader.onload = (e) => {
                provider.image = e.target?.result as string;
                imageFile = file;
            }
            reader.readAsDataURL(file);
        })
    })

    const handleDelete = async () => {
        try{
            await rssService.deleteRSSProvider(provider.id!);
            notifications.success("Provider deleted successfully", 500);
        }
        catch(e){
            notifications.danger("Error deleting provider", 500);
        }
    }

    const handleSave = async () => {
        if(!provider.url){
            notifications.danger("Please enter a valid URL", 500);
            return;
        }

        if(!provider.id){
            try{
                const id = await rssService.createRSSProvider(provider.url);
                provider.id = id;
                notifications.success("Provider added successfully", 500);
            }
            catch(e){
                notifications.danger("Error adding provider", 500);
            }
        }else{
            try{
                await rssService.updateRSSProvider({url: provider.url, image: imageFile ? "" : provider.image, id: provider.id});
                notifications.success("Provider updated successfully", 500);
            }
            catch(e){
                notifications.danger("Error updating provider", 500);
            }

        }
        await updateImage()
        handleClose();

    }

    const updateImage = async () => {
        if(imageFile){
            await rssService.updateRSSProviderImage(provider.id!, imageFile);
        }
    }

    const handleClose = () => {
        dispatch("close");
        editing = false;
    }

</script>

{#if !editing}
    <div class="provider">
        <div class="info">
            <img class="provider-image" src={provider.image} alt="provider" />
            <div class="provider-url">
                {provider.url}
            </div>
        </div>
        <div class="actions">
            <button class="edit" on:click={() => editing = true}>  <span class="material-symbols-outlined">edit</span> </button>
            <button class="delete" on:click={() => handleDelete()}> <span class="material-symbols-outlined">delete</span> </button>
        </div>
    </div>
    {:else}
    <div class="provider edit">
        <div class="info">
            <img class="provider-image edit-image" 
                src={provider.image} 
                alt="provider" 
                on:error={() => provider.image = "https://via.placeholder.com/150"}
                on:click={() => { imageUploader?.click();}}
                on:keydown={() => { imageUploader?.click();}}
                />
            <div class="provider-url">
               <input type="text" bind:value={provider.url} placeholder="RSS feed URL" />
            </div>
        </div>
        <div class="actions">
            <button class="edit" on:click={() => handleSave()}>  <span class="material-symbols-outlined">save</span> </button>
            <button class="delete" on:click={() => handleClose()}> <span class="material-symbols-outlined">close</span> </button>
        </div>
    </div>
{/if}
<input type='file' id={`provider-image-${provider.id || 0}`} accept="image/*" style="display: none;" />



<style lang="scss">
    .provider{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: calc(100% - 40px);
        gap: 20px;
        padding: 10px;
        &.edit{
            background-color: var(--gray-color);
        }
    }

    .provider-image{
        width: 35px;
        height: 35px;
        object-fit: cover;
        &.edit-image{
            &:hover{
                cursor: pointer;
                filter: brightness(0.8);
            }
        }
    }

    .actions{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: 5px;
        button{
            background-color: transparent;
            border: none;
            cursor: pointer;
            color: var(--color-text);
            font-size: 0.8rem;
            &.delete :hover{
                color: var(--red-color);
            }
            &.edit :hover{
                color: var(--green-color);
            }

            .material-symbols-outlined {
			font-variation-settings: 'FILL' 0, 'wght' 500, 'GRAD' 0, 'opsz' 48;
			font-size: 16px;
			margin: auto;
			user-select: none; /* Non-prefixed version, currently
							supported by Chrome and Opera */
		}
        }
    
    }

    .info{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        gap: 10px;
        flex-grow: 1;
        max-width: 85%;
        overflow-x: hidden;
    }

    .provider-url{
        width: 100%;  
        border: none;
        color: var(--color-text);
        background-color: transparent;
        font-size: 0.8rem;
        font-weight: 300;
        padding-bottom: 5px;
        input{
            width: 100%;
            border: none;
            color: var(--color-text);
            background-color: transparent;
            font-size: 0.8rem;
            font-weight: 300;
            padding-bottom: 5px;
            &::placeholder{
                color: var(--color-text);
                filter: opacity(0.5);
            }
            &:focus{
                border-bottom: 1px solid var(--text-color);
                animation: 1s ease-in-out 0s normal none infinite running blink;
                outline: none;
            }
        }
    }

</style>