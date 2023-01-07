<script lang="ts">
    const categories = [
        {
            name: "code",
            color: "var(--purple-color)",
            links: [
                {
                    name: "github",
                    url: "https://github.com"
                },
                {
                    name: "codewars",
                    url: "https://codewars.com"
                },
                {
                    name: "advent",
                    url: "https://adventofcode.com"
                }
            ]
        },
        {
            name: "media",
            color: "var(--orange-color)",
            links: [
                {
                    name: "youtube",
                    url: "https://youtube.com"
                },
                {
                    name: "twitch",
                    url: "https://netflix.com"
                },
                {
                    name: "netflix",
                    url: "https://netflix.com"
                },
                {
                    name: "anime",
                    url: "https://9anime.tv/"
                }
            ]
        },
        {
            name: "work",
            color: "var(--yellow-color)",
            links: [
                {
                    name: "trello",
                    url: "https://trello.com"
                },
                {
                    name: "slack",
                    url: "https://slack.com"
                },
                {
                    name: "gestion",
                    url: "https://gestion.ort.edu.uy/"
                },
                {
                    name: "mail",
                    url: "https://mail.google.com"
                }
            ]
        }
    ]


</script>
<div class="wrapper">
    {#each categories as category}
        <div class="category">
            <div class="name" style="color: {category.color}">
                {category.name}</div><span style="color: {category.color}">|</span> 
                {#each category.links as link}
                    <div>
                        <!-- dynamically set element color  categoryColor on hover -->
                        <a class="link" href={link.url}  id={category.name + "-" +link.name} 
                            on:mouseover={() => { 
                                let node = document.getElementById(category.name + "-" +link.name)
                                if(node != null){
                                    node.style.color = category.color
                                }
                            }}
                            on:mouseout={() => { 
                                let node = document.getElementById(category.name + "-" +link.name)
                                if(node != null){
                                    node.style.color = "white"
                                }
                            }}  
                            on:focus={() => {
                                let node = document.getElementById(category.name + "-" +link.name)
                                if(node != null){
                                    node.style.color = category.color
                                }
                            }}
                            on:blur={() => {
                                let node = document.getElementById(category.name + "-" +link.name)
                                if(node != null){
                                    node.style.color = "white"
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
    }
    .category{
        display: flex;
        flex-grow: 1;
        align-items: center;
        gap: 1rem;
        flex-wrap: no-wrap;
        overflow-x: scroll;
    }
    .name{
        width: 10%;
        margin-left: 20px;
        display: flex;
        justify-content: center;
        justify-content: flex-start;
    }
    .link{
        color: white;
        text-decoration: none;
        font-size: 1rem;
     
    }
    


</style>