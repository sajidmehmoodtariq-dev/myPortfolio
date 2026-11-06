const segments = {
  toolbox: [
    "M903 0 C903 170 970 270 970 530 S929 825 929 1000",
    "M940 0 C940 180 976 265 976 520 S961 820 961 1000",
  ],
  about: [
    "M929 0 C929 210 966 315 966 565 S916 820 916 1000",
    "M961 0 C961 200 978 340 978 575 S952 830 952 1000",
  ],
  notes: [
    "M916 0 C916 225 968 335 968 570 S937 830 937 1000",
    "M952 0 C952 220 975 340 975 575 S949 830 949 1000",
  ],
  contact: [
    "M937 0 C937 126 968 214 943 337 S860 500 792 500",
    "M949 0 C949 204 980 382 951 582 S877 805 793 805",
  ],
} as const;

export function ClosingSignal({ chapter }: { chapter: keyof typeof segments }) {
  const [wide, compact] = segments[chapter];
  return (
    <svg className="closing-signal" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path className="closing-signal__wide" d={wide} pathLength="1" />
      <path className="closing-signal__compact" d={compact} pathLength="1" />
    </svg>
  );
}
