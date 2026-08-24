import { useState } from 'react'
import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'

function Chat() {
    return (

        <section id='Chat' className='p-4 lg:p-0 lg:pb-6 lg:pt-6 min-h-svh bg-neutral-50/1'>
            {/* This div holds all the content, limiting the width */}
            <div className='flex items-center flex-col lg:w-75vw max-w-7xl m-auto'>
                <h1 className='text-5xl font-extrabold'>Chat</h1>

                {/* main content area */}
                <div className='gap-4 p-4 w-full min-h-svh flex flex-row'>
                    <div className='w-1/2 h-1/2 p-4 aspect-square bg-neutral-50/5 rounded-4xl'>
                        {/* Messages area */}
                        <div className='flex flex-col'>
                            <div className='bg-sky-700/75 border-sky-600/75 border rounded-4xl w-fit max-w-1/2 p-2.5 self-end'>
                                <p>Short user message</p>
                            </div>
                            <div className='bg-mist-700/75 border-mist-600/75 border rounded-4xl w-fit max-w-1/2 p-2.5 self-start'>
                                <p>AI small text</p>
                            </div>
                            <div className='bg-sky-700/75 border-sky-600/75 border rounded-4xl w-fit max-w-1/2 p-2.5 self-end'>
                                <p>This is an extremely long message sent by a user, this could be long paragraphs of words or whatever. Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit, est dolorum quas a nobis sint corporis, praesentium earum excepturi voluptates, maxime sequi ad dignissimos minima reiciendis eveniet amet rerum officia.</p>
                            </div>
                            <div className='bg-mist-700/75 border-mist-600/75 border rounded-4xl w-fit max-w-1/2 p-2.5 self-start'>
                                <p>The AI has responded with a pretty long message, we need to make sure this can be displayed. Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit, est dolorum quas a nobis sint corporis, praesentium earum excepturi voluptates, maxime sequi ad dignissimos minima reiciendis eveniet amet rerum officia.</p>
                            </div>
                        </div>

                        {/* Sending a message */}
                        <div className='w-full border bg-gray-500/75 border-gray-400/75 rounded-4xl mt-4 p-3 flex flex-row'>
                            <div className='flex flex-col items-center w-10/12'>
                                <input type='text' id='send_message' name='send_message' placeholder='Send message here' className='h-full w-full' />
                            </div>
                            <div className='w-2/12'>
                                <input type='submit' value='Submit' className='w-full'/>
                            </div>
                        </div>
                    </div>

                    {/* drawing area */}
                    <div className='flex items-center justify-center w-1/2 h-1/2 aspect-square'>
                        <Tldraw />
                    </div>
                </div>

            </div>
        </section>
    );
}

export default Chat;