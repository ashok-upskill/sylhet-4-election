import { cn } from "@/lib/utils";

interface ShaplaIconProps {
  className?: string;
  variant?: "default" | "white" | "colored";
}

export function ShaplaIcon({ className, variant = "default" }: ShaplaIconProps) {
  const colors = {
    default: {
      petal1: "#066732",
      petal2: "#de2627",
      center: "#fbbf24",
    },
    white: {
      petal1: "#ffffff",
      petal2: "#ffffff",
      center: "#fbbf24",
    },
    colored: {
      petal1: "#066732",
      petal2: "#de2627",
      center: "#fbbf24",
    },
  };

  const { petal1, petal2, center } = colors[variant];

  return (
    <svg viewBox="0 0 100 100" className={cn("w-8 h-8", className)}>
      <g transform="translate(50,50)">
        <ellipse rx="15" ry="30" fill={petal1} transform="rotate(0)" />
        <ellipse rx="15" ry="30" fill={petal2} transform="rotate(72)" />
        <ellipse rx="15" ry="30" fill={petal1} transform="rotate(144)" />
        <ellipse rx="15" ry="30" fill={petal2} transform="rotate(216)" />
        <ellipse rx="15" ry="30" fill={petal1} transform="rotate(288)" />
        <circle r="10" fill={center} />
      </g>
    </svg>
  );
}

// Large decorative version for splash/hero
export function ShaplaIconLarge({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={cn("w-32 h-32", className)}>
      <defs>
        <radialGradient id="petalGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style={{ stopColor: "#ffffff" }} />
          <stop offset="100%" style={{ stopColor: "#fce7f3" }} />
        </radialGradient>
        <radialGradient id="centerGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style={{ stopColor: "#fbbf24" }} />
          <stop offset="100%" style={{ stopColor: "#f59e0b" }} />
        </radialGradient>
      </defs>
      <g transform="translate(100,100)">
        <ellipse rx="35" ry="60" fill="url(#petalGrad)" transform="rotate(0)" />
        <ellipse rx="35" ry="60" fill="url(#petalGrad)" transform="rotate(72)" />
        <ellipse rx="35" ry="60" fill="url(#petalGrad)" transform="rotate(144)" />
        <ellipse rx="35" ry="60" fill="url(#petalGrad)" transform="rotate(216)" />
        <ellipse rx="35" ry="60" fill="url(#petalGrad)" transform="rotate(288)" />
        <circle r="25" fill="url(#centerGrad)" />
      </g>
    </svg>
  );
}