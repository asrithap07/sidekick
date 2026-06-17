import type { Project } from "@/types/project";

// Mock project store — simulates what Supabase will return by ID.
// When Supabase is ready: replace these functions with supabase.from('projects')... calls.
const InternshipSearch: Project = {
  id: "internship-search",
  title: "Internship Search",
  description: "Land a Summer 2027 SWE internship",
  deadline: "2027-08-15",
  progress: 62,

  phases: [
    {
      number: 1,
      title: "Resume & Branding",
      status: "completed",
      progress: 100,
      tasks: [
        {
          id: "1-1",
          label: "Update resume with latest projects",
          priority: "high",
          done: true,
          project: "internship-search",
          tags: ["resume"],
        },
        {
          id: "1-2",
          label: "Optimise LinkedIn headline + about",
          priority: "medium",
          done: true,
          project: "internship-search",
          tags: ["linkedin"],
        },
        {
          id: "1-3",
          label: "Polish portfolio write-ups",
          priority: "low",
          done: true,
          project: "internship-search",
          tags: ["portfolio"],
        },
      ],
    },

    {
      number: 2,
      title: "Applications",
      status: "in-progress",
      progress: 60,
      tasks: [
        {
          id: "2-1",
          label: "Research target companies list",
          priority: "high",
          done: true,
          project: "internship-search",
          tags: ["research"],
        },
        {
          id: "2-2",
          label: "Apply to Google SWE Intern",
          priority: "high",
          done: false,
          project: "internship-search",
          tags: ["application"],
          dueDate: "2026-06-18",
        },
        {
          id: "2-3",
          label: "Apply to Meta University Program",
          priority: "high",
          done: false,
          project: "internship-search",
          tags: ["application"],
          dueDate: "2026-06-18",
        },
        {
          id: "2-4",
          label: "Set up application tracker spreadsheet",
          priority: "medium",
          done: false,
          project: "internship-search",
          tags: ["admin"],
          dueDate: "2026-06-19",
        },
      ],
    },

    {
      number: 3,
      title: "Interview Prep",
      status: "upcoming",
      progress: 0,
      tasks: [
        {
          id: "3-1",
          label: "LeetCode: Arrays",
          priority: "high",
          done: false,
          project: "internship-search",
          tags: ["dsa"],
          dueDate: "2027-08-01",
        },
        {
          id: "3-2",
          label: "LeetCode: Trees",
          priority: "high",
          done: false,
          project: "internship-search",
          tags: ["dsa"],
          dueDate: "2027-08-05",
        },
        {
          id: "3-3",
          label: "System design: URL shortener",
          priority: "medium",
          done: false,
          project: "internship-search",
          tags: ["system-design"],
          dueDate: "2027-08-10",
        },
      ],
    },
  ],
};

const JapanTrip2026: Project = {
  id: "japan-trip-2026",
  title: "Japan Trip 2026",
  description: "Plan a 2-week Japan trip",
  deadline: "2026-12-15",
  progress: 41,

  phases: [
    {
      number: 1,
      title: "Research & Budget",
      status: "completed",
      progress: 100,
      tasks: [
        {
          id: "jp-1",
          label: "Choose travel dates",
          priority: "high",
          done: true,
          project: "japan-trip-2026",
          tags: ["planning"],
        },
        {
          id: "jp-2",
          label: "Estimate total budget",
          priority: "high",
          done: true,
          project: "japan-trip-2026",
          tags: ["budget"],
        },
        {
          id: "jp-3",
          label: "Draft itinerary",
          priority: "medium",
          done: true,
          project: "japan-trip-2026",
          tags: ["planning"],
        },
      ],
    },

    {
      number: 2,
      title: "Flights & Hotels",
      status: "in-progress",
      progress: 60,
      tasks: [
        {
          id: "jp-4",
          label: "Book round-trip flight",
          priority: "high",
          done: true,
          project: "japan-trip-2026",
          tags: ["booking"],
        },
        {
          id: "jp-5",
          label: "Reserve Tokyo hotel",
          priority: "high",
          done: false,
          project: "japan-trip-2026",
          tags: ["booking"],
        },
        {
          id: "jp-6",
          label: "Reserve Kyoto hotel",
          priority: "high",
          done: false,
          project: "japan-trip-2026",
          tags: ["booking"],
        },
        {
          id: "jp-7",
          label: "Purchase travel insurance",
          priority: "medium",
          done: false,
          project: "japan-trip-2026",
          tags: ["travel"],
        },
      ],
    },

    {
      number: 3,
      title: "Activities",
      status: "in-progress",
      progress: 35,
      tasks: [
        {
          id: "jp-8",
          label: "Reserve Shibuya Sky",
          priority: "medium",
          done: false,
          project: "japan-trip-2026",
          tags: ["activities"],
        },
        {
          id: "jp-9",
          label: "Book TeamLabs",
          priority: "medium",
          done: false,
          project: "japan-trip-2026",
          tags: ["activities"],
        },
        {
          id: "jp-10",
          label: "Book Nintendo Museum",
          priority: "medium",
          done: false,
          project: "japan-trip-2026",
          tags: ["activities"],
        },
        {
          id: "jp-11",
          label: "Book Universal Studios Japan",
          priority: "high",
          done: false,
          project: "japan-trip-2026",
          tags: ["activities"],
        },
      ],
    },

    {
      number: 4,
      title: "Travel Preparation",
      status: "upcoming",
      progress: 0,
      tasks: [
        {
          id: "jp-12",
          label: "Verify passport expiration",
          priority: "high",
          done: false,
          project: "japan-trip-2026",
          tags: ["documents"],
        },
        {
          id: "jp-13",
          label: "Purchase luggage",
          priority: "medium",
          done: false,
          project: "japan-trip-2026",
          tags: ["packing"],
        },
        {
          id: "jp-14",
          label: "Learn basic Japanese phrases",
          priority: "low",
          done: false,
          project: "japan-trip-2026",
          tags: ["language"],
        },
        {
          id: "jp-15",
          label: "Download offline maps",
          priority: "low",
          done: false,
          project: "japan-trip-2026",
          tags: ["travel"],
        },
      ],
    },
  ],
};

export const MOCK_PROJECTS: Project[] = [
  InternshipSearch,
  JapanTrip2026,
];