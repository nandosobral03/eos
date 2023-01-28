<script lang="ts">
	import type { RSSProvider } from "$lib/models/ServerData";
	import { rssService } from "$lib/rss";
	import { rss } from "$lib/stores/stores";
	import RssProvider from "./RSSProvider.svelte";
    export let providers: Array<RSSProvider>;
    const providersCopy = providers.slice();
    let massAdding: boolean = false;
    let massAddingText: string = "";
    let adding: boolean = false;
    let newProvider: RSSProvider = {
        url: "",
        image: "",
    };

    let loading = true;
    rssService.loading.subscribe((value) => {
        loading = value;
    })

    const massCreate = () => {
        massAdding = true;
    }

    const handleMassCreate = () => {
        const urls = massAddingText.split("\n").map(s => s.trim()).filter((url) => url !== "");
        rssService.massCreateRSSProviders(urls);
        massAdding = false;
        massAddingText = "";
    }


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
    <button class="massCreate" on:click={() => massCreate()}>Mass Create</button>  
   
    {#if massAdding}
        <div class="modal">
            <div class="modal-top">
                <span class="title"> Mass Create </span>
                <span class="material-symbols-outlined close" on:click={() => massAdding = false} on:keydown={(e) => e.preventDefault()}>close</span>
            </div>    
                <p>Enter the urls of the rss feeds you want to add, separated by a new line</p>
                <textarea bind:value={massAddingText} />
                <div class="modal-actions">
                    <button on:click={() => handleMassCreate()}>Create</button>
                </div>
        </div>
    {/if}
    
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

    .massCreate{
        background-color: var(--button-color);
        color: var(--button-color-text);
        border: none;
        border-radius: 5px;
        padding: 5px 10px;
        cursor: pointer;
        &:hover{
            background-color: var(--button-color-hover);
        }
        transition: 0.2s ease-in-out;
    }

    .modal{
        animation: fadeIn 0.2s ease-in-out;
        background-color: var(--background-color);
        position: fixed;
        top: calc(50% - 250px);
        left: calc(50% - 250px);
        width: 500px;
        height: 500px;
        display: flex;
        padding: 20px;
        gap: 20px;
        border: 1px solid var(--border-color);
        box-shadow: 0 0 10px var(--border-color);
        flex-direction: column;


        textarea{
            flex-grow: 1;
            width: 100%;
            border: 1px solid var(--border-color);
            border-radius: 5px;
            padding: 10px;
            resize: none;
            background-color: transparent;
            color: var(--color-text);
        }


        .modal-top{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            .title{
                font-size: 1.5rem;
                font-weight: 500;
            }
            .close{
                cursor: pointer;
                &:hover{
                    color: var(--danger-color);
                }
                transition: 0.2s ease-in-out;
            }
        }
        .modal-actions{
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            align-items: center;
            gap: 10px;
            button{
                background-color: var(--button-color);
                color: var(--button-color-text);
                border: none;
                border-radius: 5px;
                padding: 5px 10px;
                cursor: pointer;
                &:hover{
                    background-color: var(--button-color-hover);
                }
                transition: 0.2s ease-in-out;
            }
        }
    }


</style>