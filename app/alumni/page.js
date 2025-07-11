"use client";

import { FINAL_CLUB_OPTIONS, HOUSE_OPTIONS } from "@/lib/constants";
import {
  loadAlumniRoster,
  mergeStaticRosterWithSupabaseProfiles,
} from "@/lib/dataUtils";
import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import AlumniSearchAndFilters from "../components/ui/alumni/AlumniSearchAndFilters";
import AlumniGrid from "../components/ui/alumni/AlumniGrid";
import AlumniModal from "../components/ui/alumni/AlumniModal";

export default function AlumniPage() {
  const [allAlumni, setAllAlumni] = useState([]);
  const [filteredAlumni, setFilteredAlumni] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    house: "",
    finalClub: "",
    graduationYear: "",
  });
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load alumni data on render
  useEffect(() => {
    async function loadAlumniData() {
      try {
        setLoading(true);
        setError(null);

        // Get alumni by filtering out current players from all available rosters
        const alumniRosterData = await loadAlumniRoster();

        // Merge with Supabase profiles to get data for users
        const mergedAlumni = await mergeStaticRosterWithSupabaseProfiles(
          alumniRosterData
        );

        // Filter to only include alumni (exclude current players)
        const alumniOnly = mergedAlumni.filter((person) => {
          if (person.isProfileCreated && person.role) {
            return person.role === "alumni";
          }
          return person.isAlumni;
        });

        setAllAlumni(alumniOnly);
        setFilteredAlumni(alumniOnly);
      } catch (error) {
        console.error("Error loading alumni data:", error);
        setError("Failed to load alumni data");
      } finally {
        setLoading(false);
      }
    }

    loadAlumniData();
  }, []);

  useEffect(() => {
    let results = [...allAlumni];

    if (searchTerm.trim()) {
      results = searchAlumni(results, searchTerm);
    }

    results = filterAlumni(results, filters);

    setFilteredAlumni(results);
  }, [allAlumni, searchTerm, filters]);

  // Search function
  function searchAlumni(alumni, searchTerm) {
    return alumni.filter((person) => {
      const searchFields = [
        person.name || "",
        person.concentration || "",
        person.hometown || "",
        person.currentJob || "",
        person.currentLocation || "",
        person.currentCompany || "",
      ]
        .join(" ")
        .toLowerCase();

      return searchFields.includes(searchTerm.toLowerCase());
    });
  }

  // Filter function
  function filterAlumni(alumni, filters) {
    return alumni.filter((person) => {
      return (
        (!filters.house || person.house === filters.house) &&
        (!filters.finalClub || person.finalClub === filters.finalClub) &&
        (!filters.graduationYear ||
          person.graduationYear?.toString() === filters.graduationYear)
      );
    });
  }

  function getFilterOptions() {
    const houses = HOUSE_OPTIONS.filter((option) => option.value !== "")
      .map((option) => option.value)
      .sort();

    const finalClubs = FINAL_CLUB_OPTIONS.filter(
      (option) => option.value !== ""
    )
      .map((option) => option.value)
      .sort();

    const currentYear = new Date().getFullYear();
    const graduationYears = [];
    for (let year = currentYear; year >= 2017; year--) {
      graduationYears.push(year.toString());
    }

    return { houses, finalClubs, graduationYears };
  }

  const { houses, finalClubs, graduationYears } = getFilterOptions();

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A51C30] mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading alumni directory...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 bg-[#A51C30] text-white px-4 py-2 rounded-md hover:bg-[#8B1628]"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Alumni Directory
            </h1>
            <p className="text-gray-600">
              Connect with fellow Harvard Men&apos;s Club Soccer alumni
            </p>

            {/* Search and Filters */}
            <AlumniSearchAndFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filters={filters}
              setFilters={setFilters}
              houses={houses}
              finalClubs={finalClubs}
              graduationYears={graduationYears}
            />

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                Showing {filteredAlumni.length} of {allAlumni.length}
              </p>
            </div>

            {/* Alumni Grid */}
            {filteredAlumni.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No results found</p>
                <p className="text-gray-500 text-sm mt-2">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <AlumniGrid
                alumni={filteredAlumni}
                onAlumniClick={setSelectedAlumni}
              />
            )}
          </div>
        </div>

        {/* Alumni Modal */}
        {selectedAlumni && (
          <AlumniModal
            alumni={selectedAlumni}
            onClose={() => setSelectedAlumni(null)}
          />
        )}
      </div>
    </>
  );
}
