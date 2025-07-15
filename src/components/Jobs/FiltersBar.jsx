function FiltersBar() {
  const filters = ['Within 25 miles', 'Company', 'Job Type', 'Job Language', 'Location', 'Date posted'];

  return (
    <div className="filters-bar">
      {filters.map((filter, i) => (
        <button key={i} className="filter-chip">{filter}</button>
      ))}
    </div>
  );
}

export default FiltersBar;
