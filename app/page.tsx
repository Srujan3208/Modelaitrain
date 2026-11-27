"use client";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import {useState,useEffect,useRef} from "react";
import {ArrowUp,BookOpen,Brain,ChevronDown,FileText,Folder,History,Home,Library,Menu,MessageSquare,Plus,Search,Settings,User,Video,X,Mic,Paperclip,Layers,Sparkles,Play,PanelLeft,Link2,Clock,Send,Share2,Copy,Pencil,Trash2,ThumbsUp,ThumbsDown} from "lucide-react";
type Screen="Landing"|"Sign In"|"Create Account"|"Chat"|"Dashboard"|"Learn from Video"|"Processing Video"|"Background Learning"|"Knowledge Base"|"Summaries"|"Learning Sources"|"History"|"Profile"|"Settings";
const nav:[Screen,any,string][]=[["Chat",MessageSquare,"Workspace"],["Learn from Video",Video,"Learning"],["Background Learning",Brain,"Learning"],["Knowledge Base",Library,"Library"],["Summaries",FileText,"Library"],["Learning Sources",BookOpen,"Library"],["Dashboard",Home,"Overview"],["History",History,"Personal"],["Profile",User,"Personal"],["Settings",Settings,"Personal"]];
function Logo(){return <div className="brand"><span className="brand-mark"><svg viewBox="0 0 40 40" fill="none"><path d="M20 5.5C13.5 1.8 6.2 7 7.5 13.4 2 16.8 5 24.3 10.2 25.4c.4 6 6.3 9 9.8 5.5V12c-2-2.2-5.6-1.9-7 .4M20 5.5C26.5 1.8 33.8 7 32.5 13.4c5.5 3.4 2.5 10.9-2.7 12-0.4 6-6.3 9-9.8 5.5V12c2-2.2 5.6-1.9 7 .4M12.1 16c2.2 0 4 1.6 4 3.8M12.5 23.3c2.4 0 3.6 1.6 3.6 3.5M27.9 16c-2.2 0-4 1.6-4 3.8M27.5 23.3c-2.4 0-3.6 1.6-3.6 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg></span><span className="brand-text">TREAN<span>AI</span><small>LEARN · CONNECT · REMEMBER</small></span></div>}
function Button({children,onClick,kind="secondary",disabled=false}:{children:any;onClick?:()=>void;kind?:string;disabled?:boolean}){return <button className={"btn "+kind} disabled={disabled} onClick={onClick}>{children}</button>}
function Landing({go}:{go:(s:Screen)=>void}){return <div className="landing"><header className="landing-header"><Logo/><nav><a href="#product">Product</a><a href="#features">Features</a><a href="#how">How it works</a></nav><div className="header-actions"><Button onClick={()=>go("Sign In")}>Sign in</Button><Button kind="primary" onClick={()=>go("Create Account")}>Get started <ArrowUp/></Button></div></header><section className="hero"><div className="hero-copy"><span className="eyebrow-pill"><Sparkles/> PERSONAL LEARNING WORKSPACE</span><h1>Make what you watch,<br/>what you <span>know.</span></h1><p>Turn educational videos into a personal learning space. Understand concepts, ask questions, and build knowledge that stays organized.</p><div className="hero-buttons"><Button kind="primary" onClick={()=>go("Create Account")}>Start learning <ArrowUp/></Button><Button onClick={()=>go("Sign In")}>Explore workspace <PanelLeft/></Button></div><div className="hero-note"><span className="note-dot"/>A workspace for your learning, not another video feed.</div></div><div className="hero-art" aria-label="Abstract learning workspace illustration"><div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/><div className="art-core"><Brain/><span>KNOWLEDGE</span></div><div className="art-node node-video"><Video/><span>VIDEO</span></div><div className="art-node node-notes"><FileText/><span>NOTES</span></div><div className="art-node node-chat"><MessageSquare/><span>CHAT</span></div><div className="art-node node-library"><BookOpen/><span>LIBRARY</span></div></div></section><section className="feature-section" id="features"><div className="section-head"><span>ONE CONNECTED WORKSPACE</span><h2>Everything around your learning.</h2><p>Bring your sources, questions, notes and discoveries into one place.</p></div><div className="feature-grid">{[[Video,"Learn from video","Start with a video or playlist you want to understand."],[MessageSquare,"Ask and explore","Discuss the material and ask follow-up questions."],[FileText,"Keep the key ideas","Create summaries and organize important concepts."],[Library,"Build your library","Keep your learning sources together and searchable."]].map(([I,t,d]:any)=><div className="feature-card" key={t}><span className="feature-icon"><I/></span><h3>{t}</h3><p>{d}</p><ArrowUp className="feature-arrow"/></div>)}</div></section><section className="how-section" id="how"><div><span className="section-kicker">A SIMPLE WORKFLOW</span><h2>From source to understanding.</h2></div><div className="workflow">{[[1,"Bring a source","Add a learning video or source."],[2,"Explore the material","Ask questions and review the ideas."],[3,"Keep your knowledge","Save what matters to your personal library."]].map(([n,t,d]:any)=><div key={n}><span className="step">{n}</span><h3>{t}</h3><p>{d}</p></div>)}</div></section><footer><Logo/><span>Designed for focused learning.</span><Button kind="primary" onClick={()=>go("Create Account")}>Get started <ArrowUp/></Button></footer></div>}
function Auth({screen,go}:{screen:Screen;go:(s:Screen)=>void}){const signup=screen==="Create Account";const [email,setEmail]=useState("");const [password,setPassword]=useState("");const [name,setName]=useState("");const [showPassword,setShowPassword]=useState(false);const [busy,setBusy]=useState(false);const [notice,setNotice]=useState("");const [success,setSuccess]=useState(false);async function submit(){setNotice("");setBusy(true);try{const url=process.env.NEXT_PUBLIC_SUPABASE_URL;const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;if(!url||!key){setNotice("Supabase configuration is missing. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel.");return;}const {createClient}=await import("@supabase/supabase-js");const supabase=createClient(url,key);if(signup){const {data,error}=await supabase.auth.signUp({email,password,options:{data:{full_name:name}}});if(error)throw error;if(data.session){setSuccess(true);setNotice("Account created successfully. Welcome to TREAN AI!");go("Dashboard");}else{setSuccess(true);setNotice("Account created. Check your email to confirm your account, then sign in.");}}else{const {data,error}=await supabase.auth.signInWithPassword({email,password});if(error)throw error;if(data.session){setSuccess(true);setNotice("Signed in successfully.");go("Dashboard");}}}catch(e:any){setNotice(e?.message||"Authentication failed. Please try again.");}finally{setBusy(false);}}async function reset(){setNotice("");if(!email){setNotice("Enter your email address first.");return;}try{const {createClient}=await import("@supabase/supabase-js");const supabase=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:window.location.origin});if(error)throw error;setNotice("Password reset email sent. Check your inbox.");}catch(e:any){setNotice(e?.message||"Unable to send reset email.");}}async function google(){try{const {createClient}=await import("@supabase/supabase-js");const supabase=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);const {error}=await supabase.auth.signInWithOAuth({provider:"google",options:{redirectTo:window.location.origin}});if(error)throw error;}catch(e:any){setNotice(e?.message||"Google sign-in is unavailable.");}}return <><style jsx global>{`@media (min-width: 768px) { .auth-page { padding: 18px 24px !important; align-items: center !important; } .auth-page .auth-card { width: min(100% - 48px, 440px) !important; max-width: 440px !important; padding: 22px 28px !important; gap: 9px !important; } .auth-page .auth-card > .brand { margin-bottom: 2px !important; } .auth-page .auth-card .section-kicker { margin-top: 2px !important; } .auth-page .auth-card h1 { margin: 2px 0 0 !important; font-size: 28px !important; line-height: 1.15 !important; } .auth-page .auth-card > p { margin: 0 0 5px !important; } .auth-page .auth-card label { margin-top: 2px !important; gap: 5px !important; } .auth-page .auth-card input { min-height: 46px !important; } .auth-page .auth-card .oauth-button { min-height: 46px !important; margin: 2px 0 !important; } .auth-page .auth-card .auth-divider { margin: 3px 0 !important; } .auth-page .auth-card .forgot-button { margin: 0 !important; } .auth-page .auth-card .auth-switch, .auth-page .auth-card .auth-legal { margin-top: 5px !important; } }  `}</style><div className="auth-page"><button className="back-button" onClick={()=>go("Landing")}>← Back</button><div className="auth-card"><Logo/><span className="section-kicker">{signup?"CREATE YOUR SPACE":"WELCOME BACK"}</span><h1>{signup?"Create account":"Sign in"}</h1><p>{signup?"Start building your personal learning workspace.":"Continue to your learning workspace."}</p><button className="oauth-button" onClick={google}><span className="google-mark">G</span>Continue with Google</button><div className="auth-divider"><span>or continue with email</span></div>{signup&&<label>Full name<input value={name} onChange={e=>setName(e.target.value)} autoComplete="name" placeholder="Your name"/></label>}<label>Email address<input type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" placeholder="you@example.com"/></label><label>Password<div className="password-field"><input type={showPassword?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} autoComplete={signup?"new-password":"current-password"} placeholder={signup?"Create a password":"Enter your password"}/><button type="button" onClick={()=>setShowPassword(v=>!v)}>{showPassword?"Hide":"Show"}</button></div></label>{!signup&&<button className="forgot-button" onClick={reset}>Forgot password?</button>}<Button kind="primary" disabled={busy||!email||!password||(signup&&!name)} onClick={submit}>{busy?"Please wait…":signup?"Create account":"Sign in"} <ArrowUp/></Button>{notice&&<div className={"auth-notice "+(success?"success":"")}>{notice}</div>}<div className="auth-switch">{signup?"Already have an account?":"New to TREAN AI?"}<button onClick={()=>{setNotice("");go(signup?"Sign In":"Create Account")}}>{signup?"Sign in":"Create account"}</button></div><p className="auth-legal">By continuing, you agree to use TREAN AI responsibly.</p></div></div></>}
function Sidebar({screen,go,open,setOpen}:{screen:Screen;go:(s:Screen)=>void;open:boolean;setOpen:(v:boolean)=>void}){return <><aside className={"sidebar "+(open?"open":"")}><div className="sidebar-head"><Logo/><button className="icon-button" onClick={()=>setOpen(false)}><X/></button></div><Button kind="new-chat" onClick={()=>go("Chat")}><Plus/> New chat</Button><button className="side-search"><Search/> Search <kbd>⌘ K</kbd></button>{["Workspace","Learning","Library","Overview","Personal"].map(group=><div key={group}><div className="side-label">{group}</div>{nav.filter(x=>x[2]===group).map(([s,I])=><button className={"nav-item "+(screen===s?"selected":"")} key={s} onClick={()=>{go(s);setOpen(false)}}><I/>{s}</button>)}</div>)}<div className="sidebar-bottom"><div className="sidebar-tip"><Sparkles/><p>Your learning space is ready for your sources.</p></div><button className="profile-row" onClick={()=>go("Profile")}><span className="user-avatar"><User/></span><span><b>Account</b><small>Profile & settings</small></span><ChevronDown/></button></div></aside>{open&&<button className="sidebar-scrim" onClick={()=>setOpen(false)}/>}</>}
function Empty({icon:Icon,title,description,action,click}:{icon:any;title:string;description:string;action?:string;click?:()=>void}){return <div className="empty-state"><div className="empty-icon"><Icon/></div><h2>{title}</h2><p>{description}</p>{action&&<Button kind="primary" onClick={click}>{action}<ArrowUp/></Button>}</div>}
function renderAssistantContent(raw:string){
 const content=(raw||"").trim();
 if(!content)return null;
 try{
  const parsed=JSON.parse(content);
  if(parsed&&typeof parsed==="object"&&("User Safety" in parsed||"Response Safety" in parsed)){
   return <div className="safety-result"><span className="safety-dot"/>Response safety check completed</div>;
  }
 }catch{}
 const normalized=content.replace(/\\r\\n/g,"\n").replace(/\\n/g,"\n").replace(/\r\n?/g,"\n");
 return <div className="markdown-response chatgpt-response">
  <ReactMarkdown
   remarkPlugins={[remarkGfm,remarkMath]}
   rehypePlugins={[rehypeKatex,rehypeHighlight]}
   components={{
    h1:({children})=><h1>{children}</h1>,
    h2:({children})=><h2>{children}</h2>,
    h3:({children})=><h3>{children}</h3>,
    a:({href,children})=><a href={href} target="_blank" rel="noopener noreferrer">{children}</a>,
    pre:({children})=>{
     const child=React.Children.toArray(children).find(React.isValidElement) as any;
     const codeClass=child?.props?.className||"";
     const language=(codeClass.match(/language-([\\w+-]+)/)||[])[1]||"Code";
     const codeText=String(child?.props?.children??"").replace(/\n$/,"");
     return <div className="code-block"><div className="code-header"><span>{language}</span><button type="button" onClick={()=>navigator.clipboard?.writeText(codeText)}><Copy/> Copy code</button></div><pre>{children}</pre></div>;
    },
    code:({className,children,...props})=><code className={className} {...props}>{children}</code>,
    table:({children})=><div className="markdown-table-wrap"><table>{children}</table></div>,
   }}
  >{normalized}</ReactMarkdown>
 </div>;
}
function Chat({onToggleSidebar,sidebarOpen}:{onToggleSidebar:()=>void;sidebarOpen:boolean}){
 const [draft,setDraft]=useState("");const [messages,setMessages]=useState<any[]>([]);const [sessions,setSessions]=useState<any[]>([]);const [sessionId,setSessionId]=useState<string|null>(null);const [loading,setLoading]=useState(false);const [sessionLoading,setSessionLoading]=useState(true);const [error,setError]=useState("");const [historyOpen,setHistoryOpen]=useState(false);const [historyQuery,setHistoryQuery]=useState("");const [background,setBackground]=useState(false);const [taskStatus,setTaskStatus]=useState("");const [modelMenu,setModelMenu]=useState(false);const [selectedModel,setSelectedModel]=useState("Auto");const [plusMenu,setPlusMenu]=useState(false);const [knowledgeMenu,setKnowledgeMenu]=useState(false);const [knowledgeMode,setKnowledgeMode]=useState("Knowledge");const [attachments,setAttachments]=useState<any[]>([]);const [uploading,setUploading]=useState(false);const [editing,setEditing]=useState<string|null>(null);const bottomRef=useRef<HTMLDivElement|null>(null);const chatBodyRef=useRef<HTMLDivElement|null>(null);const textareaRef=useRef<HTMLTextAreaElement|null>(null);const fileRef=useRef<HTMLInputElement|null>(null);const [sb,setSb]=useState<any>(null);const [user,setUser]=useState<any>(null);const [feedbackState,setFeedbackState]=useState<Record<string,number>>({});const [feedbackNotice,setFeedbackNotice]=useState("");
 useEffect(()=>{(async()=>{try{const {createClient}=await import("@supabase/supabase-js");const client=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);setSb(client);const {data:{session}}=await client.auth.getSession();if(!session?.user){setError("Sign in to use persistent TREAN AI chat.");setSessionLoading(false);return;}setUser(session.user);await loadSessions(client,session.user.id);}catch(e:any){setError(e.message||"Unable to connect to Supabase.");setSessionLoading(false);}})();},[]);useEffect(()=>{const open=(e:any)=>loadMessages(e.detail);window.addEventListener("trean-open-chat",open);const pending=sessionStorage.getItem("trean-open-chat");if(pending&&sb&&user){sessionStorage.removeItem("trean-open-chat");loadMessages(pending);}return()=>window.removeEventListener("trean-open-chat",open);},[sb,user]);
 async function loadSessions(client:any,uid:string){setSessionLoading(true);const {data,error}=await client.from("chat_sessions").select("id,title,context_type,updated_at,last_message_at,created_at").eq("user_id",uid).is("archived_at",null).order("last_message_at",{ascending:false,nullsFirst:false}).order("updated_at",{ascending:false}).limit(100);if(error)setError(error.message);else setSessions(data||[]);setSessionLoading(false);}
 async function hydrateMessages(rows:any[]){return Promise.all(rows.map(async m=>{const list=m.metadata?.attachments||[];const hydrated=await Promise.all(list.map(async (a:any)=>{if(a.mime_type?.startsWith("image/")&&a.path){const {data}=await sb.storage.from("trean-chat-files").createSignedUrl(a.path,3600);return {...a,preview:data?.signedUrl||null};}return a;}));return {...m,metadata:{...(m.metadata||{}),attachments:hydrated}};}));}async function loadMessages(id:string){if(!sb||!user)return;setLoading(true);setError("");const {data,error}=await sb.from("chat_messages").select("id,role,content,metadata,created_at,model,status").eq("session_id",id).eq("user_id",user.id).order("created_at",{ascending:true});if(error)setError(error.message);else {setMessages(await hydrateMessages(data||[]));const ids=(data||[]).filter((m:any)=>m.role==="assistant").map((m:any)=>m.id);if(ids.length){const {data:feedback}=await sb.from("chat_feedback").select("message_id,rating").eq("user_id",user.id).in("message_id",ids);setFeedbackState(Object.fromEntries((feedback||[]).map((f:any)=>[f.message_id,f.rating])));}}setSessionId(id);setLoading(false);setHistoryOpen(false);}
 useEffect(()=>{const container=chatBodyRef.current;if(!container)return;const frame=requestAnimationFrame(()=>{container.scrollTo({top:container.scrollHeight,behavior:loading?"auto":"smooth"});});return()=>cancelAnimationFrame(frame);},[messages,loading]);
 useEffect(()=>{const viewport=window.visualViewport;if(!viewport)return;const update=()=>{const keyboardInset=Math.max(0,window.innerHeight-viewport.height-viewport.offsetTop);document.documentElement.style.setProperty("--chat-keyboard-inset",keyboardInset+"px");document.documentElement.style.setProperty("--chat-visual-height",viewport.height+"px");};update();viewport.addEventListener("resize",update);viewport.addEventListener("scroll",update);window.addEventListener("orientationchange",update);return()=>{viewport.removeEventListener("resize",update);viewport.removeEventListener("scroll",update);window.removeEventListener("orientationchange",update);document.documentElement.style.removeProperty("--chat-keyboard-inset");document.documentElement.style.removeProperty("--chat-visual-height");};},[]);

 async function newChat(){setSessionId(null);setMessages([]);setDraft("");setAttachments([]);setError("");setTaskStatus("");setEditing(null);setHistoryOpen(false);textareaRef.current?.focus();}
 async function send(){if(background){await startBackgroundLearning();return;}if(!draft.trim()||loading||!sb||!user)return;const text=draft.trim();setDraft("");setError("");setLoading(true);setMessages(v=>[...v,{id:"pending-user",role:"user",content:text,metadata:{attachments:attachments.map(a=>({name:a.name,mime_type:a.mime_type}))}},{id:"pending-ai",role:"assistant",content:"",status:"loading"}]);try{let activeId=sessionId;if(editing){const edited=messages.find(m=>m.id===editing);if(edited){await sb.from("chat_messages").delete().eq("session_id",activeId).eq("user_id",user.id).gte("created_at",edited.created_at);setMessages(v=>v.filter(m=>new Date(m.created_at)<new Date(edited.created_at)));}setEditing(null);}if(!activeId){const {data,error}=await sb.from("chat_sessions").insert({user_id:user.id,title:text.slice(0,80),context_type:"general"}).select("id").single();if(error)throw error;activeId=data.id;setSessionId(activeId);}const {data,error}=await sb.functions.invoke("trean-chat",{body:{message:text,session_id:activeId,selected_model:selectedModel,knowledge_mode:knowledgeMode,background_learning:background,attachments:attachments.map(a=>({path:a.path,name:a.name,mime_type:a.mime_type}))}});if(error)throw error;if(data?.error)throw new Error(data.error);setAttachments([]);setEditing(null);const {data:rows,error:readError}=await sb.from("chat_messages").select("id,role,content,metadata,created_at,model,status").eq("session_id",activeId).eq("user_id",user.id).order("created_at",{ascending:true});if(readError)throw readError;setMessages(await hydrateMessages(rows||[]));await loadSessions(sb,user.id);}catch(e:any){setMessages(v=>v.filter(m=>m.id!=="pending-user"&&m.id!=="pending-ai"));setError(e.message||"Chat request failed. Try again.");}finally{setLoading(false);}}
 async function uploadFiles(files:FileList|null){if(!files||!sb||!user)return;setUploading(true);setError("");try{const current=[...attachments];for(const file of Array.from(files)){if(current.length>=4)throw new Error("You can attach up to 4 files per message.");if(file.size>10*1024*1024)throw new Error(file.name+" exceeds the 10 MB chat limit.");const ext=file.name.split(".").pop()?.toLowerCase()||"";const mime=file.type||({jpg:"image/jpeg",jpeg:"image/jpeg",png:"image/png",webp:"image/webp",gif:"image/gif",pdf:"application/pdf",txt:"text/plain",md:"text/markdown",mp3:"audio/mpeg",m4a:"audio/mp4",wav:"audio/wav",webm:"audio/webm",mp4:"video/mp4"} as any)[ext]||"application/octet-stream";const allowed=["image/jpeg","image/png","image/webp","image/gif","application/pdf","text/plain","text/markdown","audio/mpeg","audio/mp4","audio/wav","audio/webm","audio/ogg","video/mp4","video/webm"];if(!allowed.includes(mime))throw new Error("Unsupported file type: "+file.name);const path=user.id+"/"+Date.now()+"-"+crypto.randomUUID()+"-"+file.name.replace(/[^a-zA-Z0-9._-]/g,"_");const {error}=await sb.storage.from("trean-chat-files").upload(path,file,{contentType:mime,upsert:false});if(error)throw error;current.push({path,name:file.name,mime_type:mime,size:file.size,preview:mime.startsWith("image/")?URL.createObjectURL(file):null});}setAttachments(current);}catch(e:any){setError(e.message||"File upload failed.");}finally{setUploading(false);if(fileRef.current)fileRef.current.value="";}}
 async function startBackgroundLearning(){if(!sb||!user)return;const instruction=draft.trim();if(!instruction){setError("Describe what TREAN AI should learn in the background first.");textareaRef.current?.focus();return;}setTaskStatus("Creating background learning task…");setError("");try{const {data,error}=await sb.functions.invoke("create-learning-task",{body:{title:instruction.slice(0,120),instruction,scope:{sources:["youtube","web","documentation"],autonomous:true}}});if(error)throw error;if(data?.error)throw new Error(data.error);setTaskStatus("Learning task queued. TREAN will continue learning in the background.");setDraft("");}catch(e:any){setTaskStatus("");setError(e.message||"Could not start background learning.");}}
 async function renameSession(s:any){const title=window.prompt("Rename conversation",s.title||"New chat");if(title===null||!title.trim()||!sb)return;const {error}=await sb.from("chat_sessions").update({title:title.trim(),updated_at:new Date().toISOString()}).eq("id",s.id).eq("user_id",user.id);if(error)setError(error.message);else setSessions(v=>v.map(x=>x.id===s.id?{...x,title:title.trim()}:x));}
 async function deleteSession(s:any){if(!window.confirm("Delete this conversation and its messages?"))return;const {error}=await sb.from("chat_sessions").delete().eq("id",s.id).eq("user_id",user.id);if(error){setError(error.message);return;}setSessions(v=>v.filter(x=>x.id!==s.id));if(sessionId===s.id)newChat();}
 async function share(){const text=messages.map(m=>(m.role==="user"?"You":"TREAN AI")+"\\n"+m.content).join("\\n\\n");if(navigator.share){try{await navigator.share({title:sessions.find(s=>s.id===sessionId)?.title||"TREAN AI chat",text});}catch{}}else{await navigator.clipboard?.writeText(text);setTaskStatus("Conversation copied to clipboard.");}}
 function editMessage(m:any){setDraft(m.content);setEditing(m.id);setError("");textareaRef.current?.focus();}
 async function submitFeedback(m:any,rating:number){if(!sb||!m?.id||String(m.id).startsWith("pending"))return;setFeedbackNotice("");let correction:string|null=null;if(rating===-1){const value=window.prompt("What should TREAN AI improve in this answer? (Optional)");correction=value?.trim()||null;}try{const {data,error}=await sb.functions.invoke("trean-chat",{body:{action:"feedback",message_id:m.id,rating,feedback_type:rating===1?"helpful":"needs_improvement",correction}});if(error)throw error;if(data?.error)throw new Error(data.error);setFeedbackState(v=>({...v,[m.id]:rating}));setFeedbackNotice("Thanks — your feedback was saved and can improve future responses.");}catch(e:any){setError(e.message||"Could not save feedback.");}}
 return <div className="chat-workspace chat-functional"><div className="chat-toolbar chat-toolbar-redesign"><button className="chat-toolbar-button" onClick={onToggleSidebar} aria-label="Open navigation menu" aria-expanded={sidebarOpen} title="Open navigation menu"><Menu/></button><button className="chat-model-pill" onClick={()=>setModelMenu(v=>!v)} aria-expanded={modelMenu}><Brain/><span>{selectedModel==="Auto"?"TREAN AI":selectedModel}</span><ChevronDown/></button>{modelMenu&&<div className="model-menu"><div className="model-menu-title">Choose AI mode</div>{[{name:"Auto",logo:"✦",desc:"TREAN AI routes to the best available model"},{name:"GPT",logo:"◉",desc:"OpenAI models"},{name:"Claude",logo:"✳",desc:"Anthropic models"},{name:"Gemini",logo:"✦",desc:"Google models"},{name:"Llama",logo:"🦙",desc:"Open models"},{name:"All models",logo:"∞",desc:"Use multi-model orchestration"}].map(m=><button className={selectedModel===m.name?"selected":""} key={m.name} onClick={()=>{setSelectedModel(m.name);setModelMenu(false);}}><span className="model-logo">{m.logo}</span><span><b>{m.name}</b><small>{m.desc}</small></span>{selectedModel===m.name&&<span className="model-check">✓</span>}</button>)}</div>}<button className="chat-toolbar-button" onClick={()=>setPlusMenu(v=>!v)} title="New chat and tools"><Plus/></button><button className="chat-toolbar-button" onClick={()=>{setHistoryOpen(v=>!v);setHistoryQuery("");}} title="Search chats"><Search/></button>{sessionId&&<button className="chat-toolbar-button" onClick={share} title="Share conversation"><Share2/></button>}</div>
 {plusMenu&&<div className="chat-plus-menu"><button onClick={()=>{newChat();setPlusMenu(false);}}><MessageSquare/> New chat</button><button onClick={()=>{setModelMenu(true);setPlusMenu(false);}}><Brain/> Select model</button><button onClick={()=>{fileRef.current?.click();setPlusMenu(false);}}><Paperclip/> Add files or photos</button><button onClick={()=>{window.dispatchEvent(new CustomEvent("trean-screen",{detail:"Learn from Video"}));setPlusMenu(false);}}><Video/> Learn from video</button><button onClick={()=>{window.dispatchEvent(new CustomEvent("trean-screen",{detail:"Knowledge Base"}));setPlusMenu(false);}}><Library/> Explore knowledge</button><button onClick={()=>{setBackground(true);setPlusMenu(false);textareaRef.current?.focus();}}><Brain/> Background learning</button></div>}{historyOpen&&<div className="chat-history-panel"><div className="history-panel-head"><b>Chat history</b><button onClick={()=>setHistoryOpen(false)}><X/></button></div><div className="url-field"><Search/><input value={historyQuery} onChange={e=>setHistoryQuery(e.target.value)} placeholder="Search conversations"/></div><button className="history-result history-new" onClick={newChat}><Plus/> New chat</button>{sessionLoading?<p className="history-empty">Loading conversations…</p>:sessions.filter(s=>!historyQuery||s.title?.toLowerCase().includes(historyQuery.toLowerCase())).map(s=><div className="history-row" key={s.id}><button className="history-result" onClick={()=>loadMessages(s.id)}><MessageSquare/><span>{s.title||"New chat"}</span></button><button title="Rename" onClick={()=>renameSession(s)}><Pencil/></button><button title="Delete" onClick={()=>deleteSession(s)}><Trash2/></button></div>)}{!sessions.length&&!sessionLoading&&<p className="history-empty">Your conversations will appear here.</p>}</div>}
 <div className="chat-body" ref={chatBodyRef}><div className={messages.length?"chat-welcome chat-welcome-hidden":"chat-welcome"}><div className="welcome-symbol"><Brain/></div><span className="section-kicker">YOUR LEARNING COMPANION</span><h1>{messages.length?"Continue learning.":"What would you like to understand?"}</h1><p>{messages.length?"Ask a follow-up, explore a concept, or learn from your saved sources.":"Ask a question, attach a file, or start with one of your learning sources."}</p>{messages.length===0&&<div className="quick-actions"><button onClick={()=>window.dispatchEvent(new CustomEvent("trean-screen",{detail:"Learn from Video"}))}><Video/><span>Learn from video</span><ArrowUp/></button><button onClick={()=>window.dispatchEvent(new CustomEvent("trean-screen",{detail:"Knowledge Base"}))}><Library/><span>Explore knowledge</span><ArrowUp/></button><button onClick={()=>setDraft("Summarize this content: ")}><FileText/><span>Create a summary</span><ArrowUp/></button><button onClick={()=>{setBackground(v=>!v);setDraft(v=>v||"Learn about ");}}><Brain/><span>Background learning</span><ArrowUp/></button></div>}</div>
 {messages.length>0&&<div className="messages">{messages.map((m,i)=><div className={"message message-"+m.role} key={m.id||i}><div className="message-author">{m.role==="assistant"?<><Brain/><b>TREAN AI</b></>:<b>You</b>}</div><div className={m.role==="user"?"user-message":"assistant-message"}>{m.role==="assistant"?renderAssistantContent(m.content||""):(m.content||"")}{m.status==="loading"&&!m.content&&<div className="thinking-indicator"><span/><span/><span/> Thinking</div>}</div>{m.metadata?.attachments?.length>0&&<div className="message-attachments">{m.metadata.attachments.map((a:any,j:number)=><div key={j}><Paperclip/>{a.name}</div>)}</div>}{m.role==="assistant"&&m.metadata?.sources?.length>0&&<div className="source-list"><b>Sources</b>{m.metadata.sources.map((s:any,j:number)=><div key={j}>{s.source_title||s.citation_label}{s.start_seconds!=null?" · "+Math.floor(s.start_seconds/60)+":"+String(s.start_seconds%60).padStart(2,"0"):""}</div>)}</div>}<div className="message-actions"><button onClick={()=>navigator.clipboard?.writeText(m.content)} title="Copy"><Copy/></button>{m.role==="user"&&<button onClick={()=>editMessage(m)} title="Edit"><Pencil/></button>}{m.role==="assistant"&&m.id&&!String(m.id).startsWith("pending")&&<><button className={feedbackState[m.id]===1?"feedback-selected":""} onClick={()=>submitFeedback(m,1)} title="Helpful"><ThumbsUp/></button><button className={feedbackState[m.id]===-1?"feedback-selected":""} onClick={()=>submitFeedback(m,-1)} title="Needs improvement"><ThumbsDown/></button></>}</div></div>)}</div>}
 <div ref={bottomRef}/></div><div className="composer composer-functional">{attachments.length>0&&<div className="attachment-strip">{attachments.map((a,i)=><div className="attachment-chip" key={a.path}>{a.preview?<img src={a.preview} alt={a.name}/>:<FileText/>}<span>{a.name}</span><button onClick={()=>setAttachments(v=>v.filter((_,n)=>n!==i))}><X/></button></div>)}</div>}{editing&&<div className="editing-banner">Editing as a follow-up <button onClick={()=>setEditing(null)}><X/></button></div>}<textarea ref={textareaRef} value={draft} onChange={e=>{setDraft(e.target.value);const el=e.currentTarget;el.style.height="auto";el.style.height=Math.min(el.scrollHeight,window.innerHeight*0.28)+"px";}} placeholder="Message TREAN AI…" rows={1} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}/><div className="composer-tools"><button title="Open tools" onClick={()=>setPlusMenu(v=>!v)}><Plus/></button><input ref={fileRef} type="file" multiple accept="image/*,.pdf,.txt,.md,.mp3,.wav,.webm,.mp4" hidden onChange={e=>uploadFiles(e.target.files)}/><button className="source-button" onClick={()=>setKnowledgeMenu(v=>!v)} aria-expanded={knowledgeMenu}><BookOpen/> {knowledgeMode} <ChevronDown/></button>{knowledgeMenu&&<div className="knowledge-menu">{["Knowledge","Current video","All sources","No context"].map(x=><button className={knowledgeMode===x?"selected":""} key={x} onClick={()=>{setKnowledgeMode(x);setKnowledgeMenu(false);}}><BookOpen/>{x}{knowledgeMode===x&&<span>✓</span>}</button>)}</div>}<button title="Upload" onClick={()=>fileRef.current?.click()}><Paperclip/></button><button className={"background-toggle "+(background?"background-active":"")} title="Background learning" aria-label="Background learning" onClick={()=>{setBackground(v=>!v);if(!draft.trim())setDraft("Learn about ");}}><Brain/></button><span/><button title="Voice input" disabled><Mic/></button><button className="send" disabled={!draft.trim()||loading||uploading} onClick={send}>{loading?<span className="spinner"/>:<ArrowUp/>}</button></div>{background&&<div className="background-learning-note"><Brain/> Background learning enabled · Describe what to learn, then send to queue the task.</div>}{error&&<div className="chat-error">{error}</div>}{feedbackNotice&&<div className="chat-success">{feedbackNotice}</div>}{taskStatus&&<div className="chat-success">{taskStatus}</div>}</div><small className="disclaimer">TREAN AI uses your saved learning sources when relevant. Check important information.</small></div>}
