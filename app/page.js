'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Vote, Shield, Award, TrendingUp, Users, CheckCircle, Github, Twitter, Send, Sun, Moon } from 'lucide-react';
import './page.scss';

export default function VoxLandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState('light');
  const [stats, setStats] = useState({
    totalRaised: '2.5M',
    campaigns: '342',
    backers: '12.8K'
  });

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

  const features = [
    {
      icon: <Vote size={32} />,
      title: 'Democratic Voting',
      description: 'Backers vote on milestone completion. Your voice matters in every project decision.'
    },
    {
      icon: <Shield size={32} />,
      title: 'Protected Funds',
      description: 'Smart contracts ensure automatic refunds if milestones fail. Your investment is safe.'
    },
    {
      icon: <Award size={32} />,
      title: 'NFT Rewards',
      description: 'Earn collectible NFT badges as you contribute. Build your supporter legacy.'
    },
    {
      icon: <TrendingUp size={32} />,
      title: 'Milestone-Based',
      description: 'Funds released step-by-step as creators prove progress. No more empty promises.'
    }
  ];

  const campaigns = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
      title: 'DeFi Trading Platform',
      creator: '0x742d...9f2a',
      raised: '45.2 ETH',
      goal: '100 ETH',
      progress: 45,
      backers: 234,
      daysLeft: 12
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800',
      title: 'NFT Marketplace v2',
      creator: '0x8a3c...4b1e',
      raised: '82.5 ETH',
      goal: '150 ETH',
      progress: 55,
      backers: 456,
      daysLeft: 8
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
      title: 'Web3 Analytics Tool',
      creator: '0x5f2d...7c8a',
      raised: '38.9 ETH',
      goal: '75 ETH',
      progress: 52,
      backers: 189,
      daysLeft: 15
    }
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Creator Launches Campaign',
      description: 'Set goals, define milestones, and share your vision with the community.'
    },
    {
      step: '02',
      title: 'Backers Contribute',
      description: 'Support projects you believe in. Choose public or private contributions.'
    },
    {
      step: '03',
      title: 'Evidence & Voting',
      description: 'Creators submit proof of work. Backers vote to approve milestone completion.'
    },
    {
      step: '04',
      title: 'Funds Released',
      description: 'Approved milestones automatically release funds. Collect NFT badges as rewards.'
    }
  ];

  return (
    <div className="vox-landing" data-theme={theme}>
      {/* Navigation */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
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
              <button className="btn-theme-toggle" onClick={toggleTheme}>
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
              <button className="btn-connect">Connect Wallet</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Your Voice,
                <span className="gradient-text"> Verified</span>
              </h1>
              <p className="hero-subtitle">
                Transparent crowdfunding where backers vote on milestones, 
                creators prove their work, and everyone wins.
              </p>
              <div className="hero-actions">
                <button className="btn-primary">
                  Explore Campaigns
                  <ArrowRight size={20} />
                </button>
                <button className="btn-secondary">Launch Project</button>
              </div>
            </div>
            <div className="hero-stats">
              <div className="stat-card">
                <div className="stat-value">${stats.totalRaised}</div>
                <div className="stat-label">Total Raised</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.campaigns}</div>
                <div className="stat-label">Campaigns</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.backers}</div>
                <div className="stat-label">Backers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose Vox?</h2>
            <p className="section-subtitle">
              Built for transparency, accountability, and community trust
            </p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Campaigns */}
      <section id="campaigns" className="campaigns">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Campaigns</h2>
            <a href="#" className="view-all">
              View All <ArrowRight size={16} />
            </a>
          </div>
          <div className="campaigns-grid">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="campaign-card">
                <div className="campaign-image">
                  <img src={campaign.image} alt={campaign.title} />
                  <div className="campaign-badge">{campaign.daysLeft} days left</div>
                </div>
                <div className="campaign-content">
                  <h3 className="campaign-title">{campaign.title}</h3>
                  <p className="campaign-creator">by {campaign.creator}</p>
                  
                  <div className="campaign-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${campaign.progress}%` }}
                      ></div>
                    </div>
                    <div className="progress-stats">
                      <span className="raised">{campaign.raised} raised</span>
                      <span className="goal">{campaign.progress}%</span>
                    </div>
                  </div>
                  
                  <div className="campaign-meta">
                    <div className="meta-item">
                      <Users size={16} />
                      <span>{campaign.backers} backers</span>
                    </div>
                    <button className="btn-view">View Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How Vox Works</h2>
            <p className="section-subtitle">
              Four simple steps to transparent, accountable crowdfunding
            </p>
          </div>
          <div className="steps-grid">
            {howItWorks.map((item, index) => (
              <div key={index} className="step-card">
                <div className="step-number">{item.step}</div>
                <h3 className="step-title">{item.title}</h3>
                <p className="step-description">{item.description}</p>
                {index < howItWorks.length - 1 && (
                  <div className="step-connector">
                    <ArrowRight size={24} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Make Your Voice Heard?</h2>
            <p className="cta-subtitle">
              Join thousands of backers and creators building the future of transparent crowdfunding
            </p>
            <div className="cta-actions">
              <Link href="/Dashboard">
                <button className="btn-primary-large">
                  Get Started
                  <ArrowRight size={20} />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="logo">
                <div className="logo-icon">V</div>
                <span className="logo-text">Vox</span>
              </div>
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