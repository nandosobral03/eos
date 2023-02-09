<script lang="ts">
	import { bookmarkService } from '$lib/bookmarks';
	import type { Bookmark } from '$lib/models/ServerData';
	import { notifications } from '$lib/notifications';
	import { bookmarks } from '$lib/stores/stores';
	import BookmarkEdit from './BookmarkEdit.svelte';

	let bms: Bookmark[] = [];

	bookmarks.subscribe((value) => {
		bms = value;
	});

	let editing: number | undefined = undefined;

	const deleteBookmark = async (id: number | undefined) => {
		try {
			if (id) bookmarkService.deleteBookmark(id);
			else bookmarks.set(bms.filter((b) => b.id != id));
			notifications.success('Bookmark deleted', 500);
		} catch (e) {
			notifications.danger('Error deleting bookmark', 500);
		}
	};
</script>

<div class="wrapper">
	<div class="setting">
		<span class="setting-title">Bookmarks</span>
		<div class="setting-list">
			{#each bms as bookmark}
				<div class="setting-item">
					<span class="setting-item-title">{bookmark.title}</span>
					{#if editing != bookmark.id}
						<div class="setting-item-value bookmark_actions">
							<button
								class="edit"
								on:click={() => {
									editing = editing == bookmark.id ? undefined : bookmark.id;
								}}
							>
								<span class="material-symbols-outlined">edit</span>
							</button>
							<button
								class="delete"
								on:click={() => {
									deleteBookmark(bookmark.id);
								}}
							>
								<span class="material-symbols-outlined">delete</span>
							</button>
						</div>
					{/if}
				</div>

				<div class={editing == bookmark.id ? 'bookmark_edit' : 'bookmark_edit hidden'}>
					<BookmarkEdit
						{bookmark}
						on:save={() => {
							editing = undefined;
						}}
						on:discard={() => {
							editing = undefined;
						}}
					/>
				</div>
			{/each}
		</div>
	</div>
	<div class="setting">
		<div class="setting-list">
			{#if editing != -1}
				<div class="setting-item">
					<span class="setting-item-title">Add new bookmark</span>
					<button
						class="action_button"
						on:click={() => {
							editing = -1;
						}}>Add</button
					>
				</div>
			{/if}
			{#if editing == -1}
				<div class="bookmark_edit">
					<BookmarkEdit
						on:save={() => {
							editing = undefined;
						}}
						on:discard={() => {
							editing = undefined;
						}}
						bookmark={{ title: '', links: [], color: '#000000' }}
					/>
				</div>
			{/if}
		</div>
	</div>
</div>

<style lang="scss">
	
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

	.bookmark_edit {
		transition: height 0.5s ease-in-out;
		max-height: 15em;
		height: clamp(0px, 100%, 15em);
		width: 100%;
		overflow: auto;
	}

	.hidden {
		height: 0px;
		max-height: 0em;
		padding: 0px;
		margin: 0px;
		overflow: hidden;
		transition: all 0.5s ease-in-out;
	}
	.bookmark_actions {
		display: flex;

		gap: 5px;
		button {
			background-color: transparent;
			border: none;
			cursor: pointer;
			color: var(--color-text);
			font-size: 0.8rem;
			&.delete :hover {
				color: var(--danger-color);
			}
			&.edit :hover {
				color: var(--success-color);
			}

			.material-symbols-outlined {
				font-variation-settings: 'FILL' 0, 'wght' 500, 'GRAD' 0, 'opsz' 48;
				font-size: 16px;
				margin: auto;
				user-select: none; /* Non-prefixed version, currently
							supported by Chrome and Opera */
			}
		}
	}

	.setting {
		border: 1px solid var(--accent-color);
		padding: 15px;
		border-radius: 5px;
		display: flex;
		flex-direction: column;
		.setting-title{
            font-size: 1rem;
            font-weight: 500;
            margin-bottom: 10px;
        }
		.setting-list {
			display: flex;
			flex-direction: column;
			gap: 10px;
			width: 100%;
			.setting-item {
				width: 100%;
				display: flex;
				gap: 10px;
				justify-content: space-between;
				align-items: center;
				.setting-item-title {
					font-size: 0.8rem;
					font-weight: 300;
				}
				.setting-item-value {
					display: flex;
					gap: 5px;
					font-size: 0.8rem;
					font-weight: 400;
				}
			}
		}
	}

	.action_button {
		background-color: var(--button-color);
		color: var(--button-text-color);
		border: none;
		border-radius: 5px;
		padding: 5px 10px;
		cursor: pointer;
		font-size: 0.8rem;
		font-weight: 500;
		&:hover {
			background-color: var(--button-color-hover);
		}
	}
</style>
