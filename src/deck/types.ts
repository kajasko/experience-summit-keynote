export type Source = {
  id: string;
  short: string;
  full: string;
  sourcePage: number;
};

export type StepDef = {
  id: string;
  title: string;
  speakerNote: string;
  sources?: string[];
  sourcePage?: number;
};

export type SceneDef = {
  id: string;
  act: number;
  actName: string;
  component: string;
  steps: StepDef[];
};

export type FlatStep = StepDef & {
  index: number;
  act: number;
  actName: string;
  sceneId: string;
  local: number;
  sceneLength: number;
  /** 1-based number of the visual slide this step belongs to. */
  slide: number;
};

/** One visual slide = one or more consecutive steps (builds) of the same composition. */
export type SlideDef = {
  no: number;
  sceneId: string;
  act: number;
  actName: string;
  /** Global index of the first and last step of this slide. */
  first: number;
  last: number;
  /** Step id of the first step; used for the thumbnail file name. */
  id: string;
  title: string;
  steps: number;
};

export type SceneProps = {
  step: number;
  reduced: boolean;
  sceneId: string;
};
