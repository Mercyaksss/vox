'use client'
import React, { useState } from 'react';
import Navbar from '../../Components/Navbar/Navbar';
import './page.scss';

export default function CreateCampaignPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageURI: '',
    goalAmount: '',
    durationInDays: '',
    milestones: [{ description: '', fundingAmount: '', durationInDays: '' }],
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleMilestoneChange = (index, field, value) => {
    const newMilestones = [...formData.milestones];
    newMilestones[index][field] = value;
    setFormData((prev) => ({ ...prev, milestones: newMilestones }));
    setErrors((prev) => ({ ...prev, [`milestone${index}${field}`]: '' }));
  };

  const addMilestone = () => {
    setFormData((prev) => ({
      ...prev,
      milestones: [...prev.milestones, { description: '', fundingAmount: '', durationInDays: '' }],
    }));
  };

  const removeMilestone = (index) => {
    if (formData.milestones.length > 1) {
      setFormData((prev) => ({
        ...prev,
        milestones: prev.milestones.filter((_, i) => i !== index),
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.imageURI.trim()) newErrors.imageURI = 'Image URI is required';
    if (!formData.goalAmount || parseFloat(formData.goalAmount) <= 0) {
      newErrors.goalAmount = 'Funding goal must be greater than 0';
    }
    if (!formData.durationInDays || parseInt(formData.durationInDays) <= 0) {
      newErrors.durationInDays = 'Duration must be greater than 0';
    }
    formData.milestones.forEach((milestone, index) => {
      if (!milestone.description.trim()) {
        newErrors[`milestone${index}description`] = `Milestone ${index + 1} description is required`;
      }
      if (!milestone.fundingAmount || parseFloat(milestone.fundingAmount) <= 0) {
        newErrors[`milestone${index}fundingAmount`] = `Milestone ${index + 1} funding amount must be greater than 0`;
      }
      if (!milestone.durationInDays || parseInt(milestone.durationInDays) <= 0) {
        newErrors[`milestone${index}durationInDays`] = `Milestone ${index + 1} duration must be greater than 0`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const milestoneDescriptions = formData.milestones.map((m) => m.description);
    const milestoneFundingAmounts = formData.milestones.map((m) => (parseFloat(m.fundingAmount) * 1e18).toString()); // Convert ETH to wei
    const milestoneDurations = formData.milestones.map((m) => parseInt(m.durationInDays));

    console.log('Submitting campaign:', {
      title: formData.title,
      description: formData.description,
      imageURI: formData.imageURI,
      goalAmount: (parseFloat(formData.goalAmount) * 1e18).toString(), // Convert ETH to wei
      durationInDays: parseInt(formData.durationInDays),
      milestoneDescriptions,
      milestoneFundingAmounts,
      milestoneDurations,
    });

    // TODO: Integrate with smart contract using Web3.js or ethers.js
    // Example (uncomment and configure with your contract):
    /*
    try {
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);
      await contract.methods
        .createCampaign(
          formData.title,
          formData.description,
          formData.imageURI,
          web3.utils.toWei(formData.goalAmount, 'ether'),
          formData.durationInDays,
          milestoneDescriptions,
          milestoneFundingAmounts,
          milestoneDurations
        )
        .send({ from: walletAddress });
      alert('Campaign created successfully!');
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Failed to create campaign');
    }
    */
  };

  return (
    <div className="create-campaign-page">
      <Navbar />
      <section className="create-campaign">
        <div className="content-container">
          <div className="section-header">
            <h2 className="section-title">Create a New Campaign</h2>
            <p className="section-subtitle">Launch your Web3 project with transparent, milestone-based funding</p>
          </div>
          <div className="form-card">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Campaign Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter campaign title"
                />
                {errors.title && <span className="error">{errors.title}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your campaign"
                  rows="4"
                />
                {errors.description && <span className="error">{errors.description}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="imageURI">Image URI</label>
                <input
                  type="text"
                  id="imageURI"
                  name="imageURI"
                  value={formData.imageURI}
                  onChange={handleInputChange}
                  placeholder="Enter image URI (e.g., IPFS link)"
                />
                {errors.imageURI && <span className="error">{errors.imageURI}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="goalAmount">Funding Goal (ETH)</label>
                <input
                  type="number"
                  id="goalAmount"
                  name="goalAmount"
                  value={formData.goalAmount}
                  onChange={handleInputChange}
                  placeholder="Enter funding goal in ETH"
                  step="0.01"
                />
                {errors.goalAmount && <span className="error">{errors.goalAmount}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="durationInDays">Duration (Days)</label>
                <input
                  type="number"
                  id="durationInDays"
                  name="durationInDays"
                  value={formData.durationInDays}
                  onChange={handleInputChange}
                  placeholder="Enter campaign duration in days"
                  step="1"
                />
                {errors.durationInDays && <span className="error">{errors.durationInDays}</span>}
              </div>
              <div className="milestones-section">
                <h3>Milestones</h3>
                {formData.milestones.map((milestone, index) => (
                  <div key={index} className="milestone-group">
                    <h4>Milestone {index + 1}</h4>
                    <div className="form-group">
                      <label htmlFor={`milestone-description-${index}`}>Description</label>
                      <input
                        type="text"
                        id={`milestone-description-${index}`}
                        value={milestone.description}
                        onChange={(e) => handleMilestoneChange(index, 'description', e.target.value)}
                        placeholder={`Milestone ${index + 1} description`}
                      />
                      {errors[`milestone${index}description`] && (
                        <span className="error">{errors[`milestone${index}description`]}</span>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor={`milestone-funding-${index}`}>Funding Amount (ETH)</label>
                      <input
                        type="number"
                        id={`milestone-funding-${index}`}
                        value={milestone.fundingAmount}
                        onChange={(e) => handleMilestoneChange(index, 'fundingAmount', e.target.value)}
                        placeholder="Funding amount in ETH"
                        step="0.01"
                      />
                      {errors[`milestone${index}fundingAmount`] && (
                        <span className="error">{errors[`milestone${index}fundingAmount`]}</span>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor={`milestone-duration-${index}`}>Duration (Days)</label>
                      <input
                        type="number"
                        id={`milestone-duration-${index}`}
                        value={milestone.durationInDays}
                        onChange={(e) => handleMilestoneChange(index, 'durationInDays', e.target.value)}
                        placeholder="Duration in days"
                        step="1"
                      />
                      {errors[`milestone${index}durationInDays`] && (
                        <span className="error">{errors[`milestone${index}durationInDays`]}</span>
                      )}
                    </div>
                    {formData.milestones.length > 1 && (
                      <button
                        type="button"
                        className="btn-remove-milestone"
                        onClick={() => removeMilestone(index)}
                      >
                        Remove Milestone
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" className="btn-add-milestone" onClick={addMilestone}>
                  Add Milestone
                </button>
              </div>
              <button type="submit" className="btn-submit">
                Create Campaign
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}