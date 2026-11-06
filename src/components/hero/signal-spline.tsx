type SignalSplineProps = {
  desktop: string;
  mobile: string;
  layer: "front" | "handoff";
  motion?: "entrance" | "scroll";
};

export function SignalSpline({ desktop, mobile, layer, motion }: SignalSplineProps) {
  return (
    <svg
      className={`signal-spline signal-spline--${layer}`}
      viewBox="0 0 1000 1000"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path className="signal-spline__desktop" d={desktop} pathLength="1" data-signal={motion} />
      <path className="signal-spline__mobile" d={mobile} pathLength="1" data-signal={motion} />
    </svg>
  );
}
