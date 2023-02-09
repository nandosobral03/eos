<script lang="ts">
	import { bottomComponent } from "$lib/stores/stores";
    import axios from "axios";
	import { onMount } from "svelte";
    let loading = true;
    let potd:{
        url: string,
        date: string,
        explanation: string,
        hdurl: string,
        media_type:string,
        title: string,
        service_version: string
    };
    onMount(async () => {
        loading = true;
        let data = localStorage.getItem("POTD");
        if(data){
            let parsedData = JSON.parse(data);
            if(new Date().getDate() === new Date(parsedData.date).getDate()){
                potd = parsedData.data;
                loading = false;
            }else{
                const response = await axios.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY');
                localStorage.setItem("POTD", JSON.stringify(
                    {
                        date: new Date(),
                        data: response.data
                    }
                ));
                potd = response.data;
                loading = false;
            }
        }else{
            const response = await axios.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY');
            localStorage.setItem("POTD", JSON.stringify(
                {
                    date: new Date(),
                    data: response.data
                }
            ));
            potd = response.data;
            loading = false;
        }
        if(potd.media_type != "image"){
            loading = false;
            bottomComponent.set("single-image")
        }
    })


</script>

{#if !loading && potd.media_type === "image"}
    <div class="image">
        <img src="{potd.url}" alt="NASA's POTD" />
        <div class="explanation">
            <h1>{potd.title}</h1>
            <p>{potd.explanation}</p>
        </div>
    </div>

{/if}

<style lang="scss">
    .image{
        width: 100%;
        height: 100%;
        position: relative;
        img{
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    }

    .explanation{
        position: absolute;
        height: calc(100% - 40px);
        width: calc(100% - 40px);
        border-radius: 10px;
        background-color: var(--accent-color);
        color: var(--text-color);
        top: 0;
        left: 0;
        opacity:0;
        display: flex;
        flex-direction: column;
        padding: 20px;
        margin: 20px;
        box-shadow: 2px 2px 5px 5px var(--shadow-color);
        h1{
            font-size: 1.5rem;
            font-weight: 400;
            margin-bottom: 20px;
            color: var(--text-color-accent)
        }
        p{
            font-size: 1rem;
            text-align: justify;
            overflow: auto;
        }
        &:hover{
            opacity: 1;
        }
    }
</style>