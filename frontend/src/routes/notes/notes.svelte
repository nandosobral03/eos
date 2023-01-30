<script lang="ts">
	import type { Note } from '$lib/models/ServerData';
	import { notes } from '$lib/stores/stores';
	import NoteDetails from './noteDetails.svelte';
	let showNote: boolean = false;
	let newNote: boolean = false;
	let noteList: Array<Note> = [];
	let emptyNote: Note = {
		title: '',
		content: '',
		date: new Date().toLocaleDateString(),
	};
	let selectedNote: Note;
	notes.subscribe((value) => {
		noteList = value;
	});
</script>

<div class="wrapper">
	{#if !showNote}
		{#each noteList as note}
			<div
				class="note"
				on:click={() => {
					selectedNote = note;
					showNote = true;
				}}
				on:keydown={(e) => {
					if (e.key === 'Enter') {
						selectedNote = note;
						showNote = true;
					}
				}}
			>
				<span class="date"> {new Date(note.date).toLocaleDateString()} </span>
				-
				<span class="title">{note.title}</span>
			</div>
		{/each}
	<button on:click={() => {
		showNote = true;
		newNote = true;
		emptyNote = {
			title: '',
			content: '',
			date: new Date().toLocaleDateString(),
		};
	}}
	class="add-button">
	<span class="material-symbols-outlined">add</span> 
	</button>
	{:else if showNote && newNote}
			<NoteDetails note={emptyNote} on:back={() => {
				showNote = false;
				newNote = false;
			}} create={true}/>

		{:else}
			<NoteDetails note={selectedNote} on:back={() => {
				showNote = false;
			}} create={false} 
			/>
	{/if}
	
</div>

<style lang="scss">
	.wrapper {
		width: 100%;
		min-height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		overflow: auto;
		position: relative;
		gap: 5px;
	}
	.note {
		width: calc(100% - 20px);
		height: 40px;
		line-height: 20px;
		background-color: var(--accent-color);
		padding: 10px;
		display: flex;
		justify-content: flex-start;
		gap: 10px;
		margin-left: auto;
		margin-right: auto;
		border-radius: 5px;
		cursor: pointer;
		&:hover {
			background-color: var(--accent-color-hover);
		}
		&:first-child {
			margin-top: 5px;
		}
		&:last-child {
			margin-bottom: 5px;
		}
	}

	.title {
		font-size: 1rem;
		font-weight: 600;
		min-width: fit-content;
	}

	.date {
		justify-self: flex-end;
		width: 75x;
	}

	.add-button{
		position: absolute;
		background-color: transparent;
		border: none;
		color: var(--icon-color);
		bottom: 0;
		right: 0;
		margin: 20px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		&:hover{
			color: var(--success-color);
		}
	}

	.material-symbols-outlined {
			font-variation-settings: 'FILL' 0, 'wght' 500, 'GRAD' 0, 'opsz' 48;
			font-size: 25px;
			margin: auto;
			user-select: none; /* Non-prefixed version, currently
							supported by Chrome and Opera */
	}
</style>
