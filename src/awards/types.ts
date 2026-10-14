export type AwardPlace = { rank: 1 | 2 | 3; project: string; company: string };
export type AwardProject = { company: string; project: string };
export type AwardCategory = {
  id: "impact" | "pulse";
  name: string;
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
};
