'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image'; // ← Added import
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Vote, Shield, Award, TrendingUp, Users, CheckCircle, Github, Twitter, Send, Sun, Moon } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import './page.scss';

export default function VoxLandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState('light');
  const { isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      router.push('/Dashboard');
    }
  }, [isConnected, router]);

  const [stats] = useState({
    totalRaised: '2.5M',
    campaigns: '342',
    backers: '12.8K'
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const features = [
    { icon: <Vote size={32} />, title: 'Democratic Voting', description: 'Backers vote on milestone completion. Your voice matters in every project decision.' },
    { icon: <Shield size={32} />, title: 'Protected Funds', description: 'Smart contracts ensure automatic refunds if milestones fail. Your investment is safe.' },
    { icon: <Award size={32} />, title: 'NFT Rewards', description: 'Earn collectible NFT badges as you contribute. Build your supporter legacy.' },
    { icon: <TrendingUp size={32} />, title: 'Milestone-Based', description: 'Funds released step-by-step as creators prove progress. No more empty promises.' }
  ];

  const campaigns = [
    { id: 1, image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800', title: 'DeFi Trading Platform', creator: '0x742d...9f2a', raised: '45.2 ETH', goal: '100 ETH', progress: 45, backers: 234, daysLeft: 12 },
    { id: 2, image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800', title: 'NFT Marketplace v2', creator: '0x8a3c...4b1e', raised: '82.5 ETH', goal: '150 ETH', progress: 55, backers: 456, daysLeft: 8 },
    { id: 3, image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800', title: 'Web3 Analytics Tool', creator: '0x5f2d...7c8a', raised: '38.9 ETH', goal: '75 ETH', progress: 52, backers: 189, daysLeft: 15 }
  ];

  const howItWorks = [
    { step: '01', title: 'Creator Launches Campaign', description: 'Set goals, define milestones, and share your vision with the community.' },
    { step: '02', title: 'Backers Contribute', description: 'Support projects you believe in. Choose public or private contributions.' },
    { step: '03', title: 'Evidence & Voting', description: 'Creators submit proof of work. Backers vote to approve to approve milestone completion.' },
    { step: '04', title: 'Funds Released', description: 'Approved milestones automatically release funds. Collect NFT badges as rewards.' }
  ];

  return (
    <div className="vox-landing" data-theme={theme}>
      {/* Navigation */}
      <motion.nav className={`navbar ${scrolled ? 'scrolled' : ''}`} initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
        <div className="container">
          <div className="nav-content">
            <div className="logo">
              <div className="logo-icon">V</div>
              <span className="logo-text">Vox</span>
            </div>
            <div className="nav-links">
              <a href="#features">Features</a>
              <a href="#campaigns">Campaigns</a>
              <a href="#how-it-works">How It Works</a>
              <a href="#about">About</a>
            </div>
            <div className="nav-actions">
              <motion.button className="btn-theme-toggle" onClick={toggleTheme} whileTap={{ scale: 0.9 }}>
                <AnimatePresence mode="wait">
                  <motion.div key={theme} initial={{ rotate: -180, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 180, opacity: 0 }} transition={{ duration: 0.35 }}>
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                  </motion.div>
                </AnimatePresence>
              </motion.button>
              <ConnectButton.Custom>
                {({
                  account,
                  chain,
                  openAccountModal,
                  openChainModal,
                  openConnectModal,
                  authenticationStatus,
                  mounted,
                }) => {
                  const ready = mounted && authenticationStatus !== 'loading';
                  const connected = ready && account && chain;

                  return (
                    <div
                      {...(!ready && {
                        'aria-hidden': true,
                        style: { opacity: 0, pointerEvents: 'none', userSelect: 'none' },
                      })}
                    >
                      {(() => {
                        if (!connected) {
                          return (
                            <motion.button 
                              className="btn-connect" 
                              onClick={openConnectModal}
                              whileHover={{ scale: 1.05 }} 
                              whileTap={{ scale: 0.95 }}
                            >
                              Connect Wallet
                            </motion.button>
                          );
                        }

                        if (chain.unsupported) {
                          return (
                            <motion.button 
                              className="btn-connect" 
                              onClick={openChainModal}
                              whileHover={{ scale: 1.05 }} 
                              whileTap={{ scale: 0.95 }}
                              style={{ background: '#ef4444' }}
                            >
                              Wrong Network
                            </motion.button>
                          );
                        }

                        return (
                          <motion.button 
                            className="btn-connect" 
                            onClick={openAccountModal}
                            whileHover={{ scale: 1.05 }} 
                            whileTap={{ scale: 0.95 }}
                          >
                            {account.displayName}
                          </motion.button>
                        );
                      })()}
                    </div>
                  );
                }}
              </ConnectButton.Custom>
            </div>
          </div>
        </div>
      </motion.nav> 

      {/* Hero – unchanged */}
      <section className="hero">
        <div className="hero-bg">
          {[1,2,3].map(i => (
            <motion.div key={i} className={`gradient-orb orb-${i}`} animate={{ x: [0, 80, -80, 0], y: [0, -80, 80, 0] }} transition={{ duration: 25 + i * 5, repeat: Infinity, ease: "linear" }} />
          ))}
        </div>
        <div className="container">
          <motion.div className="hero-content" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <div className="hero-text">
              <motion.h1 className="hero-title">
                Your Voice,
                <span className="gradient-text"> Verified</span>
                <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity }} style={{ display: 'inline-block', marginLeft: '8px' }}>_</motion.span>
              </motion.h1>
              <motion.p className="hero-subtitle" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
                Transparent crowdfunding where backers vote on milestones, creators prove their work, and everyone wins.
              </motion.p>
              <motion.div className="hero-actions" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.6 }}>
                <motion.button className="btn-primary" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Explore Campaigns <ArrowRight size={20} /></motion.button>
                <motion.button className="btn-secondary" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Launch Project</motion.button>
              </motion.div>
            </div>
            <div className="hero-stats">
              {Object.entries(stats).map(([key, value], i) => (
                <motion.div key={key} className="stat-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.8 + i * 0.15 }} whileHover={{ y: -8 }}>
                  <div className="stat-value">${value}</div>
                  <div className="stat-label">{key === 'totalRaised' ? 'Total Raised' : key === 'campaigns' ? 'Campaigns' : 'Backers'}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features – now shows cards */}
      <section id="features" className="features">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose Vox?</h2>
            <p className="section-subtitle">Built for transparency, accountability, and community trust</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div key={index} className="feature-card" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} whileHover={{ y: -8 }}>
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Campaigns – now shows cards */}
      <section id="campaigns" className="campaigns">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Campaigns</h2>
            <a href="#" className="view-all">View All <ArrowRight size={16} /></a>
          </div>
          <div className="campaigns-grid">
            {campaigns.map((campaign, i) => (
              <motion.div key={campaign.id} className="campaign-card" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} whileHover={{ y: -8 }}>
                <div className="campaign-image">
                  <Image 
                    src={campaign.image} 
                    alt={campaign.title} 
                    width={800} 
                    height={500} 
                    className="object-cover"
                  />
                  <div className="campaign-badge">{campaign.daysLeft} days left</div>
                </div>
                <div className="campaign-content">
                  <h3 className="campaign-title">{campaign.title}</h3>
                  <p className="campaign-creator">by {campaign.creator}</p>
                  <div className="campaign-progress">
                    <div className="progress-bar">
                      <motion.div className="progress-fill" initial={{ width: 0 }} whileInView={{ width: `${campaign.progress}%` }} viewport={{ once: true }} transition={{ duration: 1.2, ease: "easeOut" }} />
                    </div>
                    <div className="progress-stats">
                      <span className="raised">{campaign.raised} raised</span>
                      <span className="goal">{campaign.progress}%</span>
                    </div>
                  </div>
                  <div className="campaign-meta">
                    <div className="meta-item"><Users size={16} /><span>{campaign.backers} backers</span></div>
                    <motion.button className="btn-view" whileHover={{ scale: 1.05 }}>View Details</motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works – now shows steps */}
      <section id="how-it-works" className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How Vox Works</h2>
            <p className="section-subtitle">Four simple steps to transparent, accountable crowdfunding</p>
          </div>
          <div className="steps-grid">
            {howItWorks.map((item, index) => (
              <motion.div key={index} className="step-card" initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.15 }}>
                <div className="step-number">{item.step}</div>
                <h3 className="step-title">{item.title}</h3>
                <p className="step-description">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA & Footer – unchanged */}
      <motion.section className="cta" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Make Your Voice Heard?</h2>
            <p className="cta-subtitle">Join thousands of backers and creators building the future of transparent crowdfunding</p>
            <Link href="/Dashboard">
              <motion.button className="btn-primary-large" whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
                Get Started <ArrowRight size={20} />
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.section>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="logo"><div className="logo-icon">V</div><span className="logo-text">Vox</span></div>
              <p className="footer-tagline">Your voice, verified.</p>
              <div className="social-links">
                <a href="#" className="social-link"><Twitter size={20} /></a>
                <a href="#" className="social-link"><Github size={20} /></a>
                <a href="#" className="social-link"><Send size={20} /></a>
              </div>
            </div>

            <div className="footer-links">
              <div className="footer-column">
                <h4>Platform</h4>
                <a href="#">Explore Campaigns</a>
                <a href="#">Create Campaign</a>
                <a href="#">Dashboard</a>
                <a href="#">My NFTs</a>
              </div>
              
              <div className="footer-column">
                <h4>Resources</h4>
                <a href="#">Documentation</a>
                <a href="#">Smart Contracts</a>
                <a href="#">GitHub</a>
                <a href="#">Support</a>
              </div>
              
              <div className="footer-column">
                <h4>Company</h4>
                <a href="#">About</a>
                <a href="#">Blog</a>
                <a href="#">Careers</a>
                <a href="#">Contact</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Vox. All rights reserved.</p>
            <div className="footer-legal">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}