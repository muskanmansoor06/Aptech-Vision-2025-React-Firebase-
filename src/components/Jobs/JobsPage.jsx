import React, { useState } from 'react';
import SearchBar from './SearchBar';
import FiltersBar from './FiltersBar';
import JobList from './JobList';
import JobDetails from './JobDetail';
import JobPostModal from './JobPostModal'; // 👈 New component
import '../../assets/styles/Jobs.css';
import { jobsData } from './jobsData';

function JobsPage() {
  const [filteredJobs, setFilteredJobs] = useState(jobsData);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleSearch = (query) => {
    const results = jobsData.filter(job =>
      job.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredJobs(results);
  };

  return (
    <section className="jobs-page">
     <div className="search-and-post">
  <SearchBar onSearch={handleSearch} />
  <button className="post-job-btn" onClick={() => setShowModal(true)}>
    Post a Job
  </button>
</div>
      <FiltersBar />

      <div className="jobs-content">
        <JobList jobs={filteredJobs} onSelect={setSelectedJob} />
        <JobDetails job={selectedJob} />
      </div>

      {showModal && <JobPostModal onClose={() => setShowModal(false)} />}
    </section>
  );
}

export default JobsPage;
