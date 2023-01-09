<script lang="ts">
	import type { Bookmark } from "$lib/models/ServerData";
	import { bookmarks } from "$lib/stores/stores";
    let categories:Bookmark[] = []
    bookmarks.subscribe((b) => {
        categories = b
    });


</script>
<div class="wrapper">
    {#each categories as category}
        <div class="category">
            <div class="title" style="color: {category.color}">
                {category.title}</div><span style="color: {category.color}">|</span> 
                {#each category.links as link}
                    <div>
                        <a class="link" href={link.url}  id={category.title + "-" +link.name} 
                            on:mouseover={() => { 
                                let node = document.getElementById(category.title + "-" +link.name)
                                if(node != null){
                                    node.style.color = category.color
                                }
                            }}
                            on:mouseout={() => { 
                                let node = document.getElementById(category.title + "-" +link.name)
                                if(node != null){
                                    node.style.color = "var(--text-color)"
                                }
                            }}  
                            on:focus={() => {
                                let node = document.getElementById(category.title + "-" +link.name)
                                if(node != null){
                                    node.style.color = category.color
                                }
                            }}
                            on:blur={() => {
                                let node = document.getElementById(category.title + "-" +link.name)
                                if(node != null){
                                    node.style.color = "var(--text-color)"
                                }
                            }}>
                            {
                            link.name}</a>
                    </div>
                {/each}
        </div>
    {/each}
</div>

<style lang="scss">
    .wrapper{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
    .category{
        display: flex;
        flex-grow: 1;
        align-items: center;
        gap: 1rem;
        flex-wrap: no-wrap;
        overflow-x: auto;
    }
    .title{
        width: 10%;
        margin-left: 20px;
        display: flex;
        justify-content: center;
        justify-content: flex-start;
    }
    .link{
        color: var(--text-color);
        text-decoration: none;
        font-size: 1rem;
     
    }
    


</style>