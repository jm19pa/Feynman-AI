import { useState } from 'react'

function Login() {
    return (
        <section id='Login' className='p-4 lg:p-0 lg:pb-6 lg:pt-6 min-h-svh bg-neutral-50/1'>
            {/* This div holds all the content, limiting the width */}
            <div className='flex items-center flex-col lg:w-75vw max-w-7xl m-auto'>
                <h1 className='text-5xl font-extrabold'>Login</h1>
                <form className='text-md md:text-lg lg:text-xl pt-4 flex flex-col items-center'>
                    <div className='flex flex-col items-center'>
                        <label for='username'>Username</label>
                        <input type='text' id='username' name='username' className='border bg-yellow-500/25 border-yellow-400/25 text-center rounded-full' />
                    </div>
                    <div className='flex flex-col items-center'>
                        <label for='password'>Password</label>
                        <input type='text' id='password' name='password' className='border bg-yellow-500/25 border-yellow-400/25 text-center rounded-full' />
                    </div>
                    <div className='pt-4'>
                        <input type='submit' value='submit' className='border bg-green-500/25 border-green-400/25 rounded-4xl w-fit pl-4 pr-4' />
                    </div>
                </form>
                <form className='pt-6'>
                    <input type='submit' value='forgot password' className='border bg-sky-500/25 border-sky-400/25 rounded-4xl w-fit pl-4 pr-4' />
                </form>
            </div>
        </section>
    );
}

export default Login;