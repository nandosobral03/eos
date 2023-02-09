<script lang="ts">
	import type { Entry, RSS } from '$lib/models/RSS';
	import type { RSSProvider } from '$lib/models/ServerData';
	import customMappers from '$lib/RSSCustomMappers';
	import RSSSettings from './RSSSettings.svelte'
	import { rss } from '$lib/stores/stores';
	import { onMount } from 'svelte';
	import { rssService } from '$lib/rss';
	let urls: Array<RSSProvider> = [];
	let loading = true;
	let rssfeed: Entry[] = [];
	onMount(async () => {
		rss.subscribe((r) => {
			urls = r;
			loadRSSFeed();
		});
	});

	const loadRSSFeed = async () => {
		rssfeed = [];
		const { read } = await import('@extractus/feed-extractor');
		await Promise.allSettled(
			urls.map(async (r: RSS) => {
				const feed = await read(r.url, {
					getExtraEntryFields: (feedEntry:any) => {
						const { updated,published } = feedEntry;
						return {
							publishedYT: published || undefined,
							updated: updated ? updated : feedEntry.published 
						};
					}
				}
				);
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
				
				const filtered = entries.slice(0, 10).filter((e: Entry) => {
					const now = new Date();
					const published = new Date(e.publishedYT || e.published);
					const diff = now.getTime() - published.getTime();
					const diffHours = diff / (1000 * 3600);
					return diffHours < 24;
				});
				const sorted = filtered.sort((a: Entry, b: Entry) => {
					const aDate = new Date(a.published);
					const bDate = new Date(b.published);
				
					return bDate.getTime() - aDate.getTime();
				});

				rssfeed = rssfeed.concat(sorted).sort((a: Entry, b: Entry) => {
					const aDate = new Date(a.published);
					const bDate = new Date(b.published);
				
					return bDate.getTime() - aDate.getTime();
				});
				loading = false;
			})
		)
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
</div>

<style lang="scss">
	.container {
		background-color: var(--background-color);
		color: var(--text-color);
		display: flex;
		flex-direction: column;
		align-items: center;
		width: clamp(300px, 35vw, 400px);
		height: clamp(500px, 90vh, 800px);
		gap: 10px;
		padding: 10px 0px;
		padding-left: 10px;
		overflow-y: scroll;
		font-family: 'Hanken Grotesk', sans-serif;
		border-radius: 5px;
		box-shadow: 2px 2px 5px 0px var(--shadow-color)
	}



	
	.entry {
		width: calc(95% - 20px);
		background-color: var(--accent-color);
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: flex-start;
		gap: 10px;
		padding: 10px;
		transition: background-color 0.2s ease-in-out;
		box-shadow: 2px 2px 10px -2px var(--shadow-color);
		border-radius: 5px;
		*{
			transition: 0ms color
		};
		cursor: pointer;

		&:hover {
			background-color: var(--accent-color-hover);
			color: var(--text-color-hover);
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
		border-radius: 3px;
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
		font-size: 0.9rem;
		font-weight: bold;
	}

	.date {
		font-size: 0.7rem;
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

	@media only  screen and (max-width: 800px){
		.container {
			min-height: 800px;
			height: unset;
			width: 90%;
			margin-bottom: 50px;
		}
			.entry{
				max-height: 100px;
			}
	}
</style>
