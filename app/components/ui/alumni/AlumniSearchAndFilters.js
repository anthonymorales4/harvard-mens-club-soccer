"use client";

import { Search } from "lucide-react";

export default function AlumniSearchAndFilters({
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
  houses,
  finalClubs,
  graduationYears,
}) {
  function clearFilters() {
    setFilters({
      house: "",
      final_club: "",
      graduation_year: "",
    });
    setSearchTerm("");
  }

  const hasActiveFilters =
    Object.values(filters).some((value) => value !== "") || searchTerm !== "";

  return (
    <div className="mb-8">
      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by name, concentration, hometown, job title, location, or company..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-900 rounded-lg focus:ring-2 focus:ring-[#A51C30] focus:border-[#A51C30] text-sm"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* House */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              House
            </label>
            <select
              value={filters.house}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, house: event.target.value }))
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#A51C30] focus:border-[#A51C30]"
            >
              <option value="">All Houses</option>
              {houses.map((house) => (
                <option key={house} value={house}>
                  {house}
                </option>
              ))}
            </select>
          </div>

          {/* Final Club */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Final Club
            </label>
            <select
              value={filters.final_club}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  final_club: event.target.value,
                }))
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#A51C30] focus:border-[#A51C30]"
            >
              <option value="">All Final Clubs</option>
              {finalClubs.map((final_club) => (
                <option key={final_club} value={final_club}>
                  {final_club}
                </option>
              ))}
            </select>
          </div>

          {/* Graduation Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Graduation Year
            </label>
            <select
              value={filters.graduation_year}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  graduation_year: event.target.value,
                }))
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#A51C30] focus:border-[#A51C30]"
            >
              <option value="">All Graduation Years</option>
              {graduationYears.map((year) => (
                <option key={year} value={year.toString()}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mt-4 text-center">
            <button
              onClick={clearFilters}
              className="text-sm text-[#A51C30] hover:text-[#8B1628] font-medium"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
