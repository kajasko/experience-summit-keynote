export type AwardPlace = { rank: 1 | 2 | 3; project: string; company: string };
export type AwardProject = { company: string; project: string; person?: string };
export type AwardCategory = {
  id: "impact" | "pulse" | "changemakers";
  name: string;
  short?: string;
  decidedBy?: "jury" | "public";
  count: number;
  jury: AwardPlace[];
  projects: AwardProject[];
};
export type AwardsData = {
  event: string;
  date: string;
  organizer: string;
  summit: string;
  criteria: { id: string; label: string; weight: number }[];
  categories: AwardCategory[];
  prizes: string[];
  notes: { applicants: string; publicVote: string };
  logos?: Record<string, string>;
  people?: Record<string, string>;
  logoRatio?: Record<string, number>;
  source?: string;
};
