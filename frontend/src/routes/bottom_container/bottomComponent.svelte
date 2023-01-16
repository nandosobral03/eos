<script lang="ts">
    import MdViewer from "../notes/MDViewer.svelte";
    import SingleImageComponent from "./singleImageComponent.svelte";
	import { bottomComponent, currentNote } from "$lib/stores/stores";
	import NasaPotd from "./nasaPOTD.svelte";
    let active = "potd";
    let activeCopy = active;
    bottomComponent.subscribe((n) => {
        activeCopy = n;
        active = n;
    })

    let options = [
        {
            name: "single-image",
            component: SingleImageComponent
        },
        {
            name: "md-viewer",
            component: MdViewer
        },
        {
            name: "potd",
            component: NasaPotd
        }
    ]

    currentNote.subscribe((n) => {
        if(n.writing){
            active = "md-viewer";
        }else{
            active = activeCopy;
        }
    })
</script>
<div class="wrapper">
    {#each options as option}
            {#if option.name === active}
                <svelte:component this={option.component} />
            {/if}
    {/each}
</div>

<style>
    .wrapper{
        width: 100%;
        height: calc(50% - 10px);
        object-fit: cover;
    }
   
</style>