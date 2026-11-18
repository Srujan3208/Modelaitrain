"use client";

import { useState } from "react";

const navItems = [
  ["dashboard","⌂","Dashboard"],["learn","▷","Learn from Video"],["knowledge","▱","Knowledge Base"],
  ["chat","☏","AI Chat"],["summaries","▤","Summaries"],["sources","♧","Learning Sources"],
  ["history","◷","History"],["profile","♙","Profile"],["settings","⚙","Settings"]
];
const prompts = ["Explain CPU scheduling","Summarize OS in brief","Difference between FCFS and SJF","Give examples from my videos"];

export default function Home(){
  const [active,setActive]=useState("chat");
  const [question,setQuestion]=useState("");
  const [messages,setMessages]=useState([]);
  const [showSources,setShowSources]=useState(false);
  const [showAdd,setShowAdd]=useState(false);
  const [url,setUrl]=useState("");
  const [toast,setToast]=useState("");
  const title=navItems.find(x=>x[0]===active)?.[2]||"Dashboard";
  function notify(s){setToast(s);setTimeout(()=>setToast(""),2600)}
  function send(e){e?.preventDefault();if(!question.trim())return;setMessages(v=>[...v,{role:"user",text:question.trim()},{role:"assistant",text:"I’m ready to answer using your learned videos and knowledge base. Connect the TREAN AI learning backend to enable source-grounded AI answers."}]);setQuestion("")}
  function add(e){e.preventDefault();setShowAdd(false);setUrl("");notify("Video added to your learning queue (demo).")}
  return <main className="app-shell">
    <aside className="sidebar">
      <button className="brand" onClick={()=>setActive("dashboard")}><img src="/trean-logo.svg" alt="TREAN AI logo"/><span><b>TREAN <i>AI</i></b><small>Persistent Learning Agent</small></span></button>
      <nav className="side-nav">{navItems.map(([id,icon,label],i)=><button key={id} className={active===id?"nav-link selected":i===7?"nav-link nav-divider":"nav-link"} onClick={()=>setActive(id)}><span className="nav-glyph">{icon}</span>{label}</button>)}</nav>
      <div className="pro-card"><div className="pro-heading"><span>♛</span> TREAN Pro</div><p>Unlock higher limits,<br/> longer videos &amp; more</p><button onClick={()=>notify("TREAN Pro plans coming soon.")}>Upgrade <b>→</b></button></div>
    </aside>
    <section className="main-panel">
      <header className="topbar"><div className="page-heading">{active!=="dashboard"&&<button className="back-btn" onClick={()=>setActive("dashboard")}>←</button>}<b>{title}</b></div><div className="top-right"><button className="bell" aria-label="Notifications">♧<i/></button><button className="user-bubble" onClick={()=>setActive("profile")}>S</button></div></header>
      <div className={"page-body "+(active==="chat"?"chat-body":"")}>
        {active==="chat"&&<><button className="sources-button" onClick={()=>setShowSources(!showSources)}>▱ <span>Sources</span></button>
          <section className="chat-hero">
            <div className="robot-halo"><svg viewBox="0 0 180 160" role="img" aria-label="TREAN AI robot mascot"><defs><linearGradient id="helmet" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff"/><stop offset=".42" stopColor="#d9caff"/><stop offset="1" stopColor="#8050f4"/></linearGradient><linearGradient id="ear" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#c5a8ff"/><stop offset="1" stopColor="#6427d9"/></linearGradient></defs><ellipse cx="90" cy="83" rx="62" ry="59" fill="none" stroke="#a84bff" strokeWidth="2" opacity=".6"/><rect x="20" y="61" width="20" height="45" rx="10" fill="url(#ear)"/><rect x="140" y="61" width="20" height="45" rx="10" fill="url(#ear)"/><path d="M43 75 Q45 22 90 20 Q135 22 137 75 L132 111 Q124 137 90 139 Q56 137 48 111Z" fill="url(#helmet)" stroke="#d5b9ff" strokeWidth="3"/><rect x="45" y="57" width="90" height="63" rx="27" fill="#17102e" stroke="#a77bff" strokeWidth="3"/><path d="M67 83 Q75 70 83 83 M98 83 Q106 70 114 83" fill="none" stroke="#d9b9ff" strokeWidth="4" strokeLinecap="round"/><path d="M78 99 Q90 110 102 99" fill="none" stroke="#d9b9ff" strokeWidth="4" strokeLinecap="round"/><path d="M71 40 Q90 31 109 40" fill="none" stroke="#fff" strokeWidth="4" opacity=".7" strokeLinecap="round"/></svg></div>
            <h1>Chat with TREAN <em>AI</em></h1><p>Ask anything from your learned videos, notes, and knowledge base.</p>
          </section>
          <section className="feature-row"><article className="feature-card"><span className="feature-icon youtube">▶</span><div><b>From Your Videos</b><p>Get answers from processed<br/> YouTube videos</p></div></article><article className="feature-card"><span className="feature-icon doc">▤</span><div><b>Source-Grounded</b><p>See exact video &amp; timestamp<br/> references</p></div></article><article className="feature-card"><span className="feature-icon bolt">ϟ</span><div><b>Learn Deeper</b><p>Understand concepts, examples,<br/> and explanations</p></div></article></section>
          {messages.length>0&&<div className="conversation">{messages.map((m,i)=><div className={"bubble "+m.role} key={i}><small>{m.role==="assistant"?"TREAN AI":"YOU"}</small><p>{m.text}</p></div>)}</div>}
          <form className="chat-input-panel" onSubmit={send}><textarea value={question} onChange={e=>setQuestion(e.target.value)} placeholder="Ask a question about your learned content..." rows={2}/><div className="chat-tools"><div><button type="button" className="tool-pill" onClick={()=>notify("File attachment will be enabled with backend integration.")}>♧ <span>Attach</span></button><button type="button" className="tool-pill" onClick={()=>setShowSources(!showSources)}>▣ <span>Knowledge</span>⌄</button></div><button type="submit" className="send-button" aria-label="Send question">➤</button></div></form>
          {showSources&&<div className="source-popover"><b>Your knowledge sources</b><p>No processed videos yet. Add a YouTube video to start building your knowledge base.</p><button onClick={()=>setShowAdd(true)}>＋ Add a video</button></div>}
          <div className="try-asking"><b>Try asking</b><div>{prompts.map(p=><button key={p} onClick={()=>setQuestion(p)}>{p}</button>)}</div></div>
        </>}
        {active!=="chat"&&<section className="other-page"><div className="eyebrow">YOUR PERSONAL LEARNING SPACE</div><h1>{title==="Dashboard"?"Welcome back, Srujan":title}</h1><p className="other-sub">{({dashboard:"Continue your learning journey and build your personal knowledge space.",learn:"Turn YouTube videos and playlists into structured knowledge.",knowledge:"Your searchable library of everything you have learned.",summaries:"AI-generated summaries and key takeaways from your videos.",sources:"All your video sources, playlists, and references in one place.",history:"Track your recent learning activity and processed content.",profile:"Manage your account and learning preferences.",settings:"Customize your TREAN AI experience."})[active]}</p>
          {active==="learn"&&<div className="upload-panel"><div className="upload-symbol">▷</div><h2>Learn from any YouTube video</h2><p>Paste a video or playlist link to add it to your learning space.</p><button className="gradient-action" onClick={()=>setShowAdd(true)}>Paste YouTube URL <span>Process &amp; Learn →</span></button></div>}
          {active==="dashboard"&&<><div className="metric-row"><div><b>28</b><span>Videos</span></div><div><b>3,742</b><span>Knowledge</span></div><div><b>18.4 hrs</b><span>Learning Time</span></div><div><b>12</b><span>Topics</span></div></div><div className="section-title">Continue Your Learning</div><div className="dashboard-grid"><div className="dashboard-tile"><span>▶</span><b>Operating Systems – Introduction</b><small>Video lesson · 42:17</small></div><div className="dashboard-tile"><span>▤</span><b>CPU Scheduling Algorithms</b><small>Summary and key concepts</small></div><div className="dashboard-tile"><span>✧</span><b>Ask TREAN AI</b><small>Ask anything from your videos</small><button onClick={()=>setActive("chat")}>Open AI Chat →</button></div></div></>}
          {active==="knowledge"&&<div className="empty-panel"><span>▱</span><h2>Your knowledge base</h2><p>Processed video transcripts, concepts and searchable learning notes will appear here.</p><button className="gradient-action" onClick={()=>setActive("learn")}>Add your first video →</button></div>}
          {active==="summaries"&&<div className="empty-panel"><span>▤</span><h2>Video summaries</h2><p>Your generated summaries, key concepts and revision notes will appear here.</p></div>}
          {active==="sources"&&<div className="empty-panel"><span>♧</span><h2>Your learning sources</h2><p>YouTube videos and playlists you process will be collected here.</p><button className="gradient-action" onClick={()=>setActive("learn")}>Add a source →</button></div>}
          {active==="history"&&<div className="empty-panel"><span>◷</span><h2>Your learning history</h2><p>Your recent learning activity will appear here.</p></div>}
          {active==="profile"&&<div className="empty-panel"><span className="profile-large">S</span><h2>Srujan</h2><p>Personal learning workspace</p></div>}
          {active==="settings"&&<div className="empty-panel"><span>⚙</span><h2>Settings</h2><p>Account, preferences, integrations and AI model settings.</p></div>}
        </section>}
      </div>
    </section>
    {showAdd&&<div className="modal-shade" onClick={()=>setShowAdd(false)}><form className="add-modal" onSubmit={add} onClick={e=>e.stopPropagation()}><button type="button" className="close-modal" onClick={()=>setShowAdd(false)}>×</button><div className="eyebrow">GROW YOUR KNOWLEDGE</div><h2>Add a YouTube video</h2><p>Paste a public YouTube video or playlist URL.</p><input type="url" required value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..."/><button className="gradient-action" type="submit">Process &amp; Learn →</button><small>Processing requires the learning backend.</small></form></div>}
    {toast&&<div className="toast">{toast}</div>}
  </main>
}
