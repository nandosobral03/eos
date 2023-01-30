<script lang="ts">
	import { onMount } from "svelte";

    let showSearchbar = false;
    let searchString = "";
    onMount(() => {
        let searchbar = document.getElementById("searchbar")!;
        document.addEventListener("keydown", (e) => {
            if (e.ctrlKey && e.key === "Enter") {
                searchString = "";
                showSearchbar = !showSearchbar;
                window.setTimeout(() => searchbar?.focus(), 0);
            }
            if (showSearchbar && e.key === "Enter" && !e.ctrlKey) {
                window.open("https://www.google.com/search?q=" + searchString, "_blank");
            }
        })

        
        searchbar.onblur = () => {
            showSearchbar = false;
        };
    })


</script>

<div class="searchbar" style:display={showSearchbar ? "block" : "none"}>
    <input placeholder="Search"  id="searchbar" bind:value={searchString} autocomplete="off" />
</div>

<style lang="scss">
    .searchbar{
        position: fixed;
        background-color:  var(--background-color-opaque);
        height: clamp(50px, 8vh, 100px);
        width: clamp(500px, 45vw, 700px);
        transform: translateY(-300%);
        padding: 20px 30px;
        z-index: 101;
        border: 1px solid var(--border-color);
        box-shadow: 0 0 10px var(--border-color);
        input{
            width: 100%;
            height: 100%;
            background-color: transparent;
            border: none;
            outline: none;
            font-size: 1.5rem;
            color: var(--text-color);

        }
    }    
    
    
</style>