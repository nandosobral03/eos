<script lang="ts">
	import { refreshBottom } from "$lib/stores/stores";
	import { onMount } from "svelte";
    let bottomUrl: string;
    let loading = true;
    onMount(async () => {
        const response = await fetch('/settings/image');
        const bottomBlob = await response.blob();
        bottomUrl = URL.createObjectURL(bottomBlob);
        loading = false;
        refreshBottom.subscribe(n => {
            const response = fetch('/settings/image');
            response.then(async (res) => {
                const bottomBlob = await res.blob();
                bottomUrl = URL.createObjectURL(bottomBlob);
            })
        })
    })  
</script>
{#if !loading}
    <img class="image"  src={bottomUrl}  alt="bottom" />
{/if}

<style>
    .image{
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
</style>