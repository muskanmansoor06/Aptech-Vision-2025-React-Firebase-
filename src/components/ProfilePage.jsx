import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { FaEdit, FaCamera, FaMapMarkerAlt, FaBriefcase, FaGraduationCap, FaLinkedin, FaGlobe, FaPlus, FaUser, FaCode, FaStar } from 'react-icons/fa';
import '../assets/styles/ProfilePage.css';

function ProfilePage() {
  const { user } = useContext(UserContext);
  const [showBgModal, setShowBgModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [showSkillsModal, setShowSkillsModal] = useState(false);
  const [showBasicInfoModal, setShowBasicInfoModal] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState('');
  const [profileImage, setProfileImage] = useState(user?.photoURL || '');
  const [profileData, setProfileData] = useState({
    about: '',
    experience: [],
    education: [],
    skills: []
  });
  const [basicInfo, setBasicInfo] = useState({
    name: user?.displayName || '',
    title: 'Software Developer',
    location: 'Islamabad, Pakistan',
    company: 'AlmaHub • Full-time',
    education: 'Computer Science • University of Islamabad',
    linkedin: '',
    website: ''
  });

  const handleImageUpload = (type, file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (type === 'background') {
        setBackgroundImage(e.target.result);
        setShowBgModal(false);
      } else {
        setProfileImage(e.target.result);
        setShowProfileModal(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleProfileDataUpdate = (section, data) => {
    setProfileData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const ImageUploadModal = ({ isOpen, onClose, onUpload, title, type }) => {
    if (!isOpen) return null;

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        onUpload(type, file);
      }
    };

    return (
      <div className="image-upload-modal-overlay">
        <div className="image-upload-modal">
          <button className="modal-close-btn" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
          <h3>{title}</h3>
          <div className="upload-area">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              id={`${type}-upload`}
              style={{ display: 'none' }}
            />
            <label htmlFor={`${type}-upload`} className="upload-label">
              <FaCamera />
              <span>Click to upload image</span>
            </label>
          </div>
        </div>
      </div>
    );
  };

  const ProfileCard = ({ title, icon, children, onEdit, isEmpty = false }) => {
    return (
      <div className="profile-card">
        <div className="profile-card-header">
          <div className="card-title">
            {icon}
            <h3>{title}</h3>
          </div>
          <button className="card-edit-btn" onClick={onEdit}>
            <FaEdit />
          </button>
        </div>
        <div className="profile-card-content">
          {isEmpty ? (
            <div className="empty-state">
              <p>No {title.toLowerCase()} added yet</p>
              <button className="add-btn" onClick={onEdit}>
                <FaPlus /> Add {title}
              </button>
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    );
  };

  const AboutModal = ({ isOpen, onClose, data, onSave }) => {
    const [about, setAbout] = useState(data || '');

    if (!isOpen) return null;

    const handleSave = () => {
      onSave(about);
      onClose();
    };

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="modal-close-btn" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
          <h3>About</h3>
          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Tell us about yourself, your skills, and what you're passionate about..."
            rows="6"
          />
          <div className="modal-actions">
            <button className="btn-cancel" onClick={onClose}>Cancel</button>
            <button className="btn-save" onClick={handleSave}>Save</button>
          </div>
        </div>
      </div>
    );
  };

  const ExperienceModal = ({ isOpen, onClose, data, onSave }) => {
    const [experience, setExperience] = useState(data || []);

    if (!isOpen) return null;

    const addExperience = () => {
      setExperience([...experience, { title: '', company: '', duration: '', location: '' }]);
    };

    const updateExperience = (index, field, value) => {
      const updated = [...experience];
      updated[index][field] = value;
      setExperience(updated);
    };

    const removeExperience = (index) => {
      setExperience(experience.filter((_, i) => i !== index));
    };

    const handleSave = () => {
      onSave(experience);
      onClose();
    };

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="modal-close-btn" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
          <h3>Experience</h3>
          {experience.map((exp, index) => (
            <div key={index} className="experience-form-item">
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Job Title"
                  value={exp.title}
                  onChange={(e) => updateExperience(index, 'title', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Company"
                  value={exp.company}
                  onChange={(e) => updateExperience(index, 'company', e.target.value)}
                />
              </div>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Duration (e.g., Jan 2023 - Present)"
                  value={exp.duration}
                  onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={exp.location}
                  onChange={(e) => updateExperience(index, 'location', e.target.value)}
                />
              </div>
              <button className="remove-btn" onClick={() => removeExperience(index)}>Remove</button>
            </div>
          ))}
          <button className="add-btn" onClick={addExperience}>
            <FaPlus /> Add Experience
          </button>
          <div className="modal-actions">
            <button className="btn-cancel" onClick={onClose}>Cancel</button>
            <button className="btn-save" onClick={handleSave}>Save</button>
          </div>
        </div>
      </div>
    );
  };

  const EducationModal = ({ isOpen, onClose, data, onSave }) => {
    const [education, setEducation] = useState(data || []);

    if (!isOpen) return null;

    const addEducation = () => {
      setEducation([...education, { degree: '', institution: '', duration: '' }]);
    };

    const updateEducation = (index, field, value) => {
      const updated = [...education];
      updated[index][field] = value;
      setEducation(updated);
    };

    const removeEducation = (index) => {
      setEducation(education.filter((_, i) => i !== index));
    };

    const handleSave = () => {
      onSave(education);
      onClose();
    };

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="modal-close-btn" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
          <h3>Education</h3>
          {education.map((edu, index) => (
            <div key={index} className="education-form-item">
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Degree"
                  value={edu.degree}
                  onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Institution"
                  value={edu.institution}
                  onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                />
              </div>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Duration (e.g., 2019 - 2023)"
                  value={edu.duration}
                  onChange={(e) => updateEducation(index, 'duration', e.target.value)}
                />
                <button className="remove-btn" onClick={() => removeEducation(index)}>Remove</button>
              </div>
            </div>
          ))}
          <button className="add-btn" onClick={addEducation}>
            <FaPlus /> Add Education
          </button>
          <div className="modal-actions">
            <button className="btn-cancel" onClick={onClose}>Cancel</button>
            <button className="btn-save" onClick={handleSave}>Save</button>
          </div>
        </div>
      </div>
    );
  };

  const SkillsModal = ({ isOpen, onClose, data, onSave }) => {
    const [skills, setSkills] = useState(data || []);

    if (!isOpen) return null;

    const addSkill = () => {
      setSkills([...skills, '']);
    };

    const updateSkill = (index, value) => {
      const updated = [...skills];
      updated[index] = value;
      setSkills(updated);
    };

    const removeSkill = (index) => {
      setSkills(skills.filter((_, i) => i !== index));
    };

    const handleSave = () => {
      onSave(skills.filter(skill => skill.trim() !== ''));
      onClose();
    };

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="modal-close-btn" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
          <h3>Skills</h3>
          {skills.map((skill, index) => (
            <div key={index} className="skill-form-item">
              <input
                type="text"
                placeholder="Skill name"
                value={skill}
                onChange={(e) => updateSkill(index, e.target.value)}
              />
              <button className="remove-btn" onClick={() => removeSkill(index)}>Remove</button>
            </div>
          ))}
          <button className="add-btn" onClick={addSkill}>
            <FaPlus /> Add Skill
          </button>
          <div className="modal-actions">
            <button className="btn-cancel" onClick={onClose}>Cancel</button>
            <button className="btn-save" onClick={handleSave}>Save</button>
          </div>
        </div>
      </div>
    );
  };

  const BasicInfoModal = ({ isOpen, onClose, data, onSave }) => {
    const [info, setInfo] = useState(data || {});

    if (!isOpen) return null;

    const handleInputChange = (field, value) => {
      setInfo(prev => ({
        ...prev,
        [field]: value
      }));
    };

    const handleSave = () => {
      onSave(info);
      onClose();
    };

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="modal-close-btn" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
          <h3>Basic Information</h3>
          
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={info.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label>Professional Title</label>
            <input
              type="text"
              value={info.title || ''}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g., Software Developer"
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              value={info.location || ''}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="e.g., Islamabad, Pakistan"
            />
          </div>

          <div className="form-group">
            <label>Current Company</label>
            <input
              type="text"
              value={info.company || ''}
              onChange={(e) => handleInputChange('company', e.target.value)}
              placeholder="e.g., AlmaHub • Full-time"
            />
          </div>

          <div className="form-group">
            <label>Education</label>
            <input
              type="text"
              value={info.education || ''}
              onChange={(e) => handleInputChange('education', e.target.value)}
              placeholder="e.g., Computer Science • University of Islamabad"
            />
          </div>

          <div className="form-group">
            <label>LinkedIn Profile</label>
            <input
              type="url"
              value={info.linkedin || ''}
              onChange={(e) => handleInputChange('linkedin', e.target.value)}
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>

          <div className="form-group">
            <label>Personal Website</label>
            <input
              type="url"
              value={info.website || ''}
              onChange={(e) => handleInputChange('website', e.target.value)}
              placeholder="https://yourwebsite.com"
            />
          </div>

          <div className="modal-actions">
            <button className="btn-cancel" onClick={onClose}>Cancel</button>
            <button className="btn-save" onClick={handleSave}>Save</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="profile-page">
      {/* Background Image Section */}
      <div className="profile-background">
        {backgroundImage ? (
          <img src={backgroundImage} alt="Background" className="background-image" />
        ) : (
          <div className="background-placeholder">
            <span>Add a background photo</span>
          </div>
        )}
        <button className="edit-bg-btn" onClick={() => setShowBgModal(true)}>
          <FaEdit />
        </button>
      </div>

      {/* Profile Content - Two Column Layout */}
      <div className="profile-content">
        <div className="profile-left-column">
          {/* Profile Info Card */}
          <div className="profile-info-card">
            <div className="profile-card-header">
              <div className="card-title">
                <FaUser />
                <h3>Profile Information</h3>
              </div>
              <button className="card-edit-btn" onClick={() => setShowBasicInfoModal(true)}>
                <FaEdit />
              </button>
            </div>
            
            <div className="profile-info-content">
              <div className="profile-photo-section">
                <div className="profile-photo">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" />
                  ) : (
                    <div className="profile-placeholder">
                      <span>{(user?.displayName || user?.email || 'U')[0].toUpperCase()}</span>
                    </div>
                  )}
                  <button className="edit-profile-btn" onClick={() => setShowProfileModal(true)}>
                    <FaCamera />
                  </button>
                </div>
              </div>

              <div className="profile-details">
                <h1 className="profile-name">{basicInfo.name || user?.displayName || 'Your Name'}</h1>
                <p className="profile-title">{basicInfo.title}</p>
                <p className="profile-location">
                  <FaMapMarkerAlt /> {basicInfo.location}
                </p>
                <p className="profile-company">
                  <FaBriefcase /> {basicInfo.company}
                </p>
                <p className="profile-education">
                  <FaGraduationCap /> {basicInfo.education}
                </p>
                
                <div className="profile-actions">
                  <button className="btn-primary">Open to work</button>
                  <button className="btn-secondary">Add profile section</button>
                  <button className="btn-secondary">More</button>
                </div>

                <div className="profile-links">
                  {basicInfo.linkedin && (
                    <a href={basicInfo.linkedin} className="profile-link" target="_blank" rel="noopener noreferrer">
                      <FaLinkedin /> LinkedIn
                    </a>
                  )}
                  {basicInfo.website && (
                    <a href={basicInfo.website} className="profile-link" target="_blank" rel="noopener noreferrer">
                      <FaGlobe /> Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Cards */}
          <ProfileCard
            title="About"
            icon={<FaUser />}
            onEdit={() => setShowAboutModal(true)}
            isEmpty={!profileData.about}
          >
            <p>{profileData.about}</p>
          </ProfileCard>

          <ProfileCard
            title="Experience"
            icon={<FaBriefcase />}
            onEdit={() => setShowExperienceModal(true)}
            isEmpty={profileData.experience.length === 0}
          >
            {profileData.experience.map((exp, index) => (
              <div key={index} className="experience-item">
                <h4>{exp.title}</h4>
                <p className="company">{exp.company}</p>
                <p className="duration">{exp.duration}</p>
                <p className="location">{exp.location}</p>
              </div>
            ))}
          </ProfileCard>

          <ProfileCard
            title="Education"
            icon={<FaGraduationCap />}
            onEdit={() => setShowEducationModal(true)}
            isEmpty={profileData.education.length === 0}
          >
            {profileData.education.map((edu, index) => (
              <div key={index} className="education-item">
                <h4>{edu.degree}</h4>
                <p className="institution">{edu.institution}</p>
                <p className="duration">{edu.duration}</p>
              </div>
            ))}
          </ProfileCard>

          <ProfileCard
            title="Skills"
            icon={<FaCode />}
            onEdit={() => setShowSkillsModal(true)}
            isEmpty={profileData.skills.length === 0}
          >
            <div className="skills-grid">
              {profileData.skills.map((skill, index) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))}
            </div>
          </ProfileCard>
        </div>

        <div className="profile-right-column">
          {/* Right side content - can be used for additional sections */}
          <div className="right-section-placeholder">
            <h3>Additional Sections</h3>
            <p>More profile sections can be added here</p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ImageUploadModal
        isOpen={showBgModal}
        onClose={() => setShowBgModal(false)}
        onUpload={handleImageUpload}
        title="Upload Background Photo"
        type="background"
      />

      <ImageUploadModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onUpload={handleImageUpload}
        title="Upload Profile Photo"
        type="profile"
      />

      <AboutModal
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
        data={profileData.about}
        onSave={(data) => handleProfileDataUpdate('about', data)}
      />

      <ExperienceModal
        isOpen={showExperienceModal}
        onClose={() => setShowExperienceModal(false)}
        data={profileData.experience}
        onSave={(data) => handleProfileDataUpdate('experience', data)}
      />

      <EducationModal
        isOpen={showEducationModal}
        onClose={() => setShowEducationModal(false)}
        data={profileData.education}
        onSave={(data) => handleProfileDataUpdate('education', data)}
      />

      <SkillsModal
        isOpen={showSkillsModal}
        onClose={() => setShowSkillsModal(false)}
        data={profileData.skills}
        onSave={(data) => handleProfileDataUpdate('skills', data)}
      />

      <BasicInfoModal
        isOpen={showBasicInfoModal}
        onClose={() => setShowBasicInfoModal(false)}
        data={basicInfo}
        onSave={setBasicInfo}
      />
    </div>
  );
}

export default ProfilePage; 