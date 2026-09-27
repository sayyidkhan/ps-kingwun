import Image from "next/image";
import heroPortrait from "@/assets/kingwun-architectural-hero-v1.png";
import courtyard from "@/assets/architectural-courtyard-v1.png";
import workingPortrait from "@/assets/kingwun-working-portrait-v1.png";
import DecisionBrief from "./decision-brief";
import Motion from "./motion";

const notes = [
  { number: "01", category: "THE VIEWING", title: "Look beyond the first impression.", copy: "A beautiful room is a starting point. Pay attention to how the layout serves your routine, how light moves through the space, and what you would need to change. Write down the questions you cannot answer during the visit.", takeaway: "Bring a short list of essentials. Revisit it after the viewing, while the details are still fresh." },
  { number: "02", category: "THE COMPARISON", title: "Compare what matters to you.", copy: "A useful shortlist uses the same criteria for every option. Put location, condition, space, timing, and your own priorities side by side. Note what is confirmed and what still needs checking.", takeaway: "Separate must-haves from preferences before deciding which trade-offs you can accept." },
  { number: "03", category: "THE CONVERSATION", title: "Prepare before you negotiate.", copy: "Get clear about your priorities and the questions that remain open. Price is one part of a discussion; timing, condition, and other terms may matter too. A clear brief helps keep the conversation focused.", takeaway: "Know what needs to be resolved before you are ready to make a decision." },
];

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <div id="top" />
      <header className="site-header wrap">
        <a className="brand" href="#top" aria-label="King Wun, home">KING WUN<span>PROPERTY · PEOPLE · POSSIBILITY</span></a>
        <nav aria-label="Main navigation"><a href="#about">Meet King Wun</a><a href="#perspective">Perspective</a><a href="#approach">The approach</a></nav>
        <a className="header-link" href="#your-move">Your next move <span aria-hidden="true">↗</span></a>
      </header>
      <main id="main">
        <section className="cinema-hero" aria-labelledby="hero-title">
          <div className="hero-image"><Image src={heroPortrait} alt="AI-styled portrait of King Wun in a contemporary architectural setting" fill preload sizes="100vw" /></div>
          <div className="hero-shade" />
          <div className="cinema-copy wrap">
            <p className="eyebrow hero-enter">REAL ESTATE NEGOTIATOR / SARAWAK + SINGAPORE</p>
            <h1 id="hero-title" className="hero-enter">King Wun<span>.</span></h1>
            <h2 className="hero-enter">A considered approach.<br /><em>A confident next move.</em></h2>
            <p className="hero-intro hero-enter">Property is personal. I bring clear thinking, modern tools, and a human perspective to the decisions that move you forward.</p>
            <div className="hero-actions hero-enter"><a className="button" href="#your-move">Plan your next move <span aria-hidden="true">↗</span></a><a className="text-link" href="#about">Meet King Wun <span aria-hidden="true">↓</span></a></div>
          </div>
          <div className="hero-caption wrap"><a href="#perspective">EXPLORE THE PERSPECTIVE <span aria-hidden="true">↓</span><span className="scroll-line" aria-hidden="true" /></a><span>AI-STYLED EDITORIAL PORTRAIT</span></div>
        </section>
        <div className="chapter-strip wrap"><span>REAL ESTATE, WITH PERSPECTIVE.</span><a href="#perspective">01 / Places</a><a href="#about">02 / People</a><a href="#approach">03 / Process</a><span>SARAWAK ↔ SINGAPORE</span></div>

        <section className="perspective section-pad wrap" id="perspective" aria-labelledby="perspective-title">
          <div className="section-label" data-reveal><span>01 / A SENSE OF PLACE</span><span>LOOK CLOSER.</span></div>
          <div className="section-heading" data-reveal><h2 id="perspective-title">A property is more<br />than <em>an address.</em></h2><p>The light in a room. The rhythm of a neighbourhood. The room to grow. The right questions begin with how you want to live.</p></div>
          <figure className="architecture-feature" data-reveal><div className="photo-frame"><Image src={courtyard} alt="AI-generated concept of a tropical courtyard residence with timber screens and a reflecting pool" sizes="(max-width:700px) 100vw, 90vw" /></div><figcaption><span>Space to see things differently.</span><span>ARCHITECTURAL CONCEPT · AI-GENERATED · NOT A LISTING</span></figcaption></figure>
          <div className="perspective-foot" data-reveal><p>Beautiful spaces start a conversation.<br /><em>Understanding makes it a useful one.</em></p><a className="text-link" href="#notes">Explore the decision notes <span aria-hidden="true">↗</span></a></div>
        </section>

        <section className="about-section section-pad" id="about" aria-labelledby="about-title"><div className="wrap about-grid">
          <figure className="working-photo" data-reveal><div className="photo-frame"><Image src={workingPortrait} alt="AI-styled editorial portrait of King Wun seated with a laptop and architectural plans" sizes="(max-width:700px) 100vw, 48vw" /></div><figcaption>AI-STYLED EDITORIAL PORTRAIT</figcaption></figure>
          <div className="about-copy" data-reveal><p className="eyebrow">02 / MEET KING WUN</p><h2 id="about-title">Warm with people.<br /><em>Sharp on the details.</em></h2><p className="about-lead">A good property conversation starts with listening.</p><p>Your next move carries plans, priorities, and questions. I help bring those into focus, organise the options, and prepare for the conversations ahead.</p><p>I believe modern tools should make the work clearer and the service more personal. Technology supports the process; judgement and relationships guide it.</p><div className="signature-row"><span className="signature">King Wun</span><span>REAL ESTATE NEGOTIATOR<br />SARAWAK + SINGAPORE</span></div><a className="text-link" href="#approach">Inside the approach <span aria-hidden="true">↗</span></a></div>
        </div></section>

        <section className="approach section-pad" id="approach" aria-labelledby="approach-title"><div className="wrap">
          <div className="section-label" data-reveal><span>03 / THE WORK BEHIND THE MOVE</span><span>PEOPLE + TECHNOLOGY + JUDGEMENT</span></div>
          <div className="section-heading" data-reveal><h2 id="approach-title">Better tools.<br /><em>More thoughtful work.</em></h2><p>A business worth building is one that serves people well. My approach starts with a clear brief and keeps the important details in view.</p></div>
          <div className="process-grid">
            <article data-reveal><span className="process-number">01</span><h3>Understand the person.</h3><p>Start with your plans, non-negotiables, and timing. Define what a good move would actually mean for you.</p><span className="process-output">THE OUTPUT / A CLEAR BRIEF</span></article>
            <article data-reveal><span className="process-number">02</span><h3>Organise the picture.</h3><p>Use structured comparisons and modern tools to bring the options together. Keep assumptions separate from confirmed information.</p><span className="process-output">THE OUTPUT / USEFUL COMPARISONS</span></article>
            <article data-reveal><span className="process-number">03</span><h3>Prepare the conversation.</h3><p>Work through the trade-offs and outstanding questions. Enter the negotiation with priorities you understand.</p><span className="process-output">THE OUTPUT / A CONSIDERED POSITION</span></article>
          </div>
        </div></section>

        <section className="notes-section section-pad wrap" id="notes" aria-labelledby="notes-title">
          <div className="section-label" data-reveal><span>04 / DECISION NOTES</span><span>A LITTLE PERSPECTIVE GOES A LONG WAY.</span></div>
          <div className="section-heading" data-reveal><h2 id="notes-title">Before you move,<br /><em>look a little closer.</em></h2><p>Three starting points for a more useful property conversation. Open a note to explore.</p></div>
          <div className="notes-list">{notes.map(note => <details key={note.number} data-reveal><summary><span className="note-number">{note.number}</span><span className="note-title"><small>{note.category}</small>{note.title}</span><span className="note-toggle" aria-hidden="true">+</span></summary><div className="note-body"><p>{note.copy}</p><div><span>TAKE IT WITH YOU</span><p>{note.takeaway}</p></div></div></details>)}</div>
        </section>

        <section className="markets-banner" aria-labelledby="markets-title"><Image src={courtyard} alt="" fill sizes="100vw" /><div className="markets-shade" /><div className="wrap markets-content" data-reveal><p className="eyebrow">SARAWAK ↔ SINGAPORE</p><h2 id="markets-title">Two places.<br /><em>One personal approach.</em></h2><p>Different contexts. Different possibilities.<br />Every conversation begins with yours.</p><a className="text-link" href="#your-move">Bring your plans into focus <span aria-hidden="true">↗</span></a></div></section>

        <section className="brief-section section-pad" id="your-move" aria-labelledby="brief-title"><div className="wrap"><div className="section-label" data-reveal><span>05 / YOUR NEXT MOVE</span><span>START WITH WHAT MATTERS</span></div><div className="brief-layout"><div className="brief-intro" data-reveal><h2 id="brief-title">Let’s start with<br /><em>your next chapter.</em></h2><p>Buying, selling, or still exploring? Organise your priorities in a short brief to take into your next property conversation.</p><span className="brief-aside">THOUGHTFUL QUESTIONS. CLEARER POSSIBILITIES.</span></div><DecisionBrief /></div></div></section>
      </main>
      <footer className="site-footer wrap"><div className="footer-top"><a href="#top" className="footer-name">KING WUN.</a><p>Property. People.<br /><em>Possibility.</em></p><a className="text-link" href="#top">Back to the top <span aria-hidden="true">↑</span></a></div><div className="footer-bottom"><span>REAL ESTATE NEGOTIATOR</span><span>SARAWAK ↔ SINGAPORE</span><span>PORTRAITS AI-STYLED · ARCHITECTURE ILLUSTRATIVE</span></div></footer>
      <Motion />
    </>
  );
}
