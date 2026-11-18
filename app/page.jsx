"use client";

import { useState } from "react";

const navItems = [
  ["dashboard","⌂","Dashboard"],["learn","▷","Learn from Video"],["knowledge","▱","Knowledge Base"],
  ["chat","☏","AI Chat"],["summaries","▤","Summaries"],["sources","♧","Learning Sources"],
  ["history","◷","History"],["profile","♙","Profile"],["settings","⚙","Settings"]
];

export default function Home(){
  const [active,setActive]=useState("chat");
  const [question,setQuestion]=useState("");
  const [showSources,setShowSources]=useState(false);
  const [showAdd,setShowAdd]=useState(false);
  const [url,setUrl]=useState("");
  const [showMore,setShowMore]=useState(false);
  const title=navItems.find(x=>x[0]===active)?.[2]||"Dashboard";
  function add(e){e.preventDefault();setShowAdd(false);setUrl("");}
  return <main className="app-shell">
    <aside className="sidebar">
      <button className="brand" onClick={()=>setActive("dashboard")}><img src="/trean-logo.svg" alt="TREAN AI logo"/><span><b>TREAN <i>AI</i></b><small>Persistent Learning Agent</small></span></button>
      <nav className="side-nav">{navItems.map(([id,icon,label],i)=><button key={id} className={active===id?"nav-link selected":i===7?"nav-link nav-divider":"nav-link"} onClick={()=>setActive(id)}><span className="nav-glyph">{icon}</span>{label}</button>)}</nav>
    </aside>
    <section className="main-panel">
      <header className="topbar"><button className="mobile-brand" onClick={()=>setActive("dashboard")}><img src="/trean-logo.svg" alt="TREAN AI"/><span>TREAN <i>AI</i></span></button><div className="page-heading">{active!=="dashboard"&&<button className="back-btn" onClick={()=>setActive("dashboard")}>←</button>}<b>{title}</b></div><div className="top-right"><button className="bell" aria-label="Notifications">♧</button><button className="user-bubble" onClick={()=>setActive("profile")}>?</button></div></header>
      <div className={"page-body "+(active==="chat"?"chat-body":"")}>
        {active==="chat"&&<><button className="sources-button" onClick={()=>setShowSources(!showSources)}>▱ <span>Sources</span></button>
          <section className="chat-hero">
            <div className="robot-halo"><svg viewBox="0 0 180 160" role="img" aria-label="TREAN AI robot mascot"><defs><linearGradient id="helmet" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff"/><stop offset=".42" stopColor="#d9caff"/><stop offset="1" stopColor="#8050f4"/></linearGradient><linearGradient id="ear" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#c5a8ff"/><stop offset="1" stopColor="#6427d9"/></linearGradient></defs><ellipse cx="90" cy="83" rx="62" ry="59" fill="none" stroke="#a84bff" strokeWidth="2" opacity=".6"/><rect x="20" y="61" width="20" height="45" rx="10" fill="url(#ear)"/><rect x="140" y="61" width="20" height="45" rx="10" fill="url(#ear)"/><path d="M43 75 Q45 22 90 20 Q135 22 137 75 L132 111 Q124 137 90 139 Q56 137 48 111Z" fill="url(#helmet)" stroke="#d5b9ff" strokeWidth="3"/><rect x="45" y="57" width="90" height="63" rx="27" fill="#17102e" stroke="#a77bff" strokeWidth="3"/><path d="M67 83 Q75 70 83 83 M98 83 Q106 70 114 83" fill="none" stroke="#d9b9ff" strokeWidth="4" strokeLinecap="round"/><path d="M78 99 Q90 110 102 99" fill="none" stroke="#d9b9ff" strokeWidth="4" strokeLinecap="round"/><path d="M71 40 Q90 31 109 40" fill="none" stroke="#fff" strokeWidth="4" opacity=".7" strokeLinecap="round"/></svg></div>
            <h1>Chat with TREAN <em>AI</em></h1><p>Ask questions about your learned videos, notes, and knowledge base.</p>
          </section>
          <section className="feature-row"><article className="feature-card"><span className="feature-icon youtube">▶</span><div><b>From Your Videos</b><p>Answers grounded in your processed videos</p></div></article><article className="feature-card"><span className="feature-icon doc">▤</span><div><b>Source-Grounded</b><p>Video and timestamp references</p></div></article><article className="feature-card"><span className="feature-icon bolt">ϟ</span><div><b>Learn Deeper</b><p>Understand concepts and explanations</p></div></article></section>
          <form className="chat-input-panel" onSubmit={e=>e.preventDefault()}><textarea value={question} onChange={e=>setQuestion(e.target.value)} placeholder="Ask a question about your learned content..." rows={2}/><div className="chat-tools"><div><button type="button" className="tool-pill" disabled>♧ <span>Attach</span></button><button type="button" className="tool-pill" onClick={()=>setShowSources(!showSources)}>▣ <span>Knowledge</span>⌄</button></div><button type="submit" className="send-button" aria-label="Send question" disabled>➤</button></div><small className="backend-note">Connect your learning and AI services to enable chat.</small></form>
          {showSources&&<div className="source-popover"><b>Knowledge sources</b><p>Your processed videos and learning materials will appear here once you add them.</p><button onClick={()=>setShowAdd(true)}>＋ Add a video</button></div>}
        </>}
        {active!=="chat"&&<section className="other-page"><div className="eyebrow">YOUR PERSONAL LEARNING SPACE</div><h1>{title}</h1><p className="other-sub">{({dashboard:"Your learning activity and knowledge will appear here.",learn:"Add a YouTube video or playlist to start learning.",knowledge:"Your searchable knowledge library will appear here.",summaries:"Your generated video summaries will appear here.",sources:"Your connected videos and playlists will appear here.",history:"Your learning activity will appear here.",profile:"Your account details will appear here after you sign in.",settings:"Manage your account and learning preferences."})[active]}</p>
          {active==="dashboard"&&<div className="empty-panel"><span>✧</span><h2>Your learning space is ready</h2><p>No learning activity yet. Add a video to start building your personal knowledge base.</p><button className="gradient-action" onClick={()=>setActive("learn")}>Add your first video →</button></div>}
          {active==="learn"&&<div className="upload-panel"><div className="upload-symbol">▷</div><h2>Learn from a YouTube video</h2><p>Paste a video or playlist link to begin. Video processing will be available when the learning backend is connected.</p><button className="gradient-action" onClick={()=>setShowAdd(true)}>Add YouTube URL →</button></div>}
          {active==="knowledge"&&<div className="empty-panel"><span>▱</span><h2>No knowledge yet</h2><p>Processed video transcripts, concepts and learning notes will appear here.</p><button className="gradient-action" onClick={()=>setActive("learn")}>Add a video →</button></div>}
          {active==="summaries"&&<div className="empty-panel"><span>▤</span><h2>No summaries yet</h2><p>Summaries will appear here after you process learning videos.</p></div>}
          {active==="sources"&&<div className="empty-panel"><span>♧</span><h2>No learning sources yet</h2><p>Your YouTube videos and playlists will appear here after you add them.</p><button className="gradient-action" onClick={()=>setActive("learn")}>Add a source →</button></div>}
          {active==="history"&&<div className="empty-panel"><span>◷</span><h2>No activity yet</h2><p>Your learning history will appear here as you use TREAN AI.</p></div>}
          {active==="profile"&&<div className="empty-panel"><span className="profile-large">?</span><h2>Profile not connected</h2><p>Sign in to view and manage your profile.</p></div>}
          {active==="settings"&&<div className="empty-panel"><span>⚙</span><h2>Settings</h2><p>Account preferences and integrations will be available after setup.</p></div>}
        </section>}
      </div>
    </section>
    <nav className="mobile-tabbar" aria-label="Mobile navigation">
      {navItems.filter(x=>["dashboard","learn","chat","knowledge"].includes(x[0])).map(([id,icon,label])=><button key={id} className={active===id?"mobile-tab active":"mobile-tab"} onClick={()=>{setActive(id);setShowMore(false)}}><span>{icon}</span><small>{id==="knowledge"?"Library":id==="learn"?"Learn":label}</small></button>)}
      <button className={showMore?"mobile-tab active":"mobile-tab"} onClick={()=>setShowMore(v=>!v)}><span>•••</span><small>More</small></button>
    </nav>
    {showMore&&<div className="mobile-more-shade" onClick={()=>setShowMore(false)}><div className="mobile-more-menu" onClick={e=>e.stopPropagation()}><div className="mobile-more-head">More from TREAN AI <button onClick={()=>setShowMore(false)}>×</button></div>{navItems.filter(x=>!["dashboard","learn","chat","knowledge"].includes(x[0])).map(([id,icon,label])=><button key={id} onClick={()=>{setActive(id);setShowMore(false)}}><span>{icon}</span>{label}</button>)}</div></div>}
    {showAdd&&<div className="modal-shade" onClick={()=>setShowAdd(false)}><form className="add-modal" onSubmit={add} onClick={e=>e.stopPropagation()}><button type="button" className="close-modal" onClick={()=>setShowAdd(false)}>×</button><div className="eyebrow">START LEARNING</div><h2>Add a YouTube video</h2><p>Enter a public YouTube video or playlist URL. Processing will be enabled after backend integration.</p><input type="url" required value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..."/><button className="gradient-action" type="submit" disabled>Process &amp; Learn →</button></form></div>}
  </main>
}
