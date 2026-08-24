import { useState } from 'react'

function AboutUs() {
    return (
        <section id='AboutUs' className='p-4 lg:p-0 lg:pb-6 lg:pt-6 min-h-svh bg-neutral-50/1'>
            {/* This div holds all the content, limiting the width */}
            <div className='flex items-center flex-col lg:w-75vw max-w-7xl m-auto'>
                <h1 className='text-5xl font-extrabold'>About Us</h1>
                <div className='text-md md:text-lg lg:text-xl'>
                    <p className='opacity-50'>Format for about page</p>
                    <h2>Name</h2>
                    <p>Picture</p>
                    <p>Major / Role / Graduating Class</p>
                    <p>Links to socials / portfolio</p>
                    <p>Brief description of self</p>
                </div>
            </div>
        </section>
    );
}

export default AboutUs;