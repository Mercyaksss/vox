'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ArrowRight } from 'lucide-react';
import Navbar from '../../Components/Navbar/Navbar';
import './page.scss';

export default function MyNFTsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [userAddress] = useState('0x742d...9f2a'); // Mock wallet address

  // Mock data for NFTs owned by the user
  const nfts = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd66f30?w=800',
      name: 'Supporter Badge #001',
      campaign: 'DeFi Trading Platform',
      campaignId: 1,
      tokenId: 1001,
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1618042164219-62c3405d03b8?w=800',
      name: 'Contributor NFT #042',
      campaign: 'NFT Marketplace v2',
      campaignId: 2,
      tokenId: 1042,
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1621111841142-7ca978250d26?w=800',
      name: 'Pioneer Badge #007',
      campaign: 'Decentralized Social Network',
      campaignId: 4,
      tokenId: 1007,
    },
  ];

  const filteredNFTs = nfts.filter(
    (nft) =>
      nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nft.campaign.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="my-nfts-page">
      <Navbar />
      <section className="my-nfts">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">My NFTs</h2>
            <p className="section-subtitle">View your collection of NFT rewards from supported campaigns</p>
          </div>

          <div className="nft-controls">
            <div className="search-bar">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search your NFTs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="nfts-grid">
            {filteredNFTs.length > 0 ? (
              filteredNFTs.map((nft) => (
                <div key={nft.id} className="nft-card">
                  <div className="nft-image">
                    <img src={nft.image} alt={nft.name} />
                  </div>
                  <div className="nft-content">
                    <h3 className="nft-title">{nft.name}</h3>
                    <p className="nft-campaign">from {nft.campaign}</p>
                    <p className="nft-token-id">Token ID: {nft.tokenId}</p>
                    <Link href={`/Dashboard/MyNfts/${nft.id}`}>
                      <button className="btn-view">
                        View Details
                        <ArrowRight size={16} />
                      </button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <p>You haven't earned any NFTs yet. Back a campaign to start collecting!</p>
                <Link href="/campaigns">
                  <button className="btn-browse">Browse Campaigns</button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}