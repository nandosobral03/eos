<script lang="ts">
	import { onMount } from "svelte";
    import SpotifyLogin from "./spotifyLogin.svelte";
	import SpotifyStats from "./spotifyStats.svelte";
    let access_token = localStorage.getItem("access_token");
    let refresh_token = localStorage.getItem("refresh_token");
</script>


<div class="wrapper">
    {#if access_token && refresh_token}
        <SpotifyStats/>
    {:else}
        <SpotifyLogin/>
    {/if}
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
    gap: 5px;
}
</style>