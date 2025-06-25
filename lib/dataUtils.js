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
    console.error(`Error loading roaster for ${year}:`, error);
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
          position: playerWithSupabaseProfile.position,
          profileImage: playerWithSupabaseProfile.profile_image_url,
          bio: playerWithSupabaseProfile.bio,
          isProfileCreated: true,
          supabaseProfile: playerWithSupabaseProfile,
        };
      } else {
        return {
          id: null,
          ...player,
          graduationYear: null,
          position: null,
          profileImage: "/images/profilepic.svg",
          bio: null,
          isProfileCreated: false,
          supabaseProfile: null,
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
      return "bg-green-100 text-green-800";
    case "LOSS":
      return "bg-red-100 text-red-800";
    case "TIE":
      return "bg-yellow-100 text-yellow-800";
  }
}
