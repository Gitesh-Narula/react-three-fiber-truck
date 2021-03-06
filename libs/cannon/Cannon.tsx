import { World, Vec3, SAPBroadphase } from 'cannon';
import React, { useState, useEffect, createContext, FC, useMemo } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import { DebugRenderer } from './DebugRenderer';

export const CannonContext = createContext<World>(null);

export interface ICannonProps {
  solverIterations?: number;
  gravity?: Vec3;
  debug?: boolean;
}

export const Cannon: FC<ICannonProps> = ({
  solverIterations = 10,
  gravity = new Vec3(0, 0, -10),
  debug,
  children,
}) => {
  const [world] = useState(() => new World());

  useEffect(() => {
    world.broadphase = new SAPBroadphase(world);
    world.solver.iterations = solverIterations;
    if (gravity) {
      world.gravity.set(gravity.x, gravity.y, gravity.z);
    }
  }, [solverIterations, gravity]);

  const { scene } = useThree();

  const debugRenderer = useMemo(
    () => debug && new DebugRenderer(scene, world),
    [debug]
  );

  useFrame(() => {
    world.step(1 / 60), false, [world];
    if (debug) {
      debugRenderer.update();
    }
  });

  return (
    <CannonContext.Provider value={world}>{children}</CannonContext.Provider>
  );
};
