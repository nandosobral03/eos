<script lang="ts">
	import type { Bookmark, Note, RSSProvider } from "$lib/models/ServerData";
	import { bookmarks, notes, refreshBackground, rss } from "$lib/stores/stores";
	import Multicomponent from "./MultiComponent.svelte";
    import Rssfeed from "./RSSFeed.svelte";
    import Toast from "./common/toast.svelte";
	import BottomComponent from "./bottomComponent.svelte";
	import { onMount } from "svelte";
    export let data:{
        rss: Array<RSSProvider>
        notes: Array<Note>
        bookmarks: Array<Bookmark>       
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
            console.log(n)
            const response = fetch('/settings/background');
            response.then(async (res) => {
                backgroundBlob = await res.blob();
                const url = URL.createObjectURL(backgroundBlob);
                document.getElementById('main')!.style.backgroundImage = `url(${url})`;
            })
        })
        setUserColors();


    })  

    const setUserColors = () => {
        const colorsString = localStorage.getItem("colors");
        if(!colorsString) return;
        const colors = JSON.parse(colorsString);
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

</script>
<main class="main" id="main">
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