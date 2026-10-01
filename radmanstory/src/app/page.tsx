import CinematicHero from "@/components/CinematicHero/CinematicHero";
import ImmersiveScene from "@/components/ImmersiveScene/ImmersiveScene";
import MemoryChapter from "@/components/MemoryChapter/MemoryChapter";
import TimeChapter from "@/components/TimeChapter/TimeChapter";
import StorySection from "@/components/StorySection/StorySection";
import FinalChapter from "@/components/FinalChapter/FinalChapter";
import MemoryJourney from "@/components/RadmanScene/MemoryJourney";


export default function Home() {
  return (
    <main className="bg-black">
      <CinematicHero />

      <MemoryJourney />

      <ImmersiveScene />

      <MemoryChapter />

      <TimeChapter />

      <StorySection />

      <FinalChapter />

      
    </main>
  );
}