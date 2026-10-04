export type MemoryItem = {
  id: string;
  number: string;
  category: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  year: string;
  time?: string;
  location?: string;
  featured?: boolean;
};

export const memoryItems: MemoryItem[] = [
  {
    id: "radman-01",
    number: "01",
    category: "PORTRAIT",
    title: "The face I carry with me.",
    subtitle: "A beginning that remains.",
    description:
      "Some photographs capture a moment. Some become part of the person who keeps looking at them.",
    image: "/memory/radman-main.JPG",
    year: "2026",
    time: "14 : 15",
    location: "A memory",
    featured: true,
  },
  {
    id: "radman-02",
    number: "02",
    category: "MEMORY",
    title: "The little moments.",
    subtitle: "The ones that stay.",
    description:
      "The smallest moments often become the memories we return to the most.",
    image: "/memories/memory-01.JPG",
    year: "2026",
    time: "—",
    location: "Somewhere remembered",
  },
  {
    id: "radman-03",
    number: "03",
    category: "TIME",
    title: "14 : 15",
    subtitle: "A moment in time.",
    description:
      "There are certain hours that become more than numbers. They become coordinates of memory.",
    image: "/memories/memory-02.JPG",
    year: "2026",
    time: "14 : 15",
    location: "Forever",
  },
  {
    id: "radman-04",
    number: "04",
    category: "FOREVER",
    title: "Still here.",
    subtitle: "In every memory.",
    description:
      "Distance changes many things. Memory is one of the things that refuses to disappear.",
    image: "/memories/memory-03.JPG",
    year: "2026",
    time: "—",
    location: "Always",
  },
];
