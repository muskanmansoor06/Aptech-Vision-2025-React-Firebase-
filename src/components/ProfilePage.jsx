import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { FaEdit, FaCamera, FaMapMarkerAlt, FaBriefcase, FaGraduationCap, FaLinkedin, FaGlobe, FaPlus, FaUser, FaCode, FaStar, FaBuilding, FaChartBar, FaClipboardList, FaPhone, FaEnvelope } from 'react-icons/fa';
import '../assets/styles/ProfilePage.css';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function DepartmentProfilePage() {
  const { user, updateUserData, getUserData, userRole, setUserRole, userData } = useContext(UserContext);
  const [showBgModal, setShowBgModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showDepartmentInfoModal, setShowDepartmentInfoModal] = useState(false);
  const [showProgramsModal, setShowProgramsModal] = useState(false);
  const [showFacultyModal, setShowFacultyModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showBasicInfoModal, setShowBasicInfoModal] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(userData?.coverImage || '');
  const [profileImage, setProfileImage] = useState(userData?.profileImage || '');
  const [profileData, setProfileData] = useState({
    about: '',
    programs: [],
    faculty: [],
    stats: {
      graduationRate: '',
      employmentRate: '',
      researchProjects: '',
      publications: ''
    }
  });
  const [basicInfo, setBasicInfo] = useState({
    name: user?.displayName || '',
    title: 'Department Head',
    location: 'Islamabad, Pakistan',
    campus: '', // new field
    phone: '', // contact number
    email: '',
  });
  const [departmentInfo, setDepartmentInfo] = useState({
    departmentName: '',
    departmentCode: '',
    headOfDepartment: '',
    establishmentDate: '',
    totalStudents: '',
    totalTeachers: '',
    departmentLocation: '',
    contactNumber: '',
    departmentEmail: ''
  });

  // Fetch latest info from backend on mount or when user changes
  useEffect(() => {
    async function fetchLatest() {
      if (user) {
        const latest = await getUserData(user.uid);
        setBasicInfo({
          name: latest.name || '',
          title: latest.title || 'Department Head',
          location: latest.location || 'Islamabad, Pakistan',
          campus: latest.campus || '',
          phone: latest.phone || '',
          email: latest.email || '',
        });
        if (latest.role) setUserRole(latest.role);
      }
    }
    fetchLatest();
    // eslint-disable-next-line
  }, [user]);

  useEffect(() => {
    if (userData?.profileImage) setProfileImage(userData.profileImage);
    if (userData?.coverImage) setBackgroundImage(userData.coverImage);
  }, [userData]);

  const handleImageUpload = async (type, file) => {
    const storage = getStorage();
    const storageRef = ref(storage, `images/${user.uid}/${type}-${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    if (type === 'background') {
      setBackgroundImage(url);
      await updateUserData({ coverImage: url });
      setShowBgModal(false);
    } else {
      setProfileImage(url);
      await updateUserData({ profileImage: url });
      setShowProfileModal(false);
    }
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

  const DepartmentInfoModal = ({ isOpen, onClose, data, onSave }) => {
    const [formData, setFormData] = useState(data);

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
      onClose();
    };

    if (!isOpen) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="modal-close-btn" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
          <h3>Department Information</h3>
          <div className="form-group">
            <label>Department Name</label>
            <input
              type="text"
              value={formData.departmentName}
              onChange={(e) => setFormData({...formData, departmentName: e.target.value})}
              placeholder="e.g., Computer Science Department"
            />
          </div>
          <div className="form-group">
            <label>Department Code</label>
            <input
              type="text"
              value={formData.departmentCode}
              onChange={(e) => setFormData({...formData, departmentCode: e.target.value})}
              placeholder="e.g., CS"
            />
          </div>
          <div className="form-group">
            <label>Head of Department</label>
            <input
              type="text"
              value={formData.headOfDepartment}
              onChange={(e) => setFormData({...formData, headOfDepartment: e.target.value})}
              placeholder="e.g., Dr. John Smith"
            />
          </div>
          <div className="form-group">
            <label>Establishment Date</label>
            <input
              type="date"
              value={formData.establishmentDate}
              onChange={(e) => setFormData({...formData, establishmentDate: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Total Students</label>
            <input
              type="number"
              value={formData.totalStudents}
              onChange={(e) => setFormData({...formData, totalStudents: e.target.value})}
              placeholder="e.g., 250"
            />
          </div>
          <div className="form-group">
            <label>Total Teachers</label>
            <input
              type="number"
              value={formData.totalTeachers}
              onChange={(e) => setFormData({...formData, totalTeachers: e.target.value})}
              placeholder="e.g., 15"
            />
          </div>
          <div className="form-group">
            <label>Department Location</label>
            <input
              type="text"
              value={formData.departmentLocation}
              onChange={(e) => setFormData({...formData, departmentLocation: e.target.value})}
              placeholder="e.g., Block A, 2nd Floor"
            />
          </div>
          <div className="form-group">
            <label>Contact Number</label>
            <input
              type="tel"
              value={formData.contactNumber}
              onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
              placeholder="e.g., +92-51-1234567"
            />
          </div>
          <div className="form-group">
            <label>Department Email</label>
            <input
              type="email"
              value={formData.departmentEmail}
              onChange={(e) => setFormData({...formData, departmentEmail: e.target.value})}
              placeholder="e.g., cs@aptech.edu.pk"
            />
          </div>
          <div className="modal-actions">
            <button className="btn-cancel" onClick={onClose}>Cancel</button>
            <button className="btn-save" onClick={handleSubmit}>Save</button>
          </div>
        </div>
      </div>
    );
  };

  const ProgramsModal = ({ isOpen, onClose, data, onSave }) => {
    const [programs, setPrograms] = useState(data || []);

    if (!isOpen) return null;

    const addProgram = () => {
      setPrograms([...programs, { name: '', duration: '', level: '', description: '' }]);
    };

    const removeProgram = (index) => {
      setPrograms(programs.filter((_, i) => i !== index));
    };

    const updateProgram = (index, field, value) => {
      const updatedPrograms = [...programs];
      updatedPrograms[index][field] = value;
      setPrograms(updatedPrograms);
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(programs.filter(program => program.name.trim()));
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
          <h3>Programs Offered</h3>
          {programs.map((program, index) => (
            <div key={index} className="program-item">
              <div className="form-group">
                <label>Program Name</label>
                <input
                  type="text"
                  value={program.name}
                  onChange={(e) => updateProgram(index, 'name', e.target.value)}
                  placeholder="e.g., BS Computer Science"
                />
              </div>
              <div className="form-group">
                <label>Duration</label>
                <input
                  type="text"
                  value={program.duration}
                  onChange={(e) => updateProgram(index, 'duration', e.target.value)}
                  placeholder="e.g., 4 Years"
                />
              </div>
              <div className="form-group">
                <label>Level</label>
                <select
                  value={program.level}
                  onChange={(e) => updateProgram(index, 'level', e.target.value)}
                >
                  <option value="">Select Level</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Bachelor">Bachelor</option>
                  <option value="Master">Master</option>
                  <option value="PhD">PhD</option>
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={program.description}
                  onChange={(e) => updateProgram(index, 'description', e.target.value)}
                  placeholder="Brief description of the program"
                  rows="3"
                />
              </div>
              <button
                type="button"
                onClick={() => removeProgram(index)}
                className="remove-btn"
              >
                Remove Program
              </button>
            </div>
          ))}
          <button type="button" onClick={addProgram} className="add-btn">
            <FaPlus /> Add Program
          </button>
          <div className="modal-actions">
            <button className="btn-cancel" onClick={onClose}>Cancel</button>
            <button className="btn-save" onClick={handleSubmit}>Save</button>
          </div>
        </div>
      </div>
    );
  };

  const FacultyModal = ({ isOpen, onClose, data, onSave }) => {
    const [faculty, setFaculty] = useState(data || []);

    if (!isOpen) return null;

    const addFaculty = () => {
      setFaculty([...faculty, { name: '', designation: '', qualification: '', specialization: '', email: '' }]);
    };

    const removeFaculty = (index) => {
      setFaculty(faculty.filter((_, i) => i !== index));
    };

    const updateFaculty = (index, field, value) => {
      const updatedFaculty = [...faculty];
      updatedFaculty[index][field] = value;
      setFaculty(updatedFaculty);
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(faculty.filter(member => member.name.trim()));
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
          <h3>Faculty Members</h3>
          {faculty.map((member, index) => (
            <div key={index} className="faculty-item">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={member.name}
                  onChange={(e) => updateFaculty(index, 'name', e.target.value)}
                  placeholder="e.g., Dr. Sarah Johnson"
                />
              </div>
              <div className="form-group">
                <label>Designation</label>
                <select
                  value={member.designation}
                  onChange={(e) => updateFaculty(index, 'designation', e.target.value)}
                >
                  <option value="">Select Designation</option>
                  <option value="Professor">Professor</option>
                  <option value="Associate Professor">Associate Professor</option>
                  <option value="Assistant Professor">Assistant Professor</option>
                  <option value="Lecturer">Lecturer</option>
                  <option value="Lab Engineer">Lab Engineer</option>
                </select>
              </div>
              <div className="form-group">
                <label>Qualification</label>
                <input
                  type="text"
                  value={member.qualification}
                  onChange={(e) => updateFaculty(index, 'qualification', e.target.value)}
                  placeholder="e.g., PhD Computer Science"
                />
              </div>
              <div className="form-group">
                <label>Specialization</label>
                <input
                  type="text"
                  value={member.specialization}
                  onChange={(e) => updateFaculty(index, 'specialization', e.target.value)}
                  placeholder="e.g., Artificial Intelligence"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={member.email}
                  onChange={(e) => updateFaculty(index, 'email', e.target.value)}
                  placeholder="e.g., sarah.johnson@aptech.edu.pk"
                />
              </div>
              <button
                type="button"
                onClick={() => removeFaculty(index)}
                className="remove-btn"
              >
                Remove Faculty
              </button>
            </div>
          ))}
          <button type="button" onClick={addFaculty} className="add-btn">
            <FaPlus /> Add Faculty Member
          </button>
          <div className="modal-actions">
            <button className="btn-cancel" onClick={onClose}>Cancel</button>
            <button className="btn-save" onClick={handleSubmit}>Save</button>
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
              placeholder="e.g., Department Head"
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
            <label>Campus</label>
            <input
              type="text"
              value={info.campus || ''}
              onChange={(e) => handleInputChange('campus', e.target.value)}
              placeholder="e.g., Main Campus"
            />
          </div>
          <div className="form-group">
            <label>Contact Number</label>
            <input
              type="tel"
              value={info.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="e.g., +92-51-1234567"
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={info.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="e.g., cs@aptech.edu.pk"
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

  const handleSaveBasicInfo = async (formData) => {
    setBasicInfo(formData);
    await updateUserData({
      name: formData.name,
      title: formData.title,
      location: formData.location,
      campus: formData.campus,
      phone: formData.phone,
      email: formData.email,
    });
    if (user) {
      const latest = await getUserData(user.uid);
      setBasicInfo({
        name: latest.name || '',
        title: latest.title || 'Department Head',
        location: latest.location || 'Islamabad, Pakistan',
        campus: latest.campus || '',
        phone: latest.phone || '',
        email: latest.email || '',
      });
      if (latest.role) setUserRole(latest.role);
    }
    setShowBasicInfoModal(false);
  };

  return (
    <div className="profile-page">
      {/* Background Image Section */}
      <div className="profile-background">
        {backgroundImage ? (
          <img src={backgroundImage} alt="Cover" className="background-image" />
        ) : (
          <div className="background-placeholder">
            <button onClick={() => setShowBgModal(true)} className="upload-btn">
              <FaCamera /> Add a background photo
            </button>
          </div>
        )}
        <button onClick={() => setShowBgModal(true)} className="edit-bg-btn">
          <FaEdit />
        </button>
      </div>

      {/* Profile Content */}
      <div className="profile-content">
        <div className="profile-left-column">
          {/* Profile Info Card */}
          <div className="profile-info-card">
            <div className="profile-card-header">
              <div className="card-title">
                <FaUser />
                {/* <h3>Department Profile</h3> */}
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
                      <FaUser />
                    </div>
                  )}
                  <button onClick={() => setShowProfileModal(true)} className="edit-profile-btn">
                    <FaCamera />
                  </button>
                </div>
              </div>
              <div className="profile-details">
                <h2>{basicInfo.name || 'Department Head'}</h2>
                <p className="profile-title">{basicInfo.title || 'Department Head'}</p>
                {basicInfo.location && (
                  <p className="profile-location">
                    <FaMapMarkerAlt /> {basicInfo.location}
                  </p>
                )}
                {basicInfo.campus && (
                  <p className="profile-campus">
                    <FaBuilding /> {basicInfo.campus}
                  </p>
                )}
                {basicInfo.phone && (
                  <p className="profile-phone">
                    <FaPhone /> {basicInfo.phone}
                  </p>
                )}
                {basicInfo.email && (
                  <p className="profile-email">
                    <FaEnvelope /> {basicInfo.email}
                  </p>
                )}
                <div className="profile-actions">
                  {basicInfo.website && (
                    <a href={basicInfo.website} target="_blank" rel="noopener noreferrer" className="profile-link">
                      <FaGlobe /> Website
                    </a>
                  )}
                  {basicInfo.linkedin && (
                    <a href={basicInfo.linkedin} target="_blank" rel="noopener noreferrer" className="profile-link">
                      <FaLinkedin /> LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Department Information Card */}
          <ProfileCard
            title="Department Information"
            icon={<FaBuilding />}
            onEdit={() => setShowDepartmentInfoModal(true)}
            isEmpty={!departmentInfo.departmentName}
          >
            <div className="info-grid">
              {departmentInfo.departmentName && (
                <div className="info-item">
                  <span className="info-label">Department:</span>
                  <span className="info-value">{departmentInfo.departmentName}</span>
                </div>
              )}
              {departmentInfo.departmentCode && (
                <div className="info-item">
                  <span className="info-label">Code:</span>
                  <span className="info-value">{departmentInfo.departmentCode}</span>
                </div>
              )}
              {departmentInfo.headOfDepartment && (
                <div className="info-item">
                  <span className="info-label">Head:</span>
                  <span className="info-value">{departmentInfo.headOfDepartment}</span>
                </div>
              )}
              {departmentInfo.totalStudents && (
                <div className="info-item">
                  <span className="info-label">Students:</span>
                  <span className="info-value">{departmentInfo.totalStudents}</span>
                </div>
              )}
              {departmentInfo.totalTeachers && (
                <div className="info-item">
                  <span className="info-label">Teachers:</span>
                  <span className="info-value">{departmentInfo.totalTeachers}</span>
                </div>
              )}
              {departmentInfo.departmentLocation && (
                <div className="info-item">
                  <span className="info-label">Location:</span>
                  <span className="info-value">{departmentInfo.departmentLocation}</span>
                </div>
              )}
              {departmentInfo.contactNumber && (
                <div className="info-item">
                  <span className="info-label">Contact:</span>
                  <span className="info-value">{departmentInfo.contactNumber}</span>
                </div>
              )}
              {departmentInfo.departmentEmail && (
                <div className="info-item">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{departmentInfo.departmentEmail}</span>
                </div>
              )}
            </div>
          </ProfileCard>

          {/* Programs Offered Card */}
          <ProfileCard
            title="Programs Offered"
            icon={<FaGraduationCap />}
            onEdit={() => setShowProgramsModal(true)}
            isEmpty={profileData.programs.length === 0}
          >
            <div className="programs-list">
              {profileData.programs.map((program, index) => (
                <div key={index} className="program-item">
                  <h4>{program.name}</h4>
                  <p><strong>Duration:</strong> {program.duration}</p>
                  <p><strong>Level:</strong> {program.level}</p>
                  {program.description && <p>{program.description}</p>}
                </div>
              ))}
            </div>
          </ProfileCard>

          {/* Faculty Members Card */}
          <ProfileCard
            title="Faculty Members"
            icon={<FaUser />}
            onEdit={() => setShowFacultyModal(true)}
            isEmpty={profileData.faculty.length === 0}
          >
            <div className="faculty-list">
              {profileData.faculty.map((member, index) => (
                <div key={index} className="faculty-item">
                  <h4>{member.name}</h4>
                  <p><strong>Designation:</strong> {member.designation}</p>
                  <p><strong>Qualification:</strong> {member.qualification}</p>
                  {member.specialization && <p><strong>Specialization:</strong> {member.specialization}</p>}
                  {member.email && <p><strong>Email:</strong> {member.email}</p>}
                </div>
              ))}
            </div>
          </ProfileCard>

          {/* Department Statistics Card */}
          <ProfileCard
            title="Department Statistics"
            icon={<FaChartBar />}
            onEdit={() => setShowStatsModal(true)}
            isEmpty={!profileData.stats.graduationRate && !profileData.stats.employmentRate}
          >
            <div className="stats-grid">
              {profileData.stats.graduationRate && (
                <div className="stat-item">
                  <span className="stat-value">{profileData.stats.graduationRate}%</span>
                  <span className="stat-label">Graduation Rate</span>
                </div>
              )}
              {profileData.stats.employmentRate && (
                <div className="stat-item">
                  <span className="stat-value">{profileData.stats.employmentRate}%</span>
                  <span className="stat-label">Employment Rate</span>
                </div>
              )}
              {profileData.stats.researchProjects && (
                <div className="stat-item">
                  <span className="stat-value">{profileData.stats.researchProjects}</span>
                  <span className="stat-label">Research Projects</span>
                </div>
              )}
              {profileData.stats.publications && (
                <div className="stat-item">
                  <span className="stat-value">{profileData.stats.publications}</span>
                  <span className="stat-label">Publications</span>
                </div>
              )}
            </div>
          </ProfileCard>
        </div>

        <div className="profile-right-column">
          {/* Right side content placeholder */}
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
      <DepartmentInfoModal 
        isOpen={showDepartmentInfoModal} 
        onClose={() => setShowDepartmentInfoModal(false)} 
        data={departmentInfo} 
        onSave={setDepartmentInfo}
      />
      <ProgramsModal 
        isOpen={showProgramsModal} 
        onClose={() => setShowProgramsModal(false)} 
        data={profileData.programs} 
        onSave={(data) => handleProfileDataUpdate('programs', data)}
      />
      <FacultyModal 
        isOpen={showFacultyModal} 
        onClose={() => setShowFacultyModal(false)} 
        data={profileData.faculty} 
        onSave={(data) => handleProfileDataUpdate('faculty', data)}
      />
      <BasicInfoModal 
        isOpen={showBasicInfoModal} 
        onClose={() => setShowBasicInfoModal(false)} 
        data={basicInfo} 
        onSave={handleSaveBasicInfo}
      />
    </div>
  );
}

export default DepartmentProfilePage; 