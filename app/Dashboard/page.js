// app/Dashboard/page.js
'use client'
import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image'; // ← Added
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Users, Wallet, Award, Zap, Trophy, Rocket } from 'lucide-react';
import { useAccount, useReadContract, useContractReads } from 'wagmi';
import { ethers } from 'ethers';
import Navbar from '../Components/Navbar/Navbar';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../src/lib/contract';
import './page.scss';

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const [stats, setStats] = useState({
    campaignsCreated: 0,
    totalContributed: '0 ETH',
    nftsOwned: 0,
  });
  const [createdCampaigns, setCreatedCampaigns] = useState([]);
  const [backedCampaigns, setBackedCampaigns] = useState([]);
  const [nfts, setNfts] = useState([]);

  const { data: projectCount } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'projectCount',
    enabled: isConnected,
  });

  const projectIds = useMemo(() => {
    if (!projectCount) return [];
    return Array.from({ length: Number(projectCount) }, (_, i) => i);
  }, [projectCount]);

  const { data: batchData } = useContractReads({
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
        functionName: 'getDonation',
        args: [id, address],
      },
    ]),
    enabled: isConnected && projectIds.length > 0,
  });

  const { data: totalContributedRaw } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getTotalContributions',
    args: [address],
    enabled: isConnected,
  });

  useEffect(() => {
    if (batchData && projectIds.length > 0) {
      const projects = [];
      const created = [];
      const backed = [];

      for (let i = 0; i < projectIds.length; i++) {
        const projectData = batchData[i * 2]?.result;
        const donationData = batchData[i * 2 + 1]?.result;

        if (projectData) {
          const project = {
            id: projectIds[i],
            creator: projectData[0],
            title: projectData[1],
            description: projectData[2],
            image: projectData[3],
            currentMilestone: Number(projectData[4]),
            isCancelled: projectData[5],
            isCompleted: projectData[6],
            collateralAmount: ethers.formatEther(projectData[7]),
            campaignDeadline: Number(projectData[8]),
          };
          projects.push(project);

          if (project.creator.toLowerCase() === address?.toLowerCase()) {
            created.push({
              ...project,
              raised: '0 ETH',
              goal: '0 ETH',
              progress: 0,
              backers: 0,
              daysLeft: 0,
            });
          }

          if (donationData && Number(donationData) > 0) {
            backed.push({
              ...project,
              raised: '0 ETH',
              goal: '0 ETH',
              progress: 0,
              backers: 0,
              daysLeft: 0,
            });
          }
        }
      }

      setCreatedCampaigns(created);
      setBackedCampaigns(backed);

      setStats(prev => ({
        ...prev,
        campaignsCreated: created.length,
      }));
    }
  }, [batchData, projectIds, address]);

  useEffect(() => {
    if (totalContributedRaw) {
      setStats(prev => ({
        ...prev,
        totalContributed: `${ethers.formatEther(totalContributedRaw)} ETH`,
      }));
    }
  }, [totalContributedRaw]);

  useEffect(() => {
    setNfts([
      { id: 1, image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd66f30?w=800', name: 'Supporter Badge #001', campaign: 'DeFi Trading Platform' },
    ]);
    setStats(prev => ({ ...prev, nftsOwned: nfts.length }));
  }, []);

  if (!isConnected) {
    return <div className="dashboard-page">Please connect your wallet to view dashboard.</div>;
  }

  return (
    <div className="dashboard-page">
      <Navbar />

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
                <span className="gradient-text"> {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''}</span>
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
                      whileHover={{ y: -12 }}
                    >
                      <div className="campaign-image">
                        <Image
                          src={campaign.image || 'https://placeholder.com/400x200'}
                          alt={campaign.title}
                          width={500}
                          height={300}
                          className="object-cover"
                        />
                        <div className="campaign-badge">{campaign.daysLeft || 'N/A'} days left</div>
                      </div>
                      <div className="campaign-content">
                        <h3 className="campaign-title">{campaign.title}</h3>
                        <p className="campaign-creator">by you</p>
                        <div className="campaign-progress">
                          <div className="progress-bar">
                            <motion.div className="progress-fill" initial={{ width: 0 }} whileInView={{ width: `${campaign.progress || 0}%` }} transition={{ duration: 1.4 }} />
                          </div>
                          <div className="progress-stats">
                            <span className="raised">{campaign.raised} raised</span>
                            <span className="goal">{campaign.progress || 0}%</span>
                          </div>
                        </div>
                        <div className="campaign-meta">
                          <div className="meta-item"><Users size={16} /><span>{campaign.backers || 0} backers</span></div>
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
                        <Image
                          src={campaign.image || 'https://placeholder.com/400x200'}
                          alt={campaign.title}
                          width={500}
                          height={300}
                          className="object-cover"
                        />
                        <div className="campaign-badge">{campaign.daysLeft || 'N/A'} days left</div>
                      </div>
                      <div className="campaign-content">
                        <h3 className="campaign-title">{campaign.title}</h3>
                        <p className="campaign-creator">by {campaign.creator.slice(0, 6)}...{campaign.creator.slice(-4)}</p>
                        <div className="campaign-progress">
                          <div className="progress-bar">
                            <motion.div className="progress-fill" initial={{ width: 0 }} whileInView={{ width: `${campaign.progress || 0}%` }} transition={{ duration: 1.4 }} />
                          </div>
                          <div className="progress-stats">
                            <span className="raised">{campaign.raised} raised</span>
                            <span className="goal">{campaign.progress || 0}%</span>
                          </div>
                        </div>
                        <div className="campaign-meta">
                          <div className="meta-item"><Users size={16} /><span>{campaign.backers || 0} backers</span></div>
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
                      <Image
                        src={nft.image}
                        alt={nft.name}
                        width={500}
                        height={500}
                        className="object-cover"
                      />
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