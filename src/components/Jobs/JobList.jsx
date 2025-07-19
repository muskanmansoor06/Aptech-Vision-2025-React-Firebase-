function JobList({ jobs, onSelect, selectedJob }) {
  if (!jobs.length) {
    return <div className="no-jobs">No jobs found.</div>;
  }
  return (
    <div className="job-list">
      {jobs.map((job, index) => (
        <div
          className={`job-card${selectedJob && selectedJob.id === job.id ? ' active' : ''}`}
          key={job.id || index}
          onClick={() => onSelect(job)}
        >
          <div className="job-card-header">
            <h4>{job.title}</h4>
            <span className="badge">{job.type}</span>
          </div>
          <p className="job-company">{job.company}</p>
          <p className="job-location">{job.location}</p>
        </div>
      ))}
    </div>
  );
}

export default JobList;