function VideoPage({go}:{go:(s:Screen)=>void}){const [url,setUrl]=useState("");const [mode,setMode]=useState("Video");const [busy,setBusy]=useState(false);const [notice,setNotice]=useState("");async function startProcessing(){setBusy(true);setNotice("");try{const {createClient}=await import("@supabase/supabase-js");const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);const {data:{session}}=await sb.auth.getSession();if(!session?.user)throw new Error("Sign in before processing learning sources.");if(mode!=="Video")throw new Error("Playlist and channel imports are not yet wired to the video worker. Individual video processing is available.");const {data:meta,error:metaError}=await sb.functions.invoke("youtube-metadata",{body:{url}});if(metaError)throw metaError;if(meta?.error)throw new Error(meta.error);const v=meta.video;if(!v?.youtube_video_id)throw new Error("Could not read video metadata.");const {data:existing}=await sb.from("videos").select("id,status").eq("user_id",session.user.id).eq("youtube_video_id",v.youtube_video_id).maybeSingle();let videoId=existing?.id;if(!videoId){const {data,error}=await sb.from("videos").insert({user_id:session.user.id,youtube_video_id:v.youtube_video_id,title:v.title,channel_name:v.channel_name,description:v.description,thumbnail_url:v.thumbnail_url,youtube_url:v.youtube_url,duration_seconds:v.duration_seconds,status:"pending",processing_stage:"pending",processing_progress:0,transcript_status:"pending",embedding_status:"pending"}).select("id").single();if(error)throw error;videoId=data.id;}sessionStorage.setItem("trean-processing-video",videoId);sessionStorage.setItem("trean-processing-title",v.title||"Video");const {data:worker,error:workerError}=await sb.functions.invoke("process-video",{body:{video_id:videoId}});if(workerError)throw workerError;if(worker?.error)throw new Error(worker.error);go("Processing Video");}catch(e:any){setNotice(e.message||"Video processing could not start.");}finally{setBusy(false);}}return <div className="page-view"><header className="page-header"><span className="section-kicker">LEARNING</span><h1>Learn from Video</h1><p>Turn a YouTube video into a searchable learning workspace.</p></header><div className="page-panel video-panel"><div className="segmented">{["Video","Playlist","Channel"].map(x=><button className={mode===x?"active":""} key={x} onClick={()=>setMode(x)}>{x}</button>)}</div><label className="field-label">YouTube {mode.toLowerCase()} URL</label><div className="url-field"><Link2/><input value={url} onChange={e=>setUrl(e.target.value)} placeholder="Paste a YouTube video URL"/></div><Button kind="primary" disabled={!url.trim()||busy} onClick={startProcessing}>{busy?"Starting processing…":"Process video"} <ArrowUp/></Button>{notice&&<div className="chat-error">{notice}</div>}<div className="what-next"><h3>What you'll get</h3><div className="benefit-grid">{[[FileText,"AI Summary"],[Layers,"Key Concepts"],[MessageSquare,"Ask Questions"],[Library,"Save to Library"]].map(([I,t]:any)=><div key={t}><I/><span>{t}</span></div>)}</div></div></div></div>}
function ProcessingPage({go}:{go:(s:Screen)=>void}){const [video,setVideo]=useState<any>(null);const [error,setError]=useState("");const [videoId,setVideoId]=useState("");useEffect(()=>{const id=sessionStorage.getItem("trean-processing-video");if(!id){setError("No active video processing session. Choose a video to start.");return;}setVideoId(id);const title=sessionStorage.getItem("trean-processing-title")||"Video";setVideo({id,title,status:"pending",processing_stage:"pending",processing_progress:0});let stopped=false;let timer:any;async function check(){try{const {createClient}=await import("@supabase/supabase-js");const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);const {data:{session}}=await sb.auth.getSession();if(!session?.user)return;const {data,error}=await sb.from("videos").select("id,title,status,processing_stage,processing_progress,last_error,transcript_status,embedding_status,processed_at").eq("id",id).eq("user_id",session.user.id).single();if(error)throw error;if(stopped)return;setVideo(data);if(data.status!=="completed"&&data.status!=="failed")timer=setTimeout(check,3500);}catch(e:any){if(!stopped)setError(e.message||"Unable to monitor video processing.");}}check();return()=>{stopped=true;clearTimeout(timer);};},[]);const steps=["Fetching video details","Transcribing content","Creating transcript chunks","Generating embeddings","Extracting knowledge"];const stage=video?.processing_stage||"pending";const progress=Number(video?.processing_progress||0);return <div className="page-view"><header className="page-header"><span className="section-kicker">VIDEO WORKFLOW</span><h1>Processing video</h1><p>{video?.title||"Your video is being transformed into learning material."}</p></header><div className="page-panel processing-panel"><div className="processing-illustration"><Video/></div><h2>{video?.status==="completed"?"Video processed successfully":video?.status==="failed"?"Processing failed":"Building your knowledge"}</h2><p>{video?.status==="completed"?"Transcript, learning chunks and knowledge items are saved to your library.":video?.status==="failed"?video.last_error||"The video worker returned an error.":"TREAN AI is processing the source. This page updates automatically."}</p><div className="progress-track"><span style={{width:progress+"%"}}/></div><div className="progress-label">{progress}% · {stage.replaceAll("_"," ")}</div><div className="process-steps">{steps.map((t,i)=>{const done=video?.status==="completed"||progress>=[10,30,45,60,75][i];return <div className="process-step" key={t}><span className={"step-dot "+(done?"done":"")}>{done?"✓":i+1}</span><span>{t}</span><span className="step-state">{done?"Complete":stage===t.toLowerCase().replaceAll(" ","_")?"In progress":"Queued"}</span></div>})}</div>{error&&<div className="chat-error">{error}</div>}<div className="processing-actions"><Button onClick={()=>go("Learn from Video")}>Process another video</Button><Button kind="primary" onClick={()=>go("History")}>View video history</Button>{video?.status==="completed"&&<Button onClick={()=>go("Chat")}>Ask about this video</Button>}</div></div></div>}
function ProfilePanel({user}:{user:any}){const [name,setName]=useState(user?.user_metadata?.full_name||"");const [busy,setBusy]=useState(false);const [notice,setNotice]=useState("");useEffect(()=>setName(user?.user_metadata?.full_name||""),[user]);async function save(){setBusy(true);setNotice("");try{const {createClient}=await import("@supabase/supabase-js");const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);const {data,error}=await sb.auth.updateUser({data:{full_name:name.trim()}});if(error)throw error;setNotice("Profile updated successfully.");window.dispatchEvent(new CustomEvent("trean-profile-updated",{detail:data.user}));}catch(e:any){setNotice(e.message||"Unable to update profile.");}finally{setBusy(false);}}return <div className="page-panel profile-panel profile-panel-edit"><div className="profile-avatar"><User/></div><h2>{name||user?.email?.split("@")[0]||"Your profile"}</h2><p>Manage your account details and learning identity.</p><div className="profile-fields"><label>Display name<input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"/></label><label>Email address<input value={user?.email||""} readOnly/></label><label>Account ID<input value={user?.id||""} readOnly/></label></div><div className="profile-actions"><Button kind="primary" disabled={busy||!name.trim()} onClick={save}>{busy?"Saving…":"Save profile"}<ArrowUp/></Button><Button onClick={async()=>{const {createClient}=await import("@supabase/supabase-js");const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);await sb.auth.signOut();window.dispatchEvent(new CustomEvent("trean-screen",{detail:"Landing"}));}}>Sign out</Button></div>{notice&&<div className="settings-notice">{notice}</div>}</div>}function SettingsPanel({user}:{user:any}){const [expanded,setExpanded]=useState("Appearance");const [theme,setTheme]=useState("Dark");const [language,setLanguage]=useState("English");const [notifications,setNotifications]=useState(true);const [autoLearn,setAutoLearn]=useState(false);const [model,setModel]=useState("Auto");const [notice,setNotice]=useState("");const [personalizationEnabled,setPersonalizationEnabled]=useState(false);const [personalizationLoading,setPersonalizationLoading]=useState(true);useEffect(()=>{try{const saved=JSON.parse(localStorage.getItem("trean-settings")||"{}");setTheme(saved.theme||"Dark");setLanguage(saved.language||"English");setNotifications(saved.notifications??true);setAutoLearn(saved.autoLearn??false);setModel(saved.model||"Auto");}catch{}},[]);useEffect(()=>{let active=true;(async()=>{if(!user){setPersonalizationLoading(false);return;}try{const {createClient}=await import("@supabase/supabase-js");const client=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);const {data:{session}}=await client.auth.getSession();if(!session?.user||session.user.id!==user.id)return;const {data,error}=await client.from("learning_profiles").select("personalization_enabled").eq("user_id",user.id).maybeSingle();if(error)throw error;if(active)setPersonalizationEnabled(data?.personalization_enabled===true);}catch(e:any){if(active)setNotice(e.message||"Could not load personalization settings.");}finally{if(active)setPersonalizationLoading(false);}})();return()=>{active=false;};},[user?.id]);async function updatePersonalization(enabled:boolean){setPersonalizationLoading(true);setNotice("");try{const {createClient}=await import("@supabase/supabase-js");const client=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);const {data:{session}}=await client.auth.getSession();if(!session?.user)throw new Error("Sign in to change personalization settings.");const {data,error}=await client.functions.invoke("trean-chat",{body:{action:"personalization-settings",enabled}});if(error)throw error;if(data?.error)throw new Error(data.error);setPersonalizationEnabled(enabled);setNotice(enabled?"Personalized learning is enabled for your account.":"Personalized learning is disabled for your account.");}catch(e:any){setNotice(e.message||"Could not update personalization.");}finally{setPersonalizationLoading(false);}}function persist(next:any){const value={theme,language,notifications,autoLearn,model,...next};setTheme(value.theme);setLanguage(value.language);setNotifications(value.notifications);setAutoLearn(value.autoLearn);setModel(value.model);localStorage.setItem("trean-settings",JSON.stringify(value));setNotice("Preference saved on this device.");}const groups=[{name:"Appearance",icon:Settings,summary:"Theme, density and display",content:<div className="settings-options"><label>Workspace theme<select value={theme} onChange={e=>persist({theme:e.target.value})}><option>Dark</option><option>Light</option><option>System</option></select></label><label>Language<select value={language} onChange={e=>persist({language:e.target.value})}><option>English</option><option>Kannada</option><option>Hindi</option></select></label></div>},{name:"Integrations",icon:Link2,summary:"Supabase and connected services",content:<div className="integration-status"><div><span className="status-dot"/><b>Supabase client</b><small>Configured by environment variables</small></div><div><span className="status-dot"/><b>Edge Functions</b><small>Used for chat, video processing and learning tasks</small></div><p>Connection status is checked when each feature is used. No secret keys are displayed here.</p></div>},{name:"AI Model",icon:Brain,summary:"Model preference and orchestration",content:<div className="settings-options"><label>Preferred model<select value={model} onChange={e=>persist({model:e.target.value})}><option>Auto</option><option>GPT</option><option>Claude</option><option>Gemini</option><option>Llama</option><option>All models</option></select></label><p>Provider availability depends on the configured server-side API keys. Auto uses the TREAN AI routing function.</p></div>},{name:"Personalization",icon:Brain,summary:"Let TREAN adapt to your learning style",content:<div className="settings-toggle-row"><span>Personalized learning<small>Use your own learning preferences and feedback to tailor explanations. This stays private to your account.</small></span><button className={"toggle-switch "+(personalizationEnabled?"on":"")} disabled={personalizationLoading||!user} onClick={()=>updatePersonalization(!personalizationEnabled)} aria-pressed={personalizationEnabled}><span/></button></div>},{name:"Account",icon:User,summary:"Your Supabase account",content:<div><p>{user?.email||"Not signed in"}</p><button className="settings-link" onClick={()=>window.dispatchEvent(new CustomEvent("trean-screen",{detail:"Profile"}))}>Edit profile <ArrowUp/></button></div>},{name:"Notifications",icon:Clock,summary:"Learning task updates",content:<div className="settings-toggle-row"><span>Learning task notifications<small>Show task status and completion notices</small></span><button className={"toggle-switch "+(notifications?"on":"")} onClick={()=>persist({notifications:!notifications})} aria-pressed={notifications}><span/></button></div>},{name:"Background learning",icon:Brain,summary:"Autonomous learning preferences",content:<div className="settings-toggle-row"><span>Allow background learning<small>Queue tasks from the chat composer when enabled</small></span><button className={"toggle-switch "+(autoLearn?"on":"")} onClick={()=>persist({autoLearn:!autoLearn})} aria-pressed={autoLearn}><span/></button></div>},{name:"Data & Privacy",icon:Library,summary:"Stored data and account security",content:<div><p>Your chat sessions, learning sources and knowledge items are stored under your Supabase account with access policies.</p><p>Use History to review or delete chats. Use Profile to sign out.</p></div>}];return <div className="settings-list settings-functional">{groups.map(g=><section className={"setting-card "+(expanded===g.name?"expanded":"")} key={g.name}><button className="setting-row setting-trigger" onClick={()=>setExpanded(expanded===g.name?"":g.name)} aria-expanded={expanded===g.name}><g.icon/><span><b>{g.name}</b><small>{g.summary}</small></span><ChevronDown/></button>{expanded===g.name&&<div className="setting-content">{g.content}</div>}</section>)}{notice&&<div className="settings-notice">{notice}</div>}</div>}function BackgroundLearningPanel(){
 const [instruction,setInstruction]=useState("");const [file,setFile]=useState<File|null>(null);const [tasks,setTasks]=useState<any[]>([]);const [busy,setBusy]=useState(false);const [notice,setNotice]=useState("");const [sb,setSb]=useState<any>(null);const [user,setUser]=useState<any>(null);
 useEffect(()=>{let timer:any;let alive=true;(async()=>{try{const {createClient}=await import("@supabase/supabase-js");const client=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);const {data:{session}}=await client.auth.getSession();if(!alive)return;setSb(client);setUser(session?.user||null);if(session?.user){await refresh(client,session.user.id);timer=setInterval(()=>refresh(client,session.user.id),10000);}}catch(e:any){if(alive)setNotice(e.message||"Unable to load learning tasks.");}})();return()=>{alive=false;if(timer)clearInterval(timer);};},[]);
 async function refresh(client:any,uid:string){const {data,error}=await client.from("learning_tasks").select("id,title,instruction,status,stage,progress,error,created_at,updated_at,completed_at,retry_count").eq("user_id",uid).order("created_at",{ascending:false}).limit(50);if(error)setNotice(error.message);else setTasks(data||[]);}
 async function start(){if(!sb||!user)return;const prompt=instruction.trim();if(!prompt&&!file){setNotice("Write what TREAN AI should learn, or upload a PDF.");return;}setBusy(true);setNotice("");try{let documentScope:any={};if(file){if(file.type!=="application/pdf"&&!file.name.toLowerCase().endsWith(".pdf"))throw new Error("Please upload a PDF file.");if(file.size>25*1024*1024)throw new Error("PDF must be 25 MB or smaller.");const path=user.id+"/background-learning/"+Date.now()+"-"+crypto.randomUUID()+"-"+file.name.replace(/[^a-zA-Z0-9._-]/g,"_");const {error:uploadError}=await sb.storage.from("trean-chat-files").upload(path,file,{contentType:"application/pdf",upsert:false});if(uploadError)throw uploadError;documentScope={document_path:path,document_name:file.name,document_bucket:"trean-chat-files",document_mime_type:"application/pdf"};}const fullInstruction=prompt||(file?"Learn the uploaded PDF thoroughly. Extract the main concepts, definitions, examples, formulas, and important details.":"");const {data,error}=await sb.functions.invoke("create-learning-task",{body:{title:(file?file.name+": ":"")+fullInstruction.slice(0,180),instruction:fullInstruction,scope:{sources:file?["uploaded_pdf","web","documentation"]:["web","documentation"],autonomous:true,...documentScope}}});if(error)throw error;if(data?.error)throw new Error(data.error);setNotice("Learning task queued. TREAN AI will work on it in the background.");setInstruction("");setFile(null);const input=document.getElementById("background-learning-pdf") as HTMLInputElement|null;if(input)input.value="";await refresh(sb,user.id);}catch(e:any){setNotice(e.message||"Could not start background learning.");}finally{setBusy(false);}}
 const statusColor=(s:string)=>s==="completed"?"done":s==="failed"?"failed":s==="queued"?"queued":"active";
 return <div className="background-learning-page"><section className="background-learning-create"><div className="background-learning-icon"><Brain/></div><div><span className="section-kicker">AUTONOMOUS LEARNING</span><h2>Teach TREAN something new</h2><p>Upload a PDF, describe a topic, or combine both. TREAN will create a background learning task and keep its progress here.</p></div><label className="background-learning-label">What should TREAN learn?<textarea value={instruction} onChange={e=>setInstruction(e.target.value)} placeholder="Example: Learn operating systems thoroughly. Focus on process scheduling, memory management, deadlocks, definitions, examples, and exam-ready explanations." rows={5}/></label><label className="background-learning-upload"><FileText/><span><b>{file?file.name:"Upload a PDF document"}</b><small>{file?(file.size/1024/1024).toFixed(2)+" MB · PDF selected":"PDF only · Up to 25 MB"}</small><input id="background-learning-pdf" type="file" accept="application/pdf,.pdf" onChange={e=>setFile(e.target.files?.[0]||null)}/></span>{file&&<button type="button" onClick={()=>{setFile(null);const i=document.getElementById("background-learning-pdf") as HTMLInputElement|null;if(i)i.value="";}}>Remove</button>}</label><button className="btn primary background-learning-submit" disabled={busy||(!instruction.trim()&&!file)} onClick={start}>{busy?"Preparing task…":"Learn in background"}<Brain/></button>{notice&&<div className="background-learning-notice">{notice}</div>}</section><section className="background-learning-history"><div className="background-learning-history-head"><div><span className="section-kicker">TASK HISTORY</span><h2>Your background learning</h2><p>Track queued, active, completed and failed learning tasks.</p></div><button className="btn secondary" onClick={()=>sb&&user&&refresh(sb,user.id)}><History/> Refresh</button></div>{!user?<div className="data-empty"><User/><h3>Sign in to use background learning</h3><p>Your learning tasks are saved to your account.</p></div>:tasks.length===0?<div className="data-empty"><Brain/><h3>No background learning yet</h3><p>Your tasks and progress will appear here after you start learning.</p></div>:<div className="background-task-list">{tasks.map(t=><article className="background-task-card" key={t.id}><div className="background-task-top"><span className={"background-task-status "+statusColor(t.status)}>{t.status==="discovering"||t.status==="synthesizing"?"Learning":t.status}</span><span className="background-task-date">{new Date(t.created_at).toLocaleString()}</span></div><h3>{t.title}</h3><p>{t.instruction}</p><div className="background-task-progress"><div><span>{t.stage||t.status}</span><b>{t.progress||0}%</b></div><div className="progress-track"><span style={{width:(Math.min(100,Math.max(0,t.progress||0)))+"%"}}/></div></div>{t.error&&<div className="background-task-error">{t.error}</div>}{t.status==="completed"&&<small className="background-task-completed">Completed {t.completed_at?new Date(t.completed_at).toLocaleString():""}</small>}</article>)}</div>}</section></div>;
}
function Page({screen}:{screen:Screen}){const [query,setQuery]=useState("");const [tab,setTab]=useState("Chats");const [dbRows,setDbRows]=useState<any[]>([]);const [chatRows,setChatRows]=useState<any[]>([]);const [stats,setStats]=useState({videos:0,knowledge:0,chats:0,processed:0});const [dbLoading,setDbLoading]=useState(true);const [dbError,setDbError]=useState("");const [user,setUser]=useState<any>(null);const [url,setUrl]=useState("");const [sourceBusy,setSourceBusy]=useState(false);const [notice,setNotice]=useState("");const [settings,setSettings]=useState({theme:"Dark",language:"English",notifications:false});const meta:any={"Dashboard":["OVERVIEW","Your learning dashboard","Your learning activity and progress, from your actual saved sources."],"Knowledge Base":["LIBRARY","Knowledge Base","Your searchable concepts and notes extracted from learning sources."],"Summaries":["LIBRARY","Summaries","AI-generated takeaways saved from your processed videos and learning content."],"Learning Sources":["LIBRARY","Learning Sources","Videos and learning sources you've added to TREAN AI."],"History":["PERSONAL","History","Return to previous conversations and processed videos."],"Profile":["PERSONAL","Profile","Your authenticated account and learning workspace."],"Settings":["PERSONAL","Settings","Preferences and account controls."]};const m=meta[screen]||meta.Dashboard;
 useEffect(()=>{(async()=>{setDbLoading(true);setDbError("");try{const {createClient}=await import("@supabase/supabase-js");const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);const {data:{session}}=await sb.auth.getSession();if(!session?.user){setUser(null);setDbRows([]);setChatRows([]);setDbLoading(false);return;}setUser(session.user);const uid=session.user.id;if(screen==="Dashboard"){const [v,k,c]=await Promise.all([sb.from("videos").select("id,status",{count:"exact"}).eq("user_id",uid),sb.from("knowledge_items").select("id",{count:"exact"}).eq("user_id",uid),sb.from("chat_sessions").select("id",{count:"exact"}).eq("user_id",uid).is("archived_at",null)]);setStats({videos:v.count||0,processed:(v.data||[]).filter(x=>x.status==="completed").length,knowledge:k.count||0,chats:c.count||0});const {data}=await sb.from("videos").select("id,title,channel_name,thumbnail_url,youtube_url,status,processing_progress,created_at").eq("user_id",uid).order("created_at",{ascending:false}).limit(5);setDbRows(data||[]);}else if(screen==="Knowledge Base"||screen==="Summaries"){let q=sb.from("knowledge_items").select("id,title,content,knowledge_type,subject,topic,tags,video_id,created_at").eq("user_id",uid).order("created_at",{ascending:false}).limit(100);if(screen==="Summaries")q=q.eq("knowledge_type","summary");const {data,error}=await q;if(error)throw error;setDbRows(data||[]);}else if(screen==="Learning Sources"){const {data,error}=await sb.from("videos").select("id,title,channel_name,thumbnail_url,youtube_url,status,processing_progress,processing_stage,last_error,created_at").eq("user_id",uid).order("created_at",{ascending:false}).limit(100);if(error)throw error;setDbRows(data||[]);}else if(screen==="History"){const [ch,v]=await Promise.all([sb.from("chat_sessions").select("id,title,updated_at,last_message_at,created_at").eq("user_id",uid).is("archived_at",null).order("last_message_at",{ascending:false,nullsFirst:false}).limit(100),sb.from("videos").select("id,title,channel_name,thumbnail_url,youtube_url,status,created_at").eq("user_id",uid).order("created_at",{ascending:false}).limit(100)]);setChatRows(ch.data||[]);setDbRows(v.data||[]);}else if(screen==="Profile"){setDbRows([]);} }catch(e:any){setDbError(e.message||"Could not load your data.");}finally{setDbLoading(false);}})();},[screen]);
 async function processSource(){setSourceBusy(true);setNotice("");try{const {createClient}=await import("@supabase/supabase-js");const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);const {data:{session}}=await sb.auth.getSession();if(!session?.user)throw new Error("Sign in to add sources.");const {data:meta,error}=await sb.functions.invoke("youtube-metadata",{body:{url}});if(error)throw error;if(meta?.error)throw new Error(meta.error);const v=meta.video;const {data:existing}=await sb.from("videos").select("id").eq("user_id",session.user.id).eq("youtube_video_id",v.youtube_video_id).maybeSingle();let id=existing?.id;if(!id){const {data,error}=await sb.from("videos").insert({user_id:session.user.id,youtube_video_id:v.youtube_video_id,title:v.title,channel_name:v.channel_name,description:v.description,thumbnail_url:v.thumbnail_url,youtube_url:v.youtube_url,duration_seconds:v.duration_seconds,status:"pending",processing_stage:"pending",processing_progress:0,transcript_status:"pending",embedding_status:"pending"}).select("id").single();if(error)throw error;id=data.id;}sessionStorage.setItem("trean-processing-video",id);sessionStorage.setItem("trean-processing-title",v.title||"Video");const {data:worker,error:workerError}=await sb.functions.invoke("process-video",{body:{video_id:id}});if(workerError)throw workerError;if(worker?.error)throw new Error(worker.error);window.dispatchEvent(new CustomEvent("trean-screen",{detail:"Processing Video"}));}catch(e:any){setNotice(e.message||"Could not add source.");}finally{setSourceBusy(false);}}
 async function deleteChat(id:string){if(!window.confirm("Delete this chat?"))return;const {createClient}=await import("@supabase/supabase-js");const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);const {error}=await sb.from("chat_sessions").delete().eq("id",id).eq("user_id",user.id);if(error)setDbError(error.message);else setChatRows(v=>v.filter(x=>x.id!==id));}
 async function renameChat(s:any){const title=prompt("Rename conversation",s.title||"New chat");if(!title?.trim())return;const {createClient}=await import("@supabase/supabase-js");const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);const {error}=await sb.from("chat_sessions").update({title:title.trim()}).eq("id",s.id).eq("user_id",user.id);if(error)setDbError(error.message);else setChatRows(v=>v.map(x=>x.id===s.id?{...x,title:title.trim()}:x));}
 function EmptyState({icon:Icon,title,description,action,click}:any){return <div className="data-empty"><Icon/><h3>{title}</h3><p>{description}</p>{action&&<Button kind="primary" onClick={click}>{action}<ArrowUp/></Button>}</div>}
 function VideoCard({v}:any){return <button className="data-card video-data-card" onClick={()=>{sessionStorage.setItem("trean-processing-video",v.id);sessionStorage.setItem("trean-processing-title",v.title||"Video");window.dispatchEvent(new CustomEvent("trean-screen",{detail:"Processing Video"}));}}><div className="video-thumb">{v.thumbnail_url?<img src={v.thumbnail_url} alt=""/>:<Video/>}<span className={"status-pill "+(v.status||"pending")}>{v.status||"pending"}</span></div><div className="data-card-content"><h3>{v.title||"Untitled video"}</h3><p>{v.channel_name||"YouTube source"}</p><div className="data-card-meta">{v.status==="completed"?"Processed":"Processing "+(v.processing_progress||0)+"%"}<span>{new Date(v.created_at).toLocaleDateString()}</span></div></div></button>}
 return <div className="page-view"><header className="page-header"><span className="section-kicker">{m[0]}</span><h1>{m[1]}</h1><p>{m[2]}</p></header>{screen==="Background Learning"&&<BackgroundLearningPanel/>}{dbError&&<div className="chat-error">{dbError}</div>}{screen==="Dashboard"&&<>{!user?<EmptyState icon={User} title="Sign in to see your dashboard" description="Your personal learning statistics appear here after you sign in." action="Sign in" click={()=>window.dispatchEvent(new CustomEvent("trean-screen",{detail:"Sign In"}))}/>:<><div className="stats-grid">{[[Video,"Videos learned",stats.processed],[Layers,"Knowledge items",stats.knowledge],[MessageSquare,"Conversations",stats.chats],[Brain,"Topics explored",stats.videos]].map(([I,t,v]:any)=><div className="stat-card" key={t}><I/><span>{t}</span><strong>{dbLoading?"—":v}</strong><small>From your Supabase workspace</small></div>)}</div><div className="page-panel dashboard-recent"><div className="panel-heading"><h3>Recent learning</h3><button onClick={()=>window.dispatchEvent(new CustomEvent("trean-screen",{detail:"Learning Sources"}))}>View all <ArrowUp/></button></div>{dbRows.length?dbRows.map(v=><VideoCard key={v.id} v={v}/>):<EmptyState icon={Video} title="No learning activity yet" description="Process your first educational video to start building your personal knowledge base." action="Learn from video" click={()=>window.dispatchEvent(new CustomEvent("trean-screen",{detail:"Learn from Video"}))}/>}</div></>}</>}{screen==="Learn from Video"&&<div className="page-panel add-source-panel"><div className="source-add-icon"><Video/></div><h2>Add a YouTube video</h2><p>Paste a video URL. TREAN AI will retrieve the metadata, transcript, embeddings and learning concepts.</p><div className="url-field"><Link2/><input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=…"/></div><Button kind="primary" disabled={!url.trim()||sourceBusy} onClick={processSource}>{sourceBusy?"Preparing video…":"Process video"}<ArrowUp/></Button>{notice&&<div className="chat-error">{notice}</div>}<div className="benefit-grid">{[[FileText,"Summary"],[Layers,"Knowledge chunks"],[MessageSquare,"Video-aware AI chat"],[Library,"Searchable library"]].map(([I,t]:any)=><div key={t}><I/><span>{t}</span></div>)}</div></div>}{screen==="Knowledge Base"&&<><div className="library-toolbar"><div className="url-field"><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search concepts and notes"/></div><Button kind="primary" onClick={()=>window.dispatchEvent(new CustomEvent("trean-screen",{detail:"Learn from Video"}))}><Plus/> Add knowledge</Button></div>{dbLoading?<div className="data-loading">Loading your knowledge…</div>:dbRows.filter(x=>!query||x.title?.toLowerCase().includes(query.toLowerCase())||x.content?.toLowerCase().includes(query.toLowerCase())).length?<div className="data-grid">{dbRows.filter(x=>!query||x.title?.toLowerCase().includes(query.toLowerCase())||x.content?.toLowerCase().includes(query.toLowerCase())).map(k=><article className="data-card knowledge-card" key={k.id}><span className="knowledge-type">{k.knowledge_type||"concept"}</span><h3>{k.title}</h3><p>{k.content}</p><div className="data-card-meta">{k.subject||k.topic||"Learning concept"}<button onClick={()=>window.dispatchEvent(new CustomEvent("trean-screen",{detail:"Chat"}))}>Ask TREAN <ArrowUp/></button></div></article>)}</div>:<EmptyState icon={Library} title={query?"No matching concepts":"Your knowledge base is empty"} description="Processed videos and extracted learning concepts will be saved here automatically." action="Process a video" click={()=>window.dispatchEvent(new CustomEvent("trean-screen",{detail:"Learn from Video"}))}/>}</>}{screen==="Summaries"&&<><div className="library-toolbar"><div className="url-field"><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search summaries"/></div><span className="library-count">{dbRows.length} summaries</span></div>{dbLoading?<div className="data-loading">Loading summaries…</div>:dbRows.filter(x=>!query||x.title?.toLowerCase().includes(query.toLowerCase())||x.content?.toLowerCase().includes(query.toLowerCase())).length?<div className="data-grid">{dbRows.filter(x=>!query||x.title?.toLowerCase().includes(query.toLowerCase())||x.content?.toLowerCase().includes(query.toLowerCase())).map(k=><article className="data-card knowledge-card" key={k.id}><span className="knowledge-type">SUMMARY</span><h3>{k.title}</h3><p>{k.content}</p><div className="data-card-meta">{new Date(k.created_at).toLocaleDateString()}<button onClick={()=>window.dispatchEvent(new CustomEvent("trean-screen",{detail:"Chat"}))}>Ask follow-up <ArrowUp/></button></div></article>)}</div>:<EmptyState icon={FileText} title="No summaries yet" description="Video summaries are generated during processing and saved to your learning library." action="Learn from a video" click={()=>window.dispatchEvent(new CustomEvent("trean-screen",{detail:"Learn from Video"}))}/>}</>}{screen==="Learning Sources"&&<><div className="library-toolbar"><div className="url-field"><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search your videos"/></div><Button kind="primary" onClick={()=>window.dispatchEvent(new CustomEvent("trean-screen",{detail:"Learn from Video"}))}><Plus/> Add source</Button></div>{dbLoading?<div className="data-loading">Loading sources…</div>:dbRows.filter(x=>!query||x.title?.toLowerCase().includes(query.toLowerCase())||x.channel_name?.toLowerCase().includes(query.toLowerCase())).length?<div className="data-grid">{dbRows.filter(x=>!query||x.title?.toLowerCase().includes(query.toLowerCase())||x.channel_name?.toLowerCase().includes(query.toLowerCase())).map(v=><VideoCard key={v.id} v={v}/>)}</div>:<EmptyState icon={BookOpen} title="No learning sources" description="Videos you process are saved here with transcript, processing status and extracted knowledge." action="Add video" click={()=>window.dispatchEvent(new CustomEvent("trean-screen",{detail:"Learn from Video"}))}/>}</>}{screen==="History"&&<><div className="library-toolbar"><div className="segmented">{["Chats","Videos"].map(x=><button className={tab===x?"active":""} key={x} onClick={()=>setTab(x)}>{x}</button>)}</div><div className="url-field"><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={tab==="Videos"?"Search processed videos":"Search conversations"}/></div></div>{dbLoading?<div className="data-loading">Loading history…</div>:tab==="Videos"?dbRows.filter(x=>!query||x.title?.toLowerCase().includes(query.toLowerCase())).length?<div className="data-grid">{dbRows.filter(x=>!query||x.title?.toLowerCase().includes(query.toLowerCase())).map(v=><VideoCard key={v.id} v={v}/>)}</div>:<EmptyState icon={Video} title="No video history" description="Processed and in-progress videos will appear here." action="Learn from video" click={()=>window.dispatchEvent(new CustomEvent("trean-screen",{detail:"Learn from Video"}))}/>:chatRows.filter(x=>!query||x.title?.toLowerCase().includes(query.toLowerCase())).length?<div className="history-list">{chatRows.filter(x=>!query||x.title?.toLowerCase().includes(query.toLowerCase())).map(s=><div className="history-list-row" key={s.id}><button className="history-open" onClick={()=>{sessionStorage.setItem("trean-open-chat",s.id);window.dispatchEvent(new CustomEvent("trean-screen",{detail:"Chat"}));}}><MessageSquare/><span><b>{s.title||"New chat"}</b><small>{new Date(s.last_message_at||s.updated_at||s.created_at).toLocaleString()}</small></span></button><button title="Rename" onClick={()=>renameChat(s)}><Pencil/></button><button title="Delete" onClick={()=>deleteChat(s.id)}><Trash2/></button></div>)}</div>:<EmptyState icon={History} title="No chat history" description="Your persistent conversations will appear here after your first message." action="Start chat" click={()=>window.dispatchEvent(new CustomEvent("trean-screen",{detail:"Chat"}))}/>}</>}{screen==="Profile"&&<ProfilePanel user={user}/ >}{screen==="Settings"&&<SettingsPanel user={user}/ >}{screen!=="Dashboard"&&screen!=="Learn from Video"&&screen!=="Knowledge Base"&&screen!=="Summaries"&&screen!=="Learning Sources"&&screen!=="History"&&screen!=="Profile"&&screen!=="Settings"&&<EmptyState icon={Folder} title="Section coming soon" description="This section will be available in a future update."/>}</div>}
