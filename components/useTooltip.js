import { useRef } from "react";

export default function useTooltip() {
  const tooltipRef = useRef();
  const tooltipTitleRef = useRef();
  const tooltipDescriptionRef = useRef();

  return {
    tooltipRef,
    tooltipTitleRef,
    tooltipDescriptionRef,
  };
}
