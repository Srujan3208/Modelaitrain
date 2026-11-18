"use client";

import { useState } from "react";
import {
  Activity, ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Bell, BookOpen,
  BrainCircuit, Check, ChevronDown, Clock3, FileText, FolderOpen, Home,
  Layers3, LogOut, Menu, MessageCircle, MoreHorizontal, Paperclip, Play,
  Plus, Search, Send, Settings, Sparkles, UserRound, Video, WandSparkles,
  X, Zap
} from "lucide-react";

const nav = [
  { label: "Dashboard", icon: Home },
  { label: "Learn from Video", icon: Play },
  { label: "Knowledge Base", icon: Layers3 },
  { label: "AI Chat", icon: MessageCircle },
  { label: "Summaries", icon: FileText },
  { label: "Learning Sources", icon: BookOpen },
  { label: "History", icon: Clock3 },
];
const suggestions = ["Explain CPU scheduling", "Summarize OS in brief", "Difference between FCFS and SJF", "Give examples from my videos"];

function Sidebar({ active, setActive, open, setOpen }: any) {
  return <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
    <div className="brand"><div className="brand-mark"><BrainCircuit size={27}/></div><div><b>TREAN <span>AI</span></b><small>Persistent Learning Agent</small></div><button className="mobile-close" onClick={()=>setOpen(false)}><X size={18}/></button></div>
    <div className="nav-label">WORKSPACE</div>
    <nav>{nav.map(({label,icon:Icon})=><button key={label} className={`nav-item ${active===label?"active":""}`} onClick={()=>{setActive(label);setOpen(false)}}><Icon size={19}/><span>{label}</span>{label==="AI Chat"&&<i className="nav-dot"/>}</button>)}</nav>
    <div className="nav-divider"/>
    <div className="nav-label">PERSONAL</div>
    { [{label:"Profile",icon:UserRound},{label:"Settings",icon:Settings}].map(({label,icon:Icon})=><button key={label} className={`nav-item ${active===label?"active":""}`} onClick={()=>{setActive(label);setOpen(false)}}><Icon size={19}/><span>{label}</span></button>)}
    <div className="pro-card"><div className="pro-icon"><Sparkles size={17}/></div><b>TREAN Pro</b><p>Unlock higher limits, longer videos & more.</p><button onClick={()=>setActive("Pricing")}>Explore Pro <ArrowUpRight size={15}/></button></div>
    <div className="sidebar-bottom"><div className="avatar avatar-small">S</div><div><b>Srujan</b><small>Free plan</small></div><button aria-label="Sign out"><LogOut size={17}/></button></div>
  </aside>
}

function ChatView() {
 const [question,setQuestion]=useState("");
 const [scope,setScope]=useState("Knowledge");
 const [sent,setSent]=useState<string[]>([]);
 const send=()=>{if(question.trim()){setSent([...sent,question.trim()]);setQuestion("")}};
 return <div className="chat-page">
   <div className="chat-hero">
     <div className="bot-orbit"><div className="bot-face"><span className="bot-ear left"/><span className="bot-ear right"/><div className="bot-eyes"><i/><i/></div><div className="bot-smile"/></div><span className="orbit-dot"/></div>
     <div className="eyebrow"><span className="pulse"/> YOUR PERSONAL LEARNING COPILOT</div>
     <h1>Chat with <span>TREAN AI</span></h1>
     <p className="hero-sub">Ask anything from your learned videos, notes, and knowledge base.</p>
   </div>
   <div className="value-grid">
    <div className="value-card"><div className="value-icon youtube">▶</div><div><b>From Your Videos</b><p>Get answers from processed<br/>YouTube videos</p></div></div>
    <div className="value-card"><div className="value-icon purple"><FileText size={25}/></div><div><b>Source-Grounded</b><p>See exact video & timestamp<br/>references</p></div></div>
    <div className="value-card"><div className="value-icon violet"><Zap size={25}/></div><div><b>Learn Deeper</b><p>Understand concepts, examples,<br/>and explanations</p></div></div>
   </div>
   {sent.length>0&&<div className="sent-list">{sent.map((s,i)=><div className="sent-bubble" key={i}>{s}<span>Sent · TREAN is ready to answer when AI is connected</span></div>)}</div>}
   <div className="composer">
     <textarea value={question} onChange={e=>setQuestion(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send()}}} placeholder="Ask a question about your learned content..."/>
     <div className="composer-actions"><button className="soft-btn"><Paperclip size={16}/> Attach</button><div className="scope-wrap"><select value={scope} onChange={e=>setScope(e.target.value)}><option>Knowledge</option><option>All sources</option><option>Current video</option></select><BookOpen size={16}/><ChevronDown size={13}/></div><button className="send-btn" onClick={send} aria-label="Send question"><Send size={19}/></button></div>
   </div>
   <div className="suggestions"><span>TRY ASKING</span><div>{suggestions.map(s=><button key={s} onClick={()=>setQuestion(s)}>{s}<ArrowUpRight size={13}/></button>)}</div></div>
   <p className="chat-footnote"><Sparkles size={13}/> Answers are generated from your personal learning library.</p>
 </div>
}

