import { useRef } from "react";

export default function useSimulation() {
  const simulationRef = useRef();
  const nodeElementsRef = useRef();
  const linkElementsRef = useRef();

  return {
    simulationRef,
    nodeElementsRef,
    linkElementsRef,
  };
}
