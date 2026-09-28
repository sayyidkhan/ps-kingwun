import Image from "next/image";
import heroPortrait from "@/assets/khin-woon-architectural-hero-v1.png";
import courtyard from "@/assets/architectural-courtyard-v1.png";
import workingPortrait from "@/assets/khin-woon-working-portrait-v1.png";
import processListening from "@/assets/process-listening-khin-woon-v2.png";
import processComparison from "@/assets/process-comparison-khin-woon-v2.png";
import processPreparation from "@/assets/process-preparation-khin-woon-v2.png";
import viewingNote from "@/assets/note-viewing-v1.png";
import comparisonNote from "@/assets/note-comparison-v1.png";
import conversationNote from "@/assets/note-conversation-v1.png";
import DecisionBrief from "./decision-brief";
import Motion from "./motion";
import Spatial from "./spatial";
import Signature from "./signature";
import PropertyGallery from "./property-gallery";

const noteImages = [
  { src: viewingNote, alt: "Illustrative home viewing: a buyer checking the layout and daylight with a notebook", caption: "Look at the light, the layout, and everyday life." },
  { src: comparisonNote, alt: "Illustrative side-by-side property plans, photographs and a comparison checklist", caption: "Different homes. The same set of priorities." },
  { src: conversationNote, alt: "Illustrative preparation desk with a notebook, calendar, calculator and floor plan", caption: "Know your priorities before the conversation begins." },
];

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
        <a className="brand" href="#top" aria-label="Khin Woon, home">KHIN WOON<span>PROPERTY · PEOPLE · POSSIBILITY</span></a>
        <nav aria-label="Main navigation"><a href="#about">Meet Khin Woon</a><a href="#perspective">Perspective</a><a href="#approach">The approach</a></nav>
      </header>
      <main id="main">
        <section className="cover-hero" aria-labelledby="hero-title">
          <div className="hero-image"><Image src={heroPortrait} alt="AI-styled portrait of Khin Woon in a contemporary architectural setting" fill preload sizes="100vw" /></div>
          <div className="hero-shade" />
          <div className="cover-intro wrap">
            <p className="eyebrow">REAL ESTATE. HUMAN CONNECTION. FORWARD THINKING.</p>
            <h1 id="hero-title">Think forward.<br /><em>Move with intent.</em></h1>
            <p className="hero-message">Whether you’re taking your first step, making a change, or simply exploring what’s possible, I’m here to listen carefully, bring clarity to the details, and help you move forward with confidence.</p>
            <div className="hero-signature"><Signature /></div>
            <p className="hero-role">REAL ESTATE NEGOTIATOR <span>·</span> SARAWAK ↔ SINGAPORE</p>
            <a className="text-link" href="#your-move">Let’s talk about your next move <span aria-hidden="true">↗</span></a>
          </div>
        </section>
        <section className="chapter-editorial section-pad" id="chapters" aria-labelledby="chapters-title"><div className="wrap">
          <div className="editorial-intro" data-reveal><p className="eyebrow">A DIFFERENT POINT OF VIEW</p><h2 id="chapters-title">Property is the asset.<br /><em>People are the point.</em></h2><p>Clear thinking. Modern tools. A personal approach to the places—and decisions—that shape your life.</p></div>
          <div className="chapter-gallery">
            <a className="chapter-card" href="#perspective" data-reveal><Image src={courtyard} alt="" fill sizes="(max-width:600px) 90vw, 40vw" /><span className="chapter-kicker">01 / THE PLACES</span><span className="chapter-card-title">See beyond<br />the address.<i aria-hidden="true">↗</i></span><span className="chapter-detail">Space, light & the way you live</span></a>
            <a className="chapter-card chapter-person" href="#about" data-reveal><Image src={workingPortrait} alt="" fill sizes="(max-width:600px) 90vw, 32vw" /><span className="chapter-kicker">02 / THE PERSON</span><span className="chapter-card-title">People first.<br />Always.<i aria-hidden="true">↗</i></span><span className="chapter-detail">Meet Khin Woon</span></a>
            <a className="chapter-card chapter-lab" href="#spatial" data-reveal><svg className="chapter-drawing" viewBox="0 0 300 340" fill="none" aria-hidden="true"><path d="M30 210 145 270 270 195 155 140Z M30 150 145 210 270 135 155 80Z M30 150v60m115 0v60m125-135v60M30 100 145 160 270 85 155 30Z M30 100v50m115 10v50m125-125v50"/><path d="m70 172 115-70m-76 91 115-69M68 231l125-74m-85 94 125-75" opacity=".35"/></svg><span className="chapter-kicker">03 / THE POSSIBILITIES</span><span className="chapter-card-title">A new<br />dimension.<i aria-hidden="true">↗</i></span><span className="chapter-detail">Enter the interactive 3D lab</span></a>
          </div>
          <p className="chapter-provenance">EDITORIAL IMAGERY · AI-STYLED PORTRAITS & ILLUSTRATIVE ARCHITECTURE</p>
        </div></section>

        <section className="perspective section-pad wrap" id="perspective" aria-labelledby="perspective-title">
          <div className="section-label" data-reveal><span>01 / A SENSE OF PLACE</span><span>LOOK CLOSER.</span></div>
          <div className="section-heading" data-reveal><h2 id="perspective-title">A property is more<br />than <em>an address.</em></h2><p>The light in a room. The rhythm of a neighbourhood. The room to grow. The right questions begin with how you want to live.</p></div>
          <PropertyGallery />
          <div className="perspective-foot" data-reveal><p>Beautiful spaces start a conversation.<br /><em>Understanding makes it a useful one.</em></p><a className="text-link" href="#notes">Explore the decision notes <span aria-hidden="true">↗</span></a></div>
        </section>

        <section className="about-section section-pad" id="about" aria-labelledby="about-title"><div className="wrap about-grid">
          <figure className="working-photo" data-reveal><div className="photo-frame"><Image src={workingPortrait} alt="AI-styled editorial portrait of Khin Woon seated with a laptop and architectural plans" sizes="(max-width:700px) 100vw, 48vw" /></div><figcaption>AI-STYLED EDITORIAL PORTRAIT</figcaption></figure>
          <div className="about-copy" data-reveal><p className="eyebrow">02 / MEET KHIN WOON</p><h2 id="about-title">Warm with people.<br /><em>Sharp on the details.</em></h2><p className="about-lead">A good property conversation starts with listening.</p><p>Your next move carries plans, priorities, and questions. I help bring those into focus, organise the options, and prepare for the conversations ahead.</p><p>I believe modern tools should make the work clearer and the service more personal. Technology supports the process; judgement and relationships guide it.</p><div className="signature-row"><span className="signature">Khin Woon</span><span className="signature-role">REAL ESTATE NEGOTIATOR<br />SARAWAK + SINGAPORE</span><a className="text-link" href="#approach">Inside the approach <span aria-hidden="true">↗</span></a></div></div>
        </div></section>

        <Spatial />

        <section className="approach section-pad" id="approach" aria-labelledby="approach-title"><div className="wrap">
          <div className="section-label" data-reveal><span>03 / THE WORK BEHIND THE MOVE</span><span>PEOPLE + TECHNOLOGY + JUDGEMENT</span></div>
          <div className="section-heading" data-reveal><h2 id="approach-title">Better tools.<br /><em>More thoughtful work.</em></h2><p>A business worth building is one that serves people well. My approach starts with a clear brief and keeps the important details in view.</p></div>
          <div className="process-grid">
            <article data-reveal><div className="process-photo"><Image src={processListening} alt="Illustrative client consultation: listening to plans and priorities around a table" fill sizes="(max-width:600px) 100vw, 33vw" /><span className="process-number">01</span></div><h3>Understand the person.</h3><p>Start with your plans, non-negotiables, and timing. Define what a good move would actually mean for you.</p><span className="process-output">THE OUTPUT / A CLEAR BRIEF</span></article>
            <article data-reveal><div className="process-photo"><Image src={processComparison} alt="Illustrative workspace with property plans and a laptop for comparing options" fill sizes="(max-width:600px) 100vw, 33vw" /><span className="process-number">02</span></div><h3>Organise the picture.</h3><p>Use structured comparisons and modern tools to bring the options together. Keep assumptions separate from confirmed information.</p><span className="process-output">THE OUTPUT / USEFUL COMPARISONS</span></article>
            <article data-reveal><div className="process-photo"><Image src={processPreparation} alt="Illustrative discussion of a property proposal with notes and a floor plan" fill sizes="(max-width:600px) 100vw, 33vw" /><span className="process-number">03</span></div><h3>Prepare the conversation.</h3><p>Work through the trade-offs and outstanding questions. Enter the negotiation with priorities you understand.</p><span className="process-output">THE OUTPUT / A CONSIDERED POSITION</span></article>
          </div>
        </div></section>

        <section className="notes-section section-pad wrap" id="notes" aria-labelledby="notes-title">
          <div className="section-label" data-reveal><span>04 / DECISION NOTES</span><span>A LITTLE PERSPECTIVE GOES A LONG WAY.</span></div>
          <div className="section-heading" data-reveal><h2 id="notes-title">Before you move,<br /><em>look a little closer.</em></h2><p>Three starting points for a more useful property conversation. Open a note to explore.</p></div>
          <div className="notes-list">{notes.map((note, index) => <details key={note.number} data-reveal><summary><span className="note-number">{note.number}</span><span className="note-title"><small>{note.category}</small>{note.title}</span><span className="note-toggle" aria-hidden="true">+</span></summary><div className="note-body note-body-illustrated"><figure className="note-visual"><div className="note-photo"><Image src={noteImages[index].src} alt={noteImages[index].alt} fill sizes="(max-width:800px) 100vw, 45vw" /></div><figcaption>{noteImages[index].caption}</figcaption></figure><div className="note-explanation"><p>{note.copy}</p><aside className="note-takeaway"><span>TAKE IT WITH YOU</span><p>{note.takeaway}</p></aside></div></div></details>)}</div>
        </section>

        <section className="markets-banner" aria-labelledby="markets-title"><Image src={courtyard} alt="" fill sizes="100vw" /><div className="markets-shade" /><div className="wrap markets-content" data-reveal><p className="eyebrow">SARAWAK ↔ SINGAPORE</p><h2 id="markets-title">Two places.<br /><em>One personal approach.</em></h2><p>Different contexts. Different possibilities.<br />Every conversation begins with yours.</p><a className="text-link" href="#your-move">Bring your plans into focus <span aria-hidden="true">↗</span></a></div></section>

        <section className="brief-section section-pad" id="your-move" aria-labelledby="brief-title"><div className="wrap"><div className="section-label" data-reveal><span>05 / YOUR NEXT MOVE</span><span>START WITH WHAT MATTERS</span></div><div className="brief-layout"><div className="brief-intro" data-reveal><h2 id="brief-title">Let’s start with<br /><em>your next chapter.</em></h2><p>Buying, selling, or still exploring? Share what you have in mind and connect with me directly on WhatsApp. Let’s talk through your options.</p><span className="brief-aside">THOUGHTFUL QUESTIONS. CLEARER POSSIBILITIES.</span></div><DecisionBrief /></div></div></section>
      </main>
      <footer className="site-footer wrap"><div className="footer-top"><div className="footer-identity"><a href="#top" className="footer-name">KHIN WOON.</a><p>Property. People. <em>Possibility.</em></p></div><a className="text-link" href="#top">Back to top <span aria-hidden="true">↑</span></a></div><div className="footer-bottom"><p className="footer-credentials"><span>Real estate negotiator</span><span>Sarawak ↔ Singapore</span></p></div></footer>
      <Motion />
    </>
  );
}
