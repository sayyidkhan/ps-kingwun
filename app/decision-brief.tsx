"use client";

import { useState } from "react";

const guides = {
  Buying: { title: "Find a place that fits your life.", items: ["What must the property make possible for you?", "Which features are essential, and which are flexible?", "What timing and budget boundaries will guide the search?"] },
  Selling: { title: "Get clear before going to market.", items: ["What would a successful sale allow you to do next?", "How much flexibility do you have on timing?", "What do you need to understand before setting your expectations?"] },
  Exploring: { title: "You don’t need every answer yet.", items: ["What is prompting you to consider a move?", "Which locations or possibilities interest you?", "What information would help you decide on a next step?"] },
};
type Intent = keyof typeof guides;

export default function DecisionBrief() {
  const [intent, setIntent] = useState<Intent>("Buying");
  const [market, setMarket] = useState("Sarawak");
  const [notes, setNotes] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [propertyType, setPropertyType] = useState("Not sure yet");
  const [timeframe, setTimeframe] = useState("Just exploring");
  const guide = guides[intent];
  const message = `Hi King Wun, I’m ${name.trim()}. I’d like to find out more about my property options.${phone.trim() ? `\nPhone: ${phone.trim()}` : ""}${email.trim() ? `\nEmail: ${email.trim()}` : ""}\n\nI’m interested in: ${intent}\nLocation: ${market}\nProperty type: ${propertyType}\nTimeframe: ${timeframe}${notes.trim() ? `\n\nMy priorities / questions:\n${notes.trim()}` : ""}\n\nCould we chat about the next steps?`;
  return <form className="decision-brief" action="https://wa.me/60143015319" method="get" target="_blank" rel="noopener noreferrer" aria-label="Property enquiry">
    <input type="hidden" name="text" value={message} />
    <div className="brief-card-top"><span>CONNECT WITH KING WUN</span><span aria-hidden="true">↗</span></div>
    <fieldset className="enquiry-details"><legend>Your details</legend>
      <div className="enquiry-fields">
        <label className="enquiry-field enquiry-wide" htmlFor="enquiry-name">Full name <span>Required</span><input id="enquiry-name" autoComplete="name" required pattern={".*\\S.*"} title="Please enter your name." maxLength={100} value={name} onChange={event => setName(event.target.value)} placeholder="How should I address you?" /></label>
        <label className="enquiry-field" htmlFor="enquiry-phone">Phone number <span>Optional</span><input id="enquiry-phone" type="tel" autoComplete="tel" maxLength={40} value={phone} onChange={event => setPhone(event.target.value)} placeholder="Include country code" /></label>
        <label className="enquiry-field" htmlFor="enquiry-email">Email address <span>Optional</span><input id="enquiry-email" type="email" autoComplete="email" maxLength={254} value={email} onChange={event => setEmail(event.target.value)} placeholder="you@example.com" /></label>
      </div>
    </fieldset>
    <fieldset><legend>I’m thinking about…</legend><div className="intent-options">{(Object.keys(guides) as Intent[]).map(option => <button type="button" key={option} aria-pressed={intent === option} onClick={() => setIntent(option)}>{option}<span aria-hidden="true">{intent === option ? "↗" : "+"}</span></button>)}</div></fieldset>
    <label className="market-select">The place<select value={market} onChange={event => setMarket(event.target.value)}><option>Sarawak</option><option>Singapore</option><option>Considering both</option></select></label>
    <div className="enquiry-fields enquiry-property">
      <label className="enquiry-field" htmlFor="enquiry-property">Property type<select id="enquiry-property" value={propertyType} onChange={event => setPropertyType(event.target.value)}><option>Not sure yet</option><option>Bungalow</option><option>Semi-D</option><option>Double-storey</option><option>Apartment / Condo</option><option>Other</option></select></label>
      <label className="enquiry-field" htmlFor="enquiry-timeframe">Timeframe<select id="enquiry-timeframe" value={timeframe} onChange={event => setTimeframe(event.target.value)}><option>Just exploring</option><option>Within 3 months</option><option>3–6 months</option><option>6–12 months</option><option>More than a year</option></select></label>
    </div>
    <div className="brief-guidance enquiry-guidance" aria-live="polite"><h3>{guide.title}</h3></div>
    <label className="notes-label" htmlFor="priorities">What would you like to discuss? <span>Optional</span></label><textarea id="priorities" maxLength={1500} value={notes} onChange={event => setNotes(event.target.value)} placeholder="Tell King Wun about your preferred home, budget, timing or questions…" rows={3} />
    <button type="submit" className="button whatsapp-button" aria-describedby="whatsapp-hint">Chat with King Wun on WhatsApp <span aria-hidden="true">↗</span></button>
    <p className="brief-contact-hint" id="whatsapp-hint">Your details will be included in WhatsApp. Review your message before sending.</p>
    <p className="brief-contact-number">Prefer a call? <a href="tel:+60143015319">+60 14-301 5319</a></p>
  </form>;
}
