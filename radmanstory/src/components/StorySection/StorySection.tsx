export default function StorySection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#080807]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(216,183,122,0.06),transparent_45%)]" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center px-6 py-32 sm:px-10">
        <div className="max-w-2xl">
          <p className="mb-6 text-[10px] uppercase tracking-[0.55em] text-[#d8b77a]/60 sm:text-xs">
            The beginning
          </p>

          <h2 className="text-4xl font-light leading-tight tracking-[-0.03em] text-white sm:text-6xl md:text-7xl">
            Some stories
            <br />
            are not meant
            <br />
            to end.
          </h2>

          <div className="my-10 h-px w-20 bg-[#d8b77a]/40" />

          <p className="max-w-lg text-sm leading-8 text-white/45 sm:text-base">
            Every memory leaves a trace.
            <br />
            Every moment becomes part of a story.
          </p>
        </div>
      </div>
    </section>
  );
}