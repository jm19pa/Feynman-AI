import { useState } from 'react'
import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'

function Chat() {
    return (

        <section id='Chat' className='p-4 lg:p-0 lg:pb-6 lg:pt-6 min-h-svh bg-neutral-50/1'>
            {/* This div holds all the content, limiting the width */}
            <div className='flex items-center flex-col lg:w-75vw max-w-7xl m-auto'>
                <h1 className='text-5xl font-extrabold'>Chat</h1>
                <form className='text-md md:text-lg lg:text-xl pt-4 flex flex-col items-center'>
                    <div className='flex flex-col items-center'>
                        <label for='send_message'>Type a message</label>
                        <input type='text' id='send_message' name='send_message' className='border bg-yellow-500/25 border-yellow-400/25 text-center w-sm rounded-full' />
                    </div>
                    <div className='pt-4'>
                        <input type='submit' value='Send Message' className='border bg-green-500/25 border-green-400/25 rounded-4xl w-fit pl-4 pr-4' />
                    </div>
                </form>
                <div className='drawing-area' style={{ inset: 0, width: '500px', height: '500px' }}>
                    <Tldraw />
                </div>
                {/* https://www.tldraw.com/ */}
                <div id='ai-response-area'>
                    <p>This will be the response area for the AI!</p>
                </div>
            </div>
        </section>
    );
}

export default Chat;