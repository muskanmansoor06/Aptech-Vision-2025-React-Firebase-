import React, { useState } from 'react';
import '../../assets/styles/JobPostModal.css';

function JobPostModal({ onClose, onSubmit }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    title: '',
    description: '',
    city: '',
    locationType: '',
    experience: '',
    jobType: '',
    salary: '',
    note: '',
    phone: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateStep = () => {
    let err = {};
    if (step === 1) {
      if (!formData.firstName) err.firstName = 'First name is required';
      if (!formData.lastName) err.lastName = 'Last name is required';
    } else if (step === 2) {
      if (!formData.title) err.title = 'Job title is required';
      if (!formData.description) err.description = 'Description is required';
    } else if (step === 3) {
      if (!formData.city) err.city = 'City is required';
      if (!formData.locationType) err.locationType = 'Choose location type';
      if (!formData.experience) err.experience = 'Experience is required';
    } else if (step === 4) {
      if (!formData.jobType) err.jobType = 'Job type is required';
      if (!formData.salary) err.salary = 'Salary is required';
      if (!formData.phone) err.phone = 'Phone is required';
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const next = () => {
    if (validateStep()) setStep(step + 1);
  };

  const prev = () => setStep(step - 1);

  const submit = () => {
    if (validateStep()) {
      if (onSubmit) onSubmit(formData);
      onClose();
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-box modern-modal">
        <button className="modal-close-btn" onClick={onClose} title="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7A6AD8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <h2>Post a Job</h2>

        {step === 1 && (
          <>
            <input
              type="text"
              placeholder="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
            {errors.firstName && <span className="error">{errors.firstName}</span>}

            <input
              type="text"
              placeholder="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
            {errors.lastName && <span className="error">{errors.lastName}</span>}
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Job Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
            {errors.title && <span className="error">{errors.title}</span>}

            <textarea
              placeholder="Job Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
            {errors.description && <span className="error">{errors.description}</span>}
          </>
        )}

        {step === 3 && (
          <>
            <input
              type="text"
              placeholder="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
            {errors.city && <span className="error">{errors.city}</span>}

            <select name="locationType" value={formData.locationType} onChange={handleChange}>
              <option value="">Select Location Type</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>
            {errors.locationType && <span className="error">{errors.locationType}</span>}

            <select name="experience" value={formData.experience} onChange={handleChange}>
              <option value="">Select Experience</option>
              <option value="Fresher">Fresher</option>
              <option value="1-3 Years">1-3 Years</option>
              <option value="3+ Years">3+ Years</option>
            </select>
            {errors.experience && <span className="error">{errors.experience}</span>}
          </>
        )}

        {step === 4 && (
          <>
            <select name="jobType" value={formData.jobType} onChange={handleChange}>
              <option value="">Select Job Type</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Flexible">Flexible</option>
            </select>
            {errors.jobType && <span className="error">{errors.jobType}</span>}

            <input
              type="text"
              placeholder="Salary"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
            />
            {errors.salary && <span className="error">{errors.salary}</span>}

            <input
              type="text"
              placeholder="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && <span className="error">{errors.phone}</span>}

            <textarea
              placeholder="Special Note (optional)"
              name="note"
              value={formData.note}
              onChange={handleChange}
            />
          </>
        )}

        <div className="modal-actions">
          {step > 1 && <button className="modal-nav-btn" onClick={prev}>Back</button>}
          {step < 4 ? (
            <button className="modal-nav-btn modal-next-btn" onClick={next}>Next</button>
          ) : (
            <button className="modal-submit-btn" onClick={submit}>Submit</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobPostModal;
