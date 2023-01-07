<script lang="ts">
	import type { Bookmark, Note, RSSProvider } from "$lib/models/ServerData";
	import { bookmarks, notes, rss } from "$lib/stores/stores";
	import Multicomponent from "./MultiComponent.svelte";
    import Rssfeed from "./RSSFeed.svelte";
    export let data:{
        rss: Array<RSSProvider>
        notes: Array<Note>
        books: Array<Bookmark>       
    };
    notes.set(data.notes);
    bookmarks.set(data.books);
    rss.set(data.rss);
</script>
<main class="main">
    <Rssfeed/>
    <div class="right-component">
        <Multicomponent/>
        <img class="image" src="/55.jpg" alt="logo" />
    </div>
</main>

<style lang="scss">
    .main{
        background-color: #2c2b2b;
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 40px;
    }

    .right-component{
        width: 550px;
        height: 750px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 20px;
    }

    .image{
        width: 100%;
        height: 400px;
        object-fit: cover;
    }
</style>