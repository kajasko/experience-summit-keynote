/** Experience Summit 2026 main-stage talks in program order.
 *  Talk 03 is a shared stage: Michaela + Kryštof together. */
export type SpeakerPerson = {
  id: string;
  name: string;
  role: string;
  org: string;
  photo: string;
};

export type SummitTalk = {
  id: string;
  n: string;
  topic: string;
  time: string;
  people: SpeakerPerson[];
};

export const SUMMIT_TALKS: SummitTalk[] = [
  {
    id: "jakub",
    n: "01",
    topic: "Od rychlých člunů po zaoceánské tankery",
    time: "9:45–10:15",
    people: [{
      id: "jakub",
      name: "Jakub Petřina",
      role: "Head of Brand Strategy",
      org: "PPF",
      photo: "speakers/jakub-cut.webp",
    }],
  },
  {
    id: "dejan",
    n: "02",
    topic: "Od softwaru ke kontextu — produktový cyklus v éře AI",
    time: "10:15–10:45",
    people: [{
      id: "dejan",
      name: "Dejan Krstic",
      role: "Group Product Manager",
      org: "ex-Spotify",
      photo: "speakers/dejan-cut.webp",
    }],
  },
  {
    id: "lego",
    n: "03",
    topic: "„Jen to nejlepší je dost dobré“ v éře umělé inteligence",
    time: "11:15–12:00",
    people: [
      {
        id: "michaela",
        name: "Michaela Edgerley Stovicek",
        role: "Global Head of Preschool Audience",
        org: "the LEGO Group",
        photo: "speakers/michaela-cut.webp",
      },
      {
        id: "krystof",
        name: "Vladimír Kryštof Maliňák",
        role: "Produktový designér",
        org: "the LEGO Group",
        photo: "speakers/krystof-cut.webp",
      },
    ],
  },
  {
    id: "milos",
    n: "04",
    topic: "Anatomie úspěšného týmu — vztahy a kultura řídí výsledky",
    time: "12:00–12:30",
    people: [{
      id: "milos",
      name: "Miloš Nejezchleb",
      role: "Chief People Care & MKT Officer",
      org: "Home Credit CZ/SK",
      photo: "speakers/milos-cut.webp",
    }],
  },
];

/** Flat list of every portrait, for persistent FLIP elements. */
export const SUMMIT_PEOPLE = SUMMIT_TALKS.flatMap((t) => t.people);

/** @deprecated alias so older imports keep typing; prefer SUMMIT_TALKS. */
export const SUMMIT_SPEAKERS = SUMMIT_TALKS;
