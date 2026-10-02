import type { Source } from "./types";

/** All citations are from 2026_09_06_Vizionář v době_key note2.pdf. Do not invent. */
export const sources: Record<string, Source> = {
  cvvm: {
    id: "cvvm",
    short: "CVVM, 06/2026",
    full: "CVVM, Umělá inteligence (AI) – znalosti, zkušenosti a postoje, 06/2026",
    sourcePage: 4,
  },
  eurostat: {
    id: "eurostat",
    short: "Eurostat, 02/2026",
    full: "Eurostat, 64% of 16–24-year-olds used AI in 2025, 02/2026",
    sourcePage: 4,
  },
  mckinseyAgentic: {
    id: "mckinseyAgentic",
    short: "McKinsey, Europe’s Agentic Commerce Moment, 2026",
    full: "McKinsey & Company, Europe’s Agentic Commerce Moment, 2026",
    sourcePage: 4,
  },
  bcg: {
    id: "bcg",
    short: "BCG, The Widening AI Value Gap, 09/2025",
    full: "Boston Consulting Group, The Widening AI Value Gap: Build for the Future 2025, 09/2025; n=1 250 senior executives & AI decision makers",
    sourcePage: 5,
  },
  designerFund: {
    id: "designerFund",
    short: "Designer Fund & Foundation Capital, 20/05/2026",
    full: "Designer Fund & Foundation Capital, AI in Design 2026: The Inflection Point Is Here, 20/05/2026; 900+ designers, 60+ countries",
    sourcePage: 10,
  },
  mckinseySearch: {
    id: "mckinseySearch",
    short: "McKinsey, New Front Door to the Internet, 16/10/2025",
    full: "McKinsey & Company, New Front Door to the Internet: Winning in the Age of AI Search, 16/10/2025; AI Discovery Survey, Aug 2025, n=1 927 US consumers",
    sourcePage: 10,
  },
  gartnerAgents: {
    id: "gartnerAgents",
    short: "Gartner, Predicts 2024, 03/2024",
    full: "Gartner, Predicts 2024: The Future of Generative AI Technologies, 03/2024; prediction for 2028",
    sourcePage: 10,
  },
  qualtrics: {
    id: "qualtrics",
    short: "Qualtrics XM Institute, 10/2025",
    full: "Qualtrics XM Institute, 2026 Consumer Experience Trends Report, 10/2025, n=20 000+",
    sourcePage: 19,
  },
  googleLens: {
    id: "googleLens",
    short: "Google / Debbie Weinstein, OMR, 05/2025",
    full: "Google, Debbie Weinstein’s Remarks at OMR Germany, 05/2025",
    sourcePage: 19,
  },
  gartnerHuman: {
    id: "gartnerHuman",
    short: "Gartner, 04/08/2026",
    full: "Gartner, Customers Using GenAI for Customer Service Must Have Access to a Human Agent, 04/08/2026, n=3 566",
    sourcePage: 19,
  },
  accenture: {
    id: "accenture",
    short: "Accenture Song, Life Trends 2025",
    full: "Accenture Song, Accenture Life Trends 2025, 2024",
    sourcePage: 30,
  },
  sap: {
    id: "sap",
    short: "SAP Global Engagement Index 2026",
    full: "SAP Global Engagement Index 2026",
    sourcePage: 40,
  },
  gartnerCx: {
    id: "gartnerCx",
    short: "Gartner, duben 2026",
    full: "Gartner, duben 2026",
    sourcePage: 40,
  },
  wef: {
    id: "wef",
    short: "WEF, Future of Jobs Report 2025",
    full: "World Economic Forum, The Future of Jobs Report 2025, 01/2025; Future of Jobs Survey 2024, Figure 3.4 – Skills on the rise, 2025–2030",
    sourcePage: 43,
  },
  gartnerLead: {
    id: "gartnerLead",
    short: "Gartner, AI Leader Personas, 05/08/2026",
    full: "Gartner, AI Leader Personas and Leadership Networks: What Makes AI Leaders Effective, 05/08/2026. Anthony Mullen, Mike Rollings & Erick Brethenoux",
    sourcePage: 45,
  },
  nist: {
    id: "nist",
    short: "Reva Schwartz, NIST",
    full: "Reva Schwartz, National Institute of Standards and Technology (NIST), US Department of Commerce",
    sourcePage: 36,
  },
};

export function cite(ids: string[] | undefined): Source[] {
  if (!ids) return [];
  return ids.map((id) => sources[id]).filter(Boolean);
}
