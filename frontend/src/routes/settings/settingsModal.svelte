<script lang="ts">
	import { onMount } from "svelte";
	import RssSettings from "../rss/RSSSettings.svelte";
	import BookmarkSettings from "./bookmarkSettings.svelte";
	import BottomComponentSettings from "./bottomComponentSettings.svelte";
	import SpotifySettings from "./spotifySettings.svelte";
	import StyleSettings from "./styleSettings.svelte";
	import TabsSettings from "./tabsSettings.svelte";
    export let showModal = false;

    let options = [
        {
            name:"style",
            component: StyleSettings
        },
        {
            name:"tabs",
            component: TabsSettings
        },
        {
            name: "RSS",
            component: RssSettings
        },
        {
            name: "bookmarks",
            component: BookmarkSettings
        },
        {
            name: "spotify",
            component: SpotifySettings
        },
        {
            name: "bottom container",
            component: BottomComponentSettings
        }
    ] 
    let selected = options[0];
    onMount(() => {
        let modal = document.getElementById("modal")!;
        document.addEventListener("keydown", (e) => {
            if (e.key === "`" || e.key === "|") {
                showModal = !showModal;
                window.setTimeout(() => modal?.focus(), 0);
            }
            if (e.ctrlKey && e.key === "Enter") {
                showModal = false;
            }
            if(e.key === "Escape"){
                showModal = false;
            }
        });
    })

    const capitalize = (tab: string) => {
        return tab.split(" ").map(w => w[0].toUpperCase() + w.slice(1)).join(" ")
    }

</script>

<div class="modal" style:display={showModal ? "flex" : "none"} id="modal">
    <div class="settings-sidebar">
        {#each options as option}
             <div class="option" on:click={() => selected = option} on:keydown={(e) => {
                 if(e.key === "Enter"){
                     selected = option;
                 }}} class:active={option.name == selected.name}>
                { capitalize(option.name)}
             </div>

        {/each}
    </div>
    <div class="settings">
        {#each options as option}
            {#if option.name === selected.name}
                <svelte:component this={option.component} />
            {/if}
        {/each}
    </div>
</div>

<style lang="scss">
    .modal{
        position: fixed;
        width: clamp(600px, 50vw, 800px);
        min-width: 600px;
        max-width: 800px;
        aspect-ratio: 14/9;
        background-color: var(--background-color-opaque);
        z-index: 100;
        border-radius: 5px;
        padding: 5px;
        box-shadow: 2px 2px 5px -1px var(--shadow-color)
        
    }

   

    .settings-sidebar{
        width: 25%;
        height: 100%;
        overflow: auto;
        border-right: 1px solid var(--accent-color);
        color: var(--text-color);
        display: flex;
        flex-direction: column;
        gap: 15px;
        padding: 10px 0px;
        margin: 10px 0px;
        .option{
            width: auto;
            height: 10%;
            display: flex;
            align-items: center;
            border-radius: 5px;
            padding: 10px;
            margin: 0px 5px;
            cursor: pointer;
            &:hover{
                background-color: var(--accent-color);
                color: var(--text-color)
            }

        }

    }
    .settings{
        flex-grow: 1;
        min-height: 100%;
    }

   
    .active{
        background-color: var(--accent-color-hover) !important;
        color: var(--text-color-hover) !important;
    }



    @media only screen and (max-width: 800px) {
        .modal{
            top: 50px;
            width: 90%;
            height: 90%;
            min-width: unset;
            min-height: unset;

            flex-direction: column;
        }
        .settings-sidebar{
            flex-direction: row;
            display: flex;
            justify-content: space-evenly;
            width: 100% !important;
            flex-wrap: wrap;
            height: 20%;

            border-right: none;
            border-bottom: 1px solid var(--accent-color);
            .option{
                width: fit-content;
                display: flex;
               justify-content: center;
                min-width: 25%;
                margin: 0px;
                font-size: 0.8rem;
            }
        }
        .settings{
            height: 80%;
            min-height: 80%;
            flex-grow: 1;
        }
    }
</style>