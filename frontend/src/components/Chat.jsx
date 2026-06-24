import { useState } from 'react'
import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'
// import './Chat.css'

function Chat() {
    return (
        <>
            <h1>Chat</h1>
            <form>
                <label for='send_message'>Send a message</label>
                <input type='text' id='send_message' name='send_message' />
                <input type='submit' value='submit' />
            </form>
            <div className='drawing-area'  style={{ inset: 0 , width: '500px', height: '500px'}}>
                <Tldraw />
            </div>
            {/* https://www.tldraw.com/ */}
            <div id='ai-response-area'>
                <p>This will be the response area for the AI!</p>
            </div>
        </>
    );
}

export default Chat;