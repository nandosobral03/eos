<script lang="ts">
	import { environment } from "$lib/environment";

</script>


<div class="wrapper">
    <a href="{`${environment.api}/spotify/login`}">Login with spotify</a>
    
</div>

<style lang="scss">
      .wrapper{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        overflow: auto;
        position: relative;
        gap: 10px;
        padding: 10px;
    }

    a{
        color: var(--background-color);
        text-decoration: none;
        aspect-ratio: 4/1;
        text-align: center;
        font-size: 1.5rem;
        background-color: #1DB954;
        padding: 20px;
        border-radius: 5px;
        &:hover{
            background-color: var(--background-color);
            color: #1ED760;
        }
    }
</style>