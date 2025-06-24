"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import {
  loadSeasons,
  loadRoster,
  loadSchedule,
  loadStandings,
  calculateRecentForm,
  calculateTeamRecord,
  getFormColor,
} from "@/lib/dataUtils";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

export default function TeamPage() {
  const [selectedCompetition, setSelectedCompetition] = useState("nirsa");
  const [selectedYear, setSelectedYear] = useState("2024");

  const [seasonsData, setSeasonsData] = useState({
    competitions: [],
    years: [],
  });
  
  const [standingsData, setStandingsData] = useState({ teams: [] });
  const [scheduleData, setScheduleData] = useState({ games: [] });
  const [rosterData, setRosterData] = useState([]);

  const [recentForm, setRecentForm] = useState([]);
  const [teamRecord, setTeamRecord] = useState({ wins: 0, losses: 0, ties: 0 });

  const [loading, setLoading] = useState(true);
  const [seasonDataLoading, setSeasonDataLoading] = useState(false);

  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const seasons = await loadSeasons();
        setSeasonsData(seasons);

        const defaultCompetition = seasons.competitions.find(
          (competition) => competition.isActive
        ).id;
        const defaultYear = seasons.years.find((year) => year.isActive).year;

        setSelectedCompetition(defaultCompetition);
        setSelectedYear(defaultYear);

        await loadSeasonData(defaultCompetition, defaultYear);
      } catch (error) {
        console.error("Error loading initial data: ", error);
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedCompetition && selectedYear && !loading) {
      loadSeasonData(selectedCompetition, selectedYear);
    }
  }, [selectedCompetition, selectedYear, loading]);

  async function loadSeasonData(competition, year) {
    setSeasonDataLoading(true);
    try {
      const [standings, schedule, roster] = await Promise.all([
        loadStandings(competition, year),
        loadSchedule(competition, year),
        loadRoster(year),
      ]);

      console.log("roster", roster);

      setStandingsData(standings);
      setScheduleData(schedule);

      const mergedRoster = await mergeRosterWithProfiles(roster.players || []);
      setRosterData(mergedRoster);

      const form = calculateRecentForm(schedule.games);
      const record = calculateTeamRecord(schedule.games);

      setRecentForm(form);
      setTeamRecord(record);
    } catch (error) {
      console.error("Error loading season data: ", error);
      setError(
        `Failed to load data for ${selectedCompetition} ${selectedYear}`
      );
    } finally {
      setSeasonDataLoading(false);
    }
  }

  async function mergeRosterWithProfiles(staticPlayers) {
    try {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*");

      if (error) {
        console.error("Error fetching profiles:", error);
        return staticPlayers.map((player) => ({
          ...player,
          isEnhanced: false,
        }));
      }

      const profileMap = new Map();
      profiles.forEach((profile) => {
        const fullName = `${profile.full_name}`.toLowerCase();
        console.log(fullName);

        const matchingId = fullName
          .replace(/\s+/g, "_")
          .replace(/[^a-z0-9_]/g, "");
        profileMap.set(matchingId, profile);
      });

      console.log("profileMap", profileMap);

      return staticPlayers.map((staticPlayer) => {
        const enhancedProfile = profileMap.get(staticPlayer.id);

        if (enhancedProfile) {
          return {
            id: staticPlayer.id,
            name: `${enhancedProfile.first_name} ${enhancedProfile.last_name}`,
            graduationYear: enhancedProfile.graduation_year,
            position: enhancedProfile.position,
            profileImage:
              enhancedProfile.profile_image_url || "/images/profilepic.svg",
            bio: enhancedProfile.bio,
            isEnhanced: true,
            supabaseProfile: enhancedProfile,
          };
        } else {
          return {
            ...staticPlayer,
            profileImage: "/images/profilepic.svg",
            isEnhanced: false,
          };
        }
      });
    } catch (error) {
      console.error("Error merging roster with profiles:", error);
      return staticPlayers.map((player) => ({ ...player, isEnhanced: false }));
    }
  }

  const handleCompetitionChange = (event) => {
    setSelectedCompetition(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A51C30] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header Section */}
          <div className="flex justify-between items-start mb-8">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Harvard University - Crimson
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                Record: {teamRecord.wins}-{teamRecord.losses}-{teamRecord.ties}
              </p>

              {/* Recent Form */}
              {recentForm.length > 0 && (
                <div className="flex items-center mb-4">
                  <span className="text-sm font-medium text-gray-700 mr-3">
                    Recent Form:
                  </span>
                  <div className="flex space-x-1">
                    {recentForm.map((result, index) => (
                      <div
                        key={index}
                        className={`w-6 h-6 rounded-full ${getFormColor(
                          result
                        )} flex items-center justify-center text-white text-xs font-bold`}
                      >
                        {result}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dual Dropdowns */}
              <div className="flex space-x-4">
                {/* Competition Dropdown */}
                <div>
                  <select
                    value={selectedCompetition}
                    onChange={handleCompetitionChange}
                    disabled={seasonDataLoading}
                    className="bg-[#A51C30] text-white px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#A51C30] focus:ring-offset-2 disabled:opacity-50"
                  >
                    {seasonsData.competitions?.map((competition) => (
                      <option key={competition.id} value={competition.id}>
                        {competition.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Year Dropdown */}
                <div>
                  <select
                    value={selectedYear}
                    onChange={handleYearChange}
                    disabled={seasonDataLoading}
                    className="bg-white text-gray-900 border border-gray-300 px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#A51C30] focus:border-[#A51C30] disabled:opacity-50"
                  >
                    {seasonsData.years?.map((year) => (
                      <option key={year.year} value={year.year}>
                        {year.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Team Photo */}
            <div className="ml-8">
              <div className="w-48 h-32 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-gray-300">
                <span className="text-gray-500 text-sm">Team Photo</span>
              </div>
            </div>
          </div>

          {/* Loading indicator for data changes */}
          {seasonDataLoading && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                <span className="text-blue-700 text-sm">
                  Loading {selectedCompetition} {selectedYear} data...
                </span>
              </div>
            </div>
          )}

          {/* Main Content - Vertical Scrollable Layout */}
          <div className="space-y-12">
            {/* Roster Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {selectedYear} Roster
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {rosterData.length > 0 ? (
                  rosterData.map((player) => (
                    <div
                      key={player.id}
                      className={`bg-white rounded-lg shadow p-4 ${
                        player.isEnhanced ? "ring-2 ring-[#A51C30]/20" : ""
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden relative">
                          <Image
                            src={player.profileImage}
                            alt={player.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                          {player.isEnhanced && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#A51C30] rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {player.name}
                          </h3>
                          {player.isEnhanced ? (
                            <>
                              <p className="text-sm text-gray-600">
                                Class of {player.graduationYear}
                              </p>
                              <p className="text-sm text-[#A51C30]">
                                {player.position}
                              </p>
                            </>
                          ) : null}
                        </div>
                      </div>
                      {player.isEnhanced && player.bio && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {player.bio}
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    No roster data available for {selectedYear}
                  </div>
                )}
              </div>
            </div>

            {/* Standings Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Standings
              </h2>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Team
                        </th>
                        <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          W
                        </th>
                        <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          L
                        </th>
                        <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          T
                        </th>
                        <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          GF
                        </th>
                        <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          GA
                        </th>
                        <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          GD
                        </th>
                        <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Pts
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {standingsData.teams?.map((team, index) => (
                        <tr
                          key={team.id || index}
                          className={
                            team.name === "Harvard University - Crimson" ||
                            team.name === "Harvard - Crimson" ||
                            team.name === "Harvard University - A"
                              ? "bg-[#A51C30]/5"
                              : ""
                          }
                        >
                          <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                            {team.name}
                          </td>
                          <td className="px-3 py-3 text-sm text-gray-500 text-center">
                            {team.wins}
                          </td>
                          <td className="px-3 py-3 text-sm text-gray-500 text-center">
                            {team.losses}
                          </td>
                          <td className="px-3 py-3 text-sm text-gray-500 text-center">
                            {team.ties}
                          </td>
                          <td className="px-3 py-3 text-sm text-gray-500 text-center">
                            {team.goalsFor}
                          </td>
                          <td className="px-3 py-3 text-sm text-gray-500 text-center">
                            {team.goalsAgainst}
                          </td>
                          <td className="px-3 py-3 text-sm text-gray-500 text-center">
                            {team.goalDifference}
                          </td>
                          <td className="px-3 py-3 text-sm text-gray-500 text-center font-semibold">
                            {team.points}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Schedule Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Schedule
              </h2>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {scheduleData.games?.map((game, index) => {
                    const isHomeGame =
                      game.homeTeam === "Harvard University - Crimson" ||
                      game.homeTeam === "Harvard - Crimson" ||
                      game.homeTeam === "Harvard University - A";
                    const isCompleted = game.score !== null;

                    // Format the matchup display
                    const matchupDisplay = isHomeGame
                      ? `${game.homeTeam} vs. ${game.awayTeam}`
                      : `${game.awayTeam} @ ${game.homeTeam}`;

                    // Format the date
                    const gameDate = new Date(game.date).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }
                    );

                    // Get result styling
                    const getResultStyling = (result) => {
                      if (!result) return "bg-blue-100 text-blue-800";
                      switch (result) {
                        case "WIN":
                          return "bg-green-100 text-green-800";
                        case "LOSS":
                          return "bg-red-100 text-red-800";
                        case "TIE":
                          return "bg-yellow-100 text-yellow-800";
                        default:
                          return "bg-gray-100 text-gray-800";
                      }
                    };

                    return (
                      <div
                        key={game.id || index}
                        className="p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4">
                              {/* Game Info */}
                              <div className="flex-1">
                                <div className="text-sm font-medium text-gray-900 mb-1">
                                  {matchupDisplay}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {gameDate} • {game.time}
                                </div>
                              </div>

                              {/* Score */}
                              <div className="text-center min-w-[80px]">
                                {isCompleted ? (
                                  <div className="text-lg font-bold text-[#A51C30]">
                                    {isHomeGame
                                      ? `${game.score.home} - ${game.score.away}`
                                      : `${game.score.away} - ${game.score.home}`}
                                  </div>
                                ) : (
                                  <div className="text-sm text-gray-500 font-medium">
                                    {game.time}
                                  </div>
                                )}
                              </div>

                              {/* Result */}
                              <div className="min-w-[80px] text-right">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getResultStyling(
                                    game.result
                                  )}`}
                                >
                                  {game.result || "UPCOMING"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
