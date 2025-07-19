import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { FaEdit, FaCamera, FaMapMarkerAlt, FaGraduationCap, FaLinkedin, FaGlobe, FaPlus, FaUser, FaCode, FaStar, FaIdCard, FaCalendar, FaBook, FaAward, FaChalkboardTeacher, FaUniversity, FaUsers } from 'react-icons/fa';
import '../assets/styles/ProfilePage.css';

function TeacherProfile() {
  const { user, userRole, userData, updateUserData } = useContext(UserContext);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showBasicInfoModal, setShowBasicInfoModal] = useState(false);
  const [showAcademicModal, setShowAcademicModal] = useState(false);
  const [showSkillsModal, setShowSkillsModal] = useState(false);
  const [showCoursesModal, setShowCoursesModal] = useState(false);
  const [showExperienceModal, setShowExperienceModal] = useState(false);

  // State for profile data
  const [basicInfo, setBasicInfo] = useState({
    name: userData?.name || user?.displayName || '',
    title: userData?.title || '',
    location: userData?.location || '',
    bio: userData?.bio || '',
    phone: userData?.phone || '',
    website: userData?.website || '',
    linkedin: userData?.linkedin || ''
  });

  const [academicInfo, setAcademicInfo] = useState({
    teacherId: userData?.teacherId || '',
    department: userData?.department || '',
    qualification: userData?.qualification || '',
    specialization: userData?.specialization || '',
    joiningDate: userData?.joiningDate || '',
    experience: userData?.experience || ''
  });

  const [skills, setSkills] = useState([]);
  const [courses, setCourses] = useState([]);
  const [experience, setExperience] = useState([]);

  // Image states
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const handleImageUpload = (file, type) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (type === 'profile') {
        setProfileImage(e.target.result);
      } else {
        setCoverImage(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Image Upload Modal Component
  const ImageUploadModal = ({ isOpen, onClose, type }) => {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileSelect = (e) => {
      const file = e.target.files[0];
      if (file && file.type.startsWith('image/')) {
        setSelectedFile(file);
      }
    };

    const handleUpload = () => {
      if (selectedFile) {
        handleImageUpload(selectedFile, type);
        onClose();
      }
    };

    if (!isOpen) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h3>Upload {type === 'profile' ? 'Profile' : 'Cover'} Photo</h3>
            <button onClick={onClose} className="modal-close">&times;</button>
          </div>
          <div className="modal-body">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="file-input"
            />
            {selectedFile && (
              <div className="image-preview">
                <img src={URL.createObjectURL(selectedFile)} alt="Preview" />
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button onClick={onClose} className="btn-secondary">Cancel</button>
            <button onClick={handleUpload} className="btn-primary" disabled={!selectedFile}>
              Upload
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Profile Card Component
  const ProfileCard = ({ title, icon, onEdit, isEmpty, children }) => (
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

  // Academic Info Modal
  const AcademicInfoModal = ({ isOpen, onClose, data, onSave }) => {
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
          <div className="modal-header">
            <h3>Academic Information</h3>
            <button onClick={onClose} className="modal-close">&times;</button>
          </div>
          <form onSubmit={handleSubmit} className="modal-body">
            <div className="form-group">
              <label>Teacher ID</label>
              <input
                type="text"
                value={formData.teacherId}
                onChange={(e) => setFormData({...formData, teacherId: e.target.value})}
                placeholder="e.g., T-2024-123"
              />
            </div>
            <div className="form-group">
              <label>Department</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                placeholder="e.g., Computer Science"
              />
            </div>
            <div className="form-group">
              <label>Qualification</label>
              <input
                type="text"
                value={formData.qualification}
                onChange={(e) => setFormData({...formData, qualification: e.target.value})}
                placeholder="e.g., MS Computer Science"
              />
            </div>
            <div className="form-group">
              <label>Specialization</label>
              <input
                type="text"
                value={formData.specialization}
                onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                placeholder="e.g., Web Development, AI/ML"
              />
            </div>
            <div className="form-group">
              <label>Joining Date</label>
              <input
                type="date"
                value={formData.joiningDate}
                onChange={(e) => setFormData({...formData, joiningDate: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Years of Experience</label>
              <input
                type="number"
                value={formData.experience}
                onChange={(e) => setFormData({...formData, experience: e.target.value})}
                placeholder="e.g., 5"
              />
            </div>
          </form>
          <div className="modal-footer">
            <button onClick={onClose} className="btn-secondary">Cancel</button>
            <button onClick={handleSubmit} className="btn-primary">Save</button>
          </div>
        </div>
      </div>
    );
  };

  // Courses Modal
  const CoursesModal = ({ isOpen, onClose, data, onSave }) => {
    const [courses, setCourses] = useState(data);

    const addCourse = () => {
      setCourses([...courses, { name: '', code: '', description: '', semester: '' }]);
    };

    const removeCourse = (index) => {
      setCourses(courses.filter((_, i) => i !== index));
    };

    const updateCourse = (index, field, value) => {
      const updatedCourses = [...courses];
      updatedCourses[index][field] = value;
      setCourses(updatedCourses);
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(courses.filter(course => course.name.trim()));
      onClose();
    };

    if (!isOpen) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h3>Courses Taught</h3>
            <button onClick={onClose} className="modal-close">&times;</button>
          </div>
          <div className="modal-body">
            {courses.map((course, index) => (
              <div key={index} className="course-form-item">
                <div className="form-group">
                  <label>Course Name</label>
                  <input
                    type="text"
                    value={course.name}
                    onChange={(e) => updateCourse(index, 'name', e.target.value)}
                    placeholder="e.g., Web Development"
                  />
                </div>
                <div className="form-group">
                  <label>Course Code</label>
                  <input
                    type="text"
                    value={course.code}
                    onChange={(e) => updateCourse(index, 'code', e.target.value)}
                    placeholder="e.g., CS-301"
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={course.description}
                    onChange={(e) => updateCourse(index, 'description', e.target.value)}
                    placeholder="Course description..."
                  />
                </div>
                <div className="form-group">
                  <label>Semester</label>
                  <input
                    type="text"
                    value={course.semester}
                    onChange={(e) => updateCourse(index, 'semester', e.target.value)}
                    placeholder="e.g., Fall 2024"
                  />
                </div>
                <button 
                  type="button" 
                  onClick={() => removeCourse(index)}
                  className="remove-btn"
                >
                  Remove Course
                </button>
              </div>
            ))}
            <button type="button" onClick={addCourse} className="add-btn">
              <FaPlus /> Add Course
            </button>
          </div>
          <div className="modal-footer">
            <button onClick={onClose} className="btn-secondary">Cancel</button>
            <button onClick={handleSubmit} className="btn-primary">Save</button>
          </div>
        </div>
      </div>
    );
  };

  // Basic Info Modal
  const BasicInfoModal = ({ isOpen, onClose, data, onSave }) => {
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
          <div className="modal-header">
            <h3>Basic Information</h3>
            <button onClick={onClose} className="modal-close">&times;</button>
          </div>
          <form onSubmit={handleSubmit} className="modal-body">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Your full name"
              />
            </div>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="e.g., Senior Lecturer"
              />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="e.g., Karachi, Pakistan"
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="e.g., +92-300-1234567"
              />
            </div>
            <div className="form-group">
              <label>Website</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({...formData, website: e.target.value})}
                placeholder="e.g., https://yourwebsite.com"
              />
            </div>
            <div className="form-group">
              <label>LinkedIn</label>
              <input
                type="url"
                value={formData.linkedin}
                onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                placeholder="e.g., https://linkedin.com/in/yourprofile"
              />
            </div>
            <div className="form-group">
              <label>Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                placeholder="Tell us about yourself..."
                rows="4"
              />
            </div>
          </form>
          <div className="modal-footer">
            <button onClick={onClose} className="btn-secondary">Cancel</button>
            <button onClick={handleSubmit} className="btn-primary">Save</button>
          </div>
        </div>
      </div>
    );
  };

  // Skills Modal
  const SkillsModal = ({ isOpen, onClose, data, onSave }) => {
    const [skillInput, setSkillInput] = useState('');
    const [skills, setSkills] = useState(data);

    const addSkill = () => {
      if (skillInput.trim() && !skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
        setSkillInput('');
      }
    };

    const removeSkill = (skillToRemove) => {
      setSkills(skills.filter(skill => skill !== skillToRemove));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(skills);
      onClose();
    };

    if (!isOpen) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h3>Skills</h3>
            <button onClick={onClose} className="modal-close">&times;</button>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <label>Add Skill</label>
              <div className="skill-input-group">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="e.g., JavaScript"
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                />
                <button type="button" onClick={addSkill} className="add-skill-btn">
                  <FaPlus />
                </button>
              </div>
            </div>
            <div className="skills-list">
              {skills.map((skill, index) => (
                <div key={index} className="skill-tag">
                  {skill}
                  <button onClick={() => removeSkill(skill)} className="remove-skill">
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="modal-footer">
            <button onClick={onClose} className="btn-secondary">Cancel</button>
            <button onClick={handleSubmit} className="btn-primary">Save</button>
          </div>
        </div>
      </div>
    );
  };

  // Experience Modal
  const ExperienceModal = ({ isOpen, onClose, data, onSave }) => {
    const [experience, setExperience] = useState(data);

    const addExperience = () => {
      setExperience([...experience, { 
        title: '', 
        company: '', 
        duration: '', 
        description: '' 
      }]);
    };

    const removeExperience = (index) => {
      setExperience(experience.filter((_, i) => i !== index));
    };

    const updateExperience = (index, field, value) => {
      const updatedExperience = [...experience];
      updatedExperience[index][field] = value;
      setExperience(updatedExperience);
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(experience.filter(exp => exp.title.trim()));
      onClose();
    };

    if (!isOpen) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h3>Teaching Experience</h3>
            <button onClick={onClose} className="modal-close">&times;</button>
          </div>
          <div className="modal-body">
            {experience.map((exp, index) => (
              <div key={index} className="experience-form-item">
                <div className="form-group">
                  <label>Position</label>
                  <input
                    type="text"
                    value={exp.title}
                    onChange={(e) => updateExperience(index, 'title', e.target.value)}
                    placeholder="e.g., Senior Lecturer"
                  />
                </div>
                <div className="form-group">
                  <label>Institution</label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => updateExperience(index, 'company', e.target.value)}
                    placeholder="e.g., Aptech Computer Education"
                  />
                </div>
                <div className="form-group">
                  <label>Duration</label>
                  <input
                    type="text"
                    value={exp.duration}
                    onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                    placeholder="e.g., 2020 - Present"
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={exp.description}
                    onChange={(e) => updateExperience(index, 'description', e.target.value)}
                    placeholder="Describe your role and achievements..."
                  />
                </div>
                <button 
                  type="button" 
                  onClick={() => removeExperience(index)}
                  className="remove-btn"
                >
                  Remove Experience
                </button>
              </div>
            ))}
            <button type="button" onClick={addExperience} className="add-btn">
              <FaPlus /> Add Experience
            </button>
          </div>
          <div className="modal-footer">
            <button onClick={onClose} className="btn-secondary">Cancel</button>
            <button onClick={handleSubmit} className="btn-primary">Save</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="profile-page">
      {/* Background Image Section */}
      <div className="profile-background">
        {coverImage ? (
          <img src={coverImage} alt="Cover" className="cover-image" />
        ) : (
          <div className="cover-placeholder">
            <button onClick={() => setShowImageModal(true)} className="upload-btn">
              <FaCamera /> Upload Cover Photo
            </button>
          </div>
        )}
        <button onClick={() => setShowImageModal(true)} className="cover-edit-btn">
          <FaEdit />
        </button>
      </div>

      {/* Profile Content - Two Column Layout */}
      <div className="profile-content">
        <div className="profile-left-column">
          {/* Profile Info Card (Teacher Specific) */}
          <div className="profile-info-card">
            <div className="profile-card-header">
              <div className="card-title">
                <FaUser />
                <h3>Teacher Profile</h3>
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
                    <div className="photo-placeholder">
                      <FaUser />
                    </div>
                  )}
                  <button onClick={() => setShowImageModal(true)} className="photo-edit-btn">
                    <FaCamera />
                  </button>
                </div>
              </div>
              <div className="profile-details">
                <h2>{basicInfo.name || 'Your Name'}</h2>
                <p className="profile-title">{basicInfo.title || 'Teacher'} • {userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1) : 'User'}</p>
                {basicInfo.location && (
                  <p className="profile-location">
                    <FaMapMarkerAlt /> {basicInfo.location}
                  </p>
                )}
                {basicInfo.bio && <p className="profile-bio">{basicInfo.bio}</p>}
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

          {/* Academic Information Card */}
          <ProfileCard
            title="Academic Information"
            icon={<FaChalkboardTeacher />}
            onEdit={() => setShowAcademicModal(true)}
            isEmpty={!academicInfo.teacherId}
          >
            <div className="academic-info">
              <div className="info-row">
                <span className="info-label">Teacher ID:</span>
                <span className="info-value">{academicInfo.teacherId}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Department:</span>
                <span className="info-value">{academicInfo.department}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Qualification:</span>
                <span className="info-value">{academicInfo.qualification}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Specialization:</span>
                <span className="info-value">{academicInfo.specialization}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Joining Date:</span>
                <span className="info-value">{academicInfo.joiningDate}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Experience:</span>
                <span className="info-value">{academicInfo.experience} years</span>
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
            <div className="skills-display">
              {skills.map((skill, index) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))}
            </div>
          </ProfileCard>

          {/* Courses Card */}
          <ProfileCard
            title="Courses Taught"
            icon={<FaBook />}
            onEdit={() => setShowCoursesModal(true)}
            isEmpty={courses.length === 0}
          >
            <div className="courses-list">
              {courses.map((course, index) => (
                <div key={index} className="course-item">
                  <h4>{course.name}</h4>
                  <p className="course-code">{course.code}</p>
                  <p className="course-semester">{course.semester}</p>
                  {course.description && <p className="course-description">{course.description}</p>}
                </div>
              ))}
            </div>
          </ProfileCard>

          {/* Experience Card */}
          <ProfileCard
            title="Teaching Experience"
            icon={<FaAward />}
            onEdit={() => setShowExperienceModal(true)}
            isEmpty={experience.length === 0}
          >
            <div className="experience-list">
              {experience.map((exp, index) => (
                <div key={index} className="experience-item">
                  <h4>{exp.title}</h4>
                  <p className="experience-company">{exp.company}</p>
                  <p className="experience-duration">{exp.duration}</p>
                  {exp.description && <p className="experience-description">{exp.description}</p>}
                </div>
              ))}
            </div>
          </ProfileCard>
        </div>

        <div className="profile-right-column">
          {/* Right side content placeholder */}
        </div>
      </div>

      {/* Modals */}
      <ImageUploadModal 
        isOpen={showImageModal} 
        onClose={() => setShowImageModal(false)} 
        type="profile"
      />
      <BasicInfoModal 
        isOpen={showBasicInfoModal} 
        onClose={() => setShowBasicInfoModal(false)} 
        data={basicInfo} 
        onSave={setBasicInfo}
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
      <CoursesModal 
        isOpen={showCoursesModal} 
        onClose={() => setShowCoursesModal(false)} 
        data={courses} 
        onSave={setCourses}
      />
      <ExperienceModal 
        isOpen={showExperienceModal} 
        onClose={() => setShowExperienceModal(false)} 
        data={experience} 
        onSave={setExperience}
      />
    </div>
  );
}

export default TeacherProfile; 