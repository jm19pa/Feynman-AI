import { useState } from 'react'

function Email_Verification() {
    return (
        <section id='EmailVer' className='p-4 lg:p-0 lg:pb-6 lg:pt-6 min-h-svh bg-neutral-50/1'>
            {/* This div holds all the content, limiting the width */}
            <div className='flex items-center flex-col lg:w-75vw max-w-7xl m-auto'>
                <h1 className='text-5xl font-extrabold'>Email Verification</h1>
                <h3 className='text-3xl font-semibold pt-4'>Enter the 6-digit code</h3>
                <form className='flex flex-col items-center'>
                    <ul className='text-md md:text-lg lg:text-xl gap-3 flex flex-row p-6'>
                        <li><input type='text' id='char1' name='char1' className='border bg-emerald-500/25 border-emerald-400/25 aspect-square w-16 text-center rounded-full' /></li>
                        <li><input type='text' id='char2' name='char2' className='border bg-emerald-500/25 border-emerald-400/25 aspect-square w-16 text-center rounded-full' /></li>
                        <li><input type='text' id='char3' name='char3' className='border bg-emerald-500/25 border-emerald-400/25 aspect-square w-16 text-center rounded-full' /></li>
                        <li><input type='text' id='char4' name='char4' className='border bg-emerald-500/25 border-emerald-400/25 aspect-square w-16 text-center rounded-full' /></li>
                        <li><input type='text' id='char5' name='char5' className='border bg-emerald-500/25 border-emerald-400/25 aspect-square w-16 text-center rounded-full' /></li>
                        <li><input type='text' id='char6' name='char6' className='border bg-emerald-500/25 border-emerald-400/25 aspect-square w-16 text-center rounded-full' /></li>
                    </ul>
                    <input type='submit' value='submit' className='border bg-orange-500/25 border-orange-400/25 rounded-4xl w-fit pl-4 pr-4' />
                </form>
                <form className='pt-6'>
                    <input type='submit' value='send another code' className='border bg-blue-500/25 border-blue-400/25 rounded-4xl w-fit pl-4 pr-4' />
                </form>
            </div>
        </section>
    );
}

export default Email_Verification;