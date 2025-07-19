import React, { useState } from 'react';
import '../../assets/styles/JobPostModal.css';

function getFileIcon(file) {
  if (!file) return null;
  const ext = file.name.split('.').pop().toLowerCase();
  if (ext === 'pdf') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="#e53e3e" style={{marginRight: 4}}><path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.828A2 2 0 0 0 19.414 7.414l-4.828-4.828A2 2 0 0 0 12.172 2H6zm6 1.414L18.586 10H14a2 2 0 0 1-2-2V3.414z"></path><text x="7" y="17" fontSize="7" fill="#e53e3e" fontWeight="bold">PDF</text></svg>
    );
  }
  if (ext === 'doc' || ext === 'docx') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="#2563eb" style={{marginRight: 4}}><path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.828A2 2 0 0 0 19.414 7.414l-4.828-4.828A2 2 0 0 0 12.172 2H6zm6 1.414L18.586 10H14a2 2 0 0 1-2-2V3.414z"></path><text x="7" y="17" fontSize="7" fill="#2563eb" fontWeight="bold">DOC</text></svg>
    );
  }
  return null;
}

function ApplyModal({ job, onClose }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    cv: null,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'cv') {
      setForm((prev) => ({ ...prev, cv: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    // Simulate upload
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1200);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-box modern-modal" style={{ minWidth: 320, maxWidth: 420, animation: 'fadeSlideIn 0.35s cubic-bezier(.4,1.4,.6,1) both' }}>
        <button className="modal-close-btn" onClick={onClose} title="Close">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7A6AD8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 14, color: '#7A6AD8', fontWeight: 600, letterSpacing: 1 }}>Applying for</div>
          <div className="apply-job-title" style={{ fontSize: 20, fontWeight: 700, color: '#1e1e1e', marginTop: 2, marginBottom: 0, wordBreak: 'break-word' }}>{job?.title}</div>
        </div>
        {success ? (
          <div className="apply-success-box">
            <div className="apply-success-check">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="11" stroke="#22c55e" strokeWidth="2.5" fill="#e7fbe9"/><polyline points="7 13.5 11 17 17 9.5" /></svg>
            </div>
            <div className="apply-success-title">Application Submitted!</div>
            <div className="apply-success-desc">Thank you for applying. We have received your application and will contact you if you are shortlisted.</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              required
            />
            <label style={{ fontWeight: 500, color: '#7A6AD8', marginBottom: 2 }}>Upload CV (PDF/DOC)</label>
            <input
              type="file"
              name="cv"
              accept=".pdf,.doc,.docx"
              onChange={handleChange}
              required
              style={{ background: '#fff', border: 'none', padding: 0 }}
            />
            {form.cv && (
              <div className="cv-file-box">{getFileIcon(form.cv)}{form.cv.name}</div>
            )}
            <textarea
              name="message"
              placeholder="Message (optional)"
              value={form.message}
              onChange={handleChange}
              rows={3}
              style={{ resize: 'vertical' }}
            />
            {error && <div className="auth-error">{error}</div>}
            <button className="modal-submit-btn" type="submit" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ApplyModal; 