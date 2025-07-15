function JobList({ jobs, onSelect }) {
  return (
    <div className="job-list">
      {jobs.map((job, index) => (
        <div className="job-card" key={index} onClick={() => onSelect(job)}>
          <h4>{job.title}</h4>
          <p>{job.company}</p>
          <p>{job.location}</p>
          <span className="badge">{job.type}</span>
        </div>
      ))}
    </div>
  );
}

export default JobList;
