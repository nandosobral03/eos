<script lang="ts">
	import { bookmarkService } from "$lib/bookmarks";
    import type { Bookmark } from "$lib/models/ServerData";
	import { notifications } from "$lib/notifications";
	import { Color, ColorInput } from "color-picker-svelte";
	import { createEventDispatcher } from "svelte";
    export let bookmark:Bookmark;
    let oldBookmark = JSON.parse(JSON.stringify(bookmark));
    const dispatcher = createEventDispatcher();
    let color: Color;
    try{
        color = new Color(bookmark.color);
    }
    catch{
        color = new Color("#000000");
    }
    $: links = bookmark.links;
    $: bookmark.color = color.toHex8String();

    const saveBookmark = async () => {
        bookmark.color = color.toHex8String();
        bookmark.links = links.filter((l) => l.name !== "" && l.url !== "");
        if(bookmark.id){
            try{
                await bookmarkService.updateBookmark(bookmark);
                notifications.success("Bookmark updated", 500);
            }
            catch{
                notifications.danger("Failed to update bookmark", 500);
            }
            dispatcher("save");
        }else{
            try{
                await bookmarkService.createBookmark(bookmark);
                notifications.success("Bookmark created", 500);
            }
            catch{
                notifications.danger("Failed to create bookmark", 500);
            }
            dispatcher("save");
        }
    }

    const discardBookmark = () => {
        bookmark = JSON.parse(JSON.stringify(oldBookmark));
        dispatcher("discard");
    }

    const addLink = () => {
        bookmark.links = [...bookmark.links, {name: "", url: ""}];
    }

</script>

<div class="wrapper">
    <div class=title_color>
        <input type="text" bind:value={bookmark.title} class="title" style="{`color: ${bookmark.color};`}" placeholder="Title">
        <div class="color_picker">
            <ColorInput bind:color={color} showAlphaSlider title={color?.toHex8String()} />
        </div>
    </div>
    <div class="links">
        {#each links as link}
            <div>
                <input type="text" bind:value={link.name} class="name" placeholder="Name">
                <input type="text" bind:value={link.url} class="url" placeholder="URL">
                <div class="bookmark_actions">
                    <button class="delete" on:click={() => {
                        bookmark.links = bookmark.links.filter((l) => l !== link);
                    }}
                    > <span class="material-symbols-outlined">delete</span> </button>
                </div>
            </div>
        {/each}
    </div>
    <div class="buttons">
        <button
        class="button"
        on:click={
            addLink
        }
        >Add Link</button>
        <button
        class="button"
        on:click={
            discardBookmark
        }
        >Discard</button>
    <button
    class="button" 
    on:click={
        saveBookmark
    }>Save</button>
    </div>
</div>


<style lang="scss">
    .wrapper{
        background-color: var(--accent-color);
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
        padding: 10px;
        border-radius: 5px;
    }

    .title{
        background-color: transparent;
        outline: none;
        border: none;
        color: var(--text-color);
        font-size: 0.8rem;
        border-radius: 5px;
        padding: 0px 5px;
    }

    .title_color{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .color_picker{
       scale: 0.8;
    }

    .links{
        display: flex;
        flex-direction: column;
        gap: 10px;

        > div{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            gap: 5px;
        }
        .name{
            background-color: transparent;
            outline: none;
            border: none;
            color: var(--text-color);
            font-size: 0.8rem;
            border-radius: 5px;
            padding: 0px 5px;
            max-width: 25%;
        }
        .url{
            background-color: transparent;
            outline: none;
            border: none;
            color: var(--text-color);
            font-size: 0.8rem;
            border-radius: 5px;
            padding: 0px 5px;
            flex-grow: 1;
        }
    }

    .button{
        margin: 5px 0px;
        background-color: var(--button-color);
        color: var(---button-text-color);
        border: none;
        border-radius: 5px;
        padding: 5px;
        font-size: 0.8rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
        &:hover{
            background-color: var(--button-color-hover);
            color: var(---button-text-color-hover);
        }
    }

    .buttons{
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        gap: 5px;
        width: 100%;
    }

    
    .bookmark_actions{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        button{
            background-color: transparent;
            border: none;
            cursor: pointer;
            color: var(--color-text);
            font-size: 0.8rem;
            &.delete :hover{
                color: var(--danger-color);
            }
            &.edit :hover{
                color: var(--success-color);
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

</style>