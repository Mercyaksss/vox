// app/Dashboard/page.js
'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Users, Wallet, Award, Zap, Trophy, Rocket } from 'lucide-react';
import Navbar from '../Components/Navbar/Navbar';
import './page.scss';

export default function DashboardPage() {
  const [userAddress] = useState('0x742d...9f2a');

  const stats = {
    campaignsCreated: 2,
    totalContributed: '10.5 ETH',
    nftsOwned: 5,
  };

  const createdCampaigns = [
    { id: 1, image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800', title: 'DeFi Trading Platform', raised: '45.2 ETH', goal: '100 ETH', progress: 45, backers: 234, daysLeft: 12 },
    { id: 4, image: 'https://images.unsplash.com/photo-1516321310762-4794372e7c9e?w=800', title: 'Decentralized Social Network', raised: '60.1 ETH', goal: '200 ETH', progress: 30, backers: 312, daysLeft: 20 },
  ];

  const backedCampaigns = [
    { id: 2, image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800', title: 'NFT Marketplace v2', creator: '0x8a3c...4b1e', raised: '82.5 ETH', goal: '150 ETH', progress: 55, backers: 456, daysLeft: 8 },
  ];

  const nfts = [
    { id: 1, image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd66f30?w=800', name: 'Supporter Badge #001', campaign: 'DeFi Trading Platform' },
    { id: 2, image: 'https://images.unsplash.com/photo-1618042164219-62c3405d03b8?w=800', name: 'Contributor NFT #042', campaign: 'NFT Marketplace v2' },
    { id: 3, image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800', name: 'Early Backer #108', campaign: 'Web3 Analytics Tool' },
  ];

  return (
    <div className="dashboard-page">
      <Navbar />

      {/* Hero-style Dashboard Header */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <section className="dashboard">
          <div className="hero-bg">
            {[1, 2, 3].map(i => (
              <motion.div
                key={i}
                className={`gradient-orb orb-${i}`}
                animate={{ x: [0, 100, -100, 0], y: [0, -100, 100, 0] }}
                transition={{ duration: 30 + i * 8, repeat: Infinity, ease: "linear" }}
              />
            ))}
          </div>

          <div className="container">
            <motion.div
              className="section-header"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="section-title">
                Welcome back,
                <span className="gradient-text"> {userAddress}</span>
              </h2>
              <motion.p className="section-subtitle">
                Your voice is shaping the future of crowdfunding
                <motion.span
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  style={{ display: 'inline-block', marginLeft: 8 }}
                >
                  _
                </motion.span>
              </motion.p>
            </motion.div>

            {/* Stats Grid – Now with floating animation */}
            <div className="stats-grid">
              {[
                { icon: <Rocket size={32} />, value: stats.campaignsCreated, label: 'Campaigns Created' },
                { icon: <Wallet size={32} />, value: stats.totalContributed, label: 'Total Contributed' },
                { icon: <Trophy size={32} />, value: stats.nftsOwned, label: 'NFTs Owned' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  className="stat-card"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.15 }}
                  whileHover={{ y: -12, scale: 1.05, boxShadow: "0 20px 40px rgba(124, 58, 237, 0.3)" }}
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 8, repeat: Infinity }}
                  >
                    {stat.icon}
                  </motion.div>
                  <div className="stat-value gradient-text">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Your Campaigns */}
            <motion.div
              className="section"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="section-subheader">
                <h3>Your Campaigns</h3>
                <Link href="/Dashboard/MyCampaigns" className="view-all">
                  View All <ArrowRight size={16} />
                </Link>
              </div>

              <div className="campaigns-grid">
                {createdCampaigns.length > 0 ? (
                  createdCampaigns.map((campaign, i) => (
                    <motion.div
                      key={campaign.id}
                      className="campaign-card"
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.15 }}
                      whileHover={{ y: -12, boxShadow: "0 20px 50px rgba(124, 58, 237, 0.25)" }}
                    >
                      <div className="campaign-image">
                        <img src={campaign.image} alt={campaign.title} />
                        <div className="campaign-badge">{campaign.daysLeft} days left</div>
                      </div>
                      <div className="campaign-content">
                        <h3 className="campaign-title">{campaign.title}</h3>
                        <div className="campaign-progress">
                          <div className="progress-bar">
                            <motion.div
                              className="progress-fill"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${campaign.progress}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1.4, ease: "easeOut" }}
                            />
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
                          <Link href={`/Campaigns/${campaign.id}`}>
                            <motion.button className="btn-view" whileHover={{ scale: 1.08, background: "var(--accent)" }}>
                              View Details <ArrowRight size={16} />
                            </motion.button>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div className="no-results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <p>You haven't created any campaigns yet.</p>
                    <Link href="/Campaigns/Create">
                      <motion.button className="btn-create" whileHover={{ scale: 1.05 }}>
                        <Zap size={18} /> Create Campaign
                      </motion.button>
                    </Link>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Campaigns You've Backed */}
            <motion.div className="section" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <div className="section-subheader">
                <h3>Campaigns You've Backed</h3>
                <Link href="/Campaigns" className="view-all">Browse More <ArrowRight size={16} /></Link>
              </div>
              <div className="campaigns-grid">
                {backedCampaigns.length > 0 ? (
                  backedCampaigns.map((campaign, i) => (
                    <motion.div key={campaign.id} className="campaign-card" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} whileHover={{ y: -12 }}>
                      <div className="campaign-image">
                        <img src={campaign.image} alt={campaign.title} />
                        <div className="campaign-badge">{campaign.daysLeft} days left</div>
                      </div>
                      <div className="campaign-content">
                        <h3 className="campaign-title">{campaign.title}</h3>
                        <p className="campaign-creator">by {campaign.creator}</p>
                        <div className="campaign-progress">
                          <div className="progress-bar">
                            <motion.div className="progress-fill" initial={{ width: 0 }} whileInView={{ width: `${campaign.progress}%` }} transition={{ duration: 1.4 }} />
                          </div>
                          <div className="progress-stats">
                            <span className="raised">{campaign.raised} raised</span>
                            <span className="goal">{campaign.progress}%</span>
                          </div>
                        </div>
                        <div className="campaign-meta">
                          <div className="meta-item"><Users size={16} /><span>{campaign.backers} backers</span></div>
                          <Link href={`/Campaigns/${campaign.id}`}>
                            <motion.button className="btn-view" whileHover={{ scale: 1.08 }}>View <ArrowRight size={16} /></motion.button>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div className="no-results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <p>You haven't backed any campaigns yet.</p>
                    <Link href="/Campaigns">
                      <motion.button className="btn-create" whileHover={{ scale: 1.05 }}>
                        Explore Campaigns
                      </motion.button>
                    </Link>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Your NFTs */}
            <motion.div className="section" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <div className="section-subheader">
                <h3>Your NFT Rewards</h3>
                <Link href="/Dashboard/MyNfts" className="view-all">View All <ArrowRight size={16} /></Link>
              </div>
              <div className="nfts-grid">
                {nfts.map((nft, i) => (
                  <motion.div
                    key={nft.id}
                    className="nft-card"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -12, rotate: [0, 3, -3, 0], boxShadow: "0 20px 40px rgba(124, 58, 237, 0.3)" }}
                  >
                    <div className="nft-image">
                      <img src={nft.image} alt={nft.name} />
                    </div>
                    <div className="nft-content">
                      <h3 className="nft-title">{nft.name}</h3>
                      <p className="nft-campaign">from {nft.campaign}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}