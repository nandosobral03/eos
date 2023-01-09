<script lang="ts">
    import MdViewer from "./notes/MDViewer.svelte";
    import SingleImageComponent from "./images/singleImageComponent.svelte";
	import { currentNote } from "$lib/stores/stores";
    let active = "single-image";
    let options = [
        {
            name: "single-image",
            component: SingleImageComponent
        },
        {
            name: "md-viewer",
            component: MdViewer
        },
    ]

    currentNote.subscribe((n) => {
        if(n.writing){
            active = "md-viewer";
        }else{
            active = "single-image";
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