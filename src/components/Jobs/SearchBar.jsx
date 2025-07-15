function SearchBar({ onSearch }) {
  return (
    <div className="search-bar-box glass">
      <input type="text" placeholder="reactjs developer" onChange={(e) => onSearch(e.target.value)} />
      <button>Find jobs</button>
    </div>
  );
}

export default SearchBar;
