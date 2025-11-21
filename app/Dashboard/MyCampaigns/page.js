'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Filter, Plus, ArrowRight, Users } from 'lucide-react';
import Navbar from '../../Components/Navbar/Navbar';
import './page.scss';

export default function MyCampaignsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const userAddress = '0x742d...9f2a';

  const campaigns = [
    { id: 1, image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800', title: 'DeFi Trading Platform', raised: '45.2 ETH', goal: '100 ETH', progress: 45, backers: 234, daysLeft: 12, category: 'DeFi' },
    { id: 4, image: 'https://images.unsplash.com/photo-1516321310762-4794372e7c9e?w=800', title: 'Decentralized Social Network', raised: '60.1 ETH', goal: '200 ETH', progress: 30, backers: 312, daysLeft: 20, category: 'Social' },
  ];

  const filteredCampaigns = campaigns.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || c.category === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="my-campaigns-page">
      <Navbar />

      {/* Floating Orbs Background */}
      <div className="hero-bg">
        {[1, 2, 3].map(i => (
          <motion.div
            key={i}
            className={`gradient-orb orb-${i}`}
            animate={{ x: [0, 100, -100, 0], y: [0, -100, 100, 0] }}
            transition={{ duration: 32 + i * 8, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </div>

      <section className="my-campaigns">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="section-title">
              My Campaigns
              <motion.span
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                style={{ display: 'inline-block', marginLeft: 12 }}
              >_</motion.span>
            </h2>
            <p className="section-subtitle">Manage your projects and track their progress</p>
          </motion.div>

          {/* Controls */}
          <motion.div
            className="campaign-controls"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <motion.div className="search-bar" whileHover={{ scale: 1.02 }}>
              <Search size={20} />
              <input
                type="text"
                placeholder="Search your campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </motion.div>

            <motion.div className="filter-bar" whileHover={{ scale: 1.02 }}>
              <Filter size={20} />
              <select onChange={(e) => setFilter(e.target.value)} value={filter}>
                <option value="all">All Categories</option>
                <option value="DeFi">DeFi</option>
                <option value="NFT">NFT</option>
                <option value="Analytics">Analytics</option>
                <option value="Social">Social</option>
              </select>
            </motion.div>

            <Link href="/Campaigns/Create">
              <motion.button
                className="btn-create"
                whileHover={{ scale: 1.06, boxShadow: "0 12px 30px rgba(124, 58, 237, 0.4)" }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus size={20} /> Create New Campaign
              </motion.button>
            </Link>
          </motion.div>

          {/* Campaigns Grid */}
          <motion.div className="campaigns-grid">
            {filteredCampaigns.length > 0 ? (
              filteredCampaigns.map((campaign, i) => (
                <motion.div
                  key={campaign.id}
                  className="campaign-card"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  whileHover={{ y: -12, boxShadow: "0 20px 50px rgba(124, 58, 237, 0.3)" }}
                >
                  <div className="campaign-image">
                    <img src={campaign.image} alt={campaign.title} />
                    <div className="campaign-badge">{campaign.daysLeft} days left</div>
                  </div>

                  <div className="campaign-content">
                    <h3 className="campaign-title">{campaign.title}</h3>
                    <p className="campaign-creator">by {userAddress}</p>

                    <div className="campaign-progress">
                      <div className="progress-bar">
                        <motion.div
                          className="progress-fill"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${campaign.progress}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
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
                        <motion.button
                          className="btn-view"
                          whileHover={{ scale: 1.08, background: "var(--accent)", color: "white" }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Manage <ArrowRight size={16} />
                        </motion.button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                className="no-results"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <p>You haven't launched any campaigns yet.</p>
                <Link href="/Campaigns/Create">
                  <motion.button
                    className="btn-create"
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Plus size={20} /> Create Your First Campaign
                  </motion.button>
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}