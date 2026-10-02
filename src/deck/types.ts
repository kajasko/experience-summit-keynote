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
};

export type SceneProps = {
  step: number;
  reduced: boolean;
  sceneId: string;
};
