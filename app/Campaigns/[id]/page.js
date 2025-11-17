'use client'
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Users, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import './page.scss';

export default function CampaignDetailsPage() {
  const { id } = useParams();
  const [userAddress] = useState('0x1234...abcd'); // Non-creator address for testing
  const [expandedMilestone, setExpandedMilestone] = useState(null);
  const [contributionAmount, setContributionAmount] = useState('');

  // Mock campaign data (consistent with campaigns/page.js)
  const campaigns = [
    {
      id: 1,
      title: 'DeFi Trading Platform',
      description:
        'A decentralized trading platform with low fees and high liquidity, built on Ethereum.',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
      creator: '0x742d...9f2a',
      goalAmount: '100 ETH',
      raisedAmount: '45.2 ETH',
      progress: 45,
      backers: 234,
      daysLeft: 12,
      deadline: '2025-10-26',
      isActive: true,
      milestones: [
        {
          description: 'Develop core smart contracts',
          fundingAmount: '30 ETH',
          deadline: '2025-10-20',
          completed: false,
          fundsReleased: false,
          votingActive: false,
          evidenceURI: '',
        },
        {
          description: 'Launch beta version',
          fundingAmount: '40 ETH',
          deadline: '2025-11-10',
          completed: false,
          fundsReleased: false,
          votingActive: false,
          evidenceURI: '',
        },
      ],
    },
    {
      id: 2,
      title: 'NFT Marketplace v2',
      description:
        'An upgraded NFT marketplace with advanced trading features and creator tools.',
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800',
      creator: '0x8a3c...4b1e',
      goalAmount: '150 ETH',
      raisedAmount: '82.5 ETH',
      progress: 55,
      backers: 456,
      daysLeft: 8,
      deadline: '2025-10-29',
      isActive: true,
      milestones: [
        {
          description: 'Implement trading engine',
          fundingAmount: '50 ETH',
          deadline: '2025-10-22',
          completed: false,
          fundsReleased: false,
          votingActive: false,
          evidenceURI: '',
        },
        {
          description: 'Release creator dashboard',
          fundingAmount: '60 ETH',
          deadline: '2025-11-05',
          completed: false,
          fundsReleased: false,
          votingActive: false,
          evidenceURI: '',
        },
      ],
    },
    {
      id: 3,
      title: 'Web3 Analytics Dashboard',
      description:
        'A powerful analytics platform for tracking Web3 project metrics.',
      image: 'https://images.unsplash.com/photo-1512941675423-6b1e6b989b09?w=800',
      creator: '0x5d2a...7c9b',
      goalAmount: '50 ETH',
      raisedAmount: '28.0 ETH',
      progress: 56,
      backers: 178,
      daysLeft: 15,
      deadline: '2025-11-05',
      isActive: true,
      milestones: [
        {
          description: 'Build data aggregation pipeline',
          fundingAmount: '20 ETH',
          deadline: '2025-10-25',
          completed: false,
          fundsReleased: false,
          votingActive: false,
          evidenceURI: '',
        },
        {
          description: 'Launch analytics UI',
          fundingAmount: '25 ETH',
          deadline: '2025-11-01',
          completed: false,
          fundsReleased: false,
          votingActive: false,
          evidenceURI: '',
        },
      ],
    },
    {
      id: 4,
      title: 'Decentralized Social Network',
      description:
        'A privacy-focused social network powered by blockchain technology.',
      image: 'https://images.unsplash.com/photo-1516321310762-4794372e7c9e?w=800',
      creator: '0x742d...9f2a',
      goalAmount: '200 ETH',
      raisedAmount: '60.1 ETH',
      progress: 30,
      backers: 312,
      daysLeft: 20,
      deadline: '2025-11-10',
      isActive: true,
      milestones: [
        {
          description: 'Develop user authentication system',
          fundingAmount: '70 ETH',
          deadline: '2025-10-30',
          completed: false,
          fundsReleased: false,
          votingActive: false,
          evidenceURI: '',
        },
        {
          description: 'Launch initial network features',
          fundingAmount: '80 ETH',
          deadline: '2025-11-08',
          completed: false,
          fundsReleased: false,
          votingActive: false,
          evidenceURI: '',
        },
      ],
    },
  ];

  // Find campaign by ID
  const campaign = campaigns.find((c) => c.id === parseInt(id));

  // Handle case where campaign is not found
  if (!campaign) {
    return (
      <div className="campaign-details-page">
        <Navbar />
        <section className="campaign-details">
          <div className="container">
            <div className="no-results">
              <h2>Campaign Not Found</h2>
              <p>The campaign with ID {id} does not exist.</p>
              <Link href="/campaigns">
                <button className="btn-browse">Browse Campaigns</button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const isCreator = userAddress.toLowerCase() === campaign.creator.toLowerCase();

  const toggleMilestone = (index) => {
    setExpandedMilestone(expandedMilestone === index ? null : index);
  };

  const handleFundCampaign = () => {
    if (!contributionAmount || parseFloat(contributionAmount) <= 0) {
      alert('Please enter a valid contribution amount');
      return;
    }
    // Placeholder for contribution logic
    console.log(`Funding campaign ${id} with ${contributionAmount} ETH`);
    // TODO: Integrate with smart contract (e.g., contribute function)
    /*
    try {
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);
      await contract.methods.contribute(id).send({
        from: userAddress,
        value: web3.utils.toWei(contributionAmount, 'ether'),
      });
      alert('Contribution successful!');
    } catch (error) {
      console.error('Error contributing:', error);
      alert('Contribution failed');
    }
    */
    setContributionAmount('');
  };

  const handleSubmitEvidence = (milestoneIndex) => {
    // Placeholder for submitting milestone evidence
    console.log(`Submitting evidence for milestone ${milestoneIndex} of campaign ${id}`);
    // TODO: Integrate with smart contract (e.g., submitEvidence function)
  };

  const handleStartVoting = (milestoneIndex) => {
    // Placeholder for starting milestone voting
    console.log(`Starting voting for milestone ${milestoneIndex} of campaign ${id}`);
    // TODO: Integrate with smart contract (e.g., startVoting function)
  };

  return (
    <div className="campaign-details-page">
      <Navbar />
      <section className="campaign-details">
        <div className="container">
          <div className="campaign-header">
            <div className="campaign-image">
              <img src={campaign.image} alt={campaign.title} />
            </div>
            <div className="campaign-info">
              <h2 className="campaign-title">{campaign.title}</h2>
              <p className="campaign-creator">by {campaign.creator}</p>
              <div className="campaign-stats">
                <div className="stat-item">
                  <span className="stat-value">{campaign.raisedAmount}</span>
                  <span className="stat-label">Raised of {campaign.goalAmount}</span>
                </div>
                <div className="stat-item">
                  <Users size={20} />
                  <span className="stat-value">{campaign.backers}</span>
                  <span className="stat-label">Backers</span>
                </div>
                <div className="stat-item">
                  <Clock size={20} />
                  <span className="stat-value">{campaign.daysLeft}</span>
                  <span className="stat-label">Days Left</span>
                </div>
              </div>
              <div className="campaign-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${campaign.progress}%` }}></div>
                </div>
                <div className="progress-stats">
                  <span>{campaign.progress}%</span>
                </div>
              </div>
              {!isCreator && campaign.isActive && (
                <div className="fund-campaign">
                  <input
                    type="number"
                    placeholder="Enter amount in ETH"
                    value={contributionAmount}
                    onChange={(e) => setContributionAmount(e.target.value)}
                    className="fund-input"
                    min="0"
                    step="0.01"
                  />
                  <button className="btn-fund" onClick={handleFundCampaign}>
                    Fund Campaign
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="campaign-content">
            <div className="campaign-description">
              <h3>Description</h3>
              <p>{campaign.description}</p>
            </div>

            <div className="milestones-section">
              <h3>Milestones</h3>
              <div className="milestones-list">
                {campaign.milestones.map((milestone, index) => (
                  <div key={index} className="milestone-item">
                    <div className="milestone-header" onClick={() => toggleMilestone(index)}>
                      <h4>Milestone {index + 1}: {milestone.description}</h4>
                      <span>{expandedMilestone === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</span>
                    </div>
                    {expandedMilestone === index && (
                      <div className="milestone-details">
                        <p><strong>Funding Amount:</strong> {milestone.fundingAmount}</p>
                        <p><strong>Deadline:</strong> {milestone.deadline}</p>
                        <p><strong>Status:</strong> {milestone.completed ? 'Completed' : 'In Progress'}</p>
                        <p><strong>Funds Released:</strong> {milestone.fundsReleased ? 'Yes' : 'No'}</p>
                        <p><strong>Voting Active:</strong> {milestone.votingActive ? 'Yes' : 'No'}</p>
                        {milestone.evidenceURI && (
                          <p><strong>Evidence:</strong> <a href={milestone.evidenceURI} target="_blank" rel="noopener noreferrer">View Evidence</a></p>
                        )}
                        {isCreator && !milestone.completed && (
                          <div className="milestone-actions">
                            <button
                              className="btn-action"
                              onClick={() => handleSubmitEvidence(index)}
                              disabled={milestone.evidenceURI || !campaign.isActive}
                            >
                              Submit Evidence
                            </button>
                            <button
                              className="btn-action"
                              onClick={() => handleStartVoting(index)}
                              disabled={!milestone.evidenceURI || milestone.votingActive || !campaign.isActive}
                            >
                              Start Voting
                            </button>
                          </div>
                        )}
                      </div>
                    )}
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