function DashboardView({setActive}:any) {
 return <div className="content-page"><div className="welcome-row"><div><div className="eyebrow">YOUR LEARNING SPACE</div><h1>Welcome back, Srujan <span>✦</span></h1><p>Turn videos into structured knowledge, ask questions, and build your personal learning space.</p></div><button className="primary-btn" onClick={()=>setActive("Learn from Video")}><Plus size={17}/> Add a video</button></div>
 <div className="stats-grid">{[{n:"28",l:"Videos learned",c:"+6 this week",i:Video},{n:"3,742",l:"Knowledge items",c:"+12% this month",i:Layers3},{n:"18.4 hrs",l:"Learning time",c:"This month",i:Clock3},{n:"12",l:"Topics explored",c:"Across 5 subjects",i:BrainCircuit}].map(({n,l,c,i:Icon})=><div className="stat-card" key={l}><div className="stat-top"><span>{l}</span><Icon size={18}/></div><strong>{n}</strong><small>{c}</small></div>)}</div>
 <div className="quick-add"><div><div className="eyebrow">START LEARNING</div><b>What would you like to learn today?</b><p>Paste a YouTube video or playlist to get started.</p></div><button className="primary-btn" onClick={()=>setActive("Learn from Video")}>Process & Learn <ArrowRight size={16}/></button></div>
 <div className="section-heading"><div><h2>Continue learning</h2><p>Pick up where you left off</p></div><button className="text-btn" onClick={()=>setActive("History")}>View history <ArrowRight size={15}/></button></div>
 <div className="video-grid">{["Operating Systems — Introduction","CPU Scheduling Algorithms","Memory Management in OS"].map((t,i)=><div className="video-card" key={t}><div className={`video-thumb thumb-${i}`}><Play size={24} fill="currentColor"/></div><div className="video-info"><b>{t}</b><small>{["Neso Academy · 42:17","Gate Smashers · 28:10","Jenny's Lectures · 36:05"][i]}</small><span className="status"><Check size={12}/> Learned</span></div></div>)}</div>
 </div>
}

function GenericView({active}:any) {
 const descriptions:any={"Learn from Video":"Turn any educational YouTube video or playlist into structured knowledge.","Knowledge Base":"Your personal, searchable library of everything you have learned.","Summaries":"AI-generated summaries and key takeaways from your processed videos.","Learning Sources":"All your video sources, playlists, and references in one place.","History":"Track your recent learning activity and processed content.","Profile":"Manage your account, learning plan, and preferences.","Settings":"Customize your TREAN AI experience.","Pricing":"Choose the learning plan that works for you."};
 return <div className="content-page"><div className="eyebrow">TREAN AI WORKSPACE</div><h1>{active}</h1><p className="page-desc">{descriptions[active]||"Explore your personal learning workspace."}</p><div className="placeholder-panel"><div className="placeholder-icon"><WandSparkles size={28}/></div><h2>{active==="Learn from Video"?"Bring a video into your knowledge library":`Your ${active.toLowerCase()} workspace`}</h2><p>{active==="Learn from Video"?"Paste a YouTube link to generate a summary, key concepts, and searchable notes.":"This section is ready for the next integration step. Your learning workspace will appear here."}</p><div className="input-line"><Search size={17}/><input placeholder={active==="Learn from Video"?"Paste a YouTube video or playlist URL...":`Search ${active.toLowerCase()}...`}/><button className="primary-btn">Continue <ArrowRight size={15}/></button></div></div></div>
}

export default function HomePage(){
 const [active,setActive]=useState("AI Chat");
 const [open,setOpen]=useState(false);
 const [search,setSearch]=useState("");
 return <main className="app-shell"><Sidebar active={active} setActive={setActive} open={open} setOpen={setOpen}/><section className="main-area"><header className="topbar"><div className="top-left"><button className="mobile-menu" onClick={()=>setOpen(true)}><Menu size={21}/></button><span className="breadcrumb">Workspace</span><span className="crumb-slash">/</span><b>{active}</b></div><div className="top-right"><div className="global-search"><Search size={16}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search your knowledge, videos, or topics..."/><kbd>⌘ K</kbd></div><button className="icon-btn notification"><Bell size={19}/><i/></button><button className="avatar">S</button></div></header><div className="page-scroll">{active==="AI Chat"?<ChatView/>:active==="Dashboard"?<DashboardView setActive={setActive}/>:<GenericView active={active}/>}</div></section></main>
}
