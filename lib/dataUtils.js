import { supabase } from "@/lib/supabase";

export async function loadSeasons() {
  try {
    const response = await fetch("/data/seasons.json");
    return await response.json();
  } catch (error) {
    console.error("Error loading seasons: ", error);
    return { competitions: [], years: [] };
  }
}

export async function loadRoster(year) {
  try {
    const response = await fetch(`/data/rosters/${year}.json`);
    return await response.json();
  } catch (error) {
    console.error(`Error loading roster for ${year}:`, error);
    return { year, players: [] };
  }
}

export async function loadStandings(competition, year) {
  try {
    const response = await fetch(`/data/standings/${competition}/${year}.json`);
    return await response.json();
  } catch (error) {
    console.error(
      `Error loading standings for ${competition} ${year}: `,
      error
    );
    return { season: year, teams: [] };
  }
}

export async function loadSchedule(competition, year) {
  try {
    const response = await fetch(`/data/schedule/${competition}/${year}.json`);
    return await response.json();
  } catch (error) {
    console.error(`Error loading schedule for ${competition} ${year}: `, error);
    return { season: year, games: [] };
  }
}

export async function loadAlumniRoster() {
  try {
    const allRosters = await loadAllHistoricalRosters();
    const currentRoster = await loadRoster("2024-2025");

    const currentPlayerNames = new Set(
      currentRoster.players.map((player) => player.name.toLowerCase().trim())
    );

    const alumniData = [];

    for (const roster of allRosters) {
      for (const player of roster.players) {
        const playerName = player.name.toLowerCase().trim();

        // Skip if this player is on current roster
        if (currentPlayerNames.has(playerName)) {
          continue;
        }

        // Skip if we already added alumni (avoid duplicates across years)
        const alreadyAdded = alumniData.some(
          (alumni) => alumni.name.toLowerCase().trim() === playerName
        );

        if (!alreadyAdded) {
          alumniData.push({
            ...player,
            isAlumni: true,
          });
        }
      }
    }

    return alumniData;
  } catch (error) {
    console.error("Error loading alumni roster:", error);
    return [];
  }
}

async function loadAllHistoricalRosters() {
  try {
    const years = [
      "2017-2018",
      "2018-2019",
      "2019-2020",
      "2021-2022",
      "2022-2023",
      "2023-2024",
      "2024-2025",
    ];

    const rosters = [];

    for (const year of years) {
      try {
        const roster = await loadRoster(year);
        rosters.push({
          year: year,
          players: roster.players || [],
        });
      } catch (error) {
        console.error(`Could not load roster for year ${year}:`, error);
      }
    }

    return rosters;
  } catch (error) {
    console.error("Error loading historical rosters:", error);
  }
}

export async function mergeStaticRosterWithSupabaseProfiles(players) {
  try {
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("*");

    if (error) {
      console.error("Error fetching profiles:", error);
      return players.map((player) => ({
        ...player,
        isProfileCreated: false,
      }));
    }

    // Create profile mapping
    const profileMap = new Map();
    profiles.forEach((profile) => {
      profileMap.set(profile.full_name, profile);
    });

    // Merge static roster with created profiles
    return players.map((player) => {
      const playerWithSupabaseProfile = profileMap.get(player.name);

      if (playerWithSupabaseProfile) {
        return {
          id: playerWithSupabaseProfile.id,
          name: playerWithSupabaseProfile.full_name,
          graduationYear: playerWithSupabaseProfile.graduation_year,
          role: playerWithSupabaseProfile.role,
          profileImageUrl: playerWithSupabaseProfile.profile_image_url,
          hometown: playerWithSupabaseProfile.hometown,
          concentration: playerWithSupabaseProfile.concentration,
          house: playerWithSupabaseProfile.house,
          finalClub: playerWithSupabaseProfile.final_club,
          currentJob: playerWithSupabaseProfile.current_job,
          currentLocation: playerWithSupabaseProfile.current_location,
          bio: playerWithSupabaseProfile.bio,
          position: playerWithSupabaseProfile.position,
          currentCompany: playerWithSupabaseProfile.current_company,
          isProfileCreated: true,
        };
      } else {
        return {
          id: null,
          ...player,
          graduationYear: null,
          role: null,
          profileImage: "/images/profilepic.svg",
          hometown: null,
          concentration: null,
          house: null,
          finalClub: null,
          currentJob: null,
          currentLocation: null,
          bio: null,
          position: null,
          currentCompany: null,
          isProfileCreated: false,
        };
      }
    });
  } catch (error) {
    console.error("Error merging roster with profiles:", error);
    return players.map((player) => ({ ...player, isProfileCreated: false }));
  }
}

export function calculateRecentForm(games) {
  const completedGames = games
    .filter((game) => game.result !== null)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return completedGames.slice(0, 5).map((game) => {
    switch (game.result) {
      case "WIN":
        return "W";
      case "LOSS":
        return "L";
      case "TIE":
        return "T";
    }
  });
}

export function calculateTeamRecord(games) {
  const completedGames = games.filter((game) => game.result !== null);

  const record = {
    wins: 0,
    losses: 0,
    ties: 0,
  };

  completedGames.forEach((game) => {
    switch (game.result) {
      case "WIN":
        record.wins++;
        break;
      case "LOSS":
        record.losses++;
        break;
      case "TIE":
        record.ties++;
        break;
    }
  });

  return record;
}

export function getAcademicYearForCompetition(competition, year) {
  if (competition === "nirsa") {
    return `${year}-${parseInt(year) + 1}`;
  } else if (competition === "ivies") {
    return `${parseInt(year) - 1}-${year}`;
  }
}

export function getFormColor(result) {
  switch (result) {
    case "W":
      return "bg-green-500";
    case "L":
      return "bg-red-500";
    case "T":
      return "bg-yellow-500";
  }
}

export function getResultStyling(result) {
  if (!result) return "bg-blue-100 text-blue-800";
  switch (result) {
    case "WIN":
      return "bg-green-500";
    case "LOSS":
      return "bg-red-500";
    case "TIE":
      return "bg-yellow-500";
  }
}

export function getStandingsRowStyling(team, index, competition) {
  if (competition === "ivies" && index < 2) {
    return "bg-green-100";
  } else if (
    team.name === "Harvard University - Crimson" ||
    team.name === "Harvard - Crimson" ||
    team.name === "Harvard University - A" ||
    team.name === "Harvard"
  ) {
    return "bg-[#A51C30]/5";
  }
}

export function getGameTypeStyling(gameType) {
  switch (gameType) {
    case "Group Stage":
      return "bg-blue-100 text-blue-800";
    case "Semi-Final":
      return "bg-green-100 text-green-800";
  }
}
