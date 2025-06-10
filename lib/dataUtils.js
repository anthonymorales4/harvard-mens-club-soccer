export async function loadSeasons() {
  try {
    const response = await fetch("data/seasons.json");
    if (!response.ok) throw new Error("Failed to load seasons");
    return await response.json();
  } catch (error) {
    console.error("Error loading seasons:", error);
    return { seasons: [] };
  }
}

export async function loadStandings(season) {
  try {
    const response = await fetch(`/data/standings/nirsa/${season}.json`);
    if (!response.ok) throw new Error(`Failed to load standings for ${season}`);
    return await response.json();
  } catch (error) {
    console.error(`Error loading standings for ${season}:`, error);
    return { teams: [] };
  }
}

export async function loadSchedule(season) {
  try {
    const response = await fetch(`/data/schedule/nirsa/${season}.json`);
    if (!response.ok) throw new Error(`Failed to load schedule for ${season}`);
    return await response.json();
  } catch (error) {
    console.error(`Error loading schedule for ${season}:`, error);
    return { games: [] };
  }
}

export async function loadRoster(season) {
  // This will connect to your Supabase database
  // For now, we'll return placeholder data matching your expected structure
  const mockRoster = [
    {
      id: 1,
      user_id: "mock-1",
      first_name: "Anthony",
      last_name: "Morales",
      graduation_year: parseInt(season) + 4, // Assuming 4-year program
      position: "Midfielder",
      profile_image_url: "/images/profilepic.svg",
    },
    {
      id: 2,
      user_id: "mock-2",
      first_name: "James",
      last_name: "Mitchell",
      graduation_year: parseInt(season) + 2,
      position: "Forward",
      profile_image_url: "/images/profilepic.svg",
    },
    // Add more mock players as needed
  ];

  return mockRoster;
}

export function calculateRecentForm(
  games,
  teamName = "Harvard University - Crimson",
  limit = 5
) {
  const completedGames = games
    .filter((game) => game.result !== null)
    .slice(0, limit);
  return completedGames
    .map((game) => {
      if (game.result === "TIE") return "D";
      return game.result;
    })
    .map((result) => (result === "WIN" ? "W" : result === "LOSS" ? "L" : "D"));
}

export function calculateTeamRecord(games) {
  const completedGames = games.filter((game) => game.result !== null);

  const wins = completedGames.filter((game) => game.result === "WIN").length;
  const losses = completedGames.filter((game) => game.result === "LOSS").length;
  const ties = completedGames.filter((game) => game.result === "TIE").length;

  return { wins, losses, ties };
}
