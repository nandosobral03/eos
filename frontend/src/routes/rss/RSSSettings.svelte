<script lang="ts">
	import type { RSSProvider } from '$lib/models/ServerData';
	import { rssService } from '$lib/rss';
	import { rss } from '$lib/stores/stores';
	import RssProvider from './RSSProvider.svelte';

	let providers: Array<RSSProvider>;
	let providersCopy: Array<RSSProvider>;
	let massAdding: boolean = false;
	let massAddingText: string = '';
	let adding: boolean = false;
	let newProvider: RSSProvider = {
		url: '',
		image: ''
	};

	let loading = true;
	rssService.loading.subscribe((value) => {
		loading = value;
	});

	const massCreate = () => {
		massAdding = true;
	};

	const handleMassCreate = () => {
		const urls = massAddingText
			.split('\n')
			.map((s) => s.trim())
			.filter((url) => url !== '');
		rssService.massCreateRSSProviders(urls);
		massAdding = false;
		massAddingText = '';
	};

	rss.subscribe((value) => {
		providers = value;
		providersCopy = [...value];
	});
</script>

<div class="wrapper">
	{#if loading}
		<div class="spinner">
			<img src="./spinner.svg" alt="loading" />
		</div>
	{/if}
	{#if providers.length === 0 && !adding}
		<div class="no-providers">
			<img src="./rss.svg" alt="no providers" class="empty-state" />
			<h2>No providers</h2>
		</div>
	{/if}
	<div class="provider-list">
		{#each providers as provider}
			<RssProvider {provider} on:close={() => (providers = providersCopy)} />
		{/each}
		{#if adding}
			<RssProvider provider={newProvider} editing={true} on:close={() => (adding = false)} />
		{/if}
        <button
            class="add"
            on:click={() => {
                adding = true;
            }}
        >
            <span class="material-symbols-outlined">add</span>
        </button>
        <button class="add massCreate" on:click={() => massCreate()}>Mass Create</button>
	</div>

    
	{#if massAdding}
		<div class="modal">
			<div class="modal-top">
				<span class="title"> Mass Create </span>
				<span
					class="material-symbols-outlined close"
					on:click={() => (massAdding = false)}
					on:keydown={(e) => e.preventDefault()}>close</span
				>
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
	.title {
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--text-color);
		margin-bottom: 10px;
	}

	.wrapper {
		border-radius: 5px;
		display: flex;
		flex-direction: column;
		padding: 15px;
		color: var(--text-color);
		height: 100%;
		gap: 10px;
		overflow: auto;
	}

    .provider-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-items: center;
    }

    .add{
        background: var(--button-color);
        color: var(--button-text-color);
        border: none;
        border-radius: 5px;
        padding: 5px 10px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: 0.2s;
        width: 30%;
        line-height: 1.5rem;
        &:hover{
            background: var(--button-color-hover);
            color: var(--button-text-color-hover);
        }
    }

    .massCreate{
        background: var(--button-text-color);
        color: var(--button-color);
        &:hover{
            background: var(--button-text-color-hover);
            color: var(--button-color-hover);
        }
    }


    .modal{
        display: flex;
        border: 1px solid var(--border-color);
        flex-direction: column;
        padding: 15px;
        border-radius: 5px;
        font-size: 0.8rem;
        .modal-top{
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 1rem;
            .title{
                font-size: 1rem;
                font-weight: 500;
                color: var(--text-color);
            }
            .close{
                cursor: pointer;
                &:hover{
                    color: var(--danger-color);
                }
            }
        }

        textarea{
            width: 100%;
            height: 100px;
            border-radius: 5px;
            padding: 5px;
            margin: 10px 0;
            font-size: 0.8rem;
            resize: none;
            background-color: var(--accent-color);
            color: var(--text-color);
        }

        .modal-actions{
            display: flex;
            width: 100%;
            justify-content: flex-end;
            button{
                background: var(--button-color);
                color: var(--button-text-color);
                border: none;
                border-radius: 5px;
                padding: 5px 10px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: 0.2s;
                &:hover{
                    background: var(--button-color-hover);
                    color: var(--button-text-color-hover);
                }
            }
        }
    }
</style>
