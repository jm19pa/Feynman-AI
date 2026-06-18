import { useState } from 'react'
import { Link } from 'react-router-dom';
import './Nav_Bar.css'

function Nav_Bar() {
    return (
        <>
            <nav className='NavBar'>
                <div className='NavDiv'>
                    <Link to='/' className='NavLink'>
                        Home
                    </Link>
                    <Link to='/About_Us' className='NavLink'>
                        About
                    </Link>
                    <Link to='/Login' className='NavLink'>
                        Login
                    </Link>
                    <Link to='/Sign_Up' className='NavLink'>
                        Signup
                    </Link>
                    <Link to='/Email_Verification' className='NavLink'>
                        Email Verification
                    </Link>
                    <Link to='/Chat' className='NavLink'>
                        Chat
                    </Link>
                </div>
            </nav>
        </>
    );
}

export default Nav_Bar;