<script lang="ts">
	import type { Bookmark, Note, RSSProvider } from "$lib/models/ServerData";
	import { bookmarks, bottomComponent, notes, refreshBackground, rss } from "$lib/stores/stores";
	import Multicomponent from "./MultiComponent.svelte";
    import Rssfeed from "./rss/RSSFeed.svelte";
    import Toast from "./common/toast.svelte";
	import BottomComponent from "./bottom_container/bottomComponent.svelte";
	import { onMount } from "svelte";
    export let data:{
        rss: Array<RSSProvider>
        notes: Array<Note>
        bookmarks: Array<Bookmark> 
        access_token?: string
        refresh_token?: string   
        expires_in?: number   
    };
    notes.set(data.notes);
    bookmarks.set(data.bookmarks);
    rss.set(data.rss);
    
    

    let backgroundBlob: Blob;
    onMount(async () => {
        const response = await fetch('/settings/background');
        backgroundBlob = await response.blob();
        const url = URL.createObjectURL(backgroundBlob);
        document.getElementById('main')!.style.backgroundImage = `url(${url})`;
        refreshBackground.subscribe(n => {
            const response = fetch('/settings/background');
            response.then(async (res) => {
                backgroundBlob = await res.blob();
                const url = URL.createObjectURL(backgroundBlob);
                document.getElementById('main')!.style.backgroundImage = `url(${url})`;
            })
        })
        setUserSettings();
        setUserColors();
        if(data.access_token) localStorage.setItem("access_token", data.access_token);
        if(data.refresh_token) localStorage.setItem("refresh_token", data.refresh_token);
        if(data.expires_in) {
            localStorage.setItem("expires_at", (new Date().getTime() + data.expires_in * 1000).toString());
        }
        window.history.pushState({}, document.title, window.location.pathname);
    })  

    const setUserSettings = () =>{
        setUserColors();
        let settings = localStorage.getItem("settings");
        if(!settings) return;
        let parsed = JSON.parse(settings);
        console.log(parsed)
        if(parsed?.bottomComponent){
            bottomComponent.set(parsed.bottomComponent);
            
        }
    }

    const setUserColors = () => {
        document.getElementById("main")?.classList.remove("displayNoneInside");
        const colorsString = localStorage.getItem("colors");
        if(!colorsString) return;
        const colors = JSON.parse(colorsString);
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

</script>
<main class="main displayNoneInside" id="main">
    <Rssfeed/>
    <div class="right-component">
        <Multicomponent/>
        <BottomComponent/>
    </div>
    <Toast />
</main>

<style lang="scss">
    .main{
        height: clamp(600px, 100vh, 100vh);
        width: clamp(1000px, 100vw, 100vw);
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 40px;
        overflow: auto;
    }

    .right-component{
        width: clamp(300px, 40vw, 450px);
        height: clamp(500px, 90vh, 800px);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 20px;
    }

</style>