<script lang="ts">
	import { refreshBackground, refreshBottom } from "$lib/stores/stores";
	import axios from "axios";
	import { onMount } from "svelte";
    let backgroundImage: FileList; 
    let bottomImage: FileList;
    let colors: any = {
        text: "#ffffff",	
        background: "#2f343f",
        backgroundAccent: "#4b5262",
        generic: [
            "#bf616a",
            "#a3be8c",
            "#ebcb8b",
            "#b48ead",
            "#88c0d0",
            "#d08770",
        ]
    };
    onMount(() => {
        if(localStorage.getItem("colors")){
            colors = JSON.parse(localStorage.getItem("colors")!);
        }else{
            localStorage.setItem("colors", JSON.stringify(colors));
        }
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

    const updateColors = () => {
        localStorage.setItem("colors", JSON.stringify(colors));
        document.documentElement.style.setProperty('--text-color', colors.text);
        document.documentElement.style.setProperty('--background-color', colors.background);
        document.documentElement.style.setProperty('--background-accent-color', colors.backgroundAccent);
        document.documentElement.style.setProperty('--generic-0-color', colors.generic[0]);
        document.documentElement.style.setProperty('--generic-1-color', colors.generic[1]);
        document.documentElement.style.setProperty('--generic-2-color', colors.generic[2]);
        document.documentElement.style.setProperty('--generic-3-color', colors.generic[3]);
        document.documentElement.style.setProperty('--generic-4-color', colors.generic[4]);
        document.documentElement.style.setProperty('--generic-5-color', colors.generic[5]);
    }

    const restoreDefaults = () => {
        colors = {
            text: "#ffffff",	
            background: "#2f343f",
            backgroundAccent: "#4b5262",
            generic: [
                "#bf616a",
                "#a3be8c",
                "#ebcb8b",
                "#b48ead",
                "#88c0d0",
                "#d08770",
            ]
        }
        updateColors();
    }
    const discardChanges = () => {
        colors = JSON.parse(localStorage.getItem("colors")!);
        updateColors();
    }

</script>


<div class="wrapper">
    
<div class="settings">
    <span class="title">Colors</span>
    <div class="actions_list">
        <div class="actions">
            <span class="action_title">Text</span>
            <div class="color_picker">
                <input type="color" bind:value={colors.text}>
            </div>
        </div>
        <div class="actions">
            <span class="action_title">Background</span>
            <div class="color_picker">
                <input type="color" bind:value={colors.background}>
            </div>
        </div>
        <div class="actions">
            <span class="action_title">Background Accent</span>
            <div class="color_picker">
                <input type="color" bind:value={colors.generic[0]}>
            </div>
        </div>
        <div class="actions">
            <span class="action_title">Generic 1</span>
            <div class="color_picker">
                <input type="color" bind:value={colors.generic[1]}>
            </div>
        </div>
        <div class="actions">
            <span class="action_title">Generic 2</span>
            <div class="color_picker">
                <input type="color" bind:value={colors.generic[2]}>
            </div>
        </div>
        <div class="actions">
            <span class="action_title">Generic 3</span>
            <div class="color_picker">
                <input type="color" bind:value={colors.generic[3]}>
            </div>
        </div>
        <div class="actions">
            <span class="action_title">Generic 4</span>
            <div class="color_picker">
                <input type="color" bind:value={colors.generic[4]}>
            </div>
        </div>
        <div class="actions">
            <span class="action_title">Generic 5</span>
            <div class="color_picker">
                <input type="color" bind:value={colors.generic[5]}>
            </div>
        </div>
    </div>
    <div class="actions">
        <button class="action_button" on:click={updateColors}>Update</button>
        <button class="action_button" on:click={discardChanges}>Discard</button>
        <button class="action_button" on:click={restoreDefaults}>Restore Defaults</button>
    </div>


</div>
<div class="settings">
    <span class="title">Bookmarks</span>
</div>
<div class="settings">
    <span class="title">Image</span>
    <div class="actions">
        <span class="action_title">Image</span>
        <button class="action_button" on:click={() => {document.getElementById('bottom_image')?.click()}}>Upload</button>
    </div>
</div>
<div class="settings">
    <span class="title">Background</span>
    <div class="actions">
        <span class="action_title">Background Image</span>
        <button class="action_button" on:click={() => {document.getElementById('background_image')?.click()}}>Upload</button>
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
		max-height: clamp(180px, 38vh, 290px);
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
        border: 1px solid var(--orange-color);
        border-radius: 5px;
        padding: 5px;
        gap: 5px;
        .title{
            font-size: 1rem;
            font-weight: 600;
            color: var(--orange-color);
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
                color: var(--orange-color);
             }
             .action_button{
                background-color: var(--orange-color);
                color: var(--text-color);
                border: none;
                border-radius: 5px;
                padding: 5px;
                font-size: 0.8rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease-in-out;
                &:hover{
                    background-color: var(--green-color);
                }
             }
        }
    }


</style>