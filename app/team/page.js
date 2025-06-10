"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "../components/layout/Navbar";
import {
  calculateRecentForm,
  calculateTeamRecord,
  loadRoster,
  loadSchedule,
  loadSeasons,
  loadStandings,
} from "@/lib/dataUtils";

export default function TeamPage() {
  const [selectedSeason, setSelectedSeason] = useState("2024");
  const [seasons, setSeasons] = useState([]);
  const [roster, setRoster] = useState([]);
  const [standings, setStandings] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);
        const seasonsData = await loadSeasons();
        setSeasons(seasonsData.seasons);

        const currentSeason = seasonsData.seasons.find(
          (season) => season.isActive
        )?.year;
        setSelectedSeason(currentSeason);
      } catch (error) {
        setError("Failed to load initial data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, []);

  useEffect(() => {
    async function loadSeasonData() {
      if (!selectedSeason) return;

      try {
        setLoading(true);
        const [standingsData, scheduleData, rosterData] = await Promise.all([
          loadStandings(selectedSeason),
          loadSchedule(selectedSeason),
          loadRoster(selectedSeason),
        ]);

        setStandings(standingsData.teams);
        setSchedule(scheduleData.games);
        setRoster(rosterData);
      } catch (error) {
        setError(`Failed to load data for ${selectedSeason}`);
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadSeasonData();
  }, [selectedSeason]);

  const teamRecord = calculateTeamRecord(schedule);
  const recentForm = calculateRecentForm(schedule);

  function getFormColor(result) {
    switch (result) {
      case "W":
        return "bg-green-500";
      case "L":
        return "bg-red-500";
      case "D":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  }

  if (loading && !seasons.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A51C30] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading team data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#A51C30] text-white px-4 py-2 rounded-md hover:bg-[#8A1726]"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Main Content */}
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

            {/* Season */}
            <div className="inline-block">
              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value)}
                className="bg-[#A51C30] text-white px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#A51C30] focus:ring-offset-2"
                disabled={loading}
              >
                {seasons.map((season) => (
                  <option key={season.year} value={season.year}>
                    {season.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Team Photo */}
          <div className="ml-8">
            <div className="w-48 h-32 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-gray-300">
              <span className="text-gray-500 text-sm">Team Photo</span>
            </div>
          </div>
        </div>

        {/* Loading Overlay for Season Changes */}
        {loading && seasons.length > 0 && (
          <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-10">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A51C30] mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">
                Loading {selectedSeason} data...
              </p>
            </div>
          </div>
        )}

        <div className="space-y-12">
          {/* Roster */}
          {/* <h2 className="text-xl font-semibold text-gray-900 mb-4">Roster</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {placeholderRoster.map((player) => (
              <div key={player.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                    <Image
                      src={player.profileImage}
                      alt={player.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{player.name}</h3>
                    <p className="text-sm text-gray-600">
                      Class of {player.graduationYear}
                    </p>
                    <p className="text-sm text-[#A51C30]">{player.position}</p>
                  </div>
                </div>
              </div>
            ))}
          </div> */}

          {/* Standings */}
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
                    {standings.map((team, index) => (
                      <tr
                        key={index}
                        className={
                          team.team.includes("Harvard") ? "bg-[#A51C30]/5" : ""
                        }
                      >
                        <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                          {team.team}
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
                {schedule.map((game, index) => {
                  const isHomeGame = game.homeTeam.includes("Harvard");

                  const matchupDisplay = isHomeGame
                    ? `${game.homeTeam} vs. ${game.awayTeam}`
                    : `${game.awayTeam} @ ${game.homeTeam}`;

                  const gameDate = new Date(game.date).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }
                  );

                  const getResultStyle = (result) => {
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
                      key={index}
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

                            {/* Score or Status */}
                            <div className="text-center min-w-[80px]">
                              <div className="text-lg font-bold text-[#A51C30]">
                                {isHomeGame
                                  ? `${game.score.home} - ${game.score.away}`
                                  : `${game.score.away} - ${game.score.home}`}
                              </div>
                            </div>

                            {/* Result Badge */}
                            <div className="min-w-[80px] text-right">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getResultStyle(
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
  );
}
