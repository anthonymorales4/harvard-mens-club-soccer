"use client";

export default function RoleBadge({ role }) {
  // Determine badge color based on role
  // Green for current players, blue for alumni
  const badgeColors = {
    current_player: {
      bg: "bg-green-500",
      text: "text-white",
    },
    alumni: {
      bg: "bg-blue-500",
      text: "text-white",
    },
  };

  // Get the correct colors
  const { bg, text } = badgeColors[role];

  // Format the display text
  const displayText = role === "current_player" ? "Player" : "Alumni";

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${bg} ${text}`}
    >
      {displayText}
    </span>
  );
}
