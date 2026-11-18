"use client";

import { useMemo, useState } from "react";

const initialSources = [
  { id: 1, title: "The fundamentals of machine learning", channel: "DeepLearning.AI", duration: "24 min", date: "Today", status: "Ready", color: "violet", initials: "ML" },
  { id: 2, title: "Build and deploy AI agents with tools", channel: "Fireship", duration: "18 min", date: "Yesterday", status: "Ready", color: "blue", initials: "AI" },
  { id: 3, title: "Neural networks explained visually", channel: "3Blue1Brown", duration: "31 min", date: "Nov 15", status: "Ready", color: "orange", initials: "NN" }
];

const nav = [
  { id: "overview", icon: "◫", label: "Overview" },
  { id: "library", icon: "▤", label: "My library" },
  { id: "chat", icon: "✳", label: "AI learning chat" },
  { id: "notes", icon: "▧", label: "Notes & summaries" }
];

export default function Home() {
  const [active, setActive] = useState("overview");
  const [sources, setSources] = useState(initialSources);
  const [query, setQuery] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hey there! I’m your learning companion. Ask me anything from your video library, or add a new video to start learning." }
  ]);
  const [toast, setToast] = useState("");

  const filtered = useMemo(() => sources.filter(s => s.title.toLowerCase().includes(query.toLowerCase()) || s.channel.toLowerCase().includes(query.toLowerCase())), [sources, query]);

  function addVideo(e) {
    e.preventDefault();
    if (!videoUrl.trim()) return;
    const id = Date.now();
    setSources(prev => [{ id, title: "New YouTube video", channel: "YouTube source", duration: "Processing", date: "Just now", status: "Queued", color: "violet", initials: "YT" }, ...prev]);
    setVideoUrl("");
    setShowAdd(false);
    setToast("Video added to your learning queue");
    setTimeout(() => setToast(""), 2800);
  }

  function sendMessage(e) {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const text = chatInput.trim();
    setMessages(prev => [...prev, { role: "user", text }, { role: "assistant", text: "Your question is ready for the TREAN AI knowledge engine. Connect the AI backend to generate answers grounded in your indexed videos." }]);
    setChatInput("");
  }

  const title = nav.find(n => n.id === active)?.label || "Overview";

  return (
    <main className="shell">
      <aside className="sidebar">
        <a className="brand" href="#" onClick={() => setActive("overview")}>
          <span className="brand-mark">t<span>✳</span></span>
          <span className="brand-name">trean<span>ai</span></span>
        </a>
        <div className="workspace"><div className="workspace-avatar">S</div><div><b>My workspace</b><small>Personal learning</small></div><span className="chevron">⌄</span></div>
        <div className="nav-label">WORKSPACE</div>
        <nav className="nav-list">
          {nav.map(item => <button key={item.id} className={active === item.id ? "nav-item active" : "nav-item"} onClick={() => setActive(item.id)}><span className="nav-icon">{item.icon}</span>{item.label}{item.id === "chat" && <i className="nav-dot" />}</button>)}
        </nav>
        <div className="sidebar-bottom">
          <div className="upgrade-card"><div className="upgrade-icon">✦</div><b>Learn without limits</b><p>Your personal AI study space is just getting started.</p><button onClick={() => setToast("Your plan options will be available soon.")}>Explore TREAN AI <span>↗</span></button></div>
          <button className="nav-item settings" onClick={() => setActive("settings")}><span className="nav-icon">⚙</span>Settings</button>
          <div className="profile-row"><div className="profile-avatar">S</div><div className="profile-copy"><b>Srujan</b><small>Free workspace</small></div><span className="more">•••</span></div>
        </div>
      </aside>

      <section className="main-area">
        <header className="topbar">
          <div className="breadcrumbs"><span>Workspace</span><b>/</b><strong>{title}</strong></div>
          <div className="top-actions"><div className="status-pill"><i /> All systems normal</div><button className="icon-btn" aria-label="Notifications">♧<i /></button><div className="top-avatar">S</div></div>
        </header>

        <div className="page-content">
          {active === "overview" && <><div className="welcome-row"><div><div className="eyebrow"><span className="spark">✳</span> YOUR PERSONAL AI LEARNING SPACE</div><h1>Make every video <em>count.</em></h1><p className="subtitle">Turn what you watch into knowledge you can actually use.</p></div><button className="primary-btn" onClick={() => setShowAdd(true)}><span>＋</span> Add a video</button></div>
            <div className="hero-card"><div className="hero-copy"><div className="hero-kicker">YOUR KNOWLEDGE, REIMAGINED</div><h2>Learn at your pace.<br/><span>Think beyond the video.</span></h2><p>Bring your favorite YouTube lessons together. Ask questions, discover connections, and build a knowledge base that grows with you.</p><button className="hero-btn" onClick={() => setActive("library")}>Explore your library <span>→</span></button></div><div className="orb-wrap"><div className="orb orb-one"/><div className="orb orb-two"/><div className="orb-core"><span>✳</span></div><div className="orbit-label label-one">LEARN</div><div className="orbit-label label-two">CONNECT</div><div className="orbit-label label-three">CREATE</div></div><div className="hero-grid"/></div>
            <div className="section-heading"><div><h3>Your learning at a glance</h3><p>A little progress adds up to a lot of knowledge.</p></div><span className="period">Last 30 days⌄</span></div>
            <div className="stats-grid"><Stat icon="▣" label="Videos learned" value={String(sources.length).padStart(2,"0")} trend="+2 this week" tone="purple"/><Stat icon="▤" label="Knowledge chunks" value="128" trend="Across your library" tone="blue"/><Stat icon="◷" label="Learning time" value="4.8h" trend="+18% this week" tone="orange"/><Stat icon="✳" label="Questions explored" value="36" trend="Keep being curious" tone="green"/></div>
            <div className="lower-grid"><div className="panel recent-panel"><div className="panel-heading"><div><h3>Recently added</h3><p>Pick up right where you left off.</p></div><button className="text-btn" onClick={() => setActive("library")}>View library →</button></div><div className="source-list">{sources.slice(0,3).map(s => <SourceRow key={s.id} source={s} onClick={() => setActive("notes")}/>)}</div></div><div className="panel prompt-panel"><div className="panel-heading"><div><h3>Ready to explore?</h3><p>Start with a question.</p></div><span className="prompt-spark">✳</span></div><div className="suggestions"><button onClick={() => {setActive("chat");setChatInput("Explain the most important concepts I have learned.");}}>What are my key takeaways? <span>↗</span></button><button onClick={() => {setActive("chat");setChatInput("Connect ideas across my videos.");}}>Connect ideas across videos <span>↗</span></button><button onClick={() => {setActive("chat");setChatInput("Create a quick revision quiz.");}}>Make me a revision quiz <span>↗</span></button></div><button className="chat-link" onClick={() => setActive("chat")}>Open AI learning chat <span>→</span></button></div></div>
          </>}

          {active === "library" && <><div className="page-title-row"><div><div className="eyebrow">YOUR KNOWLEDGE COLLECTION</div><h1>My <em>library.</em></h1><p className="subtitle">Every video you add becomes part of your personal knowledge base.</p></div><button className="primary-btn" onClick={() => setShowAdd(true)}>＋ Add a video</button></div><div className="library-toolbar"><div className="search-box"><span>⌕</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search your videos..." /></div><span className="count-label">{filtered.length} SOURCES</span></div><div className="library-grid">{filtered.map(s => <article className="library-card" key={s.id}><div className={"video-thumb "+s.color}><span>{s.initials}</span><i>▶</i></div><div className="library-card-body"><div className="card-meta"><span>{s.channel}</span><span className="ready-tag"><i/> {s.status}</span></div><h3>{s.title}</h3><div className="card-foot"><span>◷ {s.duration}</span><span>{s.date}</span></div><button className="card-open" onClick={() => setActive("notes")}>Open learning notes →</button></div></article>)}</div>{filtered.length === 0 && <div className="empty-state">No videos match your search yet.</div>}</>}

          {active === "chat" && <div className="chat-page"><div className="eyebrow">YOUR AI STUDY PARTNER</div><h1>Let's think <em>together.</em></h1><p className="subtitle">Ask questions grounded in the videos you have learned.</p><div className="chat-window"><div className="chat-messages">{messages.map((m,i)=><div key={i} className={"chat-message "+m.role}><div className="chat-avatar">{m.role==="assistant"?"✳":"S"}</div><div><small>{m.role==="assistant"?"TREAN AI":"YOU"}</small><p>{m.text}</p></div></div>)}</div><form className="chat-composer" onSubmit={sendMessage}><textarea value={chatInput} onChange={e=>setChatInput(e.target.value)} placeholder="Ask anything about what you've learned..." rows={2}/><div className="composer-bottom"><span>✳ Answers will be grounded in your video library</span><button type="submit" disabled={!chatInput.trim()}>Send message ↑</button></div></form></div><div className="chat-hints"><button onClick={()=>setChatInput("Summarize my latest video")}>Summarize my latest video</button><button onClick={()=>setChatInput("Explain a difficult concept simply")}>Explain a concept simply</button><button onClick={()=>setChatInput("Create a 5-question quiz")}>Create a quick quiz</button></div></div>}

          {active === "notes" && <><div className="eyebrow">REVIEW & REMEMBER</div><h1>Notes that <em>stick.</em></h1><p className="subtitle">Your video summaries, key concepts and revision material in one place.</p><div className="notes-empty"><div className="empty-illustration">▧</div><h2>Your learning notes live here.</h2><p>Choose a video from your library to view its summary and key takeaways. AI-generated notes will appear here once the learning backend is connected.</p><button className="primary-btn" onClick={()=>setActive("library")}>Browse my library →</button></div></>}

          {active === "settings" && <><div className="eyebrow">MAKE IT YOURS</div><h1>Workspace <em>settings.</em></h1><p className="subtitle">Manage your learning experience and account preferences.</p><div className="panel settings-panel"><h3>Profile</h3><p>Personal learning workspace</p><div className="setting-line"><span>Display name</span><b>Srujan</b></div><div className="setting-line"><span>Workspace type</span><b>Personal</b></div><div className="setting-line"><span>AI provider</span><b>Backend connection pending</b></div></div></>}
        </div>
        <footer className="footer"><span>✳ TREAN AI</span><span>Learn something meaningful today.</span><span>Built for curious minds.</span></footer>
      </section>

      {showAdd && <div className="modal-backdrop" onClick={()=>setShowAdd(false)}><form className="modal" onSubmit={addVideo} onClick={e=>e.stopPropagation()}><button type="button" className="modal-close" onClick={()=>setShowAdd(false)}>×</button><div className="modal-icon">▶</div><div className="eyebrow">GROW YOUR KNOWLEDGE</div><h2>Add a YouTube video</h2><p>Paste a public YouTube video or playlist link. TREAN AI will turn it into a learning source.</p><label htmlFor="video-url">YOUTUBE URL</label><input id="video-url" type="url" required value={videoUrl} onChange={e=>setVideoUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..."/><button className="primary-btn modal-submit" type="submit">Add to my library <span>→</span></button><small className="modal-note">Video processing requires the learning backend to be connected.</small></form></div>}
      {toast && <div className="toast">✓ {toast}</div>}
    </main>
  );
}

function Stat({icon,label,value,trend,tone}) {
  return <div className="stat-card"><div className={"stat-icon "+tone}>{icon}</div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-trend">{trend}</div></div>;
}
function SourceRow({source,onClick}) {
  return <button className="source-row" onClick={onClick}><div className={"source-mini "+source.color}>{source.initials}</div><div className="source-info"><b>{source.title}</b><small>{source.channel} · {source.duration}</small></div><span className="ready-tag"><i/>{source.status}</span><span className="row-arrow">↗</span></button>;
}