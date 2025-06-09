"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "../components/layout/Navbar";

export default function TeamPage() {
  const [selectedSeason, setSelectedSeason] = useState("2024");

  // Placeholder data for Phase 1
  const seasons = [
    { value: "2024", label: "Fall 2024" },
    { value: "2023", label: "Fall 2023" },
    { value: "2022", label: "Fall 2022" },
  ];

  const teamRecord = { wins: 5, losses: 4, ties: 1 };

  const recentForm = ["W", "L", "W", "L", "D"]; // Last 5 games

  const placeholderRoster = [
    {
      id: 1,
      name: "Anthony Morales",
      graduationYear: 2024,
      position: "Midfielder",
      profileImage: "/images/profilepic.svg",
    },
    {
      id: 2,
      name: "James Mitchell",
      graduationYear: 2026,
      position: "Forward",
      profileImage: "/images/profilepic.svg",
    },
    {
      id: 3,
      name: "David Rodriguez",
      graduationYear: 2025,
      position: "Defender",
      profileImage: "/images/profilepic.svg",
    },
    {
      id: 4,
      name: "Michael Chen",
      graduationYear: 2024,
      position: "Goalkeeper",
      profileImage: "/images/profilepic.svg",
    },
  ];

  const standingsData = [
    {
      team: "Harvard University - Crimson",
      wins: 5,
      losses: 4,
      ties: 1,
      goalsFor: 16,
      goalsAgainst: 17,
      goalDifference: -1,
      points: 16,
    },
    {
      team: "MIT Engineers",
      wins: 7,
      losses: 2,
      ties: 1,
      goalsFor: 22,
      goalsAgainst: 12,
      goalDifference: 10,
      points: 22,
    },
    {
      team: "Tufts Jumbos",
      wins: 6,
      losses: 3,
      ties: 1,
      goalsFor: 18,
      goalsAgainst: 15,
      goalDifference: 3,
      points: 19,
    },
  ];

  const scheduleData = {
    previousGame: {
      homeTeam: "Harvard University",
      awayTeam: "Brown University",
      homeScore: 2,
      awayScore: 1,
      date: "Nov 15, 2024",
      result: "W",
    },
    nextGame: {
      homeTeam: "Harvard University",
      awayTeam: "Tufts University",
      date: "Dec 5, 2024",
      time: "3:00 PM",
    },
  };

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

            {/* Season */}
            <div className="inline-block">
              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value)}
                className="bg-[#A51C30] text-white px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#A51C30] focus:ring-offset-2"
              >
                {seasons.map((season) => (
                  <option key={season.value} value={season.value}>
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

        <div className="space-y-12">
          {/* Roster */}
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Roster</h2>
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
          </div>

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
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                    {standingsData.map((team, index) => (
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
                        <td className="px-2 py-2 text-sm text-gray-500 text-center">
                          {team.goalDifference}
                        </td>
                        <td className="px-2 py-2 text-xs text-gray-500 text-center font-semibold">
                          {team.points}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Schedule
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Previous Game */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-500 uppercase">
                    Last Game
                  </span>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      scheduleData.previousGame.result === "W"
                        ? "bg-green-100 text-green-800"
                        : scheduleData.previousGame.result === "L"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {scheduleData.previousGame.result === "W"
                      ? "WIN"
                      : scheduleData.previousGame.result === "L"
                      ? "LOSS"
                      : "TIE"}
                  </span>
                </div>
                <div className="text-center">
                  <div className="text-lg font-medium text-gray-900 mb-2">
                    {scheduleData.previousGame.homeTeam} vs{" "}
                    {scheduleData.previousGame.awayTeam}
                  </div>
                  <div className="text-2xl font-bold text-[#A51C30] mb-2">
                    {scheduleData.previousGame.homeScore} -{" "}
                    {scheduleData.previousGame.awayScore}
                  </div>
                  <div className="text-sm text-gray-500">
                    {scheduleData.previousGame.date}
                  </div>
                </div>
              </div>

              {/* Next Game */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-500 uppercase">
                    Next Game
                  </span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                    UPCOMING
                  </span>
                </div>
                <div className="text-center">
                  <div className="text-lg font-medium text-gray-900 mb-2">
                    {scheduleData.nextGame.homeTeam} vs{" "}
                    {scheduleData.nextGame.awayTeam}
                  </div>
                  <div className="text-2xl font-bold text-[#A51C30] mb-2">
                    {scheduleData.nextGame.time}
                  </div>
                  <div className="text-sm text-gray-500">
                    {scheduleData.nextGame.date}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
