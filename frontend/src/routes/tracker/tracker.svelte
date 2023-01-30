<script lang="ts">
	import type { Tracked } from "$lib/models/Tracker";
	import { tracked } from "$lib/stores/stores";
	import TrackedComponent from "./trackedComponent.svelte";


    let trackerList: Array<Tracked> = [];


    tracked.subscribe((value) => {
        trackerList = value;
    })
</script>


<div class="wrapper">
    {#each trackerList as tracked}
        <TrackedComponent {tracked} />
    {/each}

</div>

<style lang="scss">
	.wrapper {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
        overflow: auto;
		position: relative;
		gap: 10px;
        padding: 10px;
		
	}


   
</style>