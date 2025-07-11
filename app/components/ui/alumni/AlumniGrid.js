"use client";

import AlumniCard from "./AlumniCard";

export default function AlumniGrid({ alumni, onAlumniClick }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {alumni.map((person, index) => (
        <AlumniCard
          key={index}
          alumni={person}
          onClick={() => onAlumniClick(person)}
        />
      ))}
    </div>
  );
}
