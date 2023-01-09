<script lang="ts">
	import type { RSSProvider } from "$lib/models/ServerData";
	import { rssService } from "$lib/rss";
	import { rss } from "$lib/stores/stores";
	import RssProvider from "./RSSProvider.svelte";
    export let providers: Array<RSSProvider>;
    const providersCopy = providers.slice();
    
    let adding: boolean = false;
    let newProvider: RSSProvider = {
        url: "",
        image: "",
    };

    let loading = true;
    rssService.loading.subscribe((value) => {
        loading = value;
    })


</script>

<div class="settings">
    {#if loading}
        <div class="spinner">
            <img src="./spinner.svg" alt="loading" />
        </div>
    {/if}
    <div class="title">
        <h1>RSS Providers</h1>
        <button class="add" on:click={() => {adding = true;}}> <span class="material-symbols-outlined">add</span> </button>
    </div>
    {#if providers.length === 0 && !adding}
        <div class="no-providers">
            <img src="./rss.svg" alt="no providers" class="empty-state" />
            <h2>No providers</h2>
        </div>
        {/if}
    {#if adding}
        <RssProvider provider={newProvider} editing={true} on:close = {() => adding = false} />
    {/if}
    {#each providers as provider}
        <RssProvider provider={provider} on:close = {() => providers = providersCopy } />
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
        padding: 5px 10px ;
        position: relative;
        h1{
            font-size: 1.5rem;
            font-weight: 500;   
        }

        .no-providers{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            gap: 10px;
            h2{
                font-size: 1.5rem;
                font-weight: 500;
            }
            .empty-state{
                width: 65%;
                aspect-ratio: 1/1;
            }
        }    
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
                    color: var(--success-color);
                }
                transition: 0.2s ease-in-out;
            }
        }
    }

    .spinner{
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 100;
        background-color: rgba(0,0,0,0.5);
        img{
            width: 100%;
            aspect-ratio: 1/1;
            animation: spin 1s linear infinite;
        }
    }


</style>