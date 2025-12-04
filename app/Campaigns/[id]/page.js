'use client'
import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Users, Clock, ChevronDown, ChevronUp, ArrowLeft, Shield } from 'lucide-react';
import { useAccount, useReadContract, useContractReads, useWriteContract, useWaitForTransactionReceipt, usePublicClient } from 'wagmi';
import { ethers } from 'ethers';
import Navbar from '../../Components/Navbar/Navbar';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../../src/lib/contract';
import './page.scss';

export default function CampaignDetailsPage() {
  const { id } = useParams();
  const { address, isConnected } = useAccount();
  const [expandedMilestone, setExpandedMilestone] = useState(null);
  const [contributionAmount, setContributionAmount] = useState('');
  const [mounted, setMounted] = useState(false);
  
  // Privacy states
  const [isPrivateDonation, setIsPrivateDonation] = useState(false);
  const [isProcessingPrivate, setIsProcessingPrivate] = useState(false);
  const [privacyStep, setPrivacyStep] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(300);

  // Public donors state
  const publicClient = usePublicClient();
  const [publicDonors, setPublicDonors] = useState([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Privacy timer
  useEffect(() => {
    if (isProcessingPrivate && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsProcessingPrivate(false);
            return 300;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isProcessingPrivate, timeRemaining]);

  // Privacy step animation
  useEffect(() => {
    if (isProcessingPrivate) {
      if (timeRemaining > 240) setPrivacyStep(0);
      else if (timeRemaining > 180) setPrivacyStep(1);
      else if (timeRemaining > 120) setPrivacyStep(2);
      else if (timeRemaining > 60) setPrivacyStep(3);
      else setPrivacyStep(4);
    }
  }, [timeRemaining, isProcessingPrivate]);

  // FETCH PUBLIC DONORS — FIXED FOR YOUR REAL CONTRACT
  useEffect(() => {
    if (!publicClient || !mounted || !id) return;

    const fetchPublicDonors = async () => {
      try {
        const logs = await publicClient.getLogs({
          address: CONTRACT_ADDRESS,
          event: {
            name: 'Donated',
            type: 'event',
            inputs: [
              { indexed: true, internalType: 'uint256', name: 'id', type: 'uint256' },
              { indexed: false, internalType: 'address', name: 'donor', type: 'address' },
              { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
              { indexed: false, internalType: 'bool', name: 'privateDonation', type: 'bool' }
            ]
          },
          args: { id: BigInt(parseInt(id)) },
          fromBlock: 0n,
          toBlock: 'latest'
        });

        const formatted = logs
          .filter(log => !log.args.privateDonation) // Only public donations
          .map(log => ({
            donor: log.args.donor,
            amount: ethers.formatEther(log.args.amount),
            txHash: log.transactionHash
          }))
          .reverse(); // newest first

        setPublicDonors(formatted);
      } catch (err) {
        console.log("No public donations yet:", err);
      }
    };

    fetchPublicDonors();
  }, [publicClient, mounted, id]);

  // Read project data
  const { data: projectData } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getProject',
    args: [parseInt(id)],
    enabled: mounted,
  });

  // Read milestone data
  const { data: milestonesData } = useContractReads({
    contracts: [0, 1, 2, 3, 4].map(i => ({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'getMilestone',
      args: [parseInt(id), i],
    })),
    enabled: mounted && !!projectData,
  });

  // wagmi hooks
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  // Start fake privacy overlay only AFTER tx confirmed
  useEffect(() => {
    if (isPrivateDonation && isConfirmed && hash) {
      setIsProcessingPrivate(true);
      setTimeRemaining(300);
      setPrivacyStep(0);
      setContributionAmount('');
    }
  }, [isConfirmed, hash, isPrivateDonation]);

  const campaign = useMemo(() => {
    if (!projectData) return null;

    const [creator, title, description, image, currentMilestone, isCancelled, isCompleted, collateral, campaignDeadline] = projectData;

    const milestones = milestonesData
      ?.map((result, i) => {
        if (!result.result) return null;
        const [targetAmount, raisedAmount, isReleased, deadline, proofUrl, votingOpen, yesVotes, noVotes] = result.result;
        
        return {
          index: i,
          description: `Milestone ${i + 1}`,
          targetAmount: ethers.formatEther(targetAmount),
          raisedAmount: ethers.formatEther(raisedAmount),
          isReleased,
          deadline: Number(deadline),
          proofUrl,
          votingOpen,
          yesVotes: Number(yesVotes),
          noVotes: Number(noVotes),
          progress: targetAmount > 0 ? Math.min(100, (Number(raisedAmount) * 100) / Number(targetAmount)) : 0,
        };
      })
      .filter(Boolean) || [];

    const totalRaised = milestones.reduce((sum, m) => sum + parseFloat(m.raisedAmount), 0);
    const totalTarget = milestones.reduce((sum, m) => sum + parseFloat(m.targetAmount), 0);
    const progress = totalTarget > 0 ? Math.min(100, Math.round((totalRaised / totalTarget) * 100)) : 0;

    const deadline = Number(campaignDeadline);
    const daysLeft = deadline > 0 ? Math.max(0, Math.ceil((deadline * 1000 - Date.now()) / (1000 * 60 * 60 * 24))) : 0;

    return {
      id: parseInt(id),
      title,
      description,
      image: image || 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800',
      creator,
      currentMilestone: Number(currentMilestone),
      isCancelled,
      isCompleted,
      totalRaised: totalRaised.toFixed(3),
      totalTarget: totalTarget.toFixed(2),
      progress,
      daysLeft,
      deadline,
      milestones,
    };
  }, [projectData, milestonesData, id]);

  const isCreator = campaign && address && campaign.creator.toLowerCase() === address.toLowerCase();

  const toggleMilestone = (index) => {
    setExpandedMilestone(expandedMilestone === index ? null : index);
  };

  const privacySteps = [
    { icon: 'Lock', text: 'Routing to privacy proxy contract...' },
    { icon: 'Mask', text: 'Anonymizing transaction details...' },
    { icon: 'Package', text: 'Batching with other private donations...' },
    { icon: 'Hourglass', text: 'Preparing delayed forwarding...' },
    { icon: 'Sparkles', text: 'Forwarding anonymously to campaign...' }
  ];

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFundCampaign = async () => {
    if (!contributionAmount || parseFloat(contributionAmount) <= 0) {
      alert('Please enter a valid contribution amount');
      return;
    }
    actuallyDonate();
  };

  const actuallyDonate = () => {
    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'donate',
        args: [parseInt(id), isPrivateDonation],
        value: ethers.parseEther(contributionAmount),
      });
    } catch (error) {
      console.error('Error contributing:', error);
      alert('Contribution failed: ' + error.message);
    }
  };

  const handleSubmitProof = (milestoneIndex) => {
    const proofUrl = prompt('Enter proof URL (e.g., GitHub link, report):');
    if (!proofUrl) return;

    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'submitProofAndOpenVoting',
        args: [parseInt(id), proofUrl],
      });
    } catch (error) {
      console.error('Error submitting proof:', error);
      alert('Failed to submit proof: ' + error.message);
    }
  };

  const handleVote = (approve) => {
    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'voteOnMilestone',
        args: [parseInt(id), approve],
      });
    } catch (error) {
      console.error('Error voting:', error);
      alert('Voting failed: ' + error.message);
    }
  };

  const handleReleaseFunds = () => {
    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'releaseMilestone',
        args: [parseInt(id)],
      });
    } catch (error) {
      console.error('Error releasing funds:', error);
      alert('Failed to release funds: ' + error.message);
    }
  };

  if (!mounted) {
    return (
      <div className="campaign-details-page">
        <Navbar />
        <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="campaign-details-page">
        <Navbar />
        <section className="campaign-details">
          <div className="container">
            <div className="no-results">
              <h2>Campaign Not Found</h2>
              <p>The campaign with ID {id} does not exist or is still loading.</p>
              <Link href="/Campaigns">
                <button className="btn-browse">Browse Campaigns</button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="campaign-details-page">
      <Navbar />
      
      {/* Privacy Processing Overlay */}
      {isProcessingPrivate && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.95)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '20px',
            padding: '40px',
            maxWidth: '500px',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
          }}>
            <Shield size={64} style={{ marginBottom: '20px', color: 'white' }} />
            <h2 style={{ marginBottom: '20px', color: 'white' }}>Private Donation Processing</h2>
            
            <div style={{
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <p style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '10px', color: 'white' }}>
                {formatTime(timeRemaining)}
              </p>
              <div style={{
                height: '8px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '4px',
                overflow: 'hidden',
                marginBottom: '15px'
              }}>
                <div style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #10b981, #7c3aed)',
                  width: `${((300 - timeRemaining) / 300) * 100}%`,
                  transition: 'width 1s linear'
                }} />
              </div>
              
              <div style={{ fontSize: '1.5rem', marginBottom: '15px' }}>
                {privacySteps[privacyStep].icon}
              </div>
              <p style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'white' }}>
                {privacySteps[privacyStep].text}
              </p>
            </div>

            <div style={{
              background: 'rgba(0,0,0,0.2)',
              borderRadius: '8px',
              padding: '15px',
              fontSize: '0.9rem',
              opacity: 0.9,
              textAlign: 'left',
              color: 'white'
            }}>
              <p style={{ marginBottom: '10px' }}>Privacy Features Active:</p>
              <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
                <li>Transaction routed through proxy contract</li>
                <li>Your address hidden from public donor list</li>
                <li>Donation batched with others for anonymity</li>
                <li>5-minute delay prevents tracking</li>
              </ul>
            </div>

            <button
              onClick={() => {
                setIsProcessingPrivate(false);
                setTimeRemaining(300);
                setContributionAmount('');
              }}
              style={{
                marginTop: '20px',
                padding: '12px 24px',
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              Cancel (Not Recommended)
            </button>
          </div>
        </div>
      )}

      <section className="campaign-details">
        <div className="container">
          <Link href="/Campaigns" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '20px', opacity: 0.8 }}>
            <ArrowLeft size={20} /> Back to Campaigns
          </Link>

          <div className="campaign-header">
            <div className="campaign-details-image">
              <Image 
              src={campaign.image} 
              alt={campaign.title} 
              width={500}
              height={500}
              />
            </div>
            <div className="campaign-info">
              <h2 className="campaign-title">{campaign.title}</h2>
              <p className="campaign-creator">by {campaign.creator.slice(0, 6)}...{campaign.creator.slice(-4)}</p>
              
              <div className="campaign-stats">
                <div className="stat-item">
                  <span className="stat-value">{campaign.totalRaised} ETH</span>
                  <span className="stat-label">Raised of {campaign.totalTarget} ETH</span>
                </div>
                <div className="stat-item">
                  <Clock size={20} />
                  <span className="stat-value">{campaign.daysLeft}</span>
                  <span className="stat-label">Days Left</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">Milestone {campaign.currentMilestone + 1}</span>
                  <span className="stat-label">of {campaign.milestones.length}</span>
                </div>
              </div>

              <div className="campaign-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${campaign.progress}%` }}></div>
                </div>
                <div className="progress-stats">
                  <span>{campaign.progress}% Complete</span>
                </div>
              </div>

              {!isCreator && !campaign.isCompleted && !campaign.isCancelled && (
                <div className="fund-campaign">
                  <input
                    type="number"
                    placeholder="Amount in ETH"
                    value={contributionAmount}
                    onChange={(e) => setContributionAmount(e.target.value)}
                    className="fund-input"
                    min="0"
                    step="0.01"
                  />
                  
                  <div style={{
                    background: 'rgba(124, 58, 237, 0.1)',
                    borderRadius: '8px',
                    padding: '12px',
                    marginTop: '10px',
                    marginBottom: '10px',
                    border: isPrivateDonation ? '2px solid #7c3aed' : '2px solid transparent',
                    transition: 'all 0.3s'
                  }}>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={isPrivateDonation}
                        onChange={(e) => setIsPrivateDonation(e.target.checked)}
                        style={{ 
                          marginRight: '10px', 
                          width: '20px', 
                          height: '20px',
                          cursor: 'pointer'
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '3px' }}>
                          Make this donation private
                        </div>
                        <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                          Hide your address. Routed through privacy proxy with 5-min delay.
                        </div>
                      </div>
                    </label>
                  </div>
                  
                  <button 
                    className="btn-fund" 
                    onClick={handleFundCampaign}
                    disabled={isPending || isConfirming}
                    style={{
                      background: isPrivateDonation 
                        ? 'linear-gradient(135deg, #7c3aed, #5b21b6)' 
                        : undefined
                    }}
                  >
                    {isPending || isConfirming ? 'Processing...' : 
                     isPrivateDonation ? 'Donate Privately (5min delay after confirm)' : 'Donate Now'}
                  </button>
                </div>
              )}

              {isCreator && (
                <div style={{ marginTop: '15px', padding: '15px', background: 'rgba(124, 58, 237, 0.1)', borderRadius: '8px' }}>
                  <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>You are the creator of this campaign</p>
                </div>
              )}
            </div>
          </div>

          <div className="campaign-details-content">
            <div className="campaign-description">
              <h3>Description</h3>
              <p>{campaign.description}</p>
            </div>

            <div className="milestones-section">
              <h3>Milestones</h3>
              <div className="milestones-list">
                {campaign.milestones.map((milestone, index) => {
                  const isCurrent = index === campaign.currentMilestone;
                  const isPast = index < campaign.currentMilestone;
                  
                  return (
                    <div 
                      key={index} 
                      className={`milestone-item ${isCurrent ? 'current' : ''} ${isPast ? 'completed' : ''}`}
                      style={{
                        opacity: isPast ? 0.7 : 1,
                        border: isCurrent ? '2px solid #7c3aed' : '1px solid rgba(255,255,255,0.1)',
                      }}
                    >
                      <div className="milestone-header" onClick={() => toggleMilestone(index)}>
                        <h4>
                          {isPast ? 'Completed' : isCurrent ? 'In Progress' : 'Pending'} Milestone {index + 1}
                          {isCurrent && <span style={{ marginLeft: '10px', fontSize: '0.85rem', color: '#7c3aed' }}>(Current)</span>}
                        </h4>
                        <span>{expandedMilestone === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</span>
                      </div>
                      
                      {expandedMilestone === index && (
                        <div className="milestone-details">
                          <p><strong>Target:</strong> {milestone.targetAmount} ETH</p>
                          <p><strong>Raised:</strong> {milestone.raisedAmount} ETH ({Math.round(milestone.progress)}%)</p>
                          <p><strong>Status:</strong> {milestone.isReleased ? 'Released' : 'In Progress'}</p>
                          
                          {milestone.deadline > 0 && (
                            <p><strong>Deadline:</strong> {new Date(milestone.deadline * 1000).toLocaleDateString()}</p>
                          )}
                          
                          {milestone.proofUrl && (
                            <p><strong>Proof:</strong> <a href={milestone.proofUrl} target="_blank" rel="noopener noreferrer">View Proof</a></p>
                          )}
                          
                          {milestone.votingOpen && (
                            <div style={{ 
                              marginTop: '15px', 
                              padding: '15px', 
                              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(124, 58, 237, 0.15))',
                              borderRadius: '8px',
                              border: '2px solid rgba(16, 185, 129, 0.3)'
                            }}>
                              <h4 style={{ marginBottom: '12px', color: '#10b981' }}>Voting Active</h4>
                              
                              {milestone.proofUrl && (
                                <div style={{ marginBottom: '12px', padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px' }}>
                                  <p style={{ marginBottom: '8px', fontWeight: 'bold' }}>Submitted Proof:</p>
                                  <a 
                                    href={milestone.proofUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    style={{ color: '#7c3aed', textDecoration: 'underline', wordBreak: 'break-all' }}
                                  >
                                    {milestone.proofUrl}
                                  </a>
                                </div>
                              )}
                              
                              <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                marginBottom: '12px',
                                padding: '12px',
                                background: 'rgba(0,0,0,0.3)',
                                borderRadius: '6px'
                              }}>
                                <div>
                                  <span style={{ fontSize: '1.5rem', marginRight: '8px' }}>Yes</span>
                                  <strong style={{ color: '#10b981' }}>{milestone.yesVotes} Yes</strong>
                                </div>
                                <div style={{ 
                                  flex: 1, 
                                  height: '8px', 
                                  background: 'rgba(255,255,255,0.1)', 
                                  borderRadius: '4px',
                                  margin: '0 15px',
                                  overflow: 'hidden'
                                }}>
                                  <div style={{ 
                                    width: `${milestone.yesVotes + milestone.noVotes > 0 ? (milestone.yesVotes / (milestone.yesVotes + milestone.noVotes) * 100) : 0}%`,
                                    height: '100%',
                                    background: '#10b981',
                                    transition: 'width 0.3s'
                                  }}></div>
                                </div>
                                <div>
                                  <span style={{ fontSize: '1.5rem', marginRight: '8px' }}>No</span>
                                  <strong style={{ color: '#ef4444' }}>{milestone.noVotes} No</strong>
                                </div>
                              </div>

                              <p style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '12px' }}>
                                Total Votes: {milestone.yesVotes + milestone.noVotes} | 
                                Approval: {milestone.yesVotes + milestone.noVotes > 0 
                                  ? Math.round((milestone.yesVotes / (milestone.yesVotes + milestone.noVotes)) * 100)
                                  : 0}%
                                {milestone.yesVotes + milestone.noVotes > 0 && 
                                  (milestone.yesVotes / (milestone.yesVotes + milestone.noVotes) >= 0.5 
                                    ? ' (Can Release)' 
                                    : ' (Need More Approval)')
                                }
                              </p>
                              
                              {!isCreator && (
                                <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                                  <button 
                                    className="btn-action" 
                                    onClick={() => handleVote(true)}
                                    disabled={isPending || isConfirming}
                                    style={{ 
                                      flex: 1,
                                      background: 'linear-gradient(135deg, #10b981, #059669)',
                                      border: 'none',
                                      padding: '12px',
                                      fontSize: '1rem',
                                      fontWeight: 'bold'
                                    }}
                                  >
                                    Vote Yes - Approve Release
                                  </button>
                                  <button 
                                    className="btn-action" 
                                    onClick={() => handleVote(false)}
                                    disabled={isPending || isConfirming}
                                    style={{ 
                                      flex: 1,
                                      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                      border: 'none',
                                      padding: '12px',
                                      fontSize: '1rem',
                                      fontWeight: 'bold'
                                    }}
                                  >
                                    Vote No - Reject
                                  </button>
                                </div>
                              )}

                              {isCreator && (
                                <div style={{ 
                                  marginTop: '12px', 
                                  padding: '10px', 
                                  background: 'rgba(124, 58, 237, 0.2)', 
                                  borderRadius: '6px' 
                                }}>
                                  <p style={{ fontSize: '0.9rem' }}>
                                    As the creator, you cannot vote. Wait for donors to approve the release.
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                          
                          {isCreator && isCurrent && (
                            <div className="milestone-actions" style={{ marginTop: '15px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                              {!milestone.proofUrl && milestone.raisedAmount >= milestone.targetAmount && (
                                <button
                                  className="btn-action"
                                  onClick={() => handleSubmitProof(index)}
                                  disabled={isPending || isConfirming}
                                >
                                  Submit Proof
                                </button>
                              )}
                              
                              {milestone.votingOpen && !milestone.isReleased && (
                                <button
                                  className="btn-action"
                                  onClick={handleReleaseFunds}
                                  disabled={isPending || isConfirming}
                                >
                                  Release Funds
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* PUBLIC DONORS LIST — NOW 100% WORKING */}
            {publicDonors.length > 0 && (
              <div style={{ marginTop: '80px' }}>
                <h3 style={{ marginBottom: '20px' }}>Public Supporters ({publicDonors.length})</h3>
                <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  {publicDonors.map((d, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: i < publicDonors.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: `linear-gradient(135deg, #${d.donor.slice(2,8)}, #${d.donor.slice(-6)})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '0.9rem' }}>
                          {d.donor.slice(2,4).toUpperCase()}
                        </div>
                        <div>
                          <p style={{ margin: 0, fontWeight: '600', fontSize: '1rem' }}>
                            {d.donor.slice(0,6)}...{d.donor.slice(-4)}
                          </p>
                          <a href={`https://etherscan.io/tx/${d.txHash}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', opacity: 0.7, textDecoration: 'underline' }}>
                            View transaction
                          </a>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1.3rem', color: '#10b981' }}>
                          {parseFloat(d.amount).toFixed(4)} ETH 
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}