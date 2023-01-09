<script lang="ts">
	import { refreshBottom } from "$lib/stores/stores";
	import { onMount } from "svelte";
    let bottomUrl: string;
    onMount(async () => {
        const response = await fetch('/settings/image');
        const bottomBlob = await response.blob();
        bottomUrl = URL.createObjectURL(bottomBlob);
        
        refreshBottom.subscribe(n => {
            console.log(n)
            const response = fetch('/settings/image');
            response.then(async (res) => {
                const bottomBlob = await res.blob();
                bottomUrl = URL.createObjectURL(bottomBlob);
            })
        })
    })  
</script>

<img class="image"  src={bottomUrl}  alt="bottom" />

<style>
    .image{
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
</style>