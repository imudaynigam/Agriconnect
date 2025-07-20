import React from "react";

const colors = [
  "bg-green-200",
  "bg-emerald-300",
  "bg-green-400",
  "bg-emerald-200",
  "bg-green-300"
];
const animations = [
  "animate-pulse",
  "animate-bounce",
  "animate-ping"
];

// Distribute circles in a grid-like pattern to avoid overlap
const numCircles = 12;
const rows = 4;
const cols = 3;
const vSpacing = 80 / (rows - 1); // vertical spacing in vh
const hSpacing = 90 / (cols - 1); // horizontal spacing in vw

const circles = Array.from({ length: numCircles }).map((_, i) => {
  const row = Math.floor(i / cols);
  const col = i % cols;
  const size = 80 + ((i * 17) % 60); // px, varied but not too small/large
  const top = 5 + row * vSpacing + ((i % 2 === 0) ? 0 : 5); // add a small offset for variety
  const left = 5 + col * hSpacing + ((i % 3 === 0) ? 3 : 0); // add a small offset for variety
  const color = colors[i % colors.length];
  const animation = animations[i % animations.length];
  const opacity = 0.13 + ((i * 7) % 15) / 100;
  return (
    <div
      key={i}
      className={`pointer-events-none absolute rounded-full z-0 ${color} ${animation}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        top: `${top}vh`,
        left: `${left}vw`,
        opacity,
      }}
    />
  );
});

const LandingPageCircles = () => (
  <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
    {circles}
  </div>
);

export default LandingPageCircles; 