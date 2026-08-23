import { useState } from 'react'

function Login() {
    return (
        <>
            <h1>Login</h1>
            <form>
                <label for='username'>Username</label>
                <input type='text' id='username' name='username'/>
                <label for='password'>Password</label>
                <input type='text' id='password' name='password'/>
                <input type='submit' value='submit'/>
            </form>
            <a>Forgot password?</a>
        </>
    );
}

export default Login;