import { useState } from 'react'

function Email_Verification() {
    return (
        <>
            <h1>Email Verification</h1>
            <form className='horiz'>
                <h3>Enter the 6-digit code</h3>
                {/* <label for='char1'>Email</label> */}
                <div>
                    <input type='text' id='char1' name='char1' />
                    <input type='text' id='char2' name='char2' />
                    <input type='text' id='char3' name='char3' />
                    <input type='text' id='char4' name='char4' />
                    <input type='text' id='char5' name='char5' />
                    <input type='text' id='char6' name='char6' />
                </div>
                <input type='submit' value='submit' />
            </form>
            <a>Send another code</a>
        </>
    );
}

export default Email_Verification;