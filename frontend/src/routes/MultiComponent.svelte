<script lang="ts">
	import Bookmarks from "./bookmarks/bookmarks.svelte";
	import Tracker from "./tracker/tracker.svelte";
    import Notes from "./notes/notes.svelte";
    import Spotify from "./spotify/spotify.svelte";
	import { tabs } from "$lib/stores/stores";
  

    let options = [
        {
            name: "bookmarks",
            component: Bookmarks
        },
        {
            name: "notes",
            component: Notes
        },
        {
            name: "tracker",
            component: Tracker
        },
        {
            name: "spotify",
            component: Spotify
        },
      
    ];
    let currentOptions = options
    let active = "bookmarks";
    tabs.subscribe( x => {
        console.log(x);
        currentOptions = options.filter(op => x.some(y => y.name == op.name && y.shown )).sort((a,b) => x.findIndex(y => y.name == a.name) - x.findIndex(y => y.name == b.name))
        if(!currentOptions.some(op => op.name == active)){
            if(currentOptions.length > 0){
                active = currentOptions[0].name
            }
        }
    })

</script>

{#if currentOptions.length > 0}
<div class="container">
    {#if currentOptions.length > 1}
        <div class="top-options">
            {#each currentOptions as option}
                <div class="option" 
                    class:active={option.name === active} 
                    on:click={() => active = option.name} 
                    on:keydown={(e) => {
                        if(e.key === "Enter"){
                            active = option.name;
                        }
                    }}></div>
            {/each}
        </div>
    {/if}

        <div class="content">
            {#each currentOptions as option}
                {#if option.name === active}
                    <svelte:component this={option.component} />
                {/if}
            {/each}
        </div>
    </div>
{/if}

<style lang="scss">
    .container{
        background-color: var(--background-color);
        color: var(--text-color);
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        height: 45%;
        flex-grow: 1;
        border-radius: 5px;
		box-shadow: 2px 2px 5px 0px var(--shadow-color)
    }
    .top-options{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        gap: 20px;
        width: 100%;
        height: 50px;
        max-height: 50px;
        min-height: 50px;
        border-bottom: 1px solid var(--border-color);
    }

    .option{
        background-color: var(--icon-background);
        color: var(--icon-color) !important;
        width: 1rem;
        height: 1rem;
        border-radius: 50%;
        cursor: pointer;
        transition: 0.1s;
        &.active{
            background-color: var(--icon-background-active);
            color: var(--icon-color-active) !important;
            transition: 0ms;
        }
        &:hover{
            background-color: var(--icon-background-hover);
            color: var(--icon-color-hover) !important;
            transition: 0.1s;

        }
        &:first-child{
            margin-left: 20px;
        }
    }

    .content{
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        overflow: auto;
        width: 100%;
        height: 100%;
        flex-grow: 1;
    }

</style>
