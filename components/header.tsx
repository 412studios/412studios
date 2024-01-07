'use client'
import React, { useState } from 'react';
import { Logo } from '../public/logo';
import { Arrow } from '../public/icons/arrow';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (
        <header className='max-w-screen-xl mx-auto'>
            
            {/* Desktop */}
            <div className='hidden md:flex p-8'>

                <a href="/" className='flex items-center w-32 h-auto mr-12' aria-label="logo header">

                    <Logo />

                </a>

                <div className="flex items-center justify-center h-20">
                    <a href="/" className='link-hover mr-4'>Home</a>
                    <a href="/about" className='link-hover'>About</a>
                </div>
                {/* 
                <button className="py-2 px-4 rounded ml-auto">
                    Book Now
                </button> 
                */}
            </div>
            
            {/* Mobile */}
            <div className='block md:hidden p-4'>
                <div className='flex'>
                    <a href="/" className='flex items-center w-32 h-auto' aria-label="logo header">
                        <Logo className="h-full w-auto" />
                    </a>
                    <button
                        className=" ml-auto"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <Arrow className={`h-auto w-auto duration-500 ease-in-out ${isMenuOpen ? '-rotate-90' : 'rotate-0'}`} aria-label="menu button" />
                    </button>
                </div>
                <div
                    className={`overflow-hidden transition-max-height duration-500 ease-in-out ${isMenuOpen ? 'max-h-96' : 'max-h-0'}`}
                >
                    <div className='pt-4 flex flex-col'>
                        <a href="/" className='link-hover w-full'>Home</a>
                        <a href="#" className='link-hover w-full pt-2'>About</a>
                        {/* <a href="#" className='link-hover w-full'>Contact</a> */}
                    </div>
                </div>
            </div>

        </header>
    );
}