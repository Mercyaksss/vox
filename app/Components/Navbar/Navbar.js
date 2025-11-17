'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sun, Moon, User } from 'lucide-react';
import './Navbar.scss';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState('light');
  const [walletAddress, setWalletAddress] = useState('0x742d...9f2a'); // Mock wallet address
  const pathname = usePathname();

  useEffect(() => {
    // Initialize theme from localStorage or default to 'light'
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-wrapper">
        <div className="container">
          <div className="nav-content">
            <Link href="/" className="logo">
              <div className="logo-icon">V</div>
              <span className="logo-text">Vox</span>
            </Link>
            <div className="nav-links">
              <Link href="/Dashboard" className={pathname === '/Dashboard' ? 'active' : ''}>
                Dashboard
              </Link>
              <Link href="/Campaigns" className={pathname === '/Campaigns' ? 'active' : ''}>
                Browse Campaigns
              </Link>
              <Link href="/Campaigns/Create" className={pathname === '/Campaigns/Create' ? 'active' : ''}>
                Create Campaign
              </Link>
              <Link href="/Dashboard/MyCampaigns" className={pathname === '/Dashboard/MyCampaigns' ? 'active' : ''}>
                My Campaigns
              </Link>
              <Link href="/Dashboard/MyNfts" className={pathname === '/Dashboard/MyNfts' ? 'active' : ''}>
                My NFTs
              </Link>
            </div>
            <div className="nav-actions">
              <button className="btn-theme-toggle" onClick={toggleTheme}>
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
              <div className="wallet-indicator">
                <User size={20} />
                <span>{walletAddress}</span>
              </div>
              {/* <button className="btn-connect">Connect Wallet</button> */}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}