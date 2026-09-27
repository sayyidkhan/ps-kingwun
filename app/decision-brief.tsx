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
  const [feedback, setFeedback] = useState("");
  const guide = guides[intent];
  async function copyBrief() {
    const text = `My property brief\n\nPlan: ${intent}\nLocation: ${market}\nPriorities: ${notes.trim() || "Still exploring"}\n\nQuestions to discuss:\n${guide.items.map(item => `- ${item}`).join("\n")}`;
    try { await navigator.clipboard.writeText(text); setFeedback("Brief copied. Paste it into your next property conversation."); }
    catch { setFeedback("Copy is unavailable in this browser. You can select your notes and copy them manually."); }
  }
  return <div className="decision-brief">
    <div className="brief-card-top"><span>YOUR PROPERTY BRIEF</span><span aria-hidden="true">↗</span></div>
    <fieldset><legend>I’m thinking about…</legend><div className="intent-options">{(Object.keys(guides) as Intent[]).map(option => <button type="button" key={option} aria-pressed={intent === option} onClick={() => { setIntent(option); setFeedback(""); }}>{option}<span aria-hidden="true">{intent === option ? "↗" : "+"}</span></button>)}</div></fieldset>
    <label className="market-select">The place<select value={market} onChange={event => { setMarket(event.target.value); setFeedback(""); }}><option>Sarawak</option><option>Singapore</option><option>Considering both</option></select></label>
    <div className="brief-guidance" aria-live="polite"><h3>{guide.title}</h3><ul>{guide.items.map(item => <li key={item}>{item}</li>)}</ul></div>
    <label className="notes-label" htmlFor="priorities">What matters most to you? <span>Optional</span></label><textarea id="priorities" maxLength={1500} value={notes} onChange={event => { setNotes(event.target.value); setFeedback(""); }} placeholder="A shorter commute, more space, a fresh start…" rows={3} />
    <button type="button" className="button copy-button" onClick={copyBrief}>Copy my conversation brief <span aria-hidden="true">↗</span></button>
    <p className="brief-privacy" role="status">{feedback || "For your own reference. Nothing is submitted or stored."}</p>
  </div>;
}
