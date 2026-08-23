import { useState } from 'react'

function Home() {
    return (
        <>
            <h1>New fAInman website!</h1>
            <div className='temp1'>
                <h2><u>The web pages we will have:</u></h2>
                <div className='details'>
                    <h3>Home</h3>
                    <ul>
                        <li>Brief description of the application</li>
                        <li>Demo video</li>
                    </ul>
                </div>
                <div className='details'>
                    <h3>Login / Signup</h3>
                    <ul>
                        <li>Login: Username / Password</li>
                        <li>Signup: Username / Password / Confirm Password / Email</li>
                        <li>Forgot password</li>
                    </ul>
                </div>
                <div className='details'>
                    <h3>Email Verification Page</h3>
                    <ul>
                        <li>6 digit confirmation</li>
                        <li>Re-send code</li>
                    </ul>
                </div>
                <div className='details'>
                    <h3>About Us</h3>
                    <ul>
                        <li>Description of all of those who worked on the project</li>
                    </ul>
                </div>
                <div className='details'>
                    <h3>Main</h3>
                    <h4>------ Chat ------</h4>
                    <ul>
                        <li>Fully fleshed out question & response</li>
                        <li>Saves chat history per user</li>
                        <li>Multiple chats per person</li>
                    </ul>
                    <h4>------ Drawing Canvas ------</h4>
                    <ul>
                        <li>Can send image & text, just image, or just text per response</li>
                        <li>Images get saved as possibly compressed?</li>
                        <li>Draw, color, fill, erase, brush sizes</li>
                    </ul>
                </div>
            </div>
        </>
    );
}

export default Home;