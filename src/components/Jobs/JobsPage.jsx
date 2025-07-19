import React, { useState } from 'react';
import { FaSearch, FaPlus } from 'react-icons/fa';
import SearchBar from './SearchBar';
// import FiltersBar from './FiltersBar';
import JobList from './JobList';
import JobDetails from './JobDetail';
import JobPostModal from './JobPostModal';
import '../../assets/styles/Jobs.css';
import { jobsData } from './jobsData';

// Reusable SectionHeader component
function SectionHeader({ title, description, onPostJob, children }) {
  return (
    <section className="section-header-bg">
      <div className="section-header-content">
        <h2 className="typing-heading">{title}</h2>
        <p className="section-header-desc">{description}</p>
        <div className="section-header-row">
          <form className="search-input" onSubmit={e => e.preventDefault()}>
            <FaSearch className="search-icon" />
            <input type="text" placeholder="reactjs developer" onChange={e => children.props.onSearch(e.target.value)} />
            <button type="submit" style={{ display: 'none' }}>Search</button>
          </form>
          <button className="beautiful-post-job-btn" onClick={onPostJob}>
            <FaPlus style={{ marginRight: 8, fontSize: 16 }} /> Post a Job
          </button>
        </div>
      </div>
    </section>
  );
}

function JobsPage() {
  const [jobs, setJobs] = useState(jobsData);
  const [filteredJobs, setFilteredJobs] = useState(jobsData);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  // Add new job to the top
  const handleAddJob = (job) => {
    const newJob = {
      ...job,
      id: Date.now(),
      company: job.firstName + ' ' + job.lastName,
      location: job.city,
      type: job.jobType,
      description: job.description,
      // Add more fields if needed
    };
    const updatedJobs = [newJob, ...jobs];
    setJobs(updatedJobs);
    setFilteredJobs(updatedJobs);
    setCurrentPage(1);
  };

  const handleSearch = (query) => {
    const results = jobs.filter(job =>
      job.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredJobs(results);
    setCurrentPage(1);
  };

  // Pagination logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <SectionHeader
        title="Find Your Dream Job"
        description="Browse the latest job opportunities and find the perfect match for your skills and ambitions. Use the search below to get started!"
        onPostJob={() => setShowModal(true)}
      >
        <SearchBar onSearch={handleSearch} />
      </SectionHeader>
      <section className="jobs-page">
        {/* FiltersBar removed */}
        <div className="jobs-content">
          <div style={{flex: 1}}>
            <JobList jobs={currentJobs} onSelect={setSelectedJob} selectedJob={selectedJob} />
            {/* Pagination Controls */}
            <div className="pagination">
              <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>&laquo;</button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={currentPage === i + 1 ? 'active' : ''}
                  onClick={() => paginate(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>&raquo;</button>
            </div>
          </div>
          <JobDetails job={selectedJob} />
        </div>
        {showModal && <JobPostModal onClose={() => setShowModal(false)} onSubmit={handleAddJob} />}
      </section>
    </>
  );
}

export default JobsPage;
