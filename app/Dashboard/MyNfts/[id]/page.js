// app/Dashboard/MyNfts/[id]/page.js
'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import Navbar from '../../../Components/Navbar/Navbar';
import Image from 'next/image';
import './page.scss';

export default function NFTDetailsPage() {
  const { id } = useParams();
  const [userAddress] = useState('0x742d...9f2a');

  const REAL_BRONZE_IMAGE = "https://gateway.pinata.cloud/ipfs/bafkreibmn3i2a7qjecia25ns5uddh6hpym4jo4m6hxmzslc3nnibjhocai";
  const isBronzeMinted = id === '1';

  const nft = {
    id: parseInt(id),
    name: isBronzeMinted ? 'Bronze Supporter Badge' : 'Supporter Badge #001',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd66f30?w=800',
    campaign: 'DeFi Trading Platform',
    campaignId: 1,
    tokenId: isBronzeMinted ? 1001 : 1001,
    owner: '0x742d...9f2a',
    mintDate: '2025-09-15',
    attributes: [
      { trait_type: 'Rarity', value: isBronzeMinted ? 'Common' : 'Rare' },
      { trait_type: 'Tier', value: isBronzeMinted ? 'Bronze' : 'Gold' },
      { trait_type: 'Edition', value: 'Soulbound' },
    ],
  };

  const isOwner = userAddress.toLowerCase() === nft.owner.toLowerCase();

  return (
    <div className="nft-details-page">
      <Navbar />
      <section className="nft-details">
        <div className="container">
          <div className="nft-header">
            <div className="nft-image">
              <Image 
                src={isBronzeMinted ? REAL_BRONZE_IMAGE : nft.image}
                alt={nft.name}
                width={600}
                height={600}
                style={{ 
                  width: '100%',
                  height: '100%',           // ← forces full height
                  objectFit: 'cover',
                  borderRadius: '16px'
                }}
                className="nft-detail-image"  // ← new class for extra control
              />
            </div>
            <div className="nft-info">
              <h2 className="nft-title">{nft.name}</h2>
              <p className="nft-campaign">
                From <Link href={`/campaigns/${nft.campaignId}`}>{nft.campaign}</Link>
              </p>
              <div className="nft-stats">
                <div className="stat-item">
                  <span className="stat-label">Token ID</span>
                  <span className="stat-value">#{nft.tokenId}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Owner</span>
                  <span className="stat-value">{nft.owner}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Mint Date</span>
                  <span className="stat-value">{nft.mintDate}</span>
                </div>
              </div>
              {isOwner && (
                <button className="btn-action" disabled>
                  Transfer NFT (Coming Soon)
                </button>
              )}
            </div>
          </div>

          <div className="nft-content">
            <div className="nft-attributes">
              <h3>Attributes</h3>
              <div className="attributes-grid">
                {nft.attributes.map((attr, index) => (
                  <div key={index} className="attribute-item">
                    <span className="attribute-type">{attr.trait_type}</span>
                    <span className="attribute-value">{attr.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}