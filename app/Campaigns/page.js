// app/Campaigns/page.js
'use client'
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Search, Filter, ArrowRight, Users, Clock } from 'lucide-react';
import { useAccount, useReadContract, useContractReads } from 'wagmi';
import { ethers } from 'ethers';
import Navbar from '../Components/Navbar/Navbar';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../src/lib/contract';
import './page.scss';

// Animated background - disable SSR
const AnimatedBackground = () => (
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
);

const AnimatedBg = dynamic(() => Promise.resolve(AnimatedBackground), { ssr: false });

export default function CampaignsPage() {
  const { address, isConnected } = useAccount();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. Get total number of projects
  const { data: projectCount } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'projectCount',
  });

  // 2. Generate array of IDs: [0, 1, 2, ...]
  const projectIds = useMemo(() => {
    if (!projectCount) return [];
    return Array.from({ length: Number(projectCount) }, (_, i) => i);
  }, [projectCount]);

  // 3. Batch-read all project data + first milestone (for raised amount)
  const { data: rawData } = useContractReads({
    contracts: projectIds.flatMap(id => [
      { address: CONTRACT_ADDRESS, abi: CONTRACT_ABI, functionName: 'getProject', args: [id] },
      { address: CONTRACT_ADDRESS, abi: CONTRACT_ABI, functionName: 'getMilestone', args: [id, 0] }, // FIXED: Get milestone data instead
    ]),
    enabled: projectIds.length > 0,
  });

  // 4. Process into campaign objects
  const campaigns = useMemo(() => {
    if (!rawData || rawData.length === 0) return [];

    return projectIds
      .map((id, i) => {
        const projectInfo = rawData[i * 2]?.result;
        const milestoneInfo = rawData[i * 2 + 1]?.result;

        if (!projectInfo) return null;

        const [creator, title, description, image, currentMilestone, isCancelled, isCompleted, collateral, campaignDeadline] = projectInfo;
        
        // Skip cancelled/completed projects
        if (isCancelled || isCompleted) return null;

        // Get raised and target from milestone
        const raisedAmount = milestoneInfo ? ethers.formatEther(milestoneInfo[1]) : '0';
        const targetAmount = milestoneInfo ? ethers.formatEther(milestoneInfo[0]) : '1';
        
        const progress = targetAmount !== '0' 
          ? Math.min(100, Math.round((parseFloat(raisedAmount) / parseFloat(targetAmount)) * 100))
          : 0;
        
        const deadline = Number(campaignDeadline);
        const daysLeft = Math.max(0, Math.ceil((deadline * 1000 - Date.now()) / (1000 * 60 * 60 * 24)));

        return {
          id,
          title,
          creator: `${creator.slice(0, 6)}...${creator.slice(-4)}`,
          image: image || 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800',
          raised: `${parseFloat(raisedAmount).toFixed(3)} ETH`,
          goal: `${parseFloat(targetAmount).toFixed(2)} ETH`,
          progress,
          backers: 0, // Add getPublicDonors count if needed
          daysLeft,
          category: 'Web3',
        };
      })
      .filter(Boolean);
  }, [rawData, projectIds]);

  // Client-side filtering
  const filteredCampaigns = campaigns.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.creator.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!mounted) {
    return (
      <div className="campaigns-page">
        <Navbar />
        <div className="container" style={{ textAlign: 'center', padding: '100px 20px' }}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="campaigns-page">
      <Navbar />
      <AnimatedBg />

      <section className="campaigns">
        <div className="container">
          <motion.div className="section-header" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
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
          <motion.div className="campaign-controls" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <motion.div className="search-bar" whileHover={{ scale: 1.02 }}>
              <Search size={20} />
              <input
                type="text"
                placeholder="Search by title or creator..."
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
                <option value="Social">Social</option>
                <option value="Tooling">Tooling</option>
              </select>
            </motion.div>
          </motion.div>

          {/* Campaign Grid */}
          <motion.div className="campaigns-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
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
                    <Image
                      src={campaign.image}
                      alt={campaign.title}
                      width={800}
                      height={400}
                      className="object-cover"
                      unoptimized
                    />
                    <div className="campaign-badge">
                      <Clock size={14} /> {campaign.daysLeft} days
                    </div>
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
                          whileHover={{ scale: 1.08 }}
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
              <motion.div className="no-results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p>
                  {campaigns.length === 0
                    ? "No campaigns live yet. Be the first to create one!"
                    : "No campaigns match your search."}
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}