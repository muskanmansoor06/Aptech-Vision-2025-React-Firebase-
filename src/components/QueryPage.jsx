import React, { useState, useContext, useEffect, useRef } from 'react';
import { UserContext } from '../context/UserContext';
import { FaThumbsUp, FaComment, FaShare, FaEllipsisH, FaUser, FaClock, FaEdit, FaTrash, FaReply, FaHeart, FaImage, FaVideo, FaPalette, FaTimes } from 'react-icons/fa';
import { db, storage, collection, addDoc, getDocs, query, orderBy, serverTimestamp, ref, uploadBytes, getDownloadURL, updateDoc, doc } from '../../firebase.js';
import '../assets/styles/QueryPage.css';

function QueryPage() {
  const { user, userRole, userData } = useContext(UserContext);
  const [queries, setQueries] = useState([]);
  const [newQuery, setNewQuery] = useState('');
  const [showPostForm, setShowPostForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [selectedBackground, setSelectedBackground] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);

  // Background colors for text posts (Facebook-like)
  const backgroundColors = [
    { name: 'Default', color: 'transparent' },
    { name: 'Blue', color: '#1877f2' },
    { name: 'Green', color: '#42b883' },
    { name: 'Purple', color: '#7A6AD8' },
    { name: 'Orange', color: '#ff6b35' },
    { name: 'Pink', color: '#e91e63' },
    { name: 'Yellow', color: '#ffc107' },
    { name: 'Red', color: '#dc3545' },
    { name: 'Teal', color: '#20c997' },
    { name: 'Indigo', color: '#6610f2' }
  ];

  // Fetch posts from Firebase
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const postsQuery = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(postsQuery);
      const postsData = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        postsData.push({
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate ? data.timestamp.toDate().toLocaleString() : data.timestamp
        });
      });
      
      setQueries(postsData);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load posts on component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  // Upload media to Firebase Storage
  const uploadMedia = async (file) => {
    try {
      console.log('Starting media upload for file:', file.name);
      const storageRef = ref(storage, `posts/${Date.now()}_${file.name}`);
      console.log('Storage reference created:', storageRef.fullPath);
      
      const snapshot = await uploadBytes(storageRef, file);
      console.log('File uploaded successfully:', snapshot);
      
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('Download URL obtained:', downloadURL);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading media:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  };

  // Media handling functions
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    console.log('Image file selected:', file);
    
    if (file && file.type.startsWith('image/')) {
      console.log('Valid image file, creating preview...');
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log('Preview created, setting media state...');
        setSelectedMedia({ type: 'image', url: e.target.result, file });
      };
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        alert('Error reading image file. Please try again.');
      };
      reader.readAsDataURL(file);
    } else {
      console.error('Invalid file type:', file?.type);
      alert('Please select a valid image file.');
    }
  };

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('video/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedMedia({ type: 'video', url: e.target.result, file });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeMedia = () => {
    setSelectedMedia(null);
  };

  const selectBackground = (color) => {
    setSelectedBackground(color);
    setShowColorPicker(false);
  };

  const handlePostQuery = async () => {
    console.log('handlePostQuery called with:', { newQuery, selectedMedia, user });
    
    if ((newQuery.trim() || selectedMedia) && user) {
      try {
        setPosting(true);
        console.log('Starting post creation...');
        
        let mediaURL = null;
        if (selectedMedia?.file) {
          console.log('Uploading media file...');
          mediaURL = await uploadMedia(selectedMedia.file);
          console.log('Media uploaded, URL:', mediaURL);
        }

        const postData = {
        author: {
          name: userData?.name || user?.displayName || 'Anonymous',
          role: userRole || 'user',
            avatar: user?.photoURL || null,
            uid: user.uid
        },
        content: newQuery.trim(),
          media: selectedMedia ? {
            type: selectedMedia.type,
            url: mediaURL || selectedMedia.url
          } : null,
          background: selectedBackground,
          timestamp: serverTimestamp(),
        likes: 0,
        comments: [],
        liked: false
      };

        console.log('Post data prepared:', postData);

        // Add post to Firebase
        const docRef = await addDoc(collection(db, 'posts'), postData);
        console.log('Post added to Firebase with ID:', docRef.id);
        
        // Refresh posts
        await fetchPosts();
        
        // Reset form
      setNewQuery('');
        setSelectedMedia(null);
        setSelectedBackground(null);
      setShowPostForm(false);
        
        console.log('Post created successfully!');
      } catch (error) {
        console.error('Error posting query:', error);
        alert(`Error posting query: ${error.message}. Please try again.`);
      } finally {
        setPosting(false);
      }
    } else if (!user) {
      alert('Please login to post a query.');
    } else {
      alert('Please add some content or media to your post.');
    }
  };

  const handleLike = async (queryId) => {
    if (!user) {
      alert('Please login to like posts.');
      return;
    }

    try {
      // For now, we'll just update the local state
      // In a full implementation, you'd update the Firebase document
    setQueries(queries.map(query => {
      if (query.id === queryId) {
        return {
          ...query,
          likes: query.liked ? query.likes - 1 : query.likes + 1,
          liked: !query.liked
        };
      }
      return query;
    }));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleCommentLike = async (queryId, commentId) => {
    if (!user) {
      alert('Please login to like comments.');
      return;
    }

    try {
      // For now, we'll just update the local state
      // In a full implementation, you'd update the Firebase document
    setQueries(queries.map(query => {
      if (query.id === queryId) {
        return {
          ...query,
          comments: query.comments.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                likes: comment.liked ? comment.likes - 1 : comment.likes + 1,
                liked: !comment.liked
              };
            }
            return comment;
          })
        };
      }
      return query;
    }));
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const handleAddComment = async (queryId, commentText) => {
    if (!commentText.trim()) return;
    
    if (!user) {
      alert('Please login to add comments.');
      return;
    }

    try {
      const newComment = {
        id: Date.now(),
        author: userData?.name || user?.displayName || 'Anonymous',
        content: commentText.trim(),
        timestamp: 'Just now',
        likes: 0,
        liked: false
      };

      // For now, we'll just update the local state
      // In a full implementation, you'd add the comment to Firebase
      setQueries(queries.map(query => {
        if (query.id === queryId) {
          return {
            ...query,
            comments: [...query.comments, newComment]
          };
        }
        return query;
      }));
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'Just now';
    
    const now = new Date();
    const postTime = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const diffInSeconds = Math.floor((now - postTime) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d`;
    } else if (diffInSeconds < 31536000) {
      const months = Math.floor(diffInSeconds / 2592000);
      return `${months}mo`;
    } else {
      const years = Math.floor(diffInSeconds / 31536000);
      return `${years}y`;
    }
  };

  return (
    <div className="query-page">
      {/* Header */}
      {/* <div className="query-header">
        <h1>Queries & Discussions</h1>
        <p>Ask questions, share knowledge, and connect with the community</p>
      </div> */}

      {/* Main Content Layout */}
      <div className="query-layout">
        {/* Left Sidebar - User Profile */}
        <div className="query-sidebar-left">
          <div className="user-profile-card">
            <div className="profile-header">
              <div className="profile-avatar">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Profile" />
                ) : (
                  <FaUser />
                )}
              </div>
              <div className="profile-info">
                <h3>{userData?.name || user?.displayName || 'User Name'}</h3>
                <p className="profile-title">{userData?.title || 'Student'}</p>
                <p className="profile-location">{userData?.location || 'Islamabad, Pakistan'}</p>
              </div>
            </div>

            <div className="profile-actions">
              <button className="profile-btn primary">View Profile</button>
              <button className="profile-btn secondary">Edit Profile</button>
            </div>
          </div>
      </div>

        {/* Center - Main Content */}
        <div className="query-main-content">
      {/* Post Query Section */}
      <div className="post-query-section">
        <div className="post-query-card">
          <div className="post-query-header">
            <div className="user-avatar">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Avatar" />
              ) : (
                <FaUser />
              )}
            </div>
            <div className="post-query-input" onClick={() => setShowPostForm(true)}>
              <span>What's on your mind?</span>
            </div>
          </div>
          
          {showPostForm && (
            <div className="post-query-form">
                  {/* Background Color Picker */}
                  {showColorPicker && (
                    <div className="color-picker">
                      <div className="color-picker-header">
                        <span>Choose Background</span>
                        <button onClick={() => setShowColorPicker(false)}>
                          <FaTimes />
                        </button>
                      </div>
                      <div className="color-options">
                        {backgroundColors.map((bg, index) => (
                          <button
                            key={index}
                            className={`color-option ${selectedBackground === bg.color ? 'selected' : ''}`}
                            style={{ backgroundColor: bg.color }}
                            onClick={() => selectBackground(bg.color)}
                            title={bg.name}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Text Area with Background */}
                  <div 
                    className="post-textarea-container"
                    style={{ backgroundColor: selectedBackground || 'transparent' }}
                  >
              <textarea
                value={newQuery}
                onChange={(e) => setNewQuery(e.target.value)}
                placeholder="Share your question or thought..."
                rows="4"
                      style={{ 
                        color: selectedBackground && selectedBackground !== 'transparent' ? 'white' : '#333',
                        backgroundColor: 'transparent',
                        border: 'none',
                        outline: 'none'
                      }}
                    />
                  </div>

                  {/* Media Preview */}
                  {selectedMedia && (
                    <div className="media-preview">
                      <button className="remove-media" onClick={removeMedia}>
                        <FaTimes />
                      </button>
                      {selectedMedia.type === 'image' ? (
                        <img src={selectedMedia.url} alt="Preview" />
                      ) : (
                        <video src={selectedMedia.url} controls />
                      )}
                    </div>
                  )}

                  {/* Media Upload Buttons */}
                  <div className="media-upload-buttons">
                    <button 
                      className="media-btn"
                      onClick={() => {
                        console.log('Photo button clicked, fileInputRef:', fileInputRef.current);
                        fileInputRef.current?.click();
                      }}
                      title="Upload Image"
                    >
                      <FaImage />
                      <span>Photo</span>
                    </button>
                    <button 
                      className="media-btn"
                      onClick={() => videoInputRef.current?.click()}
                      title="Upload Video"
                    >
                      <FaVideo />
                      <span>Video</span>
                    </button>
                    <button 
                      className="media-btn"
                      onClick={() => setShowColorPicker(!showColorPicker)}
                      title="Background Color"
                    >
                      <FaPalette />
                      <span>Color</span>
                    </button>
                  </div>

                  {/* Hidden File Inputs */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    style={{ display: 'none' }}
                  />

              <div className="post-query-actions">
                <button 
                  className="btn-cancel" 
                  onClick={() => {
                    setShowPostForm(false);
                    setNewQuery('');
                        setSelectedMedia(null);
                        setSelectedBackground(null);
                  }}
                >
                  Cancel
                </button>
                <button 
                  className="btn-post" 
                  onClick={handlePostQuery}
                      disabled={(!newQuery.trim() && !selectedMedia) || posting}
                >
                      {posting ? 'Posting...' : 'Post Query'}
                </button>
              </div>
            </div>
          )}
      </div>
      </div>

      {/* Queries Feed */}
      <div className="queries-feed">
            {loading ? (
              <div className="loading-indicator">
                <div className="spinner"></div>
                <p>Loading posts...</p>
              </div>
            ) : queries.length === 0 ? (
              <div className="no-posts">
                <p>No posts yet. Be the first to share something!</p>
              </div>
            ) : (
              queries.map(query => (
          <div key={query.id} className="query-card">
            {/* Query Header */}
            <div className="query-header">
              <div className="query-author">
                <div className="author-avatar">
                  {query.author.avatar ? (
                    <img src={query.author.avatar} alt="Avatar" />
                  ) : (
                    <FaUser />
                  )}
                </div>
                <div className="author-info">
                  <div className="author-name-role">
                  <h4>{query.author.name}</h4>
                  <span className="author-role">{query.author.role}</span>
                  </div>
                  <span className="query-time">
                    <FaClock /> {formatTimeAgo(query.timestamp)}
                  </span>
                </div>
              </div>
              <div className="query-actions">
                <button className="action-btn">
                  <FaEllipsisH />
                </button>
              </div>
            </div>

            {/* Query Content */}
            <div className="query-content">
              {query.background && query.background !== 'transparent' && (
                <div 
                  className="query-background"
                  style={{ backgroundColor: query.background }}
                >
                  <p style={{ color: 'white' }}>{query.content}</p>
                </div>
              )}
              {(!query.background || query.background === 'transparent') && (
              <p>{query.content}</p>
              )}
              
              {/* Media Display */}
              {query.media && (
                <div className="query-media">
                  {query.media.type === 'image' ? (
                    <img src={query.media.url} alt="Post media" />
                  ) : (
                    <video src={query.media.url} controls />
                  )}
                </div>
              )}
            </div>

            {/* Query Stats */}
            <div className="query-stats">
              <div className="stats-left">
                <span className="likes-count">
                  <FaThumbsUp /> {query.likes} likes
                </span>
                <span className="comments-count">
                  <FaComment /> {query.comments.length} comments
                </span>
              </div>
            </div>

            {/* Query Actions */}
            <div className="query-actions-bar">
              <button 
                className={`action-btn ${query.liked ? 'liked' : ''}`}
                onClick={() => handleLike(query.id)}
              >
                <FaThumbsUp />
                <span>Like</span>
              </button>
              <button className="action-btn">
                <FaComment />
                <span>Comment</span>
              </button>
              <button className="action-btn">
                <FaShare />
                <span>Share</span>
              </button>
            </div>

            {/* Comments Section */}
            <div className="comments-section">
              {query.comments.map(comment => (
                <div key={comment.id} className="comment">
                  <div className="comment-avatar">
                    <FaUser />
                  </div>
                  <div className="comment-content">
                    <div className="comment-header">
                      <h5>{comment.author}</h5>
                      <span className="comment-time">
                        <FaClock /> {formatTimeAgo(comment.timestamp)}
                      </span>
                    </div>
                    <p>{comment.content}</p>
                    <div className="comment-actions">
                      <button 
                        className={`comment-action ${comment.liked ? 'liked' : ''}`}
                        onClick={() => handleCommentLike(query.id, comment.id)}
                      >
                        <FaHeart />
                        <span>{comment.likes}</span>
                      </button>
                      <button className="comment-action">
                        <FaReply />
                        <span>Reply</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Comment */}
              <div className="add-comment">
                <div className="comment-avatar">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Avatar" />
                  ) : (
                    <FaUser />
                  )}
                </div>
                <div className="comment-input-container">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        handleAddComment(query.id, e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))
            )}
          </div>
        </div>

        {/* Right Sidebar - Upcoming Events */}
        <div className="query-sidebar-right">
          <div className="events-card">
            <div className="events-header">
              <h3>Upcoming Events</h3>
              <span className="events-count">5 events</span>
            </div>
            
            <div className="events-list">
              <div className="event-item">
                <div className="event-date">
                  <span className="day">15</span>
                  <span className="month">Dec</span>
                </div>
                <div className="event-details">
                  <h4>Aptech Vision Competition 2024</h4>
                  <p className="event-description">Annual coding competition for students to showcase their programming skills and innovative projects.</p>
                  <div className="event-meta">
                    <span className="event-time">⏰ 2:00 PM - 6:00 PM</span>
                    <span className="event-location">📍 Aptech Main Campus</span>
                  </div>
                  <div className="event-participants">
                    <span className="participants-count">🎯 45 participants</span>
                    <span className="event-type">🏆 Competition</span>
                  </div>
                </div>
                <button className="event-apply-btn">Apply Now</button>
              </div>

              <div className="event-item">
                <div className="event-date">
                  <span className="day">22</span>
                  <span className="month">Dec</span>
                </div>
                <div className="event-details">
                  <h4>Tech Career Fair</h4>
                  <p className="event-description">Connect with top tech companies and explore career opportunities in software development.</p>
                  <div className="event-meta">
                    <span className="event-time">⏰ 10:00 AM - 4:00 PM</span>
                    <span className="event-location">📍 Convention Center</span>
                  </div>
                  <div className="event-participants">
                    <span className="participants-count">🎯 200+ attendees</span>
                    <span className="event-type">💼 Career</span>
                  </div>
                </div>
                <button className="event-apply-btn">Register</button>
              </div>

              <div className="event-item">
                <div className="event-date">
                  <span className="day">28</span>
                  <span className="month">Dec</span>
                </div>
                <div className="event-details">
                  <h4>Web Development Workshop</h4>
                  <p className="event-description">Hands-on workshop on modern web development technologies and best practices.</p>
                  <div className="event-meta">
                    <span className="event-time">⏰ 1:00 PM - 5:00 PM</span>
                    <span className="event-location">📍 Lab 3</span>
                  </div>
                  <div className="event-participants">
                    <span className="participants-count">🎯 30 students</span>
                    <span className="event-type">📚 Workshop</span>
                  </div>
                </div>
                <button className="event-apply-btn">Join</button>
              </div>

              <div className="event-item">
                <div className="event-date">
                  <span className="day">05</span>
                  <span className="month">Jan</span>
                </div>
                <div className="event-details">
                  <h4>AI & Machine Learning Seminar</h4>
                  <p className="event-description">Expert insights into the future of AI and practical applications in modern technology.</p>
                  <div className="event-meta">
                    <span className="event-time">⏰ 3:00 PM - 5:00 PM</span>
                    <span className="event-location">📍 Auditorium</span>
                  </div>
                  <div className="event-participants">
                    <span className="participants-count">🎯 100 seats</span>
                    <span className="event-type">🎓 Seminar</span>
                  </div>
                </div>
                <button className="event-apply-btn">Book Seat</button>
              </div>

              <div className="event-item">
                <div className="event-date">
                  <span className="day">12</span>
                  <span className="month">Jan</span>
                </div>
                <div className="event-details">
                  <h4>Hackathon 2024</h4>
                  <p className="event-description">24-hour coding challenge to build innovative solutions for real-world problems.</p>
                  <div className="event-meta">
                    <span className="event-time">⏰ 9:00 AM - 9:00 AM</span>
                    <span className="event-location">📍 Innovation Hub</span>
                  </div>
                  <div className="event-participants">
                    <span className="participants-count">🎯 20 teams</span>
                    <span className="event-type">⚡ Hackathon</span>
                  </div>
                </div>
                <button className="event-apply-btn">Form Team</button>
              </div>
            </div>

            <div className="events-footer">
              <button className="view-all-events-btn">View All Events</button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading queries...</p>
        </div>
      )}

      {/* Empty State */}
      {queries.length === 0 && !loading && (
        <div className="empty-state">
          <FaComment />
          <h3>No queries yet</h3>
          <p>Be the first to ask a question!</p>
        </div>
      )}
    </div>
  );
}

export default QueryPage; 