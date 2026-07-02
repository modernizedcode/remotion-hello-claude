import React from "react";

// The Claude Code pixel mascot on a 16x10 unit grid, traced from the
// application logo: body with two eye cutouts, two side arms, four legs.
const GRID_W = 16;
const GRID_H = 10;

const BODY = { x: 2, y: 0, w: 12, h: 8 };
const EYES = [
  { x: 4, y: 2, w: 1, h: 2 },
  { x: 11, y: 2, w: 1, h: 2 },
];
const LEFT_ARM = { x: 0, y: 4, w: 2, h: 2 };
const RIGHT_ARM = { x: 14, y: 4, w: 2, h: 2 };
const LEGS = [3, 5, 10, 12].map((x) => ({ x, y: 8, w: 1, h: 2 }));

export const ClaudeLogo: React.FC<{
  size: number;
  color: string;
  eyeColor: string;
  // Degrees of rotation for the right arm, pivoting at the shoulder.
  waveAngle: number;
}> = ({ size, color, eyeColor, waveAngle }) => {
  const u = size / GRID_W;
  const px = (n: number) => n * u;

  return (
    <svg
      width={size}
      height={px(GRID_H)}
      viewBox={`0 0 ${size} ${px(GRID_H)}`}
    >
      <rect
        x={px(BODY.x)}
        y={px(BODY.y)}
        width={px(BODY.w)}
        height={px(BODY.h)}
        fill={color}
      />
      {EYES.map((eye) => (
        <rect
          key={eye.x}
          x={px(eye.x)}
          y={px(eye.y)}
          width={px(eye.w)}
          height={px(eye.h)}
          fill={eyeColor}
        />
      ))}
      <rect
        x={px(LEFT_ARM.x)}
        y={px(LEFT_ARM.y)}
        width={px(LEFT_ARM.w)}
        height={px(LEFT_ARM.h)}
        fill={color}
      />
      <rect
        x={px(RIGHT_ARM.x)}
        y={px(RIGHT_ARM.y)}
        width={px(RIGHT_ARM.w)}
        height={px(RIGHT_ARM.h)}
        fill={color}
        transform={`rotate(${waveAngle} ${px(RIGHT_ARM.x)} ${px(RIGHT_ARM.y + RIGHT_ARM.h / 2)})`}
      />
      {LEGS.map((leg) => (
        <rect
          key={leg.x}
          x={px(leg.x)}
          y={px(leg.y)}
          width={px(leg.w)}
          height={px(leg.h)}
          fill={color}
        />
      ))}
    </svg>
  );
};