class ScreenErrorBoundary extends React.Component<{screen:string;children:React.ReactNode},{error:string|null}>{
 state={error:null as string|null};
 static getDerivedStateFromError(error:unknown){return {error:error instanceof Error?error.message:"This section failed to render."};}
 componentDidCatch(error:unknown){console.error("TREAN screen render failed:",this.props.screen,error);}
 componentDidUpdate(previous:Readonly<{screen:string;children:React.ReactNode}>){if(previous.screen!==this.props.screen&&this.state.error)this.setState({error:null});}
 render(){if(this.state.error)return <div className="page-view"><div className="page-panel" role="alert"><h2>Could not open {this.props.screen}</h2><p>{this.state.error}</p><button className="btn primary" onClick={()=>this.setState({error:null})}>Try again</button></div></div>;return this.props.children;}
}
export default function HomePage(){
 const [screen,setScreen]=useState<Screen>("Landing");
 const [open,setOpen]=useState(false);
 const [sidebarCollapsed,setSidebarCollapsed]=useState(false);
 const [authReady,setAuthReady]=useState(false);
 useEffect(()=>{
  let alive=true;let subscription:any=null;
  const onScreen=(event:any)=>setScreen(event.detail);
  window.addEventListener("trean-screen",onScreen);
  (async()=>{
   try{
    const {createClient}=await import("@supabase/supabase-js");
    const client=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
    const {data:{session},error}=await client.auth.getSession();
    if(error)throw error;
    if(!alive)return;
    const path=window.location.pathname.replace(/\/+$/, "") || "/";
     const routeScreens:Record<string,Screen>={"/login":"Sign In","/register":"Create Account","/signup":"Create Account","/chat":"Chat","/learn":"Learn from Video","/library":"Knowledge Base","/settings":"Settings","/profile":"Profile","/dashboard":"Dashboard"};
     const requestedScreen=routeScreens[path];
     if(requestedScreen==="Sign In"||requestedScreen==="Create Account")setScreen(requestedScreen);
     else if(requestedScreen)setScreen(session?.user?requestedScreen:"Sign In");
     else setScreen(session?.user?"Dashboard":"Landing");
    setAuthReady(true);
    const {data}=client.auth.onAuthStateChange((event,nextSession)=>{
     if(!alive)return;
     // Only an explicit sign-out should send the user back to the public landing page.
     // Other auth events can temporarily carry a null session while Supabase refreshes
     // or restores tokens; do not let those events interrupt in-app navigation.
     if(event==="SIGNED_OUT"){setScreen("Landing");return;}
     if(nextSession?.user&&(event==="SIGNED_IN"||event==="USER_UPDATED"||event==="TOKEN_REFRESHED")){
      setScreen(current=>current==="Landing"?"Dashboard":current);
     }
    });
    subscription=data.subscription;
   }catch(error){
    console.warn("Session restoration failed",error);
    if(alive){setScreen("Landing");setAuthReady(true);}
   }
  })();
  return()=>{alive=false;window.removeEventListener("trean-screen",onScreen);subscription?.unsubscribe();};
 },[]);
 if(!authReady)return <main className="app-shell"><div style={{minHeight:"100vh",display:"grid",placeContent:"center",justifyItems:"center",gap:14,color:"var(--text,#fff)"}}><Logo/><p>Restoring your session…</p></div></main>;
 return <><style jsx global>{`

@media (max-width: 767px) {
  .composer textarea { font-size:16px !important; }
  .chat-body { scroll-behavior:auto; }
}
@media (min-width: 1024px) {
  :root { color-scheme: dark; --trean-bg:#090812; --trean-panel:#11101d; --trean-panel-2:#171426; --trean-line:rgba(177,151,255,.15); --trean-text:#f5f1ff; --trean-muted:#a39bb8; --trean-purple:#9870ff; --trean-purple-2:#7048df; }
  .app-shell { min-height:100vh; background:radial-gradient(ellipse at 72% 0%,rgba(112,72,223,.13),transparent 34%),#090812; color:var(--trean-text); font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; }
  .app-shell button,.app-shell input,.app-shell textarea { font:inherit; }
  .brand { display:flex; align-items:center; gap:11px; color:#f7f3ff; }
  .brand-mark { display:grid; place-items:center; width:39px; height:39px; border:1px solid rgba(171,139,255,.42); border-radius:13px; color:#c6adff; background:linear-gradient(145deg,rgba(147,105,255,.24),rgba(89,57,165,.08)); box-shadow:0 0 28px rgba(129,85,255,.12); }
  .brand-mark svg { width:27px; height:27px; }
  .brand-text { display:flex; flex-direction:column; font-size:17px; font-weight:800; letter-spacing:.11em; line-height:1.05; }
  .brand-text>span { color:#b99aff; display:inline; }
  .brand-text small { margin-top:5px; color:#8e86a4; font-size:8px; letter-spacing:.16em; font-weight:600; }
  .btn { display:inline-flex; align-items:center; justify-content:center; gap:9px; min-height:42px; padding:0 17px; border:1px solid var(--trean-line); border-radius:12px; background:rgba(255,255,255,.035); color:#e9e2fa; font-size:13px; font-weight:650; cursor:pointer; transition:.2s ease; }
  .btn:hover { border-color:rgba(177,151,255,.45); background:rgba(151,112,255,.1); transform:translateY(-1px); }
  .btn.primary { border-color:transparent; color:white; background:linear-gradient(115deg,#8f68f5,#6844cf); box-shadow:0 8px 24px rgba(108,68,207,.25); }
  .btn.primary:hover { background:linear-gradient(115deg,#a17fff,#7956e5); box-shadow:0 12px 30px rgba(108,68,207,.35); }
  .btn:disabled { opacity:.48; cursor:not-allowed; transform:none; }
  .app-shell:not(.marketing-shell) { display:flex; min-height:100vh; }
  .sidebar { position:fixed; inset:0 auto 0 0; z-index:30; display:flex; flex-direction:column; width:264px; padding:24px 17px 17px; border-right:1px solid var(--trean-line); background:rgba(13,11,23,.94); backdrop-filter:blur(22px); }
  .sidebar-head { display:flex; align-items:center; justify-content:space-between; padding:0 8px 28px; }
  .sidebar-head .icon-button { display:none; }
  .sidebar .btn.new-chat { width:100%; justify-content:flex-start; min-height:46px; margin-bottom:12px; padding:0 15px; border:1px solid rgba(167,132,255,.32); border-radius:13px; color:#f8f4ff; background:linear-gradient(110deg,rgba(135,94,244,.23),rgba(99,66,177,.12)); }
  .side-search { display:flex; align-items:center; gap:10px; width:100%; height:42px; padding:0 13px; margin-bottom:24px; border:1px solid rgba(255,255,255,.07); border-radius:11px; background:rgba(255,255,255,.025); color:#a9a1ba; text-align:left; font-size:12px; }
  .side-search svg { width:15px; }
  .side-search kbd { margin-left:auto; padding:3px 6px; border:1px solid rgba(255,255,255,.1); border-radius:5px; color:#827b91; font-size:10px; }
  .side-label { padding:0 11px; margin:18px 0 8px; color:#746b89; font-size:9px; font-weight:800; letter-spacing:.16em; text-transform:uppercase; }
  .nav-item { display:flex; align-items:center; gap:12px; width:100%; min-height:40px; padding:0 12px; margin:2px 0; border:1px solid transparent; border-radius:10px; color:#aaa2ba; background:transparent; font-size:12px; text-align:left; cursor:pointer; transition:.18s ease; }
  .nav-item svg { width:16px; height:16px; }
  .nav-item:hover { color:#f0eaff; background:rgba(255,255,255,.045); }
  .nav-item.selected { color:#e8ddff; border-color:rgba(162,126,255,.19); background:linear-gradient(90deg,rgba(136,96,244,.2),rgba(136,96,244,.055)); box-shadow:inset 2px 0 #a88aff; }
  .sidebar-bottom { margin-top:auto; }
  .sidebar-tip { display:flex; align-items:flex-start; gap:10px; padding:13px; margin-bottom:14px; border:1px solid rgba(163,126,255,.16); border-radius:12px; background:linear-gradient(135deg,rgba(127,88,224,.13),rgba(255,255,255,.018)); color:#a78aff; }
  .sidebar-tip svg { flex:0 0 auto; width:16px; }
  .sidebar-tip p { margin:0; color:#aaa1bd; font-size:11px; line-height:1.55; }
  .profile-row { display:flex; align-items:center; gap:10px; width:100%; padding:12px 9px; border:1px solid rgba(255,255,255,.07); border-radius:12px; background:rgba(255,255,255,.025); color:#eee8fb; text-align:left; }
  .profile-row>span:nth-child(2) { display:flex; flex:1; flex-direction:column; gap:3px; }
  .profile-row b { font-size:11px; }.profile-row small { color:#898197; font-size:10px; }.profile-row>svg { width:14px; color:#8d849e; }
  .user-avatar,.top-avatar { display:grid; place-items:center; width:31px; height:31px; border:1px solid rgba(171,139,255,.25); border-radius:10px; color:#c5adff; background:rgba(140,100,244,.15); }
  .user-avatar svg { width:15px; }
  .main-area { min-height:100vh; width:calc(100% - 264px); margin-left:264px; display:flex; flex-direction:column; }
  .topbar { position:sticky; top:0; z-index:20; display:flex; align-items:center; height:72px; padding:0 42px; border-bottom:1px solid rgba(177,151,255,.1); background:rgba(9,8,18,.78); backdrop-filter:blur(20px); }
  .menu-button { display:none; }
  .model-selector { display:flex; align-items:center; gap:10px; color:#bda6ff; }
  .model-selector svg { width:18px; }.model-selector b { color:#f3edff; font-size:13px; letter-spacing:.02em; }.model-selector span { padding-left:10px; border-left:1px solid rgba(255,255,255,.12); color:#898197; font-size:11px; }
  .top-actions { display:flex; align-items:center; gap:10px; margin-left:auto; }
  .top-actions>button { display:grid; place-items:center; width:36px; height:36px; border:1px solid rgba(255,255,255,.08); border-radius:11px; color:#aaa1ba; background:rgba(255,255,255,.03); cursor:pointer; }
  .top-actions svg { width:16px; }.top-actions .top-avatar { color:#c8b4ff; }
  .page-content { flex:1; width:100%; max-width:1600px; padding:34px 46px 54px; margin:0 auto; }
  .mobile-nav,.sidebar-scrim { display:none!important; }
  .page-view { width:100%; max-width:1220px; margin:0 auto; }
  .page-header { margin:0 0 28px; }
  .section-kicker { color:#a88aff; font-size:10px; font-weight:800; letter-spacing:.18em; }
  .page-header h1 { margin:10px 0 8px; color:#f7f3ff; font-size:32px; font-weight:750; letter-spacing:-.04em; }
  .page-header p { max-width:650px; margin:0; color:#9991aa; font-size:13px; line-height:1.7; }
  .page-panel,.data-card,.stat-card,.knowledge-card,.background-task-card { border:1px solid rgba(177,151,255,.13); border-radius:18px; background:linear-gradient(145deg,rgba(25,21,40,.92),rgba(15,13,25,.96)); box-shadow:0 18px 50px rgba(0,0,0,.18); }
  .page-panel { padding:28px; }
  .video-panel { max-width:850px; padding:34px; }
  .segmented { display:inline-flex; gap:4px; padding:4px; margin-bottom:28px; border:1px solid rgba(255,255,255,.08); border-radius:12px; background:rgba(0,0,0,.2); }
  .segmented button { min-width:92px; padding:9px 15px; border:0; border-radius:8px; color:#938ba3; background:transparent; font-size:12px; cursor:pointer; }
  .segmented button.active { color:#f3edff; background:rgba(139,99,244,.22); box-shadow:inset 0 0 0 1px rgba(166,135,255,.18); }
  .field-label { display:block; margin:0 0 9px; color:#d9d0ea; font-size:12px; font-weight:650; }
  .url-field { display:flex; align-items:center; gap:12px; min-height:52px; padding:0 15px; border:1px solid rgba(177,151,255,.2); border-radius:12px; background:rgba(5,4,12,.55); color:#a78aff; }
  .url-field svg { width:17px; flex:0 0 auto; }.url-field input { flex:1; min-width:0; border:0; outline:0; color:#f5f0ff; background:transparent; font-size:13px; }
  .video-panel>.btn { margin-top:18px; min-width:180px; }
  .what-next { margin-top:34px; padding-top:24px; border-top:1px solid rgba(255,255,255,.08); }.what-next h3 { margin:0 0 16px; font-size:14px; }
  .benefit-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }.benefit-grid>div { display:flex; align-items:center; gap:9px; padding:14px; border:1px solid rgba(255,255,255,.07); border-radius:11px; color:#b9afd0; background:rgba(255,255,255,.025); font-size:11px; }.benefit-grid svg { width:16px; color:#aa8aff; }
  .chat-workspace { display:grid; grid-template-columns:minmax(0,1fr) 270px; gap:22px; min-height:calc(100vh - 150px); }
  .chat-functional { display:flex; flex-direction:column; min-width:0; min-height:calc(100vh - 150px); border:1px solid rgba(177,151,255,.13); border-radius:18px; overflow:hidden; background:rgba(16,14,26,.75); }
  .chat-toolbar { display:flex; align-items:center; gap:10px; min-height:58px; padding:0 20px; border-bottom:1px solid rgba(255,255,255,.07); }
  .chat-toolbar-button,.chat-toolbar button { display:inline-flex; align-items:center; gap:7px; min-height:34px; padding:0 10px; border:1px solid rgba(255,255,255,.08); border-radius:9px; color:#aaa1ba; background:rgba(255,255,255,.025); font-size:11px; }
  .chat-model-pill,.model-selector { color:#c5aeff; }
  .chat-body { flex:1; min-height:420px; max-height:calc(100vh - 330px); overflow:auto; padding:30px clamp(28px,6vw,100px); scrollbar-color:#51436f transparent; }
  .messages { width:100%; max-width:850px; margin:0 auto; }
  .message-author { display:flex; align-items:center; gap:9px; margin-bottom:9px; color:#c5b5e4; font-size:11px; font-weight:700; }
  .message-author svg { width:16px; color:#a88aff; }
  .message { margin:0 0 28px; color:#e9e3f5; font-size:13px; line-height:1.8; }
  .markdown-response { color:#e5deef; font-size:13px; line-height:1.8; overflow-wrap:anywhere; }.markdown-chunk h1,.markdown-chunk h2,.markdown-chunk h3 { margin:22px 0 10px; color:#f5f0ff; letter-spacing:-.02em; }.markdown-chunk p { margin:0 0 13px; }.markdown-chunk li { margin:5px 0; }.markdown-chunk blockquote { margin:15px 0; padding:12px 16px; border-left:3px solid #9870ff; border-radius:0 9px 9px 0; color:#bcb2d0; background:rgba(139,99,244,.08); }.markdown-table-wrap { overflow:auto; margin:16px 0; }.markdown-chunk table { width:100%; border-collapse:collapse; }.markdown-chunk th,.markdown-chunk td { padding:10px 12px; border:1px solid rgba(255,255,255,.1); text-align:left; }.markdown-chunk th { background:rgba(139,99,244,.12); }
  .composer { position:sticky; bottom:0; width:min(100% - 42px,900px); margin:0 auto 20px; padding:12px; border:1px solid rgba(177,151,255,.23); border-radius:17px; background:rgba(25,21,39,.96); box-shadow:0 12px 40px rgba(0,0,0,.35); }
  .composer textarea { width:100%; min-height:58px; max-height:180px; resize:vertical; padding:10px 12px; border:0; outline:0; color:#f4efff; background:transparent; font-size:13px; }
  .composer-tools { display:flex; align-items:center; gap:8px; }.composer-tools button { display:inline-flex; align-items:center; gap:7px; min-height:34px; padding:0 10px; border:1px solid rgba(255,255,255,.08); border-radius:9px; color:#aaa1ba; background:rgba(255,255,255,.035); font-size:11px; }.composer-tools .send,.send { margin-left:auto; width:37px; height:37px; display:grid; place-items:center; border:0; border-radius:11px; color:white; background:linear-gradient(135deg,#9870ff,#7048df); }
  .chat-history-panel { border:1px solid rgba(177,151,255,.13); border-radius:16px; background:rgba(18,15,29,.8); overflow:hidden; }.history-panel-head { display:flex; align-items:center; justify-content:space-between; padding:17px; border-bottom:1px solid rgba(255,255,255,.07); color:#e9e1f7; font-size:12px; }.history-list { padding:8px; }.history-list-row,.history-row { display:flex; align-items:center; gap:7px; padding:10px; border-bottom:1px solid rgba(255,255,255,.045); }.history-open { display:flex; flex:1; min-width:0; align-items:center; gap:9px; border:0; color:#d7cfea; background:transparent; text-align:left; }.history-open span { display:flex; flex-direction:column; min-width:0; gap:4px; }.history-open b { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-size:11px; }.history-open small { color:#827991; font-size:9px; }.history-list-row>button:not(.history-open) { border:0; color:#8e849f; background:transparent; }
  .stats-grid { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:15px; margin:0 0 24px; }.stat-card { padding:20px; }.stat-card>div:first-child { color:#9e94b0; font-size:11px; }.stat-card strong { display:block; margin-top:12px; color:#f4efff; font-size:30px; letter-spacing:-.04em; }.stat-card svg { color:#ac8aff; }
  .data-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:17px; }.data-card { overflow:hidden; }.data-card-content { padding:17px; }.data-card h3,.knowledge-card h3 { margin:0 0 7px; color:#eee8fa; font-size:14px; }.data-card p,.data-card-meta { color:#938aa4; font-size:11px; line-height:1.6; }.data-card-meta { display:flex; gap:12px; margin-top:12px; }.video-thumb { width:100%; aspect-ratio:16/9; object-fit:cover; background:#171326; }
  .library-toolbar { display:flex; align-items:center; justify-content:space-between; gap:15px; margin:0 0 20px; }.library-count { color:#938aa4; font-size:11px; }.knowledge-card { padding:20px; }.knowledge-type { color:#ac8aff; font-size:9px; letter-spacing:.12em; text-transform:uppercase; }.knowledge-card p { color:#a69db5; font-size:12px; line-height:1.7; }
  .processing-panel { max-width:850px; text-align:center; padding:42px; }.processing-illustration { display:grid; place-items:center; width:66px; height:66px; margin:0 auto 20px; border:1px solid rgba(171,139,255,.25); border-radius:20px; color:#b89aff; background:rgba(139,99,244,.13); }.processing-illustration svg { width:28px; }.processing-panel h2 { margin:0 0 9px; font-size:22px; }.processing-panel>p { color:#a39ab3; font-size:12px; }.progress-track { height:8px; margin:25px 0 10px; border-radius:20px; background:#282238; overflow:hidden; }.progress-track span { display:block; height:100%; border-radius:20px; background:linear-gradient(90deg,#7048df,#b294ff); }.progress-label { color:#bda8ff; font-size:11px; }.process-steps { max-width:580px; margin:25px auto; text-align:left; }.process-step { display:flex; align-items:center; gap:12px; padding:11px 0; border-bottom:1px solid rgba(255,255,255,.06); color:#c6bdd6; font-size:12px; }.step-dot { display:grid; place-items:center; width:24px; height:24px; border-radius:50%; color:#9a91a8; background:#282238; }.step-dot.done { color:#fff; background:#7452d3; }.step-state { margin-left:auto; color:#8d849e; font-size:10px; }.processing-actions { display:flex; justify-content:center; flex-wrap:wrap; gap:10px; margin-top:24px; }
  .profile-panel,.settings-functional,.settings-list { max-width:850px; padding:25px; border:1px solid var(--trean-line); border-radius:16px; background:rgba(20,17,31,.9); }.profile-fields,.settings-list { display:grid; gap:13px; }.profile-fields label,.setting-row { display:flex; flex-direction:column; gap:8px; color:#c9c0d8; font-size:12px; }.profile-fields input,.setting-row input { min-height:43px; padding:0 12px; border:1px solid rgba(177,151,255,.2); border-radius:10px; color:#f4efff; background:#0e0c18; }.setting-row { flex-direction:row; align-items:center; justify-content:space-between; padding:15px 0; border-bottom:1px solid rgba(255,255,255,.06); }
  .empty-state,.data-empty { display:grid; justify-items:center; padding:65px 25px; text-align:center; }.empty-icon { display:grid; place-items:center; width:58px; height:58px; border:1px solid rgba(171,139,255,.22); border-radius:18px; color:#b89aff; background:rgba(139,99,244,.12); }.empty-state h2,.data-empty h3 { margin:17px 0 7px; color:#f0eaff; font-size:19px; }.empty-state p,.data-empty p { max-width:430px; color:#968da7; font-size:12px; line-height:1.7; }
  .chat-error,.auth-notice,.settings-notice { padding:11px 14px; border:1px solid rgba(248,112,142,.2); border-radius:10px; color:#ffb6c5; background:rgba(180,45,78,.1); font-size:11px; }.chat-success { color:#9be2c0; }
  .landing { min-height:100vh; overflow:hidden; background:radial-gradient(ellipse at 75% 20%,rgba(117,78,225,.19),transparent 34%),#090812; color:#f5f0ff; }
  .landing-header { display:flex; align-items:center; height:86px; max-width:1380px; padding:0 48px; margin:0 auto; border-bottom:1px solid rgba(255,255,255,.07); }.landing-header nav { display:flex; gap:34px; margin:auto; }.landing-header nav a { color:#a69db6; font-size:12px; text-decoration:none; }.landing-header nav a:hover { color:#eee6ff; }.header-actions { display:flex; gap:10px; }
  .hero { display:grid; grid-template-columns:1.05fr .95fr; align-items:center; gap:50px; max-width:1280px; min-height:640px; padding:80px 50px 95px; margin:0 auto; }.hero-copy { max-width:590px; }.eyebrow-pill { display:inline-flex; align-items:center; gap:8px; padding:9px 13px; border:1px solid rgba(172,140,255,.22); border-radius:30px; color:#c1aaff; background:rgba(139,99,244,.09); font-size:9px; letter-spacing:.13em; }.eyebrow-pill svg { width:14px; }.hero h1 { margin:25px 0 18px; font-size:clamp(48px,5.2vw,76px); line-height:1.04; letter-spacing:-.065em; }.hero h1 span { color:#ad8cff; text-shadow:0 0 40px rgba(151,112,255,.3); }.hero-copy>p { max-width:510px; color:#a69db6; font-size:15px; line-height:1.8; }.hero-buttons { display:flex; gap:12px; margin-top:28px; }.hero-note { display:flex; align-items:center; gap:9px; margin-top:30px; color:#817990; font-size:11px; }.note-dot { width:7px; height:7px; border-radius:50%; background:#a98aff; box-shadow:0 0 12px #9870ff; }
  .hero-art { position:relative; display:grid; place-items:center; min-height:470px; }.art-orbit { position:absolute; width:390px; height:390px; border:1px solid rgba(166,130,255,.22); border-radius:50%; box-shadow:0 0 65px rgba(111,75,205,.08),inset 0 0 50px rgba(111,75,205,.06); }.orbit-two { width:285px; height:285px; border-style:dashed; border-color:rgba(166,130,255,.28); }.art-core { z-index:2; display:grid; place-items:center; gap:10px; width:150px; height:150px; border:1px solid rgba(190,164,255,.5); border-radius:40px; color:#d2c0ff; background:linear-gradient(145deg,rgba(137,98,242,.32),rgba(42,30,69,.85)); box-shadow:0 0 80px rgba(135,94,244,.3); transform:rotate(-8deg); }.art-core svg { width:44px; height:44px; }.art-core span,.art-node span { font-size:9px; letter-spacing:.17em; }.art-node { position:absolute; z-index:3; display:flex; align-items:center; gap:9px; padding:12px 15px; border:1px solid rgba(174,144,255,.28); border-radius:13px; color:#c9b8f4; background:rgba(24,19,39,.92); box-shadow:0 12px 40px rgba(0,0,0,.3); }.art-node svg { width:17px; }.node-video { top:48px; left:13%; }.node-notes { top:100px; right:7%; }.node-chat { bottom:80px; left:10%; }.node-library { right:8%; bottom:60px; }
  .feature-section,.how-section { max-width:1280px; padding:75px 50px; margin:0 auto; border-top:1px solid rgba(255,255,255,.07); }.section-head { max-width:600px; margin-bottom:32px; }.section-head>span { color:#a98aff; font-size:9px; font-weight:800; letter-spacing:.16em; }.section-head h2,.how-section h2 { margin:12px 0; font-size:34px; letter-spacing:-.04em; }.section-head p,.workflow p { color:#9990aa; font-size:13px; line-height:1.7; }.feature-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; }.feature-card { position:relative; min-height:190px; padding:22px; border:1px solid rgba(174,144,255,.14); border-radius:16px; background:linear-gradient(145deg,rgba(30,24,47,.8),rgba(14,12,23,.85)); }.feature-icon { display:grid; place-items:center; width:39px; height:39px; border-radius:12px; color:#b99aff; background:rgba(139,99,244,.15); }.feature-icon svg { width:19px; }.feature-card h3 { margin:18px 0 8px; font-size:14px; }.feature-card p { color:#9990aa; font-size:11px; line-height:1.65; }.feature-arrow { position:absolute; top:24px; right:22px; width:15px; color:#8974b6; }.how-section { display:grid; grid-template-columns:.8fr 1.2fr; gap:60px; }.workflow { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }.workflow>div { padding:19px; border-left:1px solid rgba(171,139,255,.28); }.step { display:grid; place-items:center; width:28px; height:28px; border-radius:9px; color:#d9caff; background:rgba(139,99,244,.2); }.workflow h3 { margin:17px 0 8px; font-size:13px; }.landing footer { display:flex; align-items:center; gap:20px; max-width:1280px; padding:25px 50px 35px; margin:0 auto; border-top:1px solid rgba(255,255,255,.07); }.landing footer>span { color:#817990; font-size:11px; }.landing footer .btn { margin-left:auto; }
  /* Slightly more compact desktop sizing only */
  .sidebar{width:248px;padding:21px 15px 15px}
  .main-area{width:calc(100% - 248px);margin-left:248px}
  .sidebar-head{padding-bottom:23px}
  .sidebar .btn.new-chat{min-height:43px}
  .nav-item{min-height:38px;font-size:11.5px}
  .side-label{margin:15px 0 7px}
  .topbar{height:66px;padding:0 36px}
  .page-content{max-width:1500px;padding:29px 39px 46px}
  .page-view{max-width:1160px}
  .page-header{margin-bottom:24px}
  .page-header h1{font-size:30px}
  .page-panel{padding:25px}
  .video-panel{padding:30px}
  .chat-workspace{grid-template-columns:minmax(0,1fr) 250px;gap:19px}
  .chat-functional{min-height:calc(100vh - 140px)}
  .chat-body{padding:27px clamp(24px,5.5vw,88px)}
  .composer{width:min(100% - 38px,860px);margin-bottom:17px}
  .landing-header{height:80px;padding:0 42px}
  .hero{min-height:600px;gap:44px;padding:72px 44px 84px}
  .hero h1{font-size:clamp(45px,4.9vw,71px)}
  .hero-art{min-height:440px}
  .art-orbit{width:365px;height:365px}
  .orbit-two{width:265px;height:265px}
  .art-core{width:140px;height:140px}
  .feature-section,.how-section{padding:68px 44px}
  .feature-card{min-height:180px;padding:20px}
  .how-section{gap:52px}
  .workflow{gap:17px}
  .workflow>div{padding:17px}
  .landing footer{padding:23px 44px 31px}

  /* Desktop-only compact authentication screens */
  .auth-page{min-height:100vh;padding:16px 24px;align-items:center;justify-content:center}
  .auth-page .auth-card{width:min(100% - 48px,420px);max-width:420px;padding:20px 26px;gap:8px;border-radius:20px}
  .auth-page .auth-card>.brand{margin-bottom:0}
  .auth-page .auth-card .section-kicker{margin-top:0}
  .auth-page .auth-card h1{margin:1px 0 0;font-size:26px;line-height:1.14}
  .auth-page .auth-card>p{margin:0 0 3px;font-size:12px}
  .auth-page .auth-card label{margin-top:1px;gap:4px;font-size:11px}
  .auth-page .auth-card input{min-height:43px;padding:9px 11px;font-size:12px}
  .auth-page .auth-card .oauth-button{min-height:43px;margin:1px 0;font-size:12px}
  .auth-page .auth-card .auth-divider{margin:2px 0}
  .auth-page .auth-card .forgot-button{margin:0}
  .auth-page .auth-card .auth-switch,.auth-page .auth-card .auth-legal{margin-top:3px;font-size:11px}


/* Desktop-only ChatGPT-inspired workspace layout. Mobile styles remain untouched. */
@media (min-width: 768px) {
  .app-shell:not(.marketing-shell) {
    min-height: 100dvh !important;
    height: 100dvh;
    overflow: hidden;
  }
  .app-shell:not(.marketing-shell) .sidebar {
    position: fixed !important;
    inset: 0 auto 0 0 !important;
    width: 276px !important;
    height: 100dvh !important;
    max-height: 100dvh !important;
    display: flex !important;
    flex-direction: column !important;
    overflow-x: hidden !important;
    overflow-y: auto !important;
    overscroll-behavior: contain;
    scrollbar-width: thin;
    scrollbar-color: rgba(167,139,250,.35) transparent;
    padding: 18px 14px 14px !important;
  }
  .app-shell:not(.marketing-shell) .sidebar-head { flex: 0 0 auto; padding: 4px 8px 20px !important; }
  .app-shell:not(.marketing-shell) .sidebar > .btn.new-chat { flex: 0 0 auto; }
  .app-shell:not(.marketing-shell) .side-search { flex: 0 0 auto; margin-bottom: 10px !important; }
  .app-shell:not(.marketing-shell) .sidebar > div:not(.sidebar-bottom) { flex: 0 0 auto; }
  .app-shell:not(.marketing-shell) .sidebar-bottom { flex: 0 0 auto; margin-top: 22px !important; }
  .app-shell:not(.marketing-shell) .main-area {
    width: calc(100% - 276px) !important;
    height: 100dvh !important;
    min-height: 0 !important;
    margin-left: 276px !important;
    overflow: hidden !important;
    display: flex !important;
    flex-direction: column !important;
  }
  .app-shell:not(.marketing-shell) .topbar {
    flex: 0 0 62px;
    height: 62px !important;
    min-height: 62px;
    padding: 0 28px !important;
    background: rgba(9,8,18,.88) !important;
    border-bottom: 1px solid rgba(177,151,255,.12) !important;
  }
  .app-shell:not(.marketing-shell) .page-content {
    flex: 1 1 auto !important;
    min-height: 0 !important;
    height: calc(100dvh - 62px);
    width: 100% !important;
    max-width: none !important;
    padding: 0 !important;
    margin: 0 !important;
    overflow: hidden !important;
  }
  .app-shell:not(.marketing-shell) .chat-workspace {
    display: flex !important;
    flex-direction: column !important;
    width: 100% !important;
    height: 100% !important;
    min-height: 0 !important;
    max-height: none !important;
    gap: 0 !important;
    padding: 0 !important;
    margin: 0 !important;
  }
  .app-shell:not(.marketing-shell) .chat-functional {
    position: relative !important;
    display: flex !important;
    flex: 1 1 auto !important;
    flex-direction: column !important;
    width: 100% !important;
    height: 100% !important;
    min-height: 0 !important;
    max-height: none !important;
    border: 0 !important;
    border-radius: 0 !important;
    overflow: hidden !important;
    background: transparent !important;
    box-shadow: none !important;
  }
  .app-shell:not(.marketing-shell) .chat-toolbar {
    position: sticky !important;
    top: 0;
    z-index: 15;
    flex: 0 0 58px;
    min-height: 58px !important;
    width: 100%;
    padding: 0 clamp(20px,4vw,56px) !important;
    border-bottom: 1px solid rgba(177,151,255,.1) !important;
    background: rgba(9,8,18,.76) !important;
    backdrop-filter: blur(18px);
  }
  .app-shell:not(.marketing-shell) .chat-toolbar-button {
    display: inline-flex !important;
    align-items: center;
    justify-content: center;
    min-width: 38px;
    min-height: 38px !important;
    padding: 0 11px !important;
    border: 1px solid rgba(177,151,255,.14) !important;
    border-radius: 11px !important;
    color: #c4b5e8 !important;
    background: rgba(255,255,255,.035) !important;
    cursor: pointer;
    transition: background .18s ease,border-color .18s ease;
  }
  .app-shell:not(.marketing-shell) .chat-toolbar-button:hover,
  .app-shell:not(.marketing-shell) .chat-model-pill:hover {
    border-color: rgba(177,151,255,.4) !important;
    background: rgba(151,112,255,.12) !important;
  }
  .app-shell:not(.marketing-shell) .chat-model-pill {
    display: inline-flex !important;
    align-items: center;
    gap: 9px;
    min-height: 39px !important;
    padding: 0 13px !important;
    border: 1px solid rgba(177,151,255,.17) !important;
    border-radius: 11px !important;
    color: #eee7ff !important;
    background: rgba(255,255,255,.035) !important;
    font-size: 12px;
    font-weight: 650;
    cursor: pointer;
  }
  .app-shell:not(.marketing-shell) .chat-model-pill svg { width: 16px; height: 16px; }
  .app-shell:not(.marketing-shell) .chat-toolbar > .chat-toolbar-button:nth-last-child(3) { margin-left: auto; }
  .app-shell:not(.marketing-shell) .chat-body {
    flex: 1 1 auto !important;
    width: 100% !important;
    min-height: 0 !important;
    max-height: none !important;
    height: auto !important;
    overflow-x: hidden !important;
    overflow-y: auto !important;
    padding: 42px 28px 26px !important;
    scrollbar-width: thin;
    scrollbar-color: rgba(167,139,250,.3) transparent;
  }
  .app-shell:not(.marketing-shell) .chat-welcome {
    width: min(100%, 850px);
    margin: 7vh auto 28px !important;
  }
  .app-shell:not(.marketing-shell) .chat-welcome h1 {
    font-size: clamp(28px,3vw,38px) !important;
    letter-spacing: -.045em !important;
  }
  .app-shell:not(.marketing-shell) .chat-welcome > p {
    max-width: 640px;
    margin-left: auto;
    margin-right: auto;
    font-size: 14px !important;
  }
  .app-shell:not(.marketing-shell) .quick-actions {
    width: min(100%, 720px);
    grid-template-columns: repeat(2,minmax(0,1fr)) !important;
    gap: 12px !important;
    margin: 32px auto 12px !important;
  }
  .app-shell:not(.marketing-shell) .quick-actions button {
    min-height: 66px;
    padding: 15px 17px !important;
    border: 1px solid rgba(177,151,255,.16) !important;
    border-radius: 14px !important;
    background: rgba(255,255,255,.025) !important;
    font-size: 12px !important;
  }
  .app-shell:not(.marketing-shell) .quick-actions button:hover {
    border-color: rgba(177,151,255,.42) !important;
    background: rgba(151,112,255,.08) !important;
  }
  .app-shell:not(.marketing-shell) .messages {
    width: min(100%, 850px) !important;
    max-width: 850px !important;
    margin: 0 auto !important;
  }
  .app-shell:not(.marketing-shell) .message { margin-bottom: 30px !important; font-size: 14px !important; }
  .app-shell:not(.marketing-shell) .assistant-message { font-size: 15px !important; line-height: 1.8 !important; }
  .app-shell:not(.marketing-shell) .user-message {
    max-width: min(78%,720px) !important;
    padding: 12px 16px !important;
    border: 1px solid rgba(177,151,255,.15);
    border-radius: 18px 18px 5px 18px;
    background: rgba(116,84,178,.18);
  }
  .app-shell:not(.marketing-shell) .composer {
    position: relative !important;
    flex: 0 0 auto;
    width: min(calc(100% - 48px), 850px) !important;
    max-width: 850px;
    margin: 0 auto 8px !important;
    padding: 14px 15px 10px !important;
    border: 1px solid rgba(177,151,255,.23) !important;
    border-radius: 18px !important;
    background: rgba(24,20,37,.96) !important;
    box-shadow: 0 14px 42px rgba(0,0,0,.28) !important;
  }
  .app-shell:not(.marketing-shell) .composer textarea {
    min-height: 42px !important;
    max-height: 180px !important;
    padding: 9px 10px !important;
    font-size: 14px !important;
  }
  .app-shell:not(.marketing-shell) .composer-tools { gap: 8px !important; }
  .app-shell:not(.marketing-shell) .composer-tools button {
    min-width: 36px;
    min-height: 36px !important;
    justify-content: center;
    border-radius: 10px !important;
  }
  .app-shell:not(.marketing-shell) .composer-tools .source-button { min-width: auto; padding: 0 12px !important; }
  .app-shell:not(.marketing-shell) .disclaimer {
    flex: 0 0 auto;
    width: min(calc(100% - 48px),850px);
    margin: 0 auto 12px !important;
    text-align: center;
    color: #817990 !important;
  }
  .app-shell:not(.marketing-shell) .chat-history-panel {
    position: absolute !important;
    z-index: 40 !important;
    top: 66px !important;
    left: 20px !important;
    width: min(360px,calc(100% - 40px)) !important;
    max-height: min(72vh,680px) !important;
    overflow-y: auto !important;
    border: 1px solid rgba(177,151,255,.22) !important;
    border-radius: 15px !important;
    background: #151221 !important;
    box-shadow: 0 22px 70px rgba(0,0,0,.55) !important;
  }
  .app-shell:not(.marketing-shell) .chat-plus-menu,
  .app-shell:not(.marketing-shell) .model-menu,
  .app-shell:not(.marketing-shell) .knowledge-menu {
    z-index: 50 !important;
    box-shadow: 0 22px 70px rgba(0,0,0,.48) !important;
  }
  .app-shell:not(.marketing-shell) .sidebar::-webkit-scrollbar,
  .app-shell:not(.marketing-shell) .chat-body::-webkit-scrollbar { width: 7px; }
  .app-shell:not(.marketing-shell) .sidebar::-webkit-scrollbar-thumb,
  .app-shell:not(.marketing-shell) .chat-body::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: rgba(167,139,250,.22);
  }
  .app-shell.marketing-shell .auth-page {
    min-height: 100dvh !important;
    width: 100%;
    display: grid !important;
    place-items: center !important;
    padding: 42px 24px !important;
    background: radial-gradient(ellipse at 50% 0%,rgba(115,78,210,.2),transparent 48%),#090812 !important;
  }
  .app-shell.marketing-shell .auth-page .auth-card {
    width: min(100%,460px) !important;
    max-width: 460px !important;
    padding: 34px 38px !important;
    gap: 12px !important;
    border: 1px solid rgba(177,151,255,.2) !important;
    border-radius: 22px !important;
    background: rgba(18,15,29,.96) !important;
    box-shadow: 0 28px 90px rgba(0,0,0,.42) !important;
  }
  .app-shell.marketing-shell .auth-page .auth-card > .brand { margin-bottom: 12px !important; }
  .app-shell.marketing-shell .auth-page .auth-card h1 { font-size: 30px !important; line-height: 1.2 !important; }
  .app-shell.marketing-shell .auth-page .auth-card > p { margin-bottom: 10px !important; font-size: 13px !important; }
  .app-shell.marketing-shell .auth-page .auth-card label { display: block; margin: 12px 0 !important; font-size: 12px !important; }
  .app-shell.marketing-shell .auth-page .auth-card input { min-height: 48px !important; padding: 12px 14px !important; border-radius: 11px !important; font-size: 13px !important; }
  .app-shell.marketing-shell .auth-page .auth-card .oauth-button { min-height: 48px !important; border-radius: 11px !important; font-size: 13px !important; }
  .app-shell.marketing-shell .auth-page .auth-card .btn.primary { min-height: 48px !important; margin-top: 8px; }
  .app-shell.marketing-shell .auth-page .auth-card .auth-divider { margin: 12px 0 !important; }
}


@media (min-width: 1024px) {
  .app-shell:not(.marketing-shell) .sidebar,
  .app-shell:not(.marketing-shell) .main-area {
    transition: width .22s ease, margin-left .22s ease, transform .22s ease;
  }
  .app-shell:not(.marketing-shell).sidebar-collapsed .sidebar {
    transform: translateX(-100%);
    visibility: hidden;
  }
  .app-shell:not(.marketing-shell).sidebar-collapsed .main-area {
    width: 100% !important;
    margin-left: 0 !important;
  }
}


/* Desktop chat: a single ChatGPT-style conversation surface, not nested dashboard cards. */
@media (min-width: 768px) {
  .app-shell.chat-screen:not(.marketing-shell) {
    height: 100dvh !important;
    min-height: 100dvh !important;
    overflow: hidden !important;
  }
  .app-shell.chat-screen:not(.marketing-shell) .main-area {
    height: 100dvh !important;
    min-height: 0 !important;
    overflow: hidden !important;
  }
  .app-shell.chat-screen:not(.marketing-shell) .topbar {
    display: none !important;
  }
  .app-shell.chat-screen:not(.marketing-shell) .page-content {
    height: 100dvh !important;
    min-height: 0 !important;
    max-height: 100dvh !important;
    padding: 0 !important;
    overflow: hidden !important;
  }
  .app-shell.chat-screen:not(.marketing-shell) .chat-workspace {
    height: 100% !important;
    min-height: 0 !important;
    max-height: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
  }
  .app-shell.chat-screen:not(.marketing-shell) .chat-functional {
    height: 100% !important;
    min-height: 0 !important;
    max-height: 100% !important;
    overflow: hidden !important;
    border: 0 !important;
    border-radius: 0 !important;
    background: transparent !important;
  }
  .app-shell.chat-screen:not(.marketing-shell) .chat-toolbar {
    min-height: 64px !important;
    height: 64px !important;
    flex: 0 0 64px !important;
    padding: 0 clamp(22px,3.4vw,52px) !important;
    border-bottom: 1px solid rgba(255,255,255,.075) !important;
    background: rgba(9,8,18,.9) !important;
  }
  .app-shell.chat-screen:not(.marketing-shell) .chat-toolbar > button:first-child {
    margin-right: 4px;
  }
  .app-shell.chat-screen:not(.marketing-shell) .chat-toolbar .chat-model-pill {
    min-height: 40px !important;
    padding: 0 13px !important;
    font-size: 13px !important;
    border-radius: 12px !important;
  }
  /* Put the TREAN AI model/logo pill at the far-right end of the desktop chat header. */
  .app-shell.chat-screen:not(.marketing-shell) .chat-toolbar {
    display: flex !important;
    align-items: center !important;
  }
  .app-shell.chat-screen:not(.marketing-shell) .chat-toolbar > button[title="Collapse sidebar"] { order: 0; }
  .app-shell.chat-screen:not(.marketing-shell) .chat-toolbar > button[title="New chat and tools"] { order: 1; }
  .app-shell.chat-screen:not(.marketing-shell) .chat-toolbar > button[title="Search chats"] { order: 2; }
  .app-shell.chat-screen:not(.marketing-shell) .chat-toolbar > button[title="Share conversation"] { order: 3; }
  .app-shell.chat-screen:not(.marketing-shell) .chat-toolbar > .chat-model-pill {
    order: 10 !important;
    margin-left: auto !important;
    margin-right: 0 !important;
  }
  .app-shell.chat-screen:not(.marketing-shell) .chat-toolbar > .model-menu {
    order: 11;
  }
  .app-shell.chat-screen:not(.marketing-shell) .chat-toolbar > button:nth-last-child(3) {
    margin-left: auto !important;
  }
  .app-shell.chat-screen:not(.marketing-shell) .chat-body {
    flex: 1 1 0 !important;
    min-height: 0 !important;
    max-height: none !important;
    height: auto !important;
    padding: 36px 28px 24px !important;
    overflow-y: auto !important;
    overflow-x: hidden !important;
    overscroll-behavior: contain;
    scrollbar-gutter: stable;
  }
  .app-shell.chat-screen:not(.marketing-shell) .messages {
    width: min(100%, 768px) !important;
    max-width: 768px !important;
    margin: 0 auto !important;
    gap: 28px !important;
  }
  .app-shell.chat-screen:not(.marketing-shell) .message {
    gap: 10px !important;
    margin: 0 0 25px !important;
    font-size: 15px !important;
    line-height: 1.8 !important;
  }
  .app-shell.chat-screen:not(.marketing-shell) .message-author {
    margin-bottom: 3px !important;
    font-size: 12px !important;
  }
  .app-shell.chat-screen:not(.marketing-shell) .assistant-message {
    font-size: 15px !important;
    line-height: 1.85 !important;
  }
  .app-shell.chat-screen:not(.marketing-shell) .user-message {
    max-width: min(78%,680px) !important;
    padding: 12px 17px !important;
    border-radius: 18px 18px 5px 18px !important;
    font-size: 14px !important;
    line-height: 1.75 !important;
  }
  .app-shell.chat-screen:not(.marketing-shell) .chat-welcome {
    width: min(100%, 768px) !important;
    margin: clamp(38px,9vh,100px) auto 35px !important;
  }
  .app-shell.chat-screen:not(.marketing-shell) .chat-welcome h1 {
    font-size: clamp(30px,3vw,38px) !important;
    line-height: 1.2 !important;
  }
  .app-shell.chat-screen:not(.marketing-shell) .chat-welcome > p {
    font-size: 14px !important;
    line-height: 1.7 !important;
  }
  .app-shell.chat-screen:not(.marketing-shell) .quick-actions {
    width: min(100%, 700px) !important;
    grid-template-columns: repeat(2,minmax(0,1fr)) !important;
    gap: 12px !important;
    margin: 30px auto 12px !important;
  }
  .app-shell.chat-screen:not(.marketing-shell) .quick-actions button {
    min-height: 64px !important;
    padding: 14px 16px !important;
    border-radius: 14px !important;
    font-size: 12px !important;
  }
  .app-shell.chat-screen:not(.marketing-shell) .composer {
    flex: 0 0 auto !important;
    position: relative !important;
    width: min(calc(100% - 48px), 768px) !important;
    max-width: 768px !important;
    margin: 0 auto 7px !important;
    padding: 13px 15px 10px !important;
    border-radius: 19px !important;
    background: #171521 !important;
    box-shadow: 0 12px 36px rgba(0,0,0,.25) !important;
  }
  .app-shell.chat-screen:not(.marketing-shell) .composer textarea {
    min-height: 42px !important;
    max-height: 190px !important;
    font-size: 14px !important;
  }
  .app-shell.chat-screen:not(.marketing-shell) .composer-tools button {
    min-height: 36px !important;
    min-width: 36px !important;
  }
  .app-shell.chat-screen:not(.marketing-shell) .composer-tools .source-button {
    min-width: auto !important;
    padding: 0 11px !important;
  }
  .app-shell.chat-screen:not(.marketing-shell) .disclaimer {
    flex: 0 0 auto !important;
    width: min(calc(100% - 48px),768px) !important;
    margin: 0 auto 11px !important;
    text-align: center !important;
    line-height: 1.45 !important;
  }
}

/* Desktop Chat refinement: balanced header, roomy welcome cards and a contained composer. */
@media (min-width: 768px) {
  .app-shell.chat-screen:not(.marketing-shell) .chat-functional {
    display:flex !important;
    flex-direction:column !important;
    min-height:0 !important;
    height:100% !important;
    overflow:hidden !important;
    background:
      radial-gradient(ellipse at 50% 8%, rgba(105,72,170,.13), transparent 42%),
      transparent !important;
  }
  .app-shell.chat-screen:not(.marketing-shell) .chat-toolbar {
    position:relative !important;
    display:flex !important;
    align-items:center !important;
    flex:0 0 68px !important;
    height:68px !important;
    min-height:68px !important;
    padding:0 clamp(24px,4vw,64px) !important;
    gap:12px !important;
    background:rgba(9,8,18,.88) !important;
    border-bottom:1px solid rgba(177,151,255,.10) !important;
  }
  .app-shell.chat-screen:not(.marketing-shell) .chat-toolbar > button[aria-label="Open navigation menu"] {
    order:0 !important;
    margin:0 auto 0 0 !important;
    width:40px !important;
    height:40px !important;
  }
  .app-shell.chat-screen:not(.marketing-shell) .chat-toolbar > .chat-model-pill {
    position:absolute !important;
    left:50% !important;
    top:50% !important;
    transform:translate(-50%,-50%) !important;
    order:1 !important;
    margin:0 !important;
    min-height:42px !important;
    padding:0 17px !important;
    border-radius:13px !important;
    background:rgba(27,22,42,.88) !important;
    box-shadow:0 8px 28px rgba(0,0,0,.18) !important;
    white-space:nowrap !important;
  }
  .app-shell.chat-screen:not(.marketing-shell) .chat-toolbar > button[title="New chat and tools"] {
    order:2 !important;
    margin-left:auto !important;
  }
  .app-shell.chat-screen:not(.marketing-shell) .chat-toolbar > button[title="Search chats"],
  .app-shell.chat-screen:not(.marketing-shell) .chat-toolbar > button[title="Share conversation"] {
    order:3 !important;
    margin-left:0 !important;
  }
  .app-shell.chat-screen:not(.marketing-shell) .chat-toolbar > .model-menu {
    position:absolute !important;
    top:58px !important;
    left:50% !important;
    transform:translateX(-50%) !important;
  }
  .app-shell.chat-screen:not(.marketing-shell) .chat-body {
    flex:1 1 0 !important;
    min-height:0 !important;
    height:auto !important;
    max-height:none !important;
    overflow-x:hidden !important;
    overflow-y:auto !important;
    overscroll-behavior:contain !important;
    padding:clamp(28px,5vh,58px) clamp(28px,5vw,72px) 36px !important;
    scrollbar-width:thin !important;
    scrollbar-color:rgba(167,139,250,.32) transparent !important;
  }
  .app-shell.chat-screen:not(.marketing-shell) .chat-welcome {
    width:min(100%,900px) !important;
    margin:clamp(16px,3vh,38px) auto 44px !important;
    text-align:center !important;
  }
  .app-shell.chat-screen:not(.marketing-shell) .welcome-symbol {
    width:76px !important;
    height:76px !important;
    margin:0 auto 22px !important;
    border-radius:24px !important;
    box-shadow:0 12px 38px rgba(115,75,190,.18), inset 0 1px rgba(255,255,255,.08) !important;
  }
  .app-shell.chat-screen:not(.marketing-shell) .welcome-symbol svg {
    width:36px !important;
    height:36px !important;
  }
  .app-shell.chat-screen:not(.marketing-shell) .chat-welcome h1 {
    margin:15px 0 12px !important;
    font-size:clamp(32px,3vw,42px) !important;
    line-height:1.16 !important;
    letter-spacing:-.05em !important;
  }
  .app-shell.chat-screen:not(.marketing-shell) .chat-welcome > p {
    max-width:680px !important;
    margin:0 auto !important;
    color:#aaa3bb !important;
    font-size:15px !important;
    line-height:1.75 !important;
  }
  .app-shell.chat-screen:not(.marketing-shell) .quick-actions {
    width:min(100%,780px) !important;
    display:grid !important;
    grid-template-columns:repeat(2,minmax(0,1fr)) !important;
    gap:16px !important;
    margin:38px auto 12px !important;
  }
  .app-shell.chat-screen:not(.marketing-shell) .quick-actions button {
    display:flex !important;
    align-items:center !important;
    gap:15px !important;
    min-width:0 !important;
    min-height:88px !important;
    padding:20px 22px !important;
    border:1px solid rgba(177,151,255,.17) !important;
    border-radius:17px !important;
    background:linear-gradient(145deg,rgba(28,24,43,.82),rgba(17,16,27,.86)) !important;
    color:#eee9f7 !important;
    font-size:14px !important;
    font-weight:650 !important;
    text-align:left !important;
    box-shadow:0 10px 30px rgba(0,0,0,.12) !important;
    transition:transform .18s ease,border-color .18s ease,background .18s ease !important;
  }
  .app-shell.chat-screen:not(.marketing-shell) .quick-actions button:hover {
    transform:translateY(-2px) !important;
    border-color:rgba(177,151,255,.42) !important;
    background:linear-gradient(145deg,rgba(48,36,70,.78),rgba(22,19,35,.94)) !important;
  }
  .app-shell.chat-screen:not(.marketing-shell) .quick-actions button svg:first-child {
    width:24px !important;
    height:24px !important;
    flex:0 0 24px !important;
    color:#bd9aff !important;
  }
  .app-shell.chat-screen:not(.marketing-shell) .quick-actions button svg:last-child {
    width:17px !important;
    height:17px !important;
    margin-left:auto !important;
    flex:0 0 17px !important;
    color:#8d829f !important;
  }
  .app-shell.chat-screen:not(.marketing-shell) .composer-functional {
    position:relative !important;
    flex:0 0 auto !important;
    width:min(calc(100% - 64px),920px) !important;
    max-width:920px !important;
    margin:0 auto 8px !important;
    padding:16px 18px 13px !important;
    border:1px solid rgba(177,151,255,.24) !important;
    border-radius:22px !important;
    background:linear-gradient(145deg,rgba(29,25,44,.98),rgba(19,17,29,.98)) !important;
    box-shadow:0 18px 48px rgba(0,0,0,.34),inset 0 1px rgba(255,255,255,.035) !important;
  }
  .app-shell.chat-screen:not(.marketing-shell) .composer-functional textarea {
    display:block !important;
    width:100% !important;
    min-height:48px !important;
    max-height:190px !important;
    padding:10px 12px 13px !important;
    resize:none !important;
    color:#f5f0ff !important;
    font-size:15px !important;
    line-height:1.55 !important;
  }
  .app-shell.chat-screen:not(.marketing-shell) .composer-functional .composer-tools {
    display:flex !important;
    align-items:center !important;
    flex-wrap:nowrap !important;
    gap:10px !important;
    min-width:0 !important;
  }
  .app-shell.chat-screen:not(.marketing-shell) .composer-functional .composer-tools > button {
    display:inline-flex !important;
    flex:0 0 42px !important;
    align-items:center !important;
    justify-content:center !important;
    width:42px !important;
    min-width:42px !important;
    height:42px !important;
    min-height:42px !important;
    padding:0 !important;
    border:1px solid rgba(255,255,255,.09) !important;
    border-radius:13px !important;
    background:rgba(255,255,255,.035) !important;
    color:#c4b8dc !important;
  }
  .app-shell.chat-screen:not(.marketing-shell) .composer-functional .composer-tools > .source-button {
    flex:0 0 auto !important;
    display:inline-flex !important;
    width:auto !important;
    min-width:158px !important;
    height:42px !important;
    min-height:42px !important;
    justify-content:space-between !important;
    gap:10px !important;
    padding:0 14px !important;
    border:1px solid rgba(177,151,255,.2) !important;
    border-radius:13px !important;
    background:rgba(139,99,244,.11) !important;
    color:#e6ddf7 !important;
    font-size:12px !important;
    white-space:nowrap !important;
  }
  .app-shell.chat-screen:not(.marketing-shell) .composer-functional .composer-tools > .source-button svg {
    width:17px !important;
    height:17px !important;
    flex:0 0 auto !important;
  }
  .app-shell.chat-screen:not(.marketing-shell) .composer-functional .composer-tools > span {
    flex:1 1 auto !important;
    min-width:8px !important;
  }
  .app-shell.chat-screen:not(.marketing-shell) .composer-functional .composer-tools > .send {
    flex:0 0 44px !important;
    width:44px !important;
    min-width:44px !important;
    height:44px !important;
    min-height:44px !important;
    margin-left:0 !important;
    border:0 !important;
    border-radius:14px !important;
    background:linear-gradient(135deg,#a16df8,#7444d8) !important;
    color:white !important;
  }
  .app-shell.chat-screen:not(.marketing-shell) .composer-functional .knowledge-menu {
    position:absolute !important;
    left:76px !important;
    bottom:calc(100% + 12px) !important;
    top:auto !important;
    min-width:220px !important;
    border:1px solid rgba(177,151,255,.24) !important;
    border-radius:15px !important;
    background:#171422 !important;
  }
  .app-shell.chat-screen:not(.marketing-shell) .disclaimer {
    flex:0 0 auto !important;
    width:min(calc(100% - 64px),920px) !important;
    margin:0 auto 14px !important;
    text-align:center !important;
    color:#827a91 !important;
    font-size:10px !important;
    line-height:1.5 !important;
  }
}

}
`}
</style><main className={"app-shell "+(screen==="Landing"||screen==="Sign In"||screen==="Create Account"?"marketing-shell":"")+(screen==="Chat"?" chat-screen":"")+(sidebarCollapsed?" sidebar-collapsed":"")}>{screen==="Landing"?<Landing go={setScreen}/>:screen==="Sign In"||screen==="Create Account"?<Auth screen={screen} go={setScreen}/>:<><Sidebar screen={screen} go={setScreen} open={open} setOpen={setOpen}/><div className="main-area">{screen!=="Chat"&&<header className="topbar"><button className="menu-button" aria-label="Toggle sidebar" title="Toggle sidebar" onClick={()=>{if(window.matchMedia("(min-width: 1024px)").matches){setSidebarCollapsed(v=>!v);}else{setOpen(true);}}}><Menu/></button><div className="model-selector"><Brain/><b>TREAN AI</b><span>Learning workspace</span></div><div className="top-actions"><button className="desktop-only-action" title="New chat" aria-label="New chat" onClick={()=>setScreen("Chat")}><Plus/></button><button className="desktop-only-action" title="Search conversations" aria-label="Search conversations" onClick={()=>setScreen("History")}><Search/></button><button title="Settings" aria-label="Settings" onClick={()=>setScreen("Settings")}><Settings/></button><button className="top-avatar" title="Profile" aria-label="Profile" onClick={()=>setScreen("Profile")}><User/></button></div></header>}<div className="page-content"><ScreenErrorBoundary key={screen} screen={screen}>{screen==="Chat"?<Chat sidebarOpen={open} onToggleSidebar={()=>{if(window.matchMedia("(max-width: 700px)").matches){setOpen(v=>!v);}else{setSidebarCollapsed(v=>!v);}}}/>:screen==="Learn from Video"?<VideoPage go={setScreen}/>:screen==="Processing Video"?<ProcessingPage go={setScreen}/>:<Page screen={screen}/>}</ScreenErrorBoundary></div><nav className="mobile-nav" aria-label="Main navigation">{[[Home,"Home","Dashboard"],[Video,"Learn","Learn from Video"],[MessageSquare,"Chat","Chat"],[Library,"Library","Knowledge Base"],[User,"Profile","Profile"]].map(([I,n,s]:any)=><button type="button" aria-label={n} aria-current={screen===s?"page":undefined} className={screen===s?"active":""} key={n} onClick={()=>{setOpen(false);setScreen(s as Screen);}}><I/><span>{n}</span></button>)}</nav></div></>}</main></>
}
