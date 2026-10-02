import { createContext, useContext } from "react";
import type { FlatStep } from "../deck/types";

/** The step a scene is currently rendering; lets chrome derive the slide number. */
export const SlideContext = createContext<FlatStep | null>(null);

export function useSlideStep(): FlatStep | null {
  return useContext(SlideContext);
}
