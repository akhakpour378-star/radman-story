"use client";

type MemoryProgressProps = {
  current: number;
  total: number;
};

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export default function MemoryProgress({
  current,
  total,
}: MemoryProgressProps) {
  const percentage =
    total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="memory-progress">
      <div className="memory-progress__numbers">
        <span>{pad(current)}</span>

        <span className="memory-progress__slash">/</span>

        <span>{pad(total)}</span>
      </div>

      <div className="memory-progress__track">
        <div
          className="memory-progress__fill"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}