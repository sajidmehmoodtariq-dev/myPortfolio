function Schematic() {
  return (
    <svg className="assembly-schematic" viewBox="0 0 280 146" fill="none">
      <g stroke="currentColor" opacity=".33" strokeWidth=".65">
        <path d="M12 72H266M140 8V138" strokeDasharray="3 5" />
        <path d="M50 47 140 12l90 35v53l-90 35-90-35z" />
        <path d="m50 47 90 35 90-35m-90 35v53m0-123v53m-90 35 90-35 90 35" />
        <path d="M40 27h14m-7-7v14m182 89h14m-7-7v14" />
      </g>
      <g stroke="currentColor" strokeWidth="1">
        <path d="m82 57 58-22 58 22-58 23z" fill="#263b30" />
        <path d="m82 67 58 23 58-23v8l-58 23-58-23z" fill="#15261e" />
        <path d="m82 84 58 23 58-23v8l-58 23-58-23z" fill="#15261e" />
        <path d="m108 57 32-12 32 12-32 13z" opacity=".48" />
        <path d="m140 35 37-14h43m-80 94-26 12H74" opacity=".55" />
      </g>
      <g className="schematic-signal">
        <path d="m98 56 42 16 41-16m-41 16v8" stroke="currentColor" />
        <circle cx="98" cy="56" r="2.5" fill="currentColor" />
        <circle cx="181" cy="56" r="2.5" fill="currentColor" />
      </g>
    </svg>
  );
}

export function HeroAssembly() {
  return (
    <div className="assembly-stage" aria-hidden="true">
      <div className="assembly-frame" data-hero-marker>
        <span className="frame-corner frame-corner--tl" />
        <span className="frame-corner frame-corner--tr" />
        <span className="frame-corner frame-corner--bl" />
        <span className="frame-corner frame-corner--br" />
        <span className="assembly-caption"><i /> Fig. 01 <b>/</b> Interface assembly</span>
        <span className="assembly-view">View <b>/</b> AXO</span>
      </div>
      <svg className="assembly-leaders" viewBox="0 0 640 580" preserveAspectRatio="none" data-hero-marker>
        <path d="M65 158h65l54 67m378 119h-39l-50-67M98 429h61l58-46" pathLength="1" />
        <circle cx="184" cy="225" r="3" />
        <circle cx="473" cy="277" r="3" />
        <circle cx="217" cy="383" r="3" />
      </svg>
      <span className="assembly-label assembly-label--one" data-hero-marker><b>01</b> Interface</span>
      <span className="assembly-label assembly-label--two" data-hero-marker><b>02</b> Logic plane</span>
      <span className="assembly-label assembly-label--three" data-hero-marker><b>03</b> Chassis</span>
      <div className="assembly-shadow" />
      <div className="assembly-camera">
        <div className="assembly-rig" data-hero-rig>
          <div className="assembly-layer assembly-layer--base">
            <div className="base-inlay" />
          </div>
          <div className="assembly-layer assembly-layer--back">
            <div className="assembly-face assembly-face--back">
              <div className="back-grid" />
              <span>SMT / EX-01</span>
              <span>CHASSIS</span>
            </div>
          </div>
          <div className="assembly-layer assembly-layer--logic">
            <div className="assembly-face assembly-face--logic">
              <div className="logic-vents" />
              <svg className="logic-traces" viewBox="0 0 300 200" fill="none" stroke="currentColor">
                <path d="M18 43h54l28 28h79l33-33h69M18 64h46l36 36h84l35-35h62M18 156h69l23-22h73l32 32h66M18 177h82l23-23h50l39 39h69" />
                <rect x="119" y="79" width="59" height="51" />
                <circle cx="212" cy="38" r="3" /><circle cx="215" cy="166" r="3" />
              </svg>
            </div>
          </div>
          <div className="assembly-layer assembly-layer--pane">
            <div className="assembly-face assembly-face--pane">
              <span>02</span>
              <span>LOGIC / BUS</span>
            </div>
          </div>
          <div className="assembly-layer assembly-layer--display">
            <div className="assembly-face assembly-face--display">
              <span className="display-screw display-screw--tl" />
              <span className="display-screw display-screw--tr" />
              <span className="display-screw display-screw--bl" />
              <span className="display-screw display-screw--br" />
              <div className="display-screen">
                <div className="display-header"><span>SMT / SYSTEM VIEW</span><span>EX—01</span></div>
                <Schematic />
                <div className="display-footer"><span>ASSEMBLY MAP</span><span>01 / 03</span></div>
              </div>
            </div>
          </div>
          <div className="assembly-layer assembly-layer--cap">
            <div className="cap-inlay" />
          </div>
        </div>
      </div>
    </div>
  );
}
