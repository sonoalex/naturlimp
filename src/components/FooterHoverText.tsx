import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function FooterHoverText({ text }: { text: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPos, setMaskPos] = useState({ cx: '50%', cy: '50%' });

  useEffect(() => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    setMaskPos({
      cx: `${((cursor.x - rect.left) / rect.width) * 100}%`,
      cy: `${((cursor.y - rect.top) / rect.height) * 100}%`,
    });
  }, [cursor]);

  const base = {
    x: '50%' as const,
    y: '50%' as const,
    textAnchor: 'middle' as const,
    dominantBaseline: 'middle' as const,
    strokeWidth: '0.35',
    fontSize: '72',
    textLength: '285',
    lengthAdjust: 'spacingAndGlyphs' as const,
    style: { fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 },
  };

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 300 100"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={e => setCursor({ x: e.clientX, y: e.clientY })}
      className="select-none cursor-default"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="nl-col" x1="0%" y1="0%" x2="100%" y2="0%">
          {hovered && (
            <>
              <stop offset="0%"   stopColor="#dcfce7" />
              <stop offset="28%"  stopColor="#16a34a" />
              <stop offset="55%"  stopColor="#22d3ee" />
              <stop offset="80%"  stopColor="#86efac" />
              <stop offset="100%" stopColor="#a3e635" />
            </>
          )}
        </linearGradient>

        <radialGradient
          id="nl-reveal"
          gradientUnits="userSpaceOnUse"
          r="28%"
          cx={maskPos.cx}
          cy={maskPos.cy}
        >
          <stop offset="0%"   stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </radialGradient>

        <mask id="nl-mask">
          <rect x="0" y="0" width="100%" height="100%" fill="url(#nl-reveal)" />
        </mask>
      </defs>

      {/* Faint outline that appears on hover */}
      <text
        {...base}
        fill="transparent"
        stroke="rgba(255,255,255,0.07)"
        style={{ ...base.style, opacity: hovered ? 1 : 0, transition: 'opacity 0.25s' }}
      >
        {text}
      </text>

      {/* Stroke-draw animation on mount */}
      <motion.text
        {...base}
        fill="transparent"
        stroke="#16a34a"
        strokeOpacity={0.35}
        initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
        animate={{ strokeDashoffset: 0, strokeDasharray: 1000 }}
        transition={{ duration: 4, ease: 'easeInOut' }}
      >
        {text}
      </motion.text>

      {/* Cursor-following gradient reveal */}
      <text
        {...base}
        fill="transparent"
        stroke="url(#nl-col)"
        strokeWidth="0.55"
        mask="url(#nl-mask)"
      >
        {text}
      </text>
    </svg>
  );
}
