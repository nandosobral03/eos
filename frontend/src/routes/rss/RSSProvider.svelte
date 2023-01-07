<script lang="ts">
	import type { RSSProvider } from "$lib/models/ServerData";
    import { environment } from "$lib/environment";
    import axios from "axios";
    export let provider:RSSProvider;
    const handleDelete = () => {
        axios.delete(`${environment.api}/rss/${provider.id}`)
    }
</script>

<div class="provider">
    <div class="info">
        <img class="provider-image" src={provider.image} alt="provider" />
        <div class="provider-url">
            {provider.url}
        </div>
    </div>
    <div class="actions">
        <button class="edit" > <span class="material-symbols-outlined">edit</span> </button>
        <button class="delete" on:click={() => handleDelete()}> <span class="material-symbols-outlined">delete</span> </button>
    </div>
</div>

<style lang="scss">
    .provider{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: calc(100% - 40px);
        gap: 20px;
        padding: 10px;
        margin: 10px 0px;
        background-color: var(--gray-color);
    }

    .provider-image{
        width: 35px;
        height: 35px;
        object-fit: cover;
    }

    .actions{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: 5px;
        button{
            background-color: transparent;
            border: none;
            cursor: pointer;
            color: var(--color-text);
            font-size: 0.8rem;
            &.delete :hover{
                color: var(--red-color);
            }
            &.edit :hover{
                color: var(--green-color);
            }

            .material-symbols-outlined {
			font-variation-settings: 'FILL' 0, 'wght' 500, 'GRAD' 0, 'opsz' 48;
			font-size: 16px;
			margin: auto;
			user-select: none; /* Non-prefixed version, currently
							supported by Chrome and Opera */
		}
        }
    
    }

    .info{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        gap: 10px;
    }


</style>