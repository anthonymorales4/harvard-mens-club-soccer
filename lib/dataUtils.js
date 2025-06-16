export async function loadSeasons() {
  try {
    const response = await fetch("/data/seasons.json");
    return await response.json();
  } catch (error) {
    console.error("Error loading seasons: ", error);
    return { competitions: [], years: [] };
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
