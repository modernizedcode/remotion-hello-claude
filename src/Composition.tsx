import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ClaudeLogo } from "./ClaudeLogo";

const SOLARIZED = {
  base03: "#002b36",
  base02: "#073642",
  base01: "#586e75",
  base0: "#839496",
  base1: "#93a1a1",
  orange: "#cb4b16",
  yellow: "#b58900",
  red: "#dc322f",
  green: "#859900",
  cyan: "#2aa198",
  blue: "#268bd2",
} as const;

const MONO_FONT = "'Cascadia Code', Consolas, 'Courier New', monospace";
const PROMPT_TEXT = "claude code";
// Layout is authored at 1280x720; the composition renders at 4K (3x).
const SCALE = 3;
// Timing below is authored in 30fps frames and scaled to the actual fps.
const BASE_FPS = 30;

const TrafficLight: React.FC<{ color: string }> = ({ color }) => (
  <div
    style={{
      width: 14,
      height: 14,
      borderRadius: "50%",
      backgroundColor: color,
    }}
  />
);

export const MyComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scale 30fps-authored frame thresholds to the composition's actual fps.
  const f = (frames: number) => (frames * fps) / BASE_FPS;
  const waveStart = f(25);

  const windowEnter = spring({ frame, fps, config: { damping: 14 } });
  const logoEnter = spring({
    frame: frame - f(8),
    fps,
    config: { damping: 12 },
  });

  // The mascot waves its right arm; amplitude eases in after the entrance.
  const waveAmplitude = interpolate(frame, [waveStart, waveStart + f(20)], [0, 32], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const wavePhase = ((frame - waveStart) / fps) * Math.PI * 2.6;
  const armWave = -waveAmplitude + Math.sin(wavePhase) * waveAmplitude;

  // Gentle body rock and hop in time with the arm.
  const bodyRock = Math.sin(wavePhase) * (waveAmplitude / 8);
  const hop = -Math.abs(Math.sin(wavePhase / 2)) * (waveAmplitude / 4);

  const typedChars = Math.round(
    interpolate(
      frame,
      [f(45), f(45) + PROMPT_TEXT.length * f(3)],
      [0, PROMPT_TEXT.length],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      },
    ),
  );
  const cursorVisible = frame % fps < fps / 2;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: SOLARIZED.base03,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: MONO_FONT,
      }}
    >
      <div
        style={{
          width: 780,
          height: 480,
          backgroundColor: SOLARIZED.base02,
          borderRadius: 14,
          boxShadow: "0 30px 80px rgba(0, 0, 0, 0.55)",
          overflow: "hidden",
          transform: `scale(${windowEnter * SCALE})`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            height: 44,
            backgroundColor: SOLARIZED.base03,
            borderBottom: `1px solid ${SOLARIZED.base02}`,
            display: "flex",
            alignItems: "center",
            gap: 9,
            paddingLeft: 18,
          }}
        >
          <TrafficLight color={SOLARIZED.red} />
          <TrafficLight color={SOLARIZED.yellow} />
          <TrafficLight color={SOLARIZED.green} />
          <span
            style={{
              color: SOLARIZED.base01,
              fontSize: 17,
              marginLeft: 14,
            }}
          >
            claude-code — ~/projects
          </span>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 38,
          }}
        >
          <div
            style={{
              transform: `scale(${logoEnter}) translateY(${hop}px) rotate(${bodyRock}deg)`,
              transformOrigin: "50% 100%",
            }}
          >
            <ClaudeLogo
              size={300}
              color={SOLARIZED.orange}
              eyeColor={SOLARIZED.base02}
              waveAngle={armWave}
            />
          </div>

          <div style={{ fontSize: 34, display: "flex", gap: 14 }}>
            <span style={{ color: SOLARIZED.green }}>&gt;</span>
            <span style={{ color: SOLARIZED.base1 }}>
              {PROMPT_TEXT.slice(0, typedChars)}
              <span
                style={{
                  color: SOLARIZED.cyan,
                  opacity: cursorVisible ? 1 : 0,
                }}
              >
                ▋
              </span>
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
