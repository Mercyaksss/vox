// app/Dashboard/MyCampaigns/page.js
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Search, Plus, ArrowRight, Target } from 'lucide-react';
import { useAccount, useReadContract, useContractReads } from 'wagmi';
import { formatEther } from 'ethers';
import Navbar from '../../Components/Navbar/Navbar';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../../src/lib/contract';
import './page.scss';

// Animated background - disable SSR to prevent hydration errors
const AnimatedBackground = () => (
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
);

const AnimatedBg = dynamic(() => Promise.resolve(AnimatedBackground), { ssr: false });

export default function MyCampaignsPage() {
  const { address, isConnected } = useAccount();
  const [searchQuery, setSearchQuery] = useState('');
  const [myCampaigns, setMyCampaigns] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. Get total project count
  const { data: projectCount } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'projectCount',
  });

  // DEBUG: Log project count
  useEffect(() => {
    console.log('🔍 PROJECT COUNT:', projectCount ? Number(projectCount) : 'Loading...');
  }, [projectCount]);

  // 2. Generate project IDs: [0, 1, 2, ...]
  const projectIds = useMemo(() => {
    if (!projectCount) return [];
    const ids = Array.from({ length: Number(projectCount) }, (_, i) => i);
    console.log('🔍 PROJECT IDs:', ids);
    return ids;
  }, [projectCount]);

  // 3. Fetch all projects + their current milestone data
  const { data: rawProjects } = useContractReads({
    contracts: projectIds.flatMap(id => [
      {
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getProject',
        args: [id],
      },
      {
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getMilestone',
        args: [id, 0],
      },
    ]),
    enabled: isConnected && projectIds.length > 0,
  });

  // DEBUG: Log raw data
  useEffect(() => {
    console.log('🔍 RAW PROJECTS DATA:', rawProjects);
    console.log('🔍 YOUR WALLET ADDRESS:', address);
  }, [rawProjects, address]);

  // 4. Process and filter only YOUR campaigns
  useEffect(() => {
    if (!rawProjects || !address) {
      console.log('⚠️ Missing rawProjects or address');
      return;
    }

    const now = Math.floor(Date.now() / 1000);
    console.log('🔍 PROCESSING', projectIds.length, 'PROJECTS...');

    const campaigns = projectIds
      .map((id, index) => {
        const projectData = rawProjects[index * 2]?.result;
        const milestoneData = rawProjects[index * 2 + 1]?.result;

        console.log(`\n📦 Project ${id}:`, {
          projectData,
          milestoneData,
        });

        if (!projectData) {
          console.log(`❌ Project ${id}: No data`);
          return null;
        }

        const [creator, title, description, image, currentMilestone, isCancelled, isCompleted, collateral, campaignDeadline] = projectData;

        console.log(`📦 Project ${id} Details:`, {
          creator,
          title,
          yourAddress: address,
          isYours: creator.toLowerCase() === address.toLowerCase(),
          isCancelled,
          isCompleted,
        });

        // FILTER: Only show campaigns created by YOU
        if (creator.toLowerCase() !== address.toLowerCase()) {
          console.log(`⏭️ Project ${id}: Not yours, skipping`);
          return null;
        }

        console.log(`✅ Project ${id}: This is YOUR campaign!`);

        // Calculate raised amount from milestone
        const raisedAmount = milestoneData ? formatEther(milestoneData[1]) : '0';
        const targetAmount = milestoneData ? formatEther(milestoneData[0]) : '1';
        const progress = targetAmount !== '0' 
          ? Math.min(100, Math.round((parseFloat(raisedAmount) / parseFloat(targetAmount)) * 100))
          : 0;

        const deadline = Number(campaignDeadline);
        const daysLeft = deadline > now ? Math.ceil((deadline - now) / 86400) : 0;

        const campaign = {
          id,
          title,
          description,
          image: image || 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800',
          creator,
          currentMilestone: Number(currentMilestone),
          isCompleted,
          isCancelled,
          campaignDeadline: deadline,
          daysLeft,
          progress,
          raised: `${parseFloat(raisedAmount).toFixed(3)} ETH`,
          goal: `${parseFloat(targetAmount).toFixed(2)} ETH`,
          backers: 0,
        };

        console.log(`✅ Processed campaign:`, campaign);
        return campaign;
      })
      .filter(Boolean);

    console.log('🎯 FINAL CAMPAIGNS:', campaigns);
    setMyCampaigns(campaigns);
  }, [rawProjects, address, projectIds]);

  const filteredCampaigns = myCampaigns.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log('🔍 FILTERED CAMPAIGNS (after search):', filteredCampaigns);

  if (!mounted) {
    return (
      <div className="my-campaigns-page">
        <Navbar />
        <div className="container" style={{ textAlign: 'center', padding: '100px 20px' }}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="my-campaigns-page">
        <Navbar />
        <AnimatedBg />
        <div className="container" style={{ textAlign: 'center', padding: '100px 20px' }}>
          <p>Please connect your wallet to view your campaigns.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-campaigns-page">
      <Navbar />
      <AnimatedBg />

      <section className="my-campaigns">
        <div className="container">
          <motion.div className="section-header" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="section-title">
              My Campaigns
              <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2.5, repeat: Infinity }} style={{ display: 'inline-block', marginLeft: 12 }}>
                _
              </motion.span>
            </h2>
            <p className="section-subtitle">Manage your projects and track progress</p>
            
            {/* DEBUG INFO */}
            <p style={{ fontSize: '0.85rem', opacity: 0.6, marginTop: '10px' }}>
              Debug: {projectCount ? `${Number(projectCount)} projects` : 'Loading...'} | 
              {myCampaigns.length} yours | 
              Connected: {address?.slice(0, 8)}...
            </p>
          </motion.div>

          <motion.div className="campaign-controls" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <motion.div className="search-bar" whileHover={{ scale: 1.02 }}>
              <Search size={20} />
              <input
                type="text"
                placeholder="Search your campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </motion.div>

            <Link href="/Campaigns/Create">
              <motion.button className="btn-create" whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}>
                <Plus size={20} /> Create New Campaign
              </motion.button>
            </Link>
          </motion.div>

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
                  whileHover={{ y: -12 }}
                >
                  <div className="campaign-image">
                    <Image 
                      src={campaign.image} 
                      alt={campaign.title} 
                      width={500}
                      height={500}
                    />
                    <div className="campaign-badge">
                      {campaign.daysLeft > 0 ? `${campaign.daysLeft} days left` : campaign.isCompleted ? 'Completed' : 'Ended'}
                    </div>
                  </div>

                  <div className="campaign-content">
                    <h3 className="campaign-title">{campaign.title}</h3>
                    <p className="campaign-creator">by you</p>

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
                        <Target size={16} />
                        <span>Milestone {campaign.currentMilestone + 1}</span>
                      </div>
                      <Link href={`/Campaigns/${campaign.id}`}>
                        <motion.button className="btn-view" whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
                          Open <ArrowRight size={16} />
                        </motion.button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div className="no-results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p>You haven't launched any campaigns yet.</p>
                <p style={{ fontSize: '0.85rem', marginTop: '10px', opacity: 0.7 }}>
                  Check console (F12) for debug info
                </p>
                <Link href="/Campaigns/Create">
                  <motion.button className="btn-create" whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}>
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