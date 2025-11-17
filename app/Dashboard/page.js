'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Users, Wallet, Award } from 'lucide-react';
import Navbar from '../Components/Navbar/Navbar';
import './page.scss';

export default function DashboardPage() {
  const [userAddress] = useState('0x742d...9f2a'); // Mock wallet address

  // Mock data for user stats
  const stats = {
    campaignsCreated: 2,
    totalContributed: '10.5 ETH',
    nftsOwned: 5,
  };

  // Mock data for campaigns created by the user
  const createdCampaigns = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
      title: 'DeFi Trading Platform',
      raised: '45.2 ETH',
      goal: '100 ETH',
      progress: 45,
      backers: 234,
      daysLeft: 12,
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1516321310762-4794372e7c9e?w=800',
      title: 'Decentralized Social Network',
      raised: '60.1 ETH',
      goal: '200 ETH',
      progress: 30,
      backers: 312,
      daysLeft: 20,
    },
  ];

  // Mock data for campaigns backed by the user
  const backedCampaigns = [
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800',
      title: 'NFT Marketplace v2',
      creator: '0x8a3c...4b1e',
      raised: '82.5 ETH',
      goal: '150 ETH',
      progress: 55,
      backers: 456,
      daysLeft: 8,
    },
  ];

  // Mock data for NFTs owned by the user
  const nfts = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd66f30?w=800',
      name: 'Supporter Badge #001',
      campaign: 'DeFi Trading Platform',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1618042164219-62c3405d03b8?w=800',
      name: 'Contributor NFT #042',
      campaign: 'NFT Marketplace v2',
    },
  ];

  return (
    <div className="dashboard-page">
      <Navbar />
      <section className="dashboard">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Your Dashboard</h2>
            <p className="section-subtitle">Manage your campaigns, contributions, and NFTs</p>
          </div>

          {/* Stats Section */}
          <div className="stats-grid">
            <div className="stat-card">
              <Users size={24} />
              <div className="stat-value">{stats.campaignsCreated}</div>
              <div className="stat-label">Campaigns Created</div>
            </div>
            <div className="stat-card">
              <Wallet size={24} />
              <div className="stat-value">{stats.totalContributed}</div>
              <div className="stat-label">Total Contributed</div>
            </div>
            <div className="stat-card">
              <Award size={24} />
              <div className="stat-value">{stats.nftsOwned}</div>
              <div className="stat-label">NFTs Owned</div>
            </div>
          </div>

          {/* Created Campaigns Section */}
          <div className="section">
            <div className="section-subheader">
              <h3>Your Campaigns</h3>
              <Link href="/Dashboard/MyCampaigns" className="view-all">
                View All <ArrowRight size={16} />
              </Link>
            </div>
            <div className="campaigns-grid">
              {createdCampaigns.length > 0 ? (
                createdCampaigns.slice(0, 2).map((campaign) => (
                  <div key={campaign.id} className="campaign-card">
                    <div className="campaign-image">
                      <img src={campaign.image} alt={campaign.title} />
                      <div className="campaign-badge">{campaign.daysLeft} days left</div>
                    </div>
                    <div className="campaign-content">
                      <h3 className="campaign-title">{campaign.title}</h3>
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
                        <Link href={`/Campaigns/${campaign.id}`}>
                          <button className="btn-view">
                            View Details
                            <ArrowRight size={16} />
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-results">
                  <p>You haven't created any campaigns yet.</p>
                  <Link href="/Campaigns/Create">
                    <button className="btn-create">Create Campaign</button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Backed Campaigns Section */}
          <div className="section">
            <div className="section-subheader">
              <h3>Campaigns You've Backed</h3>
              <Link href="/Campaigns" className="view-all">
                Browse More <ArrowRight size={16} />
              </Link>
            </div>
            <div className="campaigns-grid">
              {backedCampaigns.length > 0 ? (
                backedCampaigns.slice(0, 2).map((campaign) => (
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
                        <Link href={`/Campaigns/${campaign.id}`}>
                          <button className="btn-view">
                            View Details
                            <ArrowRight size={16} />
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-results">
                  <p>You haven't backed any campaigns yet.</p>
                  <Link href="/Campaigns">
                    <button className="btn-create">Browse Campaigns</button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* NFTs Section */}
          <div className="section">
            <div className="section-subheader">
              <h3>Your NFTs</h3>
              <Link href="/Dashboard/MyNfts" className="view-all">
                View All <ArrowRight size={16} />
              </Link>
            </div>
            <div className="nfts-grid">
              {nfts.length > 0 ? (
                nfts.slice(0, 3).map((nft) => (
                  <div key={nft.id} className="nft-card">
                    <div className="nft-image">
                      <img src={nft.image} alt={nft.name} />
                    </div>
                    <div className="nft-content">
                      <h3 className="nft-title">{nft.name}</h3>
                      <p className="nft-campaign">from {nft.campaign}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-results">
                  <p>You haven't earned any NFTs yet.</p>
                  <Link href="/Campaigns">
                    <button className="btn-create">Back a Campaign</button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}