<script lang="ts">
	import { bookmarks, bottomComponent, refreshBackground, refreshBottom, themes } from "$lib/stores/stores";
	import axios from "axios";
	import { onMount } from "svelte";
    import { Color, ColorInput } from 'color-picker-svelte'
	import type { Bookmark } from "$lib/models/ServerData";
    import BookmarkEdit from "./BookmarkEdit.svelte";
	import { bookmarkService } from "$lib/bookmarks";
	import { notifications } from "$lib/notifications";
	import { spotifyService } from "$lib/spotify";
    let backgroundImage: FileList; 
    let bottomImage: FileList;
    let defaultColors = {
        background: "#2f343f",
        accentColor: "#4b5262",
        accentColorHover: "#88c0d0",
        text: "#ffffff",
        textAccent: "#88c0d0",
        textHover: "#ffffff",
        iconColor: "#ffffff",
        iconColorActive: "#ffffff",
        iconColorHover: "#ffffff",
        iconBackground: "#4b5262",
        iconBackgroundActive: "#a3be8c",
        iconBackgroundHover: "#d08770",
        borderColor: "#4b5262",
        borderColorHover: "#88c0d0",
        buttonColor: "#d08770",
        buttonColorHover: "#a3be8c",
        buttonText: "#ffffff",
        buttonTextHover: "#ffffff",
        dangerColor: "#bf616a",
        successColor: "#a3be8c",
    }

    
    let editing :number|undefined= undefined;
    let colors = defaultColors
    let colorsConstructor = Object.entries(colors).reduce((acc, [key, value]) => ({ ...acc, [key]: new Color(value) }), {}) as any;
    let currentThemes:{id:string,title:string, theme:any}[] = []
    
    themes.subscribe((value) => {
        currentThemes = value;
    })


    let bms : Bookmark[] = [];
    let timeRange = 'short_term';
    

    bookmarks.subscribe(
        (value) => {
            bms = value;
        }
    )
        
    let bottomContainerType : string;
    bottomComponent.subscribe((n) => {
        if(bottomContainerType != n) bottomContainerType = n;
    })

    onMount(() => {
        let col = localStorage.getItem("colors")
        spotifyService.term.subscribe((n) => {
            timeRange = n;
        })
            
        if(col){
            colors = JSON.parse(col);
        }else{
            localStorage.setItem("colors", JSON.stringify(defaultColors));
        }
        colorsConstructor = Object.entries(colors).reduce((acc, [key, value]) => ({ ...acc, [key]: new Color(value) }), {}) as any;
    })


    const setBackgroundImage = async () => {
        if(backgroundImage.length == 1){
            const formData = new FormData();
            formData.append('image', backgroundImage[0]);
            const data = await axios.post('/settings/background',formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            });
            if(data.status == 200){
                refreshBackground.update(n => !n);
            }
        }
    
    }
    const setBottomImage = async () => {
        if(bottomImage.length == 1){
            const formData = new FormData();
            formData.append('image', bottomImage[0]);
            const data = await axios.post('/settings/image',formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            });
            if(data.status == 200){
                refreshBottom.update(n => !n);
            }
            
        }
    }

    const handleCreateTheme = () => {
        let id = new Date().getTime() + "";
        let title = prompt("Theme name");
        if(title){
            let newThemes = [...currentThemes,{id,title, theme:colors}]
            localStorage.setItem("themes", JSON.stringify(newThemes));
            themes.set(newThemes)
        }
    }


    const applyTheme = (id:string) => {
        let theme = currentThemes.find((x) => x.id == id);
        if(theme){
            colors = theme.theme;
            applyColors();
        }
    }


    const deleteTheme = (id:string) => {
        let remaining = currentThemes.filter((x) => x.id !== id);
        localStorage.setItem("themes", JSON.stringify(remaining));
        themes.set(remaining)
    }

    const updateColors = () => {
        colors = Object.entries(colorsConstructor).reduce((acc, [key, value]:any) => ({ ...acc, [key]: value.toHex8String() }), {}) as any;
        applyColors();
    }

    const applyColors = () => {
        localStorage.setItem("colors", JSON.stringify(colors));

        document.documentElement.style.setProperty('--background-color', colors.background);
        document.documentElement.style.setProperty('--background-color-opaque', colors.background.slice(0,7));
        document.documentElement.style.setProperty('--text-color', colors.text);
        document.documentElement.style.setProperty('--text-color-accent', colors.textAccent);
        document.documentElement.style.setProperty('--text-color-hover', colors.textHover);
        document.documentElement.style.setProperty('--icon-color', colors.iconColor);
        document.documentElement.style.setProperty('--icon-color-active', colors.iconColorActive);
        document.documentElement.style.setProperty('--icon-color-hover', colors.iconColorHover);
        document.documentElement.style.setProperty('--icon-background', colors.iconBackground);
        document.documentElement.style.setProperty('--icon-background-active', colors.iconBackgroundActive);
        document.documentElement.style.setProperty('--icon-background-hover', colors.iconBackgroundHover);
        document.documentElement.style.setProperty('--accent-color', colors.accentColor);
        document.documentElement.style.setProperty('--accent-color-hover', colors.accentColorHover);
        document.documentElement.style.setProperty('--border-color', colors.borderColor);
        document.documentElement.style.setProperty('--border-color-hover', colors.borderColorHover);
        document.documentElement.style.setProperty('--button-color', colors.buttonColor);
        document.documentElement.style.setProperty('--button-color-hover', colors.buttonColorHover);
        document.documentElement.style.setProperty('--button-text-color', colors.buttonText);
        document.documentElement.style.setProperty('--button-text-color-hover', colors.buttonTextHover);
        document.documentElement.style.setProperty('--danger-color', colors.dangerColor);
        document.documentElement.style.setProperty('--success-color', colors.successColor);

        colorsConstructor = Object.entries(colors).reduce((acc, [key, value]) => ({ ...acc, [key]: new Color(value) }), {}) as any;
    }
 

    const restoreDefaults = () => {
        colors = defaultColors
        colorsConstructor = Object.entries(defaultColors).reduce((acc, [key, value]) => ({ ...acc, [key]: new Color(value) }), {}) as any;
        updateColors();
    }
    const discardChanges = () => {
        colors = JSON.parse(localStorage.getItem("colors")!);
        colorsConstructor = Object.entries(colors).reduce((acc, [key, value]) => ({ ...acc, [key]: new Color(value) }), {}) as any;
        updateColors();
    }

    const getReadableString = (str: string) => {
        return str.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase(); })
    }

    const deleteBookmark = async (id: number | undefined) => {
        try{
            if(id) bookmarkService.deleteBookmark(id)
            else bookmarks.set(bms.filter(b => b.id != id))
            notifications.success("Bookmark deleted",500);
        }   
        catch(e){
            notifications.danger("Error deleting bookmark",500);
        }
    }

