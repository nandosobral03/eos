<script lang="ts">
	import type { Bookmark, Note, RSSProvider } from "$lib/models/ServerData";
	import { bookmarks, bottomComponent, currentlyPlaying, notes, refreshBackground, rss, tabs, themes, tracked } from "$lib/stores/stores";
	import Multicomponent from "./MultiComponent.svelte";
    import Rssfeed from "./rss/RSSFeed.svelte";
    import Toast from "./common/toast.svelte";
	import BottomComponent from "./bottom_container/bottomComponent.svelte";
	import { onMount } from "svelte";
	import CurrentlyPlaying from "./spotify/currentlyPlaying.svelte";
	import { spotifyService } from "$lib/spotify";
	import type { Tracked } from "$lib/models/Tracker";
	import Searchbar from "./searchbar/searchbar.svelte";
	import SettingsModal from "./settings/settingsModal.svelte";
	import Login from "./login/login.svelte";
    export let data:{
        rss: Array<RSSProvider>
        notes: Array<Note>
        bookmarks: Array<Bookmark>
        tracked: Array<Tracked> 
        access_token?: string
        refresh_token?: string   
        expires_in?: number   
        background_url: string
    };
    notes.set(data.notes);
    bookmarks.set(data.bookmarks);
    rss.set(data.rss);
    tracked.set(data.tracked);
    let showModal = false;
    let playing: boolean;
    currentlyPlaying.subscribe(x => {
        playing = x
    });
    let loggedIn  = false;
    let backgroundBlob: Blob;

    const setup = async () => {
        const token = localStorage.getItem("token");
        if(!token){
            loggedIn = false;
        }else{
            loggedIn = true;
        }
        setUserSettings();
        const access_token = localStorage.getItem("access_token");
        const refresh_token = localStorage.getItem("refresh_token");
        const expires_at = localStorage.getItem("expires_at");
        const expiryDate = new Date(parseInt(expires_at!));
        let now = new Date();
        
        if(loggedIn && access_token && refresh_token && expiryDate < now){
            await spotifyService.refreshAccessToken(refresh_token)
        }

       
        document.getElementById('main')!.style.backgroundImage = `url(${data.background_url})`;
        refreshBackground.subscribe(n => {
            const response = fetch('/settings/background');
            setTimeout(() => {
                response.then(async (res) => {
                    console.log("Loaded full res")
                    backgroundBlob = await res.blob();
                    const url = URL.createObjectURL(backgroundBlob);
                    document.getElementById('main')!.style.backgroundImage = `url(${url}),url(${data.background_url})`;
                })
                
            }, 1000);
        })
        let themesStr = localStorage.getItem("themes") || "[]";
        let parsed = JSON.parse(themesStr);
        themes.set(parsed);

        if(data.access_token) localStorage.setItem("access_token", data.access_token);
        if(data.refresh_token) localStorage.setItem("refresh_token", data.refresh_token);
        if(data.expires_in) {
            localStorage.setItem("expires_at", (new Date().getTime() + data.expires_in * 1000).toString());
        }
        window.history.pushState({}, document.title, window.location.pathname);
    }

    onMount(setup);

    const setUserSettings = () =>{
        let playing = localStorage.getItem("allowCurrentlyPlaying");
        if(playing){
            currentlyPlaying.set(playing === "true");
        }else{
            currentlyPlaying.set(false);
            localStorage.setItem("allowCurrentlyPlaying", "false");
        }


        setUserColors();
        let settings = localStorage.getItem("settings");
        if(!settings) settings = "{}";
        let parsed = JSON.parse(settings);
        if(parsed?.bottomComponent){
            bottomComponent.set(parsed.bottomComponent);
        }else{
            bottomComponent.set("single-image");
        }
        if(parsed?.tabs){
            tabs.set(parsed.tabs)
        }else{
            const allTabs = [
                {
                    name:"bookmarks",
                    shown: true
                },
                {
                    name:"notes",
                    shown: true
                },
                {
                    name:"tracker",
                    shown: true
                },
                {
                    name:"spotify",
                    shown: true
                }
            ]
            tabs.set(allTabs)
        }
    }

    const setUserColors = () => {
        document.getElementById("main")?.classList.remove("displayNoneInside");
        const colorsString = localStorage.getItem("colors");
        if(!colorsString) return;
        const colors = JSON.parse(colorsString);
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
    }

</script>
<main class="main displayNoneInside" id="main">
    {#if loggedIn}
        
        <Rssfeed/>
        <div class="right-component">
            <Multicomponent/>
            <BottomComponent/>
        </div>
        <Searchbar/>
        <SettingsModal showModal={showModal}/>
        {#if playing}
            <CurrentlyPlaying/>
        {/if}
        <div class="options-button">
            <span class="material-symbols-outlined" on:click={() => {showModal = !showModal}} on:keydown={() => {showModal = !showModal}}>tune</span>
        </div>
        {:else}
         <Login on:login={()=> {loggedIn = true}}/>
    {/if}

    <Toast />

</main>

<style lang="scss">
    .main{
        height: clamp(600px, 100vh, 100vh);
        width: clamp(800px, 100vw, 100vw);
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

    .options-button{
        display: none;
    }



    .right-component{
        width: clamp(400px, 35vw, 450px);
        height: clamp(500px, 90vh, 800px);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 20px;
    }

    @media only screen and (max-width: 800px){
        .main{
            flex-direction: column-reverse;
            overflow: hidden;
            gap: 20px;
            width: 100%;
            height: 100%;
            overflow-y: scroll;
        }

        .right-component{
            margin-top: 50px;
            width: 90%;
            height: clamp(500px, 90vh, 800px);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            gap: 20px;
        }
        .options-button{
            display: block;
            position: absolute;
            top: 10px;
            right: 15px;
            color: var(--text-color);
            padding: 5px;
            padding-bottom: 0px;
            border-radius: 10px;
            cursor: pointer;
            background-color: var(--background-color);
        
    }
    }
</style>