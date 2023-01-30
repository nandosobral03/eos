<script lang="ts">
	import { onMount } from "svelte";
	import TabsSettings from "./tabsSettings.svelte";
    let showModal = false;

    let options = [
        {
            name:"style",
        },
        {
            name:"tabs"
        },
        {
            name: "RSS"
        },
        {
            name: "bookmarks"
        },
        {
            name: "spotify"
        },
        {
            name: "bottom container"
        }
    ] 

    onMount(() => {
        let modal = document.getElementById("modal")!;
        document.addEventListener("keydown", (e) => {
            if (e.key === "`") {
                showModal = !showModal;
                window.setTimeout(() => modal?.focus(), 0);
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
             <div class="option">
                { capitalize(option.name)}
             </div>

        {/each}
    </div>
    <div class="settings">
        <TabsSettings/>
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
    }

    .settings-sidebar{
        width: 25%;
        height: 100%;
        overflow: auto;
        border-right: 1px solid var(--border-color);
        color: var(--text-color);
        display: flex;
        flex-direction: column;
        gap: 15px;
        padding: 10px 0px;
        .option{
            height: 10%;
            display: flex;
            align-items: center;
            border-radius: 5px;
            background-color: var(--accent-color);
            padding: 10px;
            margin: 0px 5px;
            cursor: pointer;
            &:hover{
                background-color: var(--accent-color-hover);
                color: var(--text-color-hover)
            }

        }

    }
    .settings{
        flex-grow: 1;
        height: 100%;
    }

   


</style>