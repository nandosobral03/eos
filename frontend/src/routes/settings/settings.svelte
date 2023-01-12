<script lang="ts">
	import { refreshBackground, refreshBottom } from "$lib/stores/stores";
	import axios from "axios";
	import { onMount } from "svelte";
    import { Color, ColorInput } from 'color-picker-svelte'
	
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
    //object with all the same properties but every color is created with the new Color() consturctor
    let colors = defaultColors
    $: colorsConstructor = Object.entries(defaultColors).reduce((acc, [key, value]) => ({ ...acc, [key]: new Color(value) }), {}) as any;
    onMount(() => {
        let col = localStorage.getItem("colors")
        if(col){
            colors = JSON.parse(col);
        }else{
            localStorage.setItem("colors", JSON.stringify(defaultColors));
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
        colors = Object.entries(colorsConstructor).reduce((acc, [key, value]:any) => ({ ...acc, [key]: value.toHex8String() }), {}) as any;
        console.log(colors);
        localStorage.setItem("colors", JSON.stringify(colors));
        document.documentElement.style.setProperty('--background-color', colors.background);
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

</script>


<div class="wrapper">
    
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
             .action_button{
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
        }

        .color_picker{
            width: 45%;
        }
    }


</style>