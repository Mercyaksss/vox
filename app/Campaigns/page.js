'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Filter, ArrowRight, Users } from 'lucide-react';
import Navbar from '../Components/Navbar/Navbar';
import './page.scss';

export default function CampaignsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const campaigns = [
    { id: 1, image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800', title: 'DeFi Trading Platform', creator: '0x742d...9f2a', raised: '45.2 ETH', goal: '100 ETH', progress: 45, backers: 234, daysLeft: 12, category: 'DeFi' },
    { id: 2, image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800', title: 'NFT Marketplace v2', creator: '0x8a3c...4b1e', raised: '82.5 ETH', goal: '150 ETH', progress: 55, backers: 456, daysLeft: 8, category: 'NFT' },
    { id: 3, image: 'https://images.unsplash.com/photo-1512941675423-6b1e6b989b09?w=800', title: 'Web3 Analytics Dashboard', creator: '0x5d2a...7c9b', raised: '28.0 ETH', goal: '50 ETH', progress: 56, backers: 178, daysLeft: 15, category: 'Analytics' },
    { id: 4, image: 'https://images.unsplash.com/photo-1516321310762-4794372e7c9e?w=800', title: 'Decentralized Social Network', creator: '0x742d...9f2a', raised: '60.1 ETH', goal: '200 ETH', progress: 30, backers: 312, daysLeft: 20, category: 'Social' },
  ];

  const filteredCampaigns = campaigns.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.creator.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || c.category === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="campaigns-page">
      <Navbar />

      {/* Floating Orbs Background â€“ same as landing & dashboard */}
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

      <section className="campaigns">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="section-title">
              Explore Campaigns
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                style={{ display: 'inline-block', marginLeft: 12 }}
              >
                _
              </motion.span>
            </h2>
            <p className="section-subtitle">Discover Web3 projects and support their growth</p>
          </motion.div>

          {/* Search + Filter */}
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
                placeholder="Search campaigns..."
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
          </motion.div>

          {/* Campaign Grid â€“ EXACT same cards as landing page */}
          <motion.div
            className="campaigns-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {filteredCampaigns.length > 0 ? (
              filteredCampaigns.map((campaign, i) => (
                <motion.div
                  key={campaign.id}
                  className="campaign-card"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -12, boxShadow: "0 20px 50px rgba(124, 58, 237, 0.3)" }}
                >
                  <div className="campaign-image">
                    <img src={campaign.image} alt={campaign.title} />
                    <div className="campaign-badge">{campaign.daysLeft} days left</div>
                  </div>

                  <div className="campaign-content">
                    <h3 className="campaign-title">{campaign.title}</h3>
                    <p className="campaign-creator">by {campaign.creator}</p>

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
                        <motion.button
                          className="btn-view"
                          whileHover={{ scale: 1.08, background: "var(--accent)", color: "white" }}
                          whileTap={{ scale: 0.95 }}
                        >
                          View Details <ArrowRight size={16} />
                        </motion.button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                className="no-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p>No campaigns found. Try adjusting your search or filters.</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}