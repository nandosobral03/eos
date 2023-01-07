<script lang="ts">
	import type { RSSProvider } from "$lib/models/ServerData";
	import RssProvider from "./RSSProvider.svelte";
    export let providers: Array<RSSProvider>;
</script>

<div class="settings">
    <div class="title">
        <h1>Providers</h1>
        <button class="add"> <span class="material-symbols-outlined">add</span> </button>
    </div>
    {#each providers as provider}
        <RssProvider provider={provider} />
    {/each}
</div>

<style lang="scss">
    .settings{
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        gap: 20px;
        padding: 5px 20px ;
    }
    
    .title{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        button{
            background-color: transparent;
            border: none;
            cursor: pointer;
            color: var(--color-text);
            width: 25px;
            height: 25px;
            &.add {
                border-radius: 50%;
                &:hover{
                    color: var(--green-color);
                }
                transition: 0.2s ease-in-out;
            }
        }
    }

</style>