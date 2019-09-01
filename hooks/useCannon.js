import { Body, World, NaiveBroadphase } from 'cannon';
import React, { useState, useEffect, useContext, useRef } from 'react';
import { useRender } from 'react-three-fiber';

// Cannon-world context provider
const context = React.createContext();

export const CannonProvider = ({ children }) => {
  // Set up physics
  const [world] = useState(() => new World());

  useEffect(() => {
    world.broadphase = new NaiveBroadphase();
    world.solver.iterations = 10;
    world.gravity.set(0, 0, -25);
  }, [world]);

  // Run world stepper every frame
  useRender(() => world.step(1 / 60));
  // Distribute world via context
  return <context.Provider value={world}>{children}</context.Provider>;
};

// Custom hook to maintain a world physics body
export function useCannon({ ...props }, fn, deps = []) {
  const ref = useRef();
  // Get cannon world object
  const world = useContext(context);
  // Instanciate a physics body
  const [body] = useState(() => new Body(props));

  useEffect(() => {
    // Call function so the user can add shapes
    fn(body);
    // Add body to world on mount
    world.addBody(body);
    // Remove body on unmount
    return () => world.removeBody(body);
  }, deps);

  useRender(() => {
    if (ref.current) {
      // Transport cannon physics into the referenced threejs object
      ref.current.position.copy(body.position);
      ref.current.quaternion.copy(body.quaternion);
    }
  });

  return ref;
}