</script>


<div class="wrapper">
    
<div class="settings">
    <span class="title">Bookmarks</span>
    {#each bms as bookmark}
            <div class="actions">
                <span class="action_title" >{bookmark.title}</span>
                {#if editing != bookmark.id}
                    <div class="bookmark_actions" >
                        <button class="edit" on:click={() => {editing = editing == bookmark.id ? undefined : bookmark.id}} >  <span class="material-symbols-outlined">edit</span> </button>
                        <button class="delete" on:click={() => {deleteBookmark(bookmark.id)}} >  <span class="material-symbols-outlined">delete</span> </button>
                    </div>
                {/if}
            </div>
        
        <div class="{editing == bookmark.id ? "bookmark_edit" : "bookmark_edit hidden"}">
            <BookmarkEdit bookmark={bookmark} on:save={() => {editing = undefined}} on:discard={() => {editing = undefined}} />
        </div>
    {/each}
    <button class="action_button" on:click={() => {editing = -1}} style="align-self:flex-end; margin-right:10px" >Add</button>
    {#if editing == -1}
        <div class="bookmark_edit">
            <BookmarkEdit on:save={() => {editing = undefined}} on:discard={() => {editing = undefined}}  bookmark={{title: "", links:[], color:"#000000"}} />
        </div>
    {/if}
</div>
<div class="settings">
    <span class="title">Spotify</span>
    <div class="actions">
        <span class="action_title">Time Range</span>
        <select class="action_button" bind:value={timeRange} on:change={() => {spotifyService.term.set(timeRange)}}>
            <option value="short_term">Last month</option>
            <option value="medium_term">Last 6 months</option>
            <option value="long_term">Lifetime</option>
        </select>
        
    </div>
</div>
<div class="settings">
    <span class="title">Bottom Container</span>
    <div class="actions">
        <span class="action_title">Type</span>
        <select class="action_button" bind:value={bottomContainerType} on:change={() => {bottomComponent.set(bottomContainerType)}}>
            <option value="potd">NASA POTD</option>
            <option value="single-image">Image</option>
            <option value="none">None</option>
        </select>
    </div>
    {#if bottomContainerType == "single-image"}
        
    <div class="actions">
        <span class="action_title">Image</span>
        <button class="action_button" on:click={() => {document.getElementById('bottom_image')?.click()}}>Upload</button>
    </div>
    {/if}
</div>
<div class="settings">
    <span class="title">Background</span>
    <div class="actions">
        <span class="action_title">Background Image</span>
        <button class="action_button" on:click={() => {document.getElementById('background_image')?.click()}}>Upload</button>
    </div>
</div>
<div class="settings">
    <span class="title">Themes</span>
    {#each currentThemes as theme}
        <div class="actions">
            <span class="action_title">{theme.title}</span>
            <div>
                <button class="action_button" on:click={() => {applyTheme(theme.id)}}>Load</button>
                <button class="action_button" on:click={() => {deleteTheme(theme.id)}}>Delete</button>
            </div>
        </div>
    {/each}
    <div class="actions">
        <span class="action_title">Save current Theme</span>
        <button class="action_button" on:click={() => {handleCreateTheme()}}>Save</button>
    </div>  
</div>
<div class="settings">
    <span class="title">Colors</span>
    <div class="actions_list">
        {#each Object.keys(colors) as color}
            <div class="actions" style="align-items: center;">
                <span class="action_title">{getReadableString(color)}</span>
                <div class="color_picker">
                    <ColorInput bind:color={colorsConstructor[color]} showAlphaSlider title={colorsConstructor[color].toHex8String()} />
                </div>
            </div>
        
        {/each}
    </div>
    <div class="actions" style="justify-content: flex-end; gap: 5px;">
        <button class="action_button" on:click={updateColors}>Update</button>
        <button class="action_button" on:click={discardChanges}>Discard</button>
        <button class="action_button" on:click={restoreDefaults}>Restore Defaults</button>
    </div>
</div>


<input type="file" accept="image/*" id="background_image" bind:files={backgroundImage} on:change={setBackgroundImage} style="display: none;" />
<input type="file" accept="image/*" id="bottom_image" bind:files={bottomImage} on:change={setBottomImage} style="display: none;" />
</div>

<style lang="scss">
    .wrapper {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
        overflow: auto;
		position: relative;
        gap: 10px;
        padding: 10px;
	}

    .settings{
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        width: 100%;
        height: fit-content;
        border: 1px solid var(--border-color);
        border-radius: 5px;
        padding: 5px;
        gap: 5px;
        &:hover{
            border-color: var(--border-color-hover);
        }

        .title{
            font-size: 1rem;
            font-weight: 600;
            color: var(--text-color-accent);
        }
        
        .actions_list{
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;
            width: 100%;
            gap: 5px;
        }

        .actions{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            width: 100%;
            padding-right: 10px;
             .action_title{
                line-height: 1.5rem;
                font-size: 0.8rem;
                font-weight: 600;
                color: var(--text-color);
             }
             
        }

        .color_picker{
            width: 45%;
        }
    }
    .action_button{
                margin: 5px 0px;
                background-color: var(--button-color);
                color: var(--button-text-color);
                border: none;
                border-radius: 5px;
                padding: 5px;
                font-size: 0.8rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease-in-out;
                &:hover{
                    background-color: var(--button-color-hover);
                    color: var(--button-text-color-hover);
                }
             }

    .bookmark_actions{
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
    .bookmark_edit{
        transition: height 0.5s ease-in-out;
        max-height:15em;
        height: clamp(0px, 100%, 15em);
        width: 100%;
         overflow: auto;
    }

    .hidden{
        height: 0px;
        max-height:0em;
        padding: 0px;
        margin: 0px;
        overflow: hidden;
        transition: all 0.5s ease-in-out;
    }

</style>