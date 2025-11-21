'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Trophy, Sparkles } from 'lucide-react';
import Navbar from '../../Components/Navbar/Navbar';
import './page.scss';

export default function MyNFTsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const nfts = [
    { id: 1, image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd66f30?w=800', name: 'Supporter Badge #001', campaign: 'DeFi Trading Platform', tokenId: 1001 },
    { id: 2, image: 'https://images.unsplash.com/photo-1618042164219-62c3405d03b8?w=800', name: 'Contributor NFT #042', campaign: 'NFT Marketplace v2', tokenId: 1042 },
    { id: 3, image: 'https://images.unsplash.com/photo-1621111841142-7ca978250d26?w=800', name: 'Pioneer Badge #007', campaign: 'Decentralized Social Network', tokenId: 1007 },
    { id: 4, image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800', name: 'Early Backer #108', campaign: 'Web3 Analytics Tool', tokenId: 1108 },
  ];

  const filteredNFTs = nfts.filter(nft =>
    nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    nft.campaign.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="my-nfts-page">
      <Navbar />

      {/* Floating Orbs Background */}
      <div className="hero-bg">
        {[1, 2, 3].map(i => (
          <motion.div
            key={i}
            className={`gradient-orb orb-${i}`}
            animate={{ x: [0, 130, -130, 0], y: [0, -130, 130, 0] }}
            transition={{ duration: 38 + i * 9, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </div>

      <section className="my-nfts">
        <div className="container">
          {/* Header */}
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="section-title">
              My NFT Collection
              <motion.span
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                style={{ display: 'inline-block', marginLeft: 12 }}
              >_</motion.span>
            </h2>
            <p className="section-subtitle">
              <Sparkles size={20} /> Your proof of support, forever on-chain
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            className="nft-controls"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <motion.div
              className="search-bar"
              whileHover={{ scale: 1.02 }}
              whileFocus={{ scale: 1.02 }}
            >
              <Search size={20} />
              <input
                type="text"
                placeholder="Search your NFTs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </motion.div>
          </motion.div>

          {/* NFT Grid */}
          <motion.div className="nfts-grid" layout>
            {filteredNFTs.length > 0 ? (
              filteredNFTs.map((nft, i) => (
                <motion.div
                  key={nft.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: i * 0.1, type: "spring", stiffness: 120 }}
                  whileHover={{
                    y: -16,
                    rotate: [0, 3, -3, 0],
                    boxShadow: "0 25px 60px rgba(124, 58, 237, 0.4)",
                    transition: { duration: 0.3 }
                  }}
                  className="nft-card"
                >
                  <div className="nft-image">
                    <img src={nft.image} alt={nft.name} />
                    <div className="nft-rarity-badge">
                      <Trophy size={16} /> #{nft.tokenId}
                    </div>
                  </div>

                  <div className="nft-content">
                    <motion.h3
                      className="nft-title"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                    >
                      {nft.name}
                    </motion.h3>
                    <p className="nft-campaign">from {nft.campaign}</p>

                    <Link href={`/Dashboard/MyNfts/${nft.id}`}>
                      <motion.button
                        className="btn-view"
                        whileHover={{ scale: 1.08, background: "var(--accent)" }}
                        whileTap={{ scale: 0.95 }}
                      >
                        View Details <ArrowRight size={16} />
                      </motion.button>
                    </Link>
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
                <p>You haven't collected any NFTs yet.</p>
                <Link href="/Campaigns">
                  <motion.button
                    className="btn-browse"
                    whileHover={{ scale: 1.06, boxShadow: "0 15px 40px rgba(124, 58, 237, 0.4)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Sparkles size={20} /> Back a Campaign
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