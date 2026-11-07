import { Storyboard } from "../components/storyboard";

const chapters = [
  { id: "arrival", name: "Arrival", time: 0 },
  { id: "disassembly", name: "Disassembly", time: 0.5 },
  { id: "transformation", name: "Transformation", time: 0.96 },
];

export default function Home() {
  return (
    <Storyboard chapters={chapters}>
      <section id="arrival" className="chapter chapter--arrival" aria-labelledby="arrival-title">
        <p className="eyebrow"><span /> SAJID MEHMOOD TARIQ</p>
        <h1 id="arrival-title">
          <span>I build things</span>
          <span>that work</span>
          <span className="quiet">beautifully.</span>
        </h1>
        <p className="role">Software Engineer <b>·</b> Full-Stack Developer <b>·</b> AI/ML</p>
        <p className="lede">Building thoughtful digital products, intelligent systems, and tools for the people who use them.</p>
        <a className="chapter-link" href="#disassembly"><span aria-hidden="true">↓</span> Explore the assembly</a>
      </section>
      <section id="disassembly" className="chapter chapter--disassembly" aria-labelledby="disassembly-title">
        <p className="eyebrow"><span /> 02 / INSIDE THE CORE</p>
        <h2 id="disassembly-title">Every system<br />has a <em>story.</em></h2>
        <p className="lede">From computer science fundamentals to software built for real users.</p>
        <ul className="parts">
          <li><span>01</span> Ceramic cover</li>
          <li><span>02</span> Optical interface</li>
          <li><span>03</span> Precision bezel</li>
          <li><span>04</span> Logic assembly</li>
          <li><span>05</span> Aluminum chassis</li>
        </ul>
        <a className="chapter-link" href="#transformation"><span aria-hidden="true">↓</span> See the transformation</a>
      </section>
      <section id="transformation" className="chapter chapter--transformation" aria-labelledby="transformation-title">
        <p className="eyebrow"><span /> 03 / SYSTEMS IN PRACTICE</p>
        <h2 id="transformation-title">Built beyond<br />the <em>classroom.</em></h2>
        <div className="project-summary">
          <p className="project-id">PGC-DHA</p>
          <p className="role">Institutional Management System</p>
          <p className="lede">Admissions, student management, role-based access, and reporting.</p>
          <p className="project-note">Technical visualization · No institutional records</p>
        </div>
        <a className="chapter-link" href="#arrival"><span aria-hidden="true">↑</span> Back to arrival</a>
      </section>
    </Storyboard>
  );
}
