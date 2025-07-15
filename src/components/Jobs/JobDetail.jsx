import BookmarkButton from './BookmarkButton';

function JobDetails({ job }) {
  if (!job) {
    return <div className="job-details placeholder">Select a job to view details</div>;
  }

  return (
    <div className="job-details">
      <div className="job-header">
        <h3>{job.title}</h3>
        <p>{job.company}</p>
        <p>{job.location}</p>
      </div>
      <div className="job-actions">
        <button className="btn-primary">Apply now</button>
        <BookmarkButton />
        <button title="Not interested">🚫</button>
        <button title="Copy link">🔗</button>
      </div>
      <hr />
      <div className="job-body">
        <h4>Job details</h4>
        <p>{job.description}</p>
      </div>
    </div>
  );
}

export default JobDetails;
