import { useState } from 'react'
import { Link } from 'react-router-dom';

function NavBar() {
    return (
        <section>
            <nav className='border-b h-full'>
                <div className='flex items-center flex-row gap-10 justify-center lg:w-75vw max-w-7xl m-auto h-10'>
                    <Link to='/' className='text-lg font-semibold'>
                        fAInman
                    </Link>
                    <Link to='/About' className='text-lg font-semibold'>
                        About
                    </Link>
                    <Link to='/Email_Verification' className='text-lg font-semibold'>
                        Email Verification
                    </Link>
                    <Link to='/Chat' className='text-lg font-semibold'>
                        Chat
                    </Link>
                    <Link to='/Todo' className='text-lg font-semibold border bg-red-500/50 border-red-400/50 rounded-4xl pl-3 pr-3'>
                        Todo
                    </Link>
                    <Link to='/Login' className='text-lg font-semibold border bg-purple-500/25 border-purple-400/25 rounded-4xl pl-3 pr-3'>
                        Login
                    </Link>
                    <Link to='/Sign_Up' className='text-lg font-semibold border bg-purple-500/25 border-purple-400/25 rounded-4xl pl-3 pr-3'>
                        Signup
                    </Link>
                </div>
            </nav>
        </section>
    );
}

export default NavBar;