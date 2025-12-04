// app/Dashboard/MyNfts/page.js
'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Trophy, Sparkles, Lock } from 'lucide-react';
import { 
  useAccount, 
  useReadContract, 
  useContractWrite, 
  useWaitForTransactionReceipt 
} from 'wagmi';
import { ethers } from 'ethers';
import Navbar from '../../Components/Navbar/Navbar';
import { CONTRACT_ADDRESS as CROWDFUND_ADDRESS, CONTRACT_ABI } from '../../src/lib/contract';
import './page.scss';

// YOUR NFT CONTRACT ADDRESS HERE
const NFT_CONTRACT_ADDRESS = "0x5Ff62eD0c1D1F7Bd3628eF48D8837360Baa6ffCD";

const NFT_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_baseTokenURI",
        "type": "string"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "ERC721IncorrectOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "ERC721InsufficientApproval",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "approver",
        "type": "address"
      }
    ],
    "name": "ERC721InvalidApprover",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      }
    ],
    "name": "ERC721InvalidOperator",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "ERC721InvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "receiver",
        "type": "address"
      }
    ],
    "name": "ERC721InvalidReceiver",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "ERC721InvalidSender",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "ERC721NonexistentToken",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "OwnableInvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "approved",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "ApprovalForAll",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "setApprovalForAll",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_newURI",
        "type": "string"
      }
    ],
    "name": "setBaseTokenURI",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "baseTokenURI",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "getApproved",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      }
    ],
    "name": "isApprovedForAll",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "ownerOf",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "interfaceId",
        "type": "bytes4"
      }
    ],
    "name": "supportsInterface",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "tokenURI",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const REAL_BRONZE_IMAGE = "https://gateway.pinata.cloud/ipfs/bafkreibmn3i2a7qjecia25ns5uddh6hpym4jo4m6hxmzslc3nnibjhocai";

