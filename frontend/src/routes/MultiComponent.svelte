<script lang="ts">
	import Bookmarks from "./bookmarks/bookmarks.svelte";
	import Tracker from "./tracker/tracker.svelte";
    import Settings from "./settings/settings.svelte";
    import Notes from "./notes/notes.svelte";
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
            name: "settings",
            component: Settings
        },
        
        ];
    let active = "bookmarks";
</script>

<div class="container">
    <div class="top-options">
        {#each options as option}
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
    <div class="content">
        {#each options as option}
            {#if option.name === active}
                <svelte:component this={option.component} />
            {/if}
        {/each}
    </div>
</div>
<style lang="scss">
    .container{
        background-color: var(--background-color);
        color: var(--text-color);
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        max-height: 45%;
        min-height: 45%;
        flex-grow: 1;
        
    }
    .top-options{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        gap: 20px;
        width: 100%;
        height: 12%;
        max-height: 12%;
        min-height: 12%;
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
        flex-grow: 1;
    }

</style>
