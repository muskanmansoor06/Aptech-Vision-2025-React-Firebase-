import BookmarkButton from './BookmarkButton';
import { MdOutlineBlock } from 'react-icons/md';
import { FaRegCopy } from 'react-icons/fa';
import { useState } from 'react';
import ApplyModal from './ApplyModal';

function JobDetails({ job }) {
  const [copied, setCopied] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [showApply, setShowApply] = useState(false);

  if (!job) {
    return <div className="job-details placeholder">Select a job to view details</div>;
  }
  if (hidden) {
    return <div className="job-details placeholder">You marked this job as not interested.</div>;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href + `#job-${job.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="job-details modern-job-details">
      <div className="job-header">
        <div className="job-title-block">
          <h3>{job.title}</h3>
          <span className="badge">{job.type}</span>
        </div>
        <div className="job-meta">
          <span className="job-company">{job.company}</span>
          <span className="job-location">{job.location}</span>
        </div>
      </div>
      <div className="job-actions modern-actions">
        <button className="btn-primary apply-btn" onClick={() => setShowApply(true)}>Apply now</button>
        <BookmarkButton />
        <button title="Not interested" className="icon-btn not-interested" onClick={() => setHidden(true)}><MdOutlineBlock /></button>
        <button title="Copy link" className="icon-btn copy-link" onClick={handleCopy}><FaRegCopy /></button>
        {copied && <span className="copy-feedback">Link copied!</span>}
      </div>
      <hr />
      <div className="job-body modern-job-body">
        <h4>Job details</h4>
        <p>{job.description}</p>
        {job.salary && <div className="job-salary">💸 <b>Salary:</b> {job.salary}</div>}
        {job.experience && <div className="job-experience">🎓 <b>Experience:</b> {job.experience}</div>}
        {job.locationType && <div className="job-locationtype">📍 <b>Location Type:</b> {job.locationType}</div>}
        {job.phone && <div className="job-phone">📞 <b>Contact:</b> {job.phone}</div>}
        {job.note && <div className="job-note">📝 <b>Note:</b> {job.note}</div>}
      </div>
      {showApply && <ApplyModal job={job} onClose={() => setShowApply(false)} />}
    </div>
  );
}

export default JobDetails;
