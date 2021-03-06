import { FC, useMemo } from 'react';
import { useFrame } from 'react-three-fiber';
import Stats from 'stats.js';

export interface IStatsProps {
  panel?: number;
}

export const Stats2: FC<IStatsProps> = ({ panel }) => {
  const stats = useMemo(() => {
    var stats = new Stats();
    if (panel) {
      stats.showPanel(panel);
    }
    document.body.appendChild(stats.dom);
    return stats;
  }, [panel]);

  useFrame(() => {
    stats.update();
  });
  return null;
};
