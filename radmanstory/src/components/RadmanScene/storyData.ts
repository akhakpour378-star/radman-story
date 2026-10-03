export type StoryChapter = {
  number: string;
  year: string;
  title: string;
  description: string;
  image: string;
  align: "left" | "right";
};

export const storyChapters: StoryChapter[] = [
  {
    number: "01",
    year: "THE BEGINNING",
    title: "Before everything had a name.",
    description:
      "There are moments in life that arrive quietly, yet somehow change the shape of everything that follows.",
    image: "/memory/radman-main.jpg",
    align: "left",
  },
  {
    number: "02",
    year: "A LITTLE LIFE",
    title: "Then came Radman.",
    description:
      "A small presence. A familiar face. A reason for ordinary days to become unforgettable.",
    image: "/memory/radman-second.jpg",
    align: "right",
  },
  {
    number: "03",
    year: "14 : 15",
    title: "Some moments stay.",
    description:
      "Time keeps moving. Memories do not always follow it. Some moments remain exactly where the heart left them.",
    image: "/memory/radman-main.jpg",
    align: "left",
  },
];