import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { FaEdit, FaCamera, FaMapMarkerAlt, FaGraduationCap, FaLinkedin, FaGlobe, FaPlus, FaUser, FaCode, FaStar, FaIdCard, FaCalendar, FaBook, FaAward } from 'react-icons/fa';
import '../assets/styles/ProfilePage.css';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function StudentProfile() {
  const { user, userRole, userData, updateUserData, getUserData } = useContext(UserContext);
  const [showBgModal, setShowBgModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showBasicInfoModal, setShowBasicInfoModal] = useState(false);
  const [showAcademicModal, setShowAcademicModal] = useState(false);
  const [showSkillsModal, setShowSkillsModal] = useState(false);
  const [showProjectsModal, setShowProjectsModal] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState('');
  const [profileImage, setProfileImage] = useState(userData?.profileImage || '');
  const [coverImage, setCoverImage] = useState(userData?.coverImage || '');
  
  const [basicInfo, setBasicInfo] = useState({
    name: userData?.name || user?.displayName || '',
    title: 'Student',
    location: userData?.location || 'Islamabad, Pakistan',
    linkedin: userData?.linkedin || '',
    website: userData?.website || ''
  });

  const [academicInfo, setAcademicInfo] = useState({
    rollNumber: userData?.studentId || '',
    batch: userData?.batch || '',
    semester: userData?.semester || '',
    department: userData?.department || '',
    course: userData?.course || '',
    cgpa: userData?.cgpa || '',
    totalCredits: userData?.totalCredits || ''
  });

  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);

  const handleImageUpload = async (file, type) => {
    const storage = getStorage();
    const storageRef = ref(storage, `images/${user.uid}/${type}-${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    if (type === 'profile') {
      setProfileImage(url);
      await updateUserData({ profileImage: url });
    } else {
      setCoverImage(url);
      await updateUserData({ coverImage: url });
    }
  };

  useEffect(() => {
    if (userData?.profileImage) setProfileImage(userData.profileImage);
    if (userData?.coverImage) setCoverImage(userData.coverImage);
  }, [userData]);

  const ImageUploadModal = ({ isOpen, onClose, onUpload, title, type }) => {
    if (!isOpen) return null;

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        onUpload(file, type);
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
            <label>Location</label>
            <input
              type="text"
              value={info.location || ''}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="e.g., Islamabad, Pakistan"
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

  const AcademicInfoModal = ({ isOpen, onClose, data, onSave }) => {
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
          <h3>Academic Information</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Roll Number</label>
              <input
                type="text"
                value={info.rollNumber || ''}
                onChange={(e) => handleInputChange('rollNumber', e.target.value)}
                placeholder="e.g., 2021-CS-001"
              />
            </div>
            <div className="form-group">
              <label>Batch</label>
              <input
                type="text"
                value={info.batch || ''}
                onChange={(e) => handleInputChange('batch', e.target.value)}
                placeholder="e.g., 2021"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Semester</label>
              <input
                type="text"
                value={info.semester || ''}
                onChange={(e) => handleInputChange('semester', e.target.value)}
                placeholder="e.g., 6th Semester"
              />
            </div>
            <div className="form-group">
              <label>Department</label>
              <input
                type="text"
                value={info.department || ''}
                onChange={(e) => handleInputChange('department', e.target.value)}
                placeholder="e.g., Computer Science"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Course</label>
              <input
                type="text"
                value={info.course || ''}
                onChange={(e) => handleInputChange('course', e.target.value)}
                placeholder="e.g., BS Computer Science"
              />
            </div>
            <div className="form-group">
              <label>CGPA</label>
              <input
                type="text"
                value={info.cgpa || ''}
                onChange={(e) => handleInputChange('cgpa', e.target.value)}
                placeholder="e.g., 3.8"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Total Credits</label>
            <input
              type="text"
              value={info.totalCredits || ''}
              onChange={(e) => handleInputChange('totalCredits', e.target.value)}
              placeholder="e.g., 120"
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

  const ProjectsModal = ({ isOpen, onClose, data, onSave }) => {
    const [projects, setProjects] = useState(data || []);

    if (!isOpen) return null;

    const addProject = () => {
      setProjects([...projects, { title: '', description: '', technologies: '', link: '' }]);
    };

    const updateProject = (index, field, value) => {
      const updated = [...projects];
      updated[index][field] = value;
      setProjects(updated);
    };

    const removeProject = (index) => {
      setProjects(projects.filter((_, i) => i !== index));
    };

    const handleSave = () => {
      onSave(projects.filter(project => project.title.trim() !== ''));
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
          <h3>Projects</h3>
          {projects.map((project, index) => (
            <div key={index} className="project-form-item">
              <div className="form-group">
                <label>Project Title</label>
                <input
                  type="text"
                  value={project.title || ''}
                  onChange={(e) => updateProject(index, 'title', e.target.value)}
                  placeholder="Project name"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={project.description || ''}
                  onChange={(e) => updateProject(index, 'description', e.target.value)}
                  placeholder="Project description"
                  rows="3"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Technologies</label>
                  <input
                    type="text"
                    value={project.technologies || ''}
                    onChange={(e) => updateProject(index, 'technologies', e.target.value)}
                    placeholder="React, Node.js, MongoDB"
                  />
                </div>
                <div className="form-group">
                  <label>Project Link</label>
                  <input
                    type="url"
                    value={project.link || ''}
                    onChange={(e) => updateProject(index, 'link', e.target.value)}
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>
              <button className="remove-btn" onClick={() => removeProject(index)}>Remove Project</button>
            </div>
          ))}
          <button className="add-btn" onClick={addProject}>
            <FaPlus /> Add Project
          </button>
          <div className="modal-actions">
            <button className="btn-cancel" onClick={onClose}>Cancel</button>
            <button className="btn-save" onClick={handleSave}>Save</button>
          </div>
        </div>
      </div>
    );
  };

  const handleSaveBasicInfo = async (formData) => {
    setBasicInfo(formData);
    await updateUserData({
      name: formData.name,
      title: formData.title,
      location: formData.location,
      linkedin: formData.linkedin,
      website: formData.website
    });
    if (user) {
      const latest = await getUserData(user.uid);
      setBasicInfo({
        name: latest.name || '',
        title: latest.title || 'Student',
        location: latest.location || 'Islamabad, Pakistan',
        linkedin: latest.linkedin || '',
        website: latest.website || ''
      });
    }
    setShowBasicInfoModal(false);
  };

  // CV Upload logic
  const [cvUrl, setCvUrl] = useState(userData?.cvUrl || '');
  const handleCvUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const storage = getStorage();
    const storageRef = ref(storage, `cvs/${user.uid}/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    setCvUrl(url);
    await updateUserData({ cvUrl: url });
  };

  return (
    <div className="profile-page">
      {/* Background Image Section */}
      <div className="profile-background">
        {coverImage ? (
          <img src={coverImage} alt="Cover" className="background-image" />
        ) : (
          <div className="background-placeholder">
            <button onClick={() => document.getElementById('cover-upload').click()} className="upload-btn">
              <FaCamera /> Add a background photo
            </button>
          </div>
        )}
        <input type="file" accept="image/*" style={{display:'none'}} id="cover-upload" onChange={e => e.target.files[0] && handleImageUpload(e.target.files[0], 'cover')} />
        <button onClick={() => document.getElementById('cover-upload').click()} className="edit-bg-btn">
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
                {/* <h3>Student Profile</h3> */}
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
                      <span>{(user?.displayName || user?.email || 'S')[0].toUpperCase()}</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" style={{display:'none'}} id="profile-upload" onChange={e => e.target.files[0] && handleImageUpload(e.target.files[0], 'profile')} />
                  <label htmlFor="profile-upload" className="edit-profile-btn"><FaCamera /></label>
                </div>
              </div>

              <div className="profile-details">
                <h1 className="profile-name">{basicInfo.name || user?.displayName || 'Student Name'}</h1>
                                     <p className="profile-title">Student • {userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1) : 'User'}</p>
                <p className="profile-location">
                  <FaMapMarkerAlt /> {basicInfo.location}
                </p>
                
                <div className="profile-actions">
                  {cvUrl ? (
                    <a href={cvUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">View Resume</a>
                  ) : (
                    <label className="btn-secondary" style={{cursor:'pointer'}}>
                      Upload CV
                      <input type="file" accept=".pdf,.doc,.docx" style={{display:'none'}} onChange={handleCvUpload} />
                    </label>
                  )}
                  <button className="btn-secondary">Download CV</button>
                </div>

                <div className="profile-links">
                  {basicInfo.linkedin && (
                    <a href={basicInfo.linkedin} className="profile-link" target="_blank" rel="noopener noreferrer">
                      <FaLinkedin /> LinkedIn
                    </a>
                  )}
                  {basicInfo.website && (
                    <a href={basicInfo.website} className="profile-link" target="_blank" rel="noopener noreferrer">
                      <FaGlobe /> Portfolio
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Academic Information Card */}
          <ProfileCard
            title="Academic Information"
            icon={<FaGraduationCap />}
            onEdit={() => setShowAcademicModal(true)}
            isEmpty={!academicInfo.rollNumber}
          >
            <div className="academic-info">
              <div className="info-row">
                <span className="info-label">Roll Number:</span>
                <span className="info-value">{academicInfo.rollNumber}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Batch:</span>
                <span className="info-value">{academicInfo.batch}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Semester:</span>
                <span className="info-value">{academicInfo.semester}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Department:</span>
                <span className="info-value">{academicInfo.department}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Course:</span>
                <span className="info-value">{academicInfo.course}</span>
              </div>
              <div className="info-row">
                <span className="info-label">CGPA:</span>
                <span className="info-value">{academicInfo.cgpa}</span>
              </div>
            </div>
          </ProfileCard>

          {/* Skills Card */}
          <ProfileCard
            title="Skills"
            icon={<FaCode />}
            onEdit={() => setShowSkillsModal(true)}
            isEmpty={skills.length === 0}
          >
            <div className="skills-grid">
              {skills.map((skill, index) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))}
            </div>
          </ProfileCard>

          {/* Projects Card */}
          <ProfileCard
            title="Projects"
            icon={<FaAward />}
            onEdit={() => setShowProjectsModal(true)}
            isEmpty={projects.length === 0}
          >
            {projects.map((project, index) => (
              <div key={index} className="project-item">
                <h4>{project.title}</h4>
                <p>{project.description}</p>
                <p className="project-tech"><strong>Technologies:</strong> {project.technologies}</p>
                {project.link && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">
                    View Project
                  </a>
                )}
              </div>
            ))}
          </ProfileCard>
        </div>

        <div className="profile-right-column">
          {/* Right side content - can be used for additional sections */}
          <div className="right-section-placeholder">
            <h3>Additional Sections</h3>
            <p>Certifications, Achievements, etc.</p>
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

      <BasicInfoModal
        isOpen={showBasicInfoModal}
        onClose={() => setShowBasicInfoModal(false)}
        data={basicInfo}
        onSave={handleSaveBasicInfo}
      />

      <AcademicInfoModal
        isOpen={showAcademicModal}
        onClose={() => setShowAcademicModal(false)}
        data={academicInfo}
        onSave={setAcademicInfo}
      />

      <SkillsModal
        isOpen={showSkillsModal}
        onClose={() => setShowSkillsModal(false)}
        data={skills}
        onSave={setSkills}
      />

      <ProjectsModal
        isOpen={showProjectsModal}
        onClose={() => setShowProjectsModal(false)}
        data={projects}
        onSave={setProjects}
      />
    </div>
  );
}

export default StudentProfile; 