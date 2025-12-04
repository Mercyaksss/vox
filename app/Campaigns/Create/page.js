// app/Campaigns/Create/page.js
'use client'
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Zap, ImageIcon, Target, Clock, FileText } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { parseEther } from 'ethers';
import Navbar from '../../Components/Navbar/Navbar';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../../src/lib/contract';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import './page.scss';

export default function CreateCampaignPage() {
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, error: writeError, isPending } = useWriteContract();
  const { data: receipt, isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageFile: null,
    imageURI: '',
    campaignDeadline: 0,
    milestones: [{ targetAmount: '', deadline: 0 }],
  });

  const { refetch: refetchProjectCount } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'projectCount',
    query: { enabled: false },
  });

  // Debug logs
  useEffect(() => {
    console.log('🔍 Wallet Connected:', isConnected);
    console.log('🔍 Wallet Address:', address);
    console.log('🔍 Contract Address:', CONTRACT_ADDRESS);
  }, [isConnected, address]);

  useEffect(() => {
    if (isPending) {
      console.log('⏳ Transaction pending...');
    }
  }, [isPending]);

  useEffect(() => {
    if (hash) {
      console.log('✅ Transaction hash:', hash);
    }
  }, [hash]);

  useEffect(() => {
    if (receipt) {
      console.log('✅ Transaction confirmed!', receipt);
      alert('Campaign created successfully! 🎉');
      
      setFormData({
        title: '',
        description: '',
        imageFile: null,
        imageURI: '',
        campaignDeadline: 0,
        milestones: [{ targetAmount: '', deadline: 0 }],
      });

      window.location.href = '/Dashboard/MyCampaigns';
    }
  }, [receipt]);

  useEffect(() => {
    if (writeError) {
      console.error('❌ Write Error:', writeError);
      alert('Error: ' + writeError.message);
    }
  }, [writeError]);

  const [errors, setErrors] = useState({});
  const [uploadStatus, setUploadStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    multiple: false,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles[0]) {
        setFormData(prev => ({ ...prev, imageFile: acceptedFiles[0] }));
        await uploadImage(acceptedFiles[0]);
      }
    },
  });

  const uploadImage = async (file) => {
    setIsUploading(true);
    setUploadStatus('Uploading to IPFS...');
    setErrors(prev => ({ ...prev, imageURI: '' }));

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload-to-pinata', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setFormData(prev => ({ ...prev, imageURI: data.uri }));
      setUploadStatus('Image uploaded successfully!');
      setTimeout(() => setUploadStatus(''), 3000);
    } catch (error) {
      console.error('Upload error:', error);
      setErrors(prev => ({ ...prev, imageURI: `Upload failed: ${error.message}` }));
      setUploadStatus('');
    } finally {
      setIsUploading(false);
    }
  };

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
      milestones: [...prev.milestones, { targetAmount: '', deadline: 0 }],
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
    if (!formData.imageURI.trim()) newErrors.imageURI = 'Upload an image';
    if (formData.campaignDeadline <= 0) newErrors.campaignDeadline = 'Deadline must be in the future';

    formData.milestones.forEach((m, i) => {
      if (!parseFloat(m.targetAmount) || parseFloat(m.targetAmount) <= 0) newErrors[`m${i}target`] = 'Amount > 0 ETH';
      if (m.deadline <= 0) newErrors[`m${i}deadline`] = 'Deadline in future';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🚀 Form submitted!');
    console.log('🔍 Is Connected:', isConnected);
    console.log('🔍 Address:', address);
    
    if (!isConnected) {
      alert('Connect wallet first');
      return;
    }
    
    if (!validateForm()) {
      console.log('❌ Form validation failed');
      return;
    }

    const now = Math.floor(Date.now() / 1000);
    const targets = formData.milestones.map(m => parseEther(m.targetAmount));
    const deadlines = formData.milestones.map(m => (m.deadline > 0 ? now + m.deadline * 86400 : 0));
    const campaignDeadline = formData.campaignDeadline > 0 ? now + formData.campaignDeadline * 86400 : 0;

    console.log('📦 Transaction Data:', {
      title: formData.title,
      description: formData.description,
      imageURI: formData.imageURI,
      targets: targets.map(t => t.toString()),
      deadlines,
      campaignDeadline,
      value: '0.01 ETH',
    });

    try {
      console.log('💳 Calling writeContract...');
      
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'createProject',
        args: [
          formData.title,
          formData.description,
          formData.imageURI,
          targets,
          deadlines,
          campaignDeadline
        ],
        value: parseEther('0.01'),
      });
      
      console.log('✅ writeContract called successfully');
    } catch (error) {
      console.error('❌ Error calling writeContract:', error);
      alert('Error: ' + error.message);
    }
  };

  const isSubmitDisabled = mounted ? (isUploading || isConfirming || isPending || !isConnected) : true;

  if (!mounted) {
    return (
      <div className="create-campaign-page">
        <Navbar />
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="create-campaign-page">
      <Navbar />

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
          <motion.div className="section-header" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="section-title">
              Launch Your Vision
              <motion.span
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                style={{ display: 'inline-block', marginLeft: 12 }}
              >
                _
              </motion.span>
            </h2>
            <p className="section-subtitle">Create your milestone-based campaign</p>
            
            {/* DEBUG INFO */}
            <p style={{ fontSize: '0.85rem', opacity: 0.6, marginTop: '10px' }}>
              Wallet: {isConnected ? '✅ Connected' : '❌ Not connected'} | 
              {address ? ` ${address.slice(0, 8)}...` : ' No address'}
            </p>
          </motion.div>

          <motion.form onSubmit={handleSubmit} className="campaign-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <motion.div className="form-group" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <Target size={24} />
              <input name="title" value={formData.title} onChange={handleInputChange} placeholder="Campaign Title" />
              {errors.title && <span className="error">{errors.title}</span>}
            </motion.div>

            <motion.div className="form-group" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <FileText size={24} />
              <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Tell your story..." rows={4} />
              {errors.description && <span className="error">{errors.description}</span>}
            </motion.div>

            <motion.div
              className={`form-group dropzone ${isDragActive ? 'active' : ''}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              {...getRootProps()}
            >
              <ImageIcon size={24} />
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop image here...</p>
              ) : formData.imageURI ? (
                <div>
                  <p>✔ Image uploaded: {formData.imageFile?.name}</p>
                  <small style={{ color: '#10b981' }}>{uploadStatus}</small>
                </div>
              ) : (
                <p>Drag & drop image or click to upload</p>
              )}
              {isUploading && <span style={{ color: '#7c3aed' }}>{uploadStatus}</span>}
              {errors.imageURI && <span className="error">{errors.imageURI}</span>}
            </motion.div>

            <motion.div className="form-group" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
              <Clock size={24} />
              <input type="number" name="campaignDeadline" value={formData.campaignDeadline} onChange={handleInputChange} placeholder="Overall Deadline (days)" />
              {errors.campaignDeadline && <span className="error">{errors.campaignDeadline}</span>}
            </motion.div>

            <div className="milestones-section">
              <motion.h3 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
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

                  <motion.div className="form-group" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}>
                    <Target size={24} />
                    <input
                      type="number"
                      step="0.01"
                      value={milestone.targetAmount}
                      onChange={(e) => handleMilestoneChange(index, 'targetAmount', e.target.value)}
                      placeholder="Target Amount (ETH)"
                    />
                    {errors[`m${index}target`] && <span className="error">{errors[`m${index}target`]}</span>}
                  </motion.div>

                  <motion.div className="form-group" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                    <Clock size={24} />
                    <input
                      type="number"
                      value={milestone.deadline}
                      onChange={(e) => handleMilestoneChange(index, 'deadline', e.target.value)}
                      placeholder="Deadline (days from now)"
                    />
                    {errors[`m${index}deadline`] && <span className="error">{errors[`m${index}deadline`]}</span>}
                  </motion.div>
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
              disabled={isSubmitDisabled}
              whileHover={{ scale: isSubmitDisabled ? 1 : 1.04, boxShadow: "0 20px 40px rgba(124, 58, 237, 0.4)" }}
              whileTap={{ scale: isSubmitDisabled ? 1 : 0.96 }}
            >
              <Zap size={20} /> {isPending || isConfirming ? 'Confirming...' : 'Launch Campaign (0.01 ETH)'}
            </motion.button>

            {/* Debug status */}
            <p style={{ fontSize: '0.85rem', opacity: 0.6, marginTop: '10px', textAlign: 'center' }}>
              {isPending && '⏳ Waiting for signature...'}
              {isConfirming && '⏳ Confirming transaction...'}
              {hash && `Tx: ${hash.slice(0, 10)}...`}
            </p>
          </motion.form>
        </div>
      </section>
    </div>
  );
}