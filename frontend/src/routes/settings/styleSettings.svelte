<script lang="ts">
	import { refreshBackground, themes } from "$lib/stores/stores";
	import axios from "axios";
	import { Color, ColorInput } from "color-picker-svelte";
	import { onMount } from "svelte";
    let defaultColors = {
        background: "#2f343f",
        shadowColor: "#000000",
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

    

    onMount(() => {
        let col = localStorage.getItem("colors")
        if(col){
            colors = JSON.parse(col);
        }else{
            localStorage.setItem("colors", JSON.stringify(defaultColors));
        }
        colorsConstructor = Object.entries(colors).reduce((acc, [key, value]) => ({ ...acc, [key]: new Color(value) }), {}) as any;
    })



    let colors = defaultColors
    let colorsConstructor = Object.entries(colors).reduce((acc, [key, value]) => ({ ...acc, [key]: new Color(value) }), {}) as any;
    let backgroundImage: FileList; 
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
                refreshBackground.update(n => n + 1);
            }
        }
    
    }
   
    const getReadableString = (str: string) => {
        return str.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase(); })
    }
    const updateColors = () => {
        colors = Object.entries(colorsConstructor).reduce((acc, [key, value]:any) => ({ ...acc, [key]: value.toHex8String() }), {}) as any;
        applyColors();
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


    const applyColors = () => {
        localStorage.setItem("colors", JSON.stringify(colors));

        document.documentElement.style.setProperty('--background-color', colors.background);
        document.documentElement.style.setProperty('--background-color-opaque', colors.background.slice(0,7));
        document.documentElement.style.setProperty('--shadow-color', colors.shadowColor);
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


    let currentThemes:{id:string,title:string, theme:any}[] = []
    
    themes.subscribe((value) => {
        currentThemes = value;
    })
</script>

<div class="wrapper">
   
    <div class="setting">
        <div class="setting-title">
            Background
        </div>
        <div class="setting-list">
            <div class="setting-item">
                <span class="setting-item-title">
                    Background image
                </span>
                <div class="setting-item-value">
                        <button class="action_button" on:click={() => {document.getElementById('background_image')?.click()}}>Upload</button>
                </div>
            </div>
        </div>
    </div>
    <div class="setting">
        <div class="setting-title">
            Themes
        </div>
        <div class="setting-list">
            {#each currentThemes as theme}
                <div class="setting-item">
                    <span class="setting-item-title">{theme.title}</span>
                    <div class="setting-item-value">
                        <button class="action_button" on:click={() => {applyTheme(theme.id)}}>Load</button>
                        <button class="action_button" on:click={() => {deleteTheme(theme.id)}}>Delete</button>
                    </div>
                </div>
            {/each}
            <div class="setting-item">
                <span class="setting-item-title">
                    Save current theme
                </span>
                <div class="setting-item-value">
                     <button class="action_button" on:click={() => {handleCreateTheme()}}>Save</button>
                </div>

            </div>
        </div>
    </div>

    <div class="setting">
        <div class="setting-title">
            Colors
        </div>
        <div class="setting-list">
            {#each Object.keys(colors) as color}
            <div class="setting-item">
                    <span class="setting-item-title">{getReadableString(color)}</span>
                    <div class="setting-item-value color_picker">
                        <ColorInput bind:color={colorsConstructor[color]} showAlphaSlider title={colorsConstructor[color].toHex8String()} />
                    </div>
                </div>
            {/each}
            <div class="setting-item">
                <span class="setting-item-title">
                </span>
                <div class="setting-item-value">
                    <button class="action_button" on:click={updateColors}>Update</button>
                    <button class="action_button" on:click={discardChanges}>Discard</button>
                    <button class="action_button" on:click={restoreDefaults}>Restore</button>
                </div>

            </div>
            </div>
    </div>

</div>


<input type="file" accept="image/*" id="background_image" bind:files={backgroundImage} on:change={setBackgroundImage} style="display: none;" />

<style lang="scss">

    .wrapper{
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        padding: 15px;
        color: var(--text-color);
        height: 100%;
        gap: 10px;
        overflow: auto;
    }

    .setting{
        border: 1px solid var(--accent-color);
        padding: 15px;
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        .setting-title{
            font-size: 1rem;
            font-weight: 500;
            margin-bottom: 10px;
        }
        .setting-list{
           display: flex;
           flex-direction: column;
           gap: 10px;
           width: 100%;
            .setting-item{
                width: 100%;
                display: flex;
                gap: 10px;
                justify-content: space-between;
                align-items: center;
                .setting-item-title{
                    font-size: 0.8rem;
                    font-weight: 300;
                }
                .setting-item-value{
                    display: flex;
                    gap: 5px;
                    font-size: 0.8rem;
                    font-weight: 400;
                }
            }
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
    .color_picker{
        width: 45%;
    }


    @media only screen and (max-width: 800px) {
        .wrapper{
            padding: 10px;
        }
        .setting{
            padding: 10px;
        }
        .setting-list{
            .setting-item{
                .setting-item-title{
                    flex-shrink: 1;
                    width: 30px;
                }
            }
        }
        .color_picker{
            width: 60% !important;
        }

    }
</style>