<script lang="ts">
	import Bookmarks from "./bookmarks/bookmarks.svelte";
	import Tracker from "./multicomponent-components/tracker.svelte";
    import Settings from "./multicomponent-components/settings.svelte";
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
        color: white;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        flex-grow: 1;
        
    }
    .top-options{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        gap: 20px;
        width: 100%;
        height: 10%;
        border-bottom: 2px solid var(--gray-color);
    }

    .option{
        background-color: var(--gray-color);
        width: 1rem;
        height: 1rem;
        border-radius: 50%;
        cursor: pointer;
        transition: 0.1s;
        &.active{
            background-color: var(--orange-color);
            transition: 0ms;
        }
        &:hover{
            background-color: var(--green-color);
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
        width: 100%;
        flex-grow: 1;
    }

</style>
