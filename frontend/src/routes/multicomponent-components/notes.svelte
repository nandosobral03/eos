<script lang="ts">
	import type { Note } from '$lib/models/ServerData';
	import { notes } from '$lib/stores/stores';
	let noteList: Array<Note> = [];
	notes.subscribe((value) => {
		noteList = value;
	});
</script>

<div class="wrapper">
	<div class="notes">
		{#each noteList as note}
			<div class="note">
				<div
					class="note-title
                    {note.title.length > 20 ? 'long' : 'short'}"
				>
					{note.title}
				</div>
				<div class="note-content">
					{note.content}
				</div>
			</div>
		{/each}
	</div>
</div>

<style lang="scss">
	.wrapper {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}
</style>
