type QueueAvatarProps = {
  label: string;
  tone?: "slate" | "amber" | "emerald" | "blue" | "violet";
  animated?: boolean;
  large?: boolean;
};

export function QueueAvatar({
  label,
  tone = "slate",
  animated = false,
  large = false,
}: QueueAvatarProps) {
  const toneClass =
    tone === "amber"
      ? "bg-amber-500 text-white"
      : tone === "emerald"
      ? "bg-emerald-500 text-white"
      : tone === "blue"
      ? "bg-blue-600 text-white"
      : tone === "violet"
      ? "bg-violet-600 text-white"
      : "bg-slate-900 text-white";

  const sizeClass = large ? "h-16 w-16 text-base" : "h-12 w-12 text-sm";
  const animateClass = animated ? "animate-bounce" : "";

  return (
    <div
      className={`flex items-center justify-center rounded-2xl font-bold shadow-sm ring-4 ring-white ${toneClass} ${sizeClass} ${animateClass}`}
    >
      {label}
    </div>
  );
}