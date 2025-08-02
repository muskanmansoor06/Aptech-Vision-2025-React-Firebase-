import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { FaEdit, FaCamera, FaMapMarkerAlt, FaGraduationCap, FaLinkedin, FaGlobe, FaPlus, FaUser, FaCode, FaStar, FaIdCard, FaCalendar, FaBook, FaAward, FaChalkboardTeacher, FaUniversity, FaUsers } from 'react-icons/fa';
import '../assets/styles/ProfilePage.css';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function TeacherProfile() {
  const { user, userRole, userData, updateUserData, getUserData, loading } = useContext(UserContext);
  
  // Add a simple test message
  if (!user) {
    return <div style={{ padding: '100px 20px', textAlign: 'center' }}>
      <h2>Teacher Profile</h2>
      <p>No user logged in</p>
    </div>;
  }

  if (loading) {
    return <div style={{ padding: '100px 20px', textAlign: 'center' }}>
      <h2>Teacher Profile</h2>
      <p>Loading...</p>
    </div>;
  }

  if (userRole !== 'teacher') {
    return <div style={{ padding: '100px 20px', textAlign: 'center' }}>
      <h2>Teacher Profile</h2>
      <p>Current role: {userRole}</p>
      <p>This page is for teachers only.</p>
    </div>;
  }

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
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [courses, setCourses] = useState(Array.isArray(userData?.courses) ? userData.courses : []);
  const [experience, setExperience] = useState(Array.isArray(userData?.experience) ? userData.experience : []);



  // Update skills, courses, and experience when userData changes
  useEffect(() => {
    console.log('UserData updated:', userData);
    
    if (Array.isArray(userData?.skills)) {
      console.log('Setting skills from userData:', userData.skills);
      setSkills(userData.skills);
    } else if (userData?.skills) {
      console.log('Converting skills to array:', userData.skills);
      setSkills([userData.skills]);
    }
    
    if (Array.isArray(userData?.courses)) {
      setCourses(userData.courses);
    }
    if (userData?.experience) {
      if (Array.isArray(userData.experience)) {
        setExperience(userData.experience);
      } else if (typeof userData.experience === 'object') {
        setExperience([userData.experience]);
      }
    }
  }, [userData]);

  // Update academicInfo when userData changes
  useEffect(() => {
    if (userData) {
      setAcademicInfo({
        teacherId: userData.teacherId || '',
        department: userData.department || '',
        qualification: userData.qualification || '',
        specialization: userData.specialization || '',
        joiningDate: userData.joiningDate || '',
        experience: userData.experience || ''
      });
      
      // Also update basicInfo when userData changes
      setBasicInfo({
        name: userData.name || user?.displayName || '',
        title: userData.title || '',
        location: userData.location || '',
        bio: userData.bio || '',
        phone: userData.phone || '',
        website: userData.website || '',
        linkedin: userData.linkedin || ''
      });
    }
  }, [userData, user]);

  // Load skills data when component mounts or user changes
  useEffect(() => {
    const loadSkillsData = async () => {
      if (user && !loading) {
        try {
          setSkillsLoading(true);
          console.log('Loading skills data for user:', user.uid);
          const userData = await getUserData(user.uid);
          console.log('Loaded user data:', userData);
          
          if (userData && userData.skills) {
            if (Array.isArray(userData.skills)) {
              console.log('Setting skills array:', userData.skills);
              setSkills(userData.skills);
            } else {
              console.log('Converting single skill to array:', userData.skills);
              setSkills([userData.skills]);
            }
          } else {
            console.log('No skills data found, setting empty array');
            setSkills([]);
          }
        } catch (error) {
          console.error('Error loading skills data:', error);
          setSkills([]);
        } finally {
          setSkillsLoading(false);
        }
      }
    };

    loadSkillsData();
  }, [user, loading, getUserData]);

  // Image states
  const [profileImage, setProfileImage] = useState(userData?.profileImage || '');
  const [coverImage, setCoverImage] = useState(userData?.coverImage || '');

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
  const ProfileCard = ({ title, icon, onEdit, isEmpty, children }) => {
    // Safety check for children to prevent object rendering
    const safeChildren = React.Children.map(children, (child) => {
      if (child && typeof child === 'object' && !React.isValidElement(child)) {
        console.error('Invalid child detected:', child);
        return null;
      }
      return child;
    });
    
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
            safeChildren
        )}
      </div>
    </div>
  );
  };

  // Academic Info Modal
  const AcademicInfoModal = ({ isOpen, onClose, data, onSave }) => {
    const [formData, setFormData] = useState(data);

    // Update local state when data prop changes
    useEffect(() => {
      if (data && typeof data === 'object') {
        setFormData(data);
      }
    }, [data]);

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

    // Update local state when data prop changes
    useEffect(() => {
      if (Array.isArray(data)) {
        setCourses(data);
      } else {
        setCourses([]);
      }
    }, [data]);

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

    // Update local state when data prop changes
    useEffect(() => {
      if (data && typeof data === 'object') {
        setFormData(data);
      }
    }, [data]);

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

    // Update local state when data prop changes
    useEffect(() => {
      if (Array.isArray(data)) {
        setSkills(data);
      } else {
        setSkills([]);
      }
    }, [data]);

    const addSkill = () => {
      const trimmedSkill = skillInput.trim();
      if (trimmedSkill && !skills.includes(trimmedSkill)) {
        setSkills([...skills, trimmedSkill]);
        setSkillInput('');
        // Focus back to input for better UX
        setTimeout(() => {
          const input = document.querySelector('.skill-input-group input');
          if (input) input.focus();
        }, 100);
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

    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addSkill();
      }
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
                  placeholder="e.g., JavaScript, React, Node.js"
                  onKeyPress={handleKeyPress}
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

    // Update local state when data prop changes
    useEffect(() => {
      if (Array.isArray(data)) {
        setExperience(data);
      } else {
        setExperience([]);
      }
    }, [data]);

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

  const handleSaveBasicInfo = async (formData) => {
    try {
    // Update local state immediately for instant UI feedback
    setBasicInfo(formData);
      
      // Save to backend
    await updateUserData({
      name: formData.name,
      title: formData.title,
      location: formData.location,
      bio: formData.bio,
      phone: formData.phone,
      website: formData.website,
      linkedin: formData.linkedin
    });
      
      // Fetch latest data from backend to ensure consistency
    if (user) {
      const latest = await getUserData(user.uid);
        if (latest) {
      setBasicInfo({
        name: latest.name || '',
        title: latest.title || '',
        location: latest.location || '',
        bio: latest.bio || '',
        phone: latest.phone || '',
        website: latest.website || '',
        linkedin: latest.linkedin || ''
      });
        }
      }
    } catch (error) {
      console.error('Error saving basic info:', error);
      alert('Error saving data. Please try again.');
    }
    setShowBasicInfoModal(false);
  };

  // Save experience to backend
  const handleSaveExperience = async (newExperience) => {
    try {
      // Validate and clean the experience data
      const validExperience = Array.isArray(newExperience) 
        ? newExperience.filter(exp => 
            exp && typeof exp === 'object' && 
            typeof exp.title === 'string' && exp.title.trim() !== ''
          )
        : [];
      
      // Update local state immediately
      setExperience(validExperience);
      
      // Save to backend
      await updateUserData({ experience: validExperience });
      
      // Fetch latest data from backend to ensure consistency
    if (user) {
      const latest = await getUserData(user.uid);
        if (latest && latest.experience) {
          if (Array.isArray(latest.experience)) {
            setExperience(latest.experience);
          } else if (typeof latest.experience === 'object') {
            setExperience([latest.experience]);
          }
        }
      }
    } catch (error) {
      console.error('Error saving experience:', error);
      alert('Error saving experience. Please try again.');
    }
    setShowExperienceModal(false);
  };

  // Defensive: always ensure experience is an array before rendering
  let safeExperience = [];
  if (experience) {
    if (Array.isArray(experience)) {
      // Filter out any invalid items
      safeExperience = experience.filter(exp => 
        exp && typeof exp === 'object' && exp !== null
      );
    } else if (typeof experience === 'object' && experience !== null) {
      // If it's a single object, wrap it in an array
    safeExperience = [experience];
    }
  }
  
  // Additional safety check - ensure all items are valid objects
  safeExperience = safeExperience.filter(exp => 
    exp && typeof exp === 'object' && exp !== null
  );
  


  // Final safety check - if experience is not an array, don't render
  if (experience && !Array.isArray(experience) && typeof experience === 'object') {
    console.error('Experience is not an array:', experience);
    // Convert to array if it's a single object
    setExperience([experience]);
    return <div style={{ padding: '100px 20px', textAlign: 'center' }}>
      <h2>Loading Profile...</h2>
      <p>Please wait while we load your profile data.</p>
    </div>;
  }

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
          {/* Profile Info Card (Teacher Specific) */}
          <div className="profile-info-card">
            <div className="profile-card-header">
              <div className="card-title">
                <FaUser />
                {/* <h3>Teacher Profile</h3> */}
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
                  <input type="file" accept="image/*" style={{display:'none'}} id="profile-upload" onChange={e => e.target.files[0] && handleImageUpload(e.target.files[0], 'profile')} />
                  <label htmlFor="profile-upload" className="edit-profile-btn"><FaCamera /></label>
                </div>
              </div>
              <div className="profile-details">
                <h2>{typeof basicInfo.name === 'string' ? basicInfo.name : 'Your Name'}</h2>
                <p className="profile-title">
                  {typeof basicInfo.title === 'string' ? basicInfo.title : 'Teacher'} • {userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1) : 'User'}
                </p>
                {typeof basicInfo.location === 'string' && basicInfo.location && (
                  <p className="profile-location">
                    <FaMapMarkerAlt /> {basicInfo.location}
                  </p>
                )}
                {typeof basicInfo.bio === 'string' && basicInfo.bio && <p className="profile-bio">{basicInfo.bio}</p>}
                <div className="profile-actions">
                  {typeof basicInfo.website === 'string' && basicInfo.website && (
                    <a href={basicInfo.website} target="_blank" rel="noopener noreferrer" className="profile-link">
                      <FaGlobe /> Website
                    </a>
                  )}
                  {typeof basicInfo.linkedin === 'string' && basicInfo.linkedin && (
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
                <span className="info-value">
                  {typeof academicInfo.teacherId === 'string' ? academicInfo.teacherId : 'Not specified'}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Department:</span>
                <span className="info-value">
                  {typeof academicInfo.department === 'string' ? academicInfo.department : 'Not specified'}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Qualification:</span>
                <span className="info-value">
                  {typeof academicInfo.qualification === 'string' ? academicInfo.qualification : 'Not specified'}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Specialization:</span>
                <span className="info-value">
                  {typeof academicInfo.specialization === 'string' ? academicInfo.specialization : 'Not specified'}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Joining Date:</span>
                <span className="info-value">
                  {typeof academicInfo.joiningDate === 'string' ? academicInfo.joiningDate : 'Not specified'}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Experience:</span>
                <span className="info-value">
                  {typeof academicInfo.experience === 'string' || typeof academicInfo.experience === 'number' 
                    ? `${academicInfo.experience} years` 
                    : 'Not specified'}
                </span>
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
              {(() => {
                try {
                  if (skillsLoading) {
                    return <p style={{ color: '#6b7280', fontStyle: 'italic' }}>Loading skills...</p>;
                  }
                  
                  if (Array.isArray(skills) && skills.length > 0) {
                    return skills.map((skill, index) => {
                      if (typeof skill !== 'string') {
                        console.warn('Invalid skill item:', skill);
                        return null;
                      }
                      return <span key={index} className="skill-tag">{skill}</span>;
                    });
                  } else {
                    return <p style={{ color: '#6b7280', fontStyle: 'italic' }}>No skills added yet. Click edit to add your skills.</p>;
                  }
                } catch (error) {
                  console.error('Error rendering skills:', error);
                  return <p>Error loading skills data</p>;
                }
              })()}
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
              {(() => {
                try {
                  if (Array.isArray(courses)) {
                    return courses.map((course, index) => {
                      // Ensure course is an object with the expected properties
                      if (!course || typeof course !== 'object') {
                        console.warn('Invalid course item:', course);
                        return null;
                      }
                      
                      // Ensure all properties are strings
                      const name = typeof course.name === 'string' ? course.name : 'No course name';
                      const code = typeof course.code === 'string' ? course.code : 'No code';
                      const semester = typeof course.semester === 'string' ? course.semester : 'No semester';
                      const description = typeof course.description === 'string' ? course.description : null;
                      
                      return (
                <div key={index} className="course-item">
                          <h4>{name}</h4>
                          <p className="course-code">{code}</p>
                          <p className="course-semester">{semester}</p>
                          {description && <p className="course-description">{description}</p>}
                </div>
                      );
                    });
                  }
                  return null;
                } catch (error) {
                  console.error('Error rendering courses:', error);
                  return <p>Error loading courses data</p>;
                }
              })()}
            </div>
          </ProfileCard>

          {/* Teaching Experience Card */}
          <ProfileCard
            title="Teaching Experience"
            icon={<FaChalkboardTeacher />}
            onEdit={() => setShowExperienceModal(true)}
            isEmpty={!Array.isArray(safeExperience) || safeExperience.length === 0}
          >
            <div className="experience-list">
              {(() => {
                try {
                  if (Array.isArray(safeExperience) && safeExperience.length > 0) {
                    return safeExperience.map((exp, idx) => {
                      // Ensure exp is an object with the expected properties
                      if (!exp || typeof exp !== 'object' || exp === null) {
                        console.warn('Invalid experience item:', exp);
                        return null;
                      }
                      
                      // Ensure all properties are strings or undefined
                      const title = typeof exp.title === 'string' ? exp.title : 'No title';
                      const company = typeof exp.company === 'string' ? exp.company : 'No institution';
                      const duration = typeof exp.duration === 'string' ? exp.duration : 'No duration';
                      const description = typeof exp.description === 'string' ? exp.description : null;
                      
                      return (
                  <div key={idx} className="experience-item">
                          <h4>{title}</h4>
                          <p><strong>Institution:</strong> {company}</p>
                          <p><strong>Duration:</strong> {duration}</p>
                          {description && <p>{description}</p>}
                  </div>
                      );
                    });
                  }
                  return null;
                } catch (error) {
                  console.error('Error rendering experience:', error);
                  return <p>Error loading experience data</p>;
                }
              })()}
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
        onSave={handleSaveBasicInfo}
      />
      <AcademicInfoModal 
        isOpen={showAcademicModal} 
        onClose={() => setShowAcademicModal(false)} 
        data={academicInfo} 
        onSave={async (formData) => {
          try {
            // Update local state immediately
            setAcademicInfo(formData);
            
            // Save to backend
            await updateUserData({
              teacherId: formData.teacherId,
              department: formData.department,
              qualification: formData.qualification,
              specialization: formData.specialization,
              joiningDate: formData.joiningDate,
              experience: formData.experience
            });
            
            // Fetch latest data from backend to ensure consistency
            if (user) {
              const latest = await getUserData(user.uid);
              if (latest) {
                setAcademicInfo({
                  teacherId: latest.teacherId || '',
                  department: latest.department || '',
                  qualification: latest.qualification || '',
                  specialization: latest.specialization || '',
                  joiningDate: latest.joiningDate || '',
                  experience: latest.experience || ''
                });
              }
            }
          } catch (error) {
            console.error('Error saving academic info:', error);
            alert('Error saving academic information. Please try again.');
          }
          setShowAcademicModal(false);
        }}
      />
      <SkillsModal 
        isOpen={showSkillsModal} 
        onClose={() => setShowSkillsModal(false)} 
        data={skills} 
        onSave={async (newSkills) => {
          try {
            console.log('Saving skills to backend:', newSkills);
            
            // Update local state immediately for instant UI feedback
            setSkills(newSkills);
            
            // Save to backend silently
            await updateUserData({ skills: newSkills });
            
            // No need to fetch again since we already updated local state
            // This provides instant feedback to user
            
          } catch (error) {
            console.error('Error saving skills:', error);
            // Silent error handling - no alert
          }
          setShowSkillsModal(false);
        }}
      />
      <CoursesModal 
        isOpen={showCoursesModal} 
        onClose={() => setShowCoursesModal(false)} 
        data={courses} 
        onSave={async (newCourses) => {
          try {
            // Update local state immediately
            setCourses(newCourses);
            
            // Save to backend
            await updateUserData({ courses: newCourses });
            
            // Fetch latest data from backend to ensure consistency
            if (user) {
              const latest = await getUserData(user.uid);
              if (latest && Array.isArray(latest.courses)) {
                setCourses(latest.courses);
              }
            }
          } catch (error) {
            console.error('Error saving courses:', error);
            alert('Error saving courses. Please try again.');
          }
          setShowCoursesModal(false);
        }}
      />
      <ExperienceModal 
        isOpen={showExperienceModal} 
        onClose={() => setShowExperienceModal(false)} 
        data={experience} 
        onSave={handleSaveExperience}
      />
    </div>
  );
}

export default TeacherProfile; 