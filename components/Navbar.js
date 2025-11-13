// components/Navbar.js
"use client"; 

import React, { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image'; // <-- 1. Impor Image

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Beranda', href: '/' },
    { name: 'Fasilitas', href: '/fasilitas' },
    { name: 'Akademik', href: '/akademik' },
    { name : 'Panduan', href:'/panduan'},
  ];

  return (
    <nav className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center h-20">
        
        {/* Logo dan Nama Sekolah */}
        <a href="/" className="flex items-center space-x-3">
          {/* <-- 2. Ganti <img> dengan <Image> --> */}
          <Image 
            src="/Dokumentasi/logo.png" 
            alt="Logo Sekolah" 
            width={48} // (dari w-12)
            height={40} // (dari h-10)
            className="object-contain" 
          />
          <span className="font-bold text-lg">SDN 2 Sabah Balau</span>
        </a>

        {/* Menu Desktop */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-white/90 hover:text-white transition-colors">
              {link.name}
            </a>
          ))}
          <Link 
            href="/login" 
            className="bg-white text-blue-500 rounded-full py-2 px-6 font-semibold hover:bg-gray-100 transition-all shadow-sm"
          >
            Login
          </Link>
        </div>

        {/* Tombol Menu Mobile */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Menu Mobile (Dropdown) */}
      {isOpen && (
        <div className="md:hidden bg-gradient-to-r from-blue-500 to-cyan-400 pb-4">
          <ul className="flex flex-col items-center space-y-4">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a href={link.href} className="text-white/90 hover:text-white transition-colors" onClick={() => setIsOpen(false)}>
                  {link.name}
                </a>
              </li>
            ))}
            <li>
              <a 
                href="/login" 
                className="bg-white text-blue-500 rounded-full py-2 px-6 font-semibold hover:bg-gray-100 transition-all shadow-sm"
              >
                Login
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;