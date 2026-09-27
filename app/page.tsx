import Image from "next/image";
import casualPortrait from "@/assets/kingwun-casual-portrait-transparent.png";
import formalPortrait from "@/assets/kingwun-formal-portrait-transparent.png";

const operatingPrinciples = [
  { number: "01", title: "Read the situation.", copy: "Start with your goals, constraints, timing, and the market context around the move." },
  { number: "02", title: "Reduce the noise.", copy: "Compare the details that matter so the strongest option becomes easier to recognise." },
  { number: "03", title: "Strengthen the position.", copy: "Enter every conversation knowing what matters, where there is room, and when to move." },
];

const technologySteps = [
  { label: "MARKET SIGNALS", title: "See the context.", copy: "Organise market information into a view that supports the decision in front of you.", icon: "pulse" },
  { label: "OPTION MAP", title: "Compare clearly.", copy: "Put price, priorities, trade-offs, and timing side by side before committing to a move.", icon: "grid" },
  { label: "NEGOTIATION BRIEF", title: "Move deliberately.", copy: "Translate the analysis into a clear position for the conversation and the terms ahead.", icon: "arrow" },
];

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>

      <header className="site-header">
        <a className="brand" href="#main" aria-label="King Wun, back to top">
          <span className="brand-symbol" aria-hidden="true">KW</span>
          <span className="brand-name">KING WUN<small>PROPERTY OPERATOR</small></span>
        </a>
        <nav className="site-nav" aria-label="Main navigation">
          <a href="#method">The method</a>
          <a href="#markets">The markets</a>
          <a href="#profile">About</a>
        </nav>
        <a className="header-cta" href="#method">See how he works <span aria-hidden="true">↗</span></a>
      </header>

      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="status-line"><span className="status-dot" aria-hidden="true" />REAL ESTATE NEGOTIATOR · TECH-ENABLED PROPERTY OPERATOR</div>
            <h1 id="hero-title">Property moves,<span>made smarter.</span></h1>
            <p className="hero-lead">King Wun combines market context, structured thinking, and strong negotiation to help clients move with greater clarity across Sarawak and Singapore.</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#method">Explore the process <span aria-hidden="true">↗</span></a>
              <a className="button button-secondary" href="#profile">Meet King Wun</a>
            </div>
            <p className="hero-note"><span aria-hidden="true">◆</span> High-tech process. High-touch service.</p>
          </div>

          <div className="hero-visual" aria-label="Portrait of King Wun">
            <div className="visual-grid" aria-hidden="true" />
            <div className="portrait-frame">
              <Image src={casualPortrait} alt="King Wun smiling in a black jacket" priority sizes="(max-width: 760px) 100vw, 48vw" />
            </div>
            <div className="portrait-label portrait-label-top"><span>BASED ACROSS</span><strong>SARAWAK · SINGAPORE</strong></div>
            <div className="portrait-label portrait-label-bottom"><span>THE OPERATING EDGE</span><strong>CONTEXT · CLARITY · POSITION</strong></div>
            <span className="visual-index" aria-hidden="true">KW / 01</span>
          </div>

          <div className="hero-system" aria-label="King Wun's operating system">
            <span className="system-title">THE PROPERTY OPERATING SYSTEM</span>
            <div><b>01</b><span>Market<br />context</span></div>
            <div><b>02</b><span>Decision<br />clarity</span></div>
            <div><b>03</b><span>Negotiation<br />position</span></div>
          </div>
        </section>

        <section className="intro-section section" id="method" aria-labelledby="method-title">
          <div className="section-kicker"><span>01</span> THE METHOD</div>
          <div className="intro-heading">
            <h2 id="method-title">The best negotiation starts <em>before the offer.</em></h2>
            <p>A property decision becomes stronger when the information is organised, the trade-offs are visible, and the position is clear. King Wun brings structure to that work before the pressure arrives.</p>
          </div>
          <div className="principle-grid">
            {operatingPrinciples.map((principle) => (
              <article className="principle-card" key={principle.number}>
                <span>{principle.number}</span>
                <div><h3>{principle.title}</h3><p>{principle.copy}</p></div>
                <i aria-hidden="true">↗</i>
              </article>
            ))}
          </div>
        </section>

        <section className="technology-section" aria-labelledby="technology-title">
          <div className="technology-intro">
            <div className="section-kicker section-kicker-light"><span>02</span> TECHNOLOGY + JUDGEMENT</div>
            <h2 id="technology-title">Use technology to remove noise—not the human judgement.</h2>
            <p>Tools should make the conversation sharper. The value still comes from understanding the person, the property, and the decision that connects them.</p>
          </div>
          <div className="technology-grid">
            {technologySteps.map((step, index) => (
              <article className="technology-card" key={step.label}>
                <div className={`tech-graphic tech-${step.icon}`} aria-hidden="true"><span /><span /><span /></div>
                <div className="technology-card-copy">
                  <span>{String(index + 1).padStart(2, "0")} / {step.label}</span>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="markets-section section" id="markets" aria-labelledby="markets-title">
          <div className="section-kicker"><span>03</span> TWO MARKETS</div>
          <div className="markets-heading">
            <h2 id="markets-title">Two contexts.<br /><em>One clear standard.</em></h2>
            <p>Every market has its own rhythm. The standard stays the same: understand what matters, ask better questions, and negotiate from a position you can explain.</p>
          </div>
          <div className="market-panels">
            <article className="market-panel market-sarawak">
              <span className="market-code">SRWK / 01</span>
              <div className="market-orbit" aria-hidden="true"><span>S</span></div>
              <div><h3>Sarawak</h3><p>Local context, long-term thinking, and room to understand the opportunity behind the property.</p></div>
            </article>
            <article className="market-panel market-singapore">
              <span className="market-code">SG / 02</span>
              <div className="market-signal" aria-hidden="true"><i /><i /><i /><i /></div>
              <div><h3>Singapore</h3><p>Structured comparison and precise decision-making in a market where details and timing matter.</p></div>
            </article>
          </div>
        </section>

        <section className="profile-section section" id="profile" aria-labelledby="profile-title">
          <div className="profile-visual">
            <span className="profile-stamp">KW / PROFILE 001</span>
            <Image src={formalPortrait} alt="King Wun in a dark suit and blue tie" sizes="(max-width: 760px) 100vw, 42vw" />
            <div className="profile-quote">Warm with people.<br /><strong>Sharp with the deal.</strong></div>
          </div>
          <div className="profile-copy">
            <div className="section-kicker"><span>04</span> MEET KING WUN</div>
            <h2 id="profile-title">A modern operator for a very human decision.</h2>
            <p className="profile-lead">Property is never just a transaction. It carries priorities, pressure, timing, and consequences. King Wun&apos;s role is to make that complexity easier to navigate.</p>
            <p>His approach combines an analytical process with direct, personal conversation—using technology where it creates clarity and judgement where experience matters most.</p>
            <div className="profile-values">
              <div><span>01</span><strong>Approachable with clients</strong></div>
              <div><span>02</span><strong>Rigorous with information</strong></div>
              <div><span>03</span><strong>Deliberate at the table</strong></div>
            </div>
            <a className="text-link" href="#method">See the operating method <span aria-hidden="true">↗</span></a>
          </div>
        </section>

        <section className="closing-section" aria-labelledby="closing-title">
          <span className="closing-label">THE NEXT MOVE STARTS WITH A BETTER QUESTION.</span>
          <h2 id="closing-title">Make the decision clear.<br /><span>Then make it count.</span></h2>
          <a className="button button-light" href="#method">Explore how King Wun works <span aria-hidden="true">↗</span></a>
          <div className="closing-meta"><span>REAL ESTATE NEGOTIATOR</span><span>SARAWAK · SINGAPORE</span><span>TECHNOLOGY · NEGOTIATION · SERVICE</span></div>
        </section>
      </main>

      <footer className="site-footer">
        <a className="footer-brand" href="#main">KING WUN<span>↗</span></a>
        <p>Property moves, made smarter.</p>
        <a href="#main">Back to top ↑</a>
      </footer>
    </>
  );
}
