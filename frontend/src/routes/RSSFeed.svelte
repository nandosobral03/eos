<script lang="ts">
	import type { Entry, RSS } from '$lib/models/RSS';
	import type { RSSProvider } from '$lib/models/ServerData';
	import customMappers from '$lib/RSSCustomMappers';
	import RSSSettings from './rss/RSSSettings.svelte'
	import { rss } from '$lib/stores/stores';
	import { onMount } from 'svelte';
	import { rssService } from '$lib/rss';
	let urls: Array<RSSProvider> = [];
	let currentTab = 'rss';
	let loading = true;
	let rssfeed: Entry[] = [];
	onMount(async () => {
		rss.subscribe((r) => {
			urls = r;
			loadRSSFeed();
		});
		loadRSSFeed();
	});


	const loadRSSFeed = async () => {
		const { read } = await import('@extractus/feed-extractor');
		const allFeeds = (
			await Promise.allSettled(
				urls.map(async (r: RSS) => {
					const feed = await read(r.url);
					let entries =
						feed.entries?.map((e: any) => {
							return {
								...e,
								image: r.image
							};
						}) || [];
					//Check for custom mapper
					if (customMappers[r.url]) {
						entries = entries?.map(customMappers[r.url]);
					}

					return entries;
				})
			)
		)
		.filter((p) => p.status === 'fulfilled').map((p: any) => p.value)
			.flat()
			.sort((a: Entry, b: Entry) => {
				return new Date(b.published).getTime() - new Date(a.published).getTime();
			})
			.filter((e: Entry) => {
				// only keep the ones published in the last 24 hours
				const now = new Date();
				const published = new Date(e.published);
				const diff = now.getTime() - published.getTime();
				const diffHours = diff / (1000 * 3600);
				return diffHours < 24;
			}) || [
			{
				title: 'No feeds found',
				link: '',
				published: '',
				description: '',
				image: ''
			}
		];
		loading = false;
		rssfeed = allFeeds;
	};

	const getTimeAgo = (d: Date) => {
		const now = new Date();
		const diff = now.getTime() - d.getTime();
		const diffHours = diff / (1000 * 3600);
		if (diffHours < 1) {
			return Math.floor(diff / (1000 * 60)) > 1
				? `${Math.floor(diff / (1000 * 60))} minutes ago`
				: 'Just now';
		} else if (diffHours < 24) {
			return Math.floor(diffHours) > 1 ? `${Math.floor(diffHours)} hours ago` : 1 + ' hour ago';
		} else {
			return `yesterday`;
		}
	};
</script>

<div class="container">
	<div class="header">
		<div class="options" class:active={currentTab === 'rss'} on:click={() => (currentTab = 'rss')} on:keydown={(e) => { if (e.key === 'Enter') currentTab = 'rss'; }}>
			<span class="material-symbols-outlined"> rss_feed </span>
		</div>
		<div class="options" class:active={currentTab === 'settings'} on:click={() => (currentTab = 'settings')} on:keydown={(e) => { if (e.key === 'Enter') currentTab = 'settings'; }}>
			<span class="material-symbols-outlined"> settings </span>
		</div>
	</div>
	{#if currentTab === 'rss'}
		{#if loading}
			<div class="loading">
				<img src="./spinner.svg" alt="loading" />
			</div>
		{:else}
			{#each rssfeed as feed}
				<div
					class="entry"
					on:click={() => window.open(feed.link)}
					on:keydown={(e) => {
						if (e.key === 'Enter') window.open(feed.link);
					}}
				>
					<div class="image">
						<img src={feed.image} alt="rss-logo" class="rss-image" />
					</div>
					<div class="info">
						<span class="title">{feed.title}</span>
						<span class="date"> {getTimeAgo(new Date(feed.published))}</span>
					</div>
				</div>
			{/each}
		{/if}
	{:else}
		<RSSSettings providers={urls} />
	{/if}
</div>

<style lang="scss">
	.container {
		background-color: var(--background-color);
		color: var(--text-color);
		display: flex;
		flex-direction: column;
		align-items: center;
		width: clamp(300px, 35vw, 450px);
		height: clamp(500px, 90vh, 800px);
		gap: 10px;
		padding: 10px 0px;
		padding-left: 10px;
		overflow-y: scroll;
		font-family: 'Hanken Grotesk', sans-serif;
	}

	.entry {
		width: calc(95% - 20px);
		height: 200px;
		background-color: var(--gray-color);
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: flex-start;
		gap: 10px;
		padding: 10px;
		transition: background-color 0.2s ease-in-out;
		box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
		cursor: pointer;
		&:hover {
			background-color: var(--cyan-color);
		}
		&:first-child {
			margin-top: 10px;
		}
		&:last-child {
			margin-bottom: 10px;
		}
	}

	.image {
		width: 70px;
		max-height: 70px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.rss-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.info {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 10px;
	}

	.title {
		font-size: 1rem;
		font-weight: bold;
	}

	.date {
		font-size: 0.8rem;
		align-self: flex-end;
	}

	.loading {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 90%;
		height: 90%;
        img{
            width: 50%;
            aspect-ratio: 1/1;
            animation: spin 1s linear infinite;
        }
	}

	.header {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		width: 100%;
		min-height: 20px;
		background-color: transparent;
	}

	.options {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 20px;
		height: 20px;
		margin-right: 5px;
		background-color: var(--gray-color);
		text-align: center;
		border-radius: 25%;
		cursor: pointer;
		&.active {
			background-color: var(--orange-color);
		}
		&:hover {
			background-color: var(--green-color);
		}
		

		.material-symbols-outlined {
			font-variation-settings: 'FILL' 0, 'wght' 500, 'GRAD' 0, 'opsz' 48;
			font-size: 15px;
			margin: auto;
			user-select: none; /* Non-prefixed version, currently
							supported by Chrome and Opera */
		}
	}
</style>
