'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, ArrowRight, Users } from 'lucide-react';
import Navbar from '../../Components/Navbar/Navbar';
import './page.scss';

export default function MyCampaignsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  // Mock data for campaigns created by the user
  const userAddress = '0x742d...9f2a'; // Mock wallet address
  const campaigns = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
      title: 'DeFi Trading Platform',
      creator: userAddress,
      raised: '45.2 ETH',
      goal: '100 ETH',
      progress: 45,
      backers: 234,
      daysLeft: 12,
      category: 'DeFi',
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1516321310762-4794372e7c9e?w=800',
      title: 'Decentralized Social Network',
      creator: userAddress,
      raised: '60.1 ETH',
      goal: '200 ETH',
      progress: 30,
      backers: 312,
      daysLeft: 20,
      category: 'Social',
    },
  ];

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.creator.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || campaign.category === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="my-campaigns-page">
      <Navbar />
      <section className="my-campaigns">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">My Campaigns</h2>
            <p className="section-subtitle">Manage your Web3 projects and track their progress</p>
          </div>

          <div className="campaign-controls">
            <div className="search-bar">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search your campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="filter-bar">
              <Filter size={20} />
              <select onChange={(e) => setFilter(e.target.value)} value={filter}>
                <option value="all">All Categories</option>
                <option value="DeFi">DeFi</option>
                <option value="NFT">NFT</option>
                <option value="Analytics">Analytics</option>
                <option value="Social">Social</option>
              </select>
            </div>
            <Link href="/campaigns/create">
              <button className="btn-create">Create New Campaign</button>
            </Link>
          </div>

          <div className="campaigns-grid">
            {filteredCampaigns.length > 0 ? (
              filteredCampaigns.map((campaign) => (
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
                      <Link href={`/campaigns/${campaign.id}`}>
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
                <p>No campaigns found. Create a new campaign to get started!</p>
                <Link href="/campaigns/create">
                  <button className="btn-create">Create Campaign</button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}