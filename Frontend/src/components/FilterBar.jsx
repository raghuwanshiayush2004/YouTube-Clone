import React, { useState } from "react";
import previcon from "../assets/Filltericons/previous.png";
import nexticon from "../assets/Filltericons/next.png";

// FilterBar component to display filter options with pagination
const FilterBar = ({ onFilterChange }) => {
  // Define available filters
  const filters = [
    "All",
    "Bike",
    "Dog",
    "Movie",
    "Water",
    "Forest",
    "Night",
    "Cars",
  ];

  // Number of filters to show per page
  const itemsPerPage = 8;

  // State to manage the starting index of the filters
  const [startIndex, setStartIndex] = useState(0);

  // Handle previous button click (pagination)
  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - itemsPerPage);
    }
  };

  // Handle next button click (pagination)
  const handleNext = () => {
    if (startIndex + itemsPerPage < filters.length) {
      setStartIndex(startIndex + itemsPerPage);
    }
  };

  // Handle click on a filter item, passing the selected filter to the parent component
  const handleFilterClick = (filter) => {
    onFilterChange(filter);
  };

  // Slice filters to show only the ones for the current page
  const visibleFilters = filters.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex items-center p-2 flex-wrap gap-2 sm:gap-4">
      {/* Previous button for pagination */}
      <button
        onClick={handlePrev}
        disabled={startIndex === 0} // Disable if on the first page
        className={`hidden sm:flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full shadow ${
          startIndex === 0
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
      >
        <img src={previcon} width={12} sm:width={16} alt="Previous" />
      </button>

      {/* Filter buttons that display the visible filters */}
      <div className="flex overflow-x-auto items-center gap-2 sm:gap-4 mx-2 sm:mx-4">
        {visibleFilters.map((filter, index) => (
          <button
            key={index}
            className="px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm bg-gray-200 rounded-md shadow hover:bg-gray-300 transition duration-200 whitespace-nowrap"
            onClick={() => handleFilterClick(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Next button for pagination */}
      <button
        onClick={handleNext}
        disabled={startIndex + itemsPerPage >= filters.length} // Disable if on the last page
        className={`hidden sm:flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full shadow ${
          startIndex + itemsPerPage >= filters.length
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
      >
        <img src={nexticon} width={12} sm:width={16} alt="Next" />
      </button>
    </div>
  );
};

export default FilterBar;
