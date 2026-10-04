import CinematicHero from "@/components/CinematicHero/CinematicHero";
import MemoryExperience from "@/components/RadmanScene/MemoryExperience";
import StorySection from "@/components/StorySection/StorySection";
import TimeChapter from "@/components/TimeChapter/TimeChapter";
import FinalChapter from "@/components/FinalChapter/FinalChapter";

export default function Home() {
  return (
    <main className="site-shell">
      <CinematicHero />
      <StorySection />
      <MemoryExperience />
      <TimeChapter />
      <FinalChapter />
    </main>
  );
}
