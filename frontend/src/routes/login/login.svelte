<script lang="ts">
    import {authService} from '$lib/auth';
	import { notifications } from '$lib/notifications';
	import { createEventDispatcher } from 'svelte';

    let dispatch = createEventDispatcher();
    

    let password = '';
    const login = async () => {
        try{
            let result = await authService.login(password);
            let token = result.token;
            localStorage.setItem("token",token);
            dispatch("login");
        }
        catch(e){
            notifications.danger("Incorrect password",500);
        }        
    };

</script>

<div class="login-container">
    <span class="login-title">Enter password</span>
    <input type="password" bind:value={password} />
    <button on:click={login}>Login</button>
   
</div>

<style lang="scss">
    .login-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between ;
        border-radius: 5px;
        padding: 25px;
        aspect-ratio: 5/3;

        background-color: var(--background-color);
        .login-title {
            font-size: 1.5rem;
            color: var(--text-color);
        }
        input {
            width: 20rem;
            height: 2rem;
            border: 1px solid var(--border-color);
            color: var(--text-color);
            background-color: transparent;
            border-radius: 5px;
            padding: 0.5rem;
        }
        button {
            width: 20rem;
            height: 2rem;
            border-radius: 5px;
            background-color: var(--button-color);
            color: var(--button-text-color);
            border: none;
            cursor: pointer;
            &:hover {
                background-color: var(--button-color-hover);
                color: var(--button-text-color-hover);
            }
        }
        .error {
            color: red;
            font-size: 0.75rem;
            margin-top: 0.5rem;
        }
    }
</style>