import { useState } from 'react'

function Home() {
    return (
        <section className='p-4 lg:p-0 lg:pb-6 min-h-svh bg-neutral-50/1'>

            <div className='flex items-center flex-col lg:w-75vw max-w-7xl m-auto'>
                <h1 className='text-5xl font-extrabold'>New fAInman website!</h1>
                <h2 className='font-bold text-4xl opacity-40'><u>The web pages we will have:</u></h2>
                <div className='flex flex-wrap justify-center gap-5 pt-6'>

                    <div className='border bg-purple-500/25 border-purple-400/25 rounded-4xl flex flex-col items-center w-md hover:scale-110 transition'>
                        <h3 className='text-3xl font-semibold'>Nav Bar</h3>

                        <h4 className='text-xl font-light opacity-65 underline text-left w-full pl-6'>Goals</h4>
                        <ul className='text-xl list-decimal text-left w-full pl-8 pb-2'>
                            <li>Simple & Stylish</li>
                            <li>All pages accessible</li>
                        </ul>

                        <h4 className='text-xl font-light opacity-65 underline text-left w-full pl-6'>TODO</h4>
                        <ul className='text-xl list-decimal text-left w-full pl-8 pb-2'>
                            <li>Styling</li>
                        </ul>
                    </div>

                    <div className='border bg-purple-500/25 border-purple-400/25 rounded-4xl flex flex-col items-center w-md hover:scale-110 transition'>
                        <h3 className='text-3xl font-semibold'>Home</h3>

                        <h4 className='text-xl font-light opacity-65 underline text-left w-full pl-6'>Goals</h4>
                        <ul className='text-xl list-decimal text-left w-full pl-8 pb-2'>
                            <li>Description of application</li>
                            <li>Project exigence</li>
                            <li>Demo video</li>
                        </ul>

                        <h4 className='text-xl font-light opacity-65 underline text-left w-full pl-6'>TODO</h4>
                        <ul className='text-xl list-decimal text-left w-full pl-8 pb-2'>
                            <li>Styling</li>
                            <li>Write exigence</li>
                            <li>Create description</li>
                            <li>Record video</li>
                        </ul>
                    </div>

                    <div className='border bg-purple-500/25 border-purple-400/25 rounded-4xl flex flex-col items-center w-md hover:scale-110 transition'>
                        <h3 className='text-3xl font-semibold'>Login</h3>
                        <h4 className='text-xl font-light opacity-65 underline text-left w-full pl-6'>Goals</h4>
                        <ul className='text-xl list-decimal text-left w-full pl-8 pb-2'>
                            <li>Username & Password</li>
                            <li>Forgot password</li>
                        </ul>

                        <h4 className='text-xl font-light opacity-65 underline text-left w-full pl-6'>TODO</h4>
                        <ul className='text-xl list-decimal text-left w-full pl-8 pb-2'>
                            <li>Styling</li>
                            <li>Database to store users</li>
                        </ul>
                    </div>

                    <div className='border bg-purple-500/25 border-purple-400/25 rounded-4xl flex flex-col items-center w-md hover:scale-110 transition'>
                        <h3 className='text-3xl font-semibold'>Signup</h3>
                        <h4 className='text-xl font-light opacity-65 underline text-left w-full pl-6'>Goals</h4>
                        <ul className='text-xl list-decimal text-left w-full pl-8 pb-2'>
                            <li>Username, Password, Confirm Password, Email</li>
                            <li>Forgot password</li>
                        </ul>
                    </div>

                    <div className='border bg-purple-500/25 border-purple-400/25 rounded-4xl flex flex-col items-center w-md hover:scale-110 transition'>
                        <h3 className='text-3xl font-semibold'>Email Verification Page</h3>
                        <h4 className='text-xl font-light opacity-65 underline text-left w-full pl-6'>Goals</h4>
                        <ul className='text-xl list-decimal text-left w-full pl-8 pb-2'>
                            <li>6 digit confirmation</li>
                            <li>Re-send code</li>
                        </ul>
                    </div>

                    <div className='border bg-purple-500/25 border-purple-400/25 rounded-4xl flex flex-col items-center w-md hover:scale-110 transition'>
                        <h3 className='text-3xl font-semibold'>About Us</h3>
                        <h4 className='text-xl font-light opacity-65 underline text-left w-full pl-6'>Goals</h4>
                        <ul className='text-xl list-decimal text-left w-full pl-8 pb-2'>
                            <li>Description of all of those who worked on the project</li>
                        </ul>
                    </div>

                    <div className='border bg-purple-500/25 border-purple-400/25 rounded-4xl flex flex-col items-center w-md hover:scale-110 transition'>
                        <h3 className='text-3xl font-semibold'>Main</h3>
                        <h4 className='text-xl font-light opacity-65 underline text-left w-full pl-6'>Chat</h4>
                        <ul className='text-xl list-decimal text-left w-full pl-8 pb-2'>
                            <li>Fully fleshed out question & response</li>
                            <li>Saves chat history per user</li>
                            <li>Multiple chats per person</li>
                        </ul>
                        <h4 className='text-xl font-light opacity-65 underline text-left w-full pl-6'>Drawing Canvas</h4>
                        <ul className='text-xl list-decimal text-left w-full pl-8 pb-2'>
                            <li>Can send image & text, just image, or just text per response</li>
                            <li>Images get saved as possibly compressed?</li>
                            <li>Draw, color, fill, erase, brush sizes</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Home;