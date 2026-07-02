import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ClaudeCodeWave"
        component={MyComposition}
        durationInFrames={300}
        fps={60}
        width={3840}
        height={2160}
      />
    </>
  );
};
