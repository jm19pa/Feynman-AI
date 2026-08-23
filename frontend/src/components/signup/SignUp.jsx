import { useState } from 'react'

function SignUp() {
    return (
        <>
            <h1>Sign Up</h1>
            <form>
                <label for='email'>Email</label>
                <input type='text' id='email' name='email'/>
                <label for='username'>Username</label>
                <input type='text' id='username' name='username'/>
                <label for='password'>Password</label>
                <input type='text' id='password' name='password'/>
                <label for='conf_password'>Confirm Password</label>
                <input type='text' id='conf_password' name='conf_password'/>
                <input type='submit' value='submit'/>
            </form>
        </>
    );
}

export default SignUp;