import { useState } from 'react'

function About_Us() {
    return (
        <>
            <h1>About Us</h1>
            {/* Below is the format for each of us in the about-me section */}
            <div>
                <h2>Name</h2>
                <p>Picture</p>
                <p>Major / Role / Graduating Class</p>
                <p>Links to socials / portfolio</p>
                <p>Brief description of self</p>
            </div>
        </>
    );
}

export default About_Us;