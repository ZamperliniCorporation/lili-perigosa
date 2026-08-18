function mulberry32(seed: number) {
  return function random() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeStars(count: number) {
  const random = mulberry32(19);
  return Array.from({ length: count }, () => ({
    top: random() * 100,
    left: random() * 100,
    size: random() * 2 + 0.5,
    delay: random() * 4,
    duration: random() * 3 + 2,
  }));
}

const STARS = makeStars(90);

type NightSkyProps = {
  children?: React.ReactNode;
};

export function NightSky({ children }: NightSkyProps) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[linear-gradient(to_bottom,#070b16,var(--color-night),#1a1038)]">
      {STARS.map((star, index) => (
        <span
          key={index}
          className="absolute rounded-full bg-gold-bright animate-twinkle"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: star.size,
            height: star.size,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_42%,rgba(0,0,0,0.55)_100%)]" />
      {children}
    </div>
  );
}