export default function MyNFTsPage() {
  const { address, isConnected } = useAccount();
  const [searchQuery, setSearchQuery] = useState('');
  const [unlockedNFTs, setUnlockedNFTs] = useState([]);

  const { data: totalContributedRaw } = useReadContract({
    address: CROWDFUND_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getTotalContributions',
    args: [address],
    enabled: isConnected && !!address,
  });

  const { data: nftBalance } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: NFT_ABI,
    functionName: 'balanceOf',
    args: [address],
    enabled: isConnected && !!address,
  });

  const { writeContract, data: mintHash, isPending } = useContractWrite();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: mintHash ?? undefined,
  });

  const hasMinted = nftBalance && nftBalance > 0n;

  const mintBronze = () => {
    writeContract({
      address: NFT_CONTRACT_ADDRESS,
      abi: NFT_ABI,
      functionName: 'mint',
    });
  };

  const nftTiers = [
    {
      id: 1,
      threshold: 0.1,
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd66f30?w=800',
      name: 'Bronze Supporter Badge',
      description: 'Early supporter who contributed 0.1 ETH',
      tokenId: 1001,
      rarity: 'Common',
      unlockedAt: null,
      isReal: true,
    },
    {
      id: 2,
      threshold: 0.2,
      image: 'https://images.unsplash.com/photo-1618042164219-62c3405d03b8?w=800',
      name: 'Silver Contributor NFT',
      description: 'Dedicated backer who contributed 0.2 ETH',
      tokenId: 1042,
      rarity: 'Rare',
      unlockedAt: null,
      isReal: false,
    },
    {
      id: 3,
      threshold: 0.3,
      image: 'https://images.unsplash.com/photo-1621111841142-7ca978250d26?w=800',
      name: 'Gold Pioneer Badge',
      description: 'Elite supporter who contributed 0.3 ETH',
      tokenId: 1007,
      rarity: 'Epic',
      unlockedAt: null,
      isReal: false,
    },
  ];

  useEffect(() => {
    if (totalContributedRaw) {
      const totalETH = parseFloat(ethers.formatEther(totalContributedRaw));
      const unlocked = nftTiers
        .filter(nft => totalETH >= nft.threshold)
        .map(nft => ({ ...nft, unlockedAt: new Date().toISOString() }));
      setUnlockedNFTs(unlocked);
    }
  }, [totalContributedRaw]);

  const filteredNFTs = unlockedNFTs.filter(nft =>
    nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    nft.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const lockedNFTs = nftTiers.filter(tier => 
    !unlockedNFTs.some(unlocked => unlocked.id === tier.id)
  );

  const totalContributed = totalContributedRaw 
    ? parseFloat(ethers.formatEther(totalContributedRaw))
    : 0;

  if (!isConnected) {
    return (
      <div className="my-nfts-page">
        <Navbar />
        <div className="container" style={{ textAlign: 'center', padding: '100px 20px' }}>
          <p>Please connect your wallet to view your NFTs.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-nfts-page">
      <Navbar />
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
          <motion.div className="section-header" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h2 className="section-title">
              My NFT Collection
              <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2.5, repeat: Infinity }} style={{ display: 'inline-block', marginLeft: 12 }}>_</motion.span>
            </h2>
            <p className="section-subtitle">Your proof of support, forever on-chain</p>
            <p style={{ marginTop: '10px', fontSize: '0.95rem', opacity: 0.8 }}>
              Total Contributed: <strong>{totalContributed.toFixed(4)} ETH</strong>
            </p>
          </motion.div>

          {/* Search */}
          <motion.div className="nft-controls" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <motion.div className="search-bar" whileHover={{ scale: 1.02 }} whileFocus={{ scale: 1.02 }}>
              <Search size={20} />
              <input type="text" placeholder="Search your NFTs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </motion.div>
          </motion.div>

          {/* Unlocked NFTs */}
          {filteredNFTs.length > 0 && (
            <>
              <motion.h3 style={{ marginTop: '40px', marginBottom: '20px', fontSize: '1.5rem' }}>Unlocked NFTs ({filteredNFTs.length})</motion.h3>
              <motion.div className="nfts-grid" layout>
                {filteredNFTs.map((nft, i) => (
                  <motion.div
                    key={nft.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ delay: i * 0.1, type: "spring", stiffness: 120 }}
                    whileHover={{ y: -16, rotate: [0, 3, -3, 0], boxShadow: "0 25px 60px rgba(124, 58, 237, 0.4)" }}
                    className="nft-card"
                  >
                    <div className="nft-image">
                      <Image 
                        src={nft.isReal && hasMinted ? REAL_BRONZE_IMAGE : nft.image}
                        alt={nft.name}
                        width={400}
                        height={400}
                        style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                      />
                      <div className="nft-rarity-badge">#{nft.tokenId}</div>
                    </div>

                    <div className="nft-content">
                      <motion.h3 className="nft-title">{nft.name}</motion.h3>
                      <p className="nft-campaign">{nft.description}</p>
                      <p style={{ fontSize: '0.85rem', marginTop: '8px', opacity: 0.7 }}>
                        Rarity: <strong>{nft.rarity}</strong>
                      </p>

                      {/* MINT BUTTON – ONLY FOR BRONZE */}
                      {nft.isReal && totalContributed >= 0.1 && !hasMinted && (
                        <motion.button
                          className="btn-view"
                          onClick={mintBronze}
                          disabled={isPending || isConfirming}
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.95 }}
                          style={{ marginTop: '12px', background: 'var(--accent)' }}
                        >
                          {isPending || isConfirming ? 'Minting...' : 'Mint Bronze Badge'}
                        </motion.button>
                      )}

                      {nft.isReal && hasMinted && (
                        <Link href={`/Dashboard/MyNfts/${nft.id}`}>
                          <motion.button className="btn-view" whileHover={{ scale: 1.08, background: "var(--accent)" }} whileTap={{ scale: 0.95 }} style={{ marginTop: '12px' }}>
                            View Details <ArrowRight size={16} />
                          </motion.button>
                        </Link>
                      )}

                      {!nft.isReal && (
                        <Link href={`/Dashboard/MyNfts/${nft.id}`}>
                          <motion.button className="btn-view" whileHover={{ scale: 1.08, background: "var(--accent)" }} whileTap={{ scale: 0.95 }}>
                            View Details <ArrowRight size={16} />
                          </motion.button>
                        </Link>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}

          {/* Locked NFTs – unchanged */}
          {lockedNFTs.length > 0 && (
            <>
              <motion.h3 style={{ marginTop: '60px', marginBottom: '20px', fontSize: '1.5rem' }}>Locked NFTs ({lockedNFTs.length})</motion.h3>
              <motion.div className="nfts-grid" layout>
                {lockedNFTs.map((nft, i) => {
                  const remaining = nft.threshold - totalContributed;
                  return (
                    <motion.div
                      key={`locked-${nft.id}`}
                      className="nft-card locked"
                      style={{ opacity: 0.6, filter: 'grayscale(0.8)', position: 'relative' }}
                    >
                      <div className="nft-image" style={{ position: 'relative' }}>
                        <Image src={nft.image} alt={nft.name} width={400} height={400} style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(0,0,0,0.8)', padding: '15px', borderRadius: '12px' }}>
                          <Lock size={24} color="#fff" />
                        </div>
                      </div>
                      <div className="nft-content">
                        <h3 className="nft-title" style={{ opacity: 0.7 }}>{nft.name}</h3>
                        <p className="nft-campaign" style={{ opacity: 0.6 }}>{nft.description}</p>
                        <p style={{ fontSize: '0.85rem', marginTop: '12px', color: '#f59e0b', fontWeight: 600 }}>
                          Contribute {remaining.toFixed(4)} more ETH to unlock
                        </p>
                        <p style={{ fontSize: '0.8rem', marginTop: '4px', opacity: 0.6 }}>
                          Requires: {nft.threshold} ETH total
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </>
          )}

          {/* No NFTs */}
          {unlockedNFTs.length === 0 && lockedNFTs.length > 0 && (
            <motion.div className="no-results" style={{ marginTop: '40px' }}>
              <p>You haven't unlocked any NFTs yet.</p>
              <p style={{ marginTop: '10px', opacity: 0.8 }}>
                Start contributing to campaigns to unlock exclusive NFT rewards!
              </p>
              <Link href="/Campaigns">
                <motion.button className="btn-browse" style={{ marginTop: '20px' }}>
                  Back a Campaign
                </motion.button>
              </Link>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}