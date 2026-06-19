import { useState } from 'react'
// import './Chat.css'

function Chat() {
    return (
        <>
            <h1>Chat</h1>
            <form>
                <label for='send_message'>Send a message</label>
                <input type='text' id='send_message' name='send_message'/>
                <input type='submit' value='submit'/>
            </form>
            {/* https://github.com/dilidili/react-drawing-board */}
        </>
    );
}

export default Chat;