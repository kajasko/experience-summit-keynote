import type { ComponentType } from "react";
import type { SceneProps } from "../deck/types";
import { Opening } from "./act0/Opening";
import { History } from "./act0/History";
import { Intent } from "./act0/Intent";
import { Thesis, Adoption, Normalization, ValueGap, Twist } from "./act0/Stats";
import { Visions, Challenges } from "./act0/Visions";
import { Chapter } from "./Chapter";
import { CoMap } from "./CoMap";
import { Trend1, UxAx, Understanding, BuyerUser, Needs, Modes, Examples, Prd } from "./act1";
import { Journey, Adapt, Funnel, Conversation, Chat, UiAi, Partner, HumanAi } from "./act2";
import { Distrust, Brand, Prove, Findability, BrandExp, Principles, Bias, Trust, Hitl } from "./act3";
import { Orch, Channels, Mortgage, BxCxEx } from "./act4";
import { Skills, HeroEnd, Roles, Leadership, VideoEnd, SpeakersLoop } from "./finale";

export const registry: Record<string, ComponentType<SceneProps & { sceneId: string }>> = {
  Opening,
  History,
  Intent,
  Thesis,
  Adoption,
  Normalization,
  ValueGap,
  Twist,
  Visions,
  Challenges,
  Chapter,
  CoMap,
  Trend1,
  UxAx,
  Understanding,
  BuyerUser,
  Needs,
  Modes,
  Examples,
  Prd,
  Journey,
  Adapt,
  Funnel,
  Conversation,
  Chat,
  UiAi,
  Partner,
  HumanAi,
  Distrust,
  Brand,
  Prove,
  Findability,
  BrandExp,
  Principles,
  Bias,
  Trust,
  Hitl,
  Orch,
  Channels,
  Mortgage,
  BxCxEx,
  Skills,
  HeroEnd,
  Roles,
  Leadership,
  VideoEnd,
  SpeakersLoop,
};
