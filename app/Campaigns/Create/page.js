// app/Campaigns/Create/page.js
'use client'
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Zap, Image, Target, Clock, FileText } from 'lucide-react';
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
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleMilestoneChange = (index, field, value) => {
    const newMilestones = [...formData.milestones];
    newMilestones[index][field] = value;
    setFormData(prev => ({ ...prev, milestones: newMilestones }));
  };

  const addMilestone = () => {
    setFormData(prev => ({
      ...prev,
      milestones: [...prev.milestones, { description: '', fundingAmount: '', durationInDays: '' }],
    }));
  };

  const removeMilestone = (index) => {
    if (formData.milestones.length > 1) {
      setFormData(prev => ({
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
    if (!formData.goalAmount || parseFloat(formData.goalAmount) <= 0) newErrors.goalAmount = 'Goal must be > 0 ETH';
    if (!formData.durationInDays || parseInt(formData.durationInDays) <= 0) newErrors.durationInDays = 'Duration must be > 0 days';

    formData.milestones.forEach((m, i) => {
      if (!m.description.trim()) newErrors[`m${i}desc`] = 'Description required';
      if (!m.fundingAmount || parseFloat(m.fundingAmount) <= 0) newErrors[`m${i}fund`] = 'Amount must be > 0 ETH';
      if (!m.durationInDays || parseInt(m.durationInDays) <= 0) newErrors[`m${i}days`] = 'Days must be > 0';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Campaign ready to deploy:', formData);
      // Add your contract call here
    }
  };

  return (
    <div className="create-campaign-page">
      <Navbar />

      {/* Floating Orbs – same as every other page */}
      <div className="hero-bg">
        {[1, 2, 3].map(i => (
          <motion.div
            key={i}
            className={`gradient-orb orb-${i}`}
            animate={{ x: [0, 120, -120, 0], y: [0, -120, 120, 0] }}
            transition={{ duration: 35 + i * 7, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </div>

      <section className="create-campaign">
        <div className="content-container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="section-title">
              Launch Your Vision
              <motion.span
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                style={{ display: 'inline-block', marginLeft: 12 }}
              >_</motion.span>
            </h2>
            <p className="section-subtitle">Transparent, milestone-based crowdfunding for the future</p>
          </motion.div>

          <motion.div
            className="form-card"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.9 }}
          >
            <form onSubmit={handleSubmit}>
              {/* Main Fields */}
              {[
                { icon: <FileText />, label: "Campaign Title", name: "title", placeholder: "e.g. Decentralized Social Network" },
                { icon: <Image />, label: "Image URI (IPFS recommended)", name: "imageURI", placeholder: "ipfs://..." },
                { icon: <Target />, label: "Funding Goal (ETH)", name: "goalAmount", type: "number", step: "0.01" },
                { icon: <Clock />, label: "Campaign Duration (Days)", name: "durationInDays", type: "number" },
              ].map((field, i) => (
                <motion.div
                  key={field.name}
                  className="form-group"
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  <label>{field.icon} {field.label}</label>
                  <input
                    type={field.type || "text"}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    placeholder={field.placeholder}
                    step={field.step}
                  />
                  {errors[field.name] && <motion.span className="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{errors[field.name]}</motion.span>}
                </motion.div>
              ))}

              <motion.div className="form-group" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Tell the world why your project matters..."
                  rows={5}
                />
                {errors.description && <motion.span className="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{errors.description}</motion.span>}
              </motion.div>

              {/* Milestones */}
              <div className="milestones-section">
                <motion.h3 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
                  Milestones ({formData.milestones.length})
                </motion.h3>

                {formData.milestones.map((milestone, index) => (
                  <motion.div
                    key={index}
                    className="milestone-group"
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.4 }}
                    whileHover={{ y: -4 }}
                  >
                    <div className="milestone-header">
                      <h4>Milestone {index + 1}</h4>
                      {formData.milestones.length > 1 && (
                        <motion.button
                          type="button"
                          className="btn-remove-milestone"
                          onClick={() => removeMilestone(index)}
                          whileHover={{ scale: 1.1, rotate: 90 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      )}
                    </div>

                    {[
                      { name: 'description', placeholder: 'What will you deliver?' },
                      { name: 'fundingAmount', type: 'number', step: '0.01', placeholder: 'ETH required' },
                      { name: 'durationInDays', type: 'number', placeholder: 'Days to complete' },
                    ].map((f, i) => (
                      <motion.div key={i} className="form-group" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                        <input
                          type={f.type || "text"}
                          value={milestone[f.name]}
                          onChange={(e) => handleMilestoneChange(index, f.name, e.target.value)}
                          placeholder={f.placeholder}
                          step={f.step}
                        />
                        {errors[`m${index}${f.name === 'description' ? 'desc' : f.name === 'fundingAmount' ? 'fund' : 'days'}`] && (
                          <span className="error">{errors[`m${index}${f.name === 'description' ? 'desc' : f.name === 'fundingAmount' ? 'fund' : 'days'}`]}</span>
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                ))}

                <motion.button
                  type="button"
                  className="btn-add-milestone"
                  onClick={addMilestone}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus size={20} /> Add Milestone
                </motion.button>
              </div>

              <motion.button
                type="submit"
                className="btn-submit"
                whileHover={{ scale: 1.04, boxShadow: "0 20px 40px rgba(124, 58, 237, 0.4)" }}
                whileTap={{ scale: 0.96 }}
              >
                <Zap size={20} /> Launch Campaign
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}