import React, { useState, useEffect, useRef, Component } from "react";

// ═══════════════════════════════════════════════════════
// ERROR BOUNDARY
// ═══════════════════════════════════════════════════════
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error("Selah crashed:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight:"100vh",background:"#F5F1E8",fontFamily:"Georgia,serif",
          display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
          padding:"40px 24px",textAlign:"center" }}>
          <div style={{ width:"64px",height:"64px",borderRadius:"50%",
            background:"#A8B5A215",border:"1.5px solid #A8B5A244",
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:"28px",marginBottom:"20px" }}>✦</div>
          <h1 style={{ color:"#2C2C2A",fontSize:"20px",fontWeight:"normal",
            margin:"0 0 10px" }}>Something went wrong</h1>
          <p style={{ color:"#6B6B66",fontSize:"13px",fontStyle:"italic",
            lineHeight:"1.8",margin:"0 0 24px",maxWidth:"320px" }}>
            Selah hit an unexpected issue. Your data is safe — nothing was lost.
          </p>
          <button onClick={()=>{this.setState({hasError:false,error:null});window.location.reload();}}
            style={{ background:"#A8B5A2",border:"none",borderRadius:"3px",color:"#fff",
              fontSize:"10px",letterSpacing:"2.5px",textTransform:"uppercase",
              padding:"14px 28px",cursor:"pointer",fontFamily:"Georgia,serif",
              fontStyle:"italic",marginBottom:"12px" }}>
            Reload Selah
          </button>
          <button onClick={()=>{try{localStorage.clear();}catch{}window.location.reload();}}
            style={{ background:"none",border:"none",color:"#9A8E80",
              fontSize:"10px",fontStyle:"italic",cursor:"pointer",
              fontFamily:"Georgia,serif" }}>
            Reset everything if this keeps happening
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ═══════════════════════════════════════════════════════
// SCREEN TRANSITION WRAPPER
// ═══════════════════════════════════════════════════════
function ScreenTransition({ screenKey, children, duration = 220 }) {
  const [displayChildren, setDisplayChildren] = useState(children);
  const [phase, setPhase] = useState("in"); // "in" | "out"
  const prevKey = useRef(screenKey);

  useEffect(() => {
    if (screenKey !== prevKey.current) {
      setPhase("out");
      const timer = setTimeout(() => {
        setDisplayChildren(children);
        prevKey.current = screenKey;
        setPhase("in");
      }, duration);
      return () => clearTimeout(timer);
    } else {
      setDisplayChildren(children);
    }
  }, [screenKey, children, duration]);

  return (
    <div style={{
      opacity: phase === "out" ? 0 : 1,
      transform: phase === "out" ? "translateY(6px)" : "translateY(0)",
      transition: `opacity ${duration}ms ease, transform ${duration}ms ease`,
      minHeight: "100vh",
    }}>
      {displayChildren}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// LOCAL STORAGE PERSISTENCE
// ═══════════════════════════════════════════════════════
const STORAGE_KEY = "selah_app_data";

function saveToStorage(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function clearStorage() {
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
}

// ═══════════════════════════════════════════════════════
// THEME SYSTEM
// ═══════════════════════════════════════════════════════
const THEMES = {
  neutral: {
    id:"neutral", name:"Neutral",
    C:{ id:"neutral", bgPrimary:"#F7F7F5", bgSecondary:"#EEEEEB", bgCard:"#E8E8E5",
        textPrimary:"#2C2C2A", textSoft:"#6B6B66", textMuted:"#9E9E98",
        sage:"#8FA38A", sageDark:"#6E8569", sageLight:"#B3C4AE",
        amber:"#B0A790", amberLight:"#D4CBBA", terra:"#9A8E80",
        accent:"#8FA38A", accentAlt:"#B0A790", border:"#DDDDD8", navBg:"#F7F7F5" },
  },
  warm: {
    id:"warm", name:"Warm Sanctuary",
    C:{ id:"warm", bgPrimary:"#F5F1E8", bgSecondary:"#E8DFD1", bgCard:"#EDEAE0",
        textPrimary:"#3A3631", textSoft:"#7A7268", textMuted:"#A89E92",
        sage:"#A8B5A2", sageDark:"#8A9884", sageLight:"#C4CEBF",
        amber:"#D6A85F", amberLight:"#F0D9A8", terra:"#C47A5A",
        accent:"#A8B5A2", accentAlt:"#D6A85F", border:"#DDD8CC", navBg:"#F5F1E8" },
  },
  masculine: {
    id:"masculine", name:"Charcoal & Gold",
    C:{ id:"masculine", bgPrimary:"#1A1816", bgSecondary:"#222019", bgCard:"#2A2822",
        textPrimary:"#EDE8DA", textSoft:"#BEB5A0", textMuted:"#8A8278",
        sage:"#8A9A7A", sageDark:"#6A7A5A", sageLight:"#A8B898",
        amber:"#C8A44E", amberLight:"#E0C878", terra:"#B87A4A",
        accent:"#C8A44E", accentAlt:"#8A9A7A", border:"#3A3630", navBg:"#1E1C18" },
  },
  navy: {
    id:"navy", name:"Deep Navy",
    C:{ id:"navy", bgPrimary:"#0F1B2D", bgSecondary:"#162438", bgCard:"#1E3049",
        textPrimary:"#F0EAD6", textSoft:"#B8C8D8", textMuted:"#6A8A9A",
        sage:"#4A7FA5", sageDark:"#2E6080", sageLight:"#7AAAC0",
        amber:"#C9A84C", amberLight:"#E8C870", terra:"#B06040",
        accent:"#C9A84C", accentAlt:"#4A7FA5", border:"#1E3A5F", navBg:"#0A1520" },
  },
  forest: {
    id:"forest", name:"Forest & Cream",
    C:{ id:"forest", bgPrimary:"#F8F4EC", bgSecondary:"#EEE8D8", bgCard:"#E8E0CC",
        textPrimary:"#2A3828", textSoft:"#4A5E48", textMuted:"#8A9E88",
        sage:"#3D6B4F", sageDark:"#2A5038", sageLight:"#8FAF78",
        amber:"#C4A96A", amberLight:"#E0CC98", terra:"#9A6848",
        accent:"#3D6B4F", accentAlt:"#C4A96A", border:"#D8D0BC", navBg:"#F8F4EC" },
  },
  charcoal: {
    id:"charcoal", name:"Charcoal & Amber",
    C:{ id:"charcoal", bgPrimary:"#1C1A18", bgSecondary:"#242018", bgCard:"#2E2A24",
        textPrimary:"#F0E8D8", textSoft:"#C0B098", textMuted:"#7A6A58",
        sage:"#8A9A84", sageDark:"#6A7A64", sageLight:"#AAB8A4",
        amber:"#D6A85F", amberLight:"#E8C888", terra:"#C47A5A",
        accent:"#D6A85F", accentAlt:"#8A9A84", border:"#3A3430", navBg:"#141210" },
  },
  slate: {
    id:"slate", name:"Slate & White",
    C:{ id:"slate", bgPrimary:"#F8F9FA", bgSecondary:"#EEF0F4", bgCard:"#E4E8EE",
        textPrimary:"#1E2832", textSoft:"#4A5868", textMuted:"#8A9AAA",
        sage:"#4A6080", sageDark:"#2E4460", sageLight:"#8A9AAA",
        amber:"#7A8EA8", amberLight:"#AAB8C8", terra:"#6A7A9A",
        accent:"#4A6080", accentAlt:"#7A8EA8", border:"#D4DAE4", navBg:"#F0F2F6" },
  },
  obsidian: {
    id:"obsidian", name:"Obsidian & Steel",
    C:{ id:"obsidian", bgPrimary:"#090909", bgSecondary:"#111111", bgCard:"#191919",
        textPrimary:"#E8E8E8", textSoft:"#A0A0A0", textMuted:"#606060",
        sage:"#7A8FA0", sageDark:"#5A7080", sageLight:"#9AAABB",
        amber:"#A0A8B0", amberLight:"#C0C8D0", terra:"#808890",
        accent:"#8A9BAC", accentAlt:"#606870", border:"#242424", navBg:"#0D0D0D" },
  },


};

// Themes available in settings (exclude neutral — it's only for pre-onboarding)
const CUSTOMIZABLE_THEMES = ["warm","masculine","navy","forest","charcoal","slate","obsidian"];

const FONTS = {
  serif:   "'Georgia','Times New Roman',serif",
  sans:    "'Helvetica Neue',Arial,sans-serif",
  rounded: "'Trebuchet MS',sans-serif",
};

const CRISIS_WORDS = ["kill myself","end my life","suicide","suicidal","want to die","self harm","hurt myself","cut myself","no reason to live","can't go on"];

// VAPID key for Web Push notifications
const VAPID_PUBLIC_KEY = 'BHc170Iee25vF0iKutFOxMChysc6IlL3Lc9XaPit9xLeh99usWaottp0iw9WJ4sjQn3PZt5NrdpDvdfGmA-1B70';
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}
const isCrisis = t => CRISIS_WORDS.some(k => t.toLowerCase().includes(k));

const LATE_NIGHT_LINES = [
  "Still awake. You don't have to explain it.",
  "Whatever brought you here — you don't have to carry it alone tonight.",
  "It's quiet. That's okay. I'm here.",
  "You opened this for a reason. Take your time.",
  "No pressure to say anything. Just breathe for a second.",
];

// ═══════════════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════════════
function WaveLogo({ size=28, color="#A8B5A2" }) {
  return (
    <svg width={size} height={size*0.6} viewBox="0 0 48 28" fill="none">
      <path d="M2 20 C8 8,14 8,20 14 C26 20,32 20,38 14 C44 8,46 12,46 14"
        stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M2 24 C8 16,14 16,20 20 C26 24,32 24,38 20 C44 16,46 18,46 20"
        stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.45"/>
    </svg>
  );
}

function Dot({ color }) {
  return <div style={{ width:"4px",height:"4px",borderRadius:"50%",background:color,flexShrink:0 }}/>;
}

function Label({ text, color, font }) {
  return (
    <div style={{ display:"flex",alignItems:"center",gap:"6px",marginBottom:"12px" }}>
      <Dot color={color}/>
      <span style={{ color,fontSize:"10px",letterSpacing:"3.5px",textTransform:"uppercase",fontWeight:"600",fontFamily:font }}>
        {text}
      </span>
    </div>
  );
}

// Tier access helper: returns true if user has access to a given tier level
const TIER_LEVELS = { free:0, foundation:1, growth:2, deep:3 };
function hasAccess(userTier, requiredTier, isTrialActive) {
    if (new URLSearchParams(window.location.search).get("admin") === "f7a3d9e2-4c1b-4e8f-b2a6-9d5c3e7f1a04") return true;
  if (isTrialActive) return true; // trial unlocks everything
  return (TIER_LEVELS[userTier]||0) >= (TIER_LEVELS[requiredTier]||0);
}

// Upgrade prompt shown when user hits a paywall
function UpgradeGate({ C, font, feature, requiredTier, onUpgrade }) {
  const tierNames = { foundation:"Foundation ($6/mo)", growth:"Growth ($12/mo)", deep:"Deep Reflection ($15/mo)" };
  return (
    <div style={{ background:`${C.amber}08`, border:`1.5px solid ${C.amber}33`,
      borderRadius:"12px", padding:"24px 20px", textAlign:"center", margin:"20px 0" }}>
      <div style={{ fontSize:"32px", marginBottom:"12px" }}>🔒</div>
      <h3 style={{ color:C.textPrimary, fontSize:"16px", fontWeight:"normal",
        fontFamily:font, margin:"0 0 8px" }}>
        {feature} requires {requiredTier === "foundation" ? "a" : "the"} {requiredTier.charAt(0).toUpperCase()+requiredTier.slice(1)} plan
      </h3>
      <p style={{ color:C.textSoft, fontSize:"12px", fontStyle:"italic",
        lineHeight:"1.8", margin:"0 0 16px" }}>
        Upgrade to {tierNames[requiredTier]||requiredTier} to unlock this feature and more.
      </p>
      <button onClick={onUpgrade} style={{
        background:C.accent, border:"none", borderRadius:"3px",
        color:"#fff", fontSize:"10px", letterSpacing:"3px",
        textTransform:"uppercase", padding:"14px 32px", cursor:"pointer",
        fontFamily:font, fontStyle:"italic",
        boxShadow:`0 2px 12px ${C.accent}33` }}>
        View Plans
      </button>
    </div>
  );
}

function BottomNav({ screen, setScreen, C, font, adminMode }) {
  const inact = C.textMuted;
  const tabs = [
    { id:"home",     svg:(a)=><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke={a?C.accent:inact} strokeWidth="1.8" fill={a?C.accent+"22":"none"} strokeLinecap="round"/><path d="M9 22V12h6v10" stroke={a?C.accent:inact} strokeWidth="1.8" strokeLinecap="round"/></svg> },
    { id:"reflect",  svg:(a)=><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={a?C.amber:inact} strokeWidth="1.8" fill={a?C.amber+"18":"none"}/><path d="M12 8v4l3 3" stroke={a?C.amber:inact} strokeWidth="1.8" strokeLinecap="round"/></svg> },
    { id:"journal",  label:"Notebook", svg:(a)=><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke={a?C.terra:inact} strokeWidth="1.8" strokeLinecap="round"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke={a?C.terra:inact} strokeWidth="1.8" fill={a?C.terra+"18":"none"}/><path d="M9 7h6M9 11h4" stroke={a?C.terra:inact} strokeWidth="1.5" strokeLinecap="round"/></svg> },
    { id:"progress", svg:(a)=><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke={a?C.accent:inact} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> },
    { id:"settings", svg:(a)=><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke={a?C.accent:inact} strokeWidth="1.8"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" stroke={a?C.accent:inact} strokeWidth="1.8"/></svg> },
    ...(adminMode ? [{ id:"analytics", svg:(a)=><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="12" width="4" height="9" rx="1" stroke={a?C.amber:inact} strokeWidth="1.8" fill={a?C.amber+"22":"none"}/><rect x="10" y="7" width="4" height="14" rx="1" stroke={a?C.amber:inact} strokeWidth="1.8" fill={a?C.amber+"22":"none"}/><rect x="17" y="3" width="4" height="18" rx="1" stroke={a?C.amber:inact} strokeWidth="1.8" fill={a?C.amber+"22":"none"}/></svg> }] : []),
  ];
  return (
    <div style={{ position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",
      width:"100%",maxWidth:"520px",background:C.navBg,
      borderTop:`1px solid ${C.border}`,
      display:"flex",justifyContent:"space-around",alignItems:"center",
      padding:"10px 0 22px",zIndex:100,
      boxShadow:`0 -1px 0 ${C.border}, 0 -4px 20px rgba(0,0,0,0.08)` }}>
      {tabs.map(t => {
        const a = screen===t.id;
        return (
          <button key={t.id} onClick={()=>setScreen(t.id)} style={{
            background:"none",border:"none",cursor:"pointer",
            display:"flex",flexDirection:"column",alignItems:"center",
            padding:"4px 16px",transition:"transform 0.2s ease",
            transform: a?"translateY(-1px)":"translateY(0)" }}>
            {t.svg(a)}
            <div style={{ width:"4px",height:"4px",borderRadius:"50%",
              background:a?C.accent:"transparent",marginTop:"4px",
              transition:"all 0.2s ease" }}/>
          </button>
        );
      })}
    </div>
  );
}

function CrisisPanel({ onClose, C, font }) {
  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",
      display:"flex",alignItems:"center",justifyContent:"center",
      zIndex:500,padding:"24px",fontFamily:font }}>
      <div style={{ background:C.bgPrimary,borderRadius:"16px",padding:"32px 28px",
        maxWidth:"380px",width:"100%",border:`1px solid ${C.terra}44` }}>
        <div style={{ textAlign:"center",marginBottom:"20px" }}>
          <div style={{ fontSize:"36px",marginBottom:"12px" }}>🤍</div>
          <h2 style={{ color:C.textPrimary,fontSize:"20px",fontWeight:"normal",margin:"0 0 10px" }}>
            You matter.
          </h2>
          <p style={{ color:C.textSoft,fontSize:"13px",fontStyle:"italic",lineHeight:"1.9",margin:0 }}>
            What you're feeling is real. You don't have to face it alone. Please reach out right now.
          </p>
        </div>
        <div style={{ background:`${C.terra}12`,borderRadius:"10px",padding:"18px",
          marginBottom:"16px",border:`1px solid ${C.terra}33` }}>
          {[{l:"Call or text",v:"988",s:"Suicide & Crisis Lifeline",href:"tel:988"},
            {l:"Text HOME to",v:"741741",s:"Crisis Text Line",href:"sms:741741&body=HOME"},
            {l:"Live Chat",v:"Ages 13-24",s:"STOMP Out Bullying",href:"https://www.stompoutbullying.org/helpchat"},
            {l:"Emergency",v:"911",s:"Immediate danger",href:"tel:911"}].map(r=>(
            <a key={r.v} href={r.href} style={{ display:"flex",justifyContent:"space-between",
              alignItems:"center",marginBottom:"8px",textDecoration:"none",
              padding:"8px 10px",borderRadius:"8px",transition:"background 0.15s ease" }}
              onMouseEnter={e=>e.currentTarget.style.background=`${C.terra}15`}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <span style={{ color:C.textSoft,fontSize:"12px",fontStyle:"italic" }}>
                {r.l}: <strong style={{ color:C.terra }}>{r.v}</strong>
              </span>
              <span style={{ color:C.textMuted,fontSize:"10px",fontStyle:"italic" }}>{r.s} →</span>
            </a>
          ))}
        </div>
        <button onClick={onClose} style={{ width:"100%",background:C.accent,border:"none",
          borderRadius:"3px",color:"#fff",fontSize:"10px",letterSpacing:"3px",
          textTransform:"uppercase",padding:"14px",cursor:"pointer",
          fontFamily:font,fontStyle:"italic" }}>
          Return to Selah
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// LANDING PAGE
// ═══════════════════════════════════════════════════════
function LandingPage({ onEnter, C, font }) {
  const [vis, setVis] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => { setTimeout(() => setVis(true), 100); }, []);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleScroll = () => setScrollY(el.scrollTop);
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  const TESTIMONIALS = [
    { text: "I've never felt safe enough to say what I really feel. Selah changed that.", tag: "Anxiety & Self-Worth" },
    { text: "It's like having a conversation with the wisest version of yourself.", tag: "Clarity & Direction" },
    { text: "I didn't think an app could understand me. This one comes close.", tag: "Depression & Identity" },
  ];

  const FEATURES = [
    { icon: "◈", title: "Guided Reflection", desc: "Conversations that go deeper than surface-level. Selah listens, asks the right questions, and helps you think clearly." },
    { icon: "🫁", title: "Breathing & Grounding", desc: "Before you think — breathe. Guided techniques used by therapists and special forces alike." },
    { icon: "✍️", title: "Private Notebook", desc: "Write whatever you need to. No one reads it but you. Your thoughts, unfiltered." },
    { icon: "📊", title: "Growth Tracking", desc: "Watch yourself change over time. Mood patterns, streaks, milestones — proof that you're becoming." },
    { icon: "✦", title: "Faith on Your Terms", desc: "From fully secular to scripture-led. You control how faith shows up — or doesn't." },
    { icon: "🎨", title: "Fully Customizable", desc: "Colors, tone, font, faith level — make Selah feel like yours from the first session." },
  ];

  return (
    <div ref={containerRef} style={{ height:"100vh", overflowY:"auto", background:"#F7F7F5",
      fontFamily:"'Georgia','Times New Roman',serif",
      scrollBehavior:"smooth", scrollSnapType:"y proximity" }}>

      {/* ── HERO ── */}
      <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center", padding:"60px 24px 80px",
        position:"relative", overflow:"hidden", textAlign:"center",
        scrollSnapAlign:"start" }}>

        {/* Ambient */}
        <div style={{ position:"absolute", top:"-120px", left:"-100px", width:"500px", height:"500px",
          background:"radial-gradient(circle, #B3C4AE20 0%, transparent 70%)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", bottom:"-80px", right:"-80px", width:"400px", height:"400px",
          background:"radial-gradient(circle, #D4CBBA18 0%, transparent 70%)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", inset:0, pointerEvents:"none",
          backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
          opacity:0.6 }}/>

        <div style={{ maxWidth:"560px", width:"100%", position:"relative",
          opacity:vis?1:0, transform:vis?"translateY(0)":"translateY(20px)",
          transition:"all 1s ease" }}>

          <WaveLogo size={42} color="#8FA38A"/>

          <div style={{ display:"flex", alignItems:"center", justifyContent:"center",
            gap:"10px", margin:"20px 0" }}>
            <div style={{ width:"40px", height:"1px", background:"#8FA38A", opacity:0.4 }}/>
            <span style={{ color:"#9E9E98", fontSize:"10px", letterSpacing:"5px",
              textTransform:"uppercase", fontStyle:"italic" }}>A Space to Think Clearly</span>
            <div style={{ width:"40px", height:"1px", background:"#8FA38A", opacity:0.4 }}/>
          </div>

          <h1 style={{ color:"#2C2C2A", fontSize:"clamp(28px,7vw,48px)",
            fontWeight:"normal", margin:"0 0 20px", lineHeight:"1.3",
            letterSpacing:"-0.01em" }}>
            You don't need another app.<br/>
            <span style={{ color:"#8FA38A" }}>You need a place to be honest.</span>
          </h1>

          <p style={{ color:"#6B6B66", fontSize:"clamp(14px,3vw,17px)", fontStyle:"italic",
            lineHeight:"2", margin:"0 0 40px", maxWidth:"460px", marginLeft:"auto", marginRight:"auto" }}>
            Selah is a guided reflection companion — rooted in faith, backed by psychology, and built for people who carry more than they show.
          </p>

          <button onClick={onEnter} style={{
            background:"#8FA38A", border:"none", borderRadius:"3px",
            color:"#fff", fontSize:"12px", letterSpacing:"4px", textTransform:"uppercase",
            padding:"20px 52px", cursor:"pointer",
            fontFamily:"'Georgia','Times New Roman',serif", fontStyle:"italic",
            boxShadow:"0 4px 20px rgba(143,163,138,0.35)",
            transition:"all 0.3s ease" }}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 30px rgba(143,163,138,0.45)";}}
            onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 4px 20px rgba(143,163,138,0.35)";}}>
            Begin Your First Reflection
          </button>

          <p style={{ color:"#9E9E98", fontSize:"12px", fontStyle:"italic", margin:"16px 0 0" }}>
            Free to start · No account required · Private & encrypted
          </p>
        </div>

        {/* Scroll hint */}
        <div style={{ position:"absolute", bottom:"32px",
          opacity: scrollY > 50 ? 0 : 0.6, transition:"opacity 0.4s ease" }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"6px" }}>
            <span style={{ color:"#9E9E98", fontSize:"9px", letterSpacing:"3px",
              textTransform:"uppercase", fontStyle:"italic" }}>Learn more</span>
            <span style={{ color:"#9E9E98", fontSize:"16px",
              animation:"bobDown 2s ease-in-out infinite" }}>↓</span>
          </div>
        </div>
      </div>

      {/* ── WHO IT'S FOR ── */}
      <div style={{ padding:"80px 24px", background:"#EEEEEB",
        scrollSnapAlign:"start" }}>
        <div style={{ maxWidth:"560px", margin:"0 auto", textAlign:"center" }}>
          <span style={{ color:"#8FA38A", fontSize:"10px", letterSpacing:"4px",
            textTransform:"uppercase", fontStyle:"italic" }}>Who Selah Is For</span>
          <h2 style={{ color:"#2C2C2A", fontSize:"clamp(22px,5vw,32px)",
            fontWeight:"normal", margin:"16px 0 20px", lineHeight:"1.4" }}>
            For the ones who carry things they can't say out loud.
          </h2>
          <div style={{ display:"flex", flexDirection:"column", gap:"12px", textAlign:"left" }}>
            {[
              "You overthink everything and can't shut your mind off.",
              "You feel behind everyone else and don't know why.",
              "You know something needs to change but don't know where to start.",
              "You've tried therapy apps and they felt hollow.",
              "You want God in the process — but on your terms.",
              "You just need one place where you don't have to perform.",
            ].map((line, i) => (
              <div key={i} style={{ display:"flex", gap:"12px", alignItems:"flex-start",
                padding:"12px 16px", background:"#F7F7F5", borderRadius:"8px" }}>
                <div style={{ width:"5px", height:"5px", borderRadius:"50%",
                  background:"#8FA38A", marginTop:"8px", flexShrink:0 }}/>
                <p style={{ color:"#6B6B66", fontSize:"14px", fontStyle:"italic",
                  lineHeight:"1.8", margin:0 }}>{line}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FEATURES ── */}
      <div style={{ padding:"80px 24px", background:"#F7F7F5",
        scrollSnapAlign:"start" }}>
        <div style={{ maxWidth:"560px", margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:"40px" }}>
            <span style={{ color:"#B0A790", fontSize:"10px", letterSpacing:"4px",
              textTransform:"uppercase", fontStyle:"italic" }}>What's Inside</span>
            <h2 style={{ color:"#2C2C2A", fontSize:"clamp(22px,5vw,32px)",
              fontWeight:"normal", margin:"16px 0 0", lineHeight:"1.4" }}>
              Tools that meet you where you are.
            </h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{ background:"#EEEEEB", borderRadius:"10px",
                padding:"20px 16px", border:"1px solid #DDDDD8" }}>
                <span style={{ fontSize:"24px", display:"block", marginBottom:"10px" }}>{f.icon}</span>
                <p style={{ color:"#2C2C2A", fontSize:"14px", fontWeight:"bold",
                  fontFamily:"'Georgia','Times New Roman',serif", margin:"0 0 6px" }}>{f.title}</p>
                <p style={{ color:"#6B6B66", fontSize:"12px", fontStyle:"italic",
                  lineHeight:"1.7", margin:0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TESTIMONIALS ── */}
      <div style={{ padding:"80px 24px", background:"#2C2C2A",
        scrollSnapAlign:"start" }}>
        <div style={{ maxWidth:"560px", margin:"0 auto", textAlign:"center" }}>
          <span style={{ color:"#8FA38A", fontSize:"10px", letterSpacing:"4px",
            textTransform:"uppercase", fontStyle:"italic" }}>Voices</span>
          <h2 style={{ color:"#F7F7F5", fontSize:"clamp(22px,5vw,32px)",
            fontWeight:"normal", margin:"16px 0 32px", lineHeight:"1.4" }}>
            What people are saying.
          </h2>
          <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{ background:"rgba(255,255,255,0.06)", borderRadius:"10px",
                padding:"24px 20px", border:"1px solid rgba(255,255,255,0.08)",
                textAlign:"left" }}>
                <p style={{ color:"rgba(247,247,245,0.9)", fontSize:"15px", fontStyle:"italic",
                  lineHeight:"1.9", margin:"0 0 12px" }}>"{t.text}"</p>
                <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                  <div style={{ width:"4px", height:"4px", borderRadius:"50%", background:"#8FA38A" }}/>
                  <span style={{ color:"#8FA38A", fontSize:"9px", letterSpacing:"2px",
                    textTransform:"uppercase", fontStyle:"italic" }}>{t.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── NOT THERAPY ── */}
      <div style={{ padding:"80px 24px", background:"#F7F7F5",
        scrollSnapAlign:"start" }}>
        <div style={{ maxWidth:"480px", margin:"0 auto", textAlign:"center" }}>
          <span style={{ color:"#9A8E80", fontSize:"10px", letterSpacing:"4px",
            textTransform:"uppercase", fontStyle:"italic" }}>Important</span>
          <h2 style={{ color:"#2C2C2A", fontSize:"clamp(20px,5vw,28px)",
            fontWeight:"normal", margin:"16px 0 16px", lineHeight:"1.4" }}>
            Selah is not therapy.
          </h2>
          <p style={{ color:"#6B6B66", fontSize:"14px", fontStyle:"italic",
            lineHeight:"2", margin:"0 0 24px" }}>
            It's a guided reflection tool — a companion for thinking clearly, not a replacement for professional care.
            Selah does not provide therapy, counseling, medical advice, diagnosis, or crisis intervention.
            If you are in crisis or experiencing thoughts of self-harm or harm to others, please contact
            a licensed professional, call 988 (Suicide & Crisis Lifeline), or dial 911 immediately.
            By using Selah, you acknowledge that its creators, developers, and affiliates assume no liability
            for any actions, decisions, or outcomes resulting from your use of this application.
          </p>
          <div style={{ background:"#EEEEEB", borderRadius:"10px", padding:"16px 20px",
            border:"1px solid #DDDDD8", display:"inline-flex", alignItems:"center", gap:"10px" }}>
            <span style={{ fontSize:"14px" }}>🤍</span>
            <span style={{ color:"#9A8E80", fontSize:"12px", fontStyle:"italic" }}>
              988 Suicide & Crisis Lifeline · Always accessible inside Selah
            </span>
          </div>
        </div>
      </div>

      {/* ── FOUNDER ── */}
      <div style={{ padding:"80px 24px", background:"#EEEEEB",
        scrollSnapAlign:"start" }}>
        <div style={{ maxWidth:"480px", margin:"0 auto", textAlign:"center" }}>
          <WaveLogo size={32} color="#8FA38A"/>
          <p style={{ color:"#B0A790", fontSize:"10px", letterSpacing:"4px",
            textTransform:"uppercase", fontStyle:"italic", margin:"16px 0 12px" }}>From the Founder</p>
          <p style={{ color:"#6B6B66", fontSize:"15px", fontStyle:"italic",
            lineHeight:"2", margin:"0 0 8px" }}>
            "I built Selah for the version of myself that had no one to talk to. For years I carried things I couldn't say out loud — not because I didn't want help, but because I didn't feel safe enough to ask for it."
          </p>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"8px", margin:"16px 0" }}>
            <div style={{ width:"20px", height:"1px", background:"#8FA38A", opacity:0.5 }}/>
            <span style={{ color:"#9E9E98", fontSize:"10px", letterSpacing:"2px",
              textTransform:"uppercase", fontStyle:"italic" }}>ZS</span>
            <div style={{ width:"20px", height:"1px", background:"#8FA38A", opacity:0.5 }}/>
          </div>
        </div>
      </div>

      {/* ── FINAL CTA ── */}
      <div style={{ padding:"80px 24px 100px", background:"#2C2C2A", textAlign:"center",
        scrollSnapAlign:"start" }}>
        <div style={{ maxWidth:"480px", margin:"0 auto" }}>
          <WaveLogo size={36} color="#8FA38A"/>
          <h2 style={{ color:"#F7F7F5", fontSize:"clamp(22px,5vw,32px)",
            fontWeight:"normal", margin:"20px 0 12px", lineHeight:"1.4" }}>
            Whatever brought you here —<br/>you're here.
          </h2>
          <p style={{ color:"rgba(247,247,245,0.6)", fontSize:"14px", fontStyle:"italic",
            lineHeight:"1.9", margin:"0 0 32px" }}>
            That took something. Don't waste it.
          </p>
          <button onClick={onEnter} style={{
            background:"#8FA38A", border:"none", borderRadius:"3px",
            color:"#fff", fontSize:"12px", letterSpacing:"4px", textTransform:"uppercase",
            padding:"20px 52px", cursor:"pointer",
            fontFamily:"'Georgia','Times New Roman',serif", fontStyle:"italic",
            boxShadow:"0 4px 24px rgba(143,163,138,0.4)",
            transition:"all 0.3s ease" }}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";}}
            onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";}}>
            Enter Selah
          </button>
          <p style={{ color:"rgba(247,247,245,0.35)", fontSize:"11px", fontStyle:"italic",
            margin:"20px 0 0", lineHeight:"1.8" }}>
            Free to start · No account required · End-to-end encrypted
          </p>
          <div style={{ marginTop:"32px", borderTop:"1px solid rgba(255,255,255,0.08)",
            paddingTop:"20px" }}>
            <p style={{ color:"rgba(247,247,245,0.4)", fontSize:"11px", fontStyle:"italic",
              lineHeight:"1.9", margin:0 }}>
              "Be still and know that I am God."
            </p>
            <p style={{ color:"rgba(143,163,138,0.5)", fontSize:"9px", letterSpacing:"2px",
              textTransform:"uppercase", margin:"4px 0 0" }}>Psalm 46:10</p>
          </div>
          <p style={{ color:"rgba(247,247,245,0.3)", fontSize:"9px", fontStyle:"italic",
            lineHeight:"1.8", margin:"24px auto 0", maxWidth:"400px" }}>
            Selah is not therapy, counseling, or medical advice. Not a substitute for professional mental health care.
            If you are in crisis, call 988 or 911. By using Selah, you agree its creators assume no liability for outcomes from use.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes bobDown{0%,100%{transform:translateY(0)}50%{transform:translateY(6px)}}
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// QUICK CHECK-IN (2-minute mode)
// ═══════════════════════════════════════════════════════
function QuickCheckIn({ C, font, onClose, onboardingAnswers, faithLevel, userName, onActive, tone, isMinorUser, tier, sessionHistory }) {
  const [step, setStep] = useState(0);
  const [mood, setMood] = useState(null);
  const [word, setWord] = useState("");
  const [gratitude, setGratitude] = useState("");
  const [intention, setIntention] = useState("");
  const [reflection, setReflection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [personalFollowup, setPersonalFollowup] = useState("");

  // Personalized questions for Growth+ based on session history
  const isGrowthPlus = (TIER_LEVELS[tier]||0) >= TIER_LEVELS.growth;
  const personalizedQ = (() => {
    if (!isGrowthPlus || !sessionHistory || sessionHistory.length < 2) return null;
    const recentCategories = sessionHistory.slice(0,5).map(s=>s.category).filter(Boolean);
    const recentInsights = sessionHistory.slice(0,3).map(s=>s.insight).filter(Boolean);
    const topCategory = recentCategories[0] || null;
    const lastInsight = recentInsights[0] || null;
    return { topCategory, lastInsight };
  })();

  const submit = async () => {
    setLoading(true);
    const context = [
      mood !== null && `Mood: ${["Very low","Low","Neutral","Good","Great"][mood]}`,
      word && `One word: "${word}"`,
      gratitude && `Grateful for: "${gratitude}"`,
      intention && `Today's intention: "${intention}"`,
      onboardingAnswers?.reasons && `Working through: ${Array.isArray(onboardingAnswers.reasons)?onboardingAnswers.reasons.join(", "):onboardingAnswers.reasons}`,
      personalizedQ?.lastInsight && `Last session insight: "${personalizedQ.lastInsight}"`,
      personalFollowup && `Follow-up on last session: "${personalFollowup}"`,
    ].filter(Boolean).join(". ");
    try {
      const r = await fetch("/api/chat", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:200,
          messages:[{role:"user",content:`You are Selah — a faith-rooted clarity companion. Someone just did a 2-minute check-in. Here's what they shared: ${context}. Write a warm, personal 2-3 sentence reflection back to ${userName||"them"}. ${faithLevel>=2?"Include a gentle faith reference.":"Keep it secular."} ${tone==="warm"?"Be extra gentle and nurturing.":tone==="structured"?"Be organized and clear.":tone==="spiritual"?"Lead with faith and scripture.":"Be direct and real."}${isMinorUser?" This user is under 18. Keep content age-appropriate, encouraging, and supportive. Use simpler language. If they mentioned anything concerning, encourage them to talk to a trusted adult.":""} No therapy-speak. End with one grounding thought they can carry into their day.`}]})});
      const d = await r.json();
      if(d.error) throw new Error(d.error?.message||"API error");
      setReflection(d.content.map(b=>b.text||"").join("").trim());
    } catch {
      setReflection("You paused. You checked in with yourself. That matters more than you think. Carry that awareness into whatever comes next.");
    } finally { setLoading(false); setDone(true); if(onActive) onActive(); }
  };

  if (done) return (
    <div style={{ minHeight:"100vh", background:C.bgPrimary, fontFamily:font,
      display:"flex", flexDirection:"column", alignItems:"center",
      justifyContent:"center", padding:"40px 24px", textAlign:"center" }}>
      <div style={{ maxWidth:"400px", width:"100%" }}>
        <WaveLogo size={32} color={C.accent}/>
        <p style={{ color:C.accent, fontSize:"10px", letterSpacing:"4px",
          textTransform:"uppercase", fontStyle:"italic", margin:"16px 0 8px" }}>Check-in Complete</p>
        <h1 style={{ color:C.textPrimary, fontSize:"clamp(18px,4vw,24px)",
          fontWeight:"normal", margin:"0 0 20px", lineHeight:"1.4" }}>
          Two minutes well spent.
        </h1>
        <div style={{ background:`${C.accent}12`, border:`1px solid ${C.accent}33`,
          borderRadius:"10px", padding:"20px", marginBottom:"24px", textAlign:"left" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"10px" }}>
            <div style={{ width:"24px", height:"24px", borderRadius:"50%",
              background:`${C.accent}22`, border:`1px solid ${C.accent}44`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:"10px", flexShrink:0 }}>✦</div>
            <p style={{ color:C.accent, fontSize:"9px", letterSpacing:"3px",
              textTransform:"uppercase", fontStyle:"italic", margin:0 }}>Selah's reflection</p>
          </div>
          <p style={{ color:C.textSoft, fontSize:"13px", fontStyle:"italic",
            lineHeight:"1.9", margin:0 }}>{reflection}</p>
        </div>
        {/* Summary */}
        <div style={{ display:"flex", gap:"8px", justifyContent:"center", marginBottom:"24px", flexWrap:"wrap" }}>
          {mood!==null&&<span style={{ background:`${C.terra}15`, color:C.terra,
            fontSize:"9px", letterSpacing:"1.5px", textTransform:"uppercase",
            padding:"4px 10px", borderRadius:"10px", fontStyle:"italic" }}>
            {["😔","😕","😐","🙂","😌"][mood]} {["Very low","Low","Neutral","Good","Great"][mood]}
          </span>}
          {word&&<span style={{ background:`${C.sage}15`, color:C.sage,
            fontSize:"9px", letterSpacing:"1.5px", textTransform:"uppercase",
            padding:"4px 10px", borderRadius:"10px", fontStyle:"italic" }}>{word}</span>}
        </div>
        <button onClick={onClose} style={{ background:C.accent, border:"none",
          borderRadius:"3px", color:"#fff", fontSize:"10px", letterSpacing:"3px",
          textTransform:"uppercase", padding:"16px 40px", cursor:"pointer",
          fontFamily:font, fontStyle:"italic", boxShadow:`0 2px 12px ${C.accent}33` }}>
          Continue Your Day
        </button>
      </div>
    </div>
  );

  const STEPS = [
    // Mood
    () => (
      <div style={{ textAlign:"center" }}>
        <p style={{ color:C.textPrimary, fontSize:"clamp(18px,4vw,22px)",
          fontWeight:"normal", margin:"0 0 8px" }}>How are you right now?</p>
        <p style={{ color:C.textMuted, fontSize:"12px", fontStyle:"italic", margin:"0 0 24px" }}>
          Don't overthink it. First instinct.
        </p>
        <div style={{ display:"flex", gap:"12px", justifyContent:"center" }}>
          {["😔","😕","😐","🙂","😌"].map((e,i) => (
            <button key={i} onClick={() => { setMood(i); setTimeout(()=>setStep(1),300); }} style={{
              background:mood===i?`${C.terra}22`:C.bgSecondary,
              border:`2px solid ${mood===i?C.terra:"transparent"}`,
              borderRadius:"50%", width:"52px", height:"52px", fontSize:"24px",
              cursor:"pointer", transition:"all 0.2s ease",
              display:"flex", alignItems:"center", justifyContent:"center" }}>{e}</button>
          ))}
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:"12px", padding:"0 8px" }}>
          <span style={{ color:C.textMuted, fontSize:"10px", fontStyle:"italic" }}>Rough</span>
          <span style={{ color:C.textMuted, fontSize:"10px", fontStyle:"italic" }}>Great</span>
        </div>
      </div>
    ),
    // One word
    () => (
      <div style={{ textAlign:"center" }}>
        <p style={{ color:C.textPrimary, fontSize:"clamp(18px,4vw,22px)",
          fontWeight:"normal", margin:"0 0 8px" }}>One word for today.</p>
        <p style={{ color:C.textMuted, fontSize:"12px", fontStyle:"italic", margin:"0 0 24px" }}>
          Whatever comes to mind first.
        </p>
        <input value={word} onChange={e=>setWord(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&word.trim()&&setStep(2)}
          placeholder="Anxious · Hopeful · Tired · Ready..."
          autoFocus
          style={{ width:"100%", boxSizing:"border-box", background:C.bgSecondary,
            border:`1.5px solid ${word?C.accent+"55":"transparent"}`,
            borderRadius:"8px", padding:"16px", color:C.textPrimary,
            fontSize:"16px", fontStyle:"italic", fontFamily:font,
            outline:"none", textAlign:"center" }}/>
      </div>
    ),
    // Gratitude
    () => (
      <div style={{ textAlign:"center" }}>
        <p style={{ color:C.textPrimary, fontSize:"clamp(18px,4vw,22px)",
          fontWeight:"normal", margin:"0 0 8px" }}>One thing you're grateful for.</p>
        <p style={{ color:C.textMuted, fontSize:"12px", fontStyle:"italic", margin:"0 0 24px" }}>
          Even small. Especially small.
        </p>
        <input value={gratitude} onChange={e=>setGratitude(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&gratitude.trim()&&setStep(3)}
          placeholder="Coffee · A friend · Waking up..."
          autoFocus
          style={{ width:"100%", boxSizing:"border-box", background:C.bgSecondary,
            border:`1.5px solid ${gratitude?C.sage+"55":"transparent"}`,
            borderRadius:"8px", padding:"16px", color:C.textPrimary,
            fontSize:"16px", fontStyle:"italic", fontFamily:font,
            outline:"none", textAlign:"center" }}/>
      </div>
    ),
    // Intention
    () => (
      <div style={{ textAlign:"center" }}>
        <p style={{ color:C.textPrimary, fontSize:"clamp(18px,4vw,22px)",
          fontWeight:"normal", margin:"0 0 8px" }}>One intention for today.</p>
        <p style={{ color:C.textMuted, fontSize:"12px", fontStyle:"italic", margin:"0 0 24px" }}>
          Not a to-do. A way of being.
        </p>
        <input value={intention} onChange={e=>setIntention(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&intention.trim()&&(personalizedQ?setStep(4):submit())}
          placeholder="Be patient · Speak up · Rest without guilt..."
          autoFocus
          style={{ width:"100%", boxSizing:"border-box", background:C.bgSecondary,
            border:`1.5px solid ${intention?C.amber+"55":"transparent"}`,
            borderRadius:"8px", padding:"16px", color:C.textPrimary,
            fontSize:"16px", fontStyle:"italic", fontFamily:font,
            outline:"none", textAlign:"center" }}/>
      </div>
    ),
    // Personalized question (Growth+ only, when session history exists)
    ...(personalizedQ ? [() => (
      <div style={{ textAlign:"center" }}>
        <div style={{ display:"inline-block", background:`${C.accent}15`, borderRadius:"20px",
          padding:"4px 14px", marginBottom:"16px" }}>
          <span style={{ color:C.accent, fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase",
            fontStyle:"italic" }}>Personalized</span>
        </div>
        <p style={{ color:C.textPrimary, fontSize:"clamp(18px,4vw,22px)",
          fontWeight:"normal", margin:"0 0 8px" }}>
          {personalizedQ.topCategory
            ? `Last time you reflected on "${personalizedQ.topCategory}." How's that sitting now?`
            : "Looking back at your last session — what's shifted since then?"}
        </p>
        <p style={{ color:C.textMuted, fontSize:"12px", fontStyle:"italic", margin:"0 0 24px" }}>
          A sentence is enough. This is for you.
        </p>
        <input value={personalFollowup} onChange={e=>setPersonalFollowup(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&personalFollowup.trim()&&submit()}
          placeholder="Better · Still working on it · Haven't thought about it..."
          autoFocus
          style={{ width:"100%", boxSizing:"border-box", background:C.bgSecondary,
            border:`1.5px solid ${personalFollowup?C.accent+"55":"transparent"}`,
            borderRadius:"8px", padding:"16px", color:C.textPrimary,
            fontSize:"16px", fontStyle:"italic", fontFamily:font,
            outline:"none", textAlign:"center" }}/>
      </div>
    )] : []),
  ];

  const canNext = step===0?mood!==null : step===1?word.trim() : step===2?gratitude.trim() : step===3?intention.trim() : personalFollowup.trim();

  return (
    <div style={{ minHeight:"100vh", background:C.bgPrimary, fontFamily:font,
      display:"flex", flexDirection:"column", alignItems:"center",
      justifyContent:"center", padding:"40px 24px", position:"relative" }}>

      <button onClick={onClose} style={{ position:"absolute", top:"20px", left:"20px",
        background:"none", border:"none", cursor:"pointer",
        color:C.textMuted, fontSize:"18px", padding:"8px" }}>←</button>

      <div style={{ maxWidth:"400px", width:"100%" }}>
        {/* Progress */}
        <div style={{ display:"flex", gap:"6px", marginBottom:"32px" }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{ flex:1, height:"3px", borderRadius:"2px",
              background: i<=step ? C.accent : C.bgSecondary,
              transition:"background 0.3s ease" }}/>
          ))}
        </div>

        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"24px" }}>
          <div>
            <p style={{ color:C.accent, fontSize:"9px", letterSpacing:"3px",
              textTransform:"uppercase", fontStyle:"italic", margin:0 }}>Quick Check-in</p>
            <p style={{ color:C.textMuted, fontSize:"10px", fontStyle:"italic", margin:"2px 0 0" }}>
              Step {step+1} of {personalizedQ ? 5 : 4} · ~2 minutes
            </p>
          </div>
          <WaveLogo size={22} color={C.accent}/>
        </div>

        {loading ? (
          <div style={{ textAlign:"center", padding:"40px 0" }}>
            <div style={{ display:"flex", justifyContent:"center", gap:"8px", marginBottom:"14px" }}>
              {[0,1,2].map(i=>(
                <div key={i} style={{ width:"8px", height:"8px", borderRadius:"50%",
                  background:C.accent, opacity:0.4,
                  animation:"pulse 1.2s ease-in-out infinite",
                  animationDelay:`${i*0.2}s` }}/>
              ))}
            </div>
            <p style={{ color:C.textMuted, fontSize:"13px", fontStyle:"italic" }}>
              Selah is reflecting on what you shared...
            </p>
          </div>
        ) : STEPS[step]()}

        {step > 0 && !loading && (
          <div style={{ display:"flex", gap:"10px", marginTop:"28px" }}>
            <button onClick={()=>setStep(s=>s-1)} style={{ flex:1, background:"none",
              border:`1px solid ${C.border}`, borderRadius:"3px", color:C.textMuted,
              fontSize:"10px", letterSpacing:"2px", textTransform:"uppercase",
              padding:"14px", cursor:"pointer", fontFamily:font, fontStyle:"italic" }}>
              Back
            </button>
            <button onClick={()=>{
              const lastStep = personalizedQ ? 4 : 3;
              step===lastStep ? submit() : setStep(s=>s+1);
            }} disabled={!canNext}
              style={{ flex:2, background:canNext?C.accent:C.bgCard, border:"none",
                borderRadius:"3px", color:canNext?"#fff":C.textMuted,
                fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase",
                padding:"14px", cursor:canNext?"pointer":"default",
                fontFamily:font, fontStyle:"italic", transition:"all 0.3s ease",
                boxShadow:canNext?`0 2px 12px ${C.accent}33`:"none" }}>
              {step===(personalizedQ?4:3)?"Finish":"Next"}
            </button>
          </div>
        )}
      </div>

      <style>{`@keyframes pulse{0%,100%{transform:scale(1);opacity:.4}50%{transform:scale(1.3);opacity:1}}`}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// PRIVACY GATE — shown before splash on every open
// ═══════════════════════════════════════════════════════
function PrivacyGate({ onAccept, C, font }) {
  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);

  const handleScroll = (e) => {
    const el = e.target;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 30) {
      setScrolled(true);
    }
  };

  return (
    <div style={{ minHeight:"100vh", background:C.bgPrimary, fontFamily:font,
      display:"flex", flexDirection:"column", alignItems:"center",
      justifyContent:"center", padding:"32px 20px 40px", boxSizing:"border-box",
      position:"relative", overflow:"hidden",
      opacity:visible?1:0, transition:"opacity 0.7s ease" }}>

      {/* Ambient */}
      <div style={{ position:"absolute", top:"-80px", left:"-60px", width:"340px", height:"340px",
        background:`radial-gradient(circle,${C.amberLight}15 0%,transparent 70%)`, pointerEvents:"none" }}/>
      <div style={{ position:"absolute", bottom:"-60px", right:"-40px", width:"280px", height:"280px",
        background:`radial-gradient(circle,${C.sageLight}18 0%,transparent 70%)`, pointerEvents:"none" }}/>

      <div style={{ maxWidth:"440px", width:"100%" }}>

        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:"28px" }}>
          <div style={{ width:"56px", height:"56px", borderRadius:"50%",
            background:`${C.sage}18`, border:`1.5px solid ${C.sage}44`,
            display:"flex", alignItems:"center", justifyContent:"center",
            margin:"0 auto 16px", fontSize:"24px" }}>
            🔒
          </div>
          <p style={{ color:C.sage, fontSize:"9px", letterSpacing:"4px",
            textTransform:"uppercase", fontStyle:"italic", margin:"0 0 8px" }}>
            Before You Enter
          </p>
          <h1 style={{ color:C.textPrimary, fontSize:"clamp(20px,5vw,24px)",
            fontWeight:"normal", margin:"0 0 10px", lineHeight:"1.4" }}>
            This space is yours alone.
          </h1>
          <p style={{ color:C.textSoft, fontSize:"13px", fontStyle:"italic",
            lineHeight:"1.9", margin:0 }}>
            Everything you share here stays here. Read this once — then walk in knowing you're safe.
          </p>
        </div>

        {/* Scrollable content */}
        <div ref={scrollRef} onScroll={handleScroll}
          style={{ background:C.bgSecondary, borderRadius:"12px",
            border:`1px solid ${C.border}`, padding:"22px",
            maxHeight:"340px", overflowY:"auto", marginBottom:"16px",
            scrollbarWidth:"thin", scrollbarColor:`${C.sageLight} transparent` }}>

          {/* Encryption */}
          <div style={{ marginBottom:"22px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"10px" }}>
              <div style={{ width:"32px", height:"32px", borderRadius:"50%",
                background:`${C.sage}18`, border:`1px solid ${C.sage}33`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:"14px", flexShrink:0 }}>🛡️</div>
              <p style={{ color:C.sage, fontSize:"10px", letterSpacing:"2.5px",
                textTransform:"uppercase", fontStyle:"italic", margin:0 }}>
                End-to-End Encryption
              </p>
            </div>
            <p style={{ color:C.textSoft, fontSize:"13px", fontStyle:"italic",
              lineHeight:"1.9", margin:0 }}>
              Every word you type — every reflection, every notebook entry, every session — is encrypted
              the moment it leaves your device. Not even we can read it. Your thoughts belong to you.
            </p>
          </div>

          <div style={{ height:"1px", background:C.border, margin:"0 0 22px" }}/>

          {/* Never sold */}
          <div style={{ marginBottom:"22px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"10px" }}>
              <div style={{ width:"32px", height:"32px", borderRadius:"50%",
                background:`${C.amber}15`, border:`1px solid ${C.amber}33`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:"14px", flexShrink:0 }}>🚫</div>
              <p style={{ color:C.amber, fontSize:"10px", letterSpacing:"2.5px",
                textTransform:"uppercase", fontStyle:"italic", margin:0 }}>
                Never Sold. Never Shared.
              </p>
            </div>
            <p style={{ color:C.textSoft, fontSize:"13px", fontStyle:"italic",
              lineHeight:"1.9", margin:0 }}>
              Your data is not a product. We do not sell, rent, share, or profit from what you share
              with Selah — ever. No advertisers. No third parties. No exceptions. What you say here
              is sacred, and we treat it that way.
            </p>
          </div>

          <div style={{ height:"1px", background:C.border, margin:"0 0 22px" }}/>

          {/* Not therapy */}
          <div style={{ marginBottom:"22px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"10px" }}>
              <div style={{ width:"32px", height:"32px", borderRadius:"50%",
                background:`${C.terra}12`, border:`1px solid ${C.terra}33`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:"14px", flexShrink:0 }}>💬</div>
              <p style={{ color:C.terra, fontSize:"10px", letterSpacing:"2.5px",
                textTransform:"uppercase", fontStyle:"italic", margin:0 }}>
                A Companion, Not a Clinician
              </p>
            </div>
            <p style={{ color:C.textSoft, fontSize:"13px", fontStyle:"italic",
              lineHeight:"1.9", margin:0 }}>
              Selah is a guided reflection and emotional clarity tool — not a licensed therapist,
              counselor, psychiatrist, or medical provider. It is not a substitute for professional mental health
              care, diagnosis, or treatment. Selah does not provide medical advice, crisis intervention, or
              emergency services. If you are in crisis or experiencing thoughts of self-harm or harm to others,
              please reach out to a qualified professional or call
              <strong style={{ color:C.terra }}> 988 </strong> (Suicide & Crisis Lifeline) or
              <strong style={{ color:C.terra }}> 911 </strong> immediately.
              By using Selah, you acknowledge that its creators, developers, and affiliates are not
              liable for any decisions, actions, or outcomes resulting from your use of this app.
            </p>
          </div>

          <div style={{ height:"1px", background:C.border, margin:"0 0 22px" }}/>

          {/* Crisis detection */}
          <div style={{ marginBottom:"22px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"10px" }}>
              <div style={{ width:"32px", height:"32px", borderRadius:"50%",
                background:`${C.sage}15`, border:`1px solid ${C.sage}33`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:"14px", flexShrink:0 }}>🤍</div>
              <p style={{ color:C.sage, fontSize:"10px", letterSpacing:"2.5px",
                textTransform:"uppercase", fontStyle:"italic", margin:0 }}>
                We Are Watching Over You
              </p>
            </div>
            <p style={{ color:C.textSoft, fontSize:"13px", fontStyle:"italic",
              lineHeight:"1.9", margin:0 }}>
              Selah listens carefully. If your words ever suggest you may be in danger or thinking
              about harming yourself, we will gently pause the session and connect you directly
              to crisis support. This is not surveillance — it is care.
            </p>
          </div>

          <div style={{ height:"1px", background:C.border, margin:"0 0 22px" }}/>

          {/* Age */}
          <div style={{ marginBottom:"22px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"10px" }}>
              <div style={{ width:"32px", height:"32px", borderRadius:"50%",
                background:`${C.amber}12`, border:`1px solid ${C.amber}22`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:"14px", flexShrink:0 }}>📋</div>
              <p style={{ color:C.amber, fontSize:"10px", letterSpacing:"2.5px",
                textTransform:"uppercase", fontStyle:"italic", margin:0 }}>
                Age & Eligibility
              </p>
            </div>
            <p style={{ color:C.textSoft, fontSize:"13px", fontStyle:"italic",
              lineHeight:"1.9", margin:0 }}>
              By entering Selah, you confirm that you are at least 13 years of age. Users under 18
              are welcome and their data is held to the highest standard of protection. Parental
              awareness is encouraged for users under 16.
            </p>
          </div>

          <div style={{ height:"1px", background:C.border, margin:"0 0 20px" }}/>

          {/* Closing statement */}
          <div style={{ background:`${C.sage}10`, borderRadius:"8px",
            padding:"16px", border:`1px solid ${C.sage}22` }}>
            <p style={{ color:C.textSoft, fontSize:"12px", fontStyle:"italic",
              lineHeight:"1.9", margin:"0 0 10px" }}>
              We built Selah because we believe every person deserves a private place to think clearly,
              feel heard, and grow. Your trust is not taken lightly. We hold it carefully.
            </p>
            <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
              <div style={{ width:"16px", height:"1px", background:C.sage, opacity:0.5 }}/>
              <span style={{ color:C.sage, fontSize:"10px", letterSpacing:"2px",
                textTransform:"uppercase", fontStyle:"italic" }}>The Selah Team</span>
            </div>
          </div>

          {/* Scroll indicator */}
          {!scrolled&&(
            <div style={{ textAlign:"center", marginTop:"16px" }}>
              <p style={{ color:C.textMuted, fontSize:"9px", letterSpacing:"2px",
                textTransform:"uppercase", fontStyle:"italic", margin:0,
                animation:"pulse2 1.8s ease-in-out infinite" }}>
                scroll to continue ↓
              </p>
            </div>
          )}
        </div>

        {/* Agreement checkbox */}
        <div onClick={()=>scrolled&&setAgreed(a=>!a)}
          style={{ display:"flex", alignItems:"flex-start", gap:"12px",
            marginBottom:"16px", cursor:scrolled?"pointer":"default",
            opacity:scrolled?1:0.4, transition:"opacity 0.4s ease" }}>
          <div style={{ width:"20px", height:"20px", borderRadius:"4px", flexShrink:0, marginTop:"1px",
            background:agreed?C.sage:C.bgSecondary,
            border:`1.5px solid ${agreed?C.sage:C.border}`,
            display:"flex", alignItems:"center", justifyContent:"center",
            transition:"all 0.2s ease" }}>
            {agreed&&<span style={{ color:"#fff", fontSize:"11px" }}>✓</span>}
          </div>
          <p style={{ color:C.textSoft, fontSize:"12px", fontStyle:"italic",
            lineHeight:"1.8", margin:0 }}>
            I have read and understood the above. I agree to use Selah as a personal clarity and reflection tool,
            not a replacement for professional mental health care, therapy, counseling, or medical advice.
            I understand that Selah is not a crisis intervention service and I will contact 988, 911,
            or a licensed professional if I am in danger. I release Selah and its creators from any
            liability related to my use of this app.
          </p>
        </div>

        {/* Enter button */}
        <button onClick={()=>agreed&&onAccept()} disabled={!agreed} style={{
          width:"100%", background:agreed?C.sage:C.bgCard,
          border:"none", borderRadius:"3px",
          color:agreed?"#fff":C.textMuted,
          fontSize:"10px", letterSpacing:"4px", textTransform:"uppercase",
          padding:"18px", cursor:agreed?"pointer":"default",
          fontFamily:font, fontStyle:"italic",
          transition:"all 0.3s ease",
          boxShadow:agreed?`0 2px 14px ${C.sage}44`:"none" }}>
          {agreed?"Enter Selah →":"Read the full disclosure to continue"}
        </button>

        <p style={{ color:C.textMuted, fontSize:"10px", fontStyle:"italic",
          textAlign:"center", margin:"12px 0 0", lineHeight:"1.7" }}>
          This disclosure is shown once per session. Your acceptance is remembered.
        </p>
      </div>

      <style>{`
        @keyframes pulse2{0%,100%{opacity:0.4}50%{opacity:1}}
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// SPLASH SCREEN
// ═══════════════════════════════════════════════════════
function SplashScreen({ onDone, C, font }) {
  const [phase,setPhase]=useState("idle");
  const [visibleLetters,setVisibleLetters]=useState(0);
  const [started,setStarted]=useState(false);
  const [hovered,setHovered]=useState(false);
  const letters=["S","E","L","A","H"];

  useEffect(()=>{
    if(!started)return;
    setPhase("letters");
    let count=0;
    const iv=setInterval(()=>{
      count++; setVisibleLetters(count);
      if(count>=letters.length){
        clearInterval(iv);
        setTimeout(()=>setPhase("line"),500);
        setTimeout(()=>setPhase("meaning"),1100);
        setTimeout(()=>setPhase("dots"),1700);
        setTimeout(()=>setPhase("quote"),2400);
        setTimeout(()=>setPhase("button"),3200);
      }
    },280);
    return()=>clearInterval(iv);
  },[started]);

  const after=(p)=>["letters","line","meaning","dots","quote","button"].indexOf(phase)>=["letters","line","meaning","dots","quote","button"].indexOf(p);
  const floatDots=[{s:12,c:C.sage},{s:8,c:C.amber},{s:10,c:C.terra},{s:7,c:C.sage},{s:9,c:C.amber},{s:6,c:C.terra},{s:11,c:C.sage},{s:8,c:C.amber},{s:7,c:C.terra},{s:10,c:C.sage}];

  return (
    <div style={{ minHeight:"100vh",background:C.bgPrimary,fontFamily:font,
      display:"flex",flexDirection:"column",alignItems:"center",
      justifyContent:"center",padding:"40px 24px",position:"relative",overflow:"hidden" }}>
      {/* Grain texture */}
      <div style={{ position:"absolute",inset:0,pointerEvents:"none",
        backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
        opacity:0.5 }}/>
      {/* Ambient glows */}
      <div style={{ position:"absolute",top:"-100px",left:"-80px",width:"400px",height:"400px",
        background:`radial-gradient(circle,${C.amberLight}1A 0%,transparent 70%)`,pointerEvents:"none" }}/>
      <div style={{ position:"absolute",bottom:"-80px",right:"-60px",width:"360px",height:"360px",
        background:`radial-gradient(circle,${C.sageLight}22 0%,transparent 70%)`,pointerEvents:"none" }}/>
      {/* Floating dots */}
      {floatDots.map((d,i)=>(
        <div key={i} style={{ position:"absolute",width:`${d.s}px`,height:`${d.s}px`,
          borderRadius:"50%",background:d.c,opacity:0.12+(i%3)*0.05,
          top:`${8+(i*19)%84}%`,left:`${4+(i*27)%92}%`,
          animation:`flt ${5+(i%3)*2}s ease-in-out infinite`,
          animationDelay:`${i*0.5}s` }}/>
      ))}

      {!started?(
        <div style={{ textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:"20px" }}>
          <WaveLogo size={36} color={C.sage}/>
          <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:"14px" }}>
            <div style={{ width:"56px",height:"56px",borderRadius:"50%",
              border:`1px solid ${C.sage}44`,display:"flex",alignItems:"center",justifyContent:"center",
              cursor:"pointer",onClick:()=>setStarted(true) }}
              onClick={()=>setStarted(true)}>
              <div style={{ width:"8px",height:"8px",borderRadius:"50%",background:C.sage,opacity:0.55 }}/>
            </div>
            <p style={{ color:C.textMuted,fontSize:"10px",letterSpacing:"5px",
              textTransform:"uppercase",margin:0,fontStyle:"italic",cursor:"pointer" }}
              onClick={()=>setStarted(true)}>touch to begin</p>
          </div>
        </div>
      ):(
        <div style={{ textAlign:"center",width:"100%",maxWidth:"400px" }}>
          {/* Letters */}
          <div style={{ display:"flex",gap:"clamp(4px,2vw,10px)",justifyContent:"center",marginBottom:"28px" }}>
            {letters.map((l,i)=>(
              <span key={i} style={{ color:C.sage,fontSize:"clamp(32px,9vw,52px)",
                fontWeight:"bold",letterSpacing:"0.1em",
                opacity:visibleLetters>i?1:0,
                transform:visibleLetters>i?"translateY(0)":"translateY(16px)",
                transition:"all 0.5s cubic-bezier(0.34,1.2,0.64,1)",
                transitionDelay:`${i*0.05}s` }}>{l}</span>
            ))}
          </div>
          {/* Line + dots */}
          {after("line")&&(
            <div style={{ display:"flex",alignItems:"center",justifyContent:"center",
              gap:"10px",marginBottom:"20px",animation:"fadeUp 0.6s ease" }}>
              <div style={{ width:after("line")?"60px":"0px",height:"1px",
                background:C.sage,opacity:0.45,transition:"width 1.2s ease" }}/>
              <div style={{ width:"5px",height:"5px",borderRadius:"50%",background:C.amber,opacity:0.65 }}/>
              <div style={{ width:after("line")?"60px":"0px",height:"1px",
                background:C.sage,opacity:0.45,transition:"width 1.2s ease" }}/>
            </div>
          )}
          {after("meaning")&&(
            <div style={{ display:"flex",gap:"clamp(14px,4vw,36px)",marginBottom:"32px",
              flexWrap:"wrap",justifyContent:"center",animation:"fadeUp 0.6s ease" }}>
              {[["Pause",C.sage],["Breathe",C.amber],["Reflect",C.terra],["Listen",C.sage]].map(([w,dot])=>(
                <div key={w} style={{ display:"flex",alignItems:"center",gap:"7px" }}>
                  <div style={{ width:"4px",height:"4px",borderRadius:"50%",background:dot,opacity:0.7 }}/>
                  <span style={{ color:C.textSoft,fontSize:"clamp(11px,2.2vw,14px)",
                    fontStyle:"italic",letterSpacing:"0.06em" }}>{w}</span>
                </div>
              ))}
            </div>
          )}
          {after("quote")&&(
            <div style={{ background:C.bgSecondary,border:`1px solid ${C.sage}28`,
              borderRadius:"4px",padding:"20px 28px",width:"100%",textAlign:"center",
              marginBottom:"28px",boxSizing:"border-box",animation:"fadeUp 0.6s ease" }}>
              <p style={{ color:C.textSoft,fontSize:"clamp(12px,2.5vw,14px)",
                fontStyle:"italic",letterSpacing:"0.04em",lineHeight:"1.9",margin:"0 0 10px" }}>
                "Even though I walk through the valley of the shadow of death, I will fear no evil, for you are with me."
              </p>
              <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:"8px" }}>
                <div style={{ width:"16px",height:"1px",background:C.sage,opacity:0.4 }}/>
                <span style={{ color:C.textMuted,fontSize:"10px",fontStyle:"italic",
                  letterSpacing:"1px" }}>Psalm 23:4</span>
                <div style={{ width:"16px",height:"1px",background:C.sage,opacity:0.4 }}/>
              </div>
            </div>
          )}
          {after("button")&&(
            <button onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
              onClick={onDone} style={{
                background:hovered?C.sageDark:C.sage,border:"none",borderRadius:"3px",
                color:"#fff",fontSize:"11px",letterSpacing:"4px",textTransform:"uppercase",
                padding:"18px 52px",cursor:"pointer",fontFamily:font,fontStyle:"italic",
                transition:"background 0.3s ease,transform 0.2s ease,box-shadow 0.3s ease",
                transform:hovered?"translateY(-2px)":"translateY(0)",
                boxShadow:hovered?`0 8px 24px ${C.sage}44`:`0 2px 10px ${C.sage}30`,
                animation:"fadeUp 0.6s ease" }}>
              Begin
            </button>
          )}
        </div>
      )}
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes flt{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-18px) scale(1.08)}}
      `}</style>
    </div>
  );
}


// ═══════════════════════════════════════════════════════
// FIRST TIME WELCOME — personalized post-onboarding
// ═══════════════════════════════════════════════════════
function FirstTimeWelcome({ C, font, userName, onboardingAnswers, onReflect, onExplore }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  // Build a personal line from their onboarding answers
  const reasons = onboardingAnswers?.reasons || [];
  const goal = onboardingAnswers?.goal || "";
  const heaviest = onboardingAnswers?.biggest || "";

  const personalLine = goal
    ? `You want to become someone who ${goal.toLowerCase().replace(/^i want to become someone who /i,"")}.`
    : reasons.length > 0
    ? `You came here about ${reasons[0].toLowerCase()}.`
    : "You showed up. That already matters.";

  const heaviestLine = heaviest === "Something from my past"
    ? "Whatever you're carrying from the past — this is a safe place to put it down."
    : heaviest === "Pressure about my future"
    ? "The pressure you're feeling about the future — we'll work through it together."
    : heaviest === "Who I am and my worth"
    ? "Questions about your worth and identity — those are worth sitting with."
    : heaviest === "A relationship that's hurting me"
    ? "Relationships that are hurting — this is a place to think clearly about them."
    : "Whatever weight you're carrying — this space was built for exactly that.";

  return (
    <div style={{ minHeight:"100vh", background:C.bgPrimary, fontFamily:font,
      display:"flex", flexDirection:"column", alignItems:"center",
      justifyContent:"center", padding:"40px 24px", position:"relative", overflow:"hidden",
      opacity: visible ? 1 : 0, transition:"opacity 0.8s ease" }}>
      <div style={{ position:"absolute", top:"-80px", left:"-60px", width:"340px", height:"340px",
        background:`radial-gradient(circle,${C.amberLight}15 0%,transparent 70%)`, pointerEvents:"none" }}/>

      <div style={{ maxWidth:"400px", width:"100%", textAlign:"center" }}>
        <div style={{ marginBottom:"28px", animation:"fadeUp 0.7s ease 0.2s both" }}>
          <WaveLogo size={36} color={C.sage}/>
        </div>

        <p style={{ color:C.amber, fontSize:"10px", letterSpacing:"3px",
          textTransform:"uppercase", fontStyle:"italic", margin:"0 0 12px",
          animation:"fadeUp 0.7s ease 0.3s both" }}>
          Welcome, {userName || "friend"}
        </p>

        <h1 style={{ color:C.textPrimary, fontSize:"clamp(20px,5vw,26px)",
          fontWeight:"normal", margin:"0 0 16px", lineHeight:"1.5",
          animation:"fadeUp 0.7s ease 0.4s both" }}>
          {personalLine}
        </h1>

        <p style={{ color:C.textSoft, fontSize:"13px", fontStyle:"italic",
          lineHeight:"1.9", margin:"0 0 32px",
          animation:"fadeUp 0.7s ease 0.5s both" }}>
          {heaviestLine}
        </p>

        {/* The two choices */}
        <div style={{ display:"flex", flexDirection:"column", gap:"10px",
          animation:"fadeUp 0.7s ease 0.7s both" }}>
          <button onClick={onReflect} style={{
            background:C.sage, border:"none", borderRadius:"3px",
            color:"#fff", fontSize:"11px", letterSpacing:"3px",
            textTransform:"uppercase", padding:"18px",
            cursor:"pointer", fontFamily:font, fontStyle:"italic",
            boxShadow:`0 2px 14px ${C.sage}44`,
            transition:"all 0.2s ease" }}
            onMouseEnter={e=>e.currentTarget.style.transform="translateY(-1px)"}
            onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
            Start my first reflection now
          </button>

          <button onClick={onExplore} style={{
            background:"none", border:`1.5px solid ${C.border}`,
            borderRadius:"3px", color:C.textSoft,
            fontSize:"11px", letterSpacing:"3px",
            textTransform:"uppercase", padding:"18px",
            cursor:"pointer", fontFamily:font, fontStyle:"italic",
            transition:"all 0.2s ease" }}
            onMouseEnter={e=>e.currentTarget.style.borderColor=C.sageLight}
            onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
            Just explore for now
          </button>
        </div>

        <div style={{ marginTop:"32px", borderTop:`1px solid ${C.border}`,
          paddingTop:"20px", animation:"fadeUp 0.7s ease 0.9s both" }}>
          <p style={{ color:C.textMuted, fontSize:"11px", fontStyle:"italic",
            lineHeight:"1.9", margin:0 }}>
            "I know the plans I have for you — plans to give you hope and a future."
          </p>
          <p style={{ color:C.sageLight, fontSize:"9px", letterSpacing:"2px",
            textTransform:"uppercase", margin:"6px 0 0" }}>Jeremiah 29:11</p>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// ONBOARDING
// ═══════════════════════════════════════════════════════
function OnboardingScreen({ onDone, C, font }) {
  const [step,setStep]=useState(0);
  const [answers,setAnswers]=useState({});
  const allQuestions=[
    { id:"name", q:"First — what should Selah call you?", type:"word",
      placeholder:"Your first name or whatever feels right..." },
    { id:"age", q:"How old are you?", type:"single",
      opts:["Under 13","13-15","16-17","18-24","25-34","35-44","45+"] },
    { id:"parentEmail", q:"Since you're under 18, we need a parent or guardian's approval to keep you safe.", type:"parentConsent",
      placeholder:"Parent or guardian's email address..." },
    { id:"reasons", q:"What brought you here today?", type:"multi",
      opts:["Anxiety & overthinking","Low mood or depression","Self-worth & confidence","Lack of direction","Relationship struggles","Faith questions","Addiction & recovery","Anger & frustration","Loneliness & isolation","I just need somewhere to think"] },
    { id:"feeling", q:"Honestly — how are you feeling right now?", type:"scale", min:1, max:10 },
    { id:"biggest", q:"What's the heaviest thing you're carrying right now?", type:"single",
      opts:["Something from my past","Pressure about my future","Who I am and my worth","A relationship that's hurting me","I'm not sure — just weight"] },
    { id:"pattern", q:"When things get hard, what do you usually do?", type:"single",
      opts:["Go quiet and shut down","Get angry or frustrated","Stay busy and distract myself","Spiral in my own head","Reach out — I try to talk about it"] },
    { id:"gender", q:"How do you identify? (This helps Selah speak to you correctly)", type:"single",
      opts:["Man","Woman","Prefer not to say"] },
    { id:"faith", q:"How would you like faith woven into your experience?", type:"single",
      opts:["None — keep it secular","Minimal — only if I bring it up","Balanced — woven in naturally","Faith-forward — scripture & prayer"] },
    { id:"tone", q:"How do you want Selah to speak to you?", type:"single",
      opts:["Direct & grounded — tell it straight","Warm & gentle — meet me softly","Structured & focused — help me think clearly","Spiritually grounded — lead with faith"] },
    { id:"avoid", q:"What do you most want to avoid feeling when you use Selah?", type:"single",
      opts:["Judged or analyzed","Preached at","Pressured to be positive","Like just another therapy app","Weak for being here"] },
    { id:"goal", q:"Last one — complete this sentence: \"I want to become someone who...\"", type:"word",
      placeholder:"...is at peace. ...shows up. ...trusts himself. ...doesn't give up." },
  ];

  // Filter questions based on age
  const isMinor = answers.age === "13-15";
  const isUnder13 = answers.age === "Under 13";
  const questions = allQuestions.filter(q => {
    if (q.id === "parentEmail") return isMinor;
    return true;
  });

  const [consentSending, setConsentSending] = useState(false);
  const [consentSent, setConsentSent] = useState(false);
  const [consentMethod, setConsentMethod] = useState("email"); // "email" or "text"

  const q=questions[step];
  if(!q) return null;
  const ans=answers[q.id];
  const canNext = q.type==="multi"?(ans&&ans.length>0):q.type==="word"?(ans&&ans.trim()):q.type==="parentConsent"?(consentMethod==="email"?(answers.parentEmail&&answers.parentEmail.includes("@")&&answers.parentEmail.includes(".")):(answers.parentPhone&&answers.parentPhone.replace(/\D/g,"").length>=10)):!!ans;

  const select=(val)=>{
    if(q.type==="multi"){
      const cur=answers[q.id]||[];
      setAnswers(a=>({...a,[q.id]:cur.includes(val)?cur.filter(x=>x!==val):[...cur,val]}));
    } else { setAnswers(a=>({...a,[q.id]:val})); }
  };

  const consentMessage = `Hi — ${answers.name||"your child"} wants to use Selah, a faith-rooted mental wellness app, and needs your permission.\n\nSelah is NOT social media. No ads. No strangers. No data collection. No algorithms. It's a private space for journaling, breathing exercises, and guided reflection.\n\nEverything stays on their device. Crisis resources (988 Lifeline, Crisis Text Line) are always one tap away. All content is age-filtered and safe.\n\nWe built Selah because too many young people are carrying weight they don't know how to process — and the apps they're already using are making it worse. Your child is choosing to do the work. That takes courage.\n\nOne tap to approve:\nhttps://selah-transcend.vercel.app/api/consent?code=CODE&action=approve`;

  const sendParentConsent = async () => {
    setConsentSending(true);
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    localStorage.setItem("selah_consent_code", code);
    localStorage.setItem("selah_consent_status", "pending");

    if (consentMethod === "text") {
      const phone = (answers.parentPhone||"").replace(/\D/g,"");
      const msg = consentMessage.replace("CODE", code);
      window.open(`sms:${phone}?body=${encodeURIComponent(msg)}`, "_blank");
      setConsentSent(true);
      setConsentSending(false);
      return;
    }

    try {
      await fetch("/api/consent", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          parentEmail: answers.parentEmail,
          childName: answers.name || "Your child",
          consentCode: code
        })
      });
      setConsentSent(true);
    } catch { setConsentSent(true); }
    setConsentSending(false);
  };

  const next=()=>{
    // Block under 13
    if(q.id==="age" && answers.age==="Under 13") return;
    if(step<questions.length-1)setStep(s=>s+1);
    else onDone({...answers, isMinor});
  };

  // Under 13 block screen
  if (isUnder13 && q.id === "age") {
    return (
      <div style={{ minHeight:"100vh",background:C.bgPrimary,fontFamily:font,
        display:"flex",flexDirection:"column",alignItems:"center",
        justifyContent:"center",padding:"40px 24px",textAlign:"center" }}>
        <WaveLogo size={36} color={C.accent}/>
        <h2 style={{ color:C.textPrimary,fontSize:"22px",fontWeight:"normal",
          margin:"24px 0 12px",lineHeight:"1.4" }}>
          We're glad you're here.
        </h2>
        <p style={{ color:C.textSoft,fontSize:"13px",fontStyle:"italic",
          lineHeight:"1.9",maxWidth:"340px",margin:"0 0 20px" }}>
          Selah is designed for people 13 and older. We want to make sure you have the right support for where you are right now.
        </p>
        <div style={{ background:`${C.terra}10`,border:`1px solid ${C.terra}33`,
          borderRadius:"10px",padding:"16px 20px",maxWidth:"340px",marginBottom:"20px" }}>
          <p style={{ color:C.terra,fontSize:"11px",fontWeight:"bold",fontFamily:font,margin:"0 0 6px" }}>
            If you're going through something hard:
          </p>
          <p style={{ color:C.textSoft,fontSize:"12px",fontStyle:"italic",lineHeight:"1.8",margin:0 }}>
            Talk to a parent, teacher, school counselor, or any adult you trust. You can also text HOME to 741741 (Crisis Text Line) anytime.
          </p>
        </div>
        <button onClick={()=>setAnswers(a=>({...a, age:null}))} style={{
          background:"none",border:`1px solid ${C.border}`,borderRadius:"3px",
          color:C.textMuted,fontSize:"10px",letterSpacing:"2px",textTransform:"uppercase",
          padding:"12px 28px",cursor:"pointer",fontFamily:font,fontStyle:"italic" }}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight:"100vh",background:C.bgPrimary,fontFamily:font,
      padding:"40px 20px 80px",boxSizing:"border-box" }}>
      <div style={{ maxWidth:"480px",margin:"0 auto" }}>
        <div style={{ display:"flex",alignItems:"center",
          justifyContent:"space-between",marginBottom:"28px" }}>
          <WaveLogo size={24} color={C.accent}/>
          <span style={{ color:C.textMuted,fontSize:"11px",fontStyle:"italic" }}>
            {step+1} of {questions.length}
          </span>
        </div>
        <div style={{ height:"3px",background:C.bgSecondary,
          borderRadius:"2px",marginBottom:"32px",overflow:"hidden" }}>
          <div style={{ height:"100%",borderRadius:"2px",background:C.accent,
            width:`${((step+1)/questions.length)*100}%`,transition:"width 0.5s ease" }}/>
        </div>
        <h2 style={{ color:C.textPrimary,fontSize:"clamp(18px,4vw,22px)",
          fontWeight:"normal",margin:"0 0 24px",lineHeight:"1.5" }}>{q.q}</h2>

        {(q.type==="single"||q.type==="multi")&&(
          <div style={{ display:"flex",flexDirection:"column",gap:"8px",marginBottom:"28px" }}>
            {q.opts.map(opt=>{
              const sel=q.type==="multi"?(answers[q.id]||[]).includes(opt):answers[q.id]===opt;
              return (
                <button key={opt} onClick={()=>select(opt)} style={{
                  background:sel?`${C.accent}18`:C.bgSecondary,
                  border:`1.5px solid ${sel?C.accent+"66":"transparent"}`,
                  borderRadius:"8px",padding:"14px 18px",cursor:"pointer",
                  textAlign:"left",color:sel?C.accent:C.textSoft,
                  fontSize:"13px",fontStyle:"italic",fontFamily:font,
                  transition:"all 0.2s ease",
                  fontWeight:sel?"bold":"normal" }}>
                  {sel?"✓  ":""}{opt}
                </button>
              );
            })}
          </div>
        )}

        {q.type==="scale"&&(
          <div style={{ marginBottom:"28px" }}>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(10,1fr)",gap:"3px",marginBottom:"12px" }}>
              {Array.from({length:10},(_,i)=>i+1).map(n=>{
                const sel=answers[q.id]===n;
                return (
                  <button key={n} onClick={()=>select(n)} style={{
                    width:"100%",aspectRatio:"1",borderRadius:"50%",
                    background:sel?C.accent:C.bgSecondary,
                    border:`1.5px solid ${sel?C.accent:"transparent"}`,
                    color:sel?"#fff":C.textSoft,
                    fontSize:"clamp(10px,3vw,13px)",
                    cursor:"pointer",fontFamily:font,transition:"all 0.2s ease",
                    display:"flex",alignItems:"center",justifyContent:"center",
                    padding:0 }}>
                    {n}
                  </button>
                );
              })}
            </div>
            <div style={{ display:"flex",justifyContent:"space-between" }}>
              <span style={{ color:C.textMuted,fontSize:"11px",fontStyle:"italic" }}>Very low</span>
              <span style={{ color:C.textMuted,fontSize:"11px",fontStyle:"italic" }}>Really good</span>
            </div>
          </div>
        )}

        {q.type==="word"&&(
          <input value={answers[q.id]||""} onChange={e=>setAnswers(a=>({...a,[q.id]:e.target.value}))}
            placeholder={q.placeholder}
            style={{ width:"100%",boxSizing:"border-box",background:C.bgSecondary,
              border:`1.5px solid ${answers[q.id]?C.accent+"55":"transparent"}`,
              borderRadius:"8px",padding:"14px 16px",color:C.textPrimary,
              fontSize:"14px",fontStyle:"italic",fontFamily:font,
              outline:"none",marginBottom:"28px",transition:"border-color 0.2s ease" }}/>
        )}

        {q.type==="parentConsent"&&(
          <div style={{ marginBottom:"28px" }}>
            <div style={{ background:`${C.sage}10`,border:`1px solid ${C.sage}33`,
              borderRadius:"10px",padding:"16px",marginBottom:"16px" }}>
              <p style={{ color:C.textSoft,fontSize:"12px",fontStyle:"italic",lineHeight:"1.8",margin:0 }}>
                That's totally okay — Selah is here for you too. We just need a parent or guardian to give the green light. Pick how you'd like to reach them:
              </p>
            </div>

            {/* Method toggle */}
            <div style={{ display:"flex",gap:"8px",marginBottom:"16px" }}>
              {[{id:"email",icon:"✉️",label:"Email"}].map(m=>(
                <button key={m.id} onClick={()=>setConsentMethod(m.id)} style={{
                  flex:1,background:consentMethod===m.id?`${C.accent}15`:C.bgSecondary,
                  border:`1.5px solid ${consentMethod===m.id?C.accent+"55":"transparent"}`,
                  borderRadius:"8px",padding:"14px",cursor:"pointer",
                  display:"flex",alignItems:"center",justifyContent:"center",gap:"8px",
                  transition:"all 0.2s ease" }}>
                  <span style={{ fontSize:"16px" }}>{m.icon}</span>
                  <span style={{ color:consentMethod===m.id?C.accent:C.textSoft,
                    fontSize:"12px",fontStyle:"italic",fontFamily:font,
                    fontWeight:consentMethod===m.id?"bold":"normal" }}>{m.label}</span>
                </button>
              ))}
            </div>

            {/* Email input */}
            {consentMethod==="email" && (
              <input value={answers.parentEmail||""} onChange={e=>setAnswers(a=>({...a,parentEmail:e.target.value}))}
                placeholder="Parent or guardian's email address..." type="email"
                style={{ width:"100%",boxSizing:"border-box",background:C.bgSecondary,
                  border:`1.5px solid ${answers.parentEmail?C.accent+"55":"transparent"}`,
                  borderRadius:"8px",padding:"14px 16px",color:C.textPrimary,
                  fontSize:"14px",fontStyle:"italic",fontFamily:font,
                  outline:"none",transition:"border-color 0.2s ease" }}/>
            )}

            {/* Phone input */}
            {consentMethod==="text" && (
              <input value={answers.parentPhone||""} onChange={e=>setAnswers(a=>({...a,parentPhone:e.target.value}))}
                placeholder="Parent or guardian's phone number..." type="tel"
                style={{ width:"100%",boxSizing:"border-box",background:C.bgSecondary,
                  border:`1.5px solid ${answers.parentPhone?C.accent+"55":"transparent"}`,
                  borderRadius:"8px",padding:"14px 16px",color:C.textPrimary,
                  fontSize:"14px",fontStyle:"italic",fontFamily:font,
                  outline:"none",transition:"border-color 0.2s ease" }}/>
            )}

            {/* What they'll receive preview */}
            <div style={{ marginTop:"12px",background:C.bgSecondary,border:`1px solid ${C.border}`,
              borderRadius:"8px",padding:"14px 16px" }}>
              <p style={{ color:C.textMuted,fontSize:"9px",letterSpacing:"2px",
                textTransform:"uppercase",margin:"0 0 8px" }}>
                {consentMethod==="email"?"What they'll receive":"Message preview"}
              </p>
              <p style={{ color:C.textSoft,fontSize:"11px",fontStyle:"italic",lineHeight:"1.8",margin:0 }}>
                A {consentMethod==="email"?"professionally designed email":"text message"} explaining that Selah is a private, faith-rooted mental wellness app — no social media, no ads, no strangers. All data stays on your device. Crisis resources always available. One tap to approve.
              </p>
            </div>

            {consentSent && (
              <div style={{ marginTop:"12px",background:`${C.accent}10`,border:`1px solid ${C.accent}33`,
                borderRadius:"8px",padding:"12px 16px" }}>
                <p style={{ color:C.accent,fontSize:"12px",fontStyle:"italic",margin:0 }}>
                  {consentMethod==="email"
                    ? "✓ Email sent! Ask your parent to check their inbox and tap Approve."
                    : "✓ Your messaging app should have opened. Send that message to your parent and ask them to tap the link."}
                </p>
              </div>
            )}
          </div>
        )}

        {q.type==="parentConsent" ? (
          <div style={{ display:"flex",gap:"10px" }}>
            {!consentSent ? (
              <button onClick={sendParentConsent} disabled={!canNext||consentSending} style={{
                flex:1,background:canNext&&!consentSending?C.accent:C.bgCard,
                border:"none",borderRadius:"3px",color:canNext&&!consentSending?"#fff":C.textMuted,
                fontSize:"10px",letterSpacing:"4px",textTransform:"uppercase",
                padding:"16px",cursor:canNext&&!consentSending?"pointer":"default",
                fontFamily:font,fontStyle:"italic",transition:"all 0.3s ease" }}>
                {consentSending?"Sending...":"Send Approval Email"}
              </button>
            ) : (
              <button onClick={async()=>{const code=localStorage.getItem("selah_consent_code");if(!code){alert("Send the approval email first.");return;}try{const r=await fetch("/api/consent?code="+code+"&action=check");const d=await r.json();if(d.status==="approved"){next();}else{alert("Still waiting for parent approval.");}}catch(e){alert("Could not verify.");}}} style={{
                flex:1,background:C.accent,border:"none",borderRadius:"3px",color:"#fff",
                fontSize:"10px",letterSpacing:"4px",textTransform:"uppercase",
                padding:"16px",cursor:"pointer",fontFamily:font,fontStyle:"italic",
                boxShadow:`0 2px 12px ${C.accent}33` }}>
                Continue
              </button>
            )}
          </div>
        ) : (
          <button onClick={next} disabled={!canNext} style={{
            width:"100%",background:canNext?C.accent:C.bgCard,
            border:"none",borderRadius:"3px",color:canNext?"#fff":C.textMuted,
            fontSize:"10px",letterSpacing:"4px",textTransform:"uppercase",
            padding:"16px",cursor:canNext?"pointer":"default",
            fontFamily:font,fontStyle:"italic",transition:"all 0.3s ease",
            boxShadow:canNext?`0 2px 12px ${C.accent}33`:"none" }}>
            {step===questions.length-1?"Enter Selah →":"Continue"}
          </button>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// LATE NIGHT PRESENCE
// ═══════════════════════════════════════════════════════
function LateNightModal({ onEnter, onDismiss, C, font }) {
  const [vis,setVis]=useState(false);
  const line=LATE_NIGHT_LINES[Math.floor(Math.random()*LATE_NIGHT_LINES.length)];
  useEffect(()=>{ setTimeout(()=>setVis(true),80); },[]);
  return (
    <div style={{ position:"fixed",inset:0,
      background:C.id==="navy"||C.id==="charcoal"||C.id==="masculine"?"rgba(0,0,0,0.85)":"rgba(26,23,20,0.92)",
      display:"flex",alignItems:"center",justifyContent:"center",
      zIndex:400,padding:"32px",fontFamily:font,
      opacity:vis?1:0,transition:"opacity 0.8s ease" }}>
      <div style={{ maxWidth:"340px",width:"100%",textAlign:"center" }}>
        <div style={{ display:"flex",justifyContent:"center",marginBottom:"32px" }}>
          {[0,1,2].map(i=>(
            <div key={i} style={{ position:"absolute",
              width:"80px",height:"48px",borderRadius:"50%",
              background:`${C.accent}${["18","10","06"][i]}`,
              animation:`breathe 4s ease-in-out infinite`,
              animationDelay:`${i*0.6}s` }}/>
          ))}
          <div style={{ position:"relative",zIndex:1,paddingTop:"8px" }}>
            <WaveLogo size={40} color={C.accent}/>
          </div>
        </div>
        <p style={{ color:"rgba(240,235,224,0.9)",fontSize:"clamp(16px,4vw,20px)",
          fontStyle:"italic",lineHeight:"1.9",margin:"0 0 32px",
          animation:"fadeUp 1s ease 0.4s both" }}>
          "{line}"
        </p>
        <div style={{ display:"flex",gap:"10px",justifyContent:"center",
          animation:"fadeUp 0.8s ease 0.9s both" }}>
          <button onClick={onDismiss} style={{ background:"none",
            border:"1px solid rgba(240,235,224,0.2)",borderRadius:"3px",
            color:"rgba(240,235,224,0.5)",fontSize:"9px",letterSpacing:"3px",
            textTransform:"uppercase",padding:"12px 20px",cursor:"pointer",
            fontFamily:font,fontStyle:"italic" }}>Just browsing</button>
          <button onClick={onEnter} style={{ background:C.accent,border:"none",
            borderRadius:"3px",color:"#fff",fontSize:"9px",letterSpacing:"3px",
            textTransform:"uppercase",padding:"12px 24px",cursor:"pointer",
            fontFamily:font,fontStyle:"italic",
            boxShadow:`0 2px 16px ${C.accent}44` }}>I need a moment</button>
        </div>
      </div>
      <style>{`
        @keyframes breathe{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.18);opacity:0.6}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// BREATHING EXERCISE
// ═══════════════════════════════════════════════════════
function BreathingExercise({ C, font, onClose }) {
  const [phase, setPhase] = useState("ready"); // ready | inhale | hold | exhale | holdOut | done
  const [cycle, setCycle] = useState(0);
  const [totalCycles] = useState(4);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [technique, setTechnique] = useState(null);
  const [sessionActive, setSessionActive] = useState(false);
  const timerRef = useRef(null);

  const TECHNIQUES = [
    { id:"box", name:"Box Breathing", desc:"Equal parts. Used by Navy SEALs to stay calm under pressure.",
      icon:"◻", steps:[{p:"inhale",t:4},{p:"hold",t:4},{p:"exhale",t:4},{p:"holdOut",t:4}] },
    { id:"calm", name:"4-7-8 Calm", desc:"Activates your parasympathetic nervous system. Deep rest.",
      icon:"◈", steps:[{p:"inhale",t:4},{p:"hold",t:7},{p:"exhale",t:8}] },
    { id:"ground", name:"Grounding Breath", desc:"Simple and slow. Good when your mind won't stop.",
      icon:"🌿", steps:[{p:"inhale",t:5},{p:"exhale",t:5}] },
  ];

  const PHASE_TEXT = {
    inhale: "Breathe in...",
    hold: "Hold gently...",
    exhale: "Let it go...",
    holdOut: "Rest empty...",
  };

  const PHASE_SCALE = {
    inhale: 1.35,
    hold: 1.35,
    exhale: 1,
    holdOut: 1,
  };

  const startSession = (tech) => {
    setTechnique(tech);
    setSessionActive(true);
    setCycle(0);
    runCycle(tech, 0);
  };

  const runCycle = (tech, cycleNum) => {
    if (cycleNum >= totalCycles) {
      setPhase("done");
      return;
    }
    setCycle(cycleNum);
    let stepIdx = 0;
    const runStep = () => {
      if (stepIdx >= tech.steps.length) {
        runCycle(tech, cycleNum + 1);
        return;
      }
      const step = tech.steps[stepIdx];
      setPhase(step.p);
      setSecondsLeft(step.t);
      let remaining = step.t;
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        remaining--;
        setSecondsLeft(remaining);
        if (remaining <= 0) {
          clearInterval(timerRef.current);
          stepIdx++;
          runStep();
        }
      }, 1000);
    };
    runStep();
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const reset = () => {
    clearInterval(timerRef.current);
    setPhase("ready");
    setSessionActive(false);
    setTechnique(null);
    setCycle(0);
  };

  const circleColor = phase === "inhale" ? C.sage : phase === "hold" ? C.amber :
    phase === "exhale" ? C.terra : phase === "holdOut" ? C.sageLight : C.sage;

  return (
    <div style={{ minHeight:"100vh", background:C.bgPrimary, fontFamily:font,
      display:"flex", flexDirection:"column", alignItems:"center",
      justifyContent:"center", padding:"40px 24px", textAlign:"center",
      position:"relative", overflow:"hidden" }}>

      {/* Ambient backgrounds */}
      <div style={{ position:"absolute", top:"-100px", left:"-80px", width:"400px", height:"400px",
        background:`radial-gradient(circle,${C.sageLight}18 0%,transparent 70%)`, pointerEvents:"none" }}/>
      <div style={{ position:"absolute", bottom:"-80px", right:"-60px", width:"360px", height:"360px",
        background:`radial-gradient(circle,${C.amberLight}12 0%,transparent 70%)`, pointerEvents:"none" }}/>

      {/* Back button */}
      <button onClick={onClose} style={{ position:"absolute", top:"20px", left:"20px",
        background:"none", border:"none", cursor:"pointer",
        color:C.textMuted, fontSize:"18px", padding:"8px" }}>←</button>

      <div style={{ maxWidth:"400px", width:"100%" }}>

        {!sessionActive && phase !== "done" && (
          <>
            <WaveLogo size={32} color={C.sage}/>
            <p style={{ color:C.sage, fontSize:"10px", letterSpacing:"4px",
              textTransform:"uppercase", fontStyle:"italic", margin:"16px 0 8px" }}>Breathe</p>
            <h1 style={{ color:C.textPrimary, fontSize:"clamp(20px,5vw,26px)",
              fontWeight:"normal", margin:"0 0 8px", lineHeight:"1.4" }}>
              Before you think — breathe.
            </h1>
            <p style={{ color:C.textSoft, fontSize:"13px", fontStyle:"italic",
              lineHeight:"1.9", margin:"0 0 32px" }}>
              Choose a technique. Selah will guide you through {totalCycles} cycles.
            </p>

            <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
              {TECHNIQUES.map(tech => (
                <button key={tech.id} onClick={() => startSession(tech)} style={{
                  background:C.bgSecondary, border:`1.5px solid ${C.border}`,
                  borderRadius:"10px", padding:"16px 18px", cursor:"pointer",
                  textAlign:"left", transition:"all 0.2s ease" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = C.sage + "66"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
                  <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"6px" }}>
                    <span style={{ fontSize:"20px" }}>{tech.icon}</span>
                    <span style={{ color:C.textPrimary, fontSize:"14px", fontWeight:"bold",
                      fontFamily:font }}>{tech.name}</span>
                  </div>
                  <p style={{ color:C.textSoft, fontSize:"12px", fontStyle:"italic",
                    lineHeight:"1.7", margin:0, paddingLeft:"32px" }}>{tech.desc}</p>
                  <div style={{ display:"flex", gap:"6px", paddingLeft:"32px", marginTop:"8px" }}>
                    {tech.steps.map((s, i) => (
                      <span key={i} style={{ background:`${C.sage}15`, color:C.sage,
                        fontSize:"8px", letterSpacing:"1.5px", textTransform:"uppercase",
                        padding:"2px 8px", borderRadius:"10px", fontStyle:"italic" }}>
                        {s.p} {s.t}s
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {sessionActive && phase !== "done" && (
          <>
            <p style={{ color:C.textMuted, fontSize:"10px", letterSpacing:"3px",
              textTransform:"uppercase", fontStyle:"italic", margin:"0 0 8px" }}>
              {technique?.name}
            </p>
            <p style={{ color:C.textMuted, fontSize:"11px", fontStyle:"italic", margin:"0 0 40px" }}>
              Cycle {cycle + 1} of {totalCycles}
            </p>

            {/* Animated breathing circle */}
            <div style={{ position:"relative", width:"200px", height:"200px",
              margin:"0 auto 40px", display:"flex", alignItems:"center", justifyContent:"center" }}>
              {/* Outer pulse rings */}
              {[0,1,2].map(i => (
                <div key={i} style={{ position:"absolute", width:"100%", height:"100%",
                  borderRadius:"50%", border:`1.5px solid ${circleColor}`,
                  opacity: 0.15 - i * 0.04,
                  transform:`scale(${(PHASE_SCALE[phase] || 1) + i * 0.12})`,
                  transition:`transform ${phase === "inhale" ? "4s" : phase === "exhale" ? "5s" : "0.3s"} ease-in-out, border-color 0.5s ease` }}/>
              ))}
              {/* Main circle */}
              <div style={{ width:"160px", height:"160px", borderRadius:"50%",
                background:`radial-gradient(circle, ${circleColor}30 0%, ${circleColor}08 70%)`,
                border:`2px solid ${circleColor}55`,
                transform:`scale(${PHASE_SCALE[phase] || 1})`,
                transition:`transform ${phase === "inhale" ? "4s" : phase === "exhale" ? "5s" : "0.3s"} ease-in-out, background 0.5s ease, border-color 0.5s ease`,
                display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                <span style={{ color:circleColor, fontSize:"36px", fontWeight:"bold",
                  fontFamily:font, transition:"color 0.5s ease" }}>{secondsLeft}</span>
              </div>
            </div>

            <p style={{ color:C.textPrimary, fontSize:"clamp(16px,4vw,20px)",
              fontStyle:"italic", margin:"0 0 8px",
              transition:"color 0.3s ease" }}>
              {PHASE_TEXT[phase] || ""}
            </p>
            <p style={{ color:C.textMuted, fontSize:"12px", fontStyle:"italic", margin:"0 0 32px" }}>
              {phase === "inhale" ? "Fill your lungs slowly, through your nose." :
               phase === "hold" ? "Let stillness settle in." :
               phase === "exhale" ? "Slowly, through your mouth." :
               phase === "holdOut" ? "Empty. Still. At peace." : ""}
            </p>

            <button onClick={reset} style={{ background:"none", border:`1px solid ${C.border}`,
              borderRadius:"3px", color:C.textMuted, fontSize:"9px", letterSpacing:"3px",
              textTransform:"uppercase", padding:"10px 24px", cursor:"pointer",
              fontFamily:font }}>End Early</button>
          </>
        )}

        {phase === "done" && (
          <>
            <div style={{ marginBottom:"24px" }}>
              <WaveLogo size={36} color={C.sage}/>
            </div>
            <p style={{ color:C.sage, fontSize:"10px", letterSpacing:"4px",
              textTransform:"uppercase", fontStyle:"italic", margin:"0 0 12px" }}>Complete</p>
            <h1 style={{ color:C.textPrimary, fontSize:"clamp(20px,5vw,26px)",
              fontWeight:"normal", margin:"0 0 12px", lineHeight:"1.4" }}>
              You gave yourself that pause.
            </h1>
            <p style={{ color:C.textSoft, fontSize:"13px", fontStyle:"italic",
              lineHeight:"1.9", margin:"0 0 32px" }}>
              {totalCycles} cycles of {technique?.name}. Your nervous system thanks you.
            </p>
            <div style={{ display:"flex", gap:"10px", justifyContent:"center" }}>
              <button onClick={reset} style={{ background:C.bgSecondary,
                border:`1px solid ${C.border}`, borderRadius:"3px", color:C.textSoft,
                fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase",
                padding:"14px 24px", cursor:"pointer", fontFamily:font, fontStyle:"italic" }}>
                Breathe Again
              </button>
              <button onClick={onClose} style={{ background:C.sage, border:"none",
                borderRadius:"3px", color:"#fff", fontSize:"10px", letterSpacing:"3px",
                textTransform:"uppercase", padding:"14px 28px", cursor:"pointer",
                fontFamily:font, fontStyle:"italic" }}>
                Continue
              </button>
            </div>
            <div style={{ marginTop:"28px", borderTop:`1px solid ${C.border}`, paddingTop:"18px" }}>
              <p style={{ color:C.textMuted, fontSize:"11px", fontStyle:"italic",
                lineHeight:"1.9", margin:0 }}>
                "Be still and know that I am God."
              </p>
              <p style={{ color:C.sageLight, fontSize:"9px", letterSpacing:"2px",
                textTransform:"uppercase", margin:"4px 0 0" }}>Psalm 46:10</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// RESET — Stress Release Activities Hub
// ═══════════════════════════════════════════════════════
function ResetScreen({ C, font, onClose }) {
  const [activeMode, setActiveMode] = useState(null);
  const [tab, setTab] = useState("release"); // release | refresh

  if (activeMode === "smash") return <ResetSmashScreen C={C} font={font} onBack={() => setActiveMode(null)} />;
  if (activeMode === "rhythm") return <ResetRhythmScreen C={C} font={font} onBack={() => setActiveMode(null)} />;
  if (activeMode === "color") return <ResetColorScreen C={C} font={font} onBack={() => setActiveMode(null)} />;
  if (activeMode === "tension") return <ResetTensionScreen C={C} font={font} onBack={() => setActiveMode(null)} />;
  if (activeMode === "lights") return <ResetLightsScreen C={C} font={font} onBack={() => setActiveMode(null)} />;
  if (activeMode === "letgo") return <ResetLetGoScreen C={C} font={font} onBack={() => setActiveMode(null)} />;
  if (activeMode === "memory") return <ResetMemoryGame C={C} font={font} onBack={() => setActiveMode(null)} />;
  if (activeMode === "numbers") return <ResetNumberFlow C={C} font={font} onBack={() => setActiveMode(null)} />;
  if (activeMode === "stroop") return <ResetColorMind C={C} font={font} onBack={() => setActiveMode(null)} />;
  if (activeMode === "pattern") return <ResetPatternRecall C={C} font={font} onBack={() => setActiveMode(null)} />;

  const releaseModes = [
    { id:"smash", icon:"💥", title:"Smash", desc:"Break things. No consequences." },
    { id:"rhythm", icon:"🥁", title:"Rhythm", desc:"Tap to the beat. Sync your body." },
    { id:"color", icon:"🎨", title:"Color Burst", desc:"Splash, drag, explode." },
    { id:"tension", icon:"🫸", title:"Tension & Release", desc:"Hold tight. Then let go." },
    { id:"lights", icon:"✦", title:"Lights", desc:"Create light. Receive a word." },
    { id:"letgo", icon:"🔥", title:"Let Go", desc:"Write it. Watch it burn." },
  ];

  const refreshModes = [
    { id:"memory", icon:"🃏", title:"Memory Match", desc:"Flip cards. Find the pairs." },
    { id:"numbers", icon:"🔢", title:"Number Flow", desc:"Tap 1 to 25 in order. Go fast." },
    { id:"stroop", icon:"🧠", title:"Color Mind", desc:"Tap the color, not the word." },
    { id:"pattern", icon:"💡", title:"Pattern Recall", desc:"Watch the sequence. Repeat it." },
  ];

  const modes = tab === "release" ? releaseModes : refreshModes;

  return (
    <div style={{ minHeight:"100vh", background:C.bgPrimary, fontFamily:font,
      padding:"36px 20px 100px", boxSizing:"border-box" }}>
      <div style={{ maxWidth:"480px", margin:"0 auto" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"20px" }}>
          <button onClick={onClose} style={{ background:"none", border:"none",
            cursor:"pointer", color:C.textMuted, fontSize:"20px", padding:"4px 8px 4px 0" }}>←</button>
          <div>
            <Label text="Decompress" color={C.sage} font={font}/>
            <h1 style={{ color:C.textPrimary, fontSize:"22px", fontWeight:"normal", margin:"0" }}>Reset</h1>
          </div>
        </div>

        <p style={{ color:C.textSoft, fontSize:"13px", fontStyle:"italic",
          lineHeight:"1.9", margin:"0 0 20px" }}>
          No words needed. Pick something and let your body do the rest.
        </p>

        {/* Tabs */}
        <div style={{ display:"flex", gap:"0", marginBottom:"22px", borderRadius:"8px",
          overflow:"hidden", border:`1px solid ${C.border}` }}>
          {[{id:"release",label:"Release"},{id:"refresh",label:"Refresh"}].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex:1, padding:"12px 0", border:"none", cursor:"pointer",
              background: tab===t.id ? `${C.accent}18` : C.bgSecondary,
              color: tab===t.id ? C.accent : C.textMuted,
              fontSize:"11px", letterSpacing:"3px", textTransform:"uppercase",
              fontStyle:"italic", fontFamily:font, fontWeight: tab===t.id ? "bold" : "normal",
              borderBottom: tab===t.id ? `2px solid ${C.accent}` : "2px solid transparent",
              transition:"all 0.2s ease",
            }}>{t.label}</button>
          ))}
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
          {modes.map(mode => (
            <button key={mode.id} onClick={() => setActiveMode(mode.id)} style={{
              background:C.bgSecondary, border:`1.5px solid ${C.border}`,
              borderRadius:"14px", padding:"20px 16px", cursor:"pointer",
              textAlign:"left", transition:"all 0.2s ease",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.borderColor=C.accent+"55"; }}
              onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.borderColor=C.border; }}>
              <span style={{ fontSize:"24px", display:"block", marginBottom:"10px" }}>{mode.icon}</span>
              <h3 style={{ color:C.textPrimary, fontSize:"14px", fontWeight:"bold",
                fontFamily:font, margin:"0 0 4px" }}>{mode.title}</h3>
              <p style={{ color:C.textMuted, fontSize:"10px", fontStyle:"italic",
                lineHeight:"1.6", margin:0 }}>{mode.desc}</p>
            </button>
          ))}
        </div>

        <p style={{ color:C.textMuted, fontSize:"11px", fontStyle:"italic",
          textAlign:"center", marginTop:"28px", lineHeight:"1.8" }}>
          {tab==="release" ? "Nothing here is tracked. This space is just for you." : "Just you and your mind. No pressure, no score keeping."}
        </p>
      </div>
    </div>
  );
}

// ── RESET: Smash (Virtual Rage Room) ──
function ResetSmashScreen({ C, font, onBack }) {
  const [panels, setPanels] = useState([]);
  const [shards, setShards] = useState([]);
  const [entered, setEntered] = useState(false);
  const [smashCount, setSmashCount] = useState(0);
  const panelId = useRef(0);
  const shardId = useRef(0);

  useEffect(() => { setTimeout(() => setEntered(true), 100); }, []);

  // Spawn panels periodically
  useEffect(() => {
    const spawn = () => {
      const id = panelId.current++;
      const types = ["glass","plate","block","mirror"];
      const type = types[Math.floor(Math.random() * types.length)];
      const colors = { glass:"rgba(180,220,255,", plate:"rgba(255,250,240,", block:"rgba(200,180,160,", mirror:"rgba(220,230,255," };
      setPanels(prev => [...prev.slice(-8), {
        id, type,
        x: 10 + Math.random() * 70,
        y: 15 + Math.random() * 55,
        size: 50 + Math.random() * 40,
        rotation: Math.random() * 20 - 10,
        color: colors[type],
        alive: true,
      }]);
    };
    spawn(); spawn(); spawn();
    const interval = setInterval(spawn, 1800);
    return () => clearInterval(interval);
  }, []);

  const handleSmash = (panel, e) => {
    e.stopPropagation();
    if (!panel.alive) return;
    setPanels(prev => prev.map(p => p.id === panel.id ? { ...p, alive: false } : p));
    setSmashCount(s => s + 1);

    // Create shards
    const numShards = 8 + Math.floor(Math.random() * 6);
    const newShards = Array.from({ length: numShards }, (_, i) => ({
      id: shardId.current++,
      x: panel.x + panel.size / 200 * 100,
      y: panel.y + panel.size / 200 * 100,
      angle: (360 / numShards) * i + Math.random() * 30,
      distance: 20 + Math.random() * 60,
      size: 3 + Math.random() * 8,
      rotation: Math.random() * 720 - 360,
      color: panel.color,
      born: Date.now(),
    }));
    setShards(prev => [...prev.slice(-50), ...newShards]);

    // Clean old shards
    setTimeout(() => {
      setShards(prev => prev.filter(s => Date.now() - s.born < 1500));
    }, 1600);

    // Remove dead panel after animation
    setTimeout(() => {
      setPanels(prev => prev.filter(p => p.id !== panel.id));
    }, 400);
  };

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:300,
      background:"linear-gradient(180deg, #0a0a0f 0%, #12121a 100%)",
      opacity:entered?1:0, transition:"opacity 0.6s ease",
      touchAction:"none", userSelect:"none", overflow:"hidden",
    }}>
      {/* Hint */}
      <div style={{ position:"absolute", top:"8%", left:"50%", transform:"translateX(-50%)",
        zIndex:10, textAlign:"center", pointerEvents:"none",
        opacity:smashCount > 3 ? 0 : 0.6, transition:"opacity 1s ease" }}>
        <p style={{ color:"rgba(255,100,100,0.5)", fontSize:"10px", letterSpacing:"5px",
          textTransform:"uppercase", fontStyle:"italic", fontFamily:font, margin:"0 0 8px" }}>Smash</p>
        <p style={{ color:"rgba(255,255,240,0.25)", fontSize:"13px", fontStyle:"italic",
          fontFamily:font }}>Tap to break. No rules. No score.</p>
      </div>

      {/* Panels */}
      {panels.map(panel => panel.alive && (
        <div key={panel.id}
          onClick={(e) => handleSmash(panel, e)}
          onTouchStart={(e) => { e.preventDefault(); handleSmash(panel, e); }}
          style={{
            position:"absolute",
            left:`${panel.x}%`, top:`${panel.y}%`,
            width:`${panel.size}px`, height:`${panel.size}px`,
            background:`${panel.color}0.08)`,
            border:`1.5px solid ${panel.color}0.25)`,
            borderRadius: panel.type === "plate" ? "50%" : panel.type === "block" ? "4px" : "8px",
            transform:`rotate(${panel.rotation}deg)`,
            cursor:"pointer",
            animation:"panelAppear 0.4s ease forwards",
            backdropFilter:"blur(2px)",
            boxShadow:`inset 0 0 20px ${panel.color}0.05), 0 0 15px ${panel.color}0.08)`,
            display:"flex", alignItems:"center", justifyContent:"center",
            transition:"all 0.1s ease",
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = `${panel.color}0.5)`}
          onMouseLeave={e => e.currentTarget.style.borderColor = `${panel.color}0.25)`}>
          {panel.type === "mirror" && <span style={{ fontSize:"20px", opacity:0.15 }}>🪞</span>}
        </div>
      ))}

      {/* Shards */}
      {shards.map(shard => (
        <div key={shard.id} style={{
          position:"absolute",
          left:`${shard.x}%`, top:`${shard.y}%`,
          width:`${shard.size}px`, height:`${shard.size * 0.6}px`,
          background:`${shard.color}0.7)`,
          borderRadius:"1px",
          animation:`shardFly 0.8s ease-out forwards`,
          transform:`rotate(${shard.angle}deg)`,
          pointerEvents:"none",
          boxShadow:`0 0 4px ${shard.color}0.4)`,
          '--shard-x': `${Math.cos(shard.angle * Math.PI/180) * shard.distance}px`,
          '--shard-y': `${Math.sin(shard.angle * Math.PI/180) * shard.distance}px`,
          '--shard-r': `${shard.rotation}deg`,
        }} />
      ))}

      {/* Back & counter */}
      <button onClick={onBack} style={{ position:"absolute", top:"16px", left:"16px", zIndex:50,
        background:"none", border:"none", cursor:"pointer",
        color:"rgba(255,255,240,0.3)", fontSize:"20px", padding:"8px" }}>←</button>
      {smashCount > 0 && (
        <div style={{ position:"absolute", bottom:"30px", left:"50%", transform:"translateX(-50%)",
          zIndex:50, textAlign:"center" }}>
          <span style={{ color:"rgba(255,100,100,0.3)", fontSize:"11px", letterSpacing:"3px",
            fontFamily:font, fontStyle:"italic" }}>{smashCount} broken</span>
        </div>
      )}

      <style>{`
        @keyframes panelAppear { 0%{opacity:0;transform:scale(0.5) rotate(0deg)} 100%{opacity:1;transform:scale(1) rotate(var(--r,0deg))} }
        @keyframes shardFly {
          0% { opacity:1; transform: translate(0,0) rotate(0deg) scale(1); }
          100% { opacity:0; transform: translate(var(--shard-x,30px), var(--shard-y,-30px)) rotate(var(--shard-r,180deg)) scale(0.2); }
        }
      `}</style>
    </div>
  );
}

// ── RESET: Rhythm Release ──
function ResetRhythmScreen({ C, font, onBack }) {
  const [targets, setTargets] = useState([]);
  const [entered, setEntered] = useState(false);
  const [hits, setHits] = useState(0);
  const [ripples, setRipples] = useState([]);
  const targetId = useRef(0);
  const rippleId = useRef(0);
  const [bpm, setBpm] = useState(120);
  const [phase, setPhase] = useState("active"); // active | cooldown

  useEffect(() => { setTimeout(() => setEntered(true), 100); }, []);

  // Gradually slow down after 30 hits to bring heart rate down
  useEffect(() => {
    if (hits > 30 && bpm > 60) {
      setBpm(prev => Math.max(60, prev - 2));
    }
    if (hits > 30 && phase === "active") setPhase("cooldown");
  }, [hits]);

  // Spawn targets to the beat
  useEffect(() => {
    const interval = setInterval(() => {
      const id = targetId.current++;
      const zones = [
        { x: 25, y: 35 }, { x: 75, y: 35 },
        { x: 50, y: 55 }, { x: 25, y: 70 },
        { x: 75, y: 70 }, { x: 50, y: 30 },
        { x: 35, y: 50 }, { x: 65, y: 50 },
      ];
      const zone = zones[Math.floor(Math.random() * zones.length)];
      const hue = phase === "cooldown" ? 200 + Math.random() * 40 : Math.random() * 40 + 10;
      setTargets(prev => [...prev.slice(-6), {
        id, x: zone.x + (Math.random()-0.5)*10, y: zone.y + (Math.random()-0.5)*10,
        size: 50 + Math.random() * 20, hue, born: Date.now(),
      }]);
    }, 60000 / bpm);
    return () => clearInterval(interval);
  }, [bpm, phase]);

  // Remove expired targets
  useEffect(() => {
    const interval = setInterval(() => {
      setTargets(prev => prev.filter(t => Date.now() - t.born < 2000));
      setRipples(prev => prev.filter(r => Date.now() - r.born < 600));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleHit = (target, e) => {
    e.stopPropagation();
    e.preventDefault();
    setHits(h => h + 1);
    setTargets(prev => prev.filter(t => t.id !== target.id));

    // Ripple
    const id = rippleId.current++;
    setRipples(prev => [...prev.slice(-10), {
      id, x: target.x, y: target.y, hue: target.hue, born: Date.now(),
    }]);
  };

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:300,
      background: phase === "cooldown"
        ? "linear-gradient(180deg, #080e18 0%, #0a1020 100%)"
        : "linear-gradient(180deg, #0f0a08 0%, #18100a 100%)",
      opacity:entered?1:0, transition:"opacity 0.6s ease, background 2s ease",
      touchAction:"none", userSelect:"none", overflow:"hidden",
    }}>
      {/* Hint */}
      <div style={{ position:"absolute", top:"8%", left:"50%", transform:"translateX(-50%)",
        zIndex:10, textAlign:"center", pointerEvents:"none",
        opacity:hits > 5 ? 0 : 0.6, transition:"opacity 1s ease" }}>
        <p style={{ color:`hsla(${phase==="cooldown"?210:25},60%,60%,0.5)`, fontSize:"10px", letterSpacing:"5px",
          textTransform:"uppercase", fontStyle:"italic", fontFamily:font, margin:"0 0 8px" }}>Rhythm</p>
        <p style={{ color:"rgba(255,255,240,0.25)", fontSize:"13px", fontStyle:"italic", fontFamily:font }}>
          Tap the circles. Match the beat.
        </p>
      </div>

      {/* Pulse indicator */}
      <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)",
        width:"8px", height:"8px", borderRadius:"50%",
        background:`hsla(${phase==="cooldown"?210:25},60%,50%,0.15)`,
        animation:`pulse ${60/bpm}s ease-in-out infinite`, pointerEvents:"none" }}/>

      {/* Targets */}
      {targets.map(target => (
        <div key={target.id}
          onClick={(e) => handleHit(target, e)}
          onTouchStart={(e) => { e.preventDefault(); handleHit(target, e); }}
          style={{
            position:"absolute",
            left:`${target.x}%`, top:`${target.y}%`,
            width:`${target.size}px`, height:`${target.size}px`,
            transform:"translate(-50%,-50%)",
            borderRadius:"50%",
            background:`hsla(${target.hue},50%,50%,0.08)`,
            border:`2px solid hsla(${target.hue},50%,50%,0.35)`,
            cursor:"pointer",
            animation:`targetPulse ${60/bpm}s ease-in-out infinite, targetFadeIn 0.2s ease`,
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>
          <div style={{
            width:"30%", height:"30%", borderRadius:"50%",
            background:`hsla(${target.hue},60%,60%,0.4)`,
          }}/>
        </div>
      ))}

      {/* Ripples */}
      {ripples.map(r => (
        <div key={r.id} style={{
          position:"absolute", left:`${r.x}%`, top:`${r.y}%`,
          transform:"translate(-50%,-50%)",
          width:"10px", height:"10px", borderRadius:"50%",
          border:`2px solid hsla(${r.hue},60%,60%,0.5)`,
          animation:"rippleExpand 0.6s ease-out forwards",
          pointerEvents:"none",
        }}/>
      ))}

      {/* BPM indicator during cooldown */}
      {phase === "cooldown" && (
        <div style={{ position:"absolute", bottom:"60px", left:"50%", transform:"translateX(-50%)",
          textAlign:"center", pointerEvents:"none" }}>
          <p style={{ color:"rgba(130,180,255,0.3)", fontSize:"10px", letterSpacing:"3px",
            fontStyle:"italic", fontFamily:font, margin:0 }}>
            slowing down... {Math.round(bpm)} bpm
          </p>
        </div>
      )}

      <button onClick={onBack} style={{ position:"absolute", top:"16px", left:"16px", zIndex:50,
        background:"none", border:"none", cursor:"pointer",
        color:"rgba(255,255,240,0.3)", fontSize:"20px", padding:"8px" }}>←</button>

      <style>{`
        @keyframes targetPulse { 0%,100%{transform:translate(-50%,-50%) scale(1)} 50%{transform:translate(-50%,-50%) scale(1.1)} }
        @keyframes targetFadeIn { 0%{opacity:0;transform:translate(-50%,-50%) scale(0.3)} 100%{opacity:1;transform:translate(-50%,-50%) scale(1)} }
        @keyframes rippleExpand { 0%{width:10px;height:10px;opacity:0.8} 100%{width:120px;height:120px;opacity:0} }
        @keyframes pulse { 0%,100%{opacity:0.1;transform:translate(-50%,-50%) scale(1)} 50%{opacity:0.4;transform:translate(-50%,-50%) scale(2.5)} }
      `}</style>
    </div>
  );
}

// ── RESET: Color Burst ──
function ResetColorScreen({ C, font, onBack }) {
  const [splats, setSplats] = useState([]);
  const [trails, setTrails] = useState([]);
  const [entered, setEntered] = useState(false);
  const [hue, setHue] = useState(Math.random() * 360);
  const splatId = useRef(0);
  const trailId = useRef(0);
  const lastTrail = useRef(0);

  useEffect(() => { setTimeout(() => setEntered(true), 100); }, []);

  const handleTap = (e) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    const newHue = (hue + 30 + Math.random() * 40) % 360;
    setHue(newHue);

    // Big splat
    const id = splatId.current++;
    setSplats(prev => [...prev.slice(-30), {
      id, x, y, hue: newHue,
      size: 40 + Math.random() * 60,
      born: Date.now(),
    }]);

    // Smaller satellite splats
    for (let i = 0; i < 3 + Math.floor(Math.random() * 3); i++) {
      const sid = splatId.current++;
      setSplats(prev => [...prev.slice(-35), {
        id: sid,
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        hue: newHue + Math.random() * 30 - 15,
        size: 10 + Math.random() * 25,
        born: Date.now(),
        delay: Math.random() * 0.15,
      }]);
    }
  };

  const handleMove = (e) => {
    e.preventDefault();
    const now = Date.now();
    if (now - lastTrail.current < 40) return;
    lastTrail.current = now;

    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    const id = trailId.current++;
    setTrails(prev => [...prev.slice(-60), {
      id, x, y, hue: (hue + Math.random() * 20) % 360,
      size: 8 + Math.random() * 12,
      born: now,
    }]);
  };

  // Cleanup
  useEffect(() => {
    const interval = setInterval(() => {
      setTrails(prev => prev.filter(t => Date.now() - t.born < 3000));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      onClick={handleTap}
      onTouchStart={handleTap}
      onMouseMove={handleMove}
      onTouchMove={handleMove}
      style={{
        position:"fixed", inset:0, zIndex:300,
        background:"#0a0a0e",
        opacity:entered?1:0, transition:"opacity 0.6s ease",
        touchAction:"none", userSelect:"none", overflow:"hidden", cursor:"crosshair",
      }}>
      {/* Hint */}
      <div style={{ position:"absolute", top:"8%", left:"50%", transform:"translateX(-50%)",
        zIndex:10, textAlign:"center", pointerEvents:"none",
        opacity:splats.length > 3 ? 0 : 0.6, transition:"opacity 1s ease" }}>
        <p style={{ color:"rgba(180,130,255,0.5)", fontSize:"10px", letterSpacing:"5px",
          textTransform:"uppercase", fontStyle:"italic", fontFamily:font, margin:"0 0 8px" }}>Color Burst</p>
        <p style={{ color:"rgba(255,255,240,0.25)", fontSize:"13px", fontStyle:"italic", fontFamily:font }}>
          Tap to splash. Drag to paint.
        </p>
      </div>

      {/* Splats */}
      {splats.map(s => (
        <div key={s.id} style={{
          position:"absolute", left:`${s.x}%`, top:`${s.y}%`,
          width:`${s.size}px`, height:`${s.size}px`,
          borderRadius:"50%",
          background:`radial-gradient(circle, hsla(${s.hue},80%,60%,0.7), hsla(${s.hue},80%,50%,0.2) 60%, transparent)`,
          transform:"translate(-50%,-50%)",
          animation:`splatBurst 0.4s ${s.delay||0}s ease-out forwards`,
          pointerEvents:"none",
          boxShadow:`0 0 ${s.size*0.8}px hsla(${s.hue},80%,50%,0.3)`,
        }}/>
      ))}

      {/* Trails */}
      {trails.map(t => (
        <div key={t.id} style={{
          position:"absolute", left:`${t.x}%`, top:`${t.y}%`,
          width:`${t.size}px`, height:`${t.size}px`,
          borderRadius:"50%",
          background:`hsla(${t.hue},70%,55%,0.5)`,
          transform:"translate(-50%,-50%)",
          animation:"trailFade 2s ease-out forwards",
          pointerEvents:"none",
          boxShadow:`0 0 ${t.size}px hsla(${t.hue},70%,50%,0.25)`,
        }}/>
      ))}

      <button onClick={(e) => { e.stopPropagation(); onBack(); }} style={{ position:"absolute", top:"16px", left:"16px", zIndex:50,
        background:"none", border:"none", cursor:"pointer",
        color:"rgba(255,255,240,0.3)", fontSize:"20px", padding:"8px" }}>←</button>

      {/* Clear button */}
      <button onClick={(e) => { e.stopPropagation(); setSplats([]); setTrails([]); }} style={{
        position:"absolute", bottom:"30px", left:"50%", transform:"translateX(-50%)", zIndex:50,
        background:"rgba(255,255,240,0.06)", border:"1px solid rgba(255,255,240,0.1)",
        borderRadius:"30px", padding:"10px 24px", cursor:"pointer",
        color:"rgba(255,255,240,0.3)", fontSize:"10px", letterSpacing:"3px",
        textTransform:"uppercase", fontStyle:"italic", fontFamily:font,
        opacity: splats.length > 5 ? 1 : 0, transition:"opacity 0.5s ease",
      }}>Fresh canvas</button>

      <style>{`
        @keyframes splatBurst { 0%{opacity:0;transform:translate(-50%,-50%) scale(0)} 60%{opacity:1;transform:translate(-50%,-50%) scale(1.3)} 100%{transform:translate(-50%,-50%) scale(1)} }
        @keyframes trailFade { 0%{opacity:0.6} 100%{opacity:0;transform:translate(-50%,-50%) scale(0.3)} }
      `}</style>
    </div>
  );
}

// ── RESET: Tension & Release ──
function ResetTensionScreen({ C, font, onBack }) {
  const [pressing, setPressing] = useState(false);
  const [holdTime, setHoldTime] = useState(0);
  const [released, setReleased] = useState(false);
  const [entered, setEntered] = useState(false);
  const [cycles, setCycles] = useState(0);
  const holdStart = useRef(null);
  const holdInterval = useRef(null);

  useEffect(() => { setTimeout(() => setEntered(true), 100); }, []);

  const handlePress = () => {
    setPressing(true);
    setReleased(false);
    holdStart.current = Date.now();
    holdInterval.current = setInterval(() => {
      setHoldTime((Date.now() - holdStart.current) / 1000);
    }, 50);
  };

  const handleRelease = () => {
    if (!pressing) return;
    setPressing(false);
    clearInterval(holdInterval.current);
    if (holdTime > 0.5) {
      setReleased(true);
      setCycles(c => c + 1);
      setTimeout(() => {
        setReleased(false);
        setHoldTime(0);
      }, 3000);
    } else {
      setHoldTime(0);
    }
  };

  const tension = Math.min(holdTime / 5, 1); // 0 to 1 over 5 seconds
  const darkOverlay = tension * 0.6;
  const constrict = 1 - tension * 0.15;

  return (
    <div
      onMouseDown={handlePress} onMouseUp={handleRelease} onMouseLeave={handleRelease}
      onTouchStart={(e) => { e.preventDefault(); handlePress(); }}
      onTouchEnd={(e) => { e.preventDefault(); handleRelease(); }}
      style={{
        position:"fixed", inset:0, zIndex:300,
        background: released
          ? "radial-gradient(circle at 50% 50%, #2a2518 0%, #0f0d08 60%)"
          : `radial-gradient(circle at 50% 50%, rgba(15,12,20,${1-tension*0.3}) 0%, rgba(5,5,10,1) 60%)`,
        opacity:entered?1:0,
        transition: released ? "background 1.5s ease" : "opacity 0.6s ease",
        touchAction:"none", userSelect:"none", overflow:"hidden", cursor:"pointer",
        display:"flex", alignItems:"center", justifyContent:"center",
      }}>

      {/* Central orb — constricts when pressing, bursts on release */}
      <div style={{
        width: released ? "300px" : `${80 + tension * 40}px`,
        height: released ? "300px" : `${80 + tension * 40}px`,
        borderRadius:"50%",
        background: released
          ? "radial-gradient(circle, rgba(255,220,130,0.6), rgba(255,180,80,0.2) 50%, transparent)"
          : `radial-gradient(circle, rgba(${150+tension*105},${100-tension*60},${200-tension*150},${0.15+tension*0.3}), transparent)`,
        border: released
          ? "2px solid rgba(255,220,130,0.3)"
          : `2px solid rgba(${150+tension*105},${100-tension*60},${200-tension*150},${0.2+tension*0.4})`,
        transition: released ? "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)" : pressing ? "all 0.1s ease" : "all 0.8s ease",
        transform: pressing ? `scale(${constrict})` : released ? "scale(1.2)" : "scale(1)",
        boxShadow: released
          ? "0 0 80px rgba(255,200,100,0.3), 0 0 160px rgba(255,180,80,0.15)"
          : pressing
            ? `inset 0 0 ${tension*40}px rgba(100,50,150,${tension*0.3}), 0 0 ${tension*20}px rgba(150,100,200,${tension*0.15})`
            : "none",
        pointerEvents:"none",
      }}/>

      {/* Dark vignette that intensifies while holding */}
      {pressing && (
        <div style={{
          position:"absolute", inset:0,
          background:`radial-gradient(circle, transparent 20%, rgba(0,0,0,${darkOverlay}) 80%)`,
          pointerEvents:"none", transition:"all 0.3s ease",
        }}/>
      )}

      {/* Release burst particles */}
      {released && Array.from({ length: 16 }).map((_, i) => (
        <div key={i} style={{
          position:"absolute", top:"50%", left:"50%",
          width:"6px", height:"6px", borderRadius:"50%",
          background:`hsla(${40 + i*5},80%,70%,0.7)`,
          animation:`burstOut 1.5s ${i*0.05}s ease-out forwards`,
          '--burst-angle': `${(360/16)*i}deg`,
          '--burst-dist': `${80+Math.random()*120}px`,
          pointerEvents:"none",
        }}/>
      ))}

      {/* Instructions */}
      <div style={{ position:"absolute", top:"15%", left:"50%", transform:"translateX(-50%)",
        textAlign:"center", pointerEvents:"none" }}>
        {!pressing && !released && (
          <div style={{ opacity: cycles > 2 ? 0.2 : 0.6, transition:"opacity 0.5s ease" }}>
            <p style={{ color:"rgba(180,150,220,0.5)", fontSize:"10px", letterSpacing:"5px",
              textTransform:"uppercase", fontStyle:"italic", fontFamily:font, margin:"0 0 8px" }}>
              Tension & Release
            </p>
            <p style={{ color:"rgba(255,255,240,0.25)", fontSize:"13px", fontStyle:"italic", fontFamily:font }}>
              Press and hold. Build the tension. Then let go.
            </p>
          </div>
        )}
        {pressing && (
          <p style={{ color:`rgba(${150+tension*105},${100-tension*60},${200-tension*150},${0.4+tension*0.4})`,
            fontSize:"12px", fontStyle:"italic", fontFamily:font,
            transition:"color 0.3s ease" }}>
            {tension < 0.3 ? "Hold it..." : tension < 0.6 ? "Feel the tension building..." : tension < 0.85 ? "Almost there..." : "Whenever you're ready... let go."}
          </p>
        )}
      </div>

      {/* Release message */}
      {released && (
        <div style={{ position:"absolute", bottom:"25%", left:"50%", transform:"translateX(-50%)",
          textAlign:"center", pointerEvents:"none",
          animation:"fadeInSlow 1s 0.5s ease forwards", opacity:0 }}>
          <p style={{ color:"rgba(255,220,150,0.6)", fontSize:"16px", fontStyle:"italic",
            fontFamily:font, lineHeight:"2" }}>
            {cycles <= 1 ? "Release." : cycles <= 3 ? "Let it go." : "You're lighter now."}
          </p>
        </div>
      )}

      <button onClick={(e) => { e.stopPropagation(); onBack(); }} style={{
        position:"absolute", top:"16px", left:"16px", zIndex:50,
        background:"none", border:"none", cursor:"pointer",
        color:"rgba(255,255,240,0.3)", fontSize:"20px", padding:"8px" }}>←</button>

      <style>{`
        @keyframes burstOut {
          0% { opacity:0.8; transform: translate(-50%,-50%) rotate(var(--burst-angle)) translateX(0); }
          100% { opacity:0; transform: translate(-50%,-50%) rotate(var(--burst-angle)) translateX(var(--burst-dist)); }
        }
        @keyframes fadeInSlow { 0%{opacity:0;transform:translateX(-50%) translateY(10px)} 100%{opacity:1;transform:translateX(-50%) translateY(0)} }
      `}</style>
    </div>
  );
}

// ── RESET: Lights (Scripture Orbs) ──
function ResetLightsScreen({ C, font, onBack }) {
  const [orbs, setOrbs] = useState([]);
  const [entered, setEntered] = useState(false);
  const [showExit, setShowExit] = useState(false);
  const [scripture, setScripture] = useState(null);
  const [scriptureFade, setScriptureFade] = useState(0);
  const scriptureTimer = useRef(null);
  const orbCounter = useRef(0);

  const SCRIPTURES = [
    { text:"Be still, and know that I am God.", ref:"Psalm 46:10" },
    { text:"I am with you always.", ref:"Matthew 28:20" },
    { text:"You are never alone.", ref:"Deuteronomy 31:6" },
    { text:"I have called you by name. You are mine.", ref:"Isaiah 43:1" },
    { text:"Come to me, all who are weary.", ref:"Matthew 11:28" },
    { text:"My grace is sufficient for you.", ref:"2 Corinthians 12:9" },
    { text:"He heals the brokenhearted.", ref:"Psalm 147:3" },
    { text:"Cast your burden on the Lord.", ref:"Psalm 55:22" },
    { text:"Peace I leave with you.", ref:"John 14:27" },
    { text:"The Lord is my shepherd.", ref:"Psalm 23:1" },
    { text:"In quietness and trust is your strength.", ref:"Isaiah 30:15" },
    { text:"The Lord will fight for you. You need only be still.", ref:"Exodus 14:14" },
    { text:"He restores my soul.", ref:"Psalm 23:3" },
    { text:"Fear not, for I have redeemed you.", ref:"Isaiah 43:1" },
    { text:"Nothing can separate you from My love.", ref:"Romans 8:38" },
    { text:"I am making all things new.", ref:"Revelation 21:5" },
    { text:"He gives power to the faint.", ref:"Isaiah 40:29" },
    { text:"I will never leave you nor forsake you.", ref:"Hebrews 13:5" },
    { text:"Even the darkness is not dark to You.", ref:"Psalm 139:12" },
    { text:"I have loved you with an everlasting love.", ref:"Jeremiah 31:3" },
  ];

  const COLORS = [
    "rgba(255,210,120,", "rgba(255,190,100,", "rgba(240,230,200,",
    "rgba(255,175,80,", "rgba(220,200,160,", "rgba(255,220,150,",
  ];

  useEffect(() => { setTimeout(() => setEntered(true), 100); }, []);
  useEffect(() => { setTimeout(() => setShowExit(true), 4000); }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setOrbs(prev => prev.filter(o => Date.now() - o.born < 14000));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleTap = (e) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    // Check for orb tap
    const hitOrb = orbs.find(o => {
      const dx = o.x - x; const dy = o.y - y;
      return Math.sqrt(dx*dx+dy*dy) < 8 && o.hasScripture && (Date.now()-o.born) < 10000;
    });

    if (hitOrb) {
      hitOrb.hasScripture = false;
      const s = SCRIPTURES[hitOrb.scriptureIdx % SCRIPTURES.length];
      setScripture(s);
      setScriptureFade(1);
      if (scriptureTimer.current) clearTimeout(scriptureTimer.current);
      scriptureTimer.current = setTimeout(() => {
        setScriptureFade(0);
        setTimeout(() => setScripture(null), 600);
      }, 3500);
      return;
    }

    const id = orbCounter.current++;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    setOrbs(prev => [...prev.slice(-40), {
      id, born:Date.now(), x, y, color,
      size: 10 + Math.random() * 16,
      duration: 10 + Math.random() * 4,
      hasScripture: Math.random() > 0.4,
      scriptureIdx: Math.floor(Math.random() * SCRIPTURES.length),
    }]);
  };

  return (
    <div onClick={handleTap} onTouchStart={handleTap} style={{
      position:"fixed", inset:0, zIndex:300,
      background:"linear-gradient(180deg, #0C0E14 0%, #141820 50%, #0A0C12 100%)",
      opacity:entered?1:0, transition:"opacity 0.8s ease",
      touchAction:"none", userSelect:"none", overflow:"hidden", cursor:"pointer",
    }}>
      {orbs.map(orb => (
        <div key={orb.id} style={{
          position:"absolute", left:`${orb.x}%`, top:`${orb.y}%`,
          width:`${orb.size}px`, height:`${orb.size}px`,
          borderRadius:"50%",
          background:`radial-gradient(circle, ${orb.color}0.8), ${orb.color}0.3) 50%, ${orb.color}0) 100%)`,
          boxShadow:`0 0 ${orb.size*2}px ${orb.color}0.25), 0 0 ${orb.size*4}px ${orb.color}0.1)`,
          animation:`orbFloat ${orb.duration}s ease-out forwards`,
          pointerEvents:"none", transform:"translate(-50%, -50%)",
        }}/>
      ))}

      <div style={{ position:"absolute", top:"18%", left:"50%", transform:"translateX(-50%)",
        zIndex:10, textAlign:"center", pointerEvents:"none",
        opacity:orbs.length > 3 ? 0 : 0.7, transition:"opacity 1.5s ease" }}>
        <p style={{ color:"rgba(255,255,240,0.5)", fontSize:"10px", letterSpacing:"5px",
          textTransform:"uppercase", fontStyle:"italic", fontFamily:font, margin:"0 0 12px" }}>Lights</p>
        <p style={{ color:"rgba(255,255,240,0.3)", fontSize:"13px", fontStyle:"italic",
          fontFamily:font, lineHeight:"2", maxWidth:"260px" }}>
          Tap to create light. Tap a light for a word.
        </p>
      </div>

      {scripture && (
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)",
          zIndex:20, textAlign:"center", pointerEvents:"none",
          opacity:scriptureFade, transition:"opacity 0.6s ease", maxWidth:"300px", padding:"0 20px" }}>
          <p style={{ color:"rgba(255,250,230,0.85)", fontSize:"18px", fontStyle:"italic",
            fontFamily:font, lineHeight:"1.9", margin:"0 0 8px",
            textShadow:"0 0 30px rgba(255,200,100,0.3)" }}>
            "{scripture.text}"
          </p>
          <p style={{ color:"rgba(255,220,160,0.5)", fontSize:"10px", letterSpacing:"3px",
            textTransform:"uppercase", fontFamily:font, margin:0 }}>{scripture.ref}</p>
        </div>
      )}

      {showExit && (
        <div style={{ position:"absolute", bottom:"40px", left:"50%", transform:"translateX(-50%)", zIndex:50 }}>
          <button onClick={(e) => { e.stopPropagation(); onBack(); }} style={{
            background:"rgba(255,255,240,0.08)", border:"1px solid rgba(255,255,240,0.12)",
            borderRadius:"30px", padding:"12px 32px", cursor:"pointer",
            color:"rgba(255,255,240,0.45)", fontSize:"11px", letterSpacing:"3px",
            textTransform:"uppercase", fontStyle:"italic", fontFamily:font,
          }}>Whenever you're ready</button>
        </div>
      )}

      <style>{`
        @keyframes orbFloat {
          0% { opacity:0; transform:translate(-50%,-50%) scale(0.3); }
          8% { opacity:1; transform:translate(-50%,-50%) scale(1); }
          70% { opacity:0.8; }
          100% { opacity:0; transform:translate(calc(-50% + ${Math.random()>0.5?'':'-'}15px), calc(-50% - 35vh)) scale(0.4); }
        }
      `}</style>
    </div>
  );
}

// ── RESET: Let Go (Burn Your Words) ──
function ResetLetGoScreen({ C, font, onBack }) {
  const [text, setText] = useState("");
  const [phase, setPhase] = useState("write");
  const [entered, setEntered] = useState(false);
  const [burnChars, setBurnChars] = useState([]);

  useEffect(() => { setTimeout(() => setEntered(true), 100); }, []);

  const handleRelease = () => {
    if (!text.trim()) return;
    const chars = text.split("").map((ch, i) => ({
      id: i, char: ch, delay: Math.random() * 1.5,
      x: (i % 28) * 3.2 + 5, y: Math.floor(i / 28) * 5 + 35,
    }));
    setBurnChars(chars);
    setPhase("burning");
    setTimeout(() => setPhase("done"), 3500);
  };

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:300,
      background:"linear-gradient(180deg, #1a0f0a 0%, #0f0805 100%)",
      opacity:entered?1:0, transition:"opacity 0.8s ease",
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      padding:"40px 24px", boxSizing:"border-box", fontFamily:font,
    }}>
      {phase === "write" && (
        <div style={{ maxWidth:"380px", width:"100%", textAlign:"center" }}>
          <p style={{ color:"rgba(255,200,140,0.5)", fontSize:"10px", letterSpacing:"5px",
            textTransform:"uppercase", fontStyle:"italic", margin:"0 0 8px" }}>Let Go</p>
          <p style={{ color:"rgba(255,250,235,0.3)", fontSize:"13px", fontStyle:"italic",
            lineHeight:"2", margin:"0 0 28px" }}>
            Type what's weighing on you. Then let it burn. Nothing is saved.
          </p>
          <textarea value={text} onChange={e => setText(e.target.value)}
            placeholder="Pour it out here..."
            autoFocus
            style={{
              width:"100%", minHeight:"160px", maxHeight:"280px",
              background:"rgba(255,255,240,0.04)", border:"1px solid rgba(255,200,140,0.15)",
              borderRadius:"12px", padding:"18px", boxSizing:"border-box",
              color:"rgba(255,250,235,0.8)", fontSize:"15px", fontStyle:"italic",
              fontFamily:font, lineHeight:"2", resize:"vertical", outline:"none",
            }}/>
          <div style={{ display:"flex", gap:"12px", marginTop:"20px", justifyContent:"center" }}>
            <button onClick={onBack} style={{
              background:"none", border:"1px solid rgba(255,255,240,0.1)",
              borderRadius:"30px", padding:"12px 24px", cursor:"pointer",
              color:"rgba(255,255,240,0.3)", fontSize:"11px", letterSpacing:"3px",
              textTransform:"uppercase", fontStyle:"italic", fontFamily:font }}>Back</button>
            <button onClick={handleRelease} style={{
              background:text.trim()?"rgba(255,140,60,0.2)":"rgba(255,255,240,0.04)",
              border:`1px solid ${text.trim()?"rgba(255,140,60,0.4)":"rgba(255,255,240,0.08)"}`,
              borderRadius:"30px", padding:"12px 32px",
              cursor:text.trim()?"pointer":"default",
              color:text.trim()?"rgba(255,200,140,0.9)":"rgba(255,255,240,0.2)",
              fontSize:"11px", letterSpacing:"3px", textTransform:"uppercase",
              fontStyle:"italic", fontFamily:font }}>🔥 Let Go</button>
          </div>
        </div>
      )}

      {phase === "burning" && (
        <div style={{ position:"relative", width:"100%", height:"60vh" }}>
          {burnChars.map(p => (
            <span key={p.id} style={{
              position:"absolute", left:`${p.x}%`, top:`${p.y}%`,
              color:"rgba(255,180,100,0.9)", fontSize:"15px", fontStyle:"italic", fontFamily:font,
              animation:`charBurn 2s ${p.delay}s ease-out forwards`,
            }}>{p.char}</span>
          ))}
          <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)",
            textAlign:"center", animation:"fadeIn 1.5s 1s ease forwards", opacity:0 }}>
            <span style={{ fontSize:"48px" }}>🔥</span>
          </div>
        </div>
      )}

      {phase === "done" && (
        <div style={{ textAlign:"center", animation:"fadeIn 1s ease forwards", opacity:0 }}>
          <p style={{ color:"rgba(255,250,235,0.6)", fontSize:"18px", fontStyle:"italic",
            lineHeight:"2", margin:"0 0 8px" }}>It's gone.</p>
          <p style={{ color:"rgba(255,250,235,0.25)", fontSize:"12px", fontStyle:"italic",
            lineHeight:"1.8", margin:"0 0 32px" }}>You don't have to carry that anymore.</p>
          <div style={{ display:"flex", gap:"12px", justifyContent:"center" }}>
            <button onClick={() => { setText(""); setPhase("write"); setBurnChars([]); }} style={{
              background:"rgba(255,140,60,0.12)", border:"1px solid rgba(255,140,60,0.25)",
              borderRadius:"30px", padding:"12px 28px", cursor:"pointer",
              color:"rgba(255,200,140,0.7)", fontSize:"11px", letterSpacing:"3px",
              textTransform:"uppercase", fontStyle:"italic", fontFamily:font }}>Release More</button>
            <button onClick={onBack} style={{
              background:"rgba(255,255,240,0.06)", border:"1px solid rgba(255,255,240,0.1)",
              borderRadius:"30px", padding:"12px 28px", cursor:"pointer",
              color:"rgba(255,255,240,0.4)", fontSize:"11px", letterSpacing:"3px",
              textTransform:"uppercase", fontStyle:"italic", fontFamily:font }}>Done</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes charBurn {
          0% { opacity:1; color:rgba(255,220,160,0.9); transform:translate(0,0) scale(1); }
          30% { color:rgba(255,140,60,1); }
          60% { color:rgba(200,80,20,0.8); }
          100% { opacity:0; transform:translate(${Math.random()>0.5?'':'-'}${15+Math.random()*30}px, -${40+Math.random()*60}px) scale(0.1); color:rgba(80,30,10,0); }
        }
        @keyframes fadeIn { 0%{opacity:0;transform:translateY(10px)} 100%{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
}

// ── RESET: Memory Match Game ──
function ResetMemoryGame({ C, font, onBack }) {
  const EMOJIS = ["🌊","🔥","⭐","🌿","💎","🎵","🌙","🦋","🕊️","🌸","⚡","🪨"];
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gridSize, setGridSize] = useState(4); // 4x4 = 8 pairs
  const [won, setWon] = useState(false);
  const [entered, setEntered] = useState(false);
  const lockRef = useRef(false);

  useEffect(() => { setTimeout(() => setEntered(true), 100); }, []);

  useEffect(() => {
    const pairs = gridSize === 4 ? 8 : 6;
    const selected = EMOJIS.slice(0, pairs);
    const deck = [...selected, ...selected]
      .sort(() => Math.random() - 0.5)
      .map((emoji, i) => ({ id: i, emoji, flipped: false }));
    setCards(deck);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setWon(false);
  }, [gridSize]);

  const handleFlip = (id) => {
    if (lockRef.current) return;
    if (flipped.includes(id) || matched.includes(id)) return;
    if (flipped.length >= 2) return;

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      lockRef.current = true;
      const [a, b] = newFlipped;
      if (cards[a].emoji === cards[b].emoji) {
        setTimeout(() => {
          const newMatched = [...matched, a, b];
          setMatched(newMatched);
          setFlipped([]);
          lockRef.current = false;
          if (newMatched.length === cards.length) setWon(true);
        }, 400);
      } else {
        setTimeout(() => {
          setFlipped([]);
          lockRef.current = false;
        }, 800);
      }
    }
  };

  const restart = () => {
    const pairs = gridSize === 4 ? 8 : 6;
    const selected = EMOJIS.slice(0, pairs);
    const deck = [...selected, ...selected]
      .sort(() => Math.random() - 0.5)
      .map((emoji, i) => ({ id: i, emoji }));
    setCards(deck);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setWon(false);
  };

  const cols = gridSize;

  return (
    <div style={{ minHeight:"100vh", background:C.bgPrimary, fontFamily:font,
      padding:"36px 20px 100px", boxSizing:"border-box" }}>
      <div style={{ maxWidth:"420px", margin:"0 auto", opacity:entered?1:0, transition:"opacity 0.5s ease" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"20px" }}>
          <button onClick={onBack} style={{ background:"none", border:"none",
            cursor:"pointer", color:C.textMuted, fontSize:"20px" }}>←</button>
          <div style={{ flex:1 }}>
            <h2 style={{ color:C.textPrimary, fontSize:"18px", fontWeight:"normal", margin:0 }}>Memory Match</h2>
          </div>
          <span style={{ color:C.textMuted, fontSize:"11px", fontStyle:"italic" }}>{moves} moves</span>
        </div>

        {/* Grid size toggle */}
        <div style={{ display:"flex", gap:"8px", marginBottom:"16px", justifyContent:"center" }}>
          {[{s:4,l:"4×4"},{s:3,l:"3×4"}].map(g => (
            <button key={g.s} onClick={() => setGridSize(g.s)} style={{
              padding:"6px 16px", borderRadius:"20px", cursor:"pointer",
              background: gridSize===g.s ? `${C.accent}20` : "transparent",
              border:`1px solid ${gridSize===g.s ? C.accent+"55" : C.border}`,
              color: gridSize===g.s ? C.accent : C.textMuted,
              fontSize:"10px", letterSpacing:"2px", fontFamily:font,
            }}>{g.l}</button>
          ))}
        </div>

        <div style={{ display:"grid", gridTemplateColumns:`repeat(${cols}, 1fr)`, gap:"8px" }}>
          {cards.map(card => {
            const isFlipped = flipped.includes(card.id) || matched.includes(card.id);
            const isMatched = matched.includes(card.id);
            return (
              <button key={card.id} onClick={() => handleFlip(card.id)} style={{
                aspectRatio:"1", borderRadius:"10px", cursor: isFlipped ? "default" : "pointer",
                border: isMatched ? `2px solid ${C.sage}55` : `1.5px solid ${C.border}`,
                background: isMatched ? `${C.sage}15` : isFlipped ? C.bgCard : C.bgSecondary,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize: cols===4 ? "24px" : "28px",
                transition:"all 0.25s ease",
                transform: isFlipped ? "rotateY(0deg)" : "rotateY(0deg)",
                opacity: isMatched ? 0.7 : 1,
              }}>
                {isFlipped ? card.emoji : (
                  <div style={{ width:"8px", height:"8px", borderRadius:"50%",
                    background:`${C.accent}30` }}/>
                )}
              </button>
            );
          })}
        </div>

        {won && (
          <div style={{ textAlign:"center", marginTop:"28px", animation:"fadeIn 0.5s ease" }}>
            <p style={{ color:C.accent, fontSize:"16px", fontStyle:"italic", margin:"0 0 4px" }}>
              Cleared in {moves} moves
            </p>
            <p style={{ color:C.textMuted, fontSize:"12px", fontStyle:"italic", margin:"0 0 16px" }}>
              {moves <= (gridSize===4?10:8) ? "Sharp mind." : moves <= (gridSize===4?16:12) ? "Well played." : "You got there."}
            </p>
            <button onClick={restart} style={{
              background:`${C.accent}15`, border:`1px solid ${C.accent}33`,
              borderRadius:"30px", padding:"12px 28px", cursor:"pointer",
              color:C.accent, fontSize:"10px", letterSpacing:"3px",
              textTransform:"uppercase", fontStyle:"italic", fontFamily:font }}>
              Play Again
            </button>
          </div>
        )}
      </div>
      <style>{`@keyframes fadeIn { 0%{opacity:0;transform:translateY(8px)} 100%{opacity:1;transform:translateY(0)} }`}</style>
    </div>
  );
}

// ── RESET: Number Flow ──
function ResetNumberFlow({ C, font, onBack }) {
  const [numbers, setNumbers] = useState([]);
  const [nextNum, setNextNum] = useState(1);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [time, setTime] = useState(0);
  const [entered, setEntered] = useState(false);
  const [gridCount, setGridCount] = useState(25);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => { setTimeout(() => setEntered(true), 100); }, []);

  useEffect(() => { initGame(); }, [gridCount]);

  const initGame = () => {
    const nums = Array.from({ length: gridCount }, (_, i) => i + 1)
      .sort(() => Math.random() - 0.5)
      .map((n, i) => ({
        num: n,
        x: 5 + (i % 5) * 19,
        y: 5 + Math.floor(i / 5) * 19,
      }));
    setNumbers(nums);
    setNextNum(1);
    setStarted(false);
    setFinished(false);
    setTime(0);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleTap = (num) => {
    if (num !== nextNum) return;
    if (!started) {
      setStarted(true);
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => {
        setTime((Date.now() - startTimeRef.current) / 1000);
      }, 100);
    }
    setNextNum(num + 1);
    if (num === gridCount) {
      clearInterval(timerRef.current);
      setTime((Date.now() - startTimeRef.current) / 1000);
      setFinished(true);
    }
  };

  return (
    <div style={{ minHeight:"100vh", background:C.bgPrimary, fontFamily:font,
      padding:"36px 20px 100px", boxSizing:"border-box" }}>
      <div style={{ maxWidth:"420px", margin:"0 auto", opacity:entered?1:0, transition:"opacity 0.5s ease" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"20px" }}>
          <button onClick={onBack} style={{ background:"none", border:"none",
            cursor:"pointer", color:C.textMuted, fontSize:"20px" }}>←</button>
          <div style={{ flex:1 }}>
            <h2 style={{ color:C.textPrimary, fontSize:"18px", fontWeight:"normal", margin:0 }}>Number Flow</h2>
          </div>
          <span style={{ color:C.amber, fontSize:"14px", fontWeight:"bold" }}>
            {started ? time.toFixed(1) + "s" : "—"}
          </span>
        </div>

        {!finished && (
          <p style={{ color:C.textMuted, fontSize:"12px", fontStyle:"italic", textAlign:"center",
            margin:"0 0 16px" }}>
            Tap <strong style={{ color:C.accent }}>{nextNum}</strong> next
          </p>
        )}

        <div style={{ position:"relative", width:"100%", aspectRatio:"1",
          background:C.bgSecondary, borderRadius:"14px", border:`1px solid ${C.border}`,
          overflow:"hidden" }}>
          {numbers.map(n => {
            const found = n.num < nextNum;
            const isNext = n.num === nextNum;
            return (
              <button key={n.num} onClick={() => handleTap(n.num)} style={{
                position:"absolute",
                left:`${n.x}%`, top:`${n.y}%`,
                width:"16%", height:"16%",
                borderRadius:"10px",
                border: isNext ? `2px solid ${C.accent}` : `1px solid ${found ? C.sage+"33" : C.border}`,
                background: found ? `${C.sage}20` : isNext ? `${C.accent}12` : C.bgCard,
                display:"flex", alignItems:"center", justifyContent:"center",
                cursor: found ? "default" : "pointer",
                transition:"all 0.2s ease",
                opacity: found ? 0.4 : 1,
              }}>
                <span style={{
                  color: found ? C.sage : isNext ? C.accent : C.textPrimary,
                  fontSize:"15px", fontWeight:"bold", fontFamily:font,
                }}>{n.num}</span>
              </button>
            );
          })}
        </div>

        {finished && (
          <div style={{ textAlign:"center", marginTop:"24px", animation:"fadeIn 0.5s ease" }}>
            <p style={{ color:C.accent, fontSize:"18px", fontStyle:"italic", margin:"0 0 4px" }}>
              {time.toFixed(1)}s
            </p>
            <p style={{ color:C.textMuted, fontSize:"12px", fontStyle:"italic", margin:"0 0 16px" }}>
              {time < 20 ? "Lightning fast." : time < 35 ? "Solid focus." : time < 50 ? "Steady hands." : "You found them all."}
            </p>
            <button onClick={initGame} style={{
              background:`${C.accent}15`, border:`1px solid ${C.accent}33`,
              borderRadius:"30px", padding:"12px 28px", cursor:"pointer",
              color:C.accent, fontSize:"10px", letterSpacing:"3px",
              textTransform:"uppercase", fontStyle:"italic", fontFamily:font }}>
              Go Again
            </button>
          </div>
        )}
      </div>
      <style>{`@keyframes fadeIn { 0%{opacity:0;transform:translateY(8px)} 100%{opacity:1;transform:translateY(0)} }`}</style>
    </div>
  );
}

// ── RESET: Color Mind (Stroop Test) ──
function ResetColorMind({ C, font, onBack }) {
  const COLORS = [
    { name:"RED", hex:"#E85454" },
    { name:"BLUE", hex:"#5488E8" },
    { name:"GREEN", hex:"#54B868" },
    { name:"YELLOW", hex:"#D4A84E" },
    { name:"PURPLE", hex:"#9E6CC8" },
  ];
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [challenge, setChallenge] = useState(null);
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [entered, setEntered] = useState(false);
  const [lives, setLives] = useState(3);
  const TOTAL_ROUNDS = 20;

  useEffect(() => { setTimeout(() => setEntered(true), 100); }, []);
  useEffect(() => { if (!gameOver) generateRound(); }, [round]);

  const generateRound = () => {
    const wordColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    const displayColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    setChallenge({ word: wordColor.name, displayHex: displayColor.hex, correctName: displayColor.name });

    // Generate 3 options including the correct answer
    const correct = displayColor;
    let opts = [correct];
    while (opts.length < 3) {
      const r = COLORS[Math.floor(Math.random() * COLORS.length)];
      if (!opts.find(o => o.name === r.name)) opts.push(r);
    }
    setOptions(opts.sort(() => Math.random() - 0.5));
    setFeedback(null);
  };

  const handleAnswer = (colorName) => {
    if (feedback) return;
    const correct = colorName === challenge.correctName;
    setFeedback(correct ? "correct" : "wrong");

    if (correct) {
      setScore(s => s + 1 + streak);
      setStreak(s => s + 1);
    } else {
      setStreak(0);
      setLives(l => l - 1);
      if (lives <= 1) {
        setTimeout(() => setGameOver(true), 600);
        return;
      }
    }

    setTimeout(() => {
      if (round + 1 >= TOTAL_ROUNDS) {
        setGameOver(true);
      } else {
        setRound(r => r + 1);
      }
    }, 500);
  };

  const restart = () => {
    setRound(0); setScore(0); setStreak(0); setLives(3);
    setGameOver(false); setFeedback(null);
  };

  return (
    <div style={{ minHeight:"100vh", background:C.bgPrimary, fontFamily:font,
      padding:"36px 20px 100px", boxSizing:"border-box" }}>
      <div style={{ maxWidth:"420px", margin:"0 auto", opacity:entered?1:0, transition:"opacity 0.5s ease" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"20px" }}>
          <button onClick={onBack} style={{ background:"none", border:"none",
            cursor:"pointer", color:C.textMuted, fontSize:"20px" }}>←</button>
          <div style={{ flex:1 }}>
            <h2 style={{ color:C.textPrimary, fontSize:"18px", fontWeight:"normal", margin:0 }}>Color Mind</h2>
          </div>
          <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
            <span style={{ color:C.textMuted, fontSize:"11px" }}>{"❤️".repeat(lives)}</span>
            <span style={{ color:C.accent, fontSize:"14px", fontWeight:"bold" }}>{score}</span>
          </div>
        </div>

        {!gameOver && challenge && (
          <div style={{ textAlign:"center" }}>
            <p style={{ color:C.textMuted, fontSize:"10px", letterSpacing:"3px",
              textTransform:"uppercase", fontStyle:"italic", margin:"0 0 8px" }}>
              Tap the COLOR of the text, not the word
            </p>
            <p style={{ color:C.textMuted, fontSize:"11px", margin:"0 0 24px" }}>
              Round {round + 1}/{TOTAL_ROUNDS} {streak > 2 ? `· 🔥 ${streak} streak` : ""}
            </p>

            {/* The word displayed in a different color */}
            <div style={{ background:C.bgSecondary, borderRadius:"16px", padding:"40px 20px",
              marginBottom:"28px", border:`1px solid ${C.border}`,
              boxShadow: feedback==="correct" ? `0 0 20px ${C.sage}33` : feedback==="wrong" ? `0 0 20px ${C.terra}33` : "none",
              transition:"box-shadow 0.3s ease" }}>
              <span style={{
                color: challenge.displayHex,
                fontSize:"clamp(32px,8vw,48px)", fontWeight:"bold",
                fontFamily:font, letterSpacing:"4px",
              }}>{challenge.word}</span>
            </div>

            {/* Answer buttons */}
            <div style={{ display:"flex", gap:"10px", justifyContent:"center" }}>
              {options.map(opt => (
                <button key={opt.name} onClick={() => handleAnswer(opt.name)} style={{
                  width:"80px", height:"80px", borderRadius:"50%",
                  background: opt.hex, border:"none", cursor:"pointer",
                  transition:"all 0.15s ease",
                  boxShadow:`0 4px 15px ${opt.hex}44`,
                  opacity: feedback && opt.name !== challenge.correctName ? 0.3 : 1,
                }}
                  onMouseEnter={e => e.currentTarget.style.transform="scale(1.1)"}
                  onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}/>
              ))}
            </div>
          </div>
        )}

        {gameOver && (
          <div style={{ textAlign:"center", marginTop:"60px", animation:"fadeIn 0.5s ease" }}>
            <p style={{ color:C.accent, fontSize:"36px", fontWeight:"bold", margin:"0 0 8px" }}>{score}</p>
            <p style={{ color:C.textSoft, fontSize:"14px", fontStyle:"italic", margin:"0 0 4px" }}>
              {score >= 30 ? "Your mind is razor sharp." : score >= 20 ? "Impressive focus." : score >= 10 ? "Getting sharper." : "Keep training."}
            </p>
            <p style={{ color:C.textMuted, fontSize:"11px", fontStyle:"italic", margin:"0 0 28px" }}>
              {round >= TOTAL_ROUNDS ? `Completed all ${TOTAL_ROUNDS} rounds` : `Made it to round ${round + 1}`}
            </p>
            <button onClick={restart} style={{
              background:`${C.accent}15`, border:`1px solid ${C.accent}33`,
              borderRadius:"30px", padding:"12px 28px", cursor:"pointer",
              color:C.accent, fontSize:"10px", letterSpacing:"3px",
              textTransform:"uppercase", fontStyle:"italic", fontFamily:font }}>
              Play Again
            </button>
          </div>
        )}
      </div>
      <style>{`@keyframes fadeIn { 0%{opacity:0;transform:translateY(8px)} 100%{opacity:1;transform:translateY(0)} }`}</style>
    </div>
  );
}

// ── RESET: Pattern Recall (Simon Says) ──
function ResetPatternRecall({ C, font, onBack }) {
  const PADS = [
    { id:0, color:"#E85454", pos:"top-left" },
    { id:1, color:"#5488E8", pos:"top-right" },
    { id:2, color:"#54B868", pos:"bottom-left" },
    { id:3, color:"#D4A84E", pos:"bottom-right" },
  ];
  const [sequence, setSequence] = useState([]);
  const [playerInput, setPlayerInput] = useState([]);
  const [phase, setPhase] = useState("idle"); // idle | showing | input | fail | win
  const [activePad, setActivePad] = useState(null);
  const [level, setLevel] = useState(0);
  const [bestLevel, setBestLevel] = useState(0);
  const [entered, setEntered] = useState(false);
  const showingRef = useRef(false);

  useEffect(() => { setTimeout(() => setEntered(true), 100); }, []);

  const startGame = () => {
    const first = [Math.floor(Math.random() * 4)];
    setSequence(first);
    setLevel(1);
    setPhase("showing");
    setTimeout(() => showSequence(first), 500);
  };

  const showSequence = (seq) => {
    showingRef.current = true;
    seq.forEach((padId, i) => {
      setTimeout(() => {
        setActivePad(padId);
        setTimeout(() => setActivePad(null), 350);
      }, i * 600);
    });
    setTimeout(() => {
      showingRef.current = false;
      setPlayerInput([]);
      setPhase("input");
    }, seq.length * 600 + 200);
  };

  const handlePadTap = (padId) => {
    if (phase !== "input" || showingRef.current) return;

    setActivePad(padId);
    setTimeout(() => setActivePad(null), 200);

    const newInput = [...playerInput, padId];
    setPlayerInput(newInput);

    const idx = newInput.length - 1;
    if (newInput[idx] !== sequence[idx]) {
      setPhase("fail");
      if (level > bestLevel) setBestLevel(level);
      return;
    }

    if (newInput.length === sequence.length) {
      // Level complete — add next
      const next = [...sequence, Math.floor(Math.random() * 4)];
      setSequence(next);
      setLevel(l => l + 1);
      setPhase("showing");
      setTimeout(() => showSequence(next), 800);
    }
  };

  const padPositions = [
    { top:"5%", left:"5%", right:"52%", bottom:"52%" },
    { top:"5%", left:"52%", right:"5%", bottom:"52%" },
    { top:"52%", left:"5%", right:"52%", bottom:"5%" },
    { top:"52%", left:"52%", right:"5%", bottom:"5%" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:C.bgPrimary, fontFamily:font,
      padding:"36px 20px 100px", boxSizing:"border-box" }}>
      <div style={{ maxWidth:"420px", margin:"0 auto", opacity:entered?1:0, transition:"opacity 0.5s ease" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"20px" }}>
          <button onClick={onBack} style={{ background:"none", border:"none",
            cursor:"pointer", color:C.textMuted, fontSize:"20px" }}>←</button>
          <div style={{ flex:1 }}>
            <h2 style={{ color:C.textPrimary, fontSize:"18px", fontWeight:"normal", margin:0 }}>Pattern Recall</h2>
          </div>
          {level > 0 && <span style={{ color:C.accent, fontSize:"14px", fontWeight:"bold" }}>Level {level}</span>}
        </div>

        {phase === "idle" && (
          <div style={{ textAlign:"center", marginTop:"40px" }}>
            <p style={{ color:C.textSoft, fontSize:"13px", fontStyle:"italic", lineHeight:"2", margin:"0 0 24px" }}>
              Watch the pattern. Repeat it back. Each level adds one more.
            </p>
            {bestLevel > 0 && (
              <p style={{ color:C.textMuted, fontSize:"11px", fontStyle:"italic", margin:"0 0 16px" }}>
                Best: Level {bestLevel}
              </p>
            )}
            <button onClick={startGame} style={{
              background:`${C.accent}15`, border:`1px solid ${C.accent}33`,
              borderRadius:"30px", padding:"14px 36px", cursor:"pointer",
              color:C.accent, fontSize:"11px", letterSpacing:"3px",
              textTransform:"uppercase", fontStyle:"italic", fontFamily:font }}>
              Start
            </button>
          </div>
        )}

        {(phase === "showing" || phase === "input") && (
          <div>
            <p style={{ color:C.textMuted, fontSize:"11px", fontStyle:"italic", textAlign:"center", margin:"0 0 16px" }}>
              {phase === "showing" ? "Watch carefully..." : "Your turn — repeat the pattern"}
            </p>
            <div style={{ position:"relative", width:"100%", aspectRatio:"1",
              borderRadius:"16px", overflow:"hidden" }}>
              {PADS.map((pad, i) => (
                <button key={pad.id} onClick={() => handlePadTap(pad.id)} style={{
                  position:"absolute",
                  top:padPositions[i].top, left:padPositions[i].left,
                  right:padPositions[i].right, bottom:padPositions[i].bottom,
                  borderRadius:"12px", border:"none",
                  cursor: phase === "input" ? "pointer" : "default",
                  background: activePad === pad.id ? pad.color : `${pad.color}25`,
                  transition:"all 0.15s ease",
                  boxShadow: activePad === pad.id ? `0 0 30px ${pad.color}55` : "none",
                }}/>
              ))}
            </div>
          </div>
        )}

        {phase === "fail" && (
          <div style={{ textAlign:"center", marginTop:"40px", animation:"fadeIn 0.5s ease" }}>
            <p style={{ color:C.textPrimary, fontSize:"20px", fontWeight:"normal", margin:"0 0 4px" }}>
              Level {level}
            </p>
            <p style={{ color:C.textSoft, fontSize:"13px", fontStyle:"italic", margin:"0 0 4px" }}>
              {level >= 10 ? "Exceptional memory." : level >= 7 ? "Strong recall." : level >= 4 ? "Building focus." : "Keep training."}
            </p>
            {level > bestLevel && (
              <p style={{ color:C.amber, fontSize:"11px", fontStyle:"italic", margin:"4px 0 0" }}>
                ⭐ New personal best!
              </p>
            )}
            <div style={{ display:"flex", gap:"12px", justifyContent:"center", marginTop:"24px" }}>
              <button onClick={startGame} style={{
                background:`${C.accent}15`, border:`1px solid ${C.accent}33`,
                borderRadius:"30px", padding:"12px 28px", cursor:"pointer",
                color:C.accent, fontSize:"10px", letterSpacing:"3px",
                textTransform:"uppercase", fontStyle:"italic", fontFamily:font }}>
                Try Again
              </button>
              <button onClick={onBack} style={{
                background:"none", border:`1px solid ${C.border}`,
                borderRadius:"30px", padding:"12px 28px", cursor:"pointer",
                color:C.textMuted, fontSize:"10px", letterSpacing:"3px",
                textTransform:"uppercase", fontStyle:"italic", fontFamily:font }}>
                Done
              </button>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes fadeIn { 0%{opacity:0;transform:translateY(8px)} 100%{opacity:1;transform:translateY(0)} }`}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// BIBLE STORIES — Faith-Rooted Story Experience
// ═══════════════════════════════════════════════════════
function BibleStoriesScreen({ C, font, setScreen, faithLevel }) {
  const [activeStory, setActiveStory] = useState(null);
  const [chapterIdx, setChapterIdx] = useState(0);

  const STORIES = [
    {
      id:"david", title:"David & Goliath", icon:"⚔️", tag:"Courage Against the Odds",
      color:"#E85454",
      summary:"A shepherd boy walks onto a battlefield that trained soldiers ran from. No armor. No sword. Just a sling and an unshakable conviction that the size of the fight in you matters more than the size of what's in front of you.",
      chapters:[
        { title:"The Valley", text:"The Israelite army stood paralyzed. For 40 days, a 9-foot giant named Goliath walked into the valley between the two armies and demanded someone face him. Every soldier heard the same voice. Every one of them did the math — size, armor, experience — and stayed in their tent. Fear doesn't just stop you from acting. It convinces you that staying still is the smart move." },
        { title:"The Shepherd", text:"David wasn't a soldier. He was a teenager delivering bread to his brothers. But when he heard Goliath's voice, something different happened in his chest. Not recklessness — recognition. He'd faced a lion protecting his sheep. He'd fought a bear with his bare hands. David didn't see Goliath as bigger than those moments. He saw him as the same test in a different skin." },
        { title:"The Rejection", text:"When David volunteered, King Saul laughed. Then he tried to dress David in royal armor — heavy, oversized, not built for him. David took it off. This is the part most people skip: David rejected someone else's way of fighting. He didn't try to become a soldier in that moment. He stayed a shepherd. The tools that got you here are the tools that get you through." },
        { title:"The Valley Floor", text:"Five smooth stones. A leather sling. The entire army watching. Goliath was insulted — a boy? David didn't argue. He didn't try to prove himself with words. He ran toward the giant. Not walked. Ran. The stone hit Goliath's forehead and he fell face-first into the dirt. The valley that held everyone hostage for 40 days was freed in under 60 seconds." },
        { title:"Why This Matters to You", text:"You have a Goliath. Everyone does. It's the thing that feels too big to face — the conversation, the decision, the change, the past. And like every soldier in that valley, you've probably done the math and decided to stay in the tent. But David teaches us something: courage isn't the absence of fear. It's the refusal to let fear make your decisions. You've already survived things that should have broken you. That's your lion. That's your bear. The giant in front of you is not bigger than what's behind you." },
      ]
    },
    {
      id:"joseph", title:"Joseph's Journey", icon:"🧥", tag:"Betrayal to Purpose",
      color:"#D4A84E",
      summary:"Sold into slavery by his own brothers. Thrown into prison on a false accusation. Forgotten by the people he helped. And yet every pit became a platform. Joseph's story is proof that the worst thing that happens to you can become the setup for the best thing that happens through you.",
      chapters:[
        { title:"The Coat", text:"Joseph was his father's favorite, and everyone knew it. A coat of many colors — not just clothing, but a statement. His brothers didn't just dislike him. They hated him with a hatred that had been simmering for years. Then Joseph made it worse: he told them about his dreams. Dreams where they would bow to him. Sometimes the vision God gives you will make the people closest to you uncomfortable." },
        { title:"The Pit", text:"His brothers threw him into a pit and sat down to eat lunch. Let that sink in. They ate while their brother screamed from a hole in the ground. Then they sold him to slave traders for twenty pieces of silver and went home to tell their father he was dead. Joseph lost everything in a single afternoon — family, freedom, identity. He was seventeen." },
        { title:"The Prison", text:"In Egypt, Joseph rose from slave to trusted household manager. Then his master's wife lied about him, and he was thrown into prison. Again — doing the right thing led to punishment. In prison, he interpreted dreams for two fellow inmates. One was released and promised to remember Joseph. He forgot. Two full years passed. Joseph sat in a cell, waiting for someone who wasn't coming." },
        { title:"The Throne", text:"Pharaoh had a dream no one could interpret. The man who forgot Joseph suddenly remembered. Joseph was pulled from prison, cleaned up, and brought before the most powerful man in the world. He interpreted the dream, proposed a plan, and in a single day went from prisoner to second-in-command of Egypt. The famine came. And the brothers who sold him? They came to Egypt begging for food — bowing before the brother they betrayed." },
        { title:"Why This Matters to You", text:"If you're in a pit right now — betrayed, forgotten, punished for doing the right thing — Joseph's story doesn't promise it'll be easy. It promises it won't be wasted. Every setback positioned him for the next step. The pit taught him survival. Slavery taught him leadership. Prison taught him patience. And the throne? That was just where all the lessons landed. Your worst chapter is not your final chapter. And the people who counted you out may need you before this is over." },
      ]
    },
    {
      id:"job", title:"Job's Suffering", icon:"🌪️", tag:"When Everything Falls Apart",
      color:"#6A8A9A",
      summary:"The richest man in the land lost everything in a single day — his wealth, his children, his health. His wife told him to curse God and die. His friends told him it must be his fault. And God was silent. Job's story is the Bible's most honest conversation about pain that doesn't make sense.",
      chapters:[
        { title:"The Life Before", text:"Job had it all. A massive family, enormous wealth, and a reputation for being the most righteous man alive. He wasn't just blessed — he was careful with his blessings. He prayed for his children just in case they sinned. He gave generously. He feared God. By every human metric, Job had earned his good life. That's what makes what comes next so devastating." },
        { title:"The Day", text:"In a single day: raiders stole his livestock. Fire fell from the sky and killed his servants. A windstorm collapsed the house where all ten of his children were eating together. All of them died. Job tore his robe, shaved his head, fell to the ground — and worshipped. 'The Lord gives, and the Lord takes away.' That wasn't denial. That was a man choosing where to put his weight when the floor disappeared." },
        { title:"The Silence", text:"Then his health went. Painful sores covered his body. His wife said, 'Are you still holding on to your integrity? Curse God and die.' Three friends came to sit with him. For seven days, no one spoke. That was the most helpful thing they did — because when they finally opened their mouths, they told Job his suffering must be punishment. The people who are supposed to comfort you will sometimes make it worse." },
        { title:"The Conversation", text:"Job didn't curse God, but he didn't stay quiet either. He demanded an audience. He asked why. He argued his case. And when God finally answered, He didn't explain the suffering. He asked Job 77 questions about the universe — questions no human can answer. It wasn't cruelty. It was perspective. 'Were you there when I laid the earth's foundations?' God didn't owe Job an explanation. But He showed up. That was the answer." },
        { title:"Why This Matters to You", text:"Some pain has a reason. Some doesn't. Job's story gives you permission to hurt, to question, to sit in the ashes and not understand. But it also shows that suffering doesn't disqualify you from God's presence — it can bring you closer to it. Job said something at the end that changes everything: 'Before, I had heard of You. Now, I have seen You.' Sometimes the deepest pain cracks you open enough to see what comfort never could. You're not being punished. You're being forged." },
      ]
    },
    {
      id:"paul", title:"Paul's Transformation", icon:"⚡", tag:"From Destroyer to Builder",
      color:"#9E6CC8",
      summary:"He held the coats while they stoned Stephen. He went door to door dragging believers to prison. He was the most dangerous enemy the early church had. Then a light knocked him off his horse, and the man who destroyed the church became the one who built it across the known world.",
      chapters:[
        { title:"The Zealot", text:"Saul of Tarsus was brilliant, educated, and ruthless. He didn't just disagree with followers of Jesus — he hunted them. He was present at the first Christian martyrdom, approving as a young man named Stephen was stoned to death. Then he requested official letters authorizing him to arrest believers in Damascus. He wasn't conflicted. He was convinced he was doing God's work." },
        { title:"The Road", text:"On the road to Damascus, a light from heaven blinded him. He fell to the ground and heard a voice: 'Saul, why are you persecuting Me?' Not 'why are you persecuting my followers.' Me. Jesus took it personally. Saul was blind for three days. No food, no water. The man who saw everything so clearly couldn't see anything at all. Sometimes God has to shut your eyes before He can open them." },
        { title:"The New Man", text:"A believer named Ananias was told to go help Saul. His response was essentially: 'Lord, are you sure? This is the guy who's been arresting us.' God said go. Ananias laid hands on Saul, his sight returned, and he was baptized. He started preaching in the same synagogues where he once arrested people. The transformation was so dramatic that people didn't believe it. They thought it was a trap." },
        { title:"The Builder", text:"Paul — his new name for his new life — traveled the ancient world planting churches, writing letters, getting beaten, shipwrecked, imprisoned, and stoned. He wrote nearly half the New Testament from prison cells and borrowed rooms. The man who tried to destroy Christianity became its greatest architect. His letters to struggling churches are still read by billions of people two thousand years later." },
        { title:"Why This Matters to You", text:"Paul's story destroys the idea that you're too far gone. If the man who murdered Christians can become the apostle Paul, then your past doesn't disqualify you from your future. But there's a harder lesson too: transformation costs something. Paul lost his status, his friends, his safety, his comfort. He gained purpose. Real change isn't a personality upgrade — it's a death and resurrection. The person you were has to go so the person you're becoming has room to breathe. You are not your worst decision. You are not your darkest season. You are what God sees when He looks past all of that." },
      ]
    },
    {
      id:"moses", title:"Moses & the Exodus", icon:"◈", tag:"Called While Unqualified",
      color:"#54B868",
      summary:"A murderer hiding in the desert for 40 years. A man with a speech impediment asked to speak to the most powerful ruler on earth. Moses didn't feel ready, didn't feel worthy, and argued with God about it. Then he led two million people to freedom.",
      chapters:[
        { title:"The First Life", text:"Moses was born under a death sentence — Pharaoh ordered all Hebrew baby boys killed. His mother hid him in a basket on the Nile. Pharaoh's own daughter found him and raised him as Egyptian royalty. For 40 years, Moses lived in the palace. He had the education, the privilege, the power. Then one day he saw an Egyptian beating a Hebrew slave. He killed the Egyptian and buried him in the sand. One act of anger ended his entire first life." },
        { title:"The Desert", text:"Moses ran. He spent the next 40 years as a shepherd in the middle of nowhere. The man raised in a palace was now herding sheep in the desert. No status, no plan, no purpose. He married, had children, and probably assumed his story was over. Eighty years old, and all he had to show for it was a staff and a flock. But God does His most important work in the seasons that feel like nothing is happening." },
        { title:"The Bush", text:"A bush on fire that didn't burn. Moses walked toward it and heard his name. God told him to go back to Egypt and tell Pharaoh to release two million slaves. Moses immediately gave five excuses: Who am I? What if they don't believe me? I can't speak well. Send someone else. Please, anyone else. God didn't argue with the excuses. He just said: I'll be with you. That's the only qualification that matters." },
        { title:"The Sea", text:"Ten plagues. A nation freed. But then Pharaoh changed his mind and sent his army. The Israelites stood trapped between the Red Sea and the most powerful military force in the world. Moses stretched out his staff and the sea split. Two walls of water, dry ground in between. Two million people walked through on foot. Then the water closed on the army behind them. The impossible became a path." },
        { title:"Why This Matters to You", text:"Moses spent 40 years thinking his purpose was behind him. He had a criminal past, a speech impediment, and zero confidence. God chose him anyway. Not despite his brokenness — through it. The years in the desert weren't wasted. They were preparation. Every excuse you're making right now about why you can't do what you feel called to do — Moses made the same ones. God's response hasn't changed: I didn't ask if you were qualified. I said I would be with you. Stop waiting to feel ready. Ready is a feeling. Obedience is a choice." },
      ]
    },
    {
      id:"ruth", title:"Ruth's Loyalty", icon:"🌾", tag:"Faithfulness in the Unknown",
      color:"#C4A96A",
      summary:"A foreign widow with nothing — no husband, no home, no future. She could have gone back to what was familiar. Instead she chose loyalty over comfort and followed her mother-in-law into an unknown land. That choice changed the bloodline of kings.",
      chapters:[
        { title:"The Loss", text:"Ruth married into an Israelite family living in Moab. Then her husband died. Then her father-in-law died. Then her brother-in-law died. Three women — Naomi and her two daughters-in-law — left with nothing. No income, no protection, no standing. In the ancient world, a widow with no sons was as vulnerable as a person could be. Naomi decided to return to Israel and told both young women to go home to their own families. It was the practical thing to do." },
        { title:"The Choice", text:"One daughter-in-law kissed Naomi goodbye and left. Ruth refused. 'Where you go, I will go. Where you stay, I will stay. Your people will be my people, and your God will be my God.' She wasn't making a religious statement. She was making a commitment. Ruth chose uncertainty with someone she loved over security without them. That's the kind of loyalty that rewrites a story." },
        { title:"The Field", text:"In Israel, Ruth was a foreigner with no rights. She went to the fields to pick up leftover grain behind the harvesters — the lowest work available. She didn't complain. She didn't wait for rescue. She showed up and did what was in front of her. The field she ended up in belonged to a wealthy man named Boaz. Coincidence? Ruth would call it providence." },
        { title:"The Redemption", text:"Boaz noticed her. Not because she was trying to be noticed, but because her reputation preceded her — her loyalty to Naomi, her work ethic, her character. In a culture where women were valued for connections and dowries, Ruth had neither. She had integrity. Boaz redeemed her — married her, restored her, gave her a home and a future. Their great-grandson was King David." },
        { title:"Why This Matters to You", text:"Ruth's story is for anyone starting over with nothing. No connections, no advantages, no clear path. She teaches that loyalty and character are currencies that never lose value. You don't need the right resume or the right last name. You need the willingness to show up and do the unglamorous work in front of you — even when no one's watching. Because someone always is. Your next chapter doesn't start when everything lines up. It starts when you decide to keep going anyway." },
      ]
    },
    {
      id:"elijah", title:"Elijah's Burnout", icon:"🔥", tag:"When Strength Runs Out",
      color:"#E88854",
      summary:"He called fire from heaven. He outran a chariot. He defeated 450 false prophets in a single afternoon. Then he collapsed under a tree and asked God to let him die. The strongest person in the room finally broke.",
      chapters:[
        { title:"The Mountain", text:"Mount Carmel. Elijah stood alone against 450 prophets of Baal. He challenged them to call fire from heaven. They screamed, danced, and cut themselves for hours. Nothing happened. Then Elijah soaked his altar in water — three times — and prayed one quiet prayer. Fire fell from heaven and consumed everything. The altar, the stones, the water, the ground. It wasn't even close. This was the greatest spiritual victory in Israelite history." },
        { title:"The Crash", text:"Then Queen Jezebel sent a message: 'By this time tomorrow, you'll be dead like those prophets.' One woman's threat undid what a mountain of fire couldn't. Elijah ran. Not toward the battle — away from it. He ran into the desert, collapsed under a broom tree, and said: 'I've had enough, Lord. Take my life.' The man who just called fire from heaven wanted to die. Victory and burnout can live in the same week." },
        { title:"The Care", text:"God didn't lecture him. Didn't quote scripture at him. Didn't tell him to toughen up. An angel touched him and said: 'Get up and eat.' There was fresh bread and water beside him. Elijah ate, then collapsed again. The angel came back a second time with more food. God's first response to Elijah's breakdown wasn't a sermon. It was a meal and rest. Sometimes the most spiritual thing you can do is sleep." },
        { title:"The Whisper", text:"God sent Elijah to a mountain. A violent wind came — God was not in the wind. An earthquake — God was not in the earthquake. A fire — God was not in the fire. Then came a gentle whisper. And that's where God was. The same God who answered with fire on Carmel now spoke in a whisper on Horeb. He meets you where you are, not where you think you should be." },
        { title:"Why This Matters to You", text:"If you've ever poured everything out for something important and then felt completely empty afterward, Elijah gets it. Burnout isn't weakness. It's the cost of fighting hard. God's response to Elijah teaches something the world won't: you don't need to perform your way back to health. You need food, rest, and a quiet voice reminding you that you're not alone. You haven't failed because you're tired. You're tired because you gave everything you had. Let someone take care of you for a minute." },
      ]
    },
    {
      id:"daniel", title:"Daniel in Babylon", icon:"🦁", tag:"Integrity Under Pressure",
      color:"#5488E8",
      summary:"Kidnapped as a teenager. Forced into a foreign empire's service. Pressured to abandon everything he believed. Daniel never raised his voice, never started a rebellion. He just quietly refused to compromise — and outlasted every king who tried to break him.",
      chapters:[
        { title:"The Captive", text:"Daniel was probably fifteen when Babylon's army destroyed Jerusalem and took him prisoner. He was selected for an elite program — handpicked to be re-educated, renamed, and remade into a Babylonian. They changed his name, his diet, his language. The goal was to erase his identity. Daniel's first act of resistance wasn't dramatic. He simply asked if he could keep eating according to his faith. A small boundary. But it was his." },
        { title:"The Rise", text:"Daniel was brilliant. He interpreted dreams no one else could. He saw patterns others missed. He rose through the ranks of a foreign government — not by compromising, but by being so good they couldn't ignore him. Three different empires rose and fell during his lifetime. Daniel served in all of them. He never held a weapon. His integrity was his power." },
        { title:"The Law", text:"Daniel's enemies couldn't find any corruption in him. So they created a trap: a law that made it illegal to pray to anyone except the king for thirty days. Daniel knew about the law. He went home, opened his window toward Jerusalem — the same way he always did — and prayed three times that day. He didn't hide. He didn't protest. He just kept being who he was." },
        { title:"The Lions", text:"They threw him in a pit of lions. The king — who actually liked Daniel — couldn't sleep all night. At dawn he ran to the pit and called out. Daniel answered: 'My God sent His angel and shut the mouths of the lions.' He walked out without a scratch. The men who accused him were thrown in next. They didn't walk out." },
        { title:"Why This Matters to You", text:"Daniel's story isn't about being loud. It's about being consistent. He never preached at anyone. He never led a protest. He just refused to become someone he wasn't, no matter who was watching or what it cost. In a world that constantly pressures you to blend in, water yourself down, or abandon what you believe to keep the peace — Daniel is proof that quiet integrity has more power than any argument. You don't have to fight everyone. You just have to stay who you are." },
      ]
    },
    {
      id:"peter", title:"Peter's Failure", icon:"🪨", tag:"Falling and Getting Back Up",
      color:"#6A8A9A",
      summary:"He swore he'd die for Jesus. Hours later he denied knowing Him three times. Peter's story isn't about being strong — it's about what happens after you fail the person who matters most, and they still choose you.",
      chapters:[
        { title:"The Promise", text:"The night before Jesus was arrested, Peter made a bold declaration: 'Even if everyone else falls away, I never will. I'd die with you.' He meant it. Every word. Peter wasn't lying — he was overestimating himself. And Jesus looked at him and said: 'Before the rooster crows, you will deny me three times.' Peter couldn't imagine it. That's the thing about the failures that wreck you most — you never see them coming." },
        { title:"The Night", text:"Jesus was arrested. Peter followed at a distance — close enough to watch, far enough to stay safe. Then a servant girl pointed at him: 'You were with Him.' Peter denied it. Another person said the same. He denied it again, harder. A third time — and Peter swore with an oath: 'I don't know the man.' Then the rooster crowed. Luke's gospel adds one detail that destroys: Jesus turned and looked at Peter. Not with anger. Just a look. Peter went outside and wept." },
        { title:"The Silence", text:"For three days after the crucifixion, Peter carried that weight. The last thing he'd done was deny the person he loved most. And now that person was dead. No chance to apologize, no chance to explain. Just silence and the memory of a rooster. Anyone who's ever hurt someone and lost the chance to make it right knows exactly where Peter was standing." },
        { title:"The Beach", text:"After the resurrection, Peter went back to fishing — back to who he was before Jesus called him. Then Jesus showed up on the beach, cooked breakfast, and asked Peter one question three times: 'Do you love me?' Three denials. Three chances to answer. Jesus didn't bring up the failure. He didn't make Peter grovel. He restored him with the same number of chances as the wounds. Then He said: 'Feed my sheep.' Your calling survives your worst night." },
        { title:"Why This Matters to You", text:"Peter teaches the hardest lesson in faith: your biggest failure is not your final identity. He denied Jesus to a servant girl — and later preached to thousands. The same mouth that said 'I don't know Him' said 'He is the Christ.' If you're carrying the weight of a moment you can't take back — a betrayal, a denial, a choice that broke something important — Peter's story says you're not disqualified. You're being rebuilt. God doesn't use perfect people. He uses people who got back up." },
      ]
    },
    {
      id:"esther", title:"Esther's Courage", icon:"👑", tag:"Purpose in an Impossible Position",
      color:"#9E6CC8",
      summary:"An orphan girl who became queen of an empire she didn't choose. When her people faced annihilation, she had to decide: stay safe and stay silent, or risk everything to speak up. Esther proves that sometimes you're exactly where you are for exactly this moment.",
      chapters:[
        { title:"The Orphan", text:"Esther was a Jewish girl raised by her cousin Mordecai after her parents died. She was nobody — no status, no power, no connections. Then the king of Persia held a kingdom-wide search for a new queen. Esther was taken into the palace. She didn't choose this. She didn't campaign for it. She was a young woman swept into a system that treated women as property. But she adapted. She observed. She was wise beyond what her circumstances should have allowed." },
        { title:"The Crown", text:"The king chose Esther. She became queen of the most powerful empire on earth. But she hid her Jewish identity — Mordecai told her to. She lived in luxury with a secret that could end her. For years, she navigated the palace, learned its politics, earned trust. She wasn't passive. She was positioning — even if she didn't know what for yet." },
        { title:"The Plot", text:"A man named Haman — the king's right hand — hated Mordecai and convinced the king to sign a decree to kill every Jewish person in the empire. Men, women, children. A date was set. Mordecai sent word to Esther: you have to go to the king and beg for our people. But there was a problem — anyone who approached the king without being summoned could be executed. Even the queen." },
        { title:"The Decision", text:"Mordecai's words cut through her fear: 'Who knows whether you have come to the kingdom for such a time as this?' Esther fasted for three days. Then she put on her royal robes and walked into the throne room uninvited. The king extended his scepter — she would live. She didn't blurt out her request. She invited the king to dinner. Then another dinner. She was strategic. When she finally revealed the plot, she also revealed herself: 'I am Jewish. That decree is a death sentence for me and my people.'" },
        { title:"Why This Matters to You", text:"Esther didn't have power — she had position. And she used it at the moment it mattered most, knowing it could cost her everything. Her story asks you a question: what are you positioned for right now that you've been too afraid to step into? Maybe you're in a job, a family, a community, a conversation where your voice is the one that's needed — and silence feels safer than speaking. Esther proves that courage isn't about being fearless. It's about deciding that what you're protecting is worth more than what you're risking. For such a time as this." },
      ]
    },
    {
      id:"nehemiah", title:"Nehemiah's Rebuild", icon:"🧱", tag:"Building While They Mock You",
      color:"#54B868",
      summary:"Jerusalem's walls were rubble. The people were scattered and ashamed. Nehemiah wasn't a builder — he was a cupbearer. But he wept over the ruins, got permission from a king, and rebuilt the walls in 52 days while enemies mocked him from every side.",
      chapters:[
        { title:"The News", text:"Nehemiah was living comfortably in Persia, serving as cupbearer to the king — a trusted, high-ranking position. Then his brother brought news from Jerusalem: the walls were destroyed, the gates burned, the people in disgrace. Nehemiah sat down and wept. Then he fasted. Then he prayed. Most people hear bad news and feel sad for a moment. Nehemiah let it break his heart until it changed his direction." },
        { title:"The Ask", text:"Months later, the king noticed Nehemiah's sadness and asked what was wrong. Nehemiah was terrified — showing sadness before a king could be dangerous. But he told the truth. Then he made the boldest ask of his life: send me to Jerusalem to rebuild the walls. Give me letters of safe passage. Give me timber. The king said yes to all of it. The door you're afraid to knock on might already be unlocked." },
        { title:"The Opposition", text:"The moment Nehemiah arrived, enemies appeared. Sanballat mocked: 'What are you doing? Even a fox could break down that wall.' Tobiah laughed. Others plotted attacks. Nehemiah's response: he gave his workers a tool for one hand and a weapon for the other. They built with swords on their hips. Every meaningful thing you build will attract people who want to tear it down. Build anyway." },
        { title:"The Wall", text:"52 days. That's how long it took to rebuild walls that had been rubble for decades. Workers labored day and night. Families took sections. Priests picked up stones. People who had never built anything in their lives became builders because the mission mattered more than their experience. When the wall was finished, even the enemies recognized that this work had been done with the help of God." },
        { title:"Why This Matters to You", text:"Nehemiah wasn't qualified to build a wall. He poured wine for a living. But he had three things: a burden that wouldn't go away, the courage to ask for help, and the discipline to keep building when people laughed. If there's something broken in your life — a relationship, a dream, a community, your own foundation — Nehemiah says you don't need a degree in construction. You need a broken heart that refuses to stay broken. Pick up a stone. Start with the section in front of you. Let the mockers talk. The wall will speak for itself." },
      ]
    },
    {
      id:"hagar", title:"Hagar in the Wilderness", icon:"🏜️", tag:"Seen by God When Invisible to the World",
      color:"#C4A96A",
      summary:"Enslaved, used, and cast out — Hagar is the first person in Scripture to give God a name. She called Him El Roi: the God who sees me. This story is for anyone who has ever felt disposable, overlooked, or abandoned by the people who were supposed to protect them.",
      chapters:[
        { title:"Used and Unnamed", text:"Hagar didn't choose her story. She was handed to Abraham by Sarah — her body, her future, her autonomy given away for someone else's plan. She wasn't asked. She wasn't considered. She was a solution to someone else's problem. This chapter sits with that pain. The pain of being treated as a means to an end. Of having your identity reduced to what you can do for other people. Maybe you know what it feels like to exist in someone else's story as a side character — useful when needed, invisible when not. Where has your story been written by someone else's hand?" },
        { title:"Running Into the Desert", text:"When the situation became unbearable, Hagar ran. And the text doesn't condemn her for it. She didn't have a plan. She didn't have a destination. She just couldn't stay. Sometimes the desert — with all its emptiness and uncertainty — is still safer than the house you left. This chapter validates the instinct to leave when staying means losing yourself. Running isn't always weakness. Sometimes it's the first act of self-preservation you've allowed yourself in years. What are you running from? And is the running protecting you or prolonging the pain?" },
        { title:"Found by a Spring", text:"An angel found Hagar by a spring in the desert and asked the most tender question: 'Where have you come from, and where are you going?' Not a lecture. Not a correction. Not 'go back and try harder.' Just presence and honest curiosity. God met her in the in-between — after the old life but before the new one. That middle space is terrifying. You've left but you haven't arrived. You're free but you're lost. And right there, in the most uncertain moment of her life, God showed up. Not with answers. With attention." },
        { title:"El Roi — The God Who Sees", text:"Hagar did something no one else in Scripture had ever done. She named God. A woman with no power, no status, no voice in that society looked at the Creator and said: 'You are the God who sees me.' Not the God who fixes me. Not the God who explains things. The God who sees. There is a kind of healing that happens when someone truly sees you — not your performance, not your usefulness, not the version of you that keeps the peace. Just you. The real, exhausted, uncertain you. And God saw Hagar before anyone else thought to look." },
        { title:"Why This Matters to You", text:"Hagar's story ends with a promise: her son would become a great nation. The woman who was discarded became the mother of a lineage. Her story didn't end where they left her. And neither does yours. The people who used you don't get to write your final chapter. The people who overlooked you don't get to define your worth. If you've been feeling invisible — in your family, your workplace, your relationships, your faith — Hagar's God is still the same. He is El Roi. The God who sees you. Not the polished version. Not the performing version. The real one. The one sitting by a spring in the desert wondering if anyone will ever notice. He already has." },
      ]
    },
    {
      id:"woman-well", title:"The Woman at the Well", icon:"💧", tag:"Fully Known and Fully Loved",
      color:"#5488E8",
      summary:"She came to the well at noon — the hottest hour — to avoid the stares and whispers. And there, a stranger asked her for a drink and then told her everything she'd ever done. Not to shame her. To free her. This story is for anyone hiding parts of themselves convinced that if people really knew them, they'd leave.",
      chapters:[
        { title:"The Noon Hour", text:"The other women came to the well in the morning when it was cool. She came at noon. Alone. In the heat. Because shame had quietly rewritten her daily life. She'd rearranged everything to avoid being known — her schedule, her route, her relationships. That's what shame does. It doesn't always look like hiding in a dark room. Sometimes it looks like a perfectly organized life designed so no one gets close enough to see the truth. What parts of your life have you rearranged to avoid being known?" },
        { title:"An Unexpected Conversation", text:"Jesus shouldn't have been talking to her. Wrong gender, wrong ethnicity, wrong reputation — three walls that culture had built between them. He walked through all of them with a single sentence: 'Give me a drink.' That's how He works. Not a sermon. Not a lecture. A simple, human request that said: I see you, and I'm not leaving. This chapter is about the walls we build and what it feels like when someone crosses them — not with force, but with kindness. Who has been trying to reach you lately that you haven't let in?" },
        { title:"The Thirst Beneath the Thirst", text:"She kept coming back to this well. Day after day. And she was still thirsty. Jesus offered water that would satisfy permanently — living water. She wanted it. 'Give me this water so I don't have to keep coming back here.' But He wasn't talking about the well. He was talking about the pattern. The relationships, the habits, the things she kept returning to hoping this time they'd fill the emptiness. They never did. What well do you keep returning to that never satisfies? What is the real thirst underneath?" },
        { title:"Everything She Ever Did", text:"'You have had five husbands, and the one you have now is not your husband.' Jesus named her whole story. Gently. Without flinching. Without weaponizing it. He didn't use her past as a reason to walk away — He used it as a doorway to deeper truth. This is the moment most people run from: being fully known. We spend enormous energy managing how much of ourselves we let people see. But Jesus already knew, and He was still sitting there. Still talking. Still offering living water. What would it feel like to stop managing the narrative?" },
        { title:"Why This Matters to You", text:"Here's the part that changes everything: she left her water jar at the well and ran to tell the whole town. The same town she'd been hiding from. 'Come see a man who told me everything I ever did.' She didn't clean up her story first. She didn't wait until she had it together. She went public with the exact truth she'd been hiding from, because shame loses its power the moment you stop carrying it. Your secret isn't as heavy as you think. It's the hiding that's exhausting. What would you do differently tomorrow if shame no longer decided your schedule?" },
      ]
    },
    {
      id:"gideon", title:"Gideon's Calling", icon:"🏺", tag:"Purpose in the Unqualified",
      color:"#E88854",
      summary:"An angel called him 'mighty warrior' while he was hiding in a winepress, threshing wheat in secret because he was too afraid to do it in the open. Gideon's story is for anyone who hears a calling but can't reconcile it with how small they feel inside.",
      chapters:[
        { title:"Hiding in the Winepress", text:"Gideon wasn't on a battlefield. He was in a hole. Threshing wheat in a winepress — a hidden, cramped space — because he was terrified the Midianites would see him. And that's where the angel of the Lord appeared and said: 'The Lord is with you, mighty warrior.' Not future tense. Not 'you could be.' Mighty warrior — present tense. God named what Gideon couldn't see in himself. The gap between who God says you are and who you believe you are is where most of us live. What are you doing in hiding that you were meant to do in the open?" },
        { title:"The List of Reasons", text:"Gideon's first response was a list of disqualifications. My tribe is the weakest. I am the youngest. My family is nothing. He had rehearsed his inadequacy so many times it sounded like fact. And God didn't argue with the list. He just said: 'I will be with you.' That's it. No résumé review. No aptitude test. Just presence. This chapter confronts the inner script that keeps you from stepping forward — the one that starts with 'but I'm not...' Write down the sentences you carry. Then ask yourself: who told you those were true?" },
        { title:"The Fleece", text:"Gideon asked God for sign after sign. Wet fleece on dry ground. Then dry fleece on wet ground. He needed proof. And God gave it — patiently, without irritation. This chapter doesn't shame doubt. It honors the tension of wanting to trust God but needing something to hold onto. Faith isn't the absence of questions. It's moving forward while the questions are still unanswered. But there's a line between seeking confirmation and avoiding obedience. What would 'enough confirmation' look like for you — and have you already passed it?" },
        { title:"The Thinning", text:"God told Gideon his army was too big. Too big. He cut it from 32,000 to 10,000. Then to 300. God systematically removed every safety net, every backup plan, every logical reason for confidence. This is the part that terrifies: when God strips away the things you thought you needed before He moves. It's not punishment. It's positioning. Because if 32,000 won, Gideon would credit the army. With 300, there's only one explanation. What has God been removing from your life that you've been fighting to keep?" },
        { title:"Why This Matters to You", text:"The 300 won the battle with trumpets, torches, and clay jars. The jars had to break for the light to shine. Read that again. The jars had to break for the light to shine. Your brokenness isn't a disqualification — it's the design. The cracks in your confidence, your past, your self-image — those aren't flaws to fix. They're openings for something bigger to come through. Gideon started the story hiding in a hole and ended it leading a nation to freedom. Not because he stopped being afraid. Because he obeyed while afraid. God isn't waiting for you to feel mighty. He already called you a warrior." },
      ]
    },
    {
      id:"hannah", title:"Hannah's Prayer", icon:"🕯️", tag:"Pouring Out the Soul",
      color:"#9E6CC8",
      summary:"She wanted a child with everything in her. Year after year, nothing. Mocked by the woman who had what she wanted. Misread by her own priest. Hannah's story is for anyone carrying a longing so deep it has become grief — and who has been told to just be grateful for what they have.",
      chapters:[
        { title:"The Ache That Won't Quiet", text:"Everyone had an opinion about Hannah's pain. Her husband Elkanah asked: 'Am I not enough for you? Why are you so sad?' As if love could substitute for longing. As if one blessing should cancel out another ache. Peninnah — the other wife, the one with children — provoked her deliberately. Year after year. The text says Hannah wept and would not eat. This chapter validates the desire that won't be rationalized away. What longing have you been told to stop wanting? What does it cost you to pretend it doesn't matter?" },
        { title:"Provoked to Tears", text:"Peninnah didn't just exist alongside Hannah — she targeted her. 'Provoked her severely, to irritate her.' And this happened in their own home. The wound wasn't from an enemy — it was from someone who ate at the same table, worshipped at the same altar, lived under the same roof. The deepest cuts come from people who are supposed to be safe. Whose voice has become the soundtrack to your pain? When did their words start sounding like truth?" },
        { title:"Pouring Out the Soul", text:"Hannah went to the temple and prayed unlike any prayer in Scripture. She wept bitterly. Her lips moved but no sound came out. She was 'pouring out her soul before the Lord.' Not reciting. Not performing. Not using the right words in the right order. Just the raw, unfiltered contents of her heart spilling onto the floor of the temple. This is what prayer can look like when you stop editing it. Not a request. Not a gratitude list. Just the truth. When was the last time you prayed without a script?" },
        { title:"Misread by the Religious", text:"Eli the priest watched Hannah's lips move and assumed she was drunk. The spiritual authority in the room looked at the most sincere prayer being offered that day and completely misread it. He rebuked her. The man of God failed to recognize the woman of faith. This chapter addresses a specific wound: being dismissed by people in spiritual authority. When the pastor, the mentor, the leader who should see your sincerity sees only your mess. Has someone in spiritual authority ever dismissed your pain? How did it shape your relationship with faith?" },
        { title:"Why This Matters to You", text:"Hannah's prayer was answered. She had a son — Samuel — who became one of the greatest prophets in Israel's history. And then she did something extraordinary: she gave him back. She brought Samuel to the temple and released him to God. Her song of praise in that moment rivals anything in the Psalms. Hannah teaches the hardest kind of faith: holding your deepest desire with open hands. Not letting go of it. Letting go of your grip on it. You're allowed to want what you want with everything in you. You're allowed to weep about it, ache for it, pour your soul out over it. Just don't let the wanting become a fist. The open hand is where God places things." },
      ]
    },
    {
      id:"lazarus", title:"The Raising of Lazarus", icon:"🪨", tag:"When God Is Silent",
      color:"#6A8A9A",
      summary:"Jesus heard that His close friend Lazarus was sick. And He deliberately stayed where He was for two more days. By the time He arrived, Lazarus had been dead for four. This story is for anyone in the gap between 'I asked' and 'He answered' — wondering if God heard at all.",
      chapters:[
        { title:"The One You Love Is Sick", text:"Mary and Martha sent Jesus a simple, desperate message: 'Lord, the one You love is sick.' Not a theological argument. Not a formal petition. Just: someone You love is suffering. Come. And Jesus — who healed strangers, who touched lepers, who stopped for blind men on the roadside — heard this message about His close friend and stayed where He was. For two days. This chapter sits with the silence. The unanswered text. The prayer that hits the ceiling. What prayer have you been whispering that heaven seems to be ignoring?" },
        { title:"The Intentional Delay", text:"The text says something that should stop you: 'Jesus loved Martha and her sister and Lazarus. So when He heard that Lazarus was sick, He stayed two more days.' The word 'so' is doing heavy lifting. He loved them — so He waited. Not despite His love. Because of it. This chapter doesn't offer easy answers about God's timing. It wrestles with the raw tension of a God who loves you and a God who waits. What do you do with a God who is never late but rarely early?" },
        { title:"If You Had Been Here", text:"When Jesus finally arrived, Lazarus had been dead four days. Martha met Him on the road. Mary stayed in the house. And both of them — separately — said the exact same words: 'Lord, if You had been here, my brother would not have died.' Not anger. Not rebellion. Just the ache of disappointed faith. This chapter gives you permission to say that to God. If You had been here. If You had shown up when I called. You could have prevented this, and You didn't. What is your 'if You had been here' moment?" },
        { title:"Jesus Wept", text:"The shortest verse in the Bible carries the most weight. Jesus — who knew He was about to raise Lazarus from the dead — stood at that grave and cried. He didn't weep because He was powerless. He wept because He saw their pain. He wept because grief is real even when resurrection is coming. This reveals a God who doesn't fast-forward through your suffering on the way to the miracle. He stops. He stays. He cries with you. Can you let God sit in your sadness without rushing to the resolution?" },
        { title:"Why This Matters to You", text:"'Lazarus, come out.' And the dead man walked out — still wrapped in grave clothes. Jesus told the people around him: 'Unbind him and let him go.' The miracle wasn't just coming back to life. It was removing the wrappings of death. Some of you are alive again — the crisis passed, the prayer was answered, the season shifted — but you're still wearing grave clothes. Still wrapped in the fear, the grief, the survival patterns from the tomb. Resurrection isn't complete until the wrappings come off. What grave clothes are you still wearing? What needs to be unwound for you to walk free?" },
      ]
    },
    {
      id:"mary-martha", title:"Mary & Martha", icon:"🏡", tag:"Worth Beyond Performance",
      color:"#54B868",
      summary:"Martha was doing everything right — hosting, serving, running the house. Mary was sitting at Jesus' feet doing nothing visible. When Martha complained, Jesus said Mary chose the better thing. This story isn't about laziness vs. hustle. It's about the exhausting belief that your worth lives in what you produce.",
      chapters:[
        { title:"The Open Door", text:"Martha opened her home to Jesus. It was generous. It was brave. Hospitality in that culture was serious — it reflected your entire household's honor. She was doing the right thing. But somewhere between the invitation and the serving, something shifted. Generosity became obligation. Worship became work. The thing she chose to do became the thing she had to do. This chapter explores how good things become heavy things when they get tangled up with identity. What generous impulse in your life has quietly become a burden you can't put down?" },
        { title:"Distracted by Many Things", text:"Jesus said Martha was 'distracted by many things.' Not bad things. Not sinful things. Just many things. The dishes, the food, the arrangements, the hosting. All good. All necessary. All pulling her away from the one thing that mattered most in that moment — the person sitting in her living room. This chapter asks a harder question than 'are you too busy?' It asks: what are you avoiding by staying busy? What surfaces when the to-do list is empty and the house goes quiet?" },
        { title:"Don't You Care?", text:"Martha's frustration boiled over: 'Lord, don't You care that my sister has left me to do all the work alone? Tell her to help me.' Listen to what she's really saying. I'm doing everything. No one sees it. No one helps. Don't You care that I'm drowning? This chapter gets honest about the resentment that builds when you perform without being acknowledged. When you carry the weight and everyone else seems unbothered. Who are you really angry at — the people around you, or yourself for not knowing how to stop?" },
        { title:"The Better Part", text:"Mary sat at Jesus' feet. In that culture, this was the posture of a disciple — a student. Women didn't do this. It was radical. And she chose it over the kitchen, over the expectations, over the pressure to be useful. Jesus called it 'the better part.' Not the only part. The better part. This chapter reframes 'doing nothing' as one of the most courageous things you can do. Because choosing presence over productivity in a world that measures you by output is an act of defiance. What would it look like to choose presence today — not as laziness, but as trust?" },
        { title:"Why This Matters to You", text:"This story isn't about picking sides between Martha and Mary. It's about finding both of them inside yourself and letting them make peace. Martha's instinct to serve is beautiful. Mary's instinct to be present is essential. The problem isn't serving — it's serving from emptiness. It's giving from a place that has nothing left. It's producing so you can earn the love that was already freely given. What would your life look like if you served from overflow instead of obligation? If you stopped trying to earn a seat at the table you were already invited to? You don't have to do more to be enough. You already are." },
      ]
    },
    {
      id:"paul-thorn", title:"Paul's Thorn", icon:"🌿", tag:"Sufficient Grace",
      color:"#E85454",
      summary:"He asked God three times to remove it. God said no. Then God said something Paul never expected: 'My grace is sufficient for you, for My power is made perfect in weakness.' This story is for anyone who has prayed for deliverance and received endurance instead.",
      chapters:[
        { title:"The Thorn You Can't Name", text:"Paul never told us what his thorn was. A physical ailment. A relational wound. A spiritual attack. A weakness he couldn't shake. Scholars have debated it for centuries, and maybe that's the point — because if he'd named it, only people with that specific struggle would relate. By leaving it unnamed, every person who reads it sees their own thorn. The thing you've prayed about a hundred times that hasn't changed. The struggle that follows you from season to season. What is yours? Not the version you tell people. The real one. The one that keeps you up at night." },
        { title:"Three Times", text:"Paul — the apostle, the church planter, the man who saw the third heaven and wrote nearly half the New Testament — asked God to take it away. Three times. And three times, the answer was no. This chapter honors the experience of persistent, faithful prayer that seems to change nothing. It doesn't try to explain why. It doesn't offer five reasons God says no. It just sits with the weight of asking the God who can do anything and hearing: not this time. What does your relationship with God look like when your most desperate prayer goes unanswered?" },
        { title:"Sufficient Grace", text:"God didn't explain the thorn. Didn't remove it. Didn't promise it would go away eventually. He offered Himself: 'My grace is sufficient for you.' Not a solution. A presence. This is the provision that doesn't look like provision. Grace that sustains you through the pain rather than subtracting the pain. It's not what Paul asked for. It's what God gave. And the question this chapter asks is the hardest one: Can grace be enough for you? Not as a theological concept you agree with on Sunday — but as a lived, daily, Monday-morning experience?" },
        { title:"Power in Weakness", text:"Everything in us wants to be strong. Capable. Self-sufficient. God says: 'My power is made perfect in weakness.' Not 'made visible in strength.' Perfect in weakness. This chapter flips every script culture has written about what it means to be powerful. The places where you feel most fragile, most inadequate, most exposed — those might be the exact places where God's strength becomes most visible. Not because weakness is fun or noble. Because when you have nothing left, there's finally room for something bigger than you." },
        { title:"Why This Matters to You", text:"Paul landed somewhere most of us haven't reached: 'When I am weak, then I am strong.' He didn't just tolerate his weakness. He boasted in it. Not because he enjoyed suffering, but because he discovered that his thorn kept him close to the only source of real power. This chapter is about making peace with an unresolved life. Not giving up. Not surrendering hope. But refusing to put your life on hold until the thing you've been begging God to remove finally goes away. What if your wholeness doesn't depend on the removal of your pain? What if you've been waiting for a subtraction when God has been offering an addition — Himself?" },
      ]
    },
    {
      id:"jonah", title:"Jonah & the Storm", icon:"🐋", tag:"Running from Mercy",
      color:"#5488E8",
      summary:"Jonah didn't run because he was afraid. He ran because he knew God was merciful — and he didn't want the people of Nineveh to receive that mercy. This story is for anyone whose spiritual struggle isn't doubt but bitterness, control, or an inability to forgive.",
      chapters:[
        { title:"The Opposite Direction", text:"God told Jonah to go to Nineveh. Jonah went to the docks and bought a ticket to Tarshish — the farthest place in the opposite direction. He didn't wander off course. He didn't misunderstand. He deliberately ran. And here's the part people miss: Jonah wasn't scared of Nineveh. He was angry at God's character. He knew God would be merciful, and he didn't want those people to receive mercy. This chapter is about conscious resistance — the moments when you clearly sense God's direction and say no. Not out of confusion. Out of defiance. What assignment have you been running from, and what's the real reason?" },
        { title:"Asleep in the Storm", text:"God sent a violent storm. The sailors were terrified, throwing cargo overboard, crying out to their gods. And Jonah? Asleep below deck. The world was breaking apart above him, and he was unconscious. This chapter explores the numbness of avoidance — the ability to disconnect from the chaos your choices have created. Sometimes we don't need to wake up to God. We need to wake up to what's happening around us because of what we've refused to do. Where in your life are you asleep to a storm you've caused?" },
        { title:"The Belly of the Fish", text:"Three days in the belly of a fish. Complete darkness. No escape. No distraction. Just Jonah and the consequences of his choices. And that's where he finally prayed — not on the boat, not on the dock, not when God first called. In the belly. Rock bottom. This chapter reframes the lowest point not as punishment but as a forced pause. The place where the noise finally stops and the only direction to look is up. What 'belly of the fish' moment in your life forced you to finally pray?" },
        { title:"Nineveh Repents, Jonah Rages", text:"Jonah finally went to Nineveh. He preached. And the entire city — from the king to the livestock — repented. It was the most successful sermon in biblical history. And Jonah was furious. He told God: 'This is why I ran. I knew You would do this. I knew You'd forgive them.' He was angrier about God's mercy than he ever was about Nineveh's sin. This chapter is brutally honest: sometimes we don't want people to be forgiven. We want them judged. Whose mercy from God would make you angry? What does that reveal about your heart?" },
        { title:"Why This Matters to You", text:"God gave Jonah a plant for shade. Then He sent a worm to kill the plant. Jonah was so angry about the dead vine he wanted to die — again. And God asked: 'You're upset about a plant that grew in a day and died in a day. Should I not care about 120,000 people who can't tell their right hand from their left?' Jonah cared more about his comfort than other people's lives. The book ends with God's question unanswered. It's still hanging in the air. For anyone who has been more concerned with their own justice than someone else's redemption — Jonah's story isn't comfortable. But it's honest. What small loss has consumed you while God's much bigger invitation sits waiting?" },
      ]
    },
    {
      id:"bleeding-woman", title:"The Bleeding Woman", icon:"🩸", tag:"When Suffering Becomes Identity",
      color:"#C4A96A",
      summary:"Twelve years of bleeding. Every doctor, every dollar, every remedy — nothing worked. She got worse. This story is for anyone whose pain has lasted so long it's become the thing that defines them, and who has almost stopped believing things could change.",
      chapters:[
        { title:"Twelve Years", text:"Twelve years. That's not a season. That's an era. She started bleeding and never stopped. In that culture, it made her ceremonially unclean — untouchable. No worship. No community. No physical contact. For twelve years she lived in a body that kept her isolated from everything and everyone. At some point, she stopped expecting it to get better. The illness wasn't an interruption anymore. It was her life. What have you accepted as permanent that you once believed would change?" },
        { title:"She Had Spent All She Had", text:"Mark's gospel adds a detail that cuts deep: she had 'suffered much under many physicians' and 'spent all she had' and was 'no better but rather grew worse.' She gave everything — her money, her time, her hope — to solutions that promised healing but couldn't deliver. This chapter is about the exhaustion of trying. Of chasing every remedy, reading every book, seeing every expert, trying every approach. And ending up more depleted than when you started. What have you spent on things that promised to fix you but couldn't?" },
        { title:"The Crowd Between Her and Jesus", text:"She had to push through a massive crowd to reach Jesus. And as an 'unclean' woman, every person she touched technically became unclean too. She was breaking the rules just by being there. But she went anyway. This chapter is about the barriers between your pain and your healing — shame, social expectations, religious rules, the voice that says you don't belong here. The crowd will always be there. The question is whether you'll push through it. What crowd are you fighting through right now?" },
        { title:"The Hem of His Garment", text:"She didn't ask for a meeting. Didn't request a prayer appointment. Didn't try to explain her situation. She reached out and touched the edge of His clothes. That's it. The smallest, most desperate reach of faith imaginable. And power left Jesus immediately. This chapter celebrates the faith that has been beaten down to almost nothing — and discovers that almost nothing is enough. You don't need a bold declaration. You don't need perfect theology. You need one hand reaching in the right direction. What is the smallest act of faith you can manage today?" },
        { title:"Why This Matters to You", text:"Jesus stopped the entire procession. In the middle of rushing to heal a dying girl, He stopped and asked: 'Who touched me?' The disciples thought He was ridiculous — everyone was touching Him. But He knew the difference between a crowd pressing in and a person reaching out. He wanted her to be seen. Not healed in secret. Healed in public. Named. Called 'daughter.' Her identity was no longer her condition. This is what Jesus does: He doesn't just heal you privately. He calls you forward and gives you a new name. What would it cost you to stop being anonymous in your pain? To step out of the crowd and let your story be witnessed?" },
      ]
    },
    {
      id:"prodigal", title:"The Prodigal Son", icon:"🚪", tag:"Coming Home to Love",
      color:"#E88854",
      summary:"He took his inheritance, wasted everything, and ended up feeding pigs. But this story was never about the leaving. It's about what was waiting the entire time he was gone. This is for anyone who believes they've gone too far to come back.",
      chapters:[
        { title:"Give Me My Share", text:"Asking for your inheritance while your father is still alive was essentially saying: 'I wish you were dead. Give me what I'm owed.' And the father gave it to him. No lecture. No argument. No locked doors. He let his son leave with everything. This chapter explores the moment of departure — the impulse toward radical independence, the belief that freedom means cutting ties with the people and the God who love you. When did you decide you could do this alone? What were you really running from?" },
        { title:"The Distant Country", text:"He didn't lose everything in a single bad night. It was gradual. One decision at a time. One compromise, one desperate choice, one morning waking up with a little less than the day before. The distant country is seductive because the decline is slow. You don't realize how far you've gone until you look up and don't recognize anything around you — including yourself. This chapter traces the quiet unraveling. Where did yours begin? What was the first compromise that led to the next one?" },
        { title:"The Pig Pen", text:"He was so hungry he wanted to eat what the pigs were eating. And then five words that changed everything: 'He came to himself.' Not a sermon. Not an intervention. A moment of brutal clarity in the lowest place imaginable. He finally saw where he was. This chapter is about the gift of rock bottom — the moment the illusion breaks and you can't pretend anymore. It hurts. It's humiliating. And it's the birthplace of every real comeback. What moment of clarity brought you face to face with the truth you'd been avoiding?" },
        { title:"The Rehearsed Speech", text:"On the walk home, he practiced: 'Father, I have sinned. I am no longer worthy to be called your son. Make me like one of your hired servants.' He had a script ready. Shame always prepares a speech. It rehearses the rejection so it won't hurt as much. It volunteers for demotion before anyone else can suggest it. This chapter is about the way we approach God — expecting punishment, preparing for rejection, offering to earn back what was freely given. What speech have you been rehearsing for God?" },
        { title:"Why This Matters to You", text:"While the son was still a long way off, his father saw him. Which means his father was watching. Every day. Looking down the road. Waiting. And when he saw his boy, he didn't wait for the speech. He didn't stand with crossed arms. He ran. In that culture, a dignified man never ran. But this father did. He sprinted toward his broken, humiliated son and embraced him before a word was spoken. Robe. Ring. Sandals. Feast. Not a single condition. Not a single 'I told you so.' Your Father isn't standing at the door with a list of what you owe. He's running toward you. The only thing between you and home is the decision to turn around." },
      ]
    },
    {
      id:"abraham-isaac", title:"Abraham & Isaac", icon:"⛰️", tag:"Trust Beyond Understanding",
      color:"#6A8A9A",
      summary:"God gave Abraham a son after decades of waiting. Then God asked him to give that son back. Abraham walked up a mountain carrying the weight of a command that made no sense — and discovered that surrender isn't losing what you love. It's trusting the one who gave it to you.",
      chapters:[
        { title:"The Promise Fulfilled", text:"Abraham and Sarah waited 25 years for Isaac. Twenty-five years of silence, of doubt, of watching their bodies age past possibility. And then — laughter. That's what Isaac's name means: 'he laughs.' The impossible became a baby in their arms. Everything God promised was wrapped up in this boy. Every covenant, every future, every hope. Isaac wasn't just a child. He was the proof that God keeps His word. And that's what makes what comes next so devastating." },
        { title:"The Command", text:"'Take your son, your only son, Isaac, whom you love, and offer him as a burnt offering.' God named every layer of attachment before issuing the command. Your son. Your only son. The one you love. As if He wanted Abraham to feel the full weight of what was being asked. This chapter doesn't try to make this comfortable. It sits with the incomprehensible: a good God asking an impossible thing. What has God asked you to surrender that doesn't make sense?" },
        { title:"The Walk Up the Mountain", text:"Abraham rose early the next morning. He didn't argue. He didn't negotiate. He split the wood, loaded the donkey, and started walking. Three days to the mountain. Three days of silence with his son beside him. Then Isaac asked: 'Father, we have the fire and the wood, but where is the lamb?' Abraham's answer is one of the most faith-filled sentences in Scripture: 'God Himself will provide the lamb, my son.' He didn't understand. But he trusted. When was the last time you obeyed something you couldn't explain?" },
        { title:"The Altar", text:"Abraham built the altar. Arranged the wood. Bound his son. Raised the knife. And in that moment — the moment of absolute surrender — an angel called his name. 'Do not lay a hand on the boy.' A ram caught in a thicket appeared behind him. God provided the substitute. But Abraham had to reach the point of complete release before the provision showed up. This chapter asks the hardest question about surrender: Are you willing to open your hand before you see what God will place in it?" },
        { title:"Why This Matters to You", text:"Abraham named that place 'The Lord Will Provide.' Not 'The Lord Provided' — past tense. Will provide — a promise for every future mountain. This story isn't about God wanting to take things from you. It's about God wanting to know if the thing He gave you has become bigger than the God who gave it. We all have an Isaac. A dream, a person, a plan, a future that we grip so tightly our knuckles turn white. And God doesn't ask us to let go because He's cruel. He asks because He knows that what we hold with open hands, He can multiply. What are you gripping so tightly that there's no room for God to move?" },
      ]
    },
    {
      id:"fiery-furnace", title:"The Fiery Furnace", icon:"🔥", tag:"Standing When Everyone Bows",
      color:"#E85454",
      summary:"The king built a golden statue and commanded everyone to bow. Three young men refused. They were thrown into a fire so hot it killed the guards who threw them in. And in the middle of the flames, there was a fourth figure walking with them. This story is for anyone who has to stand alone.",
      chapters:[
        { title:"The Statue", text:"King Nebuchadnezzar built a golden image ninety feet tall and ordered every person in the empire to bow when the music played. It wasn't a request. Refusal meant death. And when the music played, an entire nation bent their knees. Every single person in that massive crowd dropped to the ground — except three. Shadrach, Meshach, and Abednego stood. In a sea of bent backs, three figures remained upright. This chapter is about the moments when everyone around you compromises and the pressure to conform feels like gravity. What is everyone around you bowing to that you know you can't?" },
        { title:"The Accusation", text:"People noticed. Of course they did. Jealous officials reported the three men to the king. Nebuchadnezzar gave them one more chance: bow, or burn. His question dripped with arrogance: 'And what god will be able to rescue you from my hand?' This chapter explores what happens when your integrity makes you a target. When doing the right thing draws attention you didn't want. When the people above you demand that you choose between your conviction and your survival. Who has given you an ultimatum for standing on what you believe?" },
        { title:"The Answer", text:"Their response is one of the most powerful statements of faith ever spoken: 'The God we serve is able to deliver us. But even if He does not, we want you to know that we will not serve your gods or worship your image.' Even if He does not. They didn't say 'God will definitely save us.' They said: whether He does or doesn't, our answer is the same. This chapter is about a faith that isn't dependent on the outcome. A conviction that doesn't require a guarantee. Can you stand for something even if God doesn't rescue you from the consequences?" },
        { title:"The Fourth Figure", text:"The furnace was heated seven times hotter than normal. The soldiers who threw them in died from the heat. But when the king looked into the fire, he didn't see three men. He saw four. And the fourth 'looked like a son of the gods.' They weren't alone in the flames. They were walking around. Unbound. Unburned. This chapter reveals the promise hidden inside the fire: God doesn't always take you out of the furnace, but He always shows up inside it. Where in your life has God met you in the middle of something you thought would destroy you?" },
        { title:"Why This Matters to You", text:"When they walked out, the fire had not touched them. Their clothes weren't singed. Their hair wasn't burned. They didn't even smell like smoke. The thing that was supposed to destroy them didn't leave a mark. And the same king who built the statue declared that no one could speak against their God. The furnace that was meant to be their end became their testimony. If you're in a fire right now — a situation that feels like it's going to consume everything — this story says it doesn't have to. The flames are real. The heat is real. But there is a fourth figure in the fire, and He has been walking with people through impossible situations since before you were born. Stand up. Refuse to bow. And trust that you won't walk through this alone." },
      ]
    },
    {
      id:"woman-adultery", title:"The Woman Caught in Adultery", icon:"✋", tag:"Grace That Silences Accusers",
      color:"#9E6CC8",
      summary:"They dragged her into the temple. Threw her at Jesus' feet. Demanded He condemn her. The law was clear. The crowd was ready. And Jesus bent down and started writing in the dirt. This story is for anyone who has been publicly shamed and privately desperate for someone to see past their worst moment.",
      chapters:[
        { title:"Dragged Into the Light", text:"She was caught in the act and dragged into the temple courts. In front of everyone. The text says the scribes and Pharisees 'made her stand before the group.' Public humiliation was the point. She wasn't a person to them — she was a prop in their argument. A test case. They didn't bring her to Jesus because they cared about justice. They brought her because they wanted to trap Him. And she stood there, exposed, while powerful men debated her fate. Have you ever been someone else's example? Someone else's argument? Reduced to your worst moment in front of people who didn't care about you at all?" },
        { title:"The Question", text:"'Teacher, the law says to stone her. What do you say?' It was a perfect trap. If Jesus said forgive her, He'd be contradicting the law of Moses. If He said stone her, He'd contradict everything He'd been teaching about mercy. They thought they had Him cornered. The crowd held its breath. And Jesus — in the most dramatic silence in the New Testament — said nothing. He bent down and started writing in the dirt. He refused to play their game on their terms. This chapter is about the moments when everyone demands an immediate judgment and the wisest response is silence." },
        { title:"The Writing in the Dirt", text:"No one knows what Jesus wrote. Some think it was the sins of the accusers. Some think it was scripture. Whatever it was, it changed the atmosphere. When He stood up, He said one sentence: 'Let anyone among you who is without sin throw the first stone.' Then He bent down and kept writing. One by one, starting with the oldest, they dropped their stones and walked away. Every single one. The people most eager to condemn her couldn't withstand one honest question about themselves. This chapter asks: whose stone are you still carrying? And what would happen if you put it down?" },
        { title:"Neither Do I Condemn You", text:"When everyone was gone, Jesus looked up. 'Woman, where are your accusers? Has no one condemned you?' She said: 'No one, Lord.' And Jesus said: 'Neither do I condemn you. Go, and sin no more.' He didn't say she was innocent. He didn't pretend it didn't happen. He said: I am not going to define you by this moment. Your past is real. Now go live differently. This is what grace sounds like — not ignoring the truth, but refusing to let it be the final word. When was the last time someone saw your worst and responded with 'neither do I condemn you'?" },
        { title:"Why This Matters to You", text:"There are two miracles in this story. The first is that she wasn't stoned. The second is that she was seen. Not as an adulterer. Not as a cautionary tale. Not as a theological debate. As a human being standing in front of God, terrified and exposed, and hearing: you can go now. You're not trapped in this moment anymore. If you've been carrying the weight of a public failure, a private shame, or a moment you can't undo — this story says the accusers don't get the last word. The crowd doesn't get to decide your sentence. The one whose opinion actually matters has already spoken, and what He said was: neither do I condemn you. Now go. Not 'go and be perfect.' Go and be free." },
      ]
    },
    {
      id:"jacob-wrestling", title:"Jacob Wrestling God", icon:"💫", tag:"The Wound That Becomes Your Name",
      color:"#C4A96A",
      summary:"Alone in the dark, on the edge of losing everything, Jacob wrestled a mysterious figure until dawn. He wouldn't let go until he received a blessing. And he walked away with a new name and a permanent limp. This story is for anyone who has fought with God and been changed by the fight.",
      chapters:[
        { title:"The Night Before", text:"Jacob was about to meet his brother Esau for the first time in twenty years. The last time they spoke, Esau wanted to kill him — and Jacob deserved it. He had stolen his brother's birthright and his blessing through deception. Now Esau was coming with 400 men. Jacob sent his family, his servants, and all his possessions across the river. And then he was alone. Completely alone. In the dark. Waiting for a confrontation he couldn't avoid. This chapter is about the night before. The sleepless hours. The moment when you've run out of strategies and all that's left is you and the thing you've been avoiding." },
        { title:"The Wrestling", text:"A man appeared and wrestled with Jacob until daybreak. No words. No explanation. Just a fight that lasted all night. Jacob didn't know who he was fighting — was it a man? An angel? God Himself? All he knew was that he couldn't let go. Something in him understood that this struggle was the most important thing he'd ever done. This chapter explores the kind of wrestling that isn't physical — the fight with God that happens when your faith and your circumstances collide. When you're angry, afraid, desperate, and you grab hold of God and refuse to release Him. When have you wrestled with God in the dark?" },
        { title:"The Wound", text:"When the figure saw He couldn't overpower Jacob, He touched Jacob's hip — and it dislocated. One touch. Permanent damage. And still Jacob held on. 'I will not let you go unless you bless me.' He was in pain. He was exhausted. His body was broken. And he tightened his grip. This chapter is about the cost of holding on to God. Real faith isn't painless. Sometimes the encounter with God leaves a mark — a limp, a scar, a weakness you didn't have before. But Jacob understood that the blessing was worth the wound. What has your wrestling with God cost you?" },
        { title:"The New Name", text:"'What is your name?' the figure asked. 'Jacob.' His name meant 'deceiver' — a liar, a manipulator. He'd been living under that identity his entire life. And in that moment, the figure said: 'Your name is no longer Jacob. It is Israel — one who struggles with God and overcomes.' The wound gave him a limp. But the wrestling gave him a name. This chapter is about identity transformation — the moment when the thing you've always been called gets replaced by who God says you are. What name have you been living under that God is trying to change?" },
        { title:"Why This Matters to You", text:"Jacob walked away from that riverside with a limp for the rest of his life. Everyone could see it. He couldn't hide it. But he also walked away as Israel — the father of a nation, the carrier of God's covenant. The wound and the blessing came from the same encounter. That's the paradox of wrestling with God: you don't come out unscathed, but you come out renamed. If you're in a season of fighting — with your faith, with your past, with the God you can't understand — don't let go. The struggle isn't a sign that something is wrong. It's a sign that something is being born. The limp is proof that you stayed in the ring. And the new name? That's proof that it was worth it." },
      ]
    },
    {
      id:"samuel-calling", title:"Samuel's Calling", icon:"🌙", tag:"Learning to Hear God's Voice",
      color:"#5488E8",
      summary:"A boy lying in the dark heard someone call his name. Three times he ran to the wrong person. The fourth time, he finally understood — God was speaking. This story is for anyone trying to discern God's voice in a world full of noise.",
      chapters:[
        { title:"The Boy in the Temple", text:"Samuel was given to God before he could choose for himself. His mother Hannah — after years of desperate prayer — dedicated him to the temple as a child. He grew up in the house of God, sleeping near the ark of the covenant, doing small tasks for the priest Eli. He was faithful. He was obedient. And the text says something haunting: 'Samuel did not yet know the Lord; the word of the Lord had not yet been revealed to him.' You can be in God's house your entire life and still not recognize His voice. Proximity isn't the same as intimacy. How long have you been near God without actually hearing Him?" },
        { title:"The Voice in the Night", text:"It happened at night. The lamp of God hadn't gone out yet — that detail matters. There was still a flicker of light. And Samuel heard his name. Clear. Specific. Personal. He did what made sense: he ran to Eli. 'Here I am; you called me.' Eli said: I didn't call you. Go back to sleep. It happened again. And again. Three times, Samuel heard God's voice and attributed it to a human source. This chapter is about the voices we mistake for God — and the voice of God we mistake for something ordinary. What if God has been speaking and you've been looking in the wrong direction?" },
        { title:"The Mentor's Recognition", text:"It was Eli — old, failing, nearly blind — who finally recognized what was happening. 'Go lie down, and if He calls you, say: Speak, Lord, for your servant is listening.' Eli couldn't hear the voice himself. But he could teach Samuel how to respond to it. This chapter is about the people in your life who can't walk the road for you but can point you in the right direction. The mentor who sees what you can't. The person whose own journey has given them the wisdom to recognize God's movement in yours. Who has helped you hear what you couldn't hear on your own?" },
        { title:"Speak, Lord", text:"The fourth time God called, Samuel was ready. 'Speak, for your servant is listening.' Seven words that changed everything. Not 'speak, Lord, and I'll decide if I agree.' Not 'speak, Lord, but only if it's good news.' Just: I'm listening. And what God said was not easy to hear — it was a message of judgment against Eli's own household. The first word God gave Samuel was a hard one. This chapter confronts a truth most people avoid: hearing God's voice doesn't always mean hearing what you want. Are you willing to listen even if the answer is uncomfortable?" },
        { title:"Why This Matters to You", text:"Samuel grew up to become one of the most important voices in Israel's history. He anointed kings. He guided a nation. But it all started with a boy in the dark who didn't recognize God's voice — and had to be taught how to listen. If you feel like you can't hear God, you're not disqualified. You're where Samuel was. The voice is real. It's personal. It calls you by name. But learning to hear it takes time, stillness, humility, and sometimes someone further along the road to say: that's Him. Stop running to the wrong room. Lie down. Get quiet. And say the hardest, simplest prayer there is: Speak, Lord. I'm listening." },
      ]
    },
    {
      id:"rahab", title:"Rahab & the Spies", icon:"🔴", tag:"A Past That Doesn't Disqualify",
      color:"#E85454",
      summary:"She was a prostitute in a condemned city. She hid two enemy spies on her roof and lied to the authorities to protect them. And for that one act of risky faith, her name appears in the lineage of Jesus. This story is for anyone convinced their history makes them ineligible for God's future.",
      chapters:[
        { title:"The Woman on the Wall", text:"Rahab lived in Jericho — a city about to be destroyed. She was a prostitute, which in that culture meant she existed at the very bottom of the social order. No status. No honor. No seat at anyone's table. She was defined entirely by what she did, not who she was. And yet when two Israelite spies needed a place to hide, her house was where they ended up. Sometimes God's plan starts in the last place anyone would look. What part of your story do you assume disqualifies you from being used by God?" },
        { title:"The Risk", text:"When the king of Jericho sent soldiers to find the spies, Rahab hid them on her roof under stalks of flax and lied to the authorities. She risked everything — her life, her safety, her standing in the only city she'd ever known. For strangers. For a God she'd only heard rumors about. This chapter is about the moments when faith requires action before certainty. When you have to move before you fully understand. Rahab didn't have a theology degree. She had a choice. What risk is faith asking you to take before you feel ready?" },
        { title:"The Confession", text:"After hiding the spies, Rahab said something remarkable: 'I know that the Lord has given you this land. We have heard how the Lord dried up the Red Sea. The Lord your God is God in heaven above and on the earth below.' She had been listening. In a city that worshipped other gods, in a life that seemed completely disconnected from the God of Israel, Rahab had been paying attention. Faith was growing in the most unlikely soil. This chapter is about the faith that develops quietly in people no one expects. Where has God been planting something in you that nobody else can see?" },
        { title:"The Scarlet Cord", text:"Rahab made a deal with the spies: when you destroy this city, save me and my family. They told her to hang a scarlet cord from her window. That cord would be her marker — the sign that this house gets spared. And when the walls of Jericho fell, every wall collapsed except one section. Hers. This chapter is about God's faithfulness to His promises, even in the middle of destruction. Even when everything around you falls, the cord holds. What promise from God are you hanging onto while the walls shake?" },
        { title:"Why This Matters to You", text:"Here's where Rahab's story becomes extraordinary: she didn't just survive. She married into the nation of Israel. She had a son named Boaz — the same Boaz who married Ruth. And when Matthew traces the genealogy of Jesus, Rahab is in the line. A prostitute from a pagan city is a direct ancestor of the Messiah. God didn't just save her from judgment. He wrote her into the most important story in human history. If you've been told — by others or by yourself — that your past puts you outside the reach of God's purpose, Rahab's scarlet cord says otherwise. Your history is not your destiny. Your worst chapter can become the setup for someone else's redemption." },
      ]
    },
    {
      id:"widows-oil", title:"The Widow's Oil", icon:"🫗", tag:"When All You Have Is Almost Nothing",
      color:"#C4A96A",
      summary:"A widow was about to lose her sons to a creditor. All she had was a small jar of olive oil. The prophet told her to gather every empty vessel she could find and start pouring. The oil didn't stop until the last jar was full. This story is for anyone staring at what they have and thinking it's not enough.",
      chapters:[
        { title:"The Debt", text:"Her husband was dead. He'd been a faithful man — a prophet's servant — and still left behind a debt so large that the creditor was coming to take her two sons as slaves. She did nothing wrong. She married well, lived faithfully, and ended up bankrupt with her children on the line. This chapter sits with the injustice of suffering that isn't your fault. The bills that pile up after the loss. The consequences someone else left for you to carry. What debt — financial, emotional, relational — are you carrying that you didn't create?" },
        { title:"The Honest Inventory", text:"When she cried out to the prophet Elisha, he asked a question that felt almost cruel: 'What do you have in your house?' She said: 'Nothing. Except a small jar of olive oil.' Nothing — except. That pause is everything. She almost missed what she had because it looked so small compared to what she owed. This chapter asks you to take an honest inventory. Not of what you lack — you already know that list by heart. Of what you still have. What small, overlooked resource is sitting in your house that you've been dismissing because it doesn't seem like enough?" },
        { title:"The Empty Vessels", text:"Elisha told her to go to every neighbor and borrow as many empty jars as she could find. Not a few — as many as possible. Before the miracle came, she had to do something uncomfortable: she had to go door to door and ask for help. She had to let people see her need. The miracle required vulnerability before it required faith. This chapter is about the part nobody wants to do — admitting you can't handle this alone. Asking for the empty jars. Letting people in. Who could you ask for help that you've been too proud or too ashamed to approach?" },
        { title:"The Pouring", text:"She shut the door. Just her and her sons. And she started pouring from that one small jar of oil. The oil kept coming. Jar after jar after jar. It didn't stop. It didn't slow down. The supply matched the space she'd prepared. When the last jar was full, the oil stopped. Not before. This means the miracle was limited only by the number of jars she collected. This chapter confronts a terrifying truth: God's provision often matches your preparation. How many jars did she leave behind because she didn't believe the oil would keep flowing? How much have you left on the table because you stopped preparing for what God could do?" },
        { title:"Why This Matters to You", text:"Elisha told her to sell the oil, pay the debt, and live on the rest. From one small jar. The thing she almost dismissed as nothing became the source of her family's freedom and future. Your 'almost nothing' is not nothing. The small gift, the limited resource, the one skill, the little bit of faith you have left — God doesn't need your abundance. He needs your willingness to pour. Start with what's in your hand. Stop comparing it to what's in your account. And when He says gather jars, don't get five. Get fifty. The oil keeps flowing as long as there's room to receive it." },
      ]
    },
    {
      id:"thomas", title:"Thomas After the Resurrection", icon:"🤚", tag:"Doubt as the Door to Deeper Faith",
      color:"#9E6CC8",
      summary:"The other disciples said they'd seen Jesus alive. Thomas said: 'Unless I see the nail marks and put my finger where the nails were, I will not believe.' A week later, Jesus showed up and said: 'Put your finger here.' This story is for anyone told that doubt makes them a bad Christian.",
      chapters:[
        { title:"The One Who Wasn't There", text:"When Jesus appeared to the disciples after the resurrection, Thomas wasn't in the room. We don't know why. Maybe he was grieving alone. Maybe he couldn't face the group. Whatever the reason, he missed it. And when the others told him what happened — 'We have seen the Lord!' — he couldn't accept it secondhand. He needed to see for himself. This chapter is about the loneliness of being one step behind everyone else's experience of God. When everyone around you seems certain and you're still struggling. When have you felt left out of something everyone else seems to have received?" },
        { title:"The Demand", text:"'Unless I see the nail marks in His hands and put my finger where the nails were and put my hand into His side, I will not believe.' Thomas didn't whisper his doubt. He stated it. Clearly. Out loud. In front of everyone. This chapter honors the courage of honest doubt. Thomas didn't fake faith he didn't have. He didn't smile and nod while his insides screamed. He said: I need more. And the text doesn't condemn him for it. What doubt have you been afraid to say out loud because you thought it would disqualify you?" },
        { title:"The Week of Waiting", text:"A whole week passed. Seven days of sitting with the other disciples who believed while Thomas didn't. Seven days of tension, of side glances, of being the one who couldn't get there. But he didn't leave. He stayed in the room with people whose faith looked different from his. This chapter is about staying in community even when your experience doesn't match everyone else's. About not walking away from the table just because you're the only one who hasn't felt what they felt. Are you tempted to leave a community because your faith doesn't look like theirs?" },
        { title:"Put Your Finger Here", text:"Jesus came back. And He went straight to Thomas. He didn't scold him. He didn't lecture the room about the importance of faith. He said: 'Put your finger here; see my hands. Reach out your hand and put it into my side. Stop doubting and believe.' He met Thomas's exact request. Not with disappointment — with invitation. Jesus didn't treat doubt as an insult. He treated it as something to be answered. This chapter reveals a God who isn't threatened by your questions. He walks toward them. What question have you been afraid to bring to God?" },
        { title:"Why This Matters to You", text:"Thomas's response, when he finally saw, was the most profound declaration of faith in the Gospels: 'My Lord and my God.' Not just 'you're alive' or 'I believe now.' My Lord and my God. His doubt didn't produce shallow faith — it produced the deepest confession in the room. The one who questioned the hardest worshipped the deepest. If you're carrying doubt, you're not broken. You're on the road to something real. The faith that survives questioning is stronger than the faith that never questions. God isn't afraid of your doubt. He's just waiting for you to bring it to Him honestly instead of hiding it behind a smile." },
      ]
    },
    {
      id:"paralytic-roof", title:"The Paralytic Through the Roof", icon:"🕳️", tag:"The Friends Who Carry You",
      color:"#54B868",
      summary:"He couldn't walk. He couldn't get to Jesus on his own. So four friends picked up his mat, climbed onto a roof, tore a hole in it, and lowered him down into the room. This story is for anyone who can't get to healing on their own — and for the people who carry them there.",
      chapters:[
        { title:"The Man on the Mat", text:"We don't know his name. We don't know how long he'd been paralyzed. We just know he couldn't move. He was completely dependent on other people for everything — food, shelter, dignity. And when Jesus came to town, he couldn't get there on his own. The crowd was too thick. The house was too full. His body wouldn't cooperate. This chapter is about the moments when you physically, emotionally, or spiritually cannot get yourself to the place you need to be. When the thing you need most is the thing you're least capable of reaching. When have you been stuck on a mat, unable to move toward what could heal you?" },
        { title:"The Four Who Came", text:"Four friends showed up. They didn't send a card. They didn't say 'let me know if you need anything.' They picked up the mat — with him on it — and carried him through the streets. Four people who decided that their friend's healing was worth their inconvenience. This chapter is about the people who show up, not with words, but with their hands. The ones who carry your weight when you can't. Who are the people who have carried you? And who are you carrying right now?" },
        { title:"The Crowd That Blocked the Way", text:"They got to the house and couldn't get in. The crowd was packed wall to wall. No opening. No path. A reasonable person would have turned around. But these four looked at the problem and saw a roof. They climbed up, started digging through clay and straw, and made a hole. They lowered their friend — mat and all — right into the middle of the room, right in front of Jesus. This chapter is about refusing to let obstacles have the final word. When the normal path is blocked, you find another way. What obstacle has been stopping you from getting to the thing you need most — and what if the solution isn't through the door but through the roof?" },
        { title:"Their Faith", text:"Here's the line that changes everything: 'When Jesus saw their faith, He said to the paralyzed man, your sins are forgiven.' Their faith. Not his faith. Theirs. The faith of the four who carried him. Jesus responded to the belief of the friends — and healed the man because of it. This chapter is profound and possibly uncomfortable: sometimes your healing comes through someone else's faith. When you can't believe for yourself, someone else believes on your behalf. You don't always have to carry your own faith. That's what the body is for. Whose faith has carried you when yours ran out?" },
        { title:"Why This Matters to You", text:"Jesus told the man: 'Get up, take your mat, and go home.' And he did. The same mat he'd been lying on — the symbol of everything that held him down — became the thing he carried out the door. His story changed in a single moment, but that moment required four people willing to climb, dig, and lower. If you're on the mat right now, let someone pick you up. Stop saying 'I'm fine.' Stop believing you have to heal yourself. And if you're one of the four — if someone in your life is stuck and can't move — don't wait for them to ask. Pick up the corner of the mat. The roof isn't that high." },
      ]
    },
    {
      id:"noah", title:"Noah & the Ark", icon:"🌧️", tag:"Obedience Before the Evidence",
      color:"#6A8A9A",
      summary:"God told a man to build a massive boat in the middle of dry land for a flood that had never happened. It took years. The neighbors watched. Nobody believed him. Noah built anyway. This story is for anyone doing something that looks foolish to everyone watching because God told you to.",
      chapters:[
        { title:"The Assignment", text:"Build a boat. Massive. Hundreds of feet long. In the middle of nowhere. For rain — something the world had never seen before. There was no weather forecast to confirm it. No scientific data to support it. Just a voice and a command that made zero sense to anyone who heard it. And Noah said yes. This chapter is about the moment God asks you to do something that looks ridiculous to everyone around you. The dream that makes no sense on paper. The calling that has no market validation. The step that feels like madness. What has God asked you to build that nobody else understands?" },
        { title:"The Building", text:"The ark wasn't built in a weekend. Scholars estimate it took decades. Day after day, year after year, Noah cut wood, measured planks, and sealed them with pitch. While the sun was shining. While life went on as normal. While nothing in the sky suggested rain was coming. This chapter is about the long obedience — the years of building something you can't see the purpose of yet. The work that produces no visible result for a long, long time. What are you building in a season that looks unproductive to everyone watching?" },
        { title:"The Watching World", text:"The Bible doesn't record the neighbors' reactions, but it doesn't take much imagination. A man building an enormous boat on dry land — for decades — would have been the subject of ridicule, pity, and endless gossip. Noah lived in a community that watched him work on something they thought was insane. And he kept going. This chapter is about endurance under social pressure. When the people around you question your judgment, your sanity, your direction. When obedience makes you look foolish. Whose opinion has been loud enough to make you doubt what you know God said?" },
        { title:"The Door", text:"When the ark was finished and the animals were loaded, God shut the door. Not Noah. God. And then it rained. For forty days and forty nights. Everything outside that door was destroyed. Everything inside was preserved. This chapter is about divine timing and divine protection. There comes a moment when God closes the door on the old season — and what you've been building becomes the very thing that saves you. The preparation you couldn't explain becomes the provision you can't deny. What season is God closing behind you right now?" },
        { title:"Why This Matters to You", text:"After the flood, Noah sent out a dove. The first time it came back — no land. The second time it returned with an olive branch. The third time it didn't come back at all. Restoration is gradual. First nothing. Then a sign. Then freedom. If you've been building in faith for a long time and the rain still hasn't come, or the flood is still rising, or the dove keeps coming back empty — don't stop. Noah's entire legacy exists because he trusted the voice more than the weather. Your obedience isn't wasted just because the timing doesn't make sense yet. Keep building. The rain will verify what faith already knows." },
      ]
    },
    {
      id:"elisha-chariots", title:"Elisha's Chariots of Fire", icon:"🔥", tag:"The Army You Cannot See",
      color:"#E88854",
      summary:"An enemy army surrounded the city in the night. Elisha's servant woke up terrified. And the prophet prayed one of the most powerful prayers in Scripture: 'Lord, open his eyes so he may see.' The hills were full of horses and chariots of fire. This story is for anyone who feels outnumbered and outmatched.",
      chapters:[
        { title:"The Servant's Eyes", text:"The servant woke up early and saw the army. Horses, chariots, soldiers — everywhere. The king of Aram had sent his entire force to capture one man: Elisha. The servant's reaction was immediate and human: 'What shall we do?' Panic. Despair. The math didn't work. Two of them against an army. This chapter is about the morning you wake up and the problem is bigger than you thought. The diagnosis. The bill. The betrayal. The opposition you didn't see coming. The moment when you look at the situation and the numbers don't make sense. What army have you woken up to that made you say 'what are we going to do'?" },
        { title:"Don't Be Afraid", text:"Elisha's response is almost absurd in its calm: 'Don't be afraid. Those who are with us are more than those who are with them.' The servant must have looked at him like he was delusional. There were two of them. Two. Against an army. But Elisha wasn't counting what he could see. He was counting what he knew. This chapter is about the gap between what your eyes report and what faith knows. When the visible evidence says you're outnumbered and the voice of God says you're not. Have you been making decisions based only on what you can see?" },
        { title:"Open His Eyes", text:"Elisha didn't pray for the army to leave. He didn't pray for a miracle of deliverance. He prayed: 'Lord, open his eyes so he may see.' And when the servant looked again, the hills were full of horses and chariots of fire. They had been there the whole time. The protection was already in place before the threat arrived. This chapter shifts everything: maybe the miracle you need isn't a change in your circumstances — it's a change in your sight. What if the help is already there and you just can't see it yet?" },
        { title:"The Blindness", text:"Elisha then prayed for the enemy army to be struck with blindness — and led them, confused and helpless, straight into the capital of Israel. When their eyes were opened, they were surrounded. And instead of killing them, Elisha told the king to feed them and send them home. The enemy that came to destroy was disarmed with a meal. This chapter is about God's unexpected methods. He doesn't always defeat your enemies the way you'd expect. Sometimes He blinds them. Sometimes He redirects them. Sometimes He turns a battle into a dinner table. How has God dealt with your opposition in ways you didn't anticipate?" },
        { title:"Why This Matters to You", text:"The chariots of fire were there before the servant looked up. Before Elisha prayed. Before the army arrived. God's protection wasn't reactive — it was already in position. If you're surrounded right now by something that feels overwhelming — financial pressure, relational conflict, health crises, spiritual warfare — this story says the visible army is not the whole picture. There is more fighting for you than against you. You just can't see it yet. And that's not a reason for blind optimism. It's a reason to ask for open eyes. The hills are not empty. They never were." },
      ]
    },
    {
      id:"good-samaritan", title:"The Good Samaritan", icon:"🩹", tag:"Who Stops When You're Bleeding",
      color:"#54B868",
      summary:"A man was beaten and left for dead on the side of the road. A priest walked past. A Levite walked past. The one who stopped was the one nobody expected. This story is for anyone who has been passed by — and for anyone who has done the passing.",
      chapters:[
        { title:"The Road to Jericho", text:"The road from Jerusalem to Jericho was seventeen miles of desolate, winding descent through rocky terrain. It was known as the 'Way of Blood' because of how often travelers were attacked. A man was walking this road alone when robbers stripped him, beat him, and left him half dead on the ground. He couldn't move. He couldn't call for help. He could only wait and hope that the next person to come along would stop. This chapter is about the road — the vulnerable season, the exposed moment, the stretch of life where you're at the mercy of whoever passes by. When have you been lying on the side of the road, waiting for someone to notice?" },
        { title:"The Ones Who Passed By", text:"A priest came down the road. He saw the man. And he walked past on the other side. Then a Levite — a religious worker — did the exact same thing. Two people whose entire job was to represent God's compassion chose their schedule, their cleanliness, their comfort over a bleeding man in the dirt. This chapter hits hard because it's common. The people who should have helped didn't. Not strangers. Religious people. People of position. Who has walked past you when you were bleeding? And — harder question — when have you been the one who crossed to the other side?" },
        { title:"The Unlikely One", text:"A Samaritan stopped. In that culture, Jews and Samaritans hated each other. This man had every cultural, racial, and religious reason to keep walking. He owed the bleeding man nothing. But he stopped. He knelt down. He bandaged the wounds, pouring oil and wine on them. He put the man on his own donkey, brought him to an inn, and paid for his care. This chapter is about the help that comes from the person you least expect — and what it means when mercy crosses the lines that hatred drew. Who has shown up for you that you never would have predicted?" },
        { title:"The Cost", text:"The Samaritan didn't just feel compassion — he spent it. He used his own supplies. He gave up his donkey. He paid the innkeeper and said: 'If it costs more, I'll pay you when I return.' Compassion that costs nothing isn't compassion. It's sentiment. This chapter is about the difference between feeling sorry for someone and actually bearing the cost of their healing. Real love disrupts your schedule, empties your wallet, and inconveniences your plans. What would it actually cost you to stop for someone right now?" },
        { title:"Why This Matters to You", text:"Jesus told this story in response to a simple question: 'Who is my neighbor?' The answer demolished every boundary the listener had built. Your neighbor isn't the person who looks like you, believes like you, or lives near you. Your neighbor is whoever is bleeding on your road today. And you're not being asked to feel something about them. You're being asked to stop. Kneel. Bind. Carry. Pay. This story holds a mirror up to two things: the kind of help you need and the kind of help you give. Are you waiting for a priest or willing to receive help from a Samaritan? And when you see someone in the ditch, do you cross over — or do you cross the road?" },
      ]
    },
    {
      id:"zacchaeus", title:"Zacchaeus in the Tree", icon:"🌳", tag:"Seen Despite Your Reputation",
      color:"#C4A96A",
      summary:"He was the most hated man in Jericho — a chief tax collector who'd gotten rich by exploiting his own people. He was also short, so he climbed a tree just to see Jesus. And Jesus stopped, looked up, and invited Himself to dinner. This story is for anyone whose reputation has become a wall between them and grace.",
      chapters:[
        { title:"The Reputation", text:"Zacchaeus was a chief tax collector. In first-century Israel, that meant he worked for Rome — the occupying empire — and skimmed extra money off the top from his own neighbors. He was wealthy because of their poverty. He was comfortable because of their suffering. Everyone knew it. Everyone hated him for it. He was the kind of person you crossed the street to avoid. This chapter is about the reputation that follows you — deserved or not. The version of you that enters the room before you do. What story does your community tell about you? And how much of it is true?" },
        { title:"The Crowd He Couldn't See Past", text:"When Jesus came through Jericho, Zacchaeus wanted to see Him. But the crowd was in the way — and he was too short to see over them. Nobody was going to make room for the tax collector. Nobody was going to lift him up or save him a spot. The same people he'd exploited weren't about to help him get close to Jesus. This chapter is about the barriers your own choices have built between you and what you need. When the consequences of your past become the obstacles to your future. What crowd of your own making is standing between you and the thing you're desperate to see?" },
        { title:"The Tree", text:"So Zacchaeus climbed a sycamore tree. A wealthy, powerful, adult man climbed a tree like a child. He looked ridiculous. He didn't care. His desire to see Jesus was bigger than his dignity. This chapter celebrates the willingness to look foolish in pursuit of something real. The moment you stop managing your image and start moving toward the thing that matters. Sometimes the path to encounter requires you to do something that makes no sense to anyone watching. What would you be willing to look foolish doing if it meant getting closer to God?" },
        { title:"Jesus Looked Up", text:"Out of the entire crowd — hundreds, maybe thousands of people — Jesus stopped at that tree and looked up. He knew Zacchaeus's name. He knew his address. He said: 'Zacchaeus, come down immediately. I must stay at your house today.' Not 'you should come to my sermon.' Not 'clean up your life and then we'll talk.' I'm coming to your house. Now. Today. The crowd was furious — He's going to eat with a sinner? This chapter is about the scandalous specificity of grace. Jesus chose the worst person in town and invited Himself in. What if Jesus isn't waiting for you to come to Him? What if He's already walking toward your tree?" },
        { title:"Why This Matters to You", text:"Zacchaeus stood up and said: 'I will give half of my possessions to the poor. And if I have cheated anybody, I will pay back four times the amount.' Nobody told him to do this. No sermon. No guilt trip. No conditions were placed on the dinner invitation. He simply encountered Jesus — up close, in his own home — and everything changed. Encounter produces transformation that obligation never could. Jesus said: 'Today salvation has come to this house.' Not 'today this man finally got his act together.' Salvation came to him. It walked through his front door uninvited. If you've been trying to change yourself enough to earn God's attention, Zacchaeus says you have it backward. Let Him in first. The change comes after the encounter, not before it." },
      ]
    },
    {
      id:"naaman", title:"Naaman's Healing", icon:"🏊", tag:"When the Cure Offends Your Pride",
      color:"#5488E8",
      summary:"He was a powerful military commander with leprosy. He traveled to Israel expecting a dramatic miracle. The prophet told him to wash in a muddy river seven times. Naaman was furious. This story is for anyone who wants healing but doesn't like the method.",
      chapters:[
        { title:"The Commander", text:"Naaman was the commander of the entire Syrian army. Decorated. Respected. Powerful. He was also a leper — and in that culture, leprosy was a death sentence in slow motion. His body was deteriorating while his career thrived. He had everything the world could offer and a disease the world couldn't cure. This chapter is about the thing you can't fix with success. The wound that your title, your income, your achievements can't touch. What do you have that looks impressive from the outside while something underneath is slowly falling apart?" },
        { title:"The Servant's Suggestion", text:"A young Israelite slave girl — captured in a raid — told Naaman's wife about a prophet in Israel who could heal him. Think about that. The path to Naaman's healing started with the whisper of a captive child. Someone with no power pointed someone with all the power toward the answer. This chapter is about humility in unexpected forms. The wisdom that comes from people you'd never think to ask. God often speaks through the least impressive voice in the room. Whose small, quiet suggestion have you been ignoring because of where it came from?" },
        { title:"The Expectation", text:"Naaman arrived in Israel with horses, chariots, silver, gold, and a letter from the king. He showed up at the prophet Elisha's door expecting a spectacle — a dramatic prayer, a wave of the hand, an impressive ceremony fitting a man of his status. Instead, Elisha didn't even come to the door. He sent a messenger: 'Go wash in the Jordan River seven times.' Naaman was furious. 'The rivers in Damascus are better than this muddy creek. Couldn't I wash in those?' This chapter is about the offense of simplicity. When the answer is too ordinary for your pride. What instruction from God have you resisted because it seemed beneath you?" },
        { title:"The Seventh Time", text:"His servants reasoned with him: 'If the prophet had told you to do something great, wouldn't you have done it? So why not this simple thing?' And Naaman went. He dipped once. Nothing. Twice. Nothing. Three, four, five, six times — still a leper. And on the seventh time, his flesh was restored 'like that of a young boy.' The healing didn't come after the first dip. It came after the seventh. This chapter is about persistence through obedience that doesn't seem to be working. The first six dips looked like failure. Have you been quitting on the sixth dip? What if the breakthrough is one more step of obedience away?" },
        { title:"Why This Matters to You", text:"Naaman almost missed his healing because the method offended him. He wanted fire from heaven and got a muddy river. He wanted drama and got directions. The cure was available the entire time — he just didn't like the packaging. How many of us do the same thing? We pray for healing and then reject the counselor God sends because the process seems too slow. We ask for breakthrough and then refuse the small, daily disciplines because they don't feel spiritual enough. God's prescription doesn't always match your expectation. But it always works. Swallow your pride. Walk into the river. And dip the seventh time." },
      ]
    },
    {
      id:"widows-offering", title:"The Widow's Offering", icon:"🪙", tag:"When Small Is Everything",
      color:"#E85454",
      summary:"Rich people threw large amounts into the temple treasury. A poor widow dropped in two tiny coins. Jesus stopped the room and said she gave more than all of them combined. This story is for anyone who feels like what they have to offer isn't worth giving.",
      chapters:[
        { title:"The Temple Treasury", text:"The scene was public. People lined up to make their offerings while others watched. The wealthy gave large, visible amounts — and the watching was part of the point. Generosity on display. The sound of heavy coins hitting the collection was a social statement as much as a spiritual act. In a world that measures worth by size, the big gifts got the big attention. This chapter is about the systems that celebrate volume over sacrifice. The world that applauds the large donation and doesn't notice the one that actually costs something. Where have you measured your worth by someone else's capacity?" },
        { title:"The Two Coins", text:"She dropped in two small copper coins — together worth less than a penny. The smallest denomination in circulation. It was so small it barely made a sound. In any other story, this moment would have been invisible. No one noticed. No one clapped. No one wrote her name on a plaque. She gave what she had and walked away unseen. This chapter is about the offering that nobody notices. The effort that goes unrecognized. The sacrifice that doesn't make the highlight reel. What have you given that the world considered insignificant?" },
        { title:"Jesus Was Watching", text:"But Jesus was sitting across from the treasury, watching. Of all the things happening in the temple that day, He chose to observe this. And when the widow dropped her coins, He called His disciples over — urgently, specifically. 'Come look at this.' He didn't call them over for the wealthy donors. He called them over for her. This chapter reveals something about what God pays attention to. Not the amount. Not the impact. The cost. God's economy runs on a different metric than the world's. What if God is paying closer attention to your small, costly offerings than to the big, easy ones you see others give?" },
        { title:"More Than All of Them", text:"Jesus said: 'This poor widow has put more into the treasury than all the others. They gave out of their wealth; she gave out of her poverty — everything she had to live on.' Everything. She didn't give from surplus. She gave from survival. Two coins was all she had. Tomorrow was uncertain. And she gave it anyway. This chapter confronts the math of faith: God doesn't calculate your offering by what you gave. He calculates it by what you kept. What does your giving cost you? If it costs you nothing, is it really an offering?" },
        { title:"Why This Matters to You", text:"The widow wasn't trying to make a statement. She wasn't trying to be a lesson. She was simply giving what she could — and Jesus turned it into one of the most remembered moments in the Gospels. Your small offering matters more than you know. The prayer you whisper when you barely have faith. The kindness you extend when you're running on empty. The forgiveness you give when you'd rather hold the grudge. The five minutes you spend helping when you have nothing left. None of it is too small for God's attention. He's not comparing you to the person next to you. He's watching what it costs you. And the offering that costs you everything? That's the one that moves heaven." },
      ]
    },
    {
      id:"bartimaeus", title:"Blind Bartimaeus", icon:"👁️", tag:"Refusing to Be Silenced",
      color:"#E88854",
      summary:"He was blind, begging on the roadside, and when he heard Jesus was passing by, he screamed. The crowd told him to shut up. He screamed louder. This story is for anyone who has been told their need is too loud, too much, too inconvenient — and who refused to stay quiet.",
      chapters:[
        { title:"The Roadside", text:"Bartimaeus sat beside the road leading out of Jericho. Every day. Begging. In that culture, blindness meant total dependence — no work, no income, no dignity. He existed on the margins, surviving on the mercy of strangers who usually walked past. He was defined by his condition and confined by his position. The road was where life happened, and he was beside it. Not on it. This chapter is about the places where life passes you by while you sit on the edge. The career, the relationship, the experience, the joy that seems to be for everyone but you. Where in your life have you been sitting beside the road while the world moves past?" },
        { title:"The Shout", text:"When Bartimaeus heard that Jesus of Nazareth was passing by, he started shouting: 'Jesus, Son of David, have mercy on me!' It wasn't polite. It wasn't dignified. It was a desperate scream from a man who knew this might be his only chance. He couldn't see Jesus. He couldn't walk to Him. All he had was his voice. So he used it. This chapter is about the moment you decide that dignity is less important than deliverance. When the pain is louder than your pride. What would you be crying out for if you stopped caring what people thought?" },
        { title:"The Crowd That Silenced", text:"Many in the crowd rebuked him and told him to be quiet. Be quiet. A blind beggar was disturbing their parade. His desperation was an inconvenience to their experience. This happens constantly — people in pain being told to be less loud, less visible, less disruptive. To wait their turn. To not make a scene. But Bartimaeus shouted all the more. Louder. Harder. The crowd tried to silence him and it only amplified his cry. This chapter is about the voices that try to quiet your need. Who has told you to sit down, calm down, or keep it together when everything inside you was screaming for help?" },
        { title:"Jesus Stood Still", text:"One detail changes the entire story: 'Jesus stood still.' The Creator of the universe, in the middle of a crowd, surrounded by noise and movement — stopped. For one blind beggar that the crowd tried to silence. He said: 'Call him.' And the same crowd that told Bartimaeus to shut up suddenly changed their tune: 'Cheer up! He's calling you!' Bartimaeus threw off his cloak — the one possession a beggar had — jumped up, and came to Jesus. This chapter is about the moment God hears your cry. He stops. He turns. He calls your name. And everything shifts." },
        { title:"Why This Matters to You", text:"Jesus asked Bartimaeus a question that seems strange: 'What do you want me to do for you?' He was obviously blind. The answer was obvious. But Jesus wanted him to name it. Out loud. In front of everyone. 'Rabbi, I want to see.' And immediately he received his sight and followed Jesus along the road. Not beside the road anymore. On it. If you've been silenced — by culture, by crowds, by shame, by people who thought your need was too much — this story says scream louder. Don't let anyone tell you your desperation is inappropriate. The one who matters most isn't annoyed by your cry. He's stopped by it. Name what you need. Don't hedge it. Don't minimize it. Say it out loud. And watch the God who stands still for beggars turn toward you." },
      ]
    },
    {
      id:"cain-abel", title:"Cain & Abel", icon:"🌾", tag:"When Bitterness Toward a Sibling Poisons Everything",
      color:"#6A8A9A",
      summary:"Two brothers brought offerings to God. One was accepted. One wasn't. And instead of examining his own heart, Cain fixated on his brother — until the resentment consumed everything. This story is for anyone who has let comparison or jealousy toward someone close to them turn into something darker.",
      chapters:[
        { title:"The Two Offerings", text:"Cain brought fruit from the soil. Abel brought the firstborn of his flock — the best he had. God accepted Abel's offering and rejected Cain's. The text doesn't spell out exactly why, but the pattern is clear: Abel gave his best. Cain gave something. There's a difference between showing up and sacrificing. Between going through the motions and offering the first of what you have. This chapter is about the quality of what we bring to God — and the sting when someone else's offering is received and ours isn't. When have you given less than your best and resented someone who didn't?" },
        { title:"The Question", text:"God saw Cain's anger and asked: 'Why are you angry? Why is your face downcast? If you do what is right, will you not be accepted?' God didn't reject Cain. He rejected Cain's offering. And He gave Cain a clear path back: do what is right. The door was open. But Cain didn't hear the invitation. He only heard the comparison. This chapter is about the difference between conviction and condemnation — and our tendency to hear rejection when God is offering correction. When has God tried to redirect you and you heard it as rejection instead?" },
        { title:"Sin Crouching at the Door", text:"God gave Cain a warning so vivid it echoes through centuries: 'Sin is crouching at your door; it desires to have you, but you must rule over it.' Sin as an animal. Waiting. Patient. Ready to pounce the moment you open the door. Cain heard the warning. He understood it. And he invited his brother out to a field and killed him. He walked past the warning and straight into the worst decision a human had ever made. This chapter is about the moment between the impulse and the action. The warning that comes before the fall. What is crouching at your door right now that you're pretending isn't there?" },
        { title:"Am I My Brother's Keeper?", text:"God asked Cain: 'Where is your brother?' Cain's response is the most brazen lie in Scripture: 'I don't know. Am I my brother's keeper?' He knew exactly where Abel was. And God knew too. This chapter confronts the deflection that follows sin — the attempt to minimize, deny, or reframe what you've done. The question 'am I my brother's keeper?' has echoed through history as an excuse for indifference. But God's answer, implied in everything that follows, is yes. Yes, you are. When have you deflected responsibility for how your actions affected someone else?" },
        { title:"Why This Matters to You", text:"Cain's story didn't start with murder. It started with comparison. Then came jealousy. Then anger. Then isolation. Then violence. That's always the path — bitterness never stays small. It grows in the dark, feeds on silence, and eventually swallows everything in its reach. If you're carrying resentment toward a sibling, a coworker, a friend — someone whose blessing makes your heart burn — this story is a mirror, not just a cautionary tale. You are not Cain yet. But sin is crouching at your door. The antidote isn't pretending you're not angry. It's going back to God with a better offering. Not a better performance — a more honest heart. Name the jealousy before it names you." },
      ]
    },
    {
      id:"ten-lepers", title:"The Ten Lepers", icon:"🙏", tag:"The One Who Came Back",
      color:"#9E6CC8",
      summary:"Ten lepers begged Jesus to heal them. He did. All ten were cleansed. Only one came back to say thank you — and he was a Samaritan, the outsider. This story is for anyone who has received from God and forgotten to return, and for anyone who knows what it means to come back grateful.",
      chapters:[
        { title:"The Distance", text:"They stood at a distance. That's what lepers had to do — stay away from everyone, announce their uncleanness, live on the margins. Ten of them, united by the one thing healthy people didn't want to touch. And when they saw Jesus, they raised their voices together: 'Jesus, Master, have pity on us!' Desperation erases every other distinction. They didn't care about each other's background, nationality, or history. They were all sick. They all needed help. This chapter is about the prayers born from shared pain. The moments when pretense drops and all that's left is a cry. When was the last time you prayed with nothing to prove — just raw, honest need?" },
        { title:"The Instruction", text:"Jesus didn't touch them. He didn't pray over them. He said: 'Go show yourselves to the priests.' That was the protocol for someone healed of leprosy — you went to the priest to be declared clean. But they weren't healed yet. He was asking them to act as if the healing had already happened. To walk toward the confirmation before the miracle was visible. This chapter is about the faith of the first step — moving before you see the result. They were healed 'as they went.' Not before they went. While they went. What is God asking you to walk toward before you see the change?" },
        { title:"The Nine", text:"As they walked, their skin cleared. Their disease vanished. All ten were healed. And nine of them kept walking. They went to the priests. They returned to their families. They resumed their lives. And they never came back. Nine out of ten. This chapter doesn't demonize the nine — it understands them. When you've been desperate for so long, the relief of healing can carry you right past the healer. The urgent need to get back to normal can drown out everything else. When has God answered a prayer and you moved on so fast you forgot to acknowledge it?" },
        { title:"The One", text:"One man — a Samaritan, the outsider among outsiders — turned back. He came to Jesus, fell at His feet, and praised God in a loud voice. The same voice that cried for mercy now cried with gratitude. Jesus asked a question that carries more weight than it seems: 'Were not all ten cleansed? Where are the other nine? Has no one returned to give praise except this foreigner?' This chapter is about the radical act of returning. Not just feeling grateful — demonstrating it. Not just receiving the blessing — honoring the source. Who or what do you need to go back and thank?" },
        { title:"Why This Matters to You", text:"Jesus said to the one who returned: 'Rise and go; your faith has made you well.' All ten were healed. But only one was made well. There's a difference. Healing fixes what's broken. Wellness transforms who you are. The nine were healed of leprosy. The one was made whole — body, soul, and relationship with God. Gratitude isn't just good manners. It's the doorway to a deeper kind of restoration. If you've been receiving from God without returning to Him — if the blessings have been flowing and the thank-yous have been sparse — this story says turn around. Go back. Fall at His feet. Because what's waiting for you in the return is bigger than what you received in the healing." },
      ]
    },
    {
      id:"david-psalm51", title:"David's Broken Psalm", icon:"📜", tag:"The Prayer After the Worst Thing You've Done",
      color:"#E85454",
      summary:"David — the man after God's own heart — committed adultery, arranged a murder to cover it up, and lived in denial until a prophet looked him in the eye and said 'you are the man.' Psalm 51 is what David prayed next. This story is for anyone who needs to know what repentance sounds like when the sin is real.",
      chapters:[
        { title:"The Fall", text:"It started on a rooftop. David saw Bathsheba bathing and sent for her. He was the king. She couldn't refuse. What's often called an affair was a grotesque abuse of power — the most powerful man in the nation taking what he wanted from a woman who had no ability to say no. Then she became pregnant. And David, the hero of Israel, the giant-slayer, the psalm-writer — began scheming. He tried to cover it up. When that failed, he sent her husband Uriah to the front lines with orders ensuring his death. The man who once trusted God with a sling now trusted deception with a life. This chapter is about the fall — how far a good person can descend when they stop guarding their heart." },
        { title:"The Silence", text:"After Uriah died, David married Bathsheba. And the text says something chilling: 'But the thing David had done displeased the Lord.' David went on with his life. Months passed. He sat on his throne, made decisions, probably even worshipped. He was functioning. But he was dead inside. Psalm 32 describes this season: 'When I kept silent, my bones wasted away through my groaning all day long. Day and night your hand was heavy on me.' Unconfessed sin doesn't rest. It rots. This chapter is about the weight of what you're carrying in secret. The months of pretending everything is fine while something inside you decays. What have you been silent about that is wasting you from within?" },
        { title:"You Are the Man", text:"God sent the prophet Nathan. He told David a story about a rich man who stole a poor man's only lamb. David was outraged: 'The man who did this deserves to die!' And Nathan said four words that shattered everything: 'You are the man.' The mirror dropped. The disguise fell. David couldn't run, couldn't spin, couldn't reframe. He was exposed — to Nathan, to himself, to God. This chapter is about the moment truth arrives uninvited and you can no longer hide from what you've done. When has someone or something held up a mirror you couldn't look away from?" },
        { title:"The Psalm", text:"David's response was not excuses. Not bargaining. Not minimizing. It was Psalm 51: 'Have mercy on me, O God. Wash me. Cleanse me. Against You, You only, have I sinned. Create in me a clean heart. Do not cast me from Your presence. A broken and contrite heart, You will not despise.' This is the anatomy of real repentance. No blame-shifting. No 'but.' No explanations. Just a man standing in the full weight of what he's done and throwing himself completely on the mercy of God. This chapter invites you into that kind of prayer — not the polished kind, but the kind that comes from someone who has run out of ways to fix themselves." },
        { title:"Why This Matters to You", text:"David's sin had real consequences. The child died. His family was fractured. Violence followed his household for generations. Repentance doesn't erase consequences. But it does restore relationship. God called David 'a man after My own heart' — not because David was sinless, but because when David sinned, he didn't run from God. He ran to Him. If you've done something you can't undo — something that genuinely hurt people, something that haunts you, something you've never spoken out loud — Psalm 51 says there's a way back. Not around the pain. Through it. The sacrifice God wants isn't your performance. It's your honesty. A broken and contrite heart — that's the offering He never turns away." },
      ]
    },
    {
      id:"dry-bones", title:"The Valley of Dry Bones", icon:"💀", tag:"When Dead Things Come Back to Life",
      color:"#6A8A9A",
      summary:"God set Ezekiel in the middle of a valley filled with bones — dry, scattered, and lifeless. Then He asked a question that still echoes: 'Can these bones live?' This story is for anyone looking at something in their life that appears completely dead and wondering if resurrection is still possible.",
      chapters:[
        { title:"The Valley", text:"God didn't take Ezekiel to a garden or a mountaintop. He set him in the middle of a valley — a low place, surrounded by walls — and the ground was covered with bones. Not skeletons. Bones. Scattered, disconnected, bleached by the sun. The text adds one devastating detail: they were very dry. Not recently dead. Long dead. Beyond dead. Whatever life had been here was so far gone that even hope seemed absurd. This chapter is about the valley — the season when you look around your life and everything that was once alive is now bones on the ground. The marriage. The dream. The faith. The friendship. What valley are you standing in where everything looks irreversibly dead?" },
        { title:"The Question", text:"God asked Ezekiel: 'Son of man, can these bones live?' It's the most honest question in Scripture because it has no obvious answer. Ezekiel didn't say yes. He didn't say no. He said: 'Sovereign Lord, You alone know.' That's the prayer of someone who has stopped pretending they have answers but hasn't stopped believing God might. This chapter sits in the uncertainty between death and resurrection. Between the evidence and the hope. When someone asks you if the dead thing in your life can come back, what do you say? Can you hold the tension of not knowing while still leaving room for God?" },
        { title:"Prophesy to the Bones", text:"God told Ezekiel to preach to the bones. To open his mouth and speak life to dead things. Imagine the absurdity — a man standing alone in a valley, preaching to a skeleton audience. But he obeyed. And as he spoke, there was a rattling sound. Bones began connecting. Tendons appeared. Flesh covered them. Skin formed. But there was no breath. They were bodies without life. This chapter is about the obedience that precedes the miracle. Speaking when it makes no sense. Declaring truth over something that shows no signs of responding. What dead thing in your life does God want you to speak to — even though it hasn't moved yet?" },
        { title:"The Breath", text:"God told Ezekiel to prophesy to the breath — the wind, the Spirit. 'Come from the four winds and breathe into these slain, that they may live.' And breath entered them. They stood up on their feet — a vast army. The bones that were scattered and dry were now standing, alive, unified, and powerful. Structure came first, then breath. Formation before animation. This chapter reveals that God's restoration has an order. Sometimes you'll see movement before you feel alive. Sometimes the pieces come together before the Spirit fills them. Don't mistake incomplete restoration for failed restoration." },
        { title:"Why This Matters to You", text:"God told Ezekiel what the vision meant: 'These bones are the whole house of Israel. They say: our bones are dried up and our hope is gone; we are cut off.' The bones had a voice before they had breath. They were already saying 'it's over.' And God's response was not 'you're right.' It was: 'I am going to open your graves and bring you up. I will put my Spirit in you and you will live.' If you've been saying 'it's over' about something in your life — your faith, your purpose, your joy, your relationships — God is not agreeing with you. He's asking the same question He asked Ezekiel: Can these bones live? And the answer isn't up to the bones. It's up to the breath. And the breath is His to give." },
      ]
    },
    {
      id:"samson", title:"Samson's Strength", icon:"⛓️", tag:"When Your Gift Becomes Your Downfall",
      color:"#E85454",
      summary:"The strongest man who ever lived. Set apart by God before birth. Given supernatural power that toppled armies. And he wasted it — on impulse, on lust, on pride — until the gift that was supposed to liberate a nation became the chain that destroyed him. This story is for anyone whose greatest strength has become their greatest vulnerability.",
      chapters:[
        { title:"The Gift", text:"Before Samson was born, an angel appeared to his mother and said: this child will be set apart for God. A Nazirite from the womb. His strength wasn't earned — it was given. Supernatural, unmatchable, terrifying strength. He killed a lion with his bare hands as a teenager. He defeated a thousand men with a donkey's jawbone. He was the most physically powerful human being who ever lived. And yet the gift was never the point — it was a tool for a purpose. This chapter is about the gifts God gives and what happens when we start worshipping the gift instead of the Giver. What strength has God given you that you've started to take ownership of?" },
        { title:"The Pattern", text:"Samson had a pattern: see, want, take. He saw a Philistine woman — wanted her. He saw honey in a lion's carcass — took it, breaking his Nazirite vow. He saw a prostitute in Gaza — went to her. Every decision was driven by impulse, by appetite, by the assumption that strength meant he could have whatever he wanted without consequences. This chapter is about the patterns we refuse to name. The cycles that keep repeating because we're too strong — or too proud — to admit they own us. What pattern in your life keeps showing up no matter how many times you promise yourself it won't?" },
        { title:"Delilah", text:"The Philistines sent Delilah to find the source of his strength. She asked him directly — three times he lied, three times she tested him, three times he should have walked away. He didn't. He told her everything. Not because he was tricked. Because he was tired of carrying the secret. Because intimacy with the wrong person felt safer than isolation with God. She cut his hair while he slept — and his strength left him. This chapter is about the relationships that cost you everything. The person you keep going back to even though they've shown you who they are. Who are you giving the secret of your strength to?" },
        { title:"The Grinding", text:"They gouged out his eyes. They bound him with bronze shackles. They put him in prison grinding grain — the work of an animal. The strongest man alive, blind and enslaved, walking in circles. Day after day. The same path. The same darkness. But the text adds one quiet line: 'But the hair on his head began to grow again.' In the grinding, in the darkness, in the consequence — something was being restored. This chapter is about the seasons of grinding. When you're paying for your choices and the days blur together. What is God quietly growing back in you while you walk your hardest road?" },
        { title:"Why This Matters to You", text:"They brought Samson out to entertain them at a feast — their trophy. He asked a boy to lead him to the pillars that supported the temple. And he prayed — for the first time in the story, Samson prayed — 'Sovereign Lord, remember me. Please, God, strengthen me just once more.' He pushed the pillars apart and the temple collapsed. He killed more in his death than in his life. It's a tragic, complicated ending. But it's also proof that God doesn't abandon the people who wasted their gift. If you've squandered something God gave you — talent, opportunity, calling, relationship — Samson's story says the grinding isn't the end. The hair grows back. The strength returns. Not for the same reckless purposes, but for one final, surrendered act of purpose. It's not too late to pray the prayer you should have prayed at the beginning." },
      ]
    },
    {
      id:"gethsemane", title:"The Garden of Gethsemane", icon:"🫒", tag:"Surrendering Your Will",
      color:"#9E6CC8",
      summary:"The night before He died, Jesus fell on His face in a garden and begged His Father for another way. He sweat drops of blood. He asked three times. And then He said the hardest words any human has ever spoken: 'Not my will, but Yours be done.' This story is for anyone wrestling between what they want and what God is asking.",
      chapters:[
        { title:"The Garden", text:"After the last supper, Jesus took Peter, James, and John into the garden of Gethsemane. He told them: 'My soul is overwhelmed with sorrow to the point of death. Stay here and keep watch.' The Son of God was drowning in grief. He didn't hide it. He didn't power through it. He said: I am being crushed and I need you close. This chapter sits with the honesty of that moment. The God of the universe, in human skin, asking for companionship in His darkest hour. When was the last time you told someone the truth about how heavy things really are?" },
        { title:"The Prayer", text:"He went a little farther, fell on His face, and prayed: 'My Father, if it is possible, let this cup pass from me.' He wasn't performing faith. He was bargaining with pain. He knew what was coming — not just the cross, but the full weight of every sin, every shame, every separation from God that humanity had ever produced. And He asked: is there another way? This chapter honors the prayer that asks God to change the plan. The one that says: I know what You're asking and I don't want to do it. Have you ever prayed a prayer that honest with God about something He was asking you to walk through?" },
        { title:"The Sleeping Disciples", text:"He came back and found them asleep. Three times He prayed. Three times He returned to find them unconscious. 'Could you not keep watch for one hour?' The loneliest moment in human history — the people closest to Him couldn't stay awake. This chapter is about the aloneness that comes in your hardest moments. When the people you need most can't stay with you. Not because they don't love you — because they don't understand the weight of what you're carrying. Whose absence have you felt most painfully in your darkest hour?" },
        { title:"Not My Will", text:"The third time, Jesus prayed the words that split history: 'Not my will, but Yours be done.' Not a resigned sigh. Not passive acceptance. An active, conscious decision to surrender His own desire to the Father's purpose. The cup didn't pass. The plan didn't change. But Jesus stood up from that prayer different — not relieved, but resolved. This chapter is about the most difficult prayer a human being can pray. The one that says: I've told You what I want, and now I'm releasing it. What are you still gripping that God is asking you to surrender?" },
        { title:"Why This Matters to You", text:"Luke's gospel adds a detail the others don't: an angel appeared and strengthened Him. Not removed the cup. Strengthened Him to drink it. And His sweat became like drops of blood — a medical condition called hematidrosis, caused by extreme psychological stress. This wasn't serene. This was agony. And it was chosen. If you're facing something you've begged God to remove and the answer has been silence — Gethsemane says you're not alone in the asking. Jesus asked too. Three times. The surrender wasn't instant. It was wrestled. And the strength to walk through what you can't avoid doesn't come before the surrender — it comes after. Say the prayer. Mean it. And then stand up. The angel comes after the 'not my will,' not before it." },
      ]
    },
    {
      id:"feeding-5000", title:"The Feeding of the 5,000", icon:"🍞", tag:"When What You Bring Isn't Enough — Until It Is",
      color:"#54B868",
      summary:"Five thousand hungry people. The disciples had five loaves and two fish. Jesus didn't send the crowd away. He took what wasn't enough, blessed it, broke it, and it fed everyone with twelve baskets left over. This story is for anyone who looks at what they have and thinks it's too little to matter.",
      chapters:[
        { title:"The Crowd That Followed", text:"They followed Jesus into a remote place. Thousands of people — hungry, tired, far from home. The disciples saw a logistics problem: too many people, not enough food, no nearby town. Their instinct was reasonable: send them away. Let them figure it out themselves. We can't handle this. This chapter is about the moments when the need in front of you is so overwhelming that the only sane response seems to be to walk away. When have you looked at a situation and thought: this is too big for me, I need to send it away?" },
        { title:"What Do You Have?", text:"Jesus didn't accept the disciples' solution. He said: 'You give them something to eat.' They were stunned. With what? Andrew found a boy with five small loaves and two fish. And then said the most relatable sentence in the Gospels: 'But what are these among so many?' It was laughable. Five loaves for five thousand. This chapter asks the question Jesus kept asking: what do you have? Not what do you wish you had. Not what would be ideal. What's actually in your hands right now — however inadequate it looks?" },
        { title:"The Blessing and the Breaking", text:"Jesus took the five loaves and two fish, looked up to heaven, and gave thanks. He blessed what wasn't enough before He multiplied it. Then He broke the bread. The multiplication happened in the breaking. Not before. This chapter reveals a pattern God uses constantly: He blesses, then He breaks, then He multiplies. The breaking isn't destruction — it's distribution. Nothing multiplies whole. It has to be broken to be shared. What is God breaking in your life right now that might be preparation for multiplication?" },
        { title:"Twelve Baskets Left Over", text:"Everyone ate. Everyone was satisfied. And then the disciples picked up twelve baskets of leftovers — more than they started with. The miracle didn't just meet the need. It exceeded it. God's math doesn't follow ours. He doesn't do 'just enough.' He does abundantly more than we ask or imagine. But the abundance only appeared after obedience. After they brought the little they had. After they let it be blessed and broken. This chapter is about the overflow that follows surrender. What overflow might be waiting on the other side of releasing what you've been holding back?" },
        { title:"Why This Matters to You", text:"There was a boy in this story who doesn't get enough credit. He had a lunch. A small, personal, probably-packed-by-his-mother lunch. And when asked, he gave it up. He could have kept it — it was his, after all. But he handed it over. And it fed a nation. Your 'not enough' in God's hands is more than enough. Your small gift, your limited energy, your half-finished talent, your fragile faith — brought to Jesus and released — becomes the raw material for a miracle. Stop calculating whether you have enough. Start bringing what you have. The blessing and the breaking and the multiplying — that's His job. Your job is to show up with the lunch." },
      ]
    },
    {
      id:"older-brother", title:"The Prodigal's Older Brother", icon:"😤", tag:"The Bitterness of the Faithful",
      color:"#E88854",
      summary:"Everyone talks about the prodigal son who left. Almost no one talks about the brother who stayed — who did everything right, never rebelled, never left — and was furious when his father threw a party for the one who did. This story is for the faithful ones who are secretly angry about it.",
      chapters:[
        { title:"The One Who Stayed", text:"While the younger brother was wasting his inheritance in a distant country, the older brother was in the field. Working. Every day. No rebellion. No wandering. No dramatic failure. He stayed home, did his chores, honored his father, and kept the farm running. By every visible measure, he was the good son. And nobody threw him a party. This chapter is for the people who stayed. Who showed up. Who didn't wander. Who did the right thing year after year — and watched someone else get celebrated for simply coming back. What has your faithfulness cost you? And has anyone noticed?" },
        { title:"The Music He Didn't Expect", text:"The older brother came in from the field and heard music and dancing. He didn't know what was happening — which means no one told him. No one came to the field to say: your brother is home. He had to ask a servant. This chapter sits with a specific kind of pain: being left out of the celebration. Working while others feast. Being the last to know. Finding out secondhand that something important happened and no one thought to include you. When have you been working in the field while the party happened without you?" },
        { title:"The Refusal", text:"When he found out the party was for his brother, he refused to go in. He stood outside — close enough to hear the music, stubborn enough not to enter. And his father came out to him. Just like he ran to the younger son, he went to the older one. But this son wasn't in a distant country. He was right outside the door, and the distance was all internal. This chapter is about the people who are close to God's house but won't go inside. Whose anger has them standing in the yard while grace is being served at the table. What celebration have you refused to join because you felt it wasn't fair?" },
        { title:"The Accusation", text:"'All these years I've been slaving for you and never disobeyed your orders. Yet you never gave me even a young goat so I could celebrate with my friends. But when this son of yours who squandered your property comes home, you kill the fattened calf for him.' Listen to the language. 'Slaving' — not serving. 'Your orders' — not our relationship. 'This son of yours' — not my brother. The older brother had been keeping score the entire time. His obedience wasn't love — it was a transaction. And the bill had come due. This chapter asks the hardest question: is your faithfulness motivated by love or by the expectation of reward?" },
        { title:"Why This Matters to You", text:"The father's response is the most tender correction in Scripture: 'Son, you are always with me, and everything I have is yours.' You didn't need to earn a party. Everything was already yours. You've been living like a servant in a house where you're a son. The older brother's problem wasn't his faithfulness — it was his framework. He was faithful for the wrong reasons. And when grace showed up for someone who didn't deserve it, his whole system collapsed. If you've been keeping score — tallying your obedience, measuring your sacrifice, comparing your faithfulness to someone else's failure — this story holds up a mirror. You are not a slave. You are a son. Everything the Father has is already yours. Stop working for what you already have. And go inside. The party isn't a threat to you. It's an invitation." },
      ]
    },
    {
      id:"stephen", title:"Stephen's Martyrdom", icon:"✝️", tag:"Faith That Doesn't Flinch",
      color:"#5488E8",
      summary:"He was the first Christian martyr — dragged before a council, falsely accused, and stoned to death. But as the rocks hit his body, his face looked like an angel's, and his last words were forgiveness. This story is for anyone who has been punished for doing the right thing and wonders if it was worth it.",
      chapters:[
        { title:"Full of Grace and Power", text:"Stephen wasn't an apostle. He was chosen to serve tables — literally selected to manage food distribution for widows. But the text says he was 'full of God's grace and power' and 'performed great wonders and signs among the people.' His title was small. His impact was enormous. This chapter is about the disconnect between your role and your anointing. When God's power in you exceeds the box people have put you in. Stephen's assignment was logistics. His reality was miracles. What has God placed in you that is bigger than the position you've been given?" },
        { title:"The False Accusation", text:"Religious leaders couldn't match Stephen's wisdom, so they did what people do when they can't win the argument — they lied. They produced false witnesses who said Stephen was speaking against Moses and God. The charges were fabricated. The trial was rigged. He was standing before a council that had already decided the verdict before he opened his mouth. This chapter is about being falsely accused. When your integrity becomes a threat and the response is slander. When has someone twisted your words or your motives because they couldn't handle your truth?" },
        { title:"The Face of an Angel", text:"As Stephen stood before the council, everyone looked at his face — and it was like the face of an angel. In the middle of a death trial. Surrounded by liars. Facing execution. And his face was radiant. Not defiant. Not terrified. Peaceful. This chapter explores what it looks like when internal peace refuses to match external chaos. When your circumstances say panic but your spirit says something else entirely. What would it look like for your countenance to contradict your situation?" },
        { title:"The Sermon", text:"Stephen didn't beg for his life. He preached the longest sermon in the book of Acts — a sweeping history of Israel, exposing how God's people had always rejected the ones God sent. He spoke truth to power knowing it would cost him everything. And at the end, he said: 'I see heaven open and the Son of Man standing at the right hand of God.' Jesus stands for His martyrs. This chapter is about the courage to speak truth even when the room has already decided against you. What truth are you holding back because the cost of speaking it feels too high?" },
        { title:"Why This Matters to You", text:"They dragged him out and stoned him. And as the rocks struck his body, Stephen knelt down and cried: 'Lord, do not hold this sin against them.' His last breath was spent forgiving the people killing him. Standing nearby, holding the coats of those throwing stones, was a young man named Saul — who would later become the apostle Paul. Stephen's death planted a seed in the man who would change the world. You may never see the fruit of your faithfulness. The thing that costs you the most might produce a harvest you'll never witness. But it's not wasted. Stephen's story says: when you do the right thing and it costs you everything, heaven stands. And the seed you plant in your suffering might grow in someone standing at the edge of the crowd." },
      ]
    },
    {
      id:"talents", title:"The Parable of the Talents", icon:"💰", tag:"What You Do With What You're Given",
      color:"#C4A96A",
      summary:"A master gave three servants different amounts before leaving on a journey. Two invested and doubled theirs. One buried his in the ground out of fear. When the master returned, the one who buried his talent lost everything. This story is for anyone sitting on something God gave them because they're afraid to risk it.",
      chapters:[
        { title:"The Distribution", text:"The master didn't give equally — he gave according to ability. Five talents to one, two to another, one to the last. This wasn't random. He knew them. He knew their capacity, their character, their potential. And he left. No instructions. No playbook. No check-ins. Just: here's what I've entrusted to you. Now I'm leaving. What you do with it is your choice. This chapter is about the unequal distribution of gifts and the pressure of stewardship. You didn't choose what you received. But you're responsible for what you do with it. What has God entrusted to you — and are you using it or debating whether it's enough?" },
        { title:"The Two Who Invested", text:"The servant with five talents went immediately and put them to work. He traded, risked, invested — and doubled his money. The servant with two did the same. Both took what they were given and put it in motion. Neither waited for perfect conditions. Neither asked for more before they started. They worked with what was in their hands. This chapter is about action over analysis. About using what you have now instead of waiting until you have more. What talent, skill, resource, or calling have you been sitting on, waiting for the 'right time' to deploy?" },
        { title:"The One Who Buried", text:"The servant with one talent dug a hole in the ground and buried it. When the master returned, his explanation was revealing: 'I knew you were a hard man. I was afraid, and I went out and hid your talent in the ground. Here — it's exactly what you gave me.' He returned it untouched. Unrisked. Unproductive. His problem wasn't laziness — it was a distorted view of the master. He saw God as harsh and demanding, so he played it safe. This chapter confronts the fear that keeps you from using what God gave you. What wrong belief about God is causing you to bury what He entrusted?" },
        { title:"The Accounting", text:"The master's response to the first two was identical: 'Well done, good and faithful servant. You have been faithful with a few things; I will put you in charge of many things.' He didn't measure them against each other. Five talents doubled and two talents doubled received the same praise. But to the one who buried his talent: 'You wicked, lazy servant. Take the talent from him and give it to the one who has ten.' The unused gift was removed. This chapter is about God's economy: faithfulness is rewarded with more. Inaction leads to loss. What might God be waiting to entrust you with that depends on you using what you already have?" },
        { title:"Why This Matters to You", text:"The parable ends with a principle that sounds unfair but runs through all of Scripture: 'To everyone who has, more will be given. But the one who does not have — even what they have will be taken away.' This isn't about wealth. It's about stewardship. The person who invests their gift, risks their talent, uses their calling — even imperfectly — receives more. The person who buries it out of fear eventually loses it entirely. You have a talent. Maybe just one. And it's not buried because you're lazy — it's buried because you're scared. Scared of failure, judgment, inadequacy, exposure. But the master didn't ask for perfection. He asked for faithfulness. Dig it up. Risk it. Put it to work. 'Well done' is waiting for the person who tried — not the person who hid." },
      ]
    },
    {
      id:"psalm23", title:"Psalm 23", icon:"🐑", tag:"The Shepherd in the Darkest Valley",
      color:"#54B868",
      summary:"Six verses. The most memorized, most quoted, most whispered-in-hospital-rooms passage in all of Scripture. David wrote it not from a place of comfort but from a life acquainted with valleys, enemies, and the shadow of death. This story is for anyone who needs to be reminded that they are not walking alone.",
      chapters:[
        { title:"The Lord Is My Shepherd", text:"'The Lord is my shepherd; I shall not want.' The entire psalm rests on the first five words. If the Lord is your shepherd, then you are a sheep. Sheep aren't powerful. They aren't fast. They aren't independent. They are dependent by design — and they thrive only under the care of someone who knows the terrain. David, who spent years actually shepherding sheep, knew what this meant: the shepherd doesn't just lead. He provides, protects, rescues, and carries. This chapter reframes dependence not as weakness but as the natural position of someone who is loved. Can you say these five words — 'the Lord is my shepherd' — and mean it? What would it change if you actually lived as if you weren't in charge?" },
        { title:"Green Pastures and Still Waters", text:"'He makes me lie down in green pastures. He leads me beside still waters. He restores my soul.' The shepherd doesn't take sheep to rushing rivers. Sheep are afraid of moving water — they'll dehydrate before they drink from a stream. The shepherd finds still water. Quiet water. Safe water. And sometimes He makes you lie down — because sheep, like people, don't rest voluntarily when they're anxious. This chapter is about the rest you won't take unless someone makes you. The restoration that requires stillness you've been avoiding. Where is God leading you to rest that you keep resisting?" },
        { title:"The Valley of the Shadow", text:"'Even though I walk through the valley of the shadow of death, I will fear no evil, for You are with me.' Notice: through, not into. Not stuck. Not abandoned. Through. The valley is real. The shadow is real. The death — or the fear of it — is real. But the direction is forward, and the presence is constant. And notice the shift in language: the psalm goes from 'He' to 'You.' In the valley, God isn't distant. He's close enough to address directly. This chapter is for the valley you're in right now. The one with shadows. What if the shadow proves there's a light source you can't see yet?" },
        { title:"The Table in the Presence of Enemies", text:"'You prepare a table before me in the presence of my enemies.' Not after the enemies leave. Not when the battle is over. In their presence. God doesn't wait for your circumstances to improve before He feeds you. He sets the table while the opposition watches. This is one of the most defiant images in Scripture — a feast in the middle of a battlefield. This chapter is about the provision that doesn't depend on peace. The nourishment that comes in the middle of the fight. What enemy is watching while God prepares something for you that they can't touch?" },
        { title:"Why This Matters to You", text:"'Surely goodness and mercy shall follow me all the days of my life, and I shall dwell in the house of the Lord forever.' The word 'follow' in Hebrew is more aggressive than it sounds — it means pursue, chase, hunt down. Goodness and mercy are not walking politely behind you. They are chasing you. Every day. Through every valley, past every enemy, beyond every shadow. You are being hunted by grace. If this psalm feels distant, read it slower. Read it as if God wrote it directly to you — because He did. You are the sheep. He is the shepherd. The valley is temporary. The table is set. The oil is on your head. And goodness and mercy are running after you right now, whether you feel them or not. You are not walking alone. You never were." },
      ]
    },
    {
      id:"lots-wife", title:"Lot's Wife", icon:"🧂", tag:"The Cost of Looking Back",
      color:"#E88854",
      summary:"God sent angels to pull Lot's family out of a burning city. The instruction was simple: run and don't look back. Lot's wife looked back. And she became a pillar of salt. This story is for anyone who keeps turning around toward the thing God is pulling them away from.",
      chapters:[
        { title:"The City", text:"Sodom was home. Whatever it had become — corrupt, violent, condemned — it was where Lot's family had built their life. Their house, their routines, their neighbors, their normal. When the angels arrived and said 'get out — this place is about to be destroyed,' it wasn't just a rescue. It was an uprooting. Leave everything you know. Tonight. Now. Don't pack. Don't plan. Just go. This chapter is about the moment God says leave — a relationship, a job, a season, a mindset — and the weight of what you're walking away from. What has God told you to leave that still feels like home?" },
        { title:"The Hesitation", text:"The text says something startling: Lot hesitated. The angels had to grab him and his family by the hands and physically pull them out of the city. They didn't run toward freedom. They had to be dragged. Even when destruction was announced, even when the warning was clear, even when angels were standing in their living room — they lingered. This chapter is about the pull of the familiar, even when the familiar is killing you. What condemned thing in your life still has a grip on your hand?" },
        { title:"The Instruction", text:"'Flee for your lives! Don't look back, and don't stop anywhere in the plain.' One instruction. One boundary. Don't look back. It sounds simple. But behind that command was everything: Don't look back at the house. Don't look back at the life. Don't look back at the comfort, the identity, the version of yourself that belonged to that place. Looking back isn't just a physical act — it's an attachment. A refusal to release. A heart still tethered to what God has already condemned. This chapter asks: What are you still looking back at that God has already told you to leave behind?" },
        { title:"The Pillar of Salt", text:"She looked back. And she became a pillar of salt — frozen in the posture of longing for what was behind her. The text doesn't say she ran back. She just looked. But the looking revealed where her heart actually was. Her body was moving forward. Her soul was still in Sodom. This chapter confronts the gap between physical obedience and emotional attachment. You can leave a place with your feet and never leave it with your heart. Where have you physically moved on but emotionally stayed?" },
        { title:"Why This Matters to You", text:"Jesus referenced Lot's wife centuries later with just three words: 'Remember Lot's wife.' He brought her up when talking about the cost of discipleship. She's not a punchline. She's a warning — and a deeply human one. Because looking back is the most natural thing in the world. We all do it. The ex we check on. The old life we scroll through. The season we romanticize. The sin we've 'left' but still fantasize about. God isn't asking you to pretend the past didn't exist. He's asking you not to let it compete with where He's taking you. The road forward requires your whole heart — not just your feet. Don't become a monument to what you refused to release. What God has called you out of, leave there. And don't look back." },
      ]
    },
    {
      id:"isaiah-calling", title:"Isaiah's Calling", icon:"🔥", tag:"Undone Before the Throne",
      color:"#9E6CC8",
      summary:"Isaiah saw God on His throne — high, lifted up, surrounded by angels crying 'Holy, holy, holy.' And his first response wasn't worship. It was devastation: 'I am ruined. I am a man of unclean lips.' This story is for anyone who has encountered God's holiness and felt the full weight of their own unworthiness.",
      chapters:[
        { title:"The Throne Room", text:"In the year that King Uzziah died — a year of national grief and political uncertainty — Isaiah had a vision. He saw the Lord seated on a throne, high and exalted. The train of His robe filled the temple. Seraphim hovered above Him, each with six wings, crying to one another: 'Holy, holy, holy is the Lord Almighty; the whole earth is full of His glory.' The doorposts shook. The temple filled with smoke. This wasn't a gentle encounter. It was overwhelming. This chapter is about the moments when God's presence breaks through the ordinary and you realize you're standing on ground you're not equipped to stand on. When has God felt terrifyingly close?" },
        { title:"Undone", text:"Isaiah's response was not 'how beautiful.' It was: 'Woe to me! I am ruined! For I am a man of unclean lips, and I live among a people of unclean lips, and my eyes have seen the King, the Lord Almighty.' The closer you get to holiness, the more clearly you see your own condition. Isaiah wasn't suddenly worse than he was five minutes before. He just finally saw himself accurately — in the light of who God actually is. This chapter is about the disorienting experience of being undone by God's presence. Not shamed by religion. Undone by holiness. When have you seen something about God that simultaneously drew you in and made you want to run?" },
        { title:"The Coal", text:"One of the seraphim flew to Isaiah with a live coal taken from the altar — with tongs, because even an angel couldn't hold it barehanded. He touched it to Isaiah's mouth and said: 'See, this has touched your lips; your guilt is taken away and your sin atoned for.' The purification was painful. It was fire. But it was also immediate and complete. God didn't make Isaiah clean himself up. He sent the coal. This chapter is about the cleansing you can't perform on yourself. The guilt that only God's fire can burn away. What uncleanness have you been trying to scrub off with your own hands that requires a different kind of fire?" },
        { title:"Here Am I, Send Me", text:"Then God spoke — not to Isaiah, but in Isaiah's hearing: 'Whom shall I send? And who will go for us?' And Isaiah — the same man who moments ago was face-down saying 'I'm ruined' — said: 'Here am I. Send me.' The sequence matters. Vision of God. Awareness of sin. Cleansing by grace. Then commission. Not before. You can't say 'send me' until you've said 'I'm undone.' This chapter is about the calling that only comes after the breaking. What is God preparing to send you toward that first requires you to be unmade?" },
        { title:"Why This Matters to You", text:"Isaiah's story isn't about trying harder or believing more. It's about an encounter that changed everything — seeing God as He actually is and being wrecked by the distance between His holiness and your reality. But the wrecking isn't the end. It's the beginning. Because after the ruin comes the coal. After the coal comes the voice. After the voice comes the mission. If you've been feeling undone lately — exposed, inadequate, too broken for purpose — that might not be a sign that something is wrong. It might be a sign that you're closer to the throne room than you've ever been. Let yourself be undone. Let the fire touch your lips. And when you hear the question — who will go? — you'll be ready to answer." },
      ]
    },
  ];

  if (activeStory) {
    const story = STORIES.find(s => s.id === activeStory);
    const chapter = story.chapters[chapterIdx];
    const isLast = chapterIdx === story.chapters.length - 1;
    const isFirst = chapterIdx === 0;

    return (
      <div style={{ minHeight:"100vh", background:C.bgPrimary, fontFamily:font,
        padding:"36px 20px 100px", boxSizing:"border-box" }}>
        <div style={{ maxWidth:"480px", margin:"0 auto" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"24px" }}>
            <button onClick={() => { setActiveStory(null); setChapterIdx(0); }} style={{
              background:"none", border:"none", cursor:"pointer",
              color:C.textMuted, fontSize:"20px" }}>←</button>
            <div style={{ flex:1 }}>
              <span style={{ color:story.color, fontSize:"9px", letterSpacing:"3px",
                textTransform:"uppercase", fontWeight:"bold" }}>{story.tag}</span>
              <h2 style={{ color:C.textPrimary, fontSize:"18px", fontWeight:"normal", margin:"2px 0 0" }}>
                {story.title}
              </h2>
            </div>
            <span style={{ color:C.textMuted, fontSize:"10px", fontStyle:"italic" }}>
              {chapterIdx + 1}/{story.chapters.length}
            </span>
          </div>

          {/* Progress dots */}
          <div style={{ display:"flex", gap:"4px", marginBottom:"24px" }}>
            {story.chapters.map((_, i) => (
              <div key={i} style={{
                flex:1, height:"3px", borderRadius:"3px",
                background: i <= chapterIdx ? story.color : `${C.border}`,
                transition:"background 0.3s ease",
              }}/>
            ))}
          </div>

          {/* Chapter content */}
          <div style={{
            background: isLast ? `${story.color}08` : C.bgSecondary,
            border:`1px solid ${isLast ? story.color+"33" : C.border}`,
            borderRadius:"14px", padding:"28px 22px", marginBottom:"24px",
          }}>
            <h3 style={{ color: isLast ? story.color : C.textPrimary,
              fontSize:"16px", fontWeight:"bold", fontFamily:font,
              margin:"0 0 16px" }}>
              {isLast ? "✦ " : ""}{chapter.title}
            </h3>
            <p style={{ color:C.textPrimary, fontSize:"14px", lineHeight:"2.2",
              margin:0, fontStyle: isLast ? "italic" : "normal" }}>
              {chapter.text}
            </p>
          </div>

          {/* Navigation */}
          <div style={{ display:"flex", gap:"12px", justifyContent:"space-between" }}>
            <button onClick={() => setChapterIdx(i => Math.max(0, i - 1))} style={{
              background:"none", border:`1px solid ${isFirst ? "transparent" : C.border}`,
              borderRadius:"30px", padding:"12px 24px", cursor: isFirst ? "default" : "pointer",
              color: isFirst ? "transparent" : C.textMuted,
              fontSize:"10px", letterSpacing:"2px", textTransform:"uppercase",
              fontStyle:"italic", fontFamily:font }}>← Back</button>

            {isLast ? (
              <button onClick={() => { setActiveStory(null); setChapterIdx(0); }} style={{
                background:`${story.color}15`, border:`1px solid ${story.color}33`,
                borderRadius:"30px", padding:"12px 28px", cursor:"pointer",
                color:story.color, fontSize:"10px", letterSpacing:"3px",
                textTransform:"uppercase", fontStyle:"italic", fontFamily:font }}>
                Finished
              </button>
            ) : (
              <button onClick={() => setChapterIdx(i => i + 1)} style={{
                background:`${C.accent}15`, border:`1px solid ${C.accent}33`,
                borderRadius:"30px", padding:"12px 28px", cursor:"pointer",
                color:C.accent, fontSize:"10px", letterSpacing:"3px",
                textTransform:"uppercase", fontStyle:"italic", fontFamily:font }}>
                Continue →
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight:"100vh", background:C.bgPrimary, fontFamily:font,
      padding:"36px 20px 100px", boxSizing:"border-box" }}>
      <div style={{ maxWidth:"480px", margin:"0 auto" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"24px" }}>
          <button onClick={() => setScreen("home")} style={{ background:"none", border:"none",
            cursor:"pointer", color:C.textMuted, fontSize:"20px", padding:"4px 8px 4px 0" }}>←</button>
          <div>
            <Label text="Scripture" color={C.amber} font={font}/>
            <h1 style={{ color:C.textPrimary, fontSize:"22px", fontWeight:"normal", margin:"0" }}>
              Biblical Reflections
            </h1>
          </div>
        </div>

        <p style={{ color:C.textSoft, fontSize:"13px", fontStyle:"italic",
          lineHeight:"1.9", margin:"0 0 24px" }}>
          Real stories. Told straight. Every one of these people faced something that should have ended them — and didn't. Pick one and sit with it.
        </p>

        <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
          {STORIES.map(story => (
            <button key={story.id} onClick={() => { setActiveStory(story.id); setChapterIdx(0); }} style={{
              background:C.bgSecondary, border:`1.5px solid ${C.border}`,
              borderRadius:"14px", padding:"20px", cursor:"pointer",
              textAlign:"left", transition:"all 0.2s ease",
              display:"flex", gap:"16px", alignItems:"flex-start",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=story.color+"55"; e.currentTarget.style.transform="translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.transform="translateY(0)"; }}>
              <span style={{ fontSize:"28px", flexShrink:0 }}>{story.icon}</span>
              <div style={{ flex:1 }}>
                <span style={{ color:story.color, fontSize:"9px", letterSpacing:"2px",
                  textTransform:"uppercase" }}>{story.tag}</span>
                <h3 style={{ color:C.textPrimary, fontSize:"15px", fontWeight:"bold",
                  fontFamily:font, margin:"4px 0 6px" }}>{story.title}</h3>
                <p style={{ color:C.textMuted, fontSize:"11px", fontStyle:"italic",
                  lineHeight:"1.7", margin:0 }}>
                  {story.summary.slice(0, 100)}...
                </p>
                <span style={{ color:C.textMuted, fontSize:"10px", marginTop:"6px", display:"inline-block" }}>
                  {story.chapters.length} chapters · ~5 min read
                </span>
              </div>
              <span style={{ color:C.textMuted, fontSize:"14px", marginTop:"8px" }}>→</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// SETTINGS TUTORIAL (first visit popup)
// ═══════════════════════════════════════════════════════
function GuidedTour({ C, font, onDismiss, onGoToSettings, setScreen }) {
  const [step, setStep] = useState(0);
  const [vis, setVis] = useState(false);
  useEffect(() => { setTimeout(() => setVis(true), 100); }, []);

  const steps = [
    {
      icon: "👋",
      title: "Welcome to your space.",
      body: "Selah is a faith-rooted mental wellness app built to help you reflect, breathe, pray, and grow. This tour takes about 90 seconds. You can skip anytime — and replay it from Settings.",
      preview: (
        <div style={{ display:"flex", justifyContent:"center", margin:"16px 0" }}>
          <WaveLogo size={48} color={C.accent}/>
        </div>
      ),
    },
    {
      icon: "◈",
      title: "Reflect — your main tool.",
      body: "Start an AI-guided conversation with Selah. Pick a topic — stress, faith, relationships, identity — or write freely. Selah listens, asks the right questions, and helps you think clearly. Sessions end with an Insight, Takeaway, and One Small Move.",
      preview: (
        <div style={{ display:"flex", flexWrap:"wrap", gap:"6px", margin:"16px 0", justifyContent:"center" }}>
          {["◈ Stress","🧭 Direction","🪞 Identity","✦ Faith","🤝 Relationships","⚡ Discipline"].map(c=>(
            <div key={c} style={{ background:C.bgSecondary, borderRadius:"8px", padding:"6px 12px" }}>
              <span style={{ color:C.textSoft, fontSize:"10px", fontStyle:"italic" }}>{c}</span>
            </div>
          ))}
        </div>
      ),
      action: { label:"Try It", fn:()=>{ onDismiss(); setScreen("reflect"); } },
    },
    {
      icon: "🎙️",
      title: "Voice Reflection — speak your mind.",
      body: "Tap the mic icon in the Reflect input bar to speak instead of type. Your words are transcribed live. Edit them, then hit send. Faster than typing when you have a lot on your heart.",
      preview: (
        <div style={{ display:"flex", justifyContent:"center", margin:"16px 0" }}>
          <div style={{ background:`${C.terra}15`, border:`1.5px solid ${C.terra}44`,
            borderRadius:"12px", padding:"14px 24px", display:"flex", alignItems:"center", gap:"12px" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="9" y="2" width="6" height="12" rx="3" fill={C.terra}/>
              <path d="M5 10c0 3.866 3.134 7 7 7s7-3.134 7-7" stroke={C.terra} strokeWidth="2" strokeLinecap="round" fill="none"/>
              <line x1="12" y1="17" x2="12" y2="21" stroke={C.terra} strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span style={{ color:C.terra, fontSize:"11px", fontStyle:"italic" }}>Listening...</span>
          </div>
        </div>
      ),
    },
    {
      icon: "🪑",
      title: "The Bench — save what lands.",
      body: "After every session, you'll see options to save your Insight or Takeaway to The Bench. Come back to it when you need a reminder of what you already know. It lives in Your Space on the home screen.",
      preview: (
        <div style={{ display:"flex", flexDirection:"column", gap:"8px", margin:"16px 0" }}>
          {[
            { label:"Insight", text:"You don't need more information. You need permission.", color:"#4A7FA5" },
            { label:"Takeaway", text:"Stop waiting for certainty before you move.", color:"#C4923A" },
          ].map(item => (
            <div key={item.label} style={{ background:C.bgSecondary, borderRadius:"8px",
              padding:"10px 14px", border:`1px solid ${item.color}33` }}>
              <p style={{ color:item.color, fontSize:"8px", letterSpacing:"2px",
                textTransform:"uppercase", margin:"0 0 4px" }}>{item.label}</p>
              <p style={{ color:C.textSoft, fontSize:"11px", fontStyle:"italic",
                lineHeight:"1.7", margin:0 }}>"{item.text}"</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      icon: "📜",
      title: "Biblical Reflections — raw, real stories.",
      body: "40+ stories from Scripture — David, Job, Ruth, Paul, Gideon, Hannah, and more — retold in plain modern language. Each has 5 chapters and ends with a question for you. Not a devotional. A mirror.",
      preview: (
        <div style={{ display:"flex", flexDirection:"column", gap:"6px", margin:"16px 0" }}>
          {["David · The Weight of Waiting","Job · When God Goes Silent","Ruth · Loyal in the Dark"].map(s=>(
            <div key={s} style={{ background:C.bgSecondary, borderRadius:"8px",
              padding:"8px 14px", border:`1px solid ${C.amber}22` }}>
              <span style={{ color:C.textSoft, fontSize:"11px", fontStyle:"italic" }}>{s}</span>
            </div>
          ))}
        </div>
      ),
      action: { label:"Read One", fn:()=>{ onDismiss(); setScreen("stories"); } },
    },
    {
      icon: "⚔️",
      title: "Armor Up — 5-minute morning routine.",
      body: "A structured morning sequence: a strength verse, 3 rounds of box breathing, then a personal intention you write yourself. Takes 5 minutes. Sets the tone for the whole day. Find it in Your Space.",
      preview: (
        <div style={{ display:"flex", gap:"8px", justifyContent:"center", margin:"16px 0" }}>
          {[{icon:"📖",label:"Verse"},{icon:"🌬️",label:"Breathe"},{icon:"✍️",label:"Intention"}].map((s,i)=>(
            <div key={s.label} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"4px" }}>
              <div style={{ width:"44px", height:"44px", borderRadius:"50%",
                background:`${C.amber}15`, border:`1.5px solid ${C.amber}33`,
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px" }}>{s.icon}</div>
              <span style={{ color:C.textMuted, fontSize:"9px", fontStyle:"italic" }}>{s.label}</span>
              {i < 2 && <span style={{ color:C.amber, fontSize:"14px", marginTop:"-4px" }}>→</span>}
            </div>
          ))}
        </div>
      ),
    },
    {
      icon: "🌑",
      title: "Heavy Day — when life is hard.",
      body: "Some days aren't okay. Heavy Day is a space built for lament — not toxic positivity, not forced gratitude. Guided prompts to process grief, anger, exhaustion, and doubt honestly before God.",
      preview: (
        <div style={{ background:`${C.terra}08`, border:`1px solid ${C.terra}22`,
          borderRadius:"10px", padding:"14px 16px", margin:"16px 0" }}>
          <p style={{ color:C.terra, fontSize:"11px", fontStyle:"italic",
            lineHeight:"1.8", margin:0 }}>
            "It's okay to say it hurts. God can handle your honesty."
          </p>
        </div>
      ),
    },
    {
      icon: "🕯️",
      title: "Prayer Wall — hold each other.",
      body: "An anonymous community prayer board. Post a one-line prayer request. Tap the flame on someone else's to say you're praying for them. No names. No comments. Just people holding each other up.",
      preview: (
        <div style={{ display:"flex", flexDirection:"column", gap:"8px", margin:"16px 0" }}>
          {[
            { text:"Pray for my mom. She's not doing well.", flames:14 },
            { text:"Pray for clarity about my next step.", flames:8 },
          ].map((p,i) => (
            <div key={i} style={{ background:C.bgSecondary, borderRadius:"8px",
              padding:"10px 14px", border:`1px solid ${C.border}`,
              display:"flex", alignItems:"center", gap:"12px" }}>
              <p style={{ color:C.textSoft, fontSize:"11px", fontStyle:"italic",
                lineHeight:"1.7", margin:0, flex:1 }}>"{p.text}"</p>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"2px" }}>
                <span style={{ fontSize:"14px" }}>🔥</span>
                <span style={{ color:C.amber, fontSize:"10px", fontWeight:"bold" }}>{p.flames}</span>
              </div>
            </div>
          ))}
        </div>
      ),
      action: { label:"Visit The Wall", fn:()=>{ onDismiss(); setScreen("prayerwall"); } },
    },
    {
      icon: "🫁",
      title: "Breathe + Quick Check-in.",
      body: "Breathe offers three techniques — Box Breathing, 4-7-8, and Physiological Sigh — used by therapists and special forces alike. Quick Check-in lets you log mood and get a personal reflection in under 2 minutes.",
      preview: (
        <div style={{ display:"flex", gap:"8px", justifyContent:"center", margin:"16px 0" }}>
          {["Box Breathing","4-7-8","Physiological Sigh"].map(t=>(
            <div key={t} style={{ background:C.bgSecondary, borderRadius:"8px",
              padding:"8px 10px", textAlign:"center" }}>
              <span style={{ color:C.textSoft, fontSize:"9px", fontStyle:"italic" }}>{t}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      icon: "✍️",
      title: "Notebook — write freely.",
      body: "No prompts. No one reads it. Write whatever is on your heart. Your notebook stays private on your device and syncs to the cloud if you sign in.",
      preview: null,
    },
    {
      icon: "📊",
      title: "Progress — see your arc.",
      body: "Your Progress page shows your streak, mood chart, session history, and the Emotional Timeline — a 60-day arc of how your mood has moved. The Growth Mirror (Growth+) uses AI to show you who you were on day one vs who you're becoming.",
      preview: (
        <div style={{ display:"flex", gap:"8px", justifyContent:"center", margin:"16px 0" }}>
          {[{label:"Streak",val:"🔥"},{label:"Mood Arc",val:"📈"},{label:"Sessions",val:"◈"},{label:"Mirror",val:"🪞"}].map(s=>(
            <div key={s.label} style={{ background:C.bgSecondary, borderRadius:"8px",
              padding:"10px 12px", textAlign:"center" }}>
              <span style={{ fontSize:"16px" }}>{s.val}</span>
              <p style={{ color:C.textMuted, fontSize:"9px", fontStyle:"italic", margin:"4px 0 0" }}>{s.label}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      icon: "🎨",
      title: "Make it yours.",
      body: "Change themes, fonts, AI tone, and faith level in Settings. Seven themes including Obsidian & Steel. Selah adapts to you — dark, light, warm, minimal. Change it anytime.",
      preview: (
        <div style={{ display:"flex", gap:"6px", justifyContent:"center", margin:"16px 0" }}>
          {[
            { label:"Warm", colors:["#F5F1E8","#A8B5A2","#D6A85F","#C47A5A"] },
            { label:"Dark", colors:["#1A1816","#C8A44E","#8A9A7A","#B87A4A"] },
            { label:"Navy", colors:["#0F1B2D","#C9A84C","#4A7FA5","#B06040"] },
            { label:"Obsidian", colors:["#090909","#8A9BAC","#C8A44E","#7A5A6A"] },
          ].map(t => (
            <div key={t.label} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"4px" }}>
              <div style={{ display:"flex", borderRadius:"6px", overflow:"hidden" }}>
                {t.colors.map((c,i) => (
                  <div key={i} style={{ width:"14px", height:"28px", background:c }}/>
                ))}
              </div>
              <span style={{ color:C.textMuted, fontSize:"8px", fontStyle:"italic" }}>{t.label}</span>
            </div>
          ))}
        </div>
      ),
      action: { label:"Open Settings", fn:()=>{ onDismiss(); onGoToSettings(); } },
    },
    {
      icon: "🤍",
      title: "Crisis support — always here.",
      body: "The heart icon in the top-right is always one tap away. It connects you to 988 Suicide & Crisis Lifeline, Crisis Text Line, and emergency services. You are never alone.",
      preview: (
        <div style={{ display:"flex", justifyContent:"center", margin:"16px 0" }}>
          <div style={{ background:`${C.terra}15`, border:`1.5px solid ${C.terra}33`,
            borderRadius:"50%", width:"48px", height:"48px",
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:"20px" }}>
            🤍
          </div>
        </div>
      ),
    },
    {
      icon: "📱",
      title: "Add Selah to your home screen.",
      body: "No app store needed — install Selah like a real app right from your browser. It works offline and loads instantly.",
      preview: (
        <div style={{ display:"flex", flexDirection:"column", gap:"8px", margin:"16px 0" }}>
          <div style={{ background:C.bgSecondary, borderRadius:"10px", padding:"12px 14px", border:`1px solid ${C.border}` }}>
            <p style={{ color:C.textPrimary, fontSize:"11px", fontWeight:"bold", fontFamily:font, margin:"0 0 4px" }}>iPhone / iPad (Safari)</p>
            <p style={{ color:C.textSoft, fontSize:"10px", fontStyle:"italic", lineHeight:"1.7", margin:0 }}>
              Tap <strong>Share</strong> (square + arrow) → <strong>Add to Home Screen</strong>
            </p>
          </div>
          <div style={{ background:C.bgSecondary, borderRadius:"10px", padding:"12px 14px", border:`1px solid ${C.border}` }}>
            <p style={{ color:C.textPrimary, fontSize:"11px", fontWeight:"bold", fontFamily:font, margin:"0 0 4px" }}>Android (Chrome)</p>
            <p style={{ color:C.textSoft, fontSize:"10px", fontStyle:"italic", lineHeight:"1.7", margin:0 }}>
              Tap <strong>⋮ menu</strong> → <strong>Add to Home Screen</strong>
            </p>
          </div>
        </div>
      ),
    },
    {
      icon: "☁️",
      title: "Back up your data.",
      body: "Sign in with your email in Settings to sync everything to the cloud — streaks, sessions, mood history, notebook. If you ever switch phones or clear your browser, nothing is lost.",
      preview: null,
      action: { label:"Open Settings", fn:()=>{ onDismiss(); onGoToSettings(); } },
    },
    {
      icon: "📚",
      title: "Feature Guide — always there for you.",
      body: "Skipped something in this tour? Go to Settings → Feature Guide anytime. Every feature explained with how to use it and a pro tip. Nothing to memorize — it's always one tap away.",
      preview: (
        <div style={{ background:C.bgSecondary, borderRadius:"10px", padding:"14px 16px",
          margin:"16px 0", border:`1px solid ${C.sage}22`,
          display:"flex", alignItems:"center", gap:"14px" }}>
          <div style={{ width:"40px", height:"40px", borderRadius:"50%",
            background:`${C.sage}15`, border:`1px solid ${C.sage}33`,
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px" }}>📖</div>
          <div>
            <p style={{ color:C.sage, fontSize:"10px", letterSpacing:"2px",
              textTransform:"uppercase", margin:"0 0 3px" }}>Settings</p>
            <p style={{ color:C.textSoft, fontSize:"12px", fontStyle:"italic", margin:0 }}>
              Feature Guide → tap any feature to learn it
            </p>
          </div>
        </div>
      ),
      action: { label:"Open Settings", fn:()=>{ onDismiss(); onGoToSettings(); } },
    },
    {
      icon: "🧭",
      title: "You're ready.",
      body: "Home is your hub. Reflect, Notebook, Progress, and Settings are always one tap away. Everything else lives in Your Space on the home screen. You can replay this tour anytime from Settings.",
      preview: (
        <div style={{ background:C.bgSecondary, borderRadius:"10px", padding:"12px 16px",
          margin:"16px 0", display:"flex", justifyContent:"space-around" }}>
          {[{icon:"🏠",label:"Home"},{icon:"◈",label:"Reflect"},{icon:"✍️",label:"Notebook"},
            {icon:"📊",label:"Progress"},{icon:"⚙️",label:"Settings"}].map(n=>(
            <div key={n.label} style={{ textAlign:"center" }}>
              <span style={{ fontSize:"16px" }}>{n.icon}</span>
              <p style={{ color:C.textMuted, fontSize:"8px", margin:"3px 0 0", fontStyle:"italic" }}>{n.label}</p>
            </div>
          ))}
        </div>
      ),
    },
  ];

  const s = steps[step];
  const isFirst = step === 0;
  const isLast = step === steps.length - 1;

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.55)",
      display:"flex", alignItems:"center", justifyContent:"center",
      zIndex:400, padding:"24px", fontFamily:font,
      opacity:vis?1:0, transition:"opacity 0.4s ease" }}>
      <div style={{ background:C.bgPrimary, borderRadius:"16px", padding:"28px 24px",
        maxWidth:"400px", width:"100%", textAlign:"center",
        border:`1px solid ${C.accent}33`,
        boxShadow:`0 20px 60px rgba(0,0,0,0.2)` }}>

        {/* Step indicator */}
        <div style={{ display:"flex", justifyContent:"center", gap:"4px", marginBottom:"18px" }}>
          {steps.map((_, i) => (
            <div key={i} style={{ width: i===step?"18px":"5px", height:"5px",
              borderRadius:"3px",
              background: i===step ? C.accent : i<step ? C.accent+"55" : C.bgCard,
              transition:"all 0.3s ease" }}/>
          ))}
        </div>

        {/* Counter */}
        <p style={{ color:C.textMuted, fontSize:"9px", letterSpacing:"2px",
          textTransform:"uppercase", margin:"0 0 12px" }}>
          {step + 1} of {steps.length}
        </p>

        {/* Icon */}
        <div style={{ fontSize:"32px", marginBottom:"12px" }}>{s.icon}</div>

        {/* Title */}
        <h2 style={{ color:C.textPrimary, fontSize:"clamp(17px,4vw,21px)",
          fontWeight:"normal", margin:"0 0 10px", lineHeight:"1.4",
          fontFamily:font }}>{s.title}</h2>

        {/* Body */}
        <p style={{ color:C.textSoft, fontSize:"12px", fontStyle:"italic",
          lineHeight:"1.9", margin:0 }}>{s.body}</p>

        {/* Preview */}
        {s.preview}

        {/* Buttons */}
        <div style={{ display:"flex", gap:"10px", marginTop:"18px" }}>
          {isFirst ? (
            <>
              <button onClick={onDismiss} style={{
                flex:1, background:"none", border:`1px solid ${C.border}`,
                borderRadius:"3px", color:C.textMuted, fontSize:"10px",
                letterSpacing:"2px", textTransform:"uppercase", padding:"13px",
                cursor:"pointer", fontFamily:font, fontStyle:"italic" }}>
                Skip Tour
              </button>
              <button onClick={()=>setStep(1)} style={{
                flex:2, background:C.accent, border:"none",
                borderRadius:"3px", color:"#fff", fontSize:"10px",
                letterSpacing:"3px", textTransform:"uppercase", padding:"13px",
                cursor:"pointer", fontFamily:font, fontStyle:"italic",
                boxShadow:`0 2px 12px ${C.accent}33` }}>
                Show Me Around
              </button>
            </>
          ) : isLast ? (
            <button onClick={onDismiss} style={{
              flex:1, background:C.accent, border:"none",
              borderRadius:"3px", color:"#fff", fontSize:"10px",
              letterSpacing:"3px", textTransform:"uppercase", padding:"14px",
              cursor:"pointer", fontFamily:font, fontStyle:"italic",
              boxShadow:`0 2px 12px ${C.accent}33` }}>
              Start Using Selah
            </button>
          ) : (
            <>
              <button onClick={onDismiss} style={{
                background:"none", border:"none", color:C.textMuted, fontSize:"10px",
                fontStyle:"italic", cursor:"pointer", fontFamily:font, padding:"13px 8px" }}>
                Skip
              </button>
              <div style={{ flex:1 }}/>
              {s.action && (
                <button onClick={s.action.fn} style={{
                  background:"none", border:`1px solid ${C.accent}44`,
                  borderRadius:"3px", color:C.accent, fontSize:"10px",
                  letterSpacing:"2px", textTransform:"uppercase", padding:"13px 16px",
                  cursor:"pointer", fontFamily:font, fontStyle:"italic" }}>
                  {s.action.label}
                </button>
              )}
              <button onClick={()=>setStep(step+1)} style={{
                background:C.accent, border:"none",
                borderRadius:"3px", color:"#fff", fontSize:"10px",
                letterSpacing:"3px", textTransform:"uppercase", padding:"13px 24px",
                cursor:"pointer", fontFamily:font, fontStyle:"italic",
                boxShadow:`0 2px 12px ${C.accent}33` }}>
                Next
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// HOME SCREEN
// ═══════════════════════════════════════════════════════
function HomeScreen({ C, font, setScreen, userName, steadyDays, showLateNight, sharingEnabled, onboardingAnswers, faithLevel, isFirstVisit, onDismissWelcome, onLogMood, onActive, lastFeedbackPrompt, onDismissFeedback, sessionCount, tone, quoteFreq, tier, isTrialActive, onUpgrade, moodHistory, sessionHistory, journalEntries, setJournalEntries, seasonalMode, setSeasonalMode, currentSeason, graceUsedWeek, showTutorial, setShowTutorial }) {
  const [quote,setQuote]=useState(null);
  const [loading,setLoading]=useState(true);
  const [copied,setCopied]=useState(false);
  const [mood,setMood]=useState(null);
  const [pulseEnergy,setPulseEnergy]=useState(null);
  const [pulseWord,setPulseWord]=useState("");
  const [showLN,setShowLN]=useState(false);
  const [showCrisisPanel,setShowCrisisPanel]=useState(false);
  const [showNotifications,setShowNotifications]=useState(false);
  const [notifications,setNotifications]=useState([]);
  const [notiLoading,setNotiLoading]=useState(false);
  const [unreadCount,setUnreadCount]=useState(0);
  const [dayWord,setDayWord]=useState(null);
  const [weeklyRecap,setWeeklyRecap]=useState(null);
  const [sundayQ, setSundayQ] = useState(null);
  const [sundayAnswer, setSundayAnswer] = useState("");
  const [sundaySubmitted, setSundaySubmitted] = useState(false);
  const [sundayDismissed, setSundayDismissed] = useState(()=>{ try{ return localStorage.getItem("selah_sunday_q_dismissed")===new Date().toDateString(); }catch{return false;} });
  const [ttlmDismissed,setTtlmDismissed]=useState(()=>{ try{ const d=localStorage.getItem("selah_ttlm_dismissed"); const now=new Date(); return d===`${now.getFullYear()}-${now.getMonth()}`; }catch{return false;} });
  const [monthlyReport,setMonthlyReport]=useState(null);
  const [monthlyReportLoading,setMonthlyReportLoading]=useState(false);
  const [monthlyReportDismissed,setMonthlyReportDismissed]=useState(()=>{ try{ const d=localStorage.getItem("selah_monthly_report_dismissed"); const now=new Date(); return d===`${now.getFullYear()}-${now.getMonth()}`; }catch{return false;} });
  const [holidayDismissed,setHolidayDismissed]=useState(()=>{ try{ return localStorage.getItem("selah_holiday_dismissed")===new Date().toDateString(); }catch{return false;} });
  const [todayHoliday,setTodayHoliday]=useState(null);
  const [seasonOptInDismissed,setSeasonOptInDismissed]=useState(()=>{ try{ return localStorage.getItem("selah_season_optin_dismissed")===new Date().toDateString(); }catch{return false;} });
  const [recapLoading,setRecapLoading]=useState(false);
  const [recapDismissed,setRecapDismissed]=useState(false);
  const [dailyEncouragement,setDailyEncouragement]=useState(null);
  const [activeChallenge,setActiveChallenge]=useState(null);
  const [monthlyGoal,setMonthlyGoal]=useState(null);
  const [goalLoading,setGoalLoading]=useState(false);

  // Time of day — living home screen
  const [timeOfDay, setTimeOfDay] = useState(() => {
    const h = new Date().getHours();
    if (h >= 5 && h < 9)  return "dawn";
    if (h >= 9 && h < 12) return "morning";
    if (h >= 12 && h < 17) return "afternoon";
    if (h >= 17 && h < 20) return "evening";
    if (h >= 20 && h < 23) return "night";
    return "late";
  });

  useEffect(() => {
    const tick = setInterval(() => {
      const h = new Date().getHours();
      const next = h >= 5 && h < 9 ? "dawn"
        : h >= 9 && h < 12 ? "morning"
        : h >= 12 && h < 17 ? "afternoon"
        : h >= 17 && h < 20 ? "evening"
        : h >= 20 && h < 23 ? "night" : "late";
      setTimeOfDay(next);
    }, 60000);
    return () => clearInterval(tick);
  }, []);

  const TOD = {
    dawn:      { overlay: "#E8956A", opacity: 0.07, label: "Good morning", sub: "The day is just beginning." },
    morning:   { overlay: "#C4923A", opacity: 0.05, label: "Good morning", sub: "You showed up." },
    afternoon: { overlay: "#7A8FA0", opacity: 0.04, label: "Good afternoon", sub: "How's the day treating you?" },
    evening:   { overlay: "#6A5A8A", opacity: 0.08, label: "Good evening", sub: "Take a breath before the night." },
    night:     { overlay: "#2A2840", opacity: 0.12, label: "Still here", sub: "Quieter now. That's okay." },
    late:      { overlay: "#1A1830", opacity: 0.15, label: "Late night", sub: "Rest is holy too." },
  };
  const tod = TOD[timeOfDay];

  useEffect(()=>{
    const isAdmin = new URLSearchParams(window.location.search).get("admin") === "f7a3d9e2-4c1b-4e8f-b2a6-9d5c3e7f1a04";
    const canAccessGoal = (TIER_LEVELS[tier]||0) >= TIER_LEVELS.growth || isAdmin;
    if(!canAccessGoal || !onboardingAnswers?.name) return;
    if(!localStorage.getItem("selah_signup_date")) {
      localStorage.setItem("selah_signup_date", new Date().toISOString());
    }
    
    const monthKey = new Date().toISOString().slice(0,7);
    const cached = JSON.parse(localStorage.getItem("selah_monthly_goal")||"null");
    if(cached && cached.month === monthKey) { setMonthlyGoal(cached.goal); return; }
    setGoalLoading(true);
    const context = Object.entries(onboardingAnswers).map(([k,v])=>k+": "+v).join(", ");
    const moodSummary = (moodHistory||[]).slice(-14).map(m=>m.mood).join(", ");
    fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
      model:"claude-sonnet-4-20250514",max_tokens:300,
      system:"You create small, achievable monthly wellness goals. Return ONLY a JSON object with: {title: a 3-5 word goal title, description: One sentence explaining the goal, actionSteps: [step1,step2,step3]} No markdown, no backticks, no code fences.",
      messages:[{role:"user",content:"Based on this person: "+context+". Recent moods: "+(moodSummary||"not tracked yet")+". Generate one small personalized monthly wellness goal."}]
    })}).then(r=>r.json()).then(data=>{
      try{
        const text = data.content && data.content[0] && data.content[0].text || "";
        const cleaned = text.replace(/```json/g,"").replace(/```/g,"").trim();
        const goal = JSON.parse(cleaned);
        setMonthlyGoal(goal);
        localStorage.setItem("selah_monthly_goal", JSON.stringify({month:monthKey,goal}));
      }catch(e){ console.error("Goal parse error:",e); }
      setGoalLoading(false);
    }).catch(()=>setGoalLoading(false));
  },[tier,onboardingAnswers]);

  // Weekly Recap — Sunday at 6pm+, Growth+ only, detail scales with tier
  useEffect(() => {
    const now = new Date();
    const isSunday = now.getDay() === 0;
    const isAfter6pm = now.getHours() >= 18;
    const isGrowthPlus = (TIER_LEVELS[tier]||0) >= TIER_LEVELS.growth || new URLSearchParams(window.location.search).get("admin") === "f7a3d9e2-4c1b-4e8f-b2a6-9d5c3e7f1a04";

    if (!isSunday || !isAfter6pm || !isGrowthPlus) return;

    const weekKey = now.toISOString().split("T")[0];
    try {
      const cached = JSON.parse(localStorage.getItem("selah_weekly_recap")||"null");
      if (cached && cached.week === weekKey && cached.tier === tier) {
        setWeeklyRecap(cached.data);
        return;
      }
    } catch {}

    const generateRecap = async () => {
      setRecapLoading(true);

      // Build context from real data
      const recentMoods = (moodHistory||[]).slice(0,7);
      const moodNames = ["Very low","Low","Neutral","Good","Great"];
      const moodSummary = recentMoods.length > 0
        ? recentMoods.map(m => moodNames[m.mood]||"Unknown").join(", ")
        : "No moods logged";
      const avgMood = recentMoods.length > 0
        ? (recentMoods.reduce((s,m) => s + m.mood, 0) / recentMoods.length).toFixed(1)
        : null;
      const weekSessions = (sessionHistory||[]).filter(s => {
        const d = new Date(s.date);
        return (now - d) < 7 * 24 * 60 * 60 * 1000;
      });
      const weekJournals = (journalEntries||[]).filter(e => {
        const d = new Date(e.date);
        return (now - d) < 7 * 24 * 60 * 60 * 1000;
      });
      const sessionTopics = weekSessions.map(s => s.category || s.topic || "reflection").join(", ");

      // Tier-based prompt depth
      let tierInstruction = "";
      if (tier === "foundation") {
        tierInstruction = `Give a brief weekly summary in 3-4 sentences. Include: how many sessions they did this week, their mood trend (up/down/steady), streak count, and one encouraging sentence. Keep it simple and warm.`;
      } else if (tier === "growth") {
        tierInstruction = `Give a detailed weekly summary in 5-7 sentences. Include: sessions completed, mood trend with a specific observation about their emotional pattern, streak count, journal entries if any, what topics they reflected on, and a personalized encouragement that references something specific from their week. End with one suggestion for next week.`;
      } else {
        tierInstruction = `Give a comprehensive weekly summary in 7-10 sentences. Include: sessions completed with depth analysis, mood trend with emotional pattern observations, streak count and what it means for their growth, journal activity, specific topics they explored and how they connect, a personalized observation about their progress over time, one thing you noticed shifting in them, and two specific suggestions for next week — one practical action and one reflection prompt. Make it feel like a mentor who's been watching their journey closely.`;
      }

      try {
        const r = await fetch("/api/chat", {
          method:"POST", headers:{"Content-Type":"application/json"},
          body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:500,
            messages:[{role:"user",content:`You are Selah — a faith-rooted clarity companion. It's Sunday evening. Write a weekly recap for ${userName||"someone"} who uses a mental wellness app.

Here's their week:
- Streak: ${steadyDays} days
- Sessions this week: ${weekSessions.length}
- Session topics: ${sessionTopics || "none"}
- Journal entries this week: ${weekJournals.length}
- Recent moods: ${moodSummary}
- Average mood: ${avgMood || "not enough data"}
- Total sessions all time: ${sessionCount}
${onboardingAnswers?.goal ? `- Their goal: "${onboardingAnswers.goal}"` : ""}

${tierInstruction}

${faithLevel>=2?"Include a gentle faith reference.":"Keep it secular."}
${tone==="warm"?"Be warm and nurturing.":tone==="spiritual"?"Lead with faith.":"Be grounded and direct."}
Write in second person ("you"). No bullet points. No therapy-speak. Sound like a wise friend, not an app.`}]
          })
        });
        const d = await r.json();
        if(d.error) throw new Error(d.error?.message||"API error");
        const text = d.content.map(b=>b.text||"").join("").trim();
        setWeeklyRecap(text);
        try { localStorage.setItem("selah_weekly_recap", JSON.stringify({ week:weekKey, tier, data:text })); } catch {}
      } catch {
        const fallback = "Another week behind you. Whether it was heavy or light, you showed up — and that's what matters. Take tonight to breathe. Tomorrow is a fresh start.";
        setWeeklyRecap(fallback);
        try { localStorage.setItem("selah_weekly_recap", JSON.stringify({ week:weekKey, tier, data:fallback })); } catch {}
      }
      setRecapLoading(false);
    };
    generateRecap();
  }, [tier]);

  // Sunday Question — every Sunday, Foundation+, one question, saves answer to journal
  useEffect(() => {
    const now = new Date();
    const isSunday = now.getDay() === 0;
    const isFoundationPlus = (TIER_LEVELS[tier]||0) >= TIER_LEVELS.foundation;
    if (!isSunday || !isFoundationPlus || sundayDismissed) return;
    const weekKey = now.toISOString().split("T")[0];
    try {
      const cached = JSON.parse(localStorage.getItem("selah_sunday_q")||"null");
      if (cached && cached.week === weekKey) { setSundayQ(cached.q); return; }
    } catch {}
    const SUNDAY_QUESTIONS = [
      "What's one thing from this week you're still carrying?",
      "Where did you feel most like yourself this week?",
      "What moment this week surprised you?",
      "What did this week ask of you that you didn't expect?",
      "What's one thing you want to leave behind before the new week starts?",
      "Where did you feel God's presence this week — or miss it?",
      "What was the heaviest part of this week? What was the lightest?",
      "What did you learn about yourself this week?",
      "What would you do differently if this week repeated itself?",
      "What are you grateful for that you haven't said out loud yet?",
      "Who showed up for you this week?",
      "What unfinished thing is still sitting in the back of your mind?",
    ];
    const weekNum = Math.floor((now - new Date(now.getFullYear(), 0, 1)) / (7 * 24 * 60 * 60 * 1000));
    const q = SUNDAY_QUESTIONS[weekNum % SUNDAY_QUESTIONS.length];
    setSundayQ(q);
    try { localStorage.setItem("selah_sunday_q", JSON.stringify({ week: weekKey, q })); } catch {}
  }, [tier]);
  // ── CHRISTIAN/CATHOLIC HOLIDAY ENGINE ──
  useEffect(() => {
    if ((TIER_LEVELS[tier]||0) < TIER_LEVELS.foundation) return;
    const now = new Date();
    const m = now.getMonth() + 1; // 1-12
    const d = now.getDate();
    const y = now.getFullYear();

    // Compute Easter (Gregorian, Anonymous Gregorian algorithm)
    const easterDate = (yr) => {
      const a = yr % 19, b = Math.floor(yr/100), c = yr % 100;
      const d2 = Math.floor(b/4), e = b % 4, f = Math.floor((b+8)/25);
      const g = Math.floor((b-f+1)/3), h = (19*a+b-d2-g+15) % 30;
      const i = Math.floor(c/4), k = c % 4;
      const l = (32+2*e+2*i-h-k) % 7;
      const m2 = Math.floor((a+11*h+22*l)/451);
      const month = Math.floor((h+l-7*m2+114)/31);
      const day = ((h+l-7*m2+114) % 31) + 1;
      return { m: month, d: day };
    };
    const easter = easterDate(y);
    const easterMs = new Date(y, easter.m-1, easter.d).getTime();
    const offsetDay = (ms) => { const dt = new Date(ms); return { m: dt.getMonth()+1, d: dt.getDate() }; };
    const ashWed   = offsetDay(easterMs - 46*86400000);
    const palmSun  = offsetDay(easterMs - 7*86400000);
    const holyThur = offsetDay(easterMs - 3*86400000);
    const goodFri  = offsetDay(easterMs - 2*86400000);
    const holySat  = offsetDay(easterMs - 1*86400000);
    const ascension = offsetDay(easterMs + 39*86400000);
    const pentecost = offsetDay(easterMs + 49*86400000);
    const trinitySun = offsetDay(easterMs + 56*86400000);
    const corpusChristi = offsetDay(easterMs + 60*86400000);

    const HOLIDAYS = [
      // Fixed
      { m:1,  d:1,  name:"New Year — Mary, Mother of God", icon:"🕊️", verse:"The Lord bless you and keep you. — Numbers 6:24", reflection:"What do you want to release from last year? What are you asking God to guard in this one?" },
      { m:1,  d:6,  name:"Epiphany", icon:"⭐", verse:"We saw his star when it rose and have come to worship him. — Matthew 2:2", reflection:"Where have you seen God show up unexpectedly this season?" },
      { m:2,  d:2,  name:"Candlemas", icon:"🕯️", verse:"A light for revelation to the Gentiles, and the glory of your people Israel. — Luke 2:32", reflection:"What darkness in your life is waiting to be brought into the light?" },
      { m:3,  d:19, name:"Feast of St. Joseph", icon:"🪚", verse:"He did what the angel of the Lord had commanded him. — Matthew 1:24", reflection:"Where is God asking you to act in quiet obedience today?" },
      { m:3,  d:25, name:"Annunciation", icon:"🌸", verse:"Be it done unto me according to your word. — Luke 1:38", reflection:"What is God asking you to say yes to that feels too big?" },
      { m:6,  d:24, name:"Nativity of St. John the Baptist", icon:"🔥", verse:"He must increase, but I must decrease. — John 3:30", reflection:"What in your life needs to decrease so something greater can grow?" },
      { m:6,  d:29, name:"Feast of Saints Peter and Paul", icon:"⚓", verse:"You are Peter, and on this rock I will build my church. — Matthew 16:18", reflection:"What is the foundation you are building your life on right now?" },
      { m:7,  d:22, name:"Feast of Mary Magdalene", icon:"🌹", verse:"She turned around and saw Jesus standing there. — John 20:14", reflection:"What would it mean to truly recognize Jesus in your everyday moments?" },
      { m:8,  d:6,  name:"Transfiguration", icon:"✨", verse:"He was transfigured before them; his face shone like the sun. — Matthew 17:2", reflection:"When have you caught a glimpse of something eternal breaking through the ordinary?" },
      { m:8,  d:15, name:"Assumption of Mary", icon:"☁️", verse:"My soul magnifies the Lord, and my spirit rejoices in God my Savior. — Luke 1:46-47", reflection:"What would it look like to surrender your whole self — body and soul — to God?" },
      { m:9,  d:14, name:"Exaltation of the Holy Cross", icon:"✝️", verse:"May I never boast except in the cross of our Lord Jesus Christ. — Galatians 6:14", reflection:"What cross are you carrying right now — and what would it mean to carry it with purpose?" },
      { m:10, d:4,  name:"Feast of St. Francis", icon:"🕊️", verse:"Lord, make me an instrument of your peace.", reflection:"Where can you bring peace today in a situation that has none?" },
      { m:11, d:1,  name:"All Saints' Day", icon:"👑", verse:"Blessed are the pure in heart, for they will see God. — Matthew 5:8", reflection:"Who in your life has shown you what holiness looks like?" },
      { m:11, d:2,  name:"All Souls' Day", icon:"🕯️", verse:"I am the resurrection and the life. — John 11:25", reflection:"Who are you holding in your heart today? What do you want to say to them?" },
      { m:11, d:9,  name:"Dedication of the Lateran Basilica", icon:"⛪", verse:"Do you not know that you are God's temple? — 1 Corinthians 3:16", reflection:"What would it mean to treat your body and soul as sacred space today?" },
      { m:12, d:8,  name:"Immaculate Conception", icon:"🌸", verse:"Hail, full of grace, the Lord is with you. — Luke 1:28", reflection:"Where do you need God's grace to fill in what feels empty or broken?" },
      { m:12, d:12, name:"Our Lady of Guadalupe", icon:"🌹", verse:"Am I not here, I who am your mother? — Juan Diego apparition", reflection:"Where do you need to be reminded that you are not forgotten or abandoned?" },
      { m:12, d:25, name:"Christmas", icon:"✨", verse:"The Word became flesh and made his dwelling among us. — John 1:14", reflection:"What would it mean for God to be truly present — not just believed, but felt — in your life today?" },
      { m:12, d:26, name:"Feast of St. Stephen", icon:"🔴", verse:"Lord, do not hold this sin against them. — Acts 7:60", reflection:"Is there someone you need to forgive — even someone who has deeply wronged you?" },
      { m:12, d:28, name:"Holy Innocents", icon:"🕊️", verse:"A voice is heard in Ramah, weeping and great mourning. — Matthew 2:18", reflection:"What innocent loss are you still grieving? It's okay to bring that to God today." },
      // Moveable
      { m: ashWed.m,      d: ashWed.d,      name:"Ash Wednesday", icon:"✝️", verse:"Return to me with all your heart. — Joel 2:12", reflection:"What do you need to lay down this Lent? What is God asking you to let go of?" },
      { m: palmSun.m,     d: palmSun.d,     name:"Palm Sunday", icon:"🌿", verse:"Blessed is he who comes in the name of the Lord! — Matthew 21:9", reflection:"Where in your life are you resisting the kind of king Jesus actually is?" },
      { m: holyThur.m,    d: holyThur.d,    name:"Holy Thursday", icon:"🍞", verse:"Do this in remembrance of me. — Luke 22:19", reflection:"What does it mean to you that Jesus chose a meal — not a monument — as the way to be remembered?" },
      { m: goodFri.m,     d: goodFri.d,     name:"Good Friday", icon:"✝️", verse:"It is finished. — John 19:30", reflection:"What in your life feels like an ending right now? Can you trust that God is not done?" },
      { m: holySat.m,     d: holySat.d,     name:"Holy Saturday", icon:"🌑", verse:"They rested on the Sabbath in obedience to the commandment. — Luke 23:56", reflection:"What does it feel like to wait in uncertainty — to not know yet how the story ends?" },
      { m: easter.m,      d: easter.d,      name:"Easter Sunday", icon:"🌅", verse:"He is not here; he has risen, just as he said. — Matthew 28:6", reflection:"What in your life needs resurrection — what has felt dead that you're ready to believe can live again?" },
      { m: ascension.m,   d: ascension.d,   name:"Ascension", icon:"☁️", verse:"And surely I am with you always, to the very end of the age. — Matthew 28:20", reflection:"Where do you need to trust that Jesus is still present even when you can't see him?" },
      { m: pentecost.m,   d: pentecost.d,   name:"Pentecost", icon:"🔥", verse:"They were all filled with the Holy Spirit. — Acts 2:4", reflection:"Where in your life do you need a fresh filling — energy, courage, words, direction?" },
      { m: trinitySun.m,  d: trinitySun.d,  name:"Trinity Sunday", icon:"🔺", verse:"Go and make disciples of all nations, baptizing them in the name of the Father, Son, and Holy Spirit. — Matthew 28:19", reflection:"Which person of the Trinity feels most distant to you right now — and why?" },
      { m: corpusChristi.m, d: corpusChristi.d, name:"Corpus Christi", icon:"🍞", verse:"I am the bread of life. — John 6:35", reflection:"What are you hungry for right now that only God can fill?" },
    ];

    // Also check Advent (4 Sundays before Christmas)
    const christmas = new Date(y, 11, 25);
    const christmasDow = christmas.getDay();
    const adventStart = new Date(y, 11, 25 - christmasDow - 21);
    const todayDate = new Date(y, m-1, d);
    const isAdvent = todayDate >= adventStart && todayDate < christmas;
    if (isAdvent) {
      HOLIDAYS.push({ m, d, name:"Advent", icon:"🕯️", verse:"Prepare the way of the Lord, make straight paths for him. — Mark 1:3", reflection:"What in your heart needs to be made straight — cleared out, quieted down — to make room for Jesus this season?" });
    }

    const holiday = HOLIDAYS.find(h => h.m === m && h.d === d);
    if (holiday) setTodayHoliday(holiday);
  }, [tier]);

  useEffect(() => {
    if ((TIER_LEVELS[tier]||0) < TIER_LEVELS.growth) return;
    const today = new Date().toISOString().split("T")[0];
    try {
      const cached = JSON.parse(localStorage.getItem("selah_daily_enc") || "null");
      if (cached && cached.date === today) { setDailyEncouragement(cached.text); return; }
    } catch {}
    const recentMoods = (moodHistory||[]).slice(0,5).map(m=>m.mood).filter(Boolean).join(", ");
    const recentTopics = (sessionHistory||[]).slice(0,3).map(s=>s.category).filter(Boolean).join(", ");
    fetch("/api/chat", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:200,
        messages:[{role:"user",content:`You are Selah. Write a 1-2 sentence daily encouragement for ${userName||"someone"} who is working on mental wellness. ${recentMoods?`Recent moods: ${recentMoods}.`:""} ${recentTopics?`Recent topics: ${recentTopics}.`:""} ${steadyDays>0?`They have a ${steadyDays}-day streak.`:""} ${faithLevel>=2?"Include a brief faith reference.":"Keep it secular."} Be warm, specific, and grounding. No therapy-speak. Sound human.`}]})
    }).then(r=>r.json()).then(d=>{
      const text = d.content?.map(b=>b.text||"").join("").trim();
      if(text) {
        setDailyEncouragement(text);
        try { localStorage.setItem("selah_daily_enc", JSON.stringify({ date:today, text })); } catch {}
      }
    }).catch(()=>{});
  }, [tier]);

  // Word of the Day — loads once per day, cached in localStorage
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    try {
      const cached = JSON.parse(localStorage.getItem("selah_day_word") || "null");
      if (cached && cached.date === today) {
        setDayWord(cached.data);
        return;
      }
    } catch {}
    loadDayWord();
  }, []);

  const loadDayWord = async () => {
    try {
      const r = await fetch("/api/chat", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:400,
          messages:[{role:"user",content:`Choose one powerful word relevant to mental clarity, inner growth, emotional healing, faith-rooted resilience, or personal transformation. Pick something unexpected and meaningful — not "hope" or "peace" or "gratitude." Think deeper: words like "selah," "teshuvah," "kenosis," "surrender," "lament," "abide," "steadfast." Variety seed: ${Math.floor(Math.random()*10000)}. Return ONLY JSON: {"word":"the word","definition":"a short, grounded definition (1 sentence)","reflection":"a reflection question tied to this word — direct, personal, under 20 words","action":"one concrete action to embody this word today — under 20 words, starts with a verb"} No markdown.`}]})});
      const d = await r.json();
      if(d.error) throw new Error(d.error?.message||"API error");
      const t = d.content.map(b=>b.text||"").join("").trim();
      const parsed = JSON.parse(t.replace(/```json|```/g,"").trim());
      setDayWord(parsed);
      const today = new Date().toISOString().split("T")[0];
      localStorage.setItem("selah_day_word", JSON.stringify({ data: parsed, date: today }));
    } catch { setDayWord(null); }
  };

  // Guided Challenges — Deep only, AI-generated monthly
  const [monthlyChallenges, setMonthlyChallenges] = useState([]);
  const [challengesLoading, setChallengesLoading] = useState(false);
  useEffect(() => {
    if ((TIER_LEVELS[tier]||0) < TIER_LEVELS.deep) return;
    // Load active challenge
    try {
      const cached = JSON.parse(localStorage.getItem("selah_challenge") || "null");
      if (cached && cached.startDate) {
        const elapsed = Math.floor((Date.now() - cached.startDate) / (1000*60*60*24));
        if (elapsed < cached.duration) {
          setActiveChallenge({ ...cached, day: elapsed + 1 });
        } else {
          localStorage.removeItem("selah_challenge");
        }
      }
    } catch {}
    // Load or generate monthly challenges
    const monthKey = new Date().toISOString().slice(0,7);
    try {
      const cached = JSON.parse(localStorage.getItem("selah_monthly_challenges") || "null");
      if (cached && cached.month === monthKey && cached.challenges?.length === 5) {
        setMonthlyChallenges(cached.challenges);
        return;
      }
    } catch {}
    // Generate new challenges for this month
    setChallengesLoading(true);
    const context = sessionHistory?.slice(-10).map(s => s.takeaway || s.category || "").filter(Boolean).join(", ") || "new user";
    const moodCtx = moodHistory?.slice(-10).map(m => m.label || m.mood).filter(Boolean).join(", ") || "unknown";
    fetch("/api/chat", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        system:"You create personalized wellness challenges. Return ONLY a JSON array of exactly 5 challenges. Each must have: {id: unique_string, duration: 7 or 14 or 30, title: short title, desc: 1-2 sentence description, icon: single emoji}. Mix durations: include at least one 7-day, one 14-day, and one 30-day. Make them specific to this person's patterns. No markdown, no backticks, just the JSON array.",
        messages:[{role:"user",content:`Generate 5 personalized monthly wellness challenges for someone whose recent session themes include: ${context}. Recent moods: ${moodCtx}. Month: ${new Date().toLocaleDateString("en-US",{month:"long",year:"numeric"})}. Make them feel fresh, personal, and faith-aware.`}]
      })
    }).then(r=>r.json()).then(d=>{
      try {
        const text = d.choices?.[0]?.message?.content || d.content?.[0]?.text || d.text || "";
        const cleaned = text.replace(/```json|```/g,"").trim();
        const challenges = JSON.parse(cleaned);
        if (Array.isArray(challenges) && challenges.length === 5) {
          setMonthlyChallenges(challenges);
          localStorage.setItem("selah_monthly_challenges", JSON.stringify({month:monthKey, challenges}));
        }
      } catch {}
      setChallengesLoading(false);
    }).catch(()=>setChallengesLoading(false));
  }, [tier]);

  const startChallenge = (ch) => {
    const data = { ...ch, startDate: Date.now(), day: 1 };
    setActiveChallenge(data);
    try { localStorage.setItem("selah_challenge", JSON.stringify(data)); } catch {}
  };

  const abandonChallenge = () => {
    setActiveChallenge(null);
    try { localStorage.removeItem("selah_challenge"); } catch {}
  };

  // Log mood to parent when pulse is completed
  useEffect(() => {
    if (mood !== null && pulseEnergy !== null && onLogMood) {
      onLogMood(mood, pulseEnergy, pulseWord);
    }
  }, [mood, pulseEnergy, pulseWord]);

  // Weekly feedback popup logic
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  useEffect(() => {
    if (isFirstVisit || showTutorial) return; // don't show during onboarding
    if (sessionCount < 2) return; // wait until they've used it a bit
    const now = Date.now();
    const weekMs = 7 * 24 * 60 * 60 * 1000;
    if (!lastFeedbackPrompt || (now - lastFeedbackPrompt) > weekMs) {
      const timer = setTimeout(() => setShowFeedbackPopup(true), 3000); // 3s delay
      return () => clearTimeout(timer);
    }
  }, []);

  // ── Anchor frequency-based refresh ──
  const isAdmin = new URLSearchParams(window.location.search).get("admin") === "f7a3d9e2-4c1b-4e8f-b2a6-9d5c3e7f1a04";
  const canShowAnchor = isAdmin || (TIER_LEVELS[tier]||0) >= TIER_LEVELS.foundation || isTrialActive;

  const isAnchorExpired = (cached) => {
    if (!cached || !cached.timestamp) return true;
    const now = new Date();
    const cachedTime = new Date(cached.timestamp);
    // Trial users locked to daily only
    const freq = isTrialActive ? "daily" : (quoteFreq || "daily");
    if (freq === "hourly") {
      return now.getHours() !== cachedTime.getHours() || now.toDateString() !== cachedTime.toDateString();
    } else if (freq === "twice") {
      // Refresh at 4am and 4pm
      const getNearestSlot = (d) => {
        const h = d.getHours();
        const day = d.toDateString();
        return h >= 16 ? day + "-PM" : h >= 4 ? day + "-AM" : new Date(d.getTime() - 86400000).toDateString() + "-PM";
      };
      return getNearestSlot(now) !== getNearestSlot(cachedTime);
    } else if (freq === "weekly") {
      return (now.getTime() - cachedTime.getTime()) > 7 * 24 * 60 * 60 * 1000;
    } else {
      // daily — refresh at 4am
      const getAnchorDay = (d) => {
        const h = d.getHours();
        if (h < 4) return new Date(d.getTime() - 86400000).toDateString();
        return d.toDateString();
      };
      return getAnchorDay(now) !== getAnchorDay(cachedTime);
    }
  };

  // Auto-load anchor on mount — use cache if not expired by frequency
  useEffect(()=>{
    if (!canShowAnchor) return;
    try {
      const cached = JSON.parse(localStorage.getItem("selah_cached_anchor")||"null");
      if (cached && cached.quote && !isAnchorExpired(cached)) { setQuote(cached.quote); setLoading(false); return; }
    } catch {}
    loadQuote();
    try { localStorage.setItem("selah_last_quote", String(Date.now())); } catch {}
  },[]);
  useEffect(()=>{
    const hr=new Date().getHours();
    if((hr>=22||hr<5)&&showLateNight&&!isFirstVisit){ setTimeout(()=>setShowLN(true),1200); }
  },[]);

  // Monthly Pulse Report — Growth+ only, generated on the 1st
  useEffect(()=>{
    const canReport = (TIER_LEVELS[tier]||0) >= TIER_LEVELS.growth;
    if (!canReport || monthlyReportDismissed) return;
    const today = new Date();
    if (today.getDate() !== 1) return;
    const monthKey = `${today.getFullYear()}-${today.getMonth()}`;
    try {
      const cached = JSON.parse(localStorage.getItem("selah_monthly_report")||"null");
      if (cached && cached.month === monthKey) { setMonthlyReport(cached.report); return; }
    } catch {}
    // Build last month's mood data
    const lastMonthIdx = today.getMonth() - 1 < 0 ? 11 : today.getMonth() - 1;
    const lastMonthYear = today.getMonth() - 1 < 0 ? today.getFullYear() - 1 : today.getFullYear();
    const lastMonthName = new Date(lastMonthYear, lastMonthIdx, 1).toLocaleDateString("en-US",{month:"long"});
    const lastMonthMoods = (moodHistory||[]).filter(m => {
      const d = new Date(m.date);
      return d.getMonth() === lastMonthIdx && d.getFullYear() === lastMonthYear;
    });
    const lastMonthSessions = (sessionHistory||[]).filter(s => {
      const d = new Date(s.date);
      return d.getMonth() === lastMonthIdx && d.getFullYear() === lastMonthYear;
    });
    if (lastMonthMoods.length < 2 && lastMonthSessions.length < 1) return;
    setMonthlyReportLoading(true);
    const moodSummary = lastMonthMoods.map(m => {
      const labels = ["struggling","low","okay","steady","good"];
      return `${new Date(m.date).toLocaleDateString("en-US",{month:"short",day:"numeric"})}: ${labels[m.mood]||"okay"}${m.word ? ` (${m.word})` : ""}`;
    }).join(", ");
    const sessionSummary = lastMonthSessions.map(s => s.category || "open reflection").join(", ");
    fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:300,
        messages:[{role:"user",content:`You are a compassionate mentor writing a personal monthly reflection summary for ${userName||"someone"} based on their wellness data from ${lastMonthName}. Mood logs: ${moodSummary||"none"}. Reflection topics: ${sessionSummary||"none"}. Write 3-4 sentences in second person, past tense, warm and honest — not therapy-speak. Notice patterns, name the movement (or the stillness), and end with one sentence of encouragement looking forward. Do NOT use bullet points or headers. Just flowing prose.`}]})})
    .then(r=>r.json())
    .then(d=>{
      const report = d.content?.map(b=>b.text||"").join("").trim();
      if (report) {
        setMonthlyReport(report);
        try { localStorage.setItem("selah_monthly_report", JSON.stringify({month:monthKey,report})); } catch {}
      }
    })
    .catch(()=>{})
    .finally(()=>setMonthlyReportLoading(false));
  },[]);

  const loadQuote=async()=>{
    setLoading(true);
    const userContext = onboardingAnswers ? [
      onboardingAnswers.reasons && `They're working through: ${Array.isArray(onboardingAnswers.reasons)?onboardingAnswers.reasons.join(", "):onboardingAnswers.reasons}`,
      onboardingAnswers.biggest && `Carrying: ${onboardingAnswers.biggest}`,
    ].filter(Boolean).join(". ") : "";
    const avoidText = quote ? ` IMPORTANT: Do NOT repeat this quote: "${quote.quote}" by ${quote.author}. Pick something completely different — different author, different theme, different era.` : "";
    const seed = Math.floor(Math.random()*10000);
    try {
      const r=await fetch("/api/chat",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ model:"claude-sonnet-4-20250514",max_tokens:600,
          messages:[{role:"user",content:`Generate a daily anchor for someone working on mental clarity and inner growth.${userContext?` Context about them: ${userContext}.`:""} ${faithLevel>=2?"Include faith-based quotes.":"Lean secular — philosophers, psychologists, wisdom traditions."}${seasonalMode && currentSeason?.anchorTheme ? ` SEASONAL FOCUS: This is the season of ${currentSeason.name}. Weight the quote and reflection toward themes of: ${currentSeason.anchorTheme}. Choose a quote that fits this season deeply.` : ""}${avoidText} Variety seed: ${seed}. Return ONLY JSON with no markdown:
{"quote":"a meaningful quote (Bible verse, philosopher, psychiatrist, or faith leader)","author":"source or name","type":"Bible|Wisdom|Faith|Philosophy","theme":"the core theme","question":"one grounding reflection question tied to the quote — direct, not therapy-speak. Under 20 words.","action":"one small, concrete action they can take today. Under 20 words. Starts with a verb."}`}] }) });
      const d=await r.json();
      if(d.error) { console.error("API error:", d); throw new Error(d.error?.message||"API error"); }
      const t=d.content.map(b=>b.text||"").join("").trim();
      var aParsed=JSON.parse(t.replace(/```json|```/g,"").trim()); setQuote(aParsed); try{localStorage.setItem("selah_cached_anchor",JSON.stringify({quote:aParsed,timestamp:Date.now()}));}catch{}
    } catch(e) { console.error("Quote load failed:", e); setQuote({quote:"Be still and know that I am God.",author:"Psalm 46:10",type:"Bible",theme:"peace",question:"What would it feel like to stop striving for just one hour today?",action:"Sit quietly for 5 minutes before reaching for your phone."}); }
    finally { setLoading(false); }
  };

  const typeColor={Bible:C.sage,Wisdom:C.amber,Faith:C.sage,Philosophy:C.terra,Inspiration:C.amber};
  const typeBg={Bible:`${C.sage}18`,Wisdom:`${C.amber}18`,Faith:`${C.sage}18`,Philosophy:`${C.terra}15`,Inspiration:`${C.amberLight}33`};

  // Mark user as active today when they visit home
  useEffect(() => { if (onActive) onActive(); }, []);

  // ── Notifications: weekly inspiration + recap ──
  useEffect(()=>{
    const loadNotifications = async () => {
      // Check what's been read
      let readIds = [];
      try { readIds = JSON.parse(localStorage.getItem("selah_read_notis")||"[]"); } catch {}

      // Build notification list
      const items = [];

      // Weekly AI inspiration — only on Mondays, cached for the week
      const today = new Date();
      const isMonday = today.getDay() === 1;
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - ((today.getDay() + 6) % 7)); // get Monday of this week
      const weekKey = weekStart.toISOString().split("T")[0];

      let weeklyInsp = null;
      try {
        const cached = JSON.parse(localStorage.getItem("selah_weekly_inspo")||"null");
        if (cached && cached.week === weekKey) { weeklyInsp = cached.data; }
      } catch {}

      if (!weeklyInsp && isMonday) {
        setNotiLoading(true);
        const context = onboardingAnswers ? [
          onboardingAnswers.reasons && `They're working through: ${Array.isArray(onboardingAnswers.reasons)?onboardingAnswers.reasons.join(", "):onboardingAnswers.reasons}`,
          onboardingAnswers.goal && `Their goal: ${onboardingAnswers.goal}`,
        ].filter(Boolean).join(". ") : "";
        try {
          const r = await fetch("/api/chat",{
            method:"POST",headers:{"Content-Type":"application/json"},
            body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:250,
              messages:[{role:"user",content:`It's Monday morning. Write a weekly inspirational message (3-4 sentences) for ${userName||"someone"} using a mental wellness app to set the tone for their week ahead. ${context?`About them: ${context}.`:""} ${faithLevel>=2?"Include a faith reference or scripture.":"Keep it secular."} ${tone==="warm"?"Be nurturing and soft.":tone==="spiritual"?"Lead with faith and God's presence.":"Be warm and grounded."} Not therapy-speak. Write like a wise mentor sending a Monday morning message. No quotes, no bullet points.`}]})});
          const d = await r.json();
          if(d.error) throw new Error(d.error?.message||"API error");
          weeklyInsp = d.content.map(b=>b.text||"").join("").trim();
        } catch {
          weeklyInsp = "New week, new grace. Whatever last week held — let it go. You don't have to carry it into this one. Show up today with just one intention, and let that be enough.";
        }
        try { localStorage.setItem("selah_weekly_inspo", JSON.stringify({ week:weekKey, data:weeklyInsp })); } catch {}
        setNotiLoading(false);
      }

      // Add weekly inspiration if it exists
      if (weeklyInsp) {
        const inspId = `inspo_${weekKey}`;
        items.unshift({
          id: inspId, date: `Week of ${weekStart.toLocaleDateString("en-US",{month:"short",day:"numeric"})}`,
          title: "Weekly Encouragement", body: weeklyInsp, type: "inspiration",
          read: readIds.includes(inspId)
        });
      }

      // Add weekly recap notification (Sunday)
      const recapWeekKey = new Date().toISOString().split("T")[0];
      try {
        const recapCached = JSON.parse(localStorage.getItem("selah_weekly_recap")||"null");
        if (recapCached && recapCached.week === recapWeekKey && recapCached.data) {
          const recapId = `recap_${recapWeekKey}`;
          items.unshift({
            id: recapId, date: "Sunday Recap",
            title: "Your Weekly Recap", body: recapCached.data, type: "recap",
            read: readIds.includes(recapId)
          });
        }
      } catch {}

      setNotifications(items);
      setUnreadCount(items.filter(n=>!n.read).length);
    };
    loadNotifications();
  },[]);

  const markAllRead = () => {
    const ids = notifications.map(n=>n.id);
    try { localStorage.setItem("selah_read_notis", JSON.stringify(ids)); } catch {}
    setNotifications(prev=>prev.map(n=>({...n,read:true})));
    setUnreadCount(0);
  };

  const openNotifications = () => {
    setShowNotifications(true);
    // Auto-mark as read after a short delay
    setTimeout(()=>markAllRead(), 1500);
  };

  return (
    <div style={{ minHeight:"100vh",background:C.bgPrimary,fontFamily:font,
      padding:"40px 20px 100px",boxSizing:"border-box",position:"relative",overflow:"hidden" }}>
      {/* Living ambient overlay — shifts with time of day */}
      <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, pointerEvents:"none", zIndex:0,
        background:`radial-gradient(ellipse at 20% 10%, ${tod.overlay} 0%, transparent 60%)`,
        opacity:tod.opacity, transition:"opacity 3s ease, background 3s ease" }}/>
      <div style={{ position:"absolute",top:"-60px",left:"-60px",width:"300px",height:"300px",
        background:`radial-gradient(circle,${C.amberLight}15 0%,transparent 70%)`,pointerEvents:"none", zIndex:0 }}/>
      <div style={{ maxWidth:"480px",margin:"0 auto",position:"relative",zIndex:1 }}>

        {/* Header */}
        <div style={{ display:"flex",justifyContent:"space-between",
          alignItems:"center",marginBottom:"28px" }}>
          <div>
            <WaveLogo size={26} color={C.accent}/>
            <h1 style={{ color:C.textPrimary,fontSize:"18px",fontWeight:"normal",
              margin:"4px 0 0",letterSpacing:"0.04em",
              transition:"color 3s ease" }}>
              {userName ? `${tod.label}, ${userName}.` : tod.label + "."}
            </h1>
            <p style={{ color:C.textMuted, fontSize:"11px", fontStyle:"italic",
              margin:"2px 0 0", opacity:0.7, transition:"opacity 3s ease" }}>
              {tod.sub}
            </p>
          </div>
          <div style={{ display:"flex",gap:"8px",alignItems:"center" }}>
            {/* Feedback */}
            <div onClick={()=>setScreen("feedback")}
              style={{ background:C.bgSecondary,borderRadius:"8px",
                padding:"8px 10px",border:`1px solid ${C.border}`,
                display:"flex",alignItems:"center",justifyContent:"center",
                cursor:"pointer",transition:"all 0.2s ease" }}
              onMouseEnter={e=>e.currentTarget.style.borderColor=C.accent+"55"}
              onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke={C.textSoft} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            {/* Notification Bell */}
            <div onClick={openNotifications}
              style={{ background:C.bgSecondary,borderRadius:"8px",
                padding:"8px 10px",border:`1px solid ${C.border}`,
                display:"flex",alignItems:"center",justifyContent:"center",
                cursor:"pointer",position:"relative",transition:"all 0.2s ease" }}
              onMouseEnter={e=>e.currentTarget.style.borderColor=C.accent+"55"}
              onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M18 8A6 6 0 106 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={C.textSoft} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13.73 21a2 2 0 01-3.46 0" stroke={C.textSoft} strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              {unreadCount > 0 && (
                <div style={{ position:"absolute",top:"-3px",right:"-3px",
                  width:"16px",height:"16px",borderRadius:"50%",
                  background:C.terra,display:"flex",alignItems:"center",justifyContent:"center",
                  border:`2px solid ${C.bgPrimary}` }}>
                  <span style={{ color:"#fff",fontSize:"8px",fontWeight:"bold" }}>{unreadCount}</span>
                </div>
              )}
            </div>
            {(()=>{
              const now = new Date();
              const dayOfWeek = now.getDay() === 0 ? 7 : now.getDay();
              const weekStart = new Date(now); weekStart.setDate(now.getDate() - dayOfWeek + 1);
              const getDateStr = d => d.toISOString().split("T")[0];
              const currentWeekKey = getDateStr(weekStart);
              const graceCount = (graceUsedWeek?.week === currentWeekKey) ? (graceUsedWeek?.count || 0) : 0;
              const graceActive = graceCount > 0;
              return (
                <div onClick={()=>setScreen("progress")}
                  style={{ background:C.bgSecondary,borderRadius:"8px",
                    padding:"8px 14px",border:`1px solid ${graceActive ? C.sage+"55" : C.amber+"33"}`,
                    display:"flex",alignItems:"center",gap:"6px",cursor:"pointer",
                    position:"relative", transition:"border-color 0.3s ease" }}>
                  <span style={{ fontSize:"14px" }}>{graceActive ? "🛡️" : "🔥"}</span>
                  <span style={{ color:graceActive ? C.sage : C.amber,fontSize:"15px",fontWeight:"bold",fontFamily:font }}>{steadyDays}</span>
                  {graceActive && (
                    <span style={{ position:"absolute",top:"-8px",right:"-6px",
                      background:C.sage,color:"#fff",fontSize:"8px",
                      borderRadius:"8px",padding:"2px 5px",fontStyle:"italic",
                      letterSpacing:"0.5px",whiteSpace:"nowrap" }}>
                      protected
                    </span>
                  )}
                </div>
              );
            })()}
          </div>
        </div>

        {/* ── CRISIS QUICK ACCESS ── */}
        <div onClick={()=>setShowCrisisPanel(true)} style={{
          background:`${C.terra}08`, border:`1px solid ${C.terra}22`,
          borderRadius:"10px", padding:"12px 16px", marginBottom:"16px",
          cursor:"pointer", display:"flex", alignItems:"center", gap:"12px",
          transition:"all 0.2s ease" }}
          onMouseEnter={e=>e.currentTarget.style.borderColor=C.terra+"55"}
          onMouseLeave={e=>e.currentTarget.style.borderColor=C.terra+"22"}>
          <div style={{ width:"32px", height:"32px", borderRadius:"50%",
            background:`${C.terra}15`, border:`1px solid ${C.terra}33`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:"14px", flexShrink:0 }}>🤍</div>
          <div style={{ flex:1 }}>
            <p style={{ color:C.terra, fontSize:"11px", fontWeight:"bold",
              fontFamily:font, margin:"0 0 1px" }}>Need support right now?</p>
            <p style={{ color:C.textMuted, fontSize:"10px", fontStyle:"italic", margin:0 }}>
              988 Lifeline · Crisis Text · STOMP Out Bullying · 911
            </p>
          </div>
          <span style={{ color:C.terra, fontSize:"14px" }}>→</span>
        </div>

        {/* ── TODAY'S ANCHOR (top of page) ── */}
        {canShowAnchor ? (
        <>
        <Label text="Today's Anchor" color={C.amber} font={font}/>
        <div style={{ background:quote?(typeBg[quote.type]||C.bgSecondary):C.bgSecondary,
          borderRadius:"10px", marginBottom:"14px",
          border:`1.5px solid ${quote?(typeColor[quote.type]||C.sage)+"44":C.border}`,
          overflow:"hidden", transition:"all 0.5s ease" }}>
          {loading?(
            <div style={{ padding:"24px",textAlign:"center",minHeight:"120px",
              display:"flex",flexDirection:"column",justifyContent:"center" }}>
              <div style={{ display:"flex",justifyContent:"center",gap:"8px",marginBottom:"10px" }}>
                {[0,1,2].map(i=>(
                  <div key={i} style={{ width:"8px",height:"8px",borderRadius:"50%",
                    background:C.amber,opacity:0.5,
                    animation:"pulse 1.2s ease-in-out infinite",
                    animationDelay:`${i*0.2}s` }}/>
                ))}
              </div>
              <p style={{ color:C.textMuted,fontSize:"12px",fontStyle:"italic",margin:0 }}>
                Preparing your anchor...
              </p>
            </div>
          ):quote?(
            <>
              {/* Quote */}
              <div style={{ padding:"20px 20px 16px" }}>
                <div style={{ display:"flex",justifyContent:"space-between",
                  alignItems:"center",marginBottom:"10px" }}>
                  <div style={{ display:"flex",alignItems:"center",gap:"5px" }}>
                    <div style={{ width:"5px",height:"5px",borderRadius:"50%",
                      background:typeColor[quote.type]||C.amber }}/>
                    <span style={{ color:typeColor[quote.type]||C.amber,fontSize:"9px",
                      letterSpacing:"2px",textTransform:"uppercase" }}>{quote.type}</span>
                  </div>
                  {sharingEnabled&&(
                    <button onClick={()=>{
                      navigator.clipboard?.writeText(`"${quote.quote}" — ${quote.author}\n\nShared from Selah`);
                      setCopied(true); setTimeout(()=>setCopied(false),2000);
                    }} style={{ background:"none",border:"none",cursor:"pointer",
                      color:copied?C.accent:C.textMuted,fontSize:"11px",
                      fontStyle:"italic",fontFamily:font,transition:"color 0.2s ease" }}>
                      {copied?"Copied ✓":"Share ↗"}
                    </button>
                  )}
                </div>
                <p style={{ color:C.textPrimary,fontSize:"clamp(13px,3.5vw,15px)",
                  lineHeight:"1.9",margin:"0 0 12px",fontStyle:"italic" }}>
                  "{quote.quote}"
                </p>
                <div style={{ display:"flex",alignItems:"center",gap:"8px" }}>
                  <div style={{ width:"20px",height:"1px",
                    background:typeColor[quote.type]||C.amber,opacity:0.5 }}/>
                  <span style={{ color:C.textSoft,fontSize:"11px",fontStyle:"italic" }}>
                    {quote.author}
                  </span>
                </div>
              </div>
              {/* Reflection question */}
              {quote.question&&(
                <>
                  <div style={{ height:"1px",background:C.border,margin:"0 20px" }}/>
                  <div style={{ padding:"14px 20px 0" }}>
                    <p style={{ color:C.textMuted,fontSize:"9px",letterSpacing:"2.5px",
                      textTransform:"uppercase",fontStyle:"italic",margin:"0 0 6px" }}>
                      Reflect on this
                    </p>
                    <p style={{ color:C.textSoft,fontSize:"13px",fontStyle:"italic",
                      lineHeight:"1.8",margin:0 }}>{quote.question}</p>
                  </div>
                </>
              )}
              {/* One small action */}
              {quote.action&&(
                <>
                  <div style={{ height:"1px",background:C.border,margin:"14px 20px 0" }}/>
                  <div style={{ padding:"12px 20px 16px",background:`${C.terra}08` }}>
                    <div style={{ display:"flex",alignItems:"center",gap:"8px" }}>
                      <div style={{ width:"6px",height:"6px",borderRadius:"50%",
                        background:C.terra,flexShrink:0 }}/>
                      <p style={{ color:C.terra,fontSize:"9px",letterSpacing:"2px",
                        textTransform:"uppercase",fontStyle:"italic",margin:0 }}>
                        One small move today
                      </p>
                    </div>
                    <p style={{ color:C.textSoft,fontSize:"12px",fontStyle:"italic",
                      lineHeight:"1.7",margin:"6px 0 0",paddingLeft:"14px" }}>
                      {quote.action}
                    </p>
                  </div>
                </>
              )}
            </>
          ):(
            <div style={{ padding:"24px",textAlign:"center" }}>
              <p style={{ color:C.textMuted,fontSize:"12px",fontStyle:"italic",margin:0 }}>
                Tap below to load your anchor
              </p>
            </div>
          )}
        </div>
        </>
        ) : (
          <div style={{ background:`${C.amber}08`,border:`1.5px solid ${C.amber}33`,
            borderRadius:"10px",padding:"18px",marginBottom:"14px",textAlign:"center" }}>
            <span style={{ fontSize:"20px" }}>🔒</span>
            <p style={{ color:C.textPrimary,fontSize:"13px",fontWeight:"bold",fontFamily:font,margin:"6px 0 4px" }}>Daily Anchor</p>
            <p style={{ color:C.textSoft,fontSize:"11px",fontStyle:"italic",lineHeight:"1.7",margin:"0 0 10px" }}>
              AI-powered daily quotes, reflections, and action steps. Unlocks with Foundation plan.
            </p>
            <button onClick={onUpgrade} style={{ background:C.amber,border:"none",borderRadius:"3px",
              color:"#fff",fontSize:"9px",letterSpacing:"2px",textTransform:"uppercase",
              padding:"8px 20px",cursor:"pointer",fontFamily:font,fontStyle:"italic" }}>
              Unlock Anchor
            </button>
          </div>
        )}

        {/* Monthly Goal — Growth & Deep tiers only */}
      {((TIER_LEVELS[tier]||0) >= TIER_LEVELS.growth || new URLSearchParams(window.location.search).get("admin") === "f7a3d9e2-4c1b-4e8f-b2a6-9d5c3e7f1a04") && monthlyGoal && (
        <div style={{ background:`${C.sage}08`,border:`1.5px solid ${C.sage}33`,
          borderRadius:"12px",padding:"20px",marginBottom:"14px" }}>
          <div style={{ display:"flex",alignItems:"center",gap:"8px",marginBottom:"10px" }}>
            <span style={{ fontSize:"18px" }}>🎯</span>
            <div>
              <p style={{ color:C.sage,fontSize:"9px",letterSpacing:"3px",
                textTransform:"uppercase",fontStyle:"italic",margin:0,fontWeight:"bold" }}>This Month's Goal</p>
              <p style={{ color:C.textPrimary,fontSize:"15px",fontWeight:"bold",fontFamily:font,margin:"2px 0 0" }}>{monthlyGoal.title}</p>
            </div>
          </div>
          <p style={{ color:C.textSoft,fontSize:"13px",fontStyle:"italic",lineHeight:"1.7",margin:"0 0 12px" }}>{monthlyGoal.description}</p>
          {monthlyGoal.actionSteps && (
            <div style={{ display:"flex",flexDirection:"column",gap:"6px" }}>
              {monthlyGoal.actionSteps.map((step,i)=>(
                <div key={i} style={{ display:"flex",alignItems:"flex-start",gap:"8px" }}>
                  <span style={{ color:C.sage,fontSize:"11px",marginTop:"2px" }}>✦</span>
                  <p style={{ color:C.textSoft,fontSize:"12px",lineHeight:"1.6",margin:0 }}>{step}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Weekly Recap — Sunday 6pm+, paid tiers only */}
        {(weeklyRecap || recapLoading) && !recapDismissed && (
          <div style={{ background:`${C.accent}08`,border:`1.5px solid ${C.accent}33`,
            borderRadius:"12px",padding:"20px",marginBottom:"14px",position:"relative" }}>
            <button onClick={()=>setRecapDismissed(true)} style={{ position:"absolute",top:"10px",right:"12px",
              background:"none",border:"none",color:C.textMuted,fontSize:"14px",cursor:"pointer",padding:"4px" }}>×</button>
            <div style={{ display:"flex",alignItems:"center",gap:"8px",marginBottom:"10px" }}>
              <span style={{ fontSize:"18px" }}>📊</span>
              <div>
                <p style={{ color:C.accent,fontSize:"9px",letterSpacing:"3px",
                  textTransform:"uppercase",fontStyle:"italic",margin:0,fontWeight:"bold" }}>Your Week in Review</p>
                <p style={{ color:C.textMuted,fontSize:"10px",fontStyle:"italic",margin:"2px 0 0" }}>
                  {tier==="deep"?"Deep Analysis":tier==="growth"?"Growth Insights":"Weekly Summary"}
                </p>
              </div>
            </div>
            {recapLoading ? (
              <div style={{ display:"flex",alignItems:"center",gap:"8px",padding:"8px 0" }}>
                <div style={{ display:"flex",gap:"4px" }}>
                  {[0,1,2].map(i=>(
                    <div key={i} style={{ width:"6px",height:"6px",borderRadius:"50%",
                      background:C.accent,opacity:0.5,
                      animation:"pulse 1.2s ease-in-out infinite",
                      animationDelay:`${i*0.2}s` }}/>
                  ))}
                </div>
                <span style={{ color:C.textMuted,fontSize:"11px",fontStyle:"italic" }}>Reviewing your week...</span>
              </div>
            ) : (
              <p style={{ color:C.textSoft,fontSize:"13px",fontStyle:"italic",
                lineHeight:"2",margin:0 }}>
                {weeklyRecap}
              </p>
            )}
          </div>
        )}

      {/* ── SEASONAL OPT-IN — show when season active, seasonal mode off ── */}
      {currentSeason && currentSeason.id !== "ordinary" && !seasonalMode && !seasonOptInDismissed && (TIER_LEVELS[tier]||0) >= TIER_LEVELS.foundation && (
        <div style={{ background:`${C.accent}08`, border:`1.5px solid ${C.accent}33`,
          borderRadius:"12px", padding:"16px 18px", marginBottom:"14px", position:"relative" }}>
          <button onClick={()=>{ try{localStorage.setItem("selah_season_optin_dismissed", new Date().toDateString());}catch{} setSeasonOptInDismissed(true); }}
            style={{ position:"absolute",top:"10px",right:"12px",background:"none",
              border:"none",cursor:"pointer",color:C.textMuted,fontSize:"14px",lineHeight:1 }}>✕</button>
          <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"8px" }}>
            <span style={{ fontSize:"18px" }}>{currentSeason.icon}</span>
            <p style={{ color:C.accent, fontSize:"9px", letterSpacing:"2.5px",
              textTransform:"uppercase", fontStyle:"italic", margin:0 }}>
              {currentSeason.name} {currentSeason.daysLeft != null ? `· ${currentSeason.daysLeft} days left` : ""}
            </p>
          </div>
          <p style={{ color:C.textPrimary, fontSize:"13px", fontFamily:font,
            lineHeight:"1.7", margin:"0 0 12px" }}>
            Want Selah to shift with the season? Seasonal mode tunes your reflections, anchor quotes, and accent color to {currentSeason.name}.
          </p>
          <div style={{ display:"flex", gap:"10px" }}>
            <button onClick={()=>setSeasonalMode(true)} style={{
              background:C.accent, border:"none", borderRadius:"3px",
              color:"#fff", fontSize:"10px", letterSpacing:"2.5px",
              textTransform:"uppercase", fontStyle:"italic",
              padding:"11px 20px", cursor:"pointer", fontFamily:font }}>
              Turn on
            </button>
            <button onClick={()=>{ try{localStorage.setItem("selah_season_optin_dismissed", new Date().toDateString());}catch{} setSeasonOptInDismissed(true); }} style={{
              background:"none", border:`1px solid ${C.border}`,
              borderRadius:"3px", color:C.textMuted, fontSize:"10px",
              letterSpacing:"2.5px", textTransform:"uppercase",
              padding:"11px 20px", cursor:"pointer", fontFamily:font }}>
              Not now
            </button>
          </div>
        </div>
      )}

      {/* ── SEASONAL MODE BANNER — when active ── */}
      {currentSeason && currentSeason.id !== "ordinary" && seasonalMode && (
        <div style={{ background:`${C.accent}10`, border:`1px solid ${C.accent}33`,
          borderRadius:"10px", padding:"12px 16px", marginBottom:"14px",
          display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
            <span style={{ fontSize:"16px" }}>{currentSeason.icon}</span>
            <div>
              <p style={{ color:C.accent, fontSize:"9px", letterSpacing:"2.5px",
                textTransform:"uppercase", fontStyle:"italic", margin:0 }}>{currentSeason.name}</p>
              {currentSeason.daysLeft != null && (
                <p style={{ color:C.textMuted, fontSize:"10px", fontStyle:"italic", margin:"2px 0 0" }}>
                  {currentSeason.daysLeft} days remaining
                </p>
              )}
            </div>
          </div>
          <button onClick={()=>setSeasonalMode(false)} style={{
            background:"none", border:`1px solid ${C.accent}44`,
            borderRadius:"3px", color:C.accent, fontSize:"9px",
            letterSpacing:"2px", textTransform:"uppercase", fontStyle:"italic",
            padding:"7px 14px", cursor:"pointer", fontFamily:font }}>
            Off
          </button>
        </div>
      )}

      {/* ── CHRISTIAN HOLIDAY CARD — Foundation+ ── */}
      {todayHoliday && !holidayDismissed && (TIER_LEVELS[tier]||0) >= TIER_LEVELS.foundation && (
        <div style={{ background:`${C.amber}08`, border:`1.5px solid ${C.amber}33`,
          borderRadius:"12px", padding:"18px", marginBottom:"14px", position:"relative" }}>
          <button onClick={()=>{ try{localStorage.setItem("selah_holiday_dismissed", new Date().toDateString());}catch{} setHolidayDismissed(true); }}
            style={{ position:"absolute",top:"10px",right:"12px",background:"none",
              border:"none",cursor:"pointer",color:C.textMuted,fontSize:"14px",lineHeight:1 }}>✕</button>
          <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"10px" }}>
            <span style={{ fontSize:"22px" }}>{todayHoliday.icon}</span>
            <div>
              <p style={{ color:C.amber, fontSize:"9px", letterSpacing:"2.5px",
                textTransform:"uppercase", fontStyle:"italic", margin:0 }}>Today</p>
              <p style={{ color:C.textPrimary, fontSize:"15px", fontFamily:font,
                margin:"2px 0 0", fontWeight:"normal" }}>{todayHoliday.name}</p>
            </div>
          </div>
          <p style={{ color:C.textSoft, fontSize:"12px", fontStyle:"italic",
            lineHeight:"1.9", margin:"0 0 10px",
            borderLeft:`2px solid ${C.amber}44`, paddingLeft:"10px" }}>
            "{todayHoliday.verse}"
          </p>
          <p style={{ color:C.textMuted, fontSize:"12px", fontStyle:"italic",
            lineHeight:"1.8", margin:0 }}>{todayHoliday.reflection}</p>
        </div>
      )}

      {/* Sunday Question — Foundation+, every Sunday */}
      {sundayQ && !sundayDismissed && new Date().getDay() === 0 && (TIER_LEVELS[tier]||0) >= TIER_LEVELS.foundation && (
        <div style={{ background:`${C.sage}08`, border:`1.5px solid ${C.sage}33`,
          borderRadius:"12px", padding:"18px 18px 16px", marginBottom:"14px", position:"relative" }}>
          <button onClick={()=>{ try{localStorage.setItem("selah_sunday_q_dismissed", new Date().toDateString());}catch{} setSundayDismissed(true); }}
            style={{ position:"absolute",top:"10px",right:"12px",background:"none",
              border:"none",cursor:"pointer",color:C.textMuted,fontSize:"14px",lineHeight:1 }}>✕</button>
          <p style={{ color:C.sage, fontSize:"9px", letterSpacing:"2.5px",
            textTransform:"uppercase", fontStyle:"italic", margin:"0 0 10px" }}>Sunday Question</p>
          <p style={{ color:C.textPrimary, fontSize:"15px", fontFamily:font,
            lineHeight:"1.7", margin:"0 0 14px", fontWeight:"normal", paddingRight:"20px" }}>
            {sundayQ}
          </p>
          {!sundaySubmitted ? (
            <>
              <textarea
                value={sundayAnswer}
                onChange={e=>setSundayAnswer(e.target.value)}
                placeholder="One line is enough."
                rows={2}
                style={{ width:"100%", background:C.bgSecondary, border:`1px solid ${C.sage}33`,
                  borderRadius:"8px", padding:"10px 12px", fontFamily:font, fontSize:"13px",
                  color:C.textPrimary, lineHeight:"1.7", resize:"none",
                  boxSizing:"border-box", outline:"none", marginBottom:"10px" }}
              />
              <button
                onClick={()=>{
                  if (!sundayAnswer.trim()) return;
                  if (onActive) onActive();
                  // Save as journal entry
                  const entry = {
                    id: Date.now(),
                    date: new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}),
                    title: `Sunday: ${sundayQ.slice(0,40)}...`,
                    text: sundayAnswer.trim(),
                    mood:"📖", tags:["sunday"], words: sundayAnswer.trim().split(/\s+/).length
                  };
                  setJournalEntries(prev=>[entry,...prev]);
                  setSundaySubmitted(true);
                }}
                disabled={!sundayAnswer.trim()}
                style={{ background:sundayAnswer.trim()?C.sage:"transparent",
                  border:`1.5px solid ${sundayAnswer.trim()?C.sage:C.textMuted+"33"}`,
                  borderRadius:"3px", color:sundayAnswer.trim()?"#fff":C.textMuted,
                  fontSize:"10px", letterSpacing:"2.5px", textTransform:"uppercase",
                  fontStyle:"italic", padding:"11px 28px", cursor:sundayAnswer.trim()?"pointer":"default",
                  fontFamily:font, transition:"all 0.2s ease" }}>
                Save it
              </button>
            </>
          ) : (
            <p style={{ color:C.sage, fontSize:"12px", fontStyle:"italic",
              lineHeight:"1.8", margin:0 }}>
              ✓ Saved to your Notebook. See you next Sunday.
            </p>
          )}
        </div>
      )}

      {/* Daily AI Encouragement — Growth+ */}
      {dailyEncouragement && (TIER_LEVELS[tier]||0) >= TIER_LEVELS.growth && (
        <div style={{ background:`${C.sage}08`, border:`1px solid ${C.sage}22`,
          borderRadius:"10px", padding:"14px 16px", marginBottom:"14px" }}>
          <p style={{ color:C.sage, fontSize:"9px", letterSpacing:"2.5px",
            textTransform:"uppercase", fontStyle:"italic", margin:"0 0 6px" }}>Daily Encouragement</p>
          <p style={{ color:C.textSoft, fontSize:"13px", fontStyle:"italic",
            lineHeight:"1.9", margin:0 }}>{dailyEncouragement}</p>
        </div>
      )}

        {/* ── THIS TIME LAST MONTH — 1st of each month, shows 2 months ago ── */}
        {(()=>{
          if (ttlmDismissed) return null;
          const today = new Date();
          if (today.getDate() !== 1) return null; // Only show on the 1st
          // Target month = 2 months ago
          const targetMonth = today.getMonth() - 2 < 0 ? today.getMonth() - 2 + 12 : today.getMonth() - 2;
          const targetYear = today.getMonth() - 2 < 0 ? today.getFullYear() - 1 : today.getFullYear();
          const moodEntry = (moodHistory||[]).find(m => {
            const d = new Date(m.date);
            return d.getMonth() === targetMonth && d.getFullYear() === targetYear;
          });
          const sessionEntry = (sessionHistory||[]).find(s => {
            const d = new Date(s.date);
            return d.getMonth() === targetMonth && d.getFullYear() === targetYear;
          });
          if (!moodEntry && !sessionEntry) return null;
          const moodLabels = ["","","Struggling","Low","Okay","Steady","Good","Really good","Thriving"];
          const moodLabel = moodEntry ? (moodLabels[moodEntry.mood] || "quiet") : null;
          const dateLabel = new Date((moodEntry||sessionEntry).date).toLocaleDateString("en-US",{month:"long",day:"numeric"});
          const monthName = new Date(targetYear, targetMonth, 1).toLocaleDateString("en-US",{month:"long"});
          const dismiss = () => { const now=new Date(); try{localStorage.setItem("selah_ttlm_dismissed", `${now.getFullYear()}-${now.getMonth()}`);}catch{} setTtlmDismissed(true); };
          return (
            <div style={{ background:`${C.terra}08`, border:`1px solid ${C.terra}33`,
              borderRadius:"12px", padding:"16px", marginBottom:"14px", position:"relative" }}>
              <button onClick={dismiss}
                style={{ position:"absolute",top:"10px",right:"12px",background:"none",
                  border:"none",cursor:"pointer",color:C.textMuted,fontSize:"14px",lineHeight:1 }}>✕</button>
              <p style={{ color:C.terra, fontSize:"9px", letterSpacing:"2.5px",
                textTransform:"uppercase", margin:"0 0 8px" }}>Looking back · {monthName}</p>
              {moodLabel && (
                <p style={{ color:C.textPrimary, fontSize:"13px", fontFamily:font,
                  lineHeight:"1.8", margin:"0 0 6px" }}>
                  On <span style={{color:C.terra}}>{dateLabel}</span>, you were feeling <span style={{color:C.terra,fontStyle:"italic"}}>{moodLabel.toLowerCase()}</span>.
                  {moodEntry.word ? <span style={{color:C.textSoft}}> Your word was "{moodEntry.word}".</span> : null}
                </p>
              )}
              {sessionEntry?.insight && (
                <p style={{ color:C.textSoft, fontSize:"12px", fontStyle:"italic",
                  lineHeight:"1.8", margin:"0 0 6px", borderLeft:`2px solid ${C.terra}44`,
                  paddingLeft:"10px" }}>
                  "{sessionEntry.insight}"
                </p>
              )}
              {sessionEntry?.takeaway && (
                <p style={{ color:C.textMuted, fontSize:"11px", fontStyle:"italic",
                  lineHeight:"1.7", margin:0 }}>
                  Takeaway: {sessionEntry.takeaway}
                </p>
              )}
              <p style={{ color:C.terra, fontSize:"11px", fontStyle:"italic",
                margin:"10px 0 0", opacity:0.8 }}>A lot can shift in a month.</p>
            </div>
          );
        })()}

        {/* Monthly Pulse Report — Growth+ */}
        {(()=>{
          const canReport = (TIER_LEVELS[tier]||0) >= TIER_LEVELS.growth;
          if (!canReport) return null;
          if (monthlyReportDismissed) return null;
          const today = new Date();
          if (today.getDate() !== 1) return null;
          if (!monthlyReport && !monthlyReportLoading) return null;
          const lastMonthName = new Date(today.getFullYear(), today.getMonth()-1<0?11:today.getMonth()-1, 1)
            .toLocaleDateString("en-US",{month:"long"});
          const dismissReport = () => {
            const now=new Date();
            try{localStorage.setItem("selah_monthly_report_dismissed",`${now.getFullYear()}-${now.getMonth()}`);}catch{}
            setMonthlyReportDismissed(true);
          };
          return (
            <div style={{ background:`${C.accent}08`, border:`1px solid ${C.accent}33`,
              borderRadius:"12px", padding:"18px", marginBottom:"14px", position:"relative" }}>
              <button onClick={dismissReport}
                style={{ position:"absolute",top:"10px",right:"12px",background:"none",
                  border:"none",cursor:"pointer",color:C.textMuted,fontSize:"14px",lineHeight:1 }}>✕</button>
              <p style={{ color:C.accent, fontSize:"9px", letterSpacing:"2.5px",
                textTransform:"uppercase", margin:"0 0 6px" }}>Monthly Pulse · {lastMonthName}</p>
              {monthlyReportLoading ? (
                <div style={{ display:"flex",gap:"6px",alignItems:"center",padding:"8px 0" }}>
                  {[0,1,2].map(i=><div key={i} style={{ width:"6px",height:"6px",borderRadius:"50%",
                    background:C.accent,opacity:0.5,animation:"typeDot 1.2s ease-in-out infinite",
                    animationDelay:`${i*0.2}s` }}/>)}
                  <span style={{ color:C.textMuted,fontSize:"11px",fontStyle:"italic" }}>Reflecting on your month...</span>
                </div>
              ) : (
                <p style={{ color:C.textSoft, fontSize:"13px", fontStyle:"italic",
                  lineHeight:"1.9", margin:0 }}>{monthlyReport}</p>
              )}
            </div>
          );
        })()}

        {/* Date */}
        <div style={{ display:"flex",alignItems:"center",gap:"6px",marginBottom:"6px" }}>
          <div style={{ width:"4px",height:"4px",borderRadius:"50%",background:C.terra,opacity:0.7 }}/>
          <p style={{ color:C.textMuted,fontSize:"11px",fontStyle:"italic",
            letterSpacing:"0.05em",margin:0 }}>
            {new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}
          </p>
        </div>

        {/* Getting Started — shows when user has never done a session */}
        {sessionCount === 0 && !showTutorial && (
          <div style={{ background:`${C.sage}10`, border:`1px solid ${C.sage}33`,
            borderRadius:"12px", padding:"20px", marginBottom:"16px" }}>
            <p style={{ color:C.sage, fontSize:"9px", letterSpacing:"3px",
              textTransform:"uppercase", fontStyle:"italic", margin:"0 0 8px" }}>Where to start</p>
            <p style={{ color:C.textSoft, fontSize:"13px", fontStyle:"italic",
              lineHeight:"1.9", margin:"0 0 16px" }}>
              This is your space. Here are a few ways to begin:
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
              {[
                {icon:((TIER_LEVELS[tier]||0)<TIER_LEVELS.foundation&&!isTrialActive)?"🔒":"💬", label:"Start a reflection", sub:((TIER_LEVELS[tier]||0)<TIER_LEVELS.foundation&&!isTrialActive)?"🔒 Foundation+":"Talk through what's on your mind", action:()=>((TIER_LEVELS[tier]||0)<TIER_LEVELS.foundation&&!isTrialActive)?onUpgrade():setScreen("reflect"), color:((TIER_LEVELS[tier]||0)<TIER_LEVELS.foundation&&!isTrialActive)?C.textMuted:C.accent},
                {icon:((TIER_LEVELS[tier]||0)<TIER_LEVELS.foundation&&!isTrialActive)?"🔒":"⚡", label:"Quick 2-min check-in", sub:((TIER_LEVELS[tier]||0)<TIER_LEVELS.foundation&&!isTrialActive)?"🔒 Foundation+":"Log your mood in under a minute", action:()=>((TIER_LEVELS[tier]||0)<TIER_LEVELS.foundation&&!isTrialActive)?onUpgrade():setScreen("checkin"), color:((TIER_LEVELS[tier]||0)<TIER_LEVELS.foundation&&!isTrialActive)?C.textMuted:C.amber},
                {icon:"◈", label:"Breathing exercise", sub:"Calm your nervous system first", action:()=>setScreen("breathe"), color:C.sage},
              ].map(item => (
                <button key={item.label} onClick={item.action} style={{
                  display:"flex", alignItems:"center", gap:"12px", padding:"12px 14px",
                  background:C.bgSecondary, border:`1px solid ${C.border}`,
                  borderRadius:"8px", cursor:"pointer", textAlign:"left",
                  transition:"all 0.2s ease" }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=item.color+"55";e.currentTarget.style.transform="translateX(2px)";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.transform="translateX(0)";}}>
                  <span style={{ fontSize:"18px" }}>{item.icon}</span>
                  <div style={{ flex:1 }}>
                    <p style={{ color:C.textPrimary, fontSize:"13px", fontFamily:font, margin:"0 0 2px" }}>{item.label}</p>
                    <p style={{ color:C.textMuted, fontSize:"10px", margin:0 }}>{item.sub}</p>
                  </div>
                  <span style={{ color:item.color, fontSize:"14px" }}>→</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Word of the Day */}
        {dayWord && (
          <div style={{ marginBottom:"20px" }}>
            <Label text="Word of the Day" color={C.sage} font={font}/>
            <div style={{ background:C.bgSecondary, borderRadius:"10px", padding:"20px",
              border:`1.5px solid ${C.sage}33` }}>
              <div style={{ display:"flex", alignItems:"baseline", gap:"10px", marginBottom:"10px" }}>
                <h2 style={{ color:C.textPrimary, fontSize:"24px", fontWeight:"bold",
                  fontFamily:font, fontStyle:"italic", margin:0, letterSpacing:"1px" }}>
                  {dayWord.word}
                </h2>
                <div style={{ flex:1, height:"1px", background:`${C.sage}33` }}/>
              </div>
              <p style={{ color:C.textSoft, fontSize:"13px", fontStyle:"italic",
                lineHeight:"1.8", margin:"0 0 14px" }}>
                {dayWord.definition}
              </p>
              <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
                <div style={{ display:"flex", gap:"8px", alignItems:"flex-start" }}>
                  <span style={{ color:C.sage, fontSize:"12px", flexShrink:0, marginTop:"2px" }}>✦</span>
                  <p style={{ color:C.textPrimary, fontSize:"12px", fontStyle:"italic",
                    lineHeight:"1.7", margin:0 }}>{dayWord.reflection}</p>
                </div>
                <div style={{ display:"flex", gap:"8px", alignItems:"flex-start" }}>
                  <span style={{ color:C.amber, fontSize:"12px", flexShrink:0, marginTop:"2px" }}>→</span>
                  <p style={{ color:C.textPrimary, fontSize:"12px", fontStyle:"italic",
                    lineHeight:"1.7", margin:0 }}>{dayWord.action}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Guided Challenges — Deep only */}
        {(TIER_LEVELS[tier]||0) >= TIER_LEVELS.deep && (
          activeChallenge ? (
            <div style={{ background:`${C.accent}08`, border:`1.5px solid ${C.accent}33`,
              borderRadius:"12px", padding:"16px", marginBottom:"14px" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"10px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                  <span style={{ fontSize:"18px" }}>{activeChallenge.icon}</span>
                  <div>
                    <p style={{ color:C.accent, fontSize:"9px", letterSpacing:"2.5px",
                      textTransform:"uppercase", fontStyle:"italic", margin:0 }}>Active Challenge</p>
                    <p style={{ color:C.textPrimary, fontSize:"13px", fontFamily:font, margin:"2px 0 0" }}>
                      {activeChallenge.title}
                    </p>
                  </div>
                </div>
                <div style={{ background:`${C.accent}20`, borderRadius:"20px", padding:"4px 12px" }}>
                  <span style={{ color:C.accent, fontSize:"12px", fontWeight:"bold", fontFamily:font }}>
                    Day {activeChallenge.day}/{activeChallenge.duration}
                  </span>
                </div>
              </div>
              <div style={{ height:"4px", background:C.bgCard, borderRadius:"2px", overflow:"hidden", marginBottom:"10px" }}>
                <div style={{ height:"100%", borderRadius:"2px",
                  background:`linear-gradient(to right, ${C.accent}, ${C.amber})`,
                  width:`${(activeChallenge.day/activeChallenge.duration)*100}%`,
                  transition:"width 0.5s ease" }}/>
              </div>
              <p style={{ color:C.textSoft, fontSize:"11px", fontStyle:"italic", lineHeight:"1.7", margin:"0 0 8px" }}>
                {activeChallenge.desc}
              </p>
              <button onClick={abandonChallenge} style={{ background:"none", border:"none",
                color:C.textMuted, fontSize:"10px", fontStyle:"italic", cursor:"pointer", padding:0 }}>
                End challenge
              </button>
            </div>
          ) : (
            <div style={{ marginBottom:"14px" }}>
              <Label text="Guided Challenges" color={C.accent} font={font}/>
              <p style={{ color:C.textMuted, fontSize:"10px", fontStyle:"italic", margin:"0 0 8px" }}>
                Fresh challenges for {new Date().toLocaleDateString("en-US",{month:"long"})}
              </p>
              {challengesLoading ? (
                <p style={{ color:C.textMuted, fontSize:"11px", fontStyle:"italic" }}>Generating your challenges...</p>
              ) : monthlyChallenges.length > 0 ? (
              <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
                {monthlyChallenges.map(ch => (
                  <button key={ch.id} onClick={()=>startChallenge(ch)} style={{
                    width:"100%", background:C.bgSecondary, border:`1px solid ${C.border}`,
                    borderRadius:"10px", padding:"14px", cursor:"pointer", textAlign:"left",
                    transition:"all 0.2s ease", display:"flex", alignItems:"flex-start", gap:"12px" }}
                    onMouseEnter={e=>e.currentTarget.style.borderColor=C.accent+"55"}
                    onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                    <span style={{ fontSize:"20px", flexShrink:0 }}>{ch.icon}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <p style={{ color:C.textPrimary, fontSize:"12px", fontFamily:font,
                          margin:0 }}>{ch.title}</p>
                        <span style={{ color:C.textMuted, fontSize:"9px", fontStyle:"italic", flexShrink:0 }}>{ch.duration} days</span>
                      </div>
                      <p style={{ color:C.textMuted, fontSize:"10px", fontStyle:"italic",
                        lineHeight:"1.6", margin:"4px 0 0" }}>{ch.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
              ) : null}
            </div>
          )
        )}

        <Label text="Your Space" color={C.terra} font={font}/>
        {/* Prayer Wall — bold full-width entry */}
        <button onClick={()=>setScreen("prayerwall")} style={{
          width:"100%", background:`linear-gradient(135deg, ${C.amber}18 0%, ${C.terra}12 100%)`,
          border:`1.5px solid ${C.amber}44`, borderRadius:"12px",
          padding:"18px 20px", cursor:"pointer", textAlign:"left",
          display:"flex", alignItems:"center", gap:"16px",
          marginBottom:"10px", transition:"all 0.2s ease",
          boxShadow:`0 2px 12px ${C.amber}18` }}
          onMouseEnter={e=>e.currentTarget.style.transform="translateY(-1px)"}
          onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
          <div style={{ width:"48px", height:"48px", borderRadius:"50%",
            background:`${C.amber}22`, border:`1.5px solid ${C.amber}44`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:"22px", flexShrink:0 }}>🕯️</div>
          <div style={{ flex:1 }}>
            <p style={{ color:C.amber, fontSize:"9px", letterSpacing:"3px",
              textTransform:"uppercase", margin:"0 0 4px" }}>Community</p>
            <p style={{ color:C.textPrimary, fontSize:"16px", fontWeight:"bold",
              fontFamily:font, margin:"0 0 3px" }}>The Prayer Wall</p>
            <p style={{ color:C.textSoft, fontSize:"11px", fontStyle:"italic",
              lineHeight:"1.6", margin:0 }}>
              Post a prayer. Hold someone else's. No names, no noise.
            </p>
          </div>
          <span style={{ color:C.amber, fontSize:"20px" }}>→</span>
        </button>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"24px" }}>
          {[
            {icon:"◈",label:"Reflect",sub:((TIER_LEVELS[tier]||0)<TIER_LEVELS.foundation&&!isTrialActive)?"🔒 Foundation+":"Begin a session",bg:`${C.sage}15`,color:C.sage,border:`${C.sage}22`,screen:"reflect"},
            {icon:"✍️",label:"Notebook",sub:"Write freely",bg:`${C.terra}12`,color:C.terra,border:`${C.terra}20`,screen:"journal"},
            {icon:"📜",label:"Biblical Reflections",sub:(TIER_LEVELS[tier]||0)<TIER_LEVELS.foundation?"🔒 Foundation+":"Real stories, told straight",bg:`${C.amber}08`,color:C.amber,border:`${C.amber}15`,screen:"stories"},
            {icon:"⚔️",label:"Armor Up",sub:(TIER_LEVELS[tier]||0)<TIER_LEVELS.foundation?"🔒 Foundation+":"5-min morning sequence",bg:`${C.amber}08`,color:C.amber,border:`${C.amber}18`,screen:"armorup"},
            {icon:"🌑",label:"Heavy Day",sub:"Lament. Be honest.",bg:`${C.terra}08`,color:C.terra,border:`${C.terra}18`,screen:"heavyday"},
            {icon:"🪑",label:"The Bench",sub:(TIER_LEVELS[tier]||0)<TIER_LEVELS.foundation?"🔒 Foundation+":"Your saved insights",bg:`${C.sage}08`,color:C.sage,border:`${C.sage}18`,screen:"bench"},
            {icon:"✉️",label:"Letters to God",sub:"Just you and God",bg:`${C.sage}10`,color:C.sage,border:`${C.sage}20`,screen:"letters"},
            {icon:"🫁",label:"Breathe",sub:"Guided breathing",bg:`${C.sageLight}12`,color:C.sageDark,border:`${C.sage}18`,screen:"breathe"},
            {icon:"⚡",label:"Quick Check-in",sub:(TIER_LEVELS[tier]||0)<TIER_LEVELS.foundation?"🔒 Foundation+":"2 minutes",bg:`${C.amber}12`,color:C.amber,border:`${C.amber}20`,screen:"checkin"},
            {icon:"📖",label:"Resources",sub:(TIER_LEVELS[tier]||0)<TIER_LEVELS.foundation?"🔒 Foundation+":"Books & wisdom",bg:`${C.amber}12`,color:C.amber,border:`${C.amber}20`,screen:"resources"},
            {icon:"📊",label:"Progress",sub:(TIER_LEVELS[tier]||0)<TIER_LEVELS.foundation?"🔒 Foundation+":"Your growth",bg:`${C.sageLight}25`,color:C.sageDark,border:`${C.sage}22`,screen:"progress"},
            {icon:"🧩",label:"Assessments",sub:tier==="free"?"🔒 Foundation+":"Know yourself",bg:`${C.accent}12`,color:C.accent,border:`${C.accent}20`,screen:"assessments"},
          ].map(item=>(
            <button key={item.label} onClick={()=>{
              if(item.screen==="_crisis"){ setShowCrisisPanel(true); return; }
              // If sub shows lock, block navigation and show upgrade
              if(item.sub && item.sub.startsWith("🔒")){ onUpgrade(); return; }
              setScreen(item.screen);
            }} style={{
              background:item.bg,border:`1px solid ${item.border}`,
              borderRadius:"8px",padding:"16px",cursor:(item.sub&&item.sub.startsWith("🔒"))?"not-allowed":"pointer",textAlign:"left",
              display:"flex",flexDirection:"column",gap:"5px",transition:"all 0.2s ease" }}
            onMouseEnter={e=>e.currentTarget.style.transform="translateY(-1px)"}
            onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
              <span style={{ fontSize:"20px" }}>{item.icon}</span>
              <span style={{ color:C.textPrimary,fontSize:"13px",fontWeight:"bold",fontFamily:font }}>{item.label}</span>
              <span style={{ color:C.textSoft,fontSize:"10px" }}>{item.sub}</span>
            </button>
          ))}
        </div>



      </div>

      {/* ── NOTIFICATION PANEL ── */}
      {showNotifications&&(
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",
          zIndex:350,display:"flex",justifyContent:"flex-end",
          animation:"fadeIn 0.2s ease" }}
          onClick={()=>setShowNotifications(false)}>
          <div style={{ width:"100%",maxWidth:"380px",height:"100vh",
            background:C.bgPrimary,borderLeft:`1px solid ${C.border}`,
            overflowY:"auto",padding:"0",boxSizing:"border-box",
            animation:"slideInRight 0.3s ease" }}
            onClick={e=>e.stopPropagation()}>
            {/* Panel header */}
            <div style={{ padding:"24px 20px 16px",borderBottom:`1px solid ${C.border}`,
              display:"flex",justifyContent:"space-between",alignItems:"center",
              position:"sticky",top:0,background:C.bgPrimary,zIndex:2 }}>
              <div>
                <h2 style={{ color:C.textPrimary,fontSize:"18px",fontWeight:"normal",
                  fontFamily:font,margin:"0 0 2px" }}>Notifications</h2>
                <p style={{ color:C.textMuted,fontSize:"10px",fontStyle:"italic",margin:0 }}>
                  {unreadCount > 0 ? `${unreadCount} new` : "All caught up"}
                </p>
              </div>
              <button onClick={()=>setShowNotifications(false)} style={{
                background:"none",border:"none",cursor:"pointer",
                color:C.textMuted,fontSize:"20px",padding:"4px 8px" }}>✕</button>
            </div>

            {/* Notification items */}
            <div style={{ padding:"12px 16px" }}>
              {notiLoading && notifications.length === 0 ? (
                <div style={{ textAlign:"center",padding:"40px 0" }}>
                  <div style={{ display:"flex",justifyContent:"center",gap:"6px",marginBottom:"12px" }}>
                    {[0,1,2].map(i=>(
                      <div key={i} style={{ width:"6px",height:"6px",borderRadius:"50%",
                        background:C.accent,opacity:0.4,
                        animation:"pulse 1.2s ease-in-out infinite",
                        animationDelay:`${i*0.2}s` }}/>
                    ))}
                  </div>
                  <p style={{ color:C.textMuted,fontSize:"12px",fontStyle:"italic" }}>Loading...</p>
                </div>
              ) : notifications.map((n,i) => (
                <div key={n.id} style={{
                  background: !n.read ? `${C.accent}08` : "transparent",
                  border:`1px solid ${!n.read ? C.accent+"22" : C.border}`,
                  borderRadius:"10px",padding:"16px",marginBottom:"10px",
                  transition:"all 0.3s ease" }}>
                  <div style={{ display:"flex",alignItems:"center",gap:"8px",marginBottom:"8px" }}>
                    <div style={{ width:"28px",height:"28px",borderRadius:"50%",
                      background: n.type==="inspiration" ? `${C.sage}22` : `${C.amber}22`,
                      border:`1px solid ${n.type==="inspiration" ? C.sage+"44" : C.amber+"44"}`,
                      display:"flex",alignItems:"center",justifyContent:"center",
                      fontSize:"12px",flexShrink:0 }}>
                      {n.type==="inspiration" ? "✦" : "🆕"}
                    </div>
                    <div style={{ flex:1 }}>
                      <p style={{ color:C.textPrimary,fontSize:"12px",fontWeight:"bold",
                        fontFamily:font,margin:0 }}>{n.title}</p>
                      <p style={{ color:C.textMuted,fontSize:"9px",fontStyle:"italic",margin:"2px 0 0" }}>{n.date}</p>
                    </div>
                    {!n.read && (
                      <div style={{ width:"8px",height:"8px",borderRadius:"50%",
                        background:C.accent,flexShrink:0 }}/>
                    )}
                  </div>
                  <p style={{ color:C.textSoft,fontSize:"12px",fontStyle:"italic",
                    lineHeight:"1.8",margin:0,paddingLeft:"36px" }}>{n.body}</p>
                </div>
              ))}

              {notifications.length > 0 && !notiLoading && (
                <p style={{ color:C.textMuted,fontSize:"10px",fontStyle:"italic",
                  textAlign:"center",margin:"20px 0 0",letterSpacing:"1px" }}>
                  That's everything for now
                </p>
              )}
            </div>
          </div>
          <style>{`
            @keyframes slideInRight{from{transform:translateX(100%)}to{transform:translateX(0)}}
            @keyframes fadeIn{from{opacity:0}to{opacity:1}}
          `}</style>
        </div>
      )}

        {/* Disclaimer footer */}
        <div style={{ textAlign:"center", margin:"28px 0 8px", padding:"16px 12px",
          borderTop:`1px solid ${C.border}` }}>
          <p style={{ color:C.textMuted, fontSize:"9px", fontStyle:"italic",
            letterSpacing:"1px", lineHeight:"1.8", margin:0 }}>
            Selah is not therapy, counseling, or medical advice. Not a substitute for professional care.
            If you are in crisis, call <strong style={{ color:C.terra }}>988</strong> or <strong style={{ color:C.terra }}>911</strong>.
            By using Selah, you agree that its creators are not liable for any outcomes from your use of this app.
          </p>
        </div>

      {showTutorial&&<GuidedTour C={C} font={font}
        onDismiss={()=>{setShowTutorial(false);if(onDismissWelcome)onDismissWelcome();}}
        onGoToSettings={()=>setScreen("settings")}
        setScreen={setScreen}/>}
      {showCrisisPanel&&<CrisisPanel onClose={()=>setShowCrisisPanel(false)} C={C} font={font}/>}
      {showFeedbackPopup&&!showTutorial&&<FeedbackPopup C={C} font={font}
        onGoToFeedback={()=>{setShowFeedbackPopup(false);if(onDismissFeedback)onDismissFeedback();setScreen("feedback");}}
        onDismiss={()=>{setShowFeedbackPopup(false);if(onDismissFeedback)onDismissFeedback();}}/>}
      {showLN&&<LateNightModal C={C} font={font}
        onEnter={()=>{setShowLN(false);setScreen("reflect");}}
        onDismiss={()=>setShowLN(false)}/>}
      <style>{`@keyframes pulse{0%,100%{transform:scale(1);opacity:.4}50%{transform:scale(1.3);opacity:1}}`}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// REFLECT SCREEN
// ═══════════════════════════════════════════════════════
const CATS=[
  {id:"stress",label:"Stress",icon:"◈",color:"#C47A5A",openQ:"What's creating the most pressure right now?"},
  {id:"direction",label:"Direction",icon:"🧭",color:"#D6A85F",openQ:"What feels unclear or unresolved for you right now?"},
  {id:"identity",label:"Identity",icon:"🪞",color:"#A8B5A2",openQ:"What part of yourself feels unsettled lately?"},
  {id:"faith",label:"Faith",icon:"✦",color:"#8A9884",openQ:"What are you wrestling with spiritually?"},
  {id:"relationships",label:"Relationships",icon:"🤝",color:"#8A9AAA",openQ:"What's weighing on you in a relationship right now?"},
  {id:"discipline",label:"Discipline",icon:"⚡",color:"#C47A5A",openQ:"What are you avoiding that you know you shouldn't be?"},
];

const DEEP_CATS=[
  {id:"grief",label:"Grief & Loss",icon:"🕊️",color:"#8A9AAA",openQ:"What loss are you still carrying — and what hasn't been said about it?",deep:true},
  {id:"anger",label:"Anger",icon:"🔥",color:"#C47A5A",openQ:"What's making you angry that you haven't fully admitted yet?",deep:true},
  {id:"purpose",label:"Purpose",icon:"🦅",color:"#D6A85F",openQ:"If nothing was stopping you, what would you build with your life?",deep:true},
  {id:"shame",label:"Shame",icon:"🛡️",color:"#8A9884",openQ:"What part of your story are you still hiding from?",deep:true},
  {id:"gratitude_deep",label:"Deep Gratitude",icon:"🌿",color:"#A8B5A2",openQ:"Beyond the surface — what are you grateful for that took pain to earn?",deep:true},
  {id:"legacy",label:"Legacy",icon:"📜",color:"#D6A85F",openQ:"What do you want people to say about you when you're not in the room?",deep:true},
];

// ─────────────────────────────────────────────
// HEAVY DAY / LAMENT SCREEN
// ─────────────────────────────────────────────
function HeavyDayScreen({ C, font, onClose, faithLevel, userName }) {
  const [phase, setPhase] = useState("land"); // land → breathe → lament → hold → close
  const [lamentText, setLamentText] = useState("");
  const [aiResponse, setAiResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const LAMENT_PROMPTS = [
    "What's the weight you're carrying into today?",
    "What are you grieving that you haven't said out loud yet?",
    "What feels broken right now?",
    "What are you tired of holding alone?",
    "What do you wish someone understood about where you are?",
  ];
  const prompt = useRef(LAMENT_PROMPTS[Math.floor(Math.random()*LAMENT_PROMPTS.length)]);

  const SCRIPTURE_LAMENTS = [
    { ref:"Psalm 22:1", text:"My God, my God, why have you forsaken me? Why are you so far from saving me?" },
    { ref:"Psalm 13:1–2", text:"How long, Lord? Will you forget me forever? How long must I wrestle with my thoughts?" },
    { ref:"Lamentations 3:17–18", text:"I have been deprived of peace; I have forgotten what prosperity is. So I say: my splendor is gone." },
    { ref:"Psalm 88:13–14", text:"But I cry to you for help, Lord; in the morning my prayer comes before you. Why, Lord, do you reject me?" },
    { ref:"Job 3:3", text:"May the day of my birth perish, and the night that said, 'A boy is conceived!'" },
    { ref:"Psalm 42:9", text:"I say to God my Rock, 'Why have you forgotten me? Why must I go about mourning?'" },
  ];
  const scripture = useRef(SCRIPTURE_LAMENTS[Math.floor(Math.random()*SCRIPTURE_LAMENTS.length)]);

  const submitLament = async () => {
    if (!lamentText.trim()) return;
    setPhase("hold");
    setLoading(true);
    try {
      const r = await fetch("/api/chat", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:400,
          system:`You are a quiet, steady presence. This person is having a heavy day and has chosen lament — the ancient practice of honest grief before God. They are NOT looking for solutions, silver linings, or encouragement to cheer up. They need to feel held, not fixed. Respond in 2–3 short sentences. Acknowledge what they shared. Do not quote scripture back at them. Do not say "I hear you" or "that sounds hard." Be human, grounded, present. ${faithLevel>=2?"You can reference God's presence gently — not triumphantly.":"Keep it human and grounded — no religious language."} End with one short, gentle question that invites them to go a little deeper — not to solve anything, just to be heard more fully.`,
          messages:[{role:"user", content: lamentText}]
        })
      });
      const d = await r.json();
      const text = d.content?.map(b=>b.text||"").join("").trim();
      setAiResponse(text || "You don't have to explain it. It's enough that you said it.");
    } catch {
      setAiResponse("You don't have to explain it. It's enough that you said it.");
    }
    setLoading(false);
  };

  const containerStyle = {
    minHeight:"100vh", background:C.bgPrimary, fontFamily:font,
    display:"flex", flexDirection:"column", alignItems:"center",
    justifyContent:"center", padding:"40px 24px", boxSizing:"border-box",
    maxWidth:"520px", margin:"0 auto",
  };

  // LAND — stripped back, quiet entry
  if (phase === "land") return (
    <div style={containerStyle}>
      <button onClick={onClose} style={{ position:"fixed",top:"20px",left:"20px",
        background:"none",border:"none",cursor:"pointer",color:C.textMuted,fontSize:"20px" }}>←</button>
      <div style={{ textAlign:"center", maxWidth:"340px" }}>
        <p style={{ color:C.textMuted, fontSize:"10px", letterSpacing:"3px",
          textTransform:"uppercase", fontStyle:"italic", margin:"0 0 32px" }}>Heavy Day</p>
        <p style={{ color:C.textPrimary, fontSize:"22px", fontFamily:font,
          lineHeight:"1.6", margin:"0 0 16px", fontWeight:"normal" }}>
          You don't have to be okay.
        </p>
        <p style={{ color:C.textSoft, fontSize:"14px", fontStyle:"italic",
          lineHeight:"1.9", margin:"0 0 40px" }}>
          This is a space to be honest about where you are.
          No fixing. No pressure. Just presence.
        </p>
        {faithLevel >= 2 && (
          <div style={{ background:`${C.terra}08`, border:`1px solid ${C.terra}22`,
            borderRadius:"10px", padding:"16px 18px", marginBottom:"40px", textAlign:"left" }}>
            <p style={{ color:C.textSoft, fontSize:"12px", fontStyle:"italic",
              lineHeight:"1.9", margin:"0 0 6px" }}>"{scripture.current.text}"</p>
            <p style={{ color:C.terra, fontSize:"10px", letterSpacing:"1px", margin:0 }}>{scripture.current.ref}</p>
          </div>
        )}
        <p style={{ color:C.textMuted, fontSize:"12px", fontStyle:"italic",
          lineHeight:"1.8", margin:"0 0 40px" }}>
          Scripture has always made room for lament — honest, raw grief before God.
          You're not the first to feel this way.
        </p>
        <button onClick={()=>setPhase("breathe")} style={{
          background:"none", border:`1.5px solid ${C.terra}55`,
          borderRadius:"3px", color:C.terra, fontSize:"10px",
          letterSpacing:"2.5px", textTransform:"uppercase",
          padding:"16px 40px", cursor:"pointer", fontFamily:font }}>
          I'm ready
        </button>
      </div>
    </div>
  );

  // BREATHE — one slow breath before speaking
  if (phase === "breathe") return (
    <div style={containerStyle}>
      <div style={{ textAlign:"center", maxWidth:"320px" }}>
        <p style={{ color:C.textMuted, fontSize:"11px", fontStyle:"italic",
          lineHeight:"1.8", margin:"0 0 32px" }}>
          Before you write anything — one breath.
        </p>
        <div style={{ width:"80px", height:"80px", borderRadius:"50%",
          border:`2px solid ${C.terra}44`, margin:"0 auto 32px",
          animation:"selah-breathe-lament 5s ease-in-out infinite",
          background:`${C.terra}08` }}/>
        <style>{`@keyframes selah-breathe-lament{0%,100%{transform:scale(1);opacity:0.5}50%{transform:scale(1.3);opacity:1}}`}</style>
        <p style={{ color:C.textSoft, fontSize:"12px", fontStyle:"italic",
          lineHeight:"1.8", margin:"0 0 40px" }}>Inhale slowly... hold... exhale.</p>
        <button onClick={()=>setPhase("lament")} style={{
          background:"none", border:`1.5px solid ${C.terra}55`,
          borderRadius:"3px", color:C.terra, fontSize:"10px",
          letterSpacing:"2.5px", textTransform:"uppercase",
          padding:"14px 36px", cursor:"pointer", fontFamily:font }}>
          I'm ready to speak
        </button>
      </div>
    </div>
  );

  // LAMENT — write freely
  if (phase === "lament") return (
    <div style={{ ...containerStyle, justifyContent:"flex-start", paddingTop:"80px" }}>
      <div style={{ width:"100%", maxWidth:"460px" }}>
        <p style={{ color:C.terra, fontSize:"10px", letterSpacing:"2.5px",
          textTransform:"uppercase", fontStyle:"italic", margin:"0 0 20px" }}>Lament</p>
        <p style={{ color:C.textPrimary, fontSize:"16px", fontFamily:font,
          lineHeight:"1.7", margin:"0 0 24px", fontWeight:"normal" }}>
          {prompt.current}
        </p>
        <textarea
          value={lamentText}
          onChange={e=>setLamentText(e.target.value)}
          placeholder="Write as honestly as you can. No one will judge this."
          style={{ width:"100%", minHeight:"180px", background:C.bgSecondary,
            border:`1px solid ${C.terra}33`, borderRadius:"10px",
            padding:"16px", fontFamily:font, fontSize:"14px",
            color:C.textPrimary, lineHeight:"1.8", resize:"vertical",
            boxSizing:"border-box", outline:"none" }}
          autoFocus
        />
        <div style={{ display:"flex", justifyContent:"space-between",
          alignItems:"center", marginTop:"16px" }}>
          <button onClick={()=>setPhase("breathe")} style={{
            background:"none",border:"none",cursor:"pointer",
            color:C.textMuted,fontSize:"12px",}}>← Back</button>
          <button onClick={submitLament} disabled={!lamentText.trim()} style={{
            background:lamentText.trim()?C.terra:"transparent",
            border:`1.5px solid ${lamentText.trim()?C.terra:C.textMuted+"44"}`,
            borderRadius:"3px", color:lamentText.trim()?"#fff":C.textMuted,
            fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase",
            fontStyle:"italic", padding:"14px 32px", cursor:lamentText.trim()?"pointer":"default",
            fontFamily:font, transition:"all 0.2s ease" }}>
            Send it
          </button>
        </div>
      </div>
    </div>
  );

  // HOLD — AI response
  if (phase === "hold") return (
    <div style={containerStyle}>
      <div style={{ textAlign:"center", maxWidth:"380px" }}>
        {loading ? (
          <>
            <div style={{ width:"40px",height:"40px",borderRadius:"50%",
              border:`2px solid ${C.terra}33`, borderTop:`2px solid ${C.terra}`,
              animation:"spin 1s linear infinite", margin:"0 auto 24px" }}/>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <p style={{ color:C.textMuted, fontSize:"12px", fontStyle:"italic" }}>Sitting with what you shared...</p>
          </>
        ) : (
          <>
            <p style={{ color:C.textSoft, fontSize:"15px", fontFamily:font,
              lineHeight:"1.9", margin:"0 0 32px", fontStyle:"italic",
              textAlign:"left" }}>
              {aiResponse}
            </p>
            <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:"24px", textAlign:"center" }}>
              <p style={{ color:C.textMuted, fontSize:"11px", fontStyle:"italic",
                lineHeight:"1.8", margin:"0 0 28px" }}>
                You were heard. That's enough for today.
              </p>
              <button onClick={onClose} style={{
                background:"none", border:`1.5px solid ${C.terra}55`,
                borderRadius:"3px", color:C.terra, fontSize:"10px",
                letterSpacing:"2.5px", textTransform:"uppercase",
                padding:"14px 36px", cursor:"pointer", fontFamily:font }}>
                Return home
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  return null;
}

function ReflectScreen({ C, font, setScreen, faithLevel, sessionCount, tone, onSessionComplete, onboardingAnswers, userName, isMinorUser, tier, sessionHistory, seasonalContext, setBenchItems }) {
  const [phase,setPhase]=useState("entry");
  const [cat,setCat]=useState(null);
  const [freeText,setFreeText]=useState("");
  const [msgs,setMsgs]=useState([]);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const [crisis,setCrisis]=useState(false);
  const [depth,setDepth]=useState(0);
  const [summary,setSummary]=useState({});
  const histRef=useRef([]);
  const bottomRef=useRef(null);
  const inputRef=useRef(null);
  const recognitionRef=useRef(null);
  const [listening,setListening]=useState(false);
  const [voiceError,setVoiceError]=useState(null);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const [voiceSupported]=useState(()=>!!(window.SpeechRecognition||window.webkitSpeechRecognition));
  // Track what was already in the input when we started, to avoid duplicating it
  const voiceBaseRef = useRef("");
  const voiceAccumulatedRef = useRef("");

  const startListening = () => {
    if (!voiceSupported || listening) return;
    setVoiceError(null);
    voiceBaseRef.current = input.trim();
    voiceAccumulatedRef.current = "";
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const r = new SR();
    // iOS Safari: continuous must be false, interimResults causes duplicate firing
    r.continuous = false;
    r.interimResults = !isIOS; // disable interim on iOS to avoid duplicates
    r.lang = "en-US";
    r.maxAlternatives = 1;
    r.onstart = () => setListening(true);
    r.onresult = (e) => {
      let transcript = "";
      for (let i = 0; i < e.results.length; i++) {
        if (e.results[i].isFinal || isIOS) {
          transcript += e.results[i][0].transcript;
        }
      }
      if (transcript) {
        voiceAccumulatedRef.current = transcript;
        const base = voiceBaseRef.current;
        setInput(base ? base + " " + transcript : transcript);
      }
    };
    r.onerror = (e) => {
      setListening(false);
      if (e.error === "not-allowed") {
        setVoiceError("Mic permission denied. Allow microphone access in your browser settings.");
      } else if (e.error === "no-speech") {
        setVoiceError(null); // silent — user just didn't speak
      } else if (e.error === "network") {
        setVoiceError("Voice needs an internet connection.");
      }
    };
    r.onend = () => {
      setListening(false);
      // iOS restarts automatically if user taps mic again — no auto-restart to keep UX clean
      setTimeout(() => inputRef.current?.focus(), 100);
    };
    recognitionRef.current = r;
    try { r.start(); } catch(e) { setListening(false); }
  };

  const stopListening = () => {
    try { recognitionRef.current?.stop(); } catch(e) {}
    setListening(false);
  };
  const allCats = (TIER_LEVELS[tier]||0) >= TIER_LEVELS.deep ? [...CATS, ...DEEP_CATS] : CATS;
  const catData=allCats.find(c=>c.id===cat);
  const now=()=>new Date().toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"});

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[msgs,loading]);

  const onboardCtx = onboardingAnswers ? [
    onboardingAnswers.name && `Their name is ${onboardingAnswers.name}.`,
    onboardingAnswers.reasons && `They came to Selah for: ${Array.isArray(onboardingAnswers.reasons)?onboardingAnswers.reasons.join(", "):onboardingAnswers.reasons}.`,
    onboardingAnswers.biggest && `Heaviest thing they carry: "${onboardingAnswers.biggest}".`,
    onboardingAnswers.pattern && `Coping pattern: "${onboardingAnswers.pattern}".`,
    onboardingAnswers.goal && `Goal: "I want to become someone who ${onboardingAnswers.goal}".`,
    onboardingAnswers.avoid && `They want to avoid feeling: "${onboardingAnswers.avoid}".`,
    onboardingAnswers.tone && `Preferred tone: "${onboardingAnswers.tone}".`,
    onboardingAnswers.gender && onboardingAnswers.gender !== "Prefer not to say" && `They identify as: ${onboardingAnswers.gender}.`,
  ].filter(Boolean).join(" ") : "";

  // ── Tiered Memory System ──
  const buildMemoryContext = () => {
    if (!sessionHistory || sessionHistory.length === 0) return "";
    const tierLevel = TIER_LEVELS[tier] || 0;

    // Foundation: Last 5 session summaries
    if (tierLevel >= 1) {
      const recentSessions = sessionHistory.slice(0, 5);
      const summaries = recentSessions.map((s, i) => {
        const date = new Date(s.date).toLocaleDateString("en-US", { month:"short", day:"numeric" });
        return `[${date}] Topic: ${s.category || "Open"}. ${s.insight || ""} ${s.takeaway || ""}`.trim();
      }).join(" | ");

      // Growth: Add person-level insights
      if (tierLevel >= 2) {
        const allCategories = sessionHistory.map(s => s.category).filter(Boolean);
        const topCategories = [...new Set(allCategories)].slice(0, 5).join(", ");
        const allInsights = sessionHistory.map(s => s.insight).filter(Boolean).slice(0, 8).join(" ");
        const growthCtx = `RECURRING THEMES: ${topCategories}. KEY INSIGHTS FROM PAST SESSIONS: ${allInsights}`;

        // Deep: Full portrait with breakthroughs and patterns
        if (tierLevel >= 3) {
          const allTakeaways = sessionHistory.map(s => s.takeaway).filter(Boolean).slice(0, 10).join(" ");
          const allActions = sessionHistory.map(s => s.action).filter(Boolean).slice(0, 8).join(" ");
          const sessionDates = sessionHistory.map(s => new Date(s.date).toLocaleDateString()).slice(0, 10);
          const frequency = sessionHistory.length >= 5 ? "regular user" : "newer user";
          return `\n\nDEEP MEMORY PORTRAIT (${sessionHistory.length} total sessions, ${frequency}): ${growthCtx} BREAKTHROUGHS & TAKEAWAYS: ${allTakeaways} ACTION STEPS THEY'VE COMMITTED TO: ${allActions} Use this portrait to track their growth, reference past breakthroughs, notice patterns, and hold them accountable to commitments they've made. Don't recite this back — let it inform how you speak to them.`;
        }
        return `\n\nGROWTH MEMORY (${sessionHistory.length} sessions): ${growthCtx} RECENT SESSIONS: ${summaries} Use these insights to personalize your approach. Reference patterns you notice. Don't recite this back — let it naturally inform the conversation.`;
      }
      return `\n\nSESSION MEMORY: Their last ${recentSessions.length} sessions: ${summaries} Use this context to build continuity — reference what they've explored before when relevant.`;
    }
    return "";
  };

  const memoryCtx = buildMemoryContext();

  const toneInstruction = {
    direct: "TONE: Be direct, grounded, and honest. Say things like 'What part of that hit you hardest?' and 'You don't have to carry this alone.' Be like a grounded older brother — calm, direct, emotionally literate. Don't over-soften. Get to the point with warmth.",
    warm: "TONE: Be warm, gentle, and conversational. Say things like 'Take your time — what's been weighing on you?' and 'There's no rush here.' Be nurturing and patient. Give space. Lead with empathy before direction. Let them feel safe before you challenge.",
    structured: "TONE: Be structured and methodical. Say things like 'Let's work through this step by step' and 'What's the first thing we should look at?' Be organized and clear. Help them break big feelings into manageable pieces. Use frameworks without being clinical.",
    spiritual: "TONE: Be spiritually grounded. Say things like 'What would trusting God look like here?' and 'Let's bring this to the Lord.' Lead with faith. Weave scripture and spiritual wisdom into every response naturally. Speak as someone walking alongside them in faith.",
    mentor: "TONE: Be a wise mentor. Speak like someone who has walked this road and come out stronger. Say things like 'You already know the answer — say it out loud' and 'What would the version of you that you're becoming do here?' Challenge them to lead themselves. Ask questions that expose blind spots. Be honest, even when it's uncomfortable. You respect them too much to be soft.",
    coach: "TONE: Be a direct, no-excuses coach. Say things like 'What's the one thing you're avoiding right now?' and 'Stop explaining why you can't and tell me what you will do.' Be relentless about action and accountability. Cut through stories and excuses with warmth but zero tolerance for self-deception. Push them toward ownership of every decision.",
  }[tone] || "TONE: Be direct, grounded, and honest. Be like a grounded older brother — calm, direct, emotionally literate.";

  const minorSafety = isMinorUser ? " IMPORTANT: This user is under 18. Keep all content age-appropriate. Never discuss substance use, sexual content, or graphic violence. If they mention self-harm, abuse, or danger, immediately say CRISIS_DETECTED. Encourage them to talk to a trusted adult. Be extra warm, supportive, and encouraging. Use simpler language." : "";

  const sysPrompt=`You are Selah — a faith-rooted clarity companion. Help people collect thoughts, reflect clearly, and move steadily. CRITICAL: You are NOT a therapist, counselor, or medical provider. Never diagnose, prescribe, or provide medical/clinical advice. If someone describes symptoms, encourage them to see a licensed professional. Never claim to replace professional care. ${toneInstruction} ${faithLevel>=2?"Reference scripture naturally when it adds clarity.":"Keep faith references minimal unless user brings it up."} ${sessionCount>=10?"User has done multiple sessions — be slightly more ownership-forward and direct.":"New user — be stabilizing first."} ${seasonalContext ? `SEASONAL CONTEXT: ${seasonalContext} Let this subtly shape the themes and questions you offer — don't announce it, just let it inform the texture of the conversation.` : ""} ${onboardCtx ? `IMPORTANT CONTEXT ABOUT THIS PERSON: ${onboardCtx} Use this context to make your responses more personal and relevant — reference their specific struggles and goals naturally, but never make it feel like you're reading from a file. Let it inform how you speak, not what you quote back.` : ""}${memoryCtx}${minorSafety} Guide: Collect → Clarify → Check distorted thinking → Responsibility → One small move. When closing: say SESSION_COMPLETE then insight line, takeaway line, action line on separate lines. If crisis: say CRISIS_DETECTED only. No bullet points. Max 3 sentences unless they need space. End with a question unless closing.`;

  const startSession=async()=>{
    setPhase("session"); setLoading(true);
    const userMsg=cat?`User selected "${catData?.label}".${freeText?` They wrote: "${freeText}"`:""}`:
      `User wrote freely: "${freeText}"`;
    histRef.current=[{role:"user",content:userMsg}];
    try {
      const r=await fetch("/api/chat",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:400,
          system:sysPrompt,messages:histRef.current})});
      const d=await r.json();
      if(d.error) throw new Error(d.error?.message||"API error");
      const reply=d.content.map(b=>b.text||"").join("").trim();
      const m={role:"assistant",content:reply,time:now(),id:Date.now()};
      setMsgs([m]); histRef.current=[...histRef.current,{role:"assistant",content:reply}];
    } catch {
      const m={role:"assistant",content:catData?.openQ||"What's on your mind right now?",time:now(),id:Date.now()};
      setMsgs([m]);
    } finally { setLoading(false); setTimeout(()=>inputRef.current?.focus(),200); }
  };

  const send=async()=>{
    const t=input.trim(); if(!t||loading)return;
    setInput("");
    if(isCrisis(t)){setCrisis(true);return;}
    const userMsg={role:"user",content:t,time:now(),id:Date.now()};
    setMsgs(m=>[...m,userMsg]);
    histRef.current=[...histRef.current,{role:"user",content:t}];
    setLoading(true); setDepth(d=>d+1);
    if(depth>=6){
      histRef.current=[...histRef.current,{role:"user",content:"[Bring this to a natural close with SESSION_COMPLETE, then insight, takeaway, action on separate lines.]"}];
    }
    try {
      const r=await fetch("/api/chat",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:400,
          system:sysPrompt,messages:histRef.current})});
      const d=await r.json();
      if(d.error) throw new Error(d.error?.message||"API error");
      const reply=d.content.map(b=>b.text||"").join("").trim();
      if(reply.includes("CRISIS_DETECTED")){setCrisis(true);setLoading(false);return;}
      if(reply.includes("SESSION_COMPLETE")){
        const parts=reply.replace("SESSION_COMPLETE","").trim().split("\n").filter(Boolean);
        const sum={insight:parts[0]||"",takeaway:parts[1]||"",action:parts[2]||""};
        setSummary(sum);
        setPhase("complete");
        onSessionComplete({
          id: Date.now(),
          date: new Date().toISOString(),
          category: catData?.label || "Open Reflection",
          categoryIcon: catData?.icon || "✦",
          insight: sum.insight,
          takeaway: sum.takeaway,
          action: sum.action,
          messageCount: msgs.length + 1,
        });
        return;
      }
      const aMsg={role:"assistant",content:reply,time:now(),id:Date.now()+1};
      setMsgs(m=>[...m,aMsg]); histRef.current=[...histRef.current,{role:"assistant",content:reply}];
    } catch {
      setMsgs(m=>[...m,{role:"assistant",content:"Something went quiet. I'm still here — try again.",time:now(),id:Date.now()+1}]);
    } finally { setLoading(false); setTimeout(()=>inputRef.current?.focus(),100); }
  };

  const reset=()=>{setPhase("entry");setCat(null);setFreeText("");setMsgs([]);histRef.current=[];setDepth(0);};

  if(phase==="complete") return (
    <div style={{ minHeight:"100vh",background:C.bgPrimary,fontFamily:font,
      display:"flex",flexDirection:"column",alignItems:"center",
      justifyContent:"center",padding:"40px 24px",textAlign:"center" }}>
      <div style={{ maxWidth:"400px",width:"100%" }}>
        <WaveLogo size={36} color={C.accent}/>
        <p style={{ color:C.accent,fontSize:"10px",letterSpacing:"3px",
          textTransform:"uppercase",fontStyle:"italic",margin:"14px 0 8px" }}>Session Complete</p>
        <h1 style={{ color:C.textPrimary,fontSize:"clamp(18px,4vw,24px)",
          fontWeight:"normal",margin:"0 0 28px",lineHeight:"1.4" }}>
          You showed up for yourself today.
        </h1>
        {[{label:"Insight",val:summary.insight,color:C.accent},
          {label:"Takeaway",val:summary.takeaway,color:C.amber},
          {label:"One Small Move",val:summary.action,color:C.terra}].map(s=>s.val&&(
          <div key={s.label} style={{ background:C.bgSecondary,borderRadius:"10px",
            padding:"16px",marginBottom:"12px",border:`1px solid ${s.color}33`,textAlign:"left" }}>
            <p style={{ color:s.color,fontSize:"9px",letterSpacing:"2.5px",
              textTransform:"uppercase",fontStyle:"italic",margin:"0 0 6px" }}>{s.label}</p>
            <p style={{ color:C.textSoft,fontSize:"13px",fontStyle:"italic",
              lineHeight:"1.8",margin:0 }}>{s.val}</p>
          </div>
        ))}
        <div style={{ display:"flex",alignItems:"center",gap:"8px",justifyContent:"center",
          background:C.bgSecondary,borderRadius:"8px",padding:"12px 20px",marginBottom:"24px" }}>
          <span style={{ fontSize:"16px" }}>🔥</span>
          <span style={{ color:C.amber,fontSize:"12px",fontStyle:"italic" }}>Steady day recorded.</span>
        </div>
        {(summary.insight||summary.takeaway) && (
          <div style={{ marginBottom:"16px" }}>
            <p style={{ color:C.textMuted, fontSize:"9px", letterSpacing:"2.5px", textTransform:"uppercase", margin:"0 0 8px" }}>Save to The Bench</p>
            <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
              {summary.insight && <BenchSaveButton label="+ Save Insight" text={summary.insight} type="insight" C={C} font={font} onSave={(item) => setBenchItems(prev=>[item,...prev])} category={catData?.label||"Reflection"}/>}
              {summary.takeaway && <BenchSaveButton label="+ Save Takeaway" text={summary.takeaway} type="takeaway" C={C} font={font} onSave={(item) => setBenchItems(prev=>[item,...prev])} category={catData?.label||"Reflection"}/>}
            </div>
          </div>
        )}
        <div style={{ display:"flex",gap:"10px" }}>
          <button onClick={()=>setScreen("home")} style={{ flex:1,background:C.bgSecondary,
            border:`1px solid ${C.border}`,borderRadius:"3px",color:C.textSoft,
            fontSize:"10px",letterSpacing:"3px",textTransform:"uppercase",padding:"14px",
            cursor:"pointer",fontFamily:font }}>Home</button>
          <button onClick={reset} style={{ flex:2,background:C.accent,border:"none",
            borderRadius:"3px",color:"#fff",fontSize:"10px",letterSpacing:"3px",
            textTransform:"uppercase",padding:"14px",cursor:"pointer",
            fontFamily:font }}>Reflect Again</button>
        </div>
      </div>
    </div>
  );

  if(phase==="session") return (
    <div style={{ height:"100vh",background:C.bgPrimary,fontFamily:font,
      display:"flex",flexDirection:"column" }}>
      <div style={{ background:C.bgPrimary,borderBottom:`1px solid ${C.border}`,
        padding:"14px 20px",display:"flex",alignItems:"center",gap:"12px",flexShrink:0 }}>
        <button onClick={reset} style={{ background:"none",border:"none",cursor:"pointer",
          color:C.textMuted,fontSize:"18px",padding:"4px 8px 4px 0" }}>←</button>
        <div style={{ width:"32px",height:"32px",borderRadius:"50%",
          background:`${catData?.color||C.accent}22`,
          border:`1px solid ${catData?.color||C.accent}44`,
          display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:"13px",flexShrink:0 }}>{catData?.icon||"✦"}</div>
        <div style={{ flex:1 }}>
          <h2 style={{ color:C.textPrimary,fontSize:"14px",fontWeight:"normal",margin:0 }}>
            {catData?.label||"Reflection"}
          </h2>
          <p style={{ color:loading?C.amber:C.accent,fontSize:"10px",
            margin:0,fontStyle:"italic" }}>
            {loading?"Thinking...":"Selah is with you"}
          </p>
        </div>
        {depth>=2&&<button onClick={()=>{
          const sum={insight:"You took time to reflect — that takes courage.",
            takeaway:"You showed up. That's the first step.",
            action:"Take one slow breath before the day continues."};
          setSummary(sum);
          setPhase("complete");
          onSessionComplete({
            id: Date.now(),
            date: new Date().toISOString(),
            category: catData?.label || "Open Reflection",
            categoryIcon: catData?.icon || "✦",
            insight: sum.insight,
            takeaway: sum.takeaway,
            action: sum.action,
            messageCount: msgs.length,
          });
        }} style={{ background:"none",border:`1px solid ${C.border}`,borderRadius:"3px",
          color:C.textMuted,fontSize:"9px",letterSpacing:"2px",textTransform:"uppercase",
          padding:"7px 12px",cursor:"pointer",fontFamily:font,fontStyle:"italic" }}>
          Wrap Up
        </button>}
      </div>
      <div style={{ flex:1,overflowY:"auto",padding:"20px 16px 12px" }}>
        <p style={{ color:C.textMuted,fontSize:"11px",fontStyle:"italic",
          lineHeight:"1.8",textAlign:"center",marginBottom:"24px" }}>
          Collect · Reflect · Move clearly
        </p>
        {msgs.map((msg,i)=>{
          const isUser=msg.role==="user";
          return (
            <div key={msg.id} style={{ display:"flex",
              justifyContent:isUser?"flex-end":"flex-start",marginBottom:"16px" }}>
              {!isUser&&<div style={{ width:"28px",height:"28px",borderRadius:"50%",
                background:`${catData?.color||C.accent}22`,
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:"11px",flexShrink:0,marginRight:"8px",marginTop:"2px" }}>
                {catData?.icon||"✦"}</div>}
              <div style={{ maxWidth:"80%",
                background:isUser?C.accent:C.bgSecondary,
                borderRadius:isUser?"16px 16px 3px 16px":"16px 16px 16px 3px",
                padding:"12px 16px" }}>
                <p style={{ color:isUser?"#fff":C.textPrimary,fontSize:"14px",
                  lineHeight:"1.8",margin:0,fontStyle:"italic",whiteSpace:"pre-wrap" }}>
                  {msg.content}
                </p>
                <p style={{ color:isUser?"rgba(255,255,255,0.5)":C.textMuted,
                  fontSize:"9px",margin:"4px 0 0",textAlign:"right" }}>{msg.time}</p>
              </div>
              {isUser&&<div style={{ width:"28px",height:"28px",borderRadius:"50%",
                background:`${C.amber}22`,display:"flex",alignItems:"center",
                justifyContent:"center",fontSize:"11px",flexShrink:0,
                marginLeft:"8px",marginTop:"2px" }}>🤍</div>}
            </div>
          );
        })}
        {loading&&(
          <div style={{ display:"flex",marginBottom:"16px" }}>
            <div style={{ width:"28px",height:"28px",borderRadius:"50%",
              background:`${catData?.color||C.accent}22`,
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:"11px",marginRight:"8px" }}>{catData?.icon||"✦"}</div>
            <div style={{ background:C.bgSecondary,borderRadius:"16px 16px 16px 3px",padding:"12px 16px" }}>
              <div style={{ display:"flex",gap:"5px",alignItems:"center" }}>
                {[0,1,2].map(i=><div key={i} style={{ width:"6px",height:"6px",borderRadius:"50%",
                  background:C.accent,opacity:0.6,animation:"typeDot 1.2s ease-in-out infinite",
                  animationDelay:`${i*0.2}s` }}/>)}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>
      {listening && (
        <div style={{ padding:"6px 16px", background:C.bgPrimary,
          display:"flex", alignItems:"center", gap:"8px", justifyContent:"center" }}>
          <div style={{ display:"flex", gap:"3px", alignItems:"center" }}>
            {[0,1,2,3].map(i => (
              <div key={i} style={{ width:"3px", borderRadius:"2px",
                background:C.terra, opacity:0.7,
                height:`${8 + (i%2)*6}px`,
                animation:"typeDot 0.8s ease-in-out infinite",
                animationDelay:`${i*0.15}s` }}/>
            ))}
          </div>
          <span style={{ color:C.terra, fontSize:"10px", fontStyle:"italic" }}>
            {isIOS ? "Listening... (tap mic when done)" : "Listening..."}
          </span>
          <button onClick={stopListening} style={{ background:"none", border:"none",
            cursor:"pointer", color:C.textMuted, fontSize:"10px", fontStyle:"italic" }}>done</button>
        </div>
      )}
      {voiceError && !listening && (
        <div style={{ padding:"6px 16px", background:C.bgPrimary, textAlign:"center" }}>
          <span style={{ color:C.terra, fontSize:"10px", fontStyle:"italic" }}>{voiceError}</span>
        </div>
      )}
      <div style={{ padding:"10px 16px 28px",background:C.bgPrimary,
        borderTop:`1px solid ${C.border}`,flexShrink:0 }}>
        <div style={{ display:"flex",alignItems:"flex-end",gap:"10px",
          background:C.bgSecondary,borderRadius:"20px",padding:"10px 14px",
          border:`1.5px solid ${input?C.accent+"55":"transparent"}`,transition:"border-color 0.2s ease" }}>
          <textarea ref={inputRef} value={input}
            onChange={e=>{setInput(e.target.value);e.target.style.height="auto";e.target.style.height=Math.min(e.target.scrollHeight,100)+"px";}}
            onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}
            placeholder="Say what's on your mind..." rows={1}
            style={{ flex:1,background:"none",border:"none",outline:"none",
              color:C.textPrimary,fontSize:"14px",fontStyle:"italic",
              fontFamily:font,lineHeight:"1.6",resize:"none",
              padding:0,maxHeight:"100px",overflowY:"auto" }}/>
          {voiceSupported && (
            <button onClick={listening ? stopListening : startListening}
              style={{ width:"34px",height:"34px",borderRadius:"50%",
                background: listening ? `${C.terra}22` : C.bgCard,
                border:`1.5px solid ${listening ? C.terra : C.border}`,
                cursor:"pointer", display:"flex", alignItems:"center",
                justifyContent:"center", flexShrink:0, transition:"all 0.2s ease",
                animation: listening ? "pulse 1s ease-in-out infinite" : "none" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <rect x="9" y="2" width="6" height="12" rx="3"
                  fill={listening ? C.terra : C.textMuted}/>
                <path d="M5 10c0 3.866 3.134 7 7 7s7-3.134 7-7"
                  stroke={listening ? C.terra : C.textMuted} strokeWidth="2"
                  strokeLinecap="round" fill="none"/>
                <line x1="12" y1="17" x2="12" y2="21"
                  stroke={listening ? C.terra : C.textMuted} strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          )}
          <button onClick={send} disabled={!input.trim()||loading} style={{
            width:"34px",height:"34px",borderRadius:"50%",
            background:input.trim()&&!loading?catData?.color||C.accent:C.bgCard,
            border:"none",cursor:input.trim()&&!loading?"pointer":"default",
            display:"flex",alignItems:"center",justifyContent:"center",
            flexShrink:0,transition:"all 0.2s ease" }}>
            <span style={{ color:input.trim()&&!loading?"#fff":C.textMuted,fontSize:"13px",marginLeft:"2px" }}>→</span>
          </button>
        </div>
        <p style={{ color:C.textMuted,fontSize:"9px",letterSpacing:"1.5px",
          textTransform:"uppercase",fontStyle:"italic",textAlign:"center",margin:"8px 0 0" }}>
          Private · Encrypted · Not therapy or medical advice · Crisis? Call 988 or 911
        </p>
      </div>
      {crisis&&<CrisisPanel onClose={()=>setCrisis(false)} C={C} font={font}/>}
      <style>{`@keyframes typeDot{0%,60%,100%{transform:translateY(0);opacity:0.4}30%{transform:translateY(-5px);opacity:1}}`}</style>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh",background:C.bgPrimary,fontFamily:font,
      padding:"40px 20px 100px",boxSizing:"border-box" }}>
      <div style={{ maxWidth:"480px",margin:"0 auto" }}>
        <div style={{ display:"flex",alignItems:"center",
          justifyContent:"space-between",marginBottom:"28px" }}>
          <button onClick={()=>setScreen("home")} style={{ background:"none",border:"none",
            cursor:"pointer",color:C.textMuted,fontSize:"18px",padding:"4px 8px 4px 0" }}>←</button>
          <WaveLogo size={22} color={C.accent}/>
          <div style={{ width:"32px" }}/>
        </div>

        <Label text="Guided Reflection" color={C.sage} font={font}/>
        <h1 style={{ color:C.textPrimary,fontSize:"clamp(20px,5vw,26px)",
          fontWeight:"normal",margin:"0 0 10px" }}>What would you like to reflect on?</h1>
        <p style={{ color:C.textSoft,fontSize:"13px",fontStyle:"italic",
          lineHeight:"1.8",margin:"0 0 24px" }}>
          Choose a focus or write freely. Selah helps you collect and move clearly.
        </p>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"10px",marginBottom:"20px" }}>
          {allCats.map((c,i)=>{
            const sel=cat===c.id;
            const showDeepLabel = c.deep && i === CATS.length;
            return (
              <React.Fragment key={c.id}>
                {showDeepLabel && (
                  <div style={{ gridColumn:"1 / -1", display:"flex", alignItems:"center",
                    gap:"8px", margin:"6px 0 2px" }}>
                    <div style={{ flex:1, height:"1px", background:C.accent+"33" }}/>
                    <span style={{ color:C.accent, fontSize:"8px", letterSpacing:"2px",
                      textTransform:"uppercase", fontStyle:"italic" }}>Deep Categories</span>
                    <div style={{ flex:1, height:"1px", background:C.accent+"33" }}/>
                  </div>
                )}
                <button onClick={()=>setCat(sel?null:c.id)} style={{
                  background:sel?`${c.color}20`:C.bgSecondary,
                  border:`1.5px solid ${sel?c.color+"66":"transparent"}`,
                  borderRadius:"10px",padding:"16px 10px",cursor:"pointer",
                  textAlign:"center",display:"flex",flexDirection:"column",
                  alignItems:"center",gap:"8px",transition:"all 0.2s ease" }}
                onMouseEnter={e=>{if(!sel)e.currentTarget.style.borderColor=c.color+"33";}}
                onMouseLeave={e=>{if(!sel)e.currentTarget.style.borderColor="transparent";}}>
                  <span style={{ fontSize:"22px" }}>{c.icon}</span>
                  <span style={{ color:sel?c.color:C.textSoft,fontSize:"11px",
                    fontStyle:"italic",fontFamily:font,fontWeight:sel?"bold":"normal" }}>
                    {c.label}
                  </span>
                  {sel&&<div style={{ width:"6px",height:"6px",borderRadius:"50%",background:c.color }}/>}
                </button>
              </React.Fragment>
            );
          })}
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:"12px",marginBottom:"16px" }}>
          <div style={{ flex:1,height:"1px",background:C.border }}/>
          <span style={{ color:C.textMuted,fontSize:"10px",fontStyle:"italic" }}>or write freely</span>
          <div style={{ flex:1,height:"1px",background:C.border }}/>
        </div>
        <div style={{ background:C.bgSecondary,borderRadius:"10px",
          border:`1.5px solid ${freeText?C.accent+"55":"transparent"}`,
          padding:"14px 16px",marginBottom:"20px",transition:"border-color 0.2s ease" }}>
          <textarea value={freeText}
            onChange={e=>{setFreeText(e.target.value);e.target.style.height="auto";e.target.style.height=Math.min(e.target.scrollHeight,140)+"px";}}
            placeholder="Start typing whatever is on your mind..." rows={3}
            style={{ width:"100%",background:"none",border:"none",outline:"none",
              color:C.textPrimary,fontSize:"14px",fontStyle:"italic",
              fontFamily:font,lineHeight:"1.8",resize:"none",boxSizing:"border-box" }}/>
        </div>
        <button onClick={startSession} disabled={!cat&&!freeText.trim()} style={{
          width:"100%",
          background:(cat||freeText.trim())?C.accent:C.bgCard,
          border:"none",borderRadius:"3px",
          color:(cat||freeText.trim())?"#fff":C.textMuted,
          fontSize:"10px",letterSpacing:"4px",textTransform:"uppercase",padding:"18px",
          cursor:(cat||freeText.trim())?"pointer":"default",fontFamily:font,fontStyle:"italic",
          transition:"all 0.3s ease",
          boxShadow:(cat||freeText.trim())?`0 2px 12px ${C.accent}33`:"none" }}>
          Begin Reflection
        </button>
        <p style={{ color:C.textMuted,fontSize:"10px",fontStyle:"italic",
          textAlign:"center",margin:"10px 0 0" }}>5–10 minutes · Private & encrypted</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// NOTEBOOK SCREEN
// ═══════════════════════════════════════════════════════
function JournalScreen({ C, font, setScreen, entries, setEntries, onActive }) {
  const [writing,setWriting]=useState(false);
  const [text,setText]=useState("");
  const [title,setTitle]=useState("");
  const [mood,setMood]=useState(null);
  const PROMPTS=["What are you avoiding right now?","If you were fully honest today, what would you say?","What would surrender look like here?","Who do you need to forgive — including yourself?"];
  const [prompt]=useState(PROMPTS[Math.floor(Math.random()*PROMPTS.length)]);

  const save=()=>{
    if(!text.trim())return;
    const e={id:Date.now(),date:"Just now",title:title||"Untitled",
      text,mood:mood||"😐",tags:[],words:text.trim().split(/\s+/).length};
    setEntries(en=>[e,...en]); setText(""); setTitle(""); setMood(null); setWriting(false);
    if(onActive) onActive();
  };

  if(writing) return (
    <div style={{ minHeight:"100vh",background:C.bgPrimary,fontFamily:font,
      padding:"40px 20px 100px",boxSizing:"border-box" }}>
      <div style={{ maxWidth:"480px",margin:"0 auto" }}>
        <div style={{ display:"flex",justifyContent:"space-between",
          alignItems:"center",marginBottom:"24px" }}>
          <button onClick={()=>setWriting(false)} style={{ background:"none",border:"none",
            cursor:"pointer",color:C.textMuted,fontSize:"18px",padding:"4px 8px 4px 0" }}>←</button>
          <button onClick={save} disabled={!text.trim()} style={{
            background:text.trim()?C.accent:C.bgCard,border:"none",borderRadius:"3px",
            color:text.trim()?"#fff":C.textMuted,fontSize:"9px",letterSpacing:"3px",
            textTransform:"uppercase",padding:"10px 20px",cursor:text.trim()?"pointer":"default",
            fontFamily:font,fontStyle:"italic" }}>Save</button>
        </div>
        <div style={{ background:`${C.amber}12`,borderRadius:"8px",
          padding:"12px 16px",marginBottom:"16px",border:`1px solid ${C.amber}22` }}>
          <p style={{ color:C.amber,fontSize:"10px",letterSpacing:"2px",
            textTransform:"uppercase",fontStyle:"italic",margin:"0 0 4px" }}>Prompt</p>
          <p style={{ color:C.textSoft,fontSize:"13px",fontStyle:"italic",
            lineHeight:"1.7",margin:0 }}>"{prompt}"</p>
        </div>
        <input value={title} onChange={e=>setTitle(e.target.value)}
          placeholder="Title (optional)"
          style={{ width:"100%",boxSizing:"border-box",background:"none",border:"none",
            borderBottom:`1px solid ${C.border}`,outline:"none",
            color:C.textPrimary,fontSize:"18px",fontFamily:font,padding:"0 0 12px",
            marginBottom:"16px" }}/>
        <textarea value={text} onChange={e=>setText(e.target.value)}
          placeholder="Write whatever is on your heart. There's no wrong way to use your notebook..."
          style={{ width:"100%",minHeight:"280px",boxSizing:"border-box",
            background:"none",border:"none",outline:"none",
            color:C.textPrimary,fontSize:"14px",fontStyle:"italic",
            fontFamily:font,lineHeight:"1.9",resize:"none" }}/>
        <div style={{ display:"flex",gap:"8px",marginTop:"16px" }}>
          {["😔","😕","😐","🙂","😌"].map((e,i)=>(
            <button key={i} onClick={()=>setMood(e)} style={{
              background:mood===e?`${C.terra}22`:C.bgSecondary,
              border:`1.5px solid ${mood===e?C.terra:"transparent"}`,
              borderRadius:"50%",width:"40px",height:"40px",fontSize:"18px",
              cursor:"pointer",transition:"all 0.2s ease",
              display:"flex",alignItems:"center",justifyContent:"center" }}>{e}</button>
          ))}
          <span style={{ color:C.textMuted,fontSize:"10px",fontStyle:"italic",
            alignSelf:"center",marginLeft:"4px" }}>{text.trim().split(/\s+/).filter(Boolean).length} words</span>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh",background:C.bgPrimary,fontFamily:font,
      padding:"40px 20px 100px",boxSizing:"border-box" }}>
      <div style={{ maxWidth:"480px",margin:"0 auto" }}>
        <div style={{ display:"flex",justifyContent:"space-between",
          alignItems:"center",marginBottom:"24px" }}>
          <div>
            <Label text="Private Notebook" color={C.terra} font={font}/>
            <h1 style={{ color:C.textPrimary,fontSize:"clamp(20px,5vw,26px)",
              fontWeight:"normal",margin:0 }}>My Notebook</h1>
          </div>
          <button onClick={()=>setWriting(true)} style={{
            background:C.terra,border:"none",borderRadius:"3px",color:"#fff",
            fontSize:"9px",letterSpacing:"3px",textTransform:"uppercase",
            padding:"12px 18px",cursor:"pointer",fontFamily:font,fontStyle:"italic" }}>
            + Write
          </button>
        </div>
        {entries.length===0?(
          <div style={{ textAlign:"center", padding:"48px 20px" }}>
            <div style={{ fontSize:"36px", marginBottom:"16px" }}>✍️</div>
            <h2 style={{ color:C.textPrimary, fontSize:"18px", fontWeight:"normal",
              margin:"0 0 8px" }}>Your notebook is waiting.</h2>
            <p style={{ color:C.textSoft, fontSize:"13px", fontStyle:"italic",
              lineHeight:"1.9", margin:"0 0 24px" }}>
              No one will read this but you. Write whatever you need to get out of your head.
            </p>
            <button onClick={()=>setWriting(true)} style={{
              background:C.terra, border:"none", borderRadius:"3px", color:"#fff",
              fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase",
              padding:"14px 28px", cursor:"pointer", fontFamily:font, fontStyle:"italic",
              boxShadow:`0 2px 12px ${C.terra}33` }}>
              Write Your First Entry
            </button>
          </div>
        ):(
        <>
        {entries.map(e=>(
          <div key={e.id} onClick={()=>setWriting(true)}
            style={{ background:C.bgSecondary,borderRadius:"10px",padding:"18px",
              marginBottom:"10px",cursor:"pointer",border:`1px solid transparent`,
              transition:"all 0.2s ease" }}
            onMouseEnter={ev=>ev.currentTarget.style.borderColor=C.terra+"33"}
            onMouseLeave={ev=>ev.currentTarget.style.borderColor="transparent"}>
            <div style={{ display:"flex",justifyContent:"space-between",
              alignItems:"flex-start",marginBottom:"8px" }}>
              <div>
                <p style={{ color:C.textPrimary,fontSize:"14px",fontWeight:"bold",
                  fontFamily:font,margin:"0 0 2px" }}>{e.title}</p>
                <p style={{ color:C.textMuted,fontSize:"10px",
                  fontStyle:"italic",margin:0 }}>{e.date} · {e.words} words</p>
              </div>
              <span style={{ fontSize:"20px" }}>{e.mood}</span>
            </div>
            <p style={{ color:C.textSoft,fontSize:"12px",fontStyle:"italic",
              lineHeight:"1.7",margin:"0 0 10px" }}>
              {e.text.slice(0,120)}{e.text.length>120?"...":""}
            </p>
            <div style={{ display:"flex",gap:"6px" }}>
              {e.tags.map(t=>(
                <span key={t} style={{ background:`${C.terra}15`,color:C.terra,
                  fontSize:"8px",letterSpacing:"1.5px",textTransform:"uppercase",
                  padding:"3px 8px",borderRadius:"10px",fontStyle:"italic" }}>{t}</span>
              ))}
            </div>
          </div>
        ))}
        </>
        )}
        <div style={{ textAlign:"center",marginTop:"28px",
          borderTop:`1px solid ${C.border}`,paddingTop:"20px" }}>
          <p style={{ color:C.textMuted,fontSize:"11px",fontStyle:"italic",
            lineHeight:"1.8",margin:0 }}>"Pour out your heart before Him."</p>
          <p style={{ color:C.sageLight,fontSize:"9px",letterSpacing:"2px",
            textTransform:"uppercase",margin:"4px 0 0" }}>Psalm 62:8</p>
        </div>
      </div>
    </div>
  );
}

// AI-powered Growth Mirror observation
function MirrorObservation({ C, font, sessionHistory, steadyDays, sessionCount, moodHistory }) {
  const [observation, setObservation] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    const earliest = sessionHistory[sessionHistory.length - 1];
    const latest = sessionHistory[0];
    const recentMoods = (moodHistory||[]).slice(0,7).map(m=>["Very low","Low","Neutral","Good","Great"][m.mood]).join(", ");
    const categories = [...new Set(sessionHistory.map(s=>s.category))].join(", ");
    try {
      const r = await fetch("/api/chat",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:200,
          messages:[{role:"user",content:`You are Selah — a faith-rooted clarity companion. Write a 2-3 sentence personal growth observation for someone who has done ${sessionCount} reflection sessions over ${steadyDays} days. Their first session insight was: "${earliest?.insight||""}". Their most recent insight was: "${latest?.insight||""}". Categories explored: ${categories}. ${recentMoods ? `Recent moods: ${recentMoods}.` : ""} Notice something REAL about their shift — be specific about what changed between then and now. Write in second person. Be warm but direct. No generic therapy-speak. No bullet points.`}]})});
      const d = await r.json();
      if(d.error) throw new Error(d.error?.message||"API error");
      setObservation(d.content.map(b=>b.text||"").join("").trim());
    } catch {
      setObservation("You keep coming back. That alone tells me something is shifting — even if you can't name it yet. The person who started this isn't the same person reading this now.");
    } finally { setLoading(false); }
  };

  return observation ? (
    <div style={{ background:`${C.accent}12`,border:`1px solid ${C.accent}33`,
      borderRadius:"10px",padding:"18px",marginBottom:"20px" }}>
      <div style={{ display:"flex",gap:"10px",alignItems:"flex-start" }}>
        <div style={{ width:"30px",height:"30px",borderRadius:"50%",
          background:`${C.accent}22`,border:`1px solid ${C.accent}44`,
          display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:"11px",flexShrink:0 }}>✦</div>
        <div>
          <p style={{ color:C.accent,fontSize:"9px",letterSpacing:"2px",
            textTransform:"uppercase",fontStyle:"italic",margin:"0 0 8px" }}>Selah noticed</p>
          <p style={{ color:C.textSoft,fontSize:"13px",fontStyle:"italic",
            lineHeight:"1.9",margin:0 }}>{observation}</p>
        </div>
      </div>
    </div>
  ) : (
    <div onClick={generate}
      style={{ background:C.bgSecondary,border:`1px solid ${C.accent}22`,
        borderRadius:"10px",padding:"16px",marginBottom:"20px",cursor:"pointer",
        display:"flex",alignItems:"center",gap:"12px",transition:"all 0.2s ease" }}
      onMouseEnter={e=>e.currentTarget.style.borderColor=C.accent+"44"}
      onMouseLeave={e=>e.currentTarget.style.borderColor=C.accent+"22"}>
      <div style={{ width:"30px",height:"30px",borderRadius:"50%",
        background:`${C.accent}15`,display:"flex",alignItems:"center",justifyContent:"center",
        fontSize:"14px",flexShrink:0 }}>{loading?"⏳":"✦"}</div>
      <div style={{ flex:1 }}>
        <p style={{ color:C.accent,fontSize:"10px",letterSpacing:"2px",
          textTransform:"uppercase",fontStyle:"italic",margin:"0 0 3px" }}>
          {loading?"Selah is reflecting...":"See what Selah noticed"}</p>
        <p style={{ color:C.textMuted,fontSize:"11px",fontStyle:"italic",margin:0 }}>
          {loading?"Reading your history...":"A personal observation based on your journey"}</p>
      </div>
      {!loading&&<span style={{ color:C.accent,fontSize:"16px" }}>→</span>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// PROGRESS SCREEN (with Growth Mirror)
// ═══════════════════════════════════════════════════════
const MILESTONES=[
  {id:"first_chat",icon:"💬",label:"First Word",desc:"Completed your first reflection",scripture:'"Ask and it will be given."',ref:"Matthew 7:7"},
  {id:"first_journal",icon:"✍️",label:"First Entry",desc:"Wrote your first notebook entry",scripture:'"Pour out your heart."',ref:"Psalm 62:8"},
  {id:"mood_3",icon:"🌡️",label:"Self-Aware",desc:"Logged your mood 3 times",scripture:'"Search me, O God, and know my heart."',ref:"Psalm 139:23"},
  {id:"sessions_5",icon:"◈",label:"Finding Your Rhythm",desc:"Completed 5 reflection sessions",scripture:'"Be still, and know that I am God."',ref:"Psalm 46:10"},
  {id:"streak_7",icon:"🔥",label:"7 Steady Days",desc:"Showed up 7 days in a row",scripture:'"His mercies are new every morning."',ref:"Lam. 3:23"},
  {id:"journal_5",icon:"📝",label:"Open Book",desc:"Wrote 5 notebook entries",scripture:'"Write the vision and make it plain."',ref:"Habakkuk 2:2"},
  {id:"words_100",icon:"📖",label:"Going Deeper",desc:"Completed 10 reflection sessions",scripture:'"The heart acquires knowledge."',ref:"Prov. 18:15"},
  {id:"streak_14",icon:"💪",label:"Two Weeks Strong",desc:"14-day streak — you're building a habit",scripture:'"Endurance produces character."',ref:"Romans 5:4"},
  {id:"sessions_25",icon:"🧠",label:"Deep Thinker",desc:"Completed 25 reflection sessions",scripture:'"Wisdom is the principal thing."',ref:"Prov. 4:7"},
  {id:"journal_20",icon:"📕",label:"Storyteller",desc:"Wrote 20 notebook entries",scripture:'"My tongue is the pen of a skillful writer."',ref:"Psalm 45:1"},
  {id:"streak_30",icon:"⭐",label:"30 Days",desc:"One full month of showing up",scripture:'"I can do all things through Christ."',ref:"Phil. 4:13"},
  {id:"streak_90",icon:"✦",label:"90 Days",desc:"A season of faithfulness",scripture:'"Let us not grow weary."',ref:"Gal. 6:9"},
];

// ═══════════════════════════════════════════════════════
// EMOTIONAL TIMELINE COMPONENT
// ═══════════════════════════════════════════════════════
function EmotionalTimeline({ C, font, moodHistory, sessionHistory }) {
  const W = 440, H = 130, PAD = 16, BOTTOM = 28;
  const drawH = H - BOTTOM;

  // Build unified data — last 60 days
  const today = new Date();
  const days = [];
  for (let i = 59; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toDateString();
    const mood = (moodHistory||[]).find(m => new Date(m.date).toDateString() === dateStr);
    const session = (sessionHistory||[]).find(s => new Date(s.date).toDateString() === dateStr);
    days.push({ date: d, mood: mood ? mood.mood : null, session: !!session, idx: 59 - i });
  }

  // Only use days with mood data for the path
  const moodPoints = days.filter(d => d.mood !== null);
  if (moodPoints.length < 2) return (
    <div style={{ background:C.bgSecondary, borderRadius:"12px", padding:"20px",
      marginBottom:"14px", border:`1px solid ${C.border}`, textAlign:"center" }}>
      <p style={{ color:C.textMuted, fontSize:"11px", fontStyle:"italic", margin:0 }}>
        Log your mood a few times to see your emotional arc appear here.
      </p>
    </div>
  );

  const xScale = (idx) => PAD + (idx / 59) * (W - PAD * 2);
  // mood is 0-4, map to drawH with 1=high, 4=low (inverted — better mood = higher on chart)
  const yScale = (mood) => PAD + ((4 - mood) / 4) * (drawH - PAD * 2);

  // Build smooth SVG path using cubic bezier
  const pts = moodPoints.map(d => ({ x: xScale(d.idx), y: yScale(d.mood), ...d }));

  let pathD = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const curr = pts[i];
    const cpX = (prev.x + curr.x) / 2;
    pathD += ` C ${cpX} ${prev.y}, ${cpX} ${curr.y}, ${curr.x} ${curr.y}`;
  }

  // Closed fill path
  const fillD = pathD + ` L ${pts[pts.length-1].x} ${drawH} L ${pts[0].x} ${drawH} Z`;

  // Month labels
  const monthLabels = [];
  let lastMonth = -1;
  days.forEach(d => {
    if (d.date.getDate() === 1 || (d.idx === 0 && lastMonth === -1)) {
      const month = d.date.getMonth();
      if (month !== lastMonth) {
        monthLabels.push({ x: xScale(d.idx), label: d.date.toLocaleDateString("en-US",{month:"short"}) });
        lastMonth = month;
      }
    }
  });

  // Session markers
  const sessionMarkers = days.filter(d => d.session);

  // Recent trend
  const recent7 = moodPoints.slice(-7);
  const older7 = moodPoints.slice(-14, -7);
  const avgRecent = recent7.length ? recent7.reduce((a,b) => a + b.mood, 0) / recent7.length : null;
  const avgOlder = older7.length ? older7.reduce((a,b) => a + b.mood, 0) / older7.length : null;
  const trend = avgRecent !== null && avgOlder !== null
    ? avgRecent > avgOlder + 0.3 ? { label:"Trending up", color:C.sage }
    : avgRecent < avgOlder - 0.3 ? { label:"Dipping lately", color:C.terra }
    : { label:"Holding steady", color:C.amber }
    : null;

  return (
    <div style={{ background:C.bgSecondary, borderRadius:"12px", padding:"16px 16px 12px",
      marginBottom:"14px", border:`1px solid ${C.border}` }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"12px" }}>
        <div>
          <p style={{ color:C.sage, fontSize:"9px", letterSpacing:"3.5px",
            textTransform:"uppercase", fontWeight:"600", margin:"0 0 2px" }}>Your Journey</p>
          <p style={{ color:C.textMuted, fontSize:"10px", fontStyle:"italic", margin:0 }}>
            60-day emotional arc
          </p>
        </div>
        {trend && (
          <span style={{ color:trend.color, fontSize:"10px", fontStyle:"italic",
            background:`${trend.color}15`, padding:"4px 10px",
            borderRadius:"10px", border:`1px solid ${trend.color}33` }}>
            {trend.label}
          </span>
        )}
      </div>

      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow:"visible", display:"block" }}>
        <defs>
          <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.sage} stopOpacity="0.25"/>
            <stop offset="100%" stopColor={C.sage} stopOpacity="0.03"/>
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {[0,1,2,3,4].map(v => (
          <line key={v}
            x1={PAD} y1={yScale(v)}
            x2={W - PAD} y2={yScale(v)}
            stroke={C.border} strokeWidth="0.5" strokeDasharray="3,4"/>
        ))}

        {/* Fill area */}
        <path d={fillD} fill="url(#moodGrad)"/>

        {/* Main line */}
        <path d={pathD} fill="none" stroke={C.sage} strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round"/>

        {/* Session markers — small circles on the line */}
        {sessionMarkers.map((d, i) => {
          // Find nearest mood point y
          const nearestMood = moodPoints.reduce((a, b) =>
            Math.abs(b.idx - d.idx) < Math.abs(a.idx - d.idx) ? b : a);
          const y = nearestMood ? yScale(nearestMood.mood) : drawH / 2;
          const x = xScale(d.idx);
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="4"
                fill={C.bgSecondary} stroke={C.amber} strokeWidth="1.5"/>
              <circle cx={x} cy={y} r="1.5" fill={C.amber}/>
            </g>
          );
        })}

        {/* Mood dots */}
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="2.5"
            fill={C.sage} opacity="0.7"/>
        ))}

        {/* Month labels */}
        {monthLabels.map((m, i) => (
          <text key={i} x={m.x} y={H - 4} fontSize="8"
            fill={C.textMuted} textAnchor="middle"
            fontFamily="sans-serif">{m.label}</text>
        ))}

        {/* Mood level labels */}
        {[{v:4,l:"great"},{v:2,l:"okay"},{v:0,l:"low"}].map(({v,l}) => (
          <text key={v} x={PAD - 2} y={yScale(v) + 3} fontSize="7"
            fill={C.textMuted} textAnchor="end"
            fontFamily="sans-serif">{l}</text>
        ))}
      </svg>

      <div style={{ display:"flex", alignItems:"center", gap:"16px", marginTop:"6px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"5px" }}>
          <div style={{ width:"12px", height:"2px", background:C.sage, borderRadius:"1px" }}/>
          <span style={{ color:C.textMuted, fontSize:"9px", fontStyle:"italic" }}>Mood</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"5px" }}>
          <div style={{ width:"8px", height:"8px", borderRadius:"50%",
            border:`1.5px solid ${C.amber}`, background:C.bgSecondary }}/>
          <span style={{ color:C.textMuted, fontSize:"9px", fontStyle:"italic" }}>Session</span>
        </div>
        <span style={{ color:C.textMuted, fontSize:"9px", fontStyle:"italic", marginLeft:"auto" }}>
          {moodPoints.length} data point{moodPoints.length !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}


function ProgressScreen({ C, font, setScreen, steadyDays, sessionCount, moodHistory, bestStreak, totalActiveDays, sessionHistory, journalEntries, tier, onUpgrade }) {
  const [unlocked]=useState(() => {
    const u = [];
    if (sessionCount >= 1) u.push("first_chat");
    if (journalEntries && journalEntries.length >= 1) u.push("first_journal");
    if (moodHistory && moodHistory.length >= 3) u.push("mood_3");
    if (sessionCount >= 5) u.push("sessions_5");
    if (steadyDays >= 7) u.push("streak_7");
    if (journalEntries && journalEntries.length >= 5) u.push("journal_5");
    if (sessionCount >= 10) u.push("words_100");
    if (steadyDays >= 14) u.push("streak_14");
    if (sessionCount >= 25) u.push("sessions_25");
    if (journalEntries && journalEntries.length >= 20) u.push("journal_20");
    if (steadyDays >= 30) u.push("streak_30");
    if (steadyDays >= 90) u.push("streak_90");
    return u;
  });
  const [milestone,setMilestone]=useState(null);
  const [showMirror,setShowMirror]=useState(false);
  const [weeklySummary,setWeeklySummary]=useState(null);
  const [weeklyLoading,setWeeklyLoading]=useState(false);
  const [expandedSession,setExpandedSession]=useState(null);
  const [showAllSessions,setShowAllSessions]=useState(false);
  const canAccessMirror = (TIER_LEVELS[tier]||0) >= TIER_LEVELS.growth || new URLSearchParams(window.location.search).get("admin") === "f7a3d9e2-4c1b-4e8f-b2a6-9d5c3e7f1a04";

  const loadWeeklySummary=async()=>{
    setWeeklyLoading(true);
    const recentMoods = (moodHistory||[]).slice(0,7).map(m => `${["Very low","Low","Neutral","Good","Great"][m.mood]}${m.word?` (${m.word})`:""}`).join(", ");
    try {
      const r=await fetch("/api/chat",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:300,
          messages:[{role:"user",content:`You are Selah — a faith-rooted clarity companion. Write a warm, grounded weekly observation for a user. They have a ${steadyDays}-day streak and ${sessionCount} total sessions. ${recentMoods ? `Recent moods: ${recentMoods}.` : ""} Write 2-3 sentences in first person as Selah. Be specific, warm, and direct — not generic therapy-speak. Notice something real. End with one quiet encouragement. No bullet points.`}]})});
      const d=await r.json();
      if(d.error) throw new Error(d.error?.message||"API error");
      const text=d.content.map(b=>b.text||"").join("").trim();
      setWeeklySummary(text);
    } catch {
      setWeeklySummary("You keep showing up — even when it's hard. That says more about who you're becoming than any single session. Keep going.");
    } finally { setWeeklyLoading(false); }
  };

  // Build mood chart from real data
  const DAYS = ["S","M","T","W","T","F","S"];
  const today = new Date();
  const moodData = Array.from({length:7}, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    const dayLabel = DAYS[d.getDay()];
    const entry = (moodHistory||[]).find(m => {
      const md = new Date(m.date);
      return md.toDateString() === d.toDateString();
    });
    return { d: dayLabel, v: entry ? entry.mood + 1 : 0 };
  });
  const moodColors={1:C.terra,2:"#B8956A",3:C.textMuted,4:C.accent,5:C.sageDark};

  if(showMirror) return (
    <div style={{ minHeight:"100vh",background:C.bgPrimary,fontFamily:font,
      padding:"32px 20px 100px",boxSizing:"border-box" }}>
      <div style={{ maxWidth:"520px",margin:"0 auto" }}>
        <button onClick={()=>setShowMirror(false)} style={{ background:"none",border:"none",
          cursor:"pointer",color:C.textMuted,fontSize:"18px",padding:"0 0 20px",display:"block" }}>←</button>
        <Label text="The Growth Mirror" color={C.terra} font={font}/>
        <h1 style={{ color:C.textPrimary,fontSize:"clamp(20px,5vw,26px)",
          fontWeight:"normal",margin:"0 0 8px" }}>Look how far you've come.</h1>
        <p style={{ color:C.textSoft,fontSize:"13px",fontStyle:"italic",
          lineHeight:"1.8",margin:"0 0 24px" }}>
          Your growth — in your own words. Not Selah's words. Yours.
        </p>

        {steadyDays < 7 || !sessionHistory || sessionHistory.length < 2 ? (
          <div style={{ textAlign:"center", padding:"40px 20px" }}>
            <div style={{ fontSize:"36px", marginBottom:"16px" }}>🌱</div>
            <h2 style={{ color:C.textPrimary, fontSize:"18px", fontWeight:"normal",
              margin:"0 0 10px" }}>Still growing.</h2>
            <p style={{ color:C.textSoft, fontSize:"13px", fontStyle:"italic",
              lineHeight:"1.9", margin:"0 0 8px" }}>
              {sessionHistory && sessionHistory.length < 2
                ? "The Growth Mirror needs at least 2 completed reflection sessions to show you meaningful patterns. Keep reflecting — it's building."
                : `The Growth Mirror needs at least 7 days of reflection to show you meaningful patterns. Keep showing up — it's building.`}
            </p>
            <p style={{ color:C.accent, fontSize:"12px", fontStyle:"italic", margin:0 }}>
              {sessionHistory && sessionHistory.length < 2
                ? `${2 - (sessionHistory?.length||0)} more session${(2-(sessionHistory?.length||0))===1?"":"s"} to go.`
                : `${7 - steadyDays} days to go.`}
            </p>
          </div>
        ) : (() => {
          // Build real Then vs Now from session history
          const earliest = sessionHistory[sessionHistory.length - 1];
          const latest = sessionHistory[0];
          const earlyDate = new Date(earliest.date);
          const daysAgo = Math.floor((Date.now() - earlyDate.getTime()) / (1000*60*60*24));
          const avgMood = moodHistory && moodHistory.length > 0
            ? (moodHistory.reduce((sum,m)=>sum+m.mood,0)/moodHistory.length+1).toFixed(1)
            : "—";
          const recentMoods = moodHistory ? moodHistory.slice(0,7) : [];
          const avgRecent = recentMoods.length > 0
            ? (recentMoods.reduce((sum,m)=>sum+m.mood,0)/recentMoods.length+1).toFixed(1)
            : "—";
          // Collect categories used
          const earlyCategories = sessionHistory.slice(-Math.min(3,sessionHistory.length)).map(s=>s.category).filter(Boolean);
          const recentCategories = sessionHistory.slice(0,Math.min(3,sessionHistory.length)).map(s=>s.category).filter(Boolean);

          return (
          <>
        {/* Stats */}
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"8px",marginBottom:"16px" }}>
          {[{l:"Sessions",t:"0",n:String(sessionCount||0)},{l:"Streak",t:"0",n:String(steadyDays)},{l:"Mood",t:"—",n:avgRecent}].map(s=>(
            <div key={s.l} style={{ background:C.bgSecondary,borderRadius:"8px",
              padding:"12px",border:`1px solid ${C.border}`,textAlign:"center" }}>
              <p style={{ color:C.textMuted,fontSize:"8px",letterSpacing:"2px",
                textTransform:"uppercase",fontStyle:"italic",margin:"0 0 8px" }}>{s.l}</p>
              <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:"6px" }}>
                <span style={{ color:C.textMuted,fontSize:"11px",textDecoration:"line-through" }}>{s.t}</span>
                <span style={{ color:C.textMuted,fontSize:"10px" }}>→</span>
                <span style={{ color:C.accent,fontSize:"13px",fontWeight:"bold" }}>{s.n}</span>
              </div>
            </div>
          ))}
        </div>
        {/* Side by side — real data */}
        <div style={{ display:"flex",gap:"10px",marginBottom:"16px" }}>
          {[
            {side:"Then",
              date:`Day 1 · ${daysAgo === 0 ? "today" : daysAgo === 1 ? "yesterday" : daysAgo + " days ago"}`,
              color:C.border,
              items:[earliest.insight, earliest.takeaway, earliest.action].filter(Boolean),
              tags:[...new Set(earlyCategories)].slice(0,3)},
            {side:"Now",
              date:"Most recent",
              color:C.accent,
              items:[latest.insight, latest.takeaway, latest.action].filter(Boolean),
              tags:[...new Set(recentCategories)].slice(0,3)},
          ].map(s=>(
            <div key={s.side} style={{ flex:1,background:s.side==="Then"?C.bgCard:`${C.accent}10`,
              borderRadius:"10px",padding:"14px",
              border:`1.5px solid ${s.side==="Then"?C.border:C.accent+"44"}` }}>
              <p style={{ color:s.side==="Then"?C.textMuted:C.accent,fontSize:"9px",
                letterSpacing:"3px",textTransform:"uppercase",fontStyle:"italic",margin:"0 0 4px" }}>
                {s.side}
              </p>
              <p style={{ color:C.textMuted,fontSize:"10px",fontStyle:"italic",margin:"0 0 12px" }}>
                {s.date}
              </p>
              {s.items.map((w,i)=>(
                <div key={i} style={{ display:"flex",gap:"5px",alignItems:"flex-start",marginBottom:"6px" }}>
                  <div style={{ width:"3px",height:"3px",borderRadius:"50%",
                    background:s.side==="Then"?C.textMuted:C.accent,marginTop:"5px",flexShrink:0 }}/>
                  <p style={{ color:s.side==="Then"?C.textMuted:C.textSoft,fontSize:"10px",
                    fontStyle:"italic",lineHeight:"1.6",margin:0 }}>{w.length > 80 ? w.slice(0,80)+"..." : w}</p>
                </div>
              ))}
              <div style={{ display:"flex",flexWrap:"wrap",gap:"4px",marginTop:"10px" }}>
                {s.tags.map(t=>(
                  <span key={t} style={{ background:s.side==="Then"?C.bgSecondary:`${C.accent}15`,
                    color:s.side==="Then"?C.textMuted:C.accent,fontSize:"7px",
                    letterSpacing:"1.5px",textTransform:"uppercase",
                    padding:"2px 6px",borderRadius:"8px",fontStyle:"italic" }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        {/* Selah's observation — AI generated, Growth+ only */}
        {(TIER_LEVELS[tier]||0) >= TIER_LEVELS.growth && (
        <MirrorObservation C={C} font={font} sessionHistory={sessionHistory}
          steadyDays={steadyDays} sessionCount={sessionCount} moodHistory={moodHistory}/>
        )}
          </>
          );
        })()}
        <div style={{ textAlign:"center",borderTop:`1px solid ${C.border}`,paddingTop:"20px" }}>
          <p style={{ color:C.textMuted,fontSize:"11px",fontStyle:"italic",lineHeight:"1.9",margin:0 }}>
            "He who began a good work in you will carry it on to completion."
          </p>
          <p style={{ color:C.sageLight,fontSize:"9px",letterSpacing:"2px",
            textTransform:"uppercase",margin:"4px 0 0" }}>Philippians 1:6</p>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh",background:C.bgPrimary,fontFamily:font,
      padding:"40px 20px 100px",boxSizing:"border-box" }}>
      <div style={{ maxWidth:"480px",margin:"0 auto" }}>
        <Label text="Your Growth" color={C.sage} font={font}/>
        <h1 style={{ color:C.textPrimary,fontSize:"clamp(22px,5vw,28px)",
          fontWeight:"normal",margin:"0 0 20px" }}>My Progress</h1>

        {/* Weekly Summary from Selah */}
        {weeklySummary?(
          <div style={{ background:`${C.sage}12`,border:`1px solid ${C.sage}33`,
            borderRadius:"12px",padding:"18px",marginBottom:"16px" }}>
            <div style={{ display:"flex",alignItems:"center",gap:"10px",marginBottom:"12px" }}>
              <div style={{ width:"30px",height:"30px",borderRadius:"50%",
                background:`${C.sage}22`,border:`1px solid ${C.sage}44`,
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:"11px",flexShrink:0 }}>✦</div>
              <div>
                <p style={{ color:C.sage,fontSize:"9px",letterSpacing:"3px",
                  textTransform:"uppercase",fontStyle:"italic",margin:0 }}>
                  Selah's Weekly Notice
                </p>
                <p style={{ color:C.textMuted,fontSize:"10px",fontStyle:"italic",margin:0 }}>
                  {new Date().toLocaleDateString("en-US",{month:"long",day:"numeric"})}
                </p>
              </div>
            </div>
            <p style={{ color:C.textSoft,fontSize:"13px",fontStyle:"italic",
              lineHeight:"1.9",margin:0 }}>{weeklySummary}</p>
          </div>
        ):(
          <div onClick={loadWeeklySummary}
            style={{ background:C.bgSecondary,border:`1px solid ${C.sage}22`,
              borderRadius:"12px",padding:"16px 18px",marginBottom:"16px",
              cursor:"pointer",display:"flex",alignItems:"center",gap:"12px",
              transition:"all 0.2s ease" }}
            onMouseEnter={e=>e.currentTarget.style.borderColor=C.sage+"44"}
            onMouseLeave={e=>e.currentTarget.style.borderColor=C.sage+"22"}>
            <div style={{ width:"36px",height:"36px",borderRadius:"50%",
              background:`${C.sage}15`,border:`1px solid ${C.sage}33`,
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:"16px",flexShrink:0 }}>
              {weeklyLoading?"⏳":"✦"}
            </div>
            <div style={{ flex:1 }}>
              <p style={{ color:C.sage,fontSize:"11px",letterSpacing:"2px",
                textTransform:"uppercase",fontStyle:"italic",margin:"0 0 3px" }}>
                {weeklyLoading?"Selah is reflecting...":"Weekly Summary"}
              </p>
              <p style={{ color:C.textMuted,fontSize:"12px",fontStyle:"italic",margin:0 }}>
                {weeklyLoading?"This takes just a moment...":"What Selah noticed about you this week"}
              </p>
            </div>
            {!weeklyLoading&&<span style={{ color:C.sage,fontSize:"16px" }}>→</span>}
          </div>
        )}

        {/* Streak */}
        <div style={{ background:`${C.amber}18`,border:`1px solid ${C.amber}33`,
          borderRadius:"12px",padding:"20px",marginBottom:"14px" }}>
          <div style={{ display:"flex",justifyContent:"space-between",
            alignItems:"center",marginBottom:"16px" }}>
            <div>
              <p style={{ color:C.amber,fontSize:"10px",letterSpacing:"3px",
                textTransform:"uppercase",fontStyle:"italic",margin:"0 0 4px" }}>Steady Days</p>
              <div style={{ display:"flex",alignItems:"baseline",gap:"6px" }}>
                <span style={{ color:C.textPrimary,fontSize:"48px",fontWeight:"bold",
                  fontFamily:font,lineHeight:1 }}>{steadyDays}</span>
                <span style={{ color:C.textSoft,fontSize:"13px",fontStyle:"italic" }}>days</span>
              </div>
            </div>
            <span style={{ fontSize:"42px" }}>🔥</span>
          </div>
          <div style={{ display:"flex",gap:"6px",marginBottom:"14px" }}>
            {["M","T","W","T","F","S","S"].map((d,i)=>(
              <div key={i} style={{ flex:1,display:"flex",flexDirection:"column",
                alignItems:"center",gap:"4px" }}>
                <div style={{ width:"100%",aspectRatio:"1",borderRadius:"50%",
                  background:i<7?C.amber:C.bgCard,
                  border:`1px solid ${i<7?C.amber:C.border}`,
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:"9px",
                  color:i<7?"#fff":"transparent" }}>✓</div>
                <span style={{ color:C.textMuted,fontSize:"9px" }}>{d}</span>
              </div>
            ))}
          </div>
          <div style={{ display:"flex",gap:"10px" }}>
            {[{v:String(steadyDays),l:"Current"},{v:String(bestStreak||steadyDays),l:"Best"},{v:String(totalActiveDays||steadyDays),l:"Total"}].map(s=>(
              <div key={s.l} style={{ flex:1,textAlign:"center",background:C.bgPrimary,
                borderRadius:"8px",padding:"10px 6px",opacity:0.85 }}>
                <p style={{ color:C.textPrimary,fontSize:"20px",fontWeight:"bold",
                  margin:"0 0 2px",fontFamily:font }}>{s.v}</p>
                <p style={{ color:C.textMuted,fontSize:"8px",letterSpacing:"1.5px",
                  textTransform:"uppercase",margin:0,fontStyle:"italic" }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mood graph */}
        <div style={{ background:C.bgSecondary,borderRadius:"12px",
          padding:"20px",marginBottom:"14px",border:`1px solid ${C.border}` }}>
          <Label text="Mood This Week" color={C.terra} font={font}/>
          <div style={{ display:"flex",alignItems:"flex-end",gap:"8px",height:"70px",marginBottom:"10px" }}>
            {moodData.map((m,i)=>(
              <div key={i} style={{ flex:1,display:"flex",flexDirection:"column",
                alignItems:"center",height:"100%",justifyContent:"flex-end",gap:"4px" }}>
                <div style={{ width:"100%",borderRadius:"4px 4px 0 0",
                  height:`${(m.v/5)*100}%`,background:`${moodColors[m.v]}88`,
                  border:`1px solid ${moodColors[m.v]}55` }}/>
                <span style={{ color:C.textMuted,fontSize:"9px" }}>{m.d}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Emotional Timeline */}
        {(moodHistory||[]).length >= 1 && (
          <EmotionalTimeline C={C} font={font}
            moodHistory={moodHistory} sessionHistory={sessionHistory}/>
        )}

        {/* Growth Mirror CTA */}
        {canAccessMirror ? (
        <div onClick={()=>setShowMirror(true)}
          style={{ background:`${C.terra}12`,border:`1px solid ${C.terra}33`,
            borderRadius:"12px",padding:"18px",marginBottom:"14px",cursor:"pointer",
            display:"flex",alignItems:"center",gap:"14px",transition:"all 0.2s ease" }}
          onMouseEnter={e=>e.currentTarget.style.transform="translateY(-1px)"}
          onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
          <div style={{ width:"48px",height:"48px",borderRadius:"50%",
            background:`${C.terra}18`,border:`1px solid ${C.terra}33`,
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:"22px",flexShrink:0 }}>🪞</div>
          <div style={{ flex:1 }}>
            <p style={{ color:C.terra,fontSize:"11px",letterSpacing:"2px",
              textTransform:"uppercase",fontStyle:"italic",margin:"0 0 4px" }}>The Growth Mirror</p>
            <p style={{ color:C.textSoft,fontSize:"12px",fontStyle:"italic",
              lineHeight:"1.6",margin:0 }}>
              See who you were on day one vs who you are becoming. Your own words. Your own shift.
            </p>
          </div>
          <span style={{ color:C.terra,fontSize:"18px" }}>→</span>
        </div>
        ) : (
        <div style={{ background:`${C.amber}08`,border:`1.5px solid ${C.amber}33`,
          borderRadius:"12px",padding:"18px",marginBottom:"14px",
          display:"flex",alignItems:"center",gap:"14px" }}>
          <div style={{ width:"48px",height:"48px",borderRadius:"50%",
            background:`${C.amber}12`,border:`1px solid ${C.amber}33`,
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:"22px",flexShrink:0 }}>🔒</div>
          <div style={{ flex:1 }}>
            <p style={{ color:C.amber,fontSize:"11px",letterSpacing:"2px",
              textTransform:"uppercase",fontStyle:"italic",margin:"0 0 4px" }}>The Growth Mirror</p>
            <p style={{ color:C.textSoft,fontSize:"12px",fontStyle:"italic",
              lineHeight:"1.6",margin:"0 0 8px" }}>
              AI-powered insights showing how you've changed over time. Requires Growth plan.
            </p>
            <button onClick={onUpgrade} style={{ background:C.amber,border:"none",borderRadius:"3px",
              color:"#fff",fontSize:"9px",letterSpacing:"2px",textTransform:"uppercase",
              padding:"7px 16px",cursor:"pointer",fontFamily:font,fontStyle:"italic" }}>
              Unlock
            </button>
          </div>
        </div>
        )}

        {/* Session History */}
        <div style={{ marginBottom:"14px" }}>
          <Label text={`Session History · ${(sessionHistory||[]).length} sessions`} color={C.sage} font={font}/>
          {(!sessionHistory || sessionHistory.length === 0) ? (
            <div style={{ background:C.bgSecondary, borderRadius:"10px",
              padding:"24px 20px", border:`1px solid ${C.border}`, textAlign:"center" }}>
              <div style={{ fontSize:"28px", marginBottom:"10px" }}>◈</div>
              <p style={{ color:C.textSoft, fontSize:"13px", fontStyle:"italic",
                lineHeight:"1.8", margin:"0 0 4px" }}>
                No sessions yet.
              </p>
              <p style={{ color:C.textMuted, fontSize:"11px", fontStyle:"italic", margin:0 }}>
                Complete a reflection session and your insights will live here forever.
              </p>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
              {sessionHistory.slice(0, showAllSessions ? 50 : 3).map(s => {
                const d = new Date(s.date);
                const ago = Math.floor((Date.now() - d.getTime()) / (1000*60*60*24));
                const dateStr = ago === 0 ? "Today" : ago === 1 ? "Yesterday" : ago < 7 ? `${ago} days ago` : d.toLocaleDateString("en-US",{month:"short",day:"numeric"});
                const isExpanded = expandedSession === s.id;
                return (
                  <div key={s.id} onClick={()=>setExpandedSession(isExpanded ? null : s.id)}
                    style={{ background:C.bgSecondary, borderRadius:"10px",
                      padding:"16px", border:`1px solid ${isExpanded ? C.accent+"44" : C.border}`,
                      cursor:"pointer", transition:"all 0.2s ease" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
                      <div style={{ width:"36px", height:"36px", borderRadius:"50%",
                        background:`${C.accent}15`, border:`1px solid ${C.accent}33`,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:"16px", flexShrink:0 }}>{s.categoryIcon || "✦"}</div>
                      <div style={{ flex:1 }}>
                        <p style={{ color:C.textPrimary, fontSize:"13px", fontFamily:font,
                          margin:"0 0 2px" }}>{s.category || "Reflection"}</p>
                        <p style={{ color:C.textMuted, fontSize:"10px", fontStyle:"italic", margin:0 }}>
                          {dateStr} · {s.messageCount || "—"} exchanges
                        </p>
                      </div>
                      <span style={{ color:C.textMuted, fontSize:"14px",
                        transform: isExpanded ? "rotate(90deg)" : "rotate(0)",
                        transition:"transform 0.2s ease" }}>›</span>
                    </div>
                    {isExpanded && (
                      <div style={{ marginTop:"14px", paddingTop:"14px",
                        borderTop:`1px solid ${C.border}` }}>
                        {[{label:"Insight", val:s.insight, color:C.accent},
                          {label:"Takeaway", val:s.takeaway, color:C.amber},
                          {label:"One Small Move", val:s.action, color:C.terra}].map(item => item.val && (
                          <div key={item.label} style={{ marginBottom:"10px" }}>
                            <p style={{ color:item.color, fontSize:"8px", letterSpacing:"2px",
                              textTransform:"uppercase", fontStyle:"italic", margin:"0 0 4px" }}>{item.label}</p>
                            <p style={{ color:C.textSoft, fontSize:"12px", fontStyle:"italic",
                              lineHeight:"1.8", margin:0 }}>{item.val}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              {sessionHistory.length > 3 && (
                <button onClick={(e)=>{e.stopPropagation();setShowAllSessions(!showAllSessions);}}
                  style={{ background:"none", border:`1px solid ${C.border}`,
                    borderRadius:"3px", color:C.textMuted, fontSize:"9px",
                    letterSpacing:"2px", textTransform:"uppercase", padding:"12px",
                    cursor:"pointer", fontFamily:font, fontStyle:"italic",
                    transition:"all 0.2s ease" }}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=C.accent}
                  onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                  {showAllSessions ? "Show Less" : `View All ${sessionHistory.length} Sessions`}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Milestones */}

        {/* ── DEEP-ONLY FEATURES ── */}
        {(TIER_LEVELS[tier]||0) >= TIER_LEVELS.deep && sessionHistory && sessionHistory.length >= 5 && (() => {
          // Pattern Detection
          const categories = sessionHistory.map(s=>s.category).filter(Boolean);
          const catCounts = {};
          categories.forEach(c => { catCounts[c] = (catCounts[c]||0) + 1; });
          const patterns = Object.entries(catCounts).sort((a,b)=>b[1]-a[1]).slice(0,5);
          const moods = (moodHistory||[]).slice(0,14).map(m=>m.mood).filter(Boolean);
          const avgRecent = moods.slice(0,7).reduce((a,b)=>a+b,0)/(moods.slice(0,7).length||1);
          const avgOlder = moods.slice(7,14).reduce((a,b)=>a+b,0)/(moods.slice(7,14).length||1);
          const moodTrend = moods.length >= 7 ? (avgRecent > avgOlder + 0.3 ? "improving" : avgRecent < avgOlder - 0.3 ? "declining" : "steady") : null;

          // This Time Last Month
          const oneMonthAgo = Date.now() - 30*24*60*60*1000;
          const lastMonthSessions = sessionHistory.filter(s => {
            const d = new Date(s.date).getTime();
            return d >= oneMonthAgo - 7*24*60*60*1000 && d <= oneMonthAgo + 7*24*60*60*1000;
          });

          return (
            <>
              {/* Pattern Detection */}
              <div style={{ marginBottom:"14px" }}>
                <Label text="Pattern Detection" color={C.terra} font={font}/>
                <div style={{ background:C.bgSecondary, borderRadius:"10px", padding:"16px",
                  border:`1px solid ${C.border}` }}>
                  <p style={{ color:C.textSoft, fontSize:"12px", fontStyle:"italic",
                    lineHeight:"1.8", margin:"0 0 12px" }}>
                    What keeps coming up across your sessions:
                  </p>
                  <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
                    {patterns.map(([cat, count]) => (
                      <div key={cat} style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                        <div style={{ flex:1, height:"6px", background:C.bgCard, borderRadius:"3px", overflow:"hidden" }}>
                          <div style={{ height:"100%", borderRadius:"3px",
                            background:`linear-gradient(to right, ${C.accent}, ${C.terra})`,
                            width:`${Math.min(100, (count/Math.max(...patterns.map(p=>p[1])))*100)}%`,
                            transition:"width 0.5s ease" }}/>
                        </div>
                        <span style={{ color:C.textPrimary, fontSize:"12px", fontFamily:font,
                          minWidth:"80px" }}>{cat}</span>
                        <span style={{ color:C.textMuted, fontSize:"10px", fontStyle:"italic" }}>
                          {count}×
                        </span>
                      </div>
                    ))}
                  </div>
                  {moodTrend && (
                    <div style={{ marginTop:"12px", paddingTop:"12px", borderTop:`1px solid ${C.border}` }}>
                      <p style={{ color:C.textMuted, fontSize:"10px", fontStyle:"italic", margin:"0 0 4px" }}>
                        Mood trend (14 days)
                      </p>
                      <p style={{ color: moodTrend==="improving"?C.sage:moodTrend==="declining"?C.terra:C.amber,
                        fontSize:"13px", fontStyle:"italic", fontFamily:font, margin:0 }}>
                        {moodTrend==="improving" ? "↑ Your mood has been trending upward — something's working."
                         : moodTrend==="declining" ? "↓ Your mood has dipped recently — worth paying attention to."
                         : "→ Your mood has been steady — consistency can be its own kind of progress."}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* This Time Last Month */}
              {lastMonthSessions.length > 0 && (
                <div style={{ marginBottom:"14px" }}>
                  <Label text="This Time Last Month" color={C.amber} font={font}/>
                  <div style={{ background:`${C.amber}08`, borderRadius:"10px", padding:"16px",
                    border:`1px solid ${C.amber}22` }}>
                    <p style={{ color:C.textSoft, fontSize:"12px", fontStyle:"italic",
                      lineHeight:"1.8", margin:"0 0 10px" }}>
                      Around this time last month, here's what was on your mind:
                    </p>
                    {lastMonthSessions.slice(0,2).map(s => (
                      <div key={s.id} style={{ marginBottom:"8px", paddingBottom:"8px",
                        borderBottom:`1px solid ${C.amber}15` }}>
                        <p style={{ color:C.textPrimary, fontSize:"12px", fontFamily:font, margin:"0 0 3px" }}>
                          {s.category || "Reflection"} · {new Date(s.date).toLocaleDateString("en-US",{month:"short",day:"numeric"})}
                        </p>
                        {s.insight && <p style={{ color:C.textMuted, fontSize:"11px", fontStyle:"italic",
                          lineHeight:"1.7", margin:0 }}>{s.insight}</p>}
                      </div>
                    ))}
                    <p style={{ color:C.amber, fontSize:"11px", fontStyle:"italic", margin:"6px 0 0" }}>
                      How far have you come since then?
                    </p>
                  </div>
                </div>
              )}
            </>
          );
        })()}

        <Label text={`Milestones · ${unlocked.length}/${MILESTONES.length}`} color={C.amber} font={font}/>
        <div style={{ height:"3px",background:C.bgSecondary,borderRadius:"2px",
          marginBottom:"16px",overflow:"hidden" }}>
          <div style={{ height:"100%",borderRadius:"2px",
            background:`linear-gradient(to right,${C.accent},${C.amber})`,
            width:`${(unlocked.length/MILESTONES.length)*100}%`,
            transition:"width 0.8s ease" }}/>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"8px" }}>
          {MILESTONES.map(m=>{
            const u=unlocked.includes(m.id);
            return (
              <div key={m.id} onClick={()=>u&&setMilestone(m)}
                style={{ background:u?`${C.amber}15`:C.bgSecondary,
                  border:`1.5px solid ${u?C.amber+"44":C.border}`,
                  borderRadius:"10px",padding:"12px 10px",cursor:u?"pointer":"default",
                  opacity:u?1:0.45,transition:"all 0.2s ease",position:"relative",
                  textAlign:"center" }}
                onMouseEnter={e=>{ if(u) e.currentTarget.style.transform="translateY(-1px)"; }}
                onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
                {u&&<div style={{ position:"absolute",top:"6px",right:"6px",
                  width:"14px",height:"14px",borderRadius:"50%",background:C.amber,
                  display:"flex",alignItems:"center",justifyContent:"center" }}>
                  <span style={{ color:"#fff",fontSize:"8px" }}>✓</span>
                </div>}
                <span style={{ fontSize:"20px",display:"block",marginBottom:"4px",
                  filter:u?"none":"grayscale(1)" }}>{m.icon}</span>
                <p style={{ color:u?C.textPrimary:C.textMuted,fontSize:"11px",
                  fontWeight:"bold",fontFamily:font,margin:"0 0 2px" }}>{m.label}</p>
                <p style={{ color:u?C.textSoft:C.textMuted,fontSize:"9px",
                  fontStyle:"italic",lineHeight:"1.5",margin:0 }}>{m.desc}</p>
              </div>
            );
          })}
            );
          })}
        </div>
      </div>

      {milestone&&(
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",
          display:"flex",alignItems:"center",justifyContent:"center",
          zIndex:300,padding:"24px",fontFamily:font }}>
          <div style={{ background:C.bgPrimary,borderRadius:"16px",padding:"32px 28px",
            maxWidth:"340px",width:"100%",textAlign:"center",
            border:`1px solid ${C.sage}33` }}>
            <div style={{ fontSize:"44px",marginBottom:"14px" }}>{milestone.icon}</div>
            <p style={{ color:C.amber,fontSize:"9px",letterSpacing:"3px",
              textTransform:"uppercase",fontStyle:"italic",margin:"0 0 6px" }}>Milestone Unlocked</p>
            <h2 style={{ color:C.textPrimary,fontSize:"20px",fontWeight:"normal",
              margin:"0 0 6px" }}>{milestone.label}</h2>
            <p style={{ color:C.textSoft,fontSize:"12px",fontStyle:"italic",
              margin:"0 0 20px" }}>{milestone.desc}</p>
            <div style={{ background:C.bgSecondary,borderRadius:"8px",
              padding:"16px",marginBottom:"20px",borderLeft:`3px solid ${C.accent}` }}>
              <p style={{ color:C.textSoft,fontSize:"13px",fontStyle:"italic",
                lineHeight:"1.8",margin:"0 0 6px" }}>{milestone.scripture}</p>
              <p style={{ color:C.sageLight,fontSize:"9px",letterSpacing:"2px",
                textTransform:"uppercase",margin:0 }}>{milestone.ref}</p>
            </div>
            <button onClick={()=>setMilestone(null)} style={{ background:C.accent,
              border:"none",borderRadius:"3px",color:"#fff",fontSize:"10px",
              letterSpacing:"3px",textTransform:"uppercase",padding:"14px 36px",
              cursor:"pointer",fontFamily:font,fontStyle:"italic" }}>Continue</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// RESOURCES SCREEN (simplified)
// ═══════════════════════════════════════════════════════
function ResourcesScreen({ C, font, setScreen, onboardingAnswers, faithLevel, tier, sessionHistory, moodHistory }) {
  const [aiQuery,setAiQuery]=useState("");
  const [recs,setRecs]=useState(null);
  const [loading,setLoading]=useState(false);
  const [autoRecs,setAutoRecs]=useState(null);
  const [autoLoading,setAutoLoading]=useState(false);

  const isGrowth = (TIER_LEVELS[tier]||0) >= TIER_LEVELS.growth;

  const BOOKS=[
    {title:"Man's Search for Meaning",author:"Viktor Frankl",color:C.amber,
      desc:"A Holocaust survivor shows how meaning sustains a soul through suffering. One of the most important books written.",type:"book"},
    {title:"The Gifts of Imperfection",author:"Brené Brown",color:C.terra,
      desc:"Letting go of who you think you should be and embracing who you are. Essential for self-worth.",type:"book"},
    {title:"Battlefield of the Mind",author:"Joyce Meyer",color:C.accent,
      desc:"A faith-based guide to replacing destructive thought patterns. Written from lived experience of trauma and healing.",type:"book"},
    {title:"Meditations",author:"Marcus Aurelius",color:C.terra,
      desc:"The private journal of a Roman emperor. Two thousand years later, still unmatched on anxiety and inner peace.",type:"book"},
  ];

  // Build enriched context for Growth+ — onboarding + recent sessions + mood
  const buildContext = () => {
    const parts = [
      onboardingAnswers?.reasons && `Dealing with: ${Array.isArray(onboardingAnswers.reasons)?onboardingAnswers.reasons.join(", "):onboardingAnswers.reasons}`,
      onboardingAnswers?.biggest && `Heaviest thing: ${onboardingAnswers.biggest}`,
      onboardingAnswers?.goal && `Goal: "I want to become someone who ${onboardingAnswers.goal}"`,
    ];
    if (sessionHistory?.length > 0) {
      const recent = sessionHistory.slice(0,5).map(s=>s.category||s.insight).filter(Boolean);
      if (recent.length) parts.push(`Recent session themes: ${recent.join(", ")}`);
    }
    if (moodHistory?.length > 0) {
      const avg = Math.round(moodHistory.slice(0,7).reduce((a,b)=>a+(b.mood||3),0)/Math.min(moodHistory.length,7));
      parts.push(`Recent mood average: ${avg}/5`);
    }
    return parts.filter(Boolean).join(". ");
  };

  useEffect(()=>{
    if(!isGrowth) return;
    if(onboardingAnswers && Object.keys(onboardingAnswers).length>0 && !autoRecs){
      loadAutoRecs();
    }
  },[]);

  const loadAutoRecs=async()=>{
    setAutoLoading(true);
    const context = buildContext();
    try {
      const r=await fetch("/api/chat",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:900,
          messages:[{role:"user",content:`Generate 3 personalized book/resource recommendations for someone with this profile: ${context}. ${faithLevel>=2?"Include at least one faith-based resource.":"Lean secular."} Use their recent session themes and mood data to make recommendations current — not just based on onboarding. Return ONLY a JSON array: [{"title":"...","author":"...","description":"2 sentences why this is perfect for them right now.","whyNow":"one personal sentence connecting to their current situation","type":"book|podcast|practice"}] No markdown.`}]})});
      const d=await r.json();
      if(d.error) throw new Error(d.error?.message||"API error");
      const t=d.content.map(b=>b.text||"").join("").trim();
      const parsed=JSON.parse(t.replace(/```json|```/g,"").trim());
      setAutoRecs(parsed.map((r,i)=>({...r,color:[C.sage,C.amber,C.terra][i%3]})));
    } catch { setAutoRecs(null); }
    finally { setAutoLoading(false); }
  };

  const getAIRecs=async()=>{
    if(!aiQuery.trim()||!isGrowth)return;
    setLoading(true);
    try {
      const r=await fetch("/api/chat",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:800,
          messages:[{role:"user",content:`Generate 2 personalized book/author recommendations for someone dealing with: "${aiQuery}". Return ONLY JSON array: [{"title":"...","author":"...","description":"2 sentences why this is perfect for them right now.","quote":"under 15 words","whyNow":"one sentence"}] No markdown.`}]})});
      const d=await r.json();
      if(d.error) throw new Error(d.error?.message||"API error");
      const t=d.content.map(b=>b.text||"").join("").trim();
      const parsed=JSON.parse(t.replace(/```json|```/g,"").trim());
      setRecs(parsed.map((r,i)=>({...r,color:[C.terra,C.amber][i%2]})));
    } catch { setRecs(null); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:"100vh",background:C.bgPrimary,fontFamily:font,
      padding:"40px 20px 100px",boxSizing:"border-box" }}>
      <div style={{ maxWidth:"480px",margin:"0 auto" }}>
        <button onClick={()=>setScreen("home")} style={{ background:"none",border:"none",
          cursor:"pointer",color:C.textMuted,fontSize:"20px",marginBottom:"20px" }}>←</button>
        <Label text="Library" color={C.amber} font={font}/>
        <h1 style={{ color:C.textPrimary,fontSize:"clamp(22px,5vw,28px)",
          fontWeight:"normal",margin:"0 0 8px" }}>Resources</h1>
        <p style={{ color:C.textSoft,fontSize:"13px",fontStyle:"italic",
          lineHeight:"1.8",margin:"0 0 24px" }}>Books and voices handpicked for where you are right now.</p>

        {/* Growth+: AI-personalized recs */}
        {isGrowth && (autoRecs||autoLoading) && (
          <div style={{ marginBottom:"24px" }}>
            <Label text="Picked For You" color={C.sage} font={font}/>
            {autoLoading ? (
              <div style={{ background:`${C.sage}10`, borderRadius:"10px", padding:"20px",
                border:`1px solid ${C.sage}22`, textAlign:"center" }}>
                <div style={{ display:"flex", justifyContent:"center", gap:"6px", marginBottom:"10px" }}>
                  {[0,1,2].map(i=>(
                    <div key={i} style={{ width:"6px", height:"6px", borderRadius:"50%",
                      background:C.sage, opacity:0.4,
                      animation:"pulse 1.2s ease-in-out infinite",
                      animationDelay:`${i*0.2}s` }}/>
                  ))}
                </div>
                <p style={{ color:C.textMuted, fontSize:"12px", fontStyle:"italic", margin:0 }}>
                  Finding resources matched to you...
                </p>
              </div>
            ) : autoRecs?.map((r,i) => (
              <div key={i} style={{ background:`${r.color}10`, borderRadius:"10px",
                padding:"16px 18px", marginBottom:"10px",
                border:`1px solid ${r.color}33` }}>
                <div style={{ display:"flex", alignItems:"center", gap:"6px", marginBottom:"6px" }}>
                  <div style={{ width:"4px", height:"4px", borderRadius:"50%", background:r.color }}/>
                  <span style={{ color:r.color, fontSize:"8px", letterSpacing:"2px",
                    textTransform:"uppercase" }}>
                    {r.type==="podcast"?"🎙 Podcast":r.type==="practice"?"◎ Practice":"📖 Book"} · Matched to you
                  </span>
                </div>
                <p style={{ color:C.textPrimary, fontSize:"14px", fontWeight:"bold",
                  fontFamily:font, margin:"0 0 2px" }}>{r.title}</p>
                <p style={{ color:r.color, fontSize:"11px", fontStyle:"italic", margin:"0 0 8px" }}>{r.author}</p>
                <p style={{ color:C.textSoft, fontSize:"12px", fontStyle:"italic",
                  lineHeight:"1.7", margin:"0 0 6px" }}>{r.description}</p>
                {r.whyNow&&<p style={{ color:C.amber, fontSize:"11px", fontStyle:"italic",
                  lineHeight:"1.6", margin:0 }}>→ {r.whyNow}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Growth+: Manual search */}
        {isGrowth && (
          <div style={{ background:`${C.accent}08`,border:`1px solid ${C.accent}22`,
            borderRadius:"10px",padding:"16px 18px",marginBottom:"24px" }}>
            <Label text="Personalized for You" color={C.accent} font={font}/>
            <div style={{ display:"flex",gap:"8px" }}>
              <input value={aiQuery} onChange={e=>setAiQuery(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&getAIRecs()}
                placeholder="What are you going through?"
                style={{ flex:1,background:C.bgCard,border:`1px solid ${C.border}`,
                  borderRadius:"6px",padding:"10px 14px",color:C.textPrimary,
                  fontSize:"13px",fontFamily:font,outline:"none" }}/>
              <button onClick={getAIRecs} disabled={loading}
                style={{ background:C.accent,border:"none",borderRadius:"6px",
                  color:"#fff",fontSize:"12px",padding:"10px 16px",
                  cursor:"pointer",fontFamily:font,opacity:loading?0.6:1 }}>
                {loading?"...":"Find"}
              </button>
            </div>
            {recs?.map((r,i)=>(
              <div key={i} style={{ background:`${r.color}10`,borderRadius:"8px",
                padding:"14px 16px",marginTop:"10px",border:`1px solid ${r.color}22` }}>
                <p style={{ color:C.textPrimary,fontSize:"14px",fontWeight:"bold",
                  fontFamily:font,margin:"0 0 2px" }}>{r.title}</p>
                <p style={{ color:r.color,fontSize:"11px",fontStyle:"italic",margin:"0 0 6px" }}>{r.author}</p>
                <p style={{ color:C.textSoft,fontSize:"12px",fontStyle:"italic",
                  lineHeight:"1.7",margin:"0 0 4px" }}>{r.description}</p>
                {r.whyNow&&<p style={{ color:C.amber,fontSize:"11px",fontStyle:"italic",margin:0 }}>→ {r.whyNow}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Foundation: upgrade nudge */}
        {!isGrowth && (
          <div style={{ background:`${C.accent}08`,border:`1px solid ${C.accent}22`,
            borderRadius:"10px",padding:"16px 18px",marginBottom:"24px",
            display:"flex",alignItems:"center",gap:"12px" }}>
            <span style={{ fontSize:"18px" }}>🔒</span>
            <div>
              <p style={{ color:C.textPrimary,fontSize:"13px",fontFamily:font,margin:"0 0 3px" }}>
                AI-Matched Resources
              </p>
              <p style={{ color:C.textSoft,fontSize:"11px",fontStyle:"italic",
                lineHeight:"1.7",margin:0 }}>
                Growth plan unlocks personalized recommendations based on your sessions, mood, and journey.
              </p>
            </div>
          </div>
        )}

        {/* Static books — all tiers */}
        <Label text="Essential Reading" color={C.amber} font={font}/>
        {BOOKS.map((b,i)=>(
          <div key={i} style={{ background:`${b.color}10`,borderRadius:"10px",
            padding:"16px 18px",marginBottom:"10px",border:`1px solid ${b.color}22` }}>
            <div style={{ display:"flex",alignItems:"center",gap:"6px",marginBottom:"6px" }}>
              <div style={{ width:"4px",height:"4px",borderRadius:"50%",background:b.color }}/>
              <span style={{ color:b.color,fontSize:"8px",letterSpacing:"2px",textTransform:"uppercase" }}>
                📖 Book
              </span>
            </div>
            <p style={{ color:C.textPrimary,fontSize:"14px",fontWeight:"bold",
              fontFamily:font,margin:"0 0 2px" }}>{b.title}</p>
            <p style={{ color:b.color,fontSize:"11px",fontStyle:"italic",margin:"0 0 8px" }}>{b.author}</p>
            <p style={{ color:C.textSoft,fontSize:"12px",fontStyle:"italic",
              lineHeight:"1.7",margin:0 }}>{b.desc}</p>
          </div>
        ))}

        <div style={{ textAlign:"center",marginTop:"24px",
          borderTop:`1px solid ${C.border}`,paddingTop:"20px" }}>
          <p style={{ color:C.textMuted,fontSize:"11px",fontStyle:"italic",lineHeight:"1.9",margin:0 }}>
            "Get wisdom, get understanding."
          </p>
          <p style={{ color:C.sageLight,fontSize:"9px",letterSpacing:"2px",
            textTransform:"uppercase",margin:"4px 0 0" }}>Proverbs 4:5</p>
        </div>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════
// ARMOR UP SCREEN
// ═══════════════════════════════════════════════════════
const ARMOR_VERSES = [
  { text:"The Lord is my strength and my shield; my heart trusts in him.", ref:"Psalm 28:7" },
  { text:"Do not be anxious about anything, but in every situation present your requests to God.", ref:"Philippians 4:6" },
  { text:"Be strong and courageous. Do not be afraid; do not be discouraged.", ref:"Joshua 1:9" },
  { text:"I can do all this through him who gives me strength.", ref:"Philippians 4:13" },
  { text:"The Lord will fight for you; you need only to be still.", ref:"Exodus 14:14" },
  { text:"Trust in the Lord with all your heart and lean not on your own understanding.", ref:"Proverbs 3:5" },
  { text:"Cast all your anxiety on him because he cares for you.", ref:"1 Peter 5:7" },
  { text:"For I know the plans I have for you — plans to prosper you and not to harm you.", ref:"Jeremiah 29:11" },
  { text:"The name of the Lord is a fortified tower; the righteous run to it and are safe.", ref:"Proverbs 18:10" },
  { text:"Even youths grow tired and weary, but those who hope in the Lord will renew their strength.", ref:"Isaiah 40:31" },
  { text:"No weapon forged against you will prevail.", ref:"Isaiah 54:17" },
  { text:"Be alert and of sober mind. Your enemy prowls around like a roaring lion.", ref:"1 Peter 5:8" },
  { text:"Submit yourselves to God. Resist the devil, and he will flee from you.", ref:"James 4:7" },
  { text:"Let us not become weary in doing good, for at the proper time we will reap a harvest.", ref:"Galatians 6:9" },
  { text:"Greater is he that is in you, than he that is in the world.", ref:"1 John 4:4" },
  { text:"The steadfast love of the Lord never ceases; his mercies never come to an end.", ref:"Lamentations 3:22" },
  { text:"You are my hiding place; you will protect me from trouble.", ref:"Psalm 32:7" },
  { text:"God is our refuge and strength, an ever-present help in trouble.", ref:"Psalm 46:1" },
  { text:"The Lord your God is with you, the Mighty Warrior who saves.", ref:"Zephaniah 3:17" },
  { text:"Finally, be strong in the Lord and in his mighty power.", ref:"Ephesians 6:10" },
];

const INTENTION_PROMPTS = [
  "What is the one thing you want to carry into today with intention?",
  "What would it look like to show up as your best self today?",
  "What does today ask of you that yesterday didn't?",
  "Who needs you at your best today?",
  "What is one thing you want to do differently than yesterday?",
  "What would it mean to walk through today with God's strength instead of your own?",
  "What fear are you going to refuse to let run today?",
  "What is the most important thing — not the most urgent?",
];

function ArmorUpScreen({ C, font, onClose, faithLevel, onComplete }) {
  const [step, setStep] = useState(0); // 0=verse, 1=breathe, 2=intention, 3=done
  const [verse] = useState(() => ARMOR_VERSES[new Date().getDate() % ARMOR_VERSES.length]);
  const [intentionPrompt] = useState(() => INTENTION_PROMPTS[new Date().getDay() % INTENTION_PROMPTS.length]);
  const [intention, setIntention] = useState("");
  const [breathPhase, setBreathPhase] = useState("ready"); // ready|inhale|hold|exhale|done
  const [breathCount, setBreathCount] = useState(0);
  const [breathSeconds, setBreathSeconds] = useState(0);
  const timerRef = useRef(null);
  const TOTAL_CYCLES = 3;

  // Breathing sequence: 4 inhale, 4 hold, 4 exhale
  const BREATH_SEQ = [
    { phase:"inhale", duration:4, label:"Breathe in" },
    { phase:"hold",   duration:4, label:"Hold" },
    { phase:"exhale", duration:4, label:"Let go" },
  ];
  const [seqIdx, setSeqIdx] = useState(0);

  const startBreath = () => {
    setBreathPhase("inhale");
    setSeqIdx(0);
    setBreathSeconds(BREATH_SEQ[0].duration);
    setBreathCount(0);
  };

  useEffect(() => {
    if (breathPhase === "ready" || breathPhase === "done") return;
    timerRef.current = setInterval(() => {
      setBreathSeconds(s => {
        if (s <= 1) {
          clearInterval(timerRef.current);
          setSeqIdx(prev => {
            const next = prev + 1;
            if (next >= BREATH_SEQ.length) {
              setBreathCount(c => {
                const newCount = c + 1;
                if (newCount >= TOTAL_CYCLES) {
                  setBreathPhase("done");
                  return newCount;
                }
                setSeqIdx(0);
                setBreathSeconds(BREATH_SEQ[0].duration);
                setBreathPhase(BREATH_SEQ[0].phase);
                return newCount;
              });
              return 0;
            }
            setBreathSeconds(BREATH_SEQ[next].duration);
            setBreathPhase(BREATH_SEQ[next].phase);
            return next;
          });
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [breathPhase, seqIdx]);

  const circleScale = breathPhase === "inhale" ? 1.35 : breathPhase === "hold" ? 1.35 : breathPhase === "exhale" ? 0.85 : breathPhase === "done" ? 1.1 : 1;
  const currentSeq = BREATH_SEQ[seqIdx] || BREATH_SEQ[0];

  const handleDone = () => {
    if (intention.trim()) {
      try {
        const saved = JSON.parse(localStorage.getItem("selah_armor_log") || "[]");
        saved.unshift({ date: new Date().toISOString(), verse: verse.text, ref: verse.ref, intention: intention.trim() });
        localStorage.setItem("selah_armor_log", JSON.stringify(saved.slice(0, 60)));
      } catch {}
    }
    if (onComplete) onComplete();
    onClose();
  };

  return (
    <div style={{ minHeight:"100vh", background:C.bgPrimary, fontFamily:font,
      padding:"0", boxSizing:"border-box", display:"flex", flexDirection:"column" }}>

      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
        padding:"20px 20px 0" }}>
        <button onClick={onClose} style={{ background:"none", border:"none",
          cursor:"pointer", color:C.textMuted, fontSize:"20px" }}>←</button>
        <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
          <span style={{ color:C.amber, fontSize:"9px", letterSpacing:"3px", textTransform:"uppercase" }}>
            Armor Up
          </span>
        </div>
        <div style={{ display:"flex", gap:"6px" }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ width:"6px", height:"6px", borderRadius:"50%",
              background: step > i ? C.amber : step === i ? C.amber : C.bgCard,
              border: `1px solid ${step >= i ? C.amber : C.border}`,
              transition:"all 0.3s ease" }}/>
          ))}
        </div>
      </div>

      <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center",
        padding:"20px 24px 40px", maxWidth:"480px", margin:"0 auto", width:"100%", boxSizing:"border-box" }}>

        {/* ── STEP 0: VERSE ── */}
        {step === 0 && (
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:"32px", marginBottom:"24px" }}>⚔️</div>
            <p style={{ color:C.textMuted, fontSize:"9px", letterSpacing:"3px",
              textTransform:"uppercase", margin:"0 0 20px" }}>Today's Word</p>
            <p style={{ color:C.textPrimary, fontSize:"clamp(16px,4vw,20px)", fontFamily:font,
              lineHeight:"1.8", margin:"0 0 12px", fontWeight:"normal" }}>
              "{verse.text}"
            </p>
            <p style={{ color:C.amber, fontSize:"11px", letterSpacing:"1px", margin:"0 0 40px" }}>
              — {verse.ref}
            </p>
            <button onClick={() => setStep(1)} style={{
              background:C.amber, border:"none", borderRadius:"3px",
              color:"#fff", fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase",
              padding:"16px 48px", cursor:"pointer", fontFamily:font }}>
              Carry It
            </button>
          </div>
        )}

        {/* ── STEP 1: BREATHE ── */}
        {step === 1 && (
          <div style={{ textAlign:"center" }}>
            <p style={{ color:C.textMuted, fontSize:"9px", letterSpacing:"3px",
              textTransform:"uppercase", margin:"0 0 8px" }}>One Breath</p>
            <p style={{ color:C.textSoft, fontSize:"12px", fontStyle:"italic",
              margin:"0 0 40px", lineHeight:"1.8" }}>
              Three cycles. Clear your head before the day starts.
            </p>

            {breathPhase === "ready" && (
              <div>
                <div style={{ width:"120px", height:"120px", borderRadius:"50%",
                  border:`2px solid ${C.sage}44`, margin:"0 auto 40px",
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ color:C.textMuted, fontSize:"11px", letterSpacing:"1px" }}>ready</span>
                </div>
                <button onClick={startBreath} style={{
                  background:C.sage, border:"none", borderRadius:"3px",
                  color:"#fff", fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase",
                  padding:"16px 48px", cursor:"pointer", fontFamily:font }}>
                  Begin
                </button>
              </div>
            )}

            {breathPhase !== "ready" && breathPhase !== "done" && (
              <div>
                <div style={{
                  width:"120px", height:"120px", borderRadius:"50%",
                  border:`2px solid ${C.sage}`,
                  background:`${C.sage}18`,
                  margin:"0 auto 16px",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  transform:`scale(${circleScale})`,
                  transition:`transform ${currentSeq.duration}s ease-in-out` }}>
                  <span style={{ color:C.sage, fontSize:"13px", letterSpacing:"1px" }}>
                    {breathSeconds}
                  </span>
                </div>
                <p style={{ color:C.sage, fontSize:"12px", letterSpacing:"2px",
                  textTransform:"uppercase", margin:"0 0 8px" }}>{currentSeq.label}</p>
                <p style={{ color:C.textMuted, fontSize:"10px", margin:0 }}>
                  {breathCount + 1} of {TOTAL_CYCLES}
                </p>
              </div>
            )}

            {breathPhase === "done" && (
              <div>
                <div style={{ width:"120px", height:"120px", borderRadius:"50%",
                  border:`2px solid ${C.sage}`,
                  background:`${C.sage}18`,
                  margin:"0 auto 24px",
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ color:C.sage, fontSize:"18px" }}>✓</span>
                </div>
                <p style={{ color:C.textSoft, fontSize:"12px", fontStyle:"italic",
                  margin:"0 0 32px" }}>Grounded.</p>
                <button onClick={() => setStep(2)} style={{
                  background:C.sage, border:"none", borderRadius:"3px",
                  color:"#fff", fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase",
                  padding:"16px 48px", cursor:"pointer", fontFamily:font }}>
                  Continue
                </button>
              </div>
            )}

            <button onClick={() => setStep(2)} style={{
              background:"none", border:"none", cursor:"pointer",
              color:C.textMuted, fontSize:"11px", fontStyle:"italic",
              marginTop:"24px", display:"block", width:"100%" }}>
              Skip breathing
            </button>
          </div>
        )}

        {/* ── STEP 2: INTENTION ── */}
        {step === 2 && (
          <div>
            <div style={{ textAlign:"center", marginBottom:"28px" }}>
              <div style={{ fontSize:"28px", marginBottom:"16px" }}>🎯</div>
              <p style={{ color:C.textMuted, fontSize:"9px", letterSpacing:"3px",
                textTransform:"uppercase", margin:"0 0 12px" }}>Set Your Intention</p>
              <p style={{ color:C.textSoft, fontSize:"13px", fontStyle:"italic",
                lineHeight:"1.8", margin:0 }}>{intentionPrompt}</p>
            </div>
            <textarea
              value={intention}
              onChange={e => setIntention(e.target.value)}
              placeholder="Write your intention for today..."
              style={{ width:"100%", minHeight:"100px", background:C.bgCard,
                border:`1px solid ${C.border}`, borderRadius:"8px",
                padding:"14px", color:C.textPrimary, fontSize:"13px",
                fontFamily:font, fontStyle:"italic", lineHeight:"1.8",
                resize:"none", outline:"none", boxSizing:"border-box",
                marginBottom:"24px" }}
            />
            <button onClick={handleDone} style={{
              background:C.amber, border:"none", borderRadius:"3px",
              color:"#fff", fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase",
              padding:"16px", cursor:"pointer", fontFamily:font,
              width:"100%" }}>
              I'm Ready
            </button>
            <button onClick={handleDone} style={{
              background:"none", border:"none", cursor:"pointer",
              color:C.textMuted, fontSize:"11px", fontStyle:"italic",
              marginTop:"12px", display:"block", width:"100%", textAlign:"center" }}>
              Skip — just suit up
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════
// PRAYER WALL SCREEN
// ═══════════════════════════════════════════════════════
function PrayerWallScreen({ C, font, onClose, tier, isTrialActive, onUpgrade }) {
  const [prayers, setPrayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [text, setText] = useState("");
  const [flamed, setFlamed] = useState(() => {
    try { return JSON.parse(localStorage.getItem("selah_flamed") || "{}"); } catch { return {}; }
  });
  const [posted, setPosted] = useState(false);
  const [error, setError] = useState(null);
  const isFoundation = (TIER_LEVELS[tier]||0) >= TIER_LEVELS.foundation || isTrialActive;
  const MAX_CHARS = 120;

  const loadPrayers = async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/sync?action=prayer_get");
      const d = await r.json();
      setPrayers(d.prayers || []);
    } catch { setError("Couldn't reach the wall right now."); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadPrayers(); }, []);

  const postPrayer = async () => {
    if (!text.trim() || posting || posted) return;
    setPosting(true);
    try {
      const cleanText = text.trim().slice(0, MAX_CHARS).replace(/https?:\/\/\S+/gi, "").replace(/\S+@\S+\.\S+/g, "").trim();
      if (!cleanText) { setPosting(false); return; }
      const r = await fetch("/api/sync?action=prayer_post", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: cleanText })
      });
      const d = await r.json();
      if (d.ok) { setPosted(true); setText(""); await loadPrayers(); }
    } catch { setError("Couldn't post right now. Try again."); }
    finally { setPosting(false); }
  };

  const flamePrayer = async (id) => {
    if (flamed[id]) return;
    const newFlamed = { ...flamed, [id]: true };
    setFlamed(newFlamed);
    try { localStorage.setItem("selah_flamed", JSON.stringify(newFlamed)); } catch {}
    setPrayers(prev => prev.map(p => p.id === id ? { ...p, flames: (p.flames||0) + 1 } : p));
    try {
      await fetch("/api/sync?action=prayer_flame", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
    } catch {}
  };

  const timeAgo = (ts) => {
    const mins = Math.floor((Date.now() - ts) / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs/24)}d ago`;
  };

  return (
    <div style={{ minHeight:"100vh", background:C.bgPrimary, fontFamily:font, boxSizing:"border-box" }}>
      <div style={{ padding:"20px 20px 0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:C.textMuted, fontSize:"20px" }}>←</button>
        <span style={{ color:C.amber, fontSize:"9px", letterSpacing:"3px", textTransform:"uppercase" }}>Prayer Wall</span>
        <div style={{ width:"28px" }}/>
      </div>
      <div style={{ maxWidth:"480px", margin:"0 auto", padding:"20px 20px 120px", boxSizing:"border-box" }}>
        <div style={{ textAlign:"center", marginBottom:"28px" }}>
          <div style={{ fontSize:"36px", marginBottom:"12px" }}>🕯️</div>
          <h1 style={{ color:C.textPrimary, fontSize:"clamp(20px,5vw,26px)", fontWeight:"normal", margin:"0 0 8px" }}>The Wall</h1>
          <p style={{ color:C.textSoft, fontSize:"12px", fontStyle:"italic", lineHeight:"1.9", margin:0 }}>
            No names. No comments. Just prayers going up and people holding each other.
          </p>
        </div>

        {isFoundation ? (
          <div style={{ background:`${C.amber}08`, border:`1px solid ${C.amber}22`, borderRadius:"12px", padding:"16px 18px", marginBottom:"24px" }}>
            {posted ? (
              <div style={{ textAlign:"center", padding:"12px 0" }}>
                <span style={{ fontSize:"24px" }}>🕯️</span>
                <p style={{ color:C.amber, fontSize:"13px", fontStyle:"italic", lineHeight:"1.8", margin:"10px 0 0" }}>
                  Your prayer is on the wall. Others are holding it.
                </p>
              </div>
            ) : (
              <>
                <p style={{ color:C.amber, fontSize:"9px", letterSpacing:"2.5px", textTransform:"uppercase", margin:"0 0 10px" }}>Add Your Prayer</p>
                <textarea value={text} onChange={e => setText(e.target.value.slice(0, MAX_CHARS))}
                  placeholder="Pray for my marriage. Pray for my father. Pray for peace in my mind..."
                  style={{ width:"100%", minHeight:"80px", background:C.bgCard, border:`1px solid ${C.border}`,
                    borderRadius:"8px", padding:"12px", color:C.textPrimary, fontSize:"13px",
                    fontFamily:font, fontStyle:"italic", lineHeight:"1.8", resize:"none", outline:"none",
                    boxSizing:"border-box", marginBottom:"8px" }}/>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ color:C.textMuted, fontSize:"10px" }}>{text.length}/{MAX_CHARS}</span>
                  <button onClick={postPrayer} disabled={!text.trim() || posting}
                    style={{ background: text.trim() ? C.amber : C.bgCard,
                      border:`1px solid ${text.trim() ? C.amber : C.border}`,
                      borderRadius:"3px", color: text.trim() ? "#fff" : C.textMuted,
                      fontSize:"9px", letterSpacing:"2.5px", textTransform:"uppercase",
                      padding:"8px 20px", cursor: text.trim() ? "pointer" : "default",
                      fontFamily:font, transition:"all 0.2s ease" }}>
                    {posting ? "Posting..." : "Put It On The Wall"}
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div style={{ background:`${C.accent}08`, border:`1px solid ${C.accent}22`,
            borderRadius:"12px", padding:"16px 18px", marginBottom:"24px",
            display:"flex", alignItems:"center", gap:"12px" }}>
            <span style={{ fontSize:"18px" }}>🔒</span>
            <div style={{ flex:1 }}>
              <p style={{ color:C.textPrimary, fontSize:"13px", margin:"0 0 4px" }}>Post a prayer request</p>
              <p style={{ color:C.textSoft, fontSize:"11px", fontStyle:"italic", lineHeight:"1.7", margin:"0 0 8px" }}>
                Foundation+ to add your own request. Anyone can flame others.
              </p>
              <button onClick={onUpgrade} style={{ background:C.accent, border:"none", borderRadius:"3px",
                color:"#fff", fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase",
                padding:"7px 16px", cursor:"pointer", fontFamily:font }}>Unlock</button>
            </div>
          </div>
        )}

        {error && <p style={{ color:C.terra, fontSize:"12px", fontStyle:"italic", textAlign:"center", margin:"0 0 16px" }}>{error}</p>}

        {loading ? (
          <div style={{ textAlign:"center", padding:"40px 0" }}>
            <div style={{ display:"flex", justifyContent:"center", gap:"6px" }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ width:"6px", height:"6px", borderRadius:"50%", background:C.amber, opacity:0.4,
                  animation:"pulse 1.2s ease-in-out infinite", animationDelay:`${i*0.2}s` }}/>
              ))}
            </div>
          </div>
        ) : prayers.length === 0 ? (
          <div style={{ textAlign:"center", padding:"40px 0" }}>
            <p style={{ color:C.textMuted, fontSize:"13px", fontStyle:"italic", lineHeight:"1.9" }}>
              The wall is quiet right now.{isFoundation ? " Be the first to post." : ""}
            </p>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
            {prayers.map(p => (
              <div key={p.id} style={{ background:C.bgSecondary, borderRadius:"10px",
                padding:"16px 18px", border:`1px solid ${C.border}`,
                display:"flex", alignItems:"flex-start", gap:"14px" }}>
                <div style={{ flex:1 }}>
                  <p style={{ color:C.textPrimary, fontSize:"14px", fontStyle:"italic", lineHeight:"1.85", margin:"0 0 8px" }}>"{p.text}"</p>
                  <span style={{ color:C.textMuted, fontSize:"10px" }}>{timeAgo(p.ts)}</span>
                </div>
                <button onClick={() => flamePrayer(p.id)}
                  style={{ border:`1px solid ${flamed[p.id] ? C.amber+"44" : C.border}`,
                    borderRadius:"8px", padding:"8px 10px", cursor: flamed[p.id] ? "default" : "pointer",
                    display:"flex", flexDirection:"column", alignItems:"center", gap:"2px", flexShrink:0,
                    background: flamed[p.id] ? `${C.amber}12` : "none", transition:"all 0.2s ease" }}>
                  <span style={{ fontSize:"16px", opacity: flamed[p.id] ? 1 : 0.5 }}>🔥</span>
                  <span style={{ color: flamed[p.id] ? C.amber : C.textMuted, fontSize:"10px", fontWeight:"bold" }}>{p.flames||0}</span>
                </button>
              </div>
            ))}
          </div>
        )}

        <p style={{ color:C.textMuted, fontSize:"10px", fontStyle:"italic", textAlign:"center", marginTop:"24px", lineHeight:"1.8" }}>
          Prayers older than 7 days roll off the wall automatically.
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// BENCH HELPER + THE BENCH SCREEN
// ═══════════════════════════════════════════════════════
function BenchSaveButton({ label, text, type, C, font, onSave, category }) {
  const [saved, setSaved] = useState(false);
  const handleSave = () => {
    if (saved) return;
    onSave({ id: Date.now() + Math.random(), date: new Date().toISOString(), text, type, source: category });
    setSaved(true);
  };
  return (
    <button onClick={handleSave} style={{
      background: saved ? `${C.sage}15` : C.bgCard,
      border: `1px solid ${saved ? C.sage : C.border}`,
      borderRadius:"6px", padding:"10px 14px", cursor: saved ? "default" : "pointer",
      color: saved ? C.sage : C.textSoft, fontSize:"11px",
      fontFamily:font, textAlign:"left", width:"100%",
      display:"flex", alignItems:"center", gap:"8px", transition:"all 0.2s ease" }}>
      <span style={{ fontSize:"12px" }}>{saved ? "✓" : "+"}</span>
      <span>{saved ? "Saved to The Bench" : label}</span>
    </button>
  );
}

function TheBenchScreen({ C, font, setScreen, benchItems, setBenchItems }) {
  const [filter, setFilter] = useState("all");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const LABELS = { insight:"Insight", takeaway:"Takeaway", quote:"Quote", intention:"Intention", action:"One Small Move" };
  const COLORS = { insight:C.accent, takeaway:C.amber, quote:C.sage, intention:C.amber, action:C.terra };
  const filtered = filter === "all" ? benchItems : benchItems.filter(b => b.type === filter);

  const deleteItem = (id) => { setBenchItems(prev => prev.filter(b => b.id !== id)); setConfirmDelete(null); };

  return (
    <div style={{ minHeight:"100vh", background:C.bgPrimary, fontFamily:font, padding:"40px 20px 100px", boxSizing:"border-box" }}>
      <div style={{ maxWidth:"480px", margin:"0 auto" }}>
        <button onClick={()=>setScreen("home")} style={{ background:"none", border:"none", cursor:"pointer", color:C.textMuted, fontSize:"20px", marginBottom:"20px" }}>←</button>
        <Label text="The Bench" color={C.amber} font={font}/>
        <h1 style={{ color:C.textPrimary, fontSize:"clamp(22px,5vw,28px)", fontWeight:"normal", margin:"0 0 6px" }}>The Bench</h1>
        <p style={{ color:C.textSoft, fontSize:"13px", fontStyle:"italic", lineHeight:"1.8", margin:"0 0 24px" }}>
          The words that landed. Your best insights, saved and waiting.
        </p>
        {benchItems.length > 0 && (
          <div style={{ display:"flex", gap:"6px", flexWrap:"wrap", marginBottom:"24px" }}>
            {["all","insight","takeaway","intention"].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                background: filter===f ? C.amber : C.bgSecondary,
                border: `1px solid ${filter===f ? C.amber : C.border}`,
                borderRadius:"3px", padding:"6px 14px", cursor:"pointer",
                color: filter===f ? "#fff" : C.textMuted,
                fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", fontFamily:font }}>
                {f === "all" ? "All" : LABELS[f] || f}
              </button>
            ))}
          </div>
        )}
        {benchItems.length === 0 && (
          <div style={{ textAlign:"center", padding:"60px 20px" }}>
            <div style={{ fontSize:"36px", marginBottom:"16px" }}>🪑</div>
            <p style={{ color:C.textPrimary, fontSize:"15px", fontFamily:font, margin:"0 0 8px", fontWeight:"normal" }}>Nothing on The Bench yet</p>
            <p style={{ color:C.textSoft, fontSize:"12px", fontStyle:"italic", lineHeight:"1.8", margin:0 }}>
              After a reflection session, tap "+ Save Insight" or "+ Save Takeaway" to keep what matters.
            </p>
          </div>
        )}
        {filtered.length === 0 && benchItems.length > 0 && (
          <p style={{ color:C.textMuted, fontSize:"12px", fontStyle:"italic", textAlign:"center", padding:"32px 0" }}>
            No {LABELS[filter]?.toLowerCase()} items saved yet.
          </p>
        )}
        {filtered.map((item) => (
          <div key={item.id} style={{ background:C.bgSecondary, borderRadius:"10px",
            padding:"16px 18px", marginBottom:"12px",
            border:`1px solid ${(COLORS[item.type]||C.accent)}33`, position:"relative" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"8px" }}>
              <span style={{ color:COLORS[item.type]||C.accent, fontSize:"8px", letterSpacing:"2.5px", textTransform:"uppercase" }}>
                {LABELS[item.type] || item.type}
              </span>
              <span style={{ color:C.textMuted, fontSize:"10px", fontStyle:"italic" }}>
                {new Date(item.date).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}
              </span>
            </div>
            <p style={{ color:C.textPrimary, fontSize:"14px", fontStyle:"italic", lineHeight:"1.85", margin:"0 0 10px" }}>"{item.text}"</p>
            {item.source && <p style={{ color:C.textMuted, fontSize:"10px", margin:"0 0 10px" }}>— {item.source}</p>}
            {confirmDelete === item.id ? (
              <div style={{ display:"flex", gap:"8px", marginTop:"8px" }}>
                <button onClick={() => deleteItem(item.id)} style={{ background:C.terra, border:"none", borderRadius:"3px",
                  color:"#fff", fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase",
                  padding:"7px 14px", cursor:"pointer", fontFamily:font }}>Remove</button>
                <button onClick={() => setConfirmDelete(null)} style={{ background:"none", border:`1px solid ${C.border}`,
                  borderRadius:"3px", color:C.textMuted, fontSize:"9px", letterSpacing:"2px",
                  textTransform:"uppercase", padding:"7px 14px", cursor:"pointer", fontFamily:font }}>Cancel</button>
              </div>
            ) : (
              <button onClick={() => setConfirmDelete(item.id)} style={{ background:"none", border:"none",
                cursor:"pointer", color:C.textMuted, fontSize:"10px", fontStyle:"italic", padding:0 }}>Remove</button>
            )}
          </div>
        ))}
        {benchItems.length > 0 && (
          <p style={{ color:C.textMuted, fontSize:"10px", fontStyle:"italic", textAlign:"center", marginTop:"16px" }}>
            {benchItems.length} item{benchItems.length !== 1 ? "s" : ""} on The Bench
          </p>
        )}
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════
// LETTERS TO GOD SCREEN
// ═══════════════════════════════════════════════════════
function LettersToGodScreen({ C, font, setScreen, letters, setLetters, userName }) {
  const [view, setView] = useState("list"); // list | write | read
  const [draft, setDraft] = useState("");
  const [currentLetter, setCurrentLetter] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const textareaRef = useRef(null);

  const PROMPTS = [
    "Start with whatever is on your heart. There are no wrong words.",
    "What have you been carrying that you haven't said out loud yet?",
    "What do you wish God knew about where you are right now?",
    "What are you grateful for, even if it's just one small thing?",
    "What are you afraid of? What are you hoping for?",
    "What do you need today that only God can give?",
  ];
  const prompt = PROMPTS[new Date().getDay() % PROMPTS.length];

  const saveLetter = () => {
    if (!draft.trim()) return;
    const letter = {
      id: Date.now() + Math.random().toString(36).slice(2),
      date: new Date().toISOString(),
      text: draft.trim(),
    };
    setLetters(prev => [letter, ...prev]);
    setDraft("");
    setView("list");
  };

  const deleteLetter = (id) => {
    setLetters(prev => prev.filter(l => l.id !== id));
    setConfirmDelete(null);
    if (view === "read") setView("list");
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { weekday:"long", month:"long", day:"numeric", year:"numeric" });
  };

  const formatShort = (iso) => {
    const d = new Date(iso);
    const now = new Date();
    const diff = Math.floor((now - d) / 86400000);
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    if (diff < 7) return `${diff} days ago`;
    return d.toLocaleDateString("en-US", { month:"short", day:"numeric" });
  };

  const preview = (text) => text.length > 80 ? text.slice(0, 80) + "..." : text;

  // Write view
  if (view === "write") return (
    <div style={{ height:"100vh", background:C.bgPrimary, fontFamily:font,
      display:"flex", flexDirection:"column" }}>
      {/* Header */}
      <div style={{ padding:"16px 20px 12px", borderBottom:`1px solid ${C.border}`,
        display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
        <button onClick={()=>setView("list")} style={{ background:"none", border:"none",
          cursor:"pointer", color:C.textMuted, fontSize:"20px", padding:"4px 8px 4px 0" }}>←</button>
        <div style={{ textAlign:"center" }}>
          <p style={{ color:C.sage, fontSize:"10px", letterSpacing:"2.5px",
            textTransform:"uppercase", margin:0, fontStyle:"italic" }}>
            {new Date().toLocaleDateString("en-US", { month:"long", day:"numeric", year:"numeric" })}
          </p>
        </div>
        <button onClick={saveLetter} disabled={!draft.trim()} style={{
          background: draft.trim() ? C.sage : "transparent",
          border: `1px solid ${draft.trim() ? C.sage : C.border}`,
          borderRadius:"3px", color: draft.trim() ? "#fff" : C.textMuted,
          fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase",
          padding:"8px 14px", cursor: draft.trim() ? "pointer" : "default",
          fontFamily:font, fontStyle:"italic", transition:"all 0.2s ease" }}>
          Send
        </button>
      </div>

      {/* Salutation */}
      <div style={{ padding:"28px 24px 0", flexShrink:0 }}>
        <p style={{ color:C.textMuted, fontSize:"15px", fontStyle:"italic",
          fontFamily:font, margin:"0 0 16px" }}>Dear God,</p>
      </div>

      {/* Textarea */}
      <div style={{ flex:1, padding:"0 24px 24px", overflowY:"auto" }}>
        <textarea
          ref={textareaRef}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          placeholder={prompt}
          autoFocus
          style={{ width:"100%", height:"100%", minHeight:"300px",
            background:"none", border:"none", outline:"none",
            color:C.textPrimary, fontSize:"15px", fontStyle:"italic",
            fontFamily:font, lineHeight:"1.9", resize:"none",
            boxSizing:"border-box" }}/>
      </div>

      {/* Closing */}
      <div style={{ padding:"0 24px 40px", flexShrink:0 }}>
        <p style={{ color:C.textMuted, fontSize:"13px", fontStyle:"italic",
          fontFamily:font, margin:0 }}>
          — {userName || "Your child"}
        </p>
      </div>
    </div>
  );

  // Read view
  if (view === "read" && currentLetter) return (
    <div style={{ minHeight:"100vh", background:C.bgPrimary, fontFamily:font,
      padding:"0 0 80px", boxSizing:"border-box" }}>
      <div style={{ padding:"16px 20px 12px", borderBottom:`1px solid ${C.border}`,
        display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <button onClick={()=>setView("list")} style={{ background:"none", border:"none",
          cursor:"pointer", color:C.textMuted, fontSize:"20px", padding:"4px 8px 4px 0" }}>←</button>
        <p style={{ color:C.sage, fontSize:"10px", letterSpacing:"2px",
          textTransform:"uppercase", fontStyle:"italic", margin:0 }}>
          {formatDate(currentLetter.date)}
        </p>
        <button onClick={()=>setConfirmDelete(currentLetter.id)} style={{
          background:"none", border:"none", cursor:"pointer",
          color:C.textMuted, fontSize:"14px", padding:"4px" }}>🗑</button>
      </div>

      <div style={{ maxWidth:"480px", margin:"0 auto", padding:"32px 28px" }}>
        <p style={{ color:C.textMuted, fontSize:"15px", fontStyle:"italic",
          fontFamily:font, margin:"0 0 20px" }}>Dear God,</p>
        <p style={{ color:C.textPrimary, fontSize:"15px", fontStyle:"italic",
          lineHeight:"1.9", margin:"0 0 32px", whiteSpace:"pre-wrap" }}>
          {currentLetter.text}
        </p>
        <p style={{ color:C.textMuted, fontSize:"13px", fontStyle:"italic",
          fontFamily:font }}>— {userName || "Your child"}</p>
      </div>

      {confirmDelete === currentLetter.id && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)",
          display:"flex", alignItems:"center", justifyContent:"center", zIndex:200, padding:"24px" }}>
          <div style={{ background:C.bgPrimary, borderRadius:"12px", padding:"28px 24px",
            maxWidth:"320px", width:"100%", textAlign:"center", border:`1px solid ${C.border}` }}>
            <p style={{ color:C.textPrimary, fontSize:"15px", fontFamily:font,
              margin:"0 0 8px" }}>Delete this letter?</p>
            <p style={{ color:C.textMuted, fontSize:"12px", fontStyle:"italic",
              lineHeight:"1.7", margin:"0 0 20px" }}>This can't be undone.</p>
            <div style={{ display:"flex", gap:"10px" }}>
              <button onClick={()=>setConfirmDelete(null)} style={{
                flex:1, background:"none", border:`1px solid ${C.border}`,
                borderRadius:"3px", color:C.textMuted, fontSize:"10px",
                letterSpacing:"2px", textTransform:"uppercase", padding:"12px",
                cursor:"pointer", fontFamily:font }}>Keep It</button>
              <button onClick={()=>deleteLetter(currentLetter.id)} style={{
                flex:1, background:C.terra, border:"none",
                borderRadius:"3px", color:"#fff", fontSize:"10px",
                letterSpacing:"2px", textTransform:"uppercase", padding:"12px",
                cursor:"pointer", fontFamily:font }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // List view (default)
  return (
    <div style={{ minHeight:"100vh", background:C.bgPrimary, fontFamily:font,
      padding:"40px 20px 100px", boxSizing:"border-box" }}>
      <div style={{ maxWidth:"480px", margin:"0 auto" }}>
        <button onClick={()=>setScreen("home")} style={{ background:"none", border:"none",
          cursor:"pointer", color:C.textMuted, fontSize:"20px", marginBottom:"20px" }}>←</button>

        <Label text="Letters to God" color={C.sage} font={font}/>
        <h1 style={{ color:C.textPrimary, fontSize:"clamp(24px,6vw,32px)",
          fontWeight:"normal", margin:"0 0 6px" }}>
          Just you and God.
        </h1>
        <p style={{ color:C.textSoft, fontSize:"12px", fontStyle:"italic",
          lineHeight:"1.8", margin:"0 0 28px" }}>
          Private. No one reads these but you. Write whatever is on your heart — no structure, no prompt required. Just honest words addressed to God.
        </p>

        {/* Write button */}
        <button onClick={()=>setView("write")} style={{
          width:"100%", background:`${C.sage}12`,
          border:`1.5px solid ${C.sage}44`, borderRadius:"10px",
          padding:"18px 20px", cursor:"pointer", textAlign:"left",
          display:"flex", alignItems:"center", gap:"14px",
          marginBottom:"24px", transition:"all 0.2s ease",
          fontFamily:font }}
          onMouseEnter={e=>e.currentTarget.style.borderColor=C.sage+"88"}
          onMouseLeave={e=>e.currentTarget.style.borderColor=C.sage+"44"}>
          <div style={{ width:"40px", height:"40px", borderRadius:"50%",
            background:`${C.sage}18`, border:`1px solid ${C.sage}33`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:"18px", flexShrink:0 }}>✉️</div>
          <div>
            <p style={{ color:C.sage, fontSize:"11px", letterSpacing:"2px",
              textTransform:"uppercase", margin:"0 0 3px" }}>Write a Letter</p>
            <p style={{ color:C.textMuted, fontSize:"12px", fontStyle:"italic", margin:0 }}>
              {prompt}
            </p>
          </div>
        </button>

        {/* Letter count */}
        {letters.length > 0 && (
          <p style={{ color:C.textMuted, fontSize:"10px", letterSpacing:"2px",
            textTransform:"uppercase", fontStyle:"italic", margin:"0 0 12px" }}>
            {letters.length} letter{letters.length !== 1 ? "s" : ""} sent
          </p>
        )}

        {/* Letters list */}
        {letters.length === 0 ? (
          <div style={{ textAlign:"center", padding:"48px 0" }}>
            <p style={{ fontSize:"32px", margin:"0 0 12px" }}>✉️</p>
            <p style={{ color:C.textPrimary, fontSize:"15px", fontFamily:font,
              margin:"0 0 8px", fontWeight:"normal" }}>No letters yet</p>
            <p style={{ color:C.textMuted, fontSize:"12px", fontStyle:"italic",
              lineHeight:"1.8", margin:0 }}>
              Your first letter doesn't need to be perfect.<br/>Just start with "I'm struggling with..."
            </p>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
            {letters.map(letter => (
              <button key={letter.id} onClick={()=>{ setCurrentLetter(letter); setView("read"); }}
                style={{ background:C.bgSecondary, border:`1px solid ${C.border}`,
                  borderRadius:"10px", padding:"16px 18px", cursor:"pointer",
                  textAlign:"left", transition:"all 0.2s ease", width:"100%",
                  fontFamily:font }}
                onMouseEnter={e=>e.currentTarget.style.borderColor=C.sage+"44"}
                onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                <div style={{ display:"flex", justifyContent:"space-between",
                  alignItems:"center", marginBottom:"6px" }}>
                  <p style={{ color:C.sage, fontSize:"9px", letterSpacing:"2px",
                    textTransform:"uppercase", fontStyle:"italic", margin:0 }}>
                    {formatShort(letter.date)}
                  </p>
                  <span style={{ color:C.textMuted, fontSize:"12px" }}>›</span>
                </div>
                <p style={{ color:C.textSoft, fontSize:"13px", fontStyle:"italic",
                  lineHeight:"1.7", margin:0 }}>
                  "{preview(letter.text)}"
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════
// FEATURE GUIDE SCREEN
// ═══════════════════════════════════════════════════════
function FeatureGuideScreen({ C, font, setScreen }) {
  const features = [
    {
      icon:"◈", name:"Reflect", tier:"Foundation+",
      color:"#4A7FA5",
      what:"An AI-guided conversation session. Pick a topic or go free-form.",
      how:"Tap Reflect in Your Space. Choose a category or write your own prompt. Selah asks questions and helps you think clearly. Sessions end with an Insight, Takeaway, and One Small Move.",
      tip:"Use it when your thoughts are tangled and you can't see clearly.",
    },
    {
      icon:"🎙️", name:"Voice Reflection", tier:"All tiers",
      color:"#B06040",
      what:"Speak into Reflect instead of typing.",
      how:"Open a Reflect session. Tap the mic icon in the input bar. Speak — your words appear as text. Edit them, then send.",
      tip:"Best for when you have a lot on your mind and typing feels slow.",
    },
    {
      icon:"🪑", name:"The Bench", tier:"Foundation+",
      color:"#4A7FA5",
      what:"A saved collection of your best insights and takeaways.",
      how:"After any Reflect session, tap '+ Save Insight' or '+ Save Takeaway' on the summary screen. Access The Bench from Your Space anytime.",
      tip:"Use it as a personal wisdom archive — go back when you're struggling.",
    },
    {
      icon:"📜", name:"Biblical Reflections", tier:"Foundation+",
      color:"#C4923A",
      what:"40+ real Bible stories retold in plain modern language — not devotionals.",
      how:"Tap Biblical Reflections in Your Space. Pick a character. Each story has 5 chapters. Read one or all of them. Every story ends with a question aimed directly at your life.",
      tip:"Start with David or Job if life feels heavy. Start with Ruth if you need hope.",
    },
    {
      icon:"⚔️", name:"Armor Up", tier:"Foundation+",
      color:"#C4923A",
      what:"A 5-minute structured morning routine.",
      how:"Open from Your Space. Step 1: a strength verse. Step 2: 3 rounds of box breathing. Step 3: write your intention for the day.",
      tip:"Do it before you pick up your phone in the morning.",
    },
    {
      icon:"🌑", name:"Heavy Day", tier:"Foundation+",
      color:"#B06040",
      what:"A space built for lament — not forced positivity.",
      how:"Open from Your Space. Guided prompts help you process grief, anger, exhaustion, and doubt honestly.",
      tip:"Use it on the days where 'just be grateful' doesn't cut it.",
    },
    {
      icon:"🕯️", name:"Prayer Wall", tier:"All tiers (post = Foundation+)",
      color:"#C4923A",
      what:"An anonymous community prayer board.",
      how:"Tap The Prayer Wall on the home screen. Post a one-line prayer request. Flame others' prayers to say you're standing with them.",
      tip:"Even reading others' prayers shifts your perspective.",
    },
    {
      icon:"⚡", name:"Quick Check-in", tier:"Foundation+",
      color:"#C4923A",
      what:"A 2-minute mood log with a personal reflection.",
      how:"Tap Quick Check-in in Your Space. Rate your mood, pick a word, set an intention. Selah responds with something personal.",
      tip:"Do it daily — it feeds your Emotional Timeline and keeps your streak.",
    },
    {
      icon:"🫁", name:"Breathe", tier:"All tiers",
      color:"#4A8A6A",
      what:"Three clinically-grounded breathing techniques.",
      how:"Tap Breathe in Your Space. Choose Box Breathing, 4-7-8, or Physiological Sigh. Follow the animated guide.",
      tip:"Box Breathing before a Reflect session makes it noticeably deeper.",
    },
    {
      icon:"✍️", name:"Notebook", tier:"All tiers",
      color:"#B06040",
      what:"Private free-writing space.",
      how:"Tap Notebook in Your Space or the nav bar. Write anything. It stays on your device. Sign in with email to back it up.",
      tip:"Don't worry about format. Stream of consciousness is fine.",
    },
    {
      icon:"📊", name:"Progress", tier:"Foundation+",
      color:"#4A8A6A",
      what:"Your streak, mood chart, session history, and Emotional Timeline.",
      how:"Tap Progress in the nav bar. See your 60-day mood arc, session log, milestones. Growth Mirror (Growth+) shows who you were on day one vs now.",
      tip:"Check it on hard days — the arc is usually more hopeful than you feel.",
    },
    {
      icon:"🧩", name:"Assessments", tier:"Foundation+",
      color:"#5A7FA0",
      what:"Self-assessments for personality, ADHD, anxiety, trauma response, and more.",
      how:"Tap Assessments in Your Space. Pick one. Answer honestly. Get a detailed breakdown.",
      tip:"These aren't diagnoses. They're starting points for honest self-awareness.",
    },
    {
      icon:"📖", name:"Resources", tier:"Foundation+",
      color:"#C4923A",
      what:"Curated books and AI-matched recommendations.",
      how:"Tap Resources in Your Space. Foundation sees a curated book list. Growth+ gets AI-matched recommendations based on your sessions and mood history.",
      tip:"The AI recs update as your sessions evolve.",
    },
    {
      icon:"🔔", name:"Push Notifications", tier:"All tiers",
      color:"#4A7FA5",
      what:"Daily verse at 8am + streak reminder at 7pm.",
      how:"Go to Settings → toggle Notifications on. Allow browser permissions when prompted. Works after installing Selah to your home screen.",
      tip:"The 7pm streak notification keeps your daily habit alive.",
    },
    {
      icon:"☁️", name:"Cloud Sync", tier:"All tiers",
      color:"#4A8A6A",
      what:"Back up all your data so it's safe if you switch devices.",
      how:"Settings → Back Up Your Data → enter your email → verify the 6-digit code. All future data syncs automatically.",
      tip:"Do this on day one. Losing a streak because you cleared your browser feels terrible.",
    },
  ];

  const [expanded, setExpanded] = useState(null);

  return (
    <div style={{ minHeight:"100vh", background:C.bgPrimary, fontFamily:font,
      padding:"40px 20px 100px", boxSizing:"border-box" }}>
      <div style={{ maxWidth:"480px", margin:"0 auto" }}>
        <button onClick={()=>setScreen("settings")} style={{ background:"none", border:"none",
          cursor:"pointer", color:C.textMuted, fontSize:"20px", marginBottom:"20px" }}>←</button>
        <Label text="Everything in Selah" color={C.sage} font={font}/>
        <h1 style={{ color:C.textPrimary, fontSize:"clamp(22px,5vw,28px)",
          fontWeight:"normal", margin:"0 0 6px" }}>Feature Guide</h1>
        <p style={{ color:C.textSoft, fontSize:"12px", fontStyle:"italic",
          lineHeight:"1.8", margin:"0 0 24px" }}>
          Tap any feature to see what it does and how to use it.
        </p>

        {features.map((f) => {
          const isOpen = expanded === f.name;
          return (
            <div key={f.name} onClick={() => setExpanded(isOpen ? null : f.name)}
              style={{ background:C.bgSecondary, borderRadius:"10px",
                padding:"14px 16px", marginBottom:"8px",
                border:`1px solid ${isOpen ? f.color+"44" : C.border}`,
                cursor:"pointer", transition:"all 0.2s ease" }}>
              {/* Header row */}
              <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
                <div style={{ width:"36px", height:"36px", borderRadius:"50%",
                  background:`${f.color}18`, border:`1px solid ${f.color}33`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:"16px", flexShrink:0 }}>{f.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                    <p style={{ color:C.textPrimary, fontSize:"14px",
                      fontFamily:font, margin:0, fontWeight:"bold" }}>{f.name}</p>
                    <span style={{ color:f.color, fontSize:"8px", letterSpacing:"1.5px",
                      textTransform:"uppercase", background:`${f.color}12`,
                      padding:"2px 7px", borderRadius:"8px" }}>{f.tier}</span>
                  </div>
                  <p style={{ color:C.textMuted, fontSize:"11px", fontStyle:"italic",
                    margin:"2px 0 0", lineHeight:"1.5" }}>{f.what}</p>
                </div>
                <span style={{ color:C.textMuted, fontSize:"14px",
                  transform: isOpen ? "rotate(90deg)" : "rotate(0)",
                  transition:"transform 0.2s ease", flexShrink:0 }}>›</span>
              </div>

              {/* Expanded detail */}
              {isOpen && (
                <div style={{ marginTop:"14px", paddingTop:"14px",
                  borderTop:`1px solid ${C.border}` }}>
                  <div style={{ marginBottom:"10px" }}>
                    <p style={{ color:f.color, fontSize:"8px", letterSpacing:"2px",
                      textTransform:"uppercase", margin:"0 0 5px" }}>How to use it</p>
                    <p style={{ color:C.textSoft, fontSize:"12px", fontStyle:"italic",
                      lineHeight:"1.8", margin:0 }}>{f.how}</p>
                  </div>
                  <div style={{ background:`${f.color}08`, borderRadius:"8px",
                    padding:"10px 14px", border:`1px solid ${f.color}18` }}>
                    <p style={{ color:f.color, fontSize:"8px", letterSpacing:"2px",
                      textTransform:"uppercase", margin:"0 0 4px" }}>Pro tip</p>
                    <p style={{ color:C.textSoft, fontSize:"12px", fontStyle:"italic",
                      lineHeight:"1.7", margin:0 }}>{f.tip}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════
// SETTINGS SCREEN
// ═══════════════════════════════════════════════════════
function SettingsScreen({ C, font, setScreen, theme, setTheme, fontId, setFontId,
  faithLevel, setFaithLevel,
  sharingEnabled, setSharingEnabled, pushEnabled, setPushEnabled, onSubscription, onFounder, onReset,
  tone, setTone, quoteFreq, setQuoteFreq, tier, trialDaysLeft,
  userEmail, authToken, syncStatus, onLogin, onLogout, onSendCode, autoLoginEmail, onClearAutoLogin,
  seasonalMode, setSeasonalMode, currentSeason, onShowTour }) {

  const [tab, setTab] = useState("space");
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginCode, setLoginCode] = useState("");
  const [loginStep, setLoginStep] = useState("email"); // "email" or "code"
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Auto-open login flow after payment
  const [paymentLogin, setPaymentLogin] = useState(false);
  useEffect(() => {
    if (autoLoginEmail && !userEmail) {
      setLoginEmail(autoLoginEmail);
      setLoginStep("code");
      setShowLogin(true);
      setPaymentLogin(true);
      if (onClearAutoLogin) onClearAutoLogin();
    }
  }, [autoLoginEmail]);

  const Toggle=({v,onChange})=>(
    <div onClick={()=>onChange(!v)} style={{ width:"44px",height:"24px",borderRadius:"12px",
      background:v?C.accent:C.bgCard,border:`1px solid ${v?C.accent:C.border}`,
      position:"relative",cursor:"pointer",transition:"all 0.3s ease",flexShrink:0 }}>
      <div style={{ width:"18px",height:"18px",borderRadius:"50%",background:"#fff",
        position:"absolute",top:"2px",left:v?"22px":"2px",
        transition:"left 0.3s ease",boxShadow:"0 1px 4px rgba(0,0,0,0.15)" }}/>
    </div>
  );

  const TONES = [
    { id:"direct",    icon:"⚡", label:"Direct & Grounded",      ex:"What part of that hit you hardest?" },
    { id:"warm",      icon:"🌿", label:"Warm & Conversational",  ex:"Take your time — what's been weighing on you?" },
    { id:"structured",icon:"🧭", label:"Structured & Focused",   ex:"Let's work through this step by step." },
    { id:"spiritual", icon:"✦",  label:"Spiritually Grounded",   ex:"What would trusting God here look like?" },
    { id:"mentor",    icon:"🦅", label:"Mentor",                  ex:"You already know the answer. Say it out loud.", deep:true },
    { id:"coach",     icon:"🔥", label:"Coach",                   ex:"What's the one thing you're avoiding right now?", deep:true },
  ];

  const FAITH_LABELS = ["None","Minimal","Balanced","Faith-Forward","Scripture-Led"];
  const FAITH_DESC = [
    "Fully secular. No scripture or prayer references.",
    "Faith appears rarely — only when it naturally fits.",
    "Psychology + wisdom + faith woven in naturally.",
    "Faith present throughout. Daily scripture, prayer invitations.",
    "Fully scripture-led. Every session grounded in God's word.",
  ];

  const FREQ_OPTIONS = [
    { id:"hourly",  label:"Every hour", minTier:"deep" },
    { id:"twice",   label:"Twice daily (4am & 4pm)", minTier:"growth" },
    { id:"daily",   label:"Once a day (4am)", minTier:"foundation" },
    { id:"weekly",  label:"Weekly", minTier:"foundation" },
  ];

  const TABS = [
    { id:"space",   label:"Your Space" },
    { id:"tone",    label:"Tone" },
    { id:"faith",   label:"Faith" },
    { id:"display", label:"Display" },
  ];

  // ── LIVE PREVIEW ──
  const LivePreview = () => {
    const previewQuote = faithLevel >= 2
      ? { text: "Be still and know that I am God.", ref: "Psalm 46:10", color: C.sage }
      : { text: "The happiness of your life depends on the quality of your thoughts.", ref: "Marcus Aurelius", color: C.amber };
    const previewChat = {
      direct:     "What part of that hit you hardest?",
      warm:       "Take your time — what's been weighing on you?",
      structured: "Let's slow this down. Where do you want to start?",
      spiritual:  "What would trusting God look like here?",
    }[tone];

    return (
      <div style={{ background:C.bgCard,borderRadius:"10px",padding:"14px",
        border:`1px solid ${C.border}`,marginTop:"16px" }}>
        <p style={{ color:C.textMuted,fontSize:"9px",letterSpacing:"3px",
          textTransform:"uppercase",fontStyle:"italic",margin:"0 0 12px",
          fontFamily:font }}>Live Preview</p>
        {/* Mini home */}
        <div style={{ background:C.bgPrimary,borderRadius:"8px",padding:"12px",
          marginBottom:"8px",border:`1px solid ${C.border}` }}>
          <div style={{ display:"flex",alignItems:"center",gap:"6px",marginBottom:"8px" }}>
            <WaveLogo size={14} color={C.sage}/>
            <span style={{ color:C.textMuted,fontSize:"9px",fontStyle:"italic",
              fontFamily:font,letterSpacing:"1px" }}>Today's Word</span>
          </div>
          <p style={{ color:C.textPrimary,fontSize:"11px",fontStyle:"italic",
            fontFamily:font,lineHeight:"1.7",margin:"0 0 6px" }}>
            "{previewQuote.text}"
          </p>
          <div style={{ display:"flex",alignItems:"center",gap:"4px" }}>
            <div style={{ width:"10px",height:"1px",background:previewQuote.color,opacity:0.5 }}/>
            <span style={{ color:C.textSoft,fontSize:"9px",fontStyle:"italic",
              fontFamily:font }}>{previewQuote.ref}</span>
          </div>
        </div>
        {/* Mini chat bubble */}
        <div style={{ display:"flex",gap:"6px",alignItems:"flex-start" }}>
          <div style={{ width:"20px",height:"20px",borderRadius:"50%",
            background:`${C.sage}22`,border:`1px solid ${C.sage}44`,
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:"8px",flexShrink:0 }}>✦</div>
          <div style={{ background:C.bgSecondary,borderRadius:"10px 10px 10px 3px",
            padding:"8px 12px",maxWidth:"85%" }}>
            <p style={{ color:C.textPrimary,fontSize:"10px",fontStyle:"italic",
              fontFamily:font,lineHeight:"1.6",margin:0 }}>
              "{previewChat}"
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ minHeight:"100vh",background:C.bgPrimary,fontFamily:font,
      padding:"40px 20px 120px",boxSizing:"border-box" }}>
      <div style={{ maxWidth:"480px",margin:"0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom:"24px" }}>
          <Label text="Personalization" color={C.amber} font={font}/>
          <h1 style={{ color:C.textPrimary,fontSize:"clamp(20px,5vw,26px)",
            fontWeight:"normal",margin:0 }}>Make Selah yours.</h1>
          <p style={{ color:C.textSoft,fontSize:"12px",fontStyle:"italic",
            lineHeight:"1.8",margin:"6px 0 0" }}>
            Adjust the feel, tone, and faith depth until this space is yours.
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex",gap:"0",background:C.bgSecondary,
          borderRadius:"8px",padding:"4px",marginBottom:"24px",
          border:`1px solid ${C.border}` }}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{
              flex:1,background:tab===t.id?C.bgPrimary:"transparent",
              border:"none",borderRadius:"6px",padding:"9px 6px",cursor:"pointer",
              color:tab===t.id?C.textPrimary:C.textMuted,
              fontSize:"11px",fontStyle:"italic",fontFamily:font,
              transition:"all 0.2s ease",
              boxShadow:tab===t.id?"0 1px 4px rgba(0,0,0,0.08)":"none" }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── YOUR SPACE TAB ── */}
        {tab==="space"&&(
          <div>
            {(TIER_LEVELS[tier]||0) < TIER_LEVELS.foundation && !(trialDaysLeft > 0) ? (
              <div style={{ textAlign:"center", padding:"24px 0" }}>
                <div style={{ fontSize:"32px", marginBottom:"12px" }}>🎨</div>
                <p style={{ color:C.textPrimary, fontSize:"14px", fontFamily:font, margin:"0 0 8px" }}>Theme & Font Customization</p>
                <p style={{ color:C.textSoft, fontSize:"12px", fontStyle:"italic", lineHeight:"1.8", margin:"0 0 16px" }}>
                  Personalize your space with 6 color environments and 3 font styles. Available with Foundation plan and above.
                </p>
                <button onClick={onSubscription} style={{ background:C.accent, border:"none", borderRadius:"3px",
                  color:"#fff", fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase", padding:"14px 32px",
                  cursor:"pointer", fontFamily:font, fontStyle:"italic" }}>View Plans</button>
              </div>
            ) : (
            <div>
            <Label text="Color Environment" color={C.sage} font={font}/>
            <div style={{ display:"flex",flexDirection:"column",gap:"8px",marginBottom:"24px" }}>
              {CUSTOMIZABLE_THEMES.map(id=>{
                const t=THEMES[id];
                const sel=theme===id;
                return (
                  <button key={id} onClick={()=>setTheme(id)} style={{
                    background:sel?`${t.C.accent}15`:C.bgSecondary,
                    border:`2px solid ${sel?t.C.accent+"66":"transparent"}`,
                    borderRadius:"10px",padding:"14px 16px",cursor:"pointer",
                    display:"flex",alignItems:"center",gap:"14px",
                    transition:"all 0.2s ease",textAlign:"left" }}>
                    {/* Color swatches */}
                    <div style={{ display:"flex",gap:"3px",flexShrink:0 }}>
                      {[t.C.bgPrimary,t.C.accent,t.C.amber,t.C.terra].map((c,i)=>(
                        <div key={i} style={{ width:"18px",height:"32px",
                          borderRadius:i===0?"4px 0 0 4px":i===3?"0 4px 4px 0":"0",
                          background:c,border:"1px solid rgba(0,0,0,0.06)" }}/>
                      ))}
                    </div>
                    <div style={{ flex:1 }}>
                      <p style={{ color:sel?t.C.accent:C.textPrimary,fontSize:"13px",
                        fontWeight:sel?"bold":"normal",fontFamily:font,margin:"0 0 2px",
                        transition:"color 0.2s ease" }}>{t.name}</p>
                      <p style={{ color:C.textMuted,fontSize:"10px",fontStyle:"italic",margin:0 }}>
                        {id==="warm"?"Soft & grounded · warm sanctuary":
                         id==="masculine"?"Dark & warm · charcoal & gold":
                         id==="navy"?"Deep & focused · masculine strength":
                         id==="forest"?"Natural & earthy · calm clarity":
                         id==="charcoal"?"Dark mode · late night sessions":
                         id==="obsidian"?"Pure black & steel · OLED dark":
                         "Clean & minimal · crisp focus"}
                      </p>
                    </div>
                    {sel&&<div style={{ width:"20px",height:"20px",borderRadius:"50%",
                      background:t.C.accent,display:"flex",alignItems:"center",
                      justifyContent:"center",flexShrink:0 }}>
                      <span style={{ color:"#fff",fontSize:"10px" }}>✓</span>
                    </div>}
                  </button>
                );
              })}
            </div>
            <LivePreview/>
          </div>
            )}
          </div>
        )}

        {/* ── TONE TAB ── */}
        {tab==="tone"&&(
          <div>
            {(TIER_LEVELS[tier]||0) < TIER_LEVELS.growth ? (
              <div style={{ textAlign:"center", padding:"24px 0" }}>
                <div style={{ fontSize:"32px", marginBottom:"12px" }}>🎭</div>
                <p style={{ color:C.textPrimary, fontSize:"14px", fontFamily:font, margin:"0 0 8px" }}>Conversation Style</p>
                <p style={{ color:C.textSoft, fontSize:"12px", fontStyle:"italic", lineHeight:"1.8", margin:"0 0 16px" }}>
                  Choose how Selah speaks to you — direct, warm, structured, or spiritually grounded. Available with Growth plan and above.
                </p>
                <button onClick={onSubscription} style={{ background:C.accent, border:"none", borderRadius:"3px",
                  color:"#fff", fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase", padding:"14px 32px",
                  cursor:"pointer", fontFamily:font, fontStyle:"italic" }}>View Plans</button>
              </div>
            ) : (
            <div>
            <Label text="Conversation Style" color={C.amber} font={font}/>
            <p style={{ color:C.textSoft,fontSize:"12px",fontStyle:"italic",
              lineHeight:"1.8",margin:"0 0 16px" }}>
              How should Selah speak to you? This shapes every response.
            </p>
            <div style={{ display:"flex",flexDirection:"column",gap:"8px",marginBottom:"20px" }}>
              {TONES.filter(t=>!t.deep||(TIER_LEVELS[tier]||0)>=TIER_LEVELS.deep).map(t=>{
                const sel=tone===t.id;
                return (
                  <button key={t.id} onClick={()=>setTone(t.id)} style={{
                    background:sel?`${C.accent}15`:C.bgSecondary,
                    border:`1.5px solid ${sel?C.accent+"66":"transparent"}`,
                    borderRadius:"10px",padding:"14px 16px",cursor:"pointer",
                    textAlign:"left",transition:"all 0.2s ease" }}>
                    <div style={{ display:"flex",alignItems:"center",gap:"10px",marginBottom:"5px" }}>
                      <span style={{ fontSize:"16px" }}>{t.icon}</span>
                      <span style={{ color:sel?C.accent:C.textPrimary,fontSize:"13px",
                        fontWeight:sel?"bold":"normal",fontFamily:font,
                        transition:"color 0.2s ease" }}>{t.label}</span>
                      {sel&&<div style={{ width:"16px",height:"16px",borderRadius:"50%",
                        background:C.accent,display:"flex",alignItems:"center",
                        justifyContent:"center",marginLeft:"auto" }}>
                        <span style={{ color:"#fff",fontSize:"8px" }}>✓</span>
                      </div>}
                    </div>
                    <p style={{ color:C.textMuted,fontSize:"11px",fontStyle:"italic",
                      margin:0,lineHeight:"1.6" }}>"{t.ex}"</p>
                  </button>
                );
              })}
            </div>
            <LivePreview/>
          </div>
            )}
          </div>
        )}

        {/* ── FAITH TAB ── */}
        {tab==="faith"&&(
          <div>
            {(TIER_LEVELS[tier]||0) < TIER_LEVELS.growth ? (
              <div style={{ textAlign:"center", padding:"24px 0" }}>
                <div style={{ fontSize:"32px", marginBottom:"12px" }}>✝️</div>
                <p style={{ color:C.textPrimary, fontSize:"14px", fontFamily:font, margin:"0 0 8px" }}>Faith Integration</p>
                <p style={{ color:C.textSoft, fontSize:"12px", fontStyle:"italic", lineHeight:"1.8", margin:"0 0 16px" }}>
                  Control how faith is woven into your Selah experience — from secular to scripture-led. Available with Growth plan and above.
                </p>
                <button onClick={onSubscription} style={{ background:C.accent, border:"none", borderRadius:"3px",
                  color:"#fff", fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase", padding:"14px 32px",
                  cursor:"pointer", fontFamily:font, fontStyle:"italic" }}>View Plans</button>
              </div>
            ) : (
            <div>
            <Label text="Faith Integration" color={C.sage} font={font}/>
            <p style={{ color:C.textSoft,fontSize:"12px",fontStyle:"italic",
              lineHeight:"1.8",margin:"0 0 20px" }}>
              Selah never replaces scripture, prayer, or relationship with God.
              This controls how faith is woven into your experience.
            </p>
            <div style={{ background:C.bgSecondary,borderRadius:"10px",padding:"20px",
              marginBottom:"16px",border:`1px solid ${C.border}` }}>
              <div style={{ display:"flex",justifyContent:"space-between",
                alignItems:"center",marginBottom:"6px" }}>
                <span style={{ color:C.textMuted,fontSize:"11px",fontStyle:"italic" }}>None</span>
                <span style={{ color:C.sage,fontSize:"13px",fontStyle:"italic",
                  fontWeight:"bold",fontFamily:font }}>{FAITH_LABELS[faithLevel]}</span>
                <span style={{ color:C.textMuted,fontSize:"11px",fontStyle:"italic" }}>Scripture-Led</span>
              </div>
              <input type="range" min={0} max={4} value={faithLevel}
                onChange={e=>setFaithLevel(parseInt(e.target.value))}
                style={{ width:"100%",accentColor:C.sage,cursor:"pointer",margin:"8px 0" }}/>
              {/* Level markers */}
              <div style={{ display:"flex",justifyContent:"space-between",marginTop:"4px" }}>
                {[0,1,2,3,4].map(i=>(
                  <div key={i} onClick={()=>setFaithLevel(i)}
                    style={{ width:"6px",height:"6px",borderRadius:"50%",cursor:"pointer",
                      background:i<=faithLevel?C.sage:C.bgCard,
                      border:`1px solid ${i<=faithLevel?C.sage:C.border}`,
                      transition:"all 0.3s ease" }}/>
                ))}
              </div>
            </div>
            {/* Description card */}
            <div style={{ background:`${C.sage}12`,border:`1px solid ${C.sage}33`,
              borderRadius:"8px",padding:"14px 16px",marginBottom:"16px" }}>
              <p style={{ color:C.sage,fontSize:"9px",letterSpacing:"2.5px",
                textTransform:"uppercase",fontStyle:"italic",margin:"0 0 6px" }}>
                Level {faithLevel} — {FAITH_LABELS[faithLevel]}
              </p>
              <p style={{ color:C.textSoft,fontSize:"12px",fontStyle:"italic",
                lineHeight:"1.8",margin:0 }}>
                {FAITH_DESC[faithLevel]}
              </p>
            </div>
            <div style={{ background:`${C.amber}12`,border:`1px solid ${C.amber}22`,
              borderRadius:"8px",padding:"12px 16px",marginBottom:"16px" }}>
              <p style={{ color:C.textMuted,fontSize:"11px",fontStyle:"italic",
                lineHeight:"1.8",margin:0 }}>
                ✦ Selah always points upward — never claims to speak for God.
                Faith here is a lens, not a replacement for prayer or Scripture.
              </p>
            </div>
            <LivePreview/>

            {/* Seasonal Mode toggle */}
            <div style={{ background:C.bgSecondary, borderRadius:"10px", padding:"16px 18px",
              marginTop:"16px", border:`1px solid ${C.border}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"6px" }}>
                <div>
                  <p style={{ color:C.textPrimary, fontSize:"13px", fontFamily:font, margin:0 }}>
                    {currentSeason?.icon || "🌿"} Seasonal Mode
                  </p>
                  <p style={{ color:C.textMuted, fontSize:"10px", fontStyle:"italic", margin:"3px 0 0" }}>
                    {currentSeason && currentSeason.id !== "ordinary"
                      ? `Currently ${currentSeason.name} — ${currentSeason.daysLeft != null ? `${currentSeason.daysLeft} days left` : "active"}`
                      : "No active season right now"}
                  </p>
                </div>
                <Toggle v={seasonalMode} onChange={setSeasonalMode}/>
              </div>
              <p style={{ color:C.textSoft, fontSize:"11px", fontStyle:"italic",
                lineHeight:"1.8", margin:0 }}>
                Tunes reflections, anchor quotes, and app color to the liturgical season. Foundation+.
              </p>
            </div>
          </div>
            )}
          </div>
        )}

        {/* ── DISPLAY TAB ── */}
        {tab==="display"&&(
          <div>
            <Label text="Font Style" color={C.amber} font={font}/>
            {(TIER_LEVELS[tier]||0) < TIER_LEVELS.foundation && !(trialDaysLeft > 0) ? (
              <div style={{ background:`${C.amber}08`, border:`1px solid ${C.amber}33`,
                borderRadius:"8px", padding:"14px 16px", marginBottom:"24px",
                display:"flex", alignItems:"center", gap:"10px" }}>
                <span style={{ fontSize:"14px" }}>🔒</span>
                <p style={{ color:C.textSoft, fontSize:"11px", fontStyle:"italic",
                  lineHeight:"1.7", margin:0 }}>
                  Font customization is available with <span style={{ color:C.amber }}>Foundation plan and above</span>.
                </p>
              </div>
            ) : (
            <div style={{ display:"flex",gap:"8px",marginBottom:"24px" }}>
              {Object.entries(FONTS).map(([id,f])=>{
                const sel=fontId===id;
                return (
                  <button key={id} onClick={()=>setFontId(id)} style={{
                    flex:1,background:sel?`${C.accent}18`:C.bgSecondary,
                    border:`1.5px solid ${sel?C.accent:"transparent"}`,
                    borderRadius:"8px",padding:"14px 10px",cursor:"pointer",
                    textAlign:"center",transition:"all 0.2s ease" }}>
                    <p style={{ fontFamily:f,color:sel?C.accent:C.textSoft,
                      fontSize:"18px",margin:"0 0 4px",lineHeight:1 }}>Aa</p>
                    <p style={{ color:sel?C.accent:C.textMuted,fontSize:"9px",
                      letterSpacing:"1.5px",textTransform:"uppercase",
                      fontFamily:font,margin:0 }}>{id}</p>
                  </button>
                );
              })}
            </div>
            )}

            <Label text="Anchor Frequency" color={C.sage} font={font}/>
            {tier === "free" && !trialDaysLeft ? (
              <div style={{ background:`${C.amber}08`, border:`1px solid ${C.amber}33`,
                borderRadius:"8px", padding:"14px 16px", marginBottom:"24px",
                display:"flex", alignItems:"center", gap:"10px" }}>
                <span style={{ fontSize:"14px" }}>🔒</span>
                <p style={{ color:C.textSoft, fontSize:"11px", fontStyle:"italic",
                  lineHeight:"1.7", margin:0 }}>
                  Daily Anchor is not available on the free plan. <span style={{ color:C.amber }}>Upgrade to Foundation</span> to unlock AI-powered daily anchors.
                </p>
              </div>
            ) : trialDaysLeft ? (
              <div style={{ background:`${C.sage}08`, border:`1px solid ${C.sage}33`,
                borderRadius:"8px", padding:"14px 16px", marginBottom:"24px",
                display:"flex", alignItems:"center", gap:"10px" }}>
                <span style={{ fontSize:"14px" }}>🌿</span>
                <p style={{ color:C.textSoft, fontSize:"11px", fontStyle:"italic",
                  lineHeight:"1.7", margin:0 }}>
                  You have <span style={{ color:C.sage }}>once-daily Anchor</span> during your free trial. Upgrade to Foundation+ for daily, twice-daily, or hourly.
                </p>
              </div>
            ) : (
            <div style={{ display:"flex",flexDirection:"column",gap:"6px",marginBottom:"24px" }}>
              {FREQ_OPTIONS.filter(o => (TIER_LEVELS[tier]||0) >= (TIER_LEVELS[o.minTier]||0)).map(o=>{
                const sel=quoteFreq===o.id;
                return (
                  <button key={o.id} onClick={()=>setQuoteFreq(o.id)} style={{
                    background:sel?`${C.accent}15`:C.bgSecondary,
                    border:`1.5px solid ${sel?C.accent+"55":"transparent"}`,
                    borderRadius:"8px",padding:"12px 16px",cursor:"pointer",
                    textAlign:"left",display:"flex",alignItems:"center",
                    justifyContent:"space-between",transition:"all 0.2s ease" }}>
                    <span style={{ color:sel?C.accent:C.textSoft,fontSize:"13px",
                      fontStyle:"italic",fontFamily:font }}>{o.label}</span>
                    {sel&&<div style={{ width:"16px",height:"16px",borderRadius:"50%",
                      background:C.accent,display:"flex",alignItems:"center",
                      justifyContent:"center" }}>
                      <span style={{ color:"#fff",fontSize:"8px" }}>✓</span>
                    </div>}
                  </button>
                );
              })}
            </div>
            )}

            <Label text="Other" color={C.terra} font={font}/>
            <div style={{ background:C.bgSecondary,borderRadius:"10px",
              overflow:"hidden",border:`1px solid ${C.border}` }}>
              {[
                {icon:"↗️",label:"Sharing",sub:"Allow sharing session insights & quotes",
                  right:<Toggle v={sharingEnabled} onChange={setSharingEnabled}/>},
              ].map((row,i,arr)=>(
                <div key={row.label} style={{ display:"flex",alignItems:"center",gap:"14px",
                  padding:"16px 18px",
                  borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none" }}>
                  <span style={{ fontSize:"18px",flexShrink:0 }}>{row.icon}</span>
                  <div style={{ flex:1 }}>
                    <p style={{ color:C.textPrimary,fontSize:"13px",fontFamily:font,
                      margin:"0 0 2px" }}>{row.label}</p>
                    <p style={{ color:C.textMuted,fontSize:"11px",fontStyle:"italic",margin:0 }}>
                      {row.sub}
                    </p>
                  </div>
                  {row.right}
                </div>
              ))}
            </div>

            <div style={{ marginTop:"16px" }}>
              <button onClick={()=>setScreen("feedback")} style={{
                width:"100%", background:`${C.accent}12`, border:`1px solid ${C.accent}33`,
                borderRadius:"10px", padding:"16px 18px", cursor:"pointer",
                display:"flex", alignItems:"center", gap:"14px",
                transition:"all 0.2s ease" }}
                onMouseEnter={e=>e.currentTarget.style.borderColor=C.accent}
                onMouseLeave={e=>e.currentTarget.style.borderColor=C.accent+"33"}>
                <span style={{ fontSize:"18px" }}>💬</span>
                <div style={{ flex:1, textAlign:"left" }}>
                  <p style={{ color:C.textPrimary, fontSize:"13px", fontFamily:font,
                    margin:"0 0 2px" }}>Share Feedback</p>
                  <p style={{ color:C.textMuted, fontSize:"11px", fontStyle:"italic", margin:0 }}>
                    Help shape what Selah becomes — I read every one
                  </p>
                </div>
                <span style={{ color:C.accent, fontSize:"16px" }}>›</span>
              </button>
            </div>
            <LivePreview/>
          </div>
        )}

        {/* Account section */}
        <div style={{ marginTop:"28px" }}>

          {/* Account / Login */}
          <div style={{ background:C.bgSecondary, borderRadius:"10px", overflow:"hidden",
            border:`1px solid ${C.border}`, marginBottom:"16px" }}>
            {userEmail ? (
              <div style={{ padding:"18px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"12px" }}>
                  <div style={{ width:"36px", height:"36px", borderRadius:"50%",
                    background:`${C.sage}20`, border:`1px solid ${C.sage}44`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:"16px" }}>✦</div>
                  <div>
                    <p style={{ color:C.textPrimary, fontSize:"13px", fontFamily:font,
                      margin:"0 0 2px" }}>{userEmail}</p>
                    <p style={{ color:C.sage, fontSize:"10px", fontStyle:"italic", margin:0 }}>
                      {syncStatus==="synced"?"✓ Data backed up":"☁ Cloud backup active"}
                    </p>
                  </div>
                </div>
                <button onClick={onLogout} style={{ background:"none", border:`1px solid ${C.border}`,
                  borderRadius:"3px", color:C.textMuted, fontSize:"9px", letterSpacing:"2px",
                  textTransform:"uppercase", padding:"8px 16px", cursor:"pointer",
                  fontFamily:font, fontStyle:"italic" }}>
                  Sign Out
                </button>
              </div>
            ) : (
              <div style={{ padding:"18px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"10px" }}>
                  <span style={{ fontSize:"18px" }}>☁️</span>
                  <div>
                    <p style={{ color:C.textPrimary, fontSize:"13px", fontFamily:font,
                      margin:"0 0 2px" }}>Back Up Your Data</p>
                    <p style={{ color:C.textMuted, fontSize:"11px", fontStyle:"italic", margin:0 }}>
                      Sign in to sync across devices & protect your data
                    </p>
                  </div>
                </div>
                {!showLogin ? (
                  <button onClick={()=>setShowLogin(true)} style={{ width:"100%",
                    background:C.sage, border:"none", borderRadius:"3px", color:"#fff",
                    fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase",
                    padding:"14px", cursor:"pointer", fontFamily:font, fontStyle:"italic" }}>
                    Sign In with Email
                  </button>
                ) : loginStep === "email" ? (
                  <div>
                    <input type="email" value={loginEmail} onChange={e=>setLoginEmail(e.target.value)}
                      placeholder="your@email.com"
                      style={{ width:"100%", background:C.bgPrimary, border:`1px solid ${C.border}`,
                        borderRadius:"8px", padding:"14px 16px", fontSize:"14px", color:C.textPrimary,
                        fontFamily:font, fontStyle:"italic", boxSizing:"border-box",
                        marginBottom:"10px", outline:"none" }}/>
                    {loginError && <p style={{ color:C.terra, fontSize:"11px", fontStyle:"italic",
                      margin:"0 0 10px" }}>{loginError}</p>}
                    <div style={{ display:"flex", gap:"8px" }}>
                      <button onClick={()=>{setShowLogin(false);setLoginError("");}} style={{
                        flex:1, background:"none", border:`1px solid ${C.border}`,
                        borderRadius:"3px", color:C.textMuted, fontSize:"10px", letterSpacing:"2px",
                        textTransform:"uppercase", padding:"12px", cursor:"pointer",
                        fontFamily:font, fontStyle:"italic" }}>Cancel</button>
                      <button onClick={async()=>{
                        if(!loginEmail.includes("@")){setLoginError("Enter a valid email");return;}
                        setLoginLoading(true);setLoginError("");
                        const r=await onSendCode(loginEmail);
                        setLoginLoading(false);
                        if(r.success){setLoginStep("code");}
                        else{setLoginError(r.error||"Failed to send code");}
                      }} disabled={loginLoading} style={{
                        flex:2, background:loginLoading?C.bgCard:C.sage, border:"none",
                        borderRadius:"3px", color:"#fff", fontSize:"10px", letterSpacing:"3px",
                        textTransform:"uppercase", padding:"12px", cursor:loginLoading?"default":"pointer",
                        fontFamily:font, fontStyle:"italic" }}>
                        {loginLoading?"Sending...":"Send Code"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {paymentLogin && !userEmail && (
                      <div style={{ background:`${C.sage}12`, border:`1px solid ${C.sage}33`,
                        borderRadius:"8px", padding:"12px 14px", marginBottom:"12px" }}>
                        <p style={{ color:C.sage, fontSize:"11px", fontWeight:"bold",
                          margin:"0 0 4px" }}>Payment confirmed</p>
                        <p style={{ color:C.textSoft, fontSize:"11px", fontStyle:"italic",
                          lineHeight:"1.7", margin:0 }}>
                          One last step — enter the code we just sent to secure your account and sync your data.
                        </p>
                      </div>
                    )}
                    <p style={{ color:C.textSoft, fontSize:"12px", fontStyle:"italic",
                      margin:"0 0 10px", lineHeight:"1.7" }}>
                      Enter the 6-digit code sent to <strong>{loginEmail}</strong>
                    </p>
                    <input type="text" value={loginCode} onChange={e=>setLoginCode(e.target.value.replace(/\D/g,"").slice(0,6))}
                      placeholder="000000" maxLength={6}
                      style={{ width:"100%", background:C.bgPrimary, border:`1px solid ${C.border}`,
                        borderRadius:"8px", padding:"14px 16px", fontSize:"24px", color:C.textPrimary,
                        fontFamily:font, textAlign:"center", letterSpacing:"8px",
                        boxSizing:"border-box", marginBottom:"10px", outline:"none" }}/>
                    {loginError && <p style={{ color:C.terra, fontSize:"11px", fontStyle:"italic",
                      margin:"0 0 10px" }}>{loginError}</p>}
                    <div style={{ display:"flex", gap:"8px" }}>
                      <button onClick={()=>{setLoginStep("email");setLoginCode("");setLoginError("");}} style={{
                        flex:1, background:"none", border:`1px solid ${C.border}`,
                        borderRadius:"3px", color:C.textMuted, fontSize:"10px", letterSpacing:"2px",
                        textTransform:"uppercase", padding:"12px", cursor:"pointer",
                        fontFamily:font, }}>Back</button>
                      <button onClick={async()=>{
                        if(loginCode.length!==6){setLoginError("Enter the 6-digit code");return;}
                        setLoginLoading(true);setLoginError("");
                        const r=await onLogin(loginEmail,loginCode);
                        setLoginLoading(false);
                        if(r.success){setShowLogin(false);setLoginStep("email");setLoginEmail("");setLoginCode("");}
                        else{setLoginError(r.error||"Invalid code. Try again.");}
                      }} disabled={loginLoading} style={{
                        flex:2, background:loginLoading?C.bgCard:C.sage, border:"none",
                        borderRadius:"3px", color:"#fff", fontSize:"10px", letterSpacing:"3px",
                        textTransform:"uppercase", padding:"12px", cursor:loginLoading?"default":"pointer",
                        fontFamily:font, fontStyle:"italic" }}>
                        {loginLoading?"Verifying...":"Verify & Sign In"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center",
            gap:"8px", marginBottom:"16px", padding:"12px",
            background:`${C.sage}10`, borderRadius:"8px", border:`1px solid ${C.sage}22` }}>
            <span style={{ color:C.sage, fontSize:"14px" }}>✓</span>
            <p style={{ color:C.sage, fontSize:"11px", fontStyle:"italic",
              letterSpacing:"1px", margin:0 }}>
              Your preferences auto-save as you change them
            </p>
          </div>

          {/* Account links */}
          <div style={{ background:C.bgSecondary,borderRadius:"10px",
            overflow:"hidden",border:`1px solid ${C.border}`,marginTop:"16px" }}>
            {[
              {icon:"💳",label:"Subscription",sub:tier==="free"?(trialDaysLeft>0?`Free trial — ${trialDaysLeft} day${trialDaysLeft===1?"":"s"} left`:"Trial expired — upgrade now"):`Current: ${tier.charAt(0).toUpperCase()+tier.slice(1)}`,onPress:onSubscription},
              ...(tier!=="free"&&userEmail?[{icon:"🔧",label:"Manage Subscription",sub:"Update payment, change plan, or cancel",onPress:async()=>{
                try{
                  const r=await fetch("/api/stripe-portal",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:userEmail})});
                  const d=await r.json();
                  if(d.url) window.open(d.url,"_blank");
                  else alert(d.error||"Could not open billing portal. Make sure your login email matches the email used at checkout.");
                }catch{alert("Connection error. Please try again.");}
              }}]:[]),
              {icon:"💬",label:"Share Feedback",sub:"Rate your experience — I read every one",onPress:()=>setScreen("feedback")},
              {icon:"✦",label:"Founder's Note",sub:"A message from ZS",onPress:onFounder},
              {icon:"🔒",label:"Privacy",sub:"Your data is encrypted & never sold",onPress:()=>setShowPrivacy(true)},
              {icon:"⚖️",label:"Terms & Disclaimer",sub:"Legal notice & liability waiver",onPress:()=>setShowTerms(true)},
            ].map((row,i,arr)=>(
              <div key={row.label} onClick={row.onPress}
                style={{ display:"flex",alignItems:"center",gap:"14px",
                  padding:"16px 18px",
                  borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none",
                  cursor:row.onPress?"pointer":"default",transition:"background 0.15s ease" }}
                onMouseEnter={e=>{if(row.onPress)e.currentTarget.style.background=C.bgCard;}}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <span style={{ fontSize:"18px",flexShrink:0 }}>{row.icon}</span>
                <div style={{ flex:1 }}>
                  <p style={{ color:C.textPrimary,fontSize:"13px",fontFamily:font,
                    margin:"0 0 2px" }}>{row.label}</p>
                  <p style={{ color:C.textMuted,fontSize:"11px",fontStyle:"italic",margin:0 }}>
                    {row.sub}
                  </p>
                </div>
                <span style={{ color:C.textMuted,fontSize:"16px" }}>›</span>
              </div>
            ))}
          </div>

          {/* Push Notifications */}
          <div style={{ background:C.bgSecondary,borderRadius:"10px",
            overflow:"hidden",border:`1px solid ${C.border}`,marginTop:"12px" }}>
            <div style={{ display:"flex",alignItems:"center",gap:"14px",padding:"16px 18px" }}>
              <span style={{ fontSize:"18px",flexShrink:0 }}>🔔</span>
              <div style={{ flex:1 }}>
                <p style={{ color:C.textPrimary,fontSize:"13px",fontFamily:font,
                  margin:"0 0 2px" }}>Push Notifications</p>
                <p style={{ color:C.textMuted,fontSize:"11px",fontStyle:"italic",margin:0 }}>
                  Verse of the day · 8am daily
                </p>
              </div>
              <Toggle v={pushEnabled} onChange={async(val)=>{
                if(val){
                  try{
                    const perm=await Notification.requestPermission();
                    if(perm==="granted"){
                      const reg = await navigator.serviceWorker.ready;
                      const subscription = await reg.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
                      });
                      await fetch("/api/push-subscribe", {
                        method: "POST",
                        headers: {"Content-Type":"application/json"},
                        body: JSON.stringify({ subscription, userId: localStorage.getItem("selah_user_id")||"anon", email: userEmail||"" })
                      });
                      setPushEnabled(true);
                    }
                  }catch(e){ console.error("Push subscribe error:", e); }
                } else {
                  try {
                    const reg = await navigator.serviceWorker.ready;
                    const subscription = await reg.pushManager.getSubscription();
                    if (subscription) {
                      await fetch("/api/push-subscribe", {
                        method: "DELETE",
                        headers: {"Content-Type":"application/json"},
                        body: JSON.stringify({ endpoint: subscription.endpoint })
                      });
                      await subscription.unsubscribe();
                    }
                  } catch(e) { console.error("Push unsubscribe error:", e); }
                  setPushEnabled(false);
                }
              }}/>
            </div>
          </div>

          <div style={{ textAlign:"center",marginTop:"24px" }}>
            {/* Tour + Guide buttons */}
            <div style={{ display:"flex", gap:"8px", justifyContent:"center", marginBottom:"12px" }}>
              <button onClick={onShowTour} style={{
                background:"none", border:`1px solid ${C.accent}33`,
                borderRadius:"3px", color:C.accent, fontSize:"9px",
                letterSpacing:"2px", textTransform:"uppercase",
                padding:"10px 16px", cursor:"pointer", fontFamily:font,
                fontStyle:"italic", transition:"all 0.2s ease" }}
                onMouseEnter={e=>e.currentTarget.style.borderColor=C.accent}
                onMouseLeave={e=>e.currentTarget.style.borderColor=C.accent+"33"}>
                Replay Tour
              </button>
              <button onClick={()=>setScreen("featureguide")} style={{
                background:"none", border:`1px solid ${C.sage}33`,
                borderRadius:"3px", color:C.sage, fontSize:"9px",
                letterSpacing:"2px", textTransform:"uppercase",
                padding:"10px 16px", cursor:"pointer", fontFamily:font,
                fontStyle:"italic", transition:"all 0.2s ease" }}
                onMouseEnter={e=>e.currentTarget.style.borderColor=C.sage}
                onMouseLeave={e=>e.currentTarget.style.borderColor=C.sage+"33"}>
                Feature Guide
              </button>
            </div>
            <button onClick={()=>{
              if(window.confirm("This will erase all your data — notebook entries, streak, settings, everything. This cannot be undone. Are you sure?")){
                onReset();
              }
            }} style={{
              background:"none", border:`1px solid ${C.terra}33`,
              borderRadius:"3px", color:C.terra, fontSize:"9px",
              letterSpacing:"2px", textTransform:"uppercase",
              padding:"10px 20px", cursor:"pointer", fontFamily:font,
              fontStyle:"italic", marginBottom:"16px", transition:"all 0.2s ease" }}
              onMouseEnter={e=>e.currentTarget.style.borderColor=C.terra}
              onMouseLeave={e=>e.currentTarget.style.borderColor=C.terra+"33"}>
              Reset All Data
            </button>
            <WaveLogo size={20} color={C.sageLight}/>
            <p style={{ color:C.textMuted,fontSize:"10px",fontStyle:"italic",
              letterSpacing:"1px",marginTop:"8px" }}>Selah · Built by ZS · v1.0</p>
            <p style={{ color:C.textMuted, fontSize:"9px", fontStyle:"italic",
              lineHeight:"1.7", margin:"8px 0 0", maxWidth:"320px", marginLeft:"auto", marginRight:"auto" }}>
              Not therapy. Not medical advice. Call 988 or 911 in a crisis.
            </p>
          </div>
        </div>

      {/* Terms & Disclaimer Modal */}
      {showTerms && (
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",
          display:"flex",alignItems:"center",justifyContent:"center",
          zIndex:500,padding:"24px",fontFamily:font }}>
          <div style={{ background:C.bgPrimary,borderRadius:"16px",padding:"32px 24px",
            maxWidth:"420px",width:"100%",maxHeight:"80vh",overflowY:"auto",
            border:`1px solid ${C.border}` }}>
            <h2 style={{ color:C.textPrimary,fontSize:"18px",fontWeight:"normal",
              margin:"0 0 6px",fontFamily:font }}>Terms of Use & Disclaimer</h2>
            <p style={{ color:C.textMuted,fontSize:"9px",letterSpacing:"2px",
              textTransform:"uppercase",fontStyle:"italic",margin:"0 0 20px" }}>
              Last updated: February 2026</p>

            <div style={{ color:C.textSoft,fontSize:"12px",fontStyle:"italic",lineHeight:"1.9" }}>
              <p style={{ fontWeight:"bold",color:C.terra,margin:"0 0 8px" }}>⚠️ NOT A MEDICAL OR MENTAL HEALTH SERVICE</p>
              <p style={{ margin:"0 0 16px" }}>
                Selah is a personal reflection and emotional clarity tool. It is NOT a licensed therapist,
                counselor, psychiatrist, psychologist, social worker, or medical provider. Selah does not
                provide therapy, counseling, diagnosis, treatment, crisis intervention, or emergency services
                of any kind.
              </p>

              <p style={{ fontWeight:"bold",color:C.terra,margin:"0 0 8px" }}>⚠️ SUICIDE, SELF-HARM & HARM TO OTHERS</p>
              <p style={{ margin:"0 0 16px" }}>
                If you or someone you know is experiencing suicidal thoughts, self-harm urges, or thoughts
                of harming others, do NOT rely on Selah. Contact emergency services immediately:
                call 988 (Suicide & Crisis Lifeline), text HOME to 741741 (Crisis Text Line), or
                call 911. Selah includes crisis detection features as an added safety measure, but these
                are not guaranteed to detect all situations and should never be relied upon as a
                substitute for professional crisis intervention.
              </p>

              <p style={{ fontWeight:"bold",color:C.textPrimary,margin:"0 0 8px" }}>ASSUMPTION OF RISK</p>
              <p style={{ margin:"0 0 16px" }}>
                You acknowledge that Selah uses artificial intelligence to generate responses, and that AI
                responses may be inaccurate, incomplete, or inappropriate. You assume full responsibility
                for how you interpret and act upon any content provided by Selah. Selah is not a substitute
                for professional judgment.
              </p>

              <p style={{ fontWeight:"bold",color:C.textPrimary,margin:"0 0 8px" }}>LIMITATION OF LIABILITY</p>
              <p style={{ margin:"0 0 16px" }}>
                To the fullest extent permitted by law, Selah and its creators, developers, owners,
                affiliates, and partners shall not be held liable for any direct, indirect, incidental,
                consequential, or special damages arising from or related to your use of this application,
                including but not limited to: emotional distress, psychological harm, physical harm,
                self-harm, suicide, harm to others, decisions made based on AI-generated content,
                or any other outcomes resulting from the use of Selah.
              </p>

              <p style={{ fontWeight:"bold",color:C.textPrimary,margin:"0 0 8px" }}>HOLD HARMLESS & INDEMNIFICATION</p>
              <p style={{ margin:"0 0 16px" }}>
                By using Selah, you agree to hold harmless and indemnify Selah, its creators, developers,
                owners, and affiliates from any claims, damages, losses, or expenses (including legal fees)
                arising from your use of this application or violation of these terms.
              </p>

              <p style={{ fontWeight:"bold",color:C.textPrimary,margin:"0 0 8px" }}>AI-GENERATED CONTENT</p>
              <p style={{ margin:"0 0 16px" }}>
                All reflections, anchors, goals, assessments, and responses in Selah are generated by
                artificial intelligence. They are not reviewed by licensed professionals. AI can produce
                inaccurate, biased, or harmful content. Do not rely on Selah for medical, legal,
                financial, or clinical decisions.
              </p>

              <p style={{ fontWeight:"bold",color:C.textPrimary,margin:"0 0 8px" }}>MINORS</p>
              <p style={{ margin:"0 0 16px" }}>
                Users under 18 must have parental or guardian awareness. Selah is not designed for
                children under 13. For users 13–17, parental consent is strongly encouraged and may
                be required. Selah does not knowingly collect data from children under 13.
              </p>

              <p style={{ fontWeight:"bold",color:C.textPrimary,margin:"0 0 8px" }}>ACCEPTANCE</p>
              <p style={{ margin:"0 0 0" }}>
                By continuing to use Selah, you confirm that you have read, understood, and agreed to
                these terms. If you do not agree, please discontinue use of Selah immediately.
              </p>
            </div>

            <button onClick={()=>setShowTerms(false)} style={{ width:"100%",marginTop:"20px",
              background:C.accent,border:"none",borderRadius:"3px",color:"#fff",
              fontSize:"10px",letterSpacing:"3px",textTransform:"uppercase",
              padding:"14px",cursor:"pointer",fontFamily:font,fontStyle:"italic" }}>
              I Understand
            </button>
          </div>
        </div>
      )}

      {showPrivacy && (
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",
          display:"flex",alignItems:"center",justifyContent:"center",
          zIndex:500,padding:"24px",fontFamily:font }}>
          <div style={{ background:C.bgPrimary,borderRadius:"16px",padding:"32px 24px",
            maxWidth:"420px",width:"100%",maxHeight:"80vh",overflowY:"auto",
            border:`1px solid ${C.border}` }}>
            <div style={{ textAlign:"center",marginBottom:"20px" }}>
              <div style={{ width:"48px",height:"48px",borderRadius:"50%",
                background:`${C.sage}18`,border:`1.5px solid ${C.sage}44`,
                display:"flex",alignItems:"center",justifyContent:"center",
                margin:"0 auto 12px",fontSize:"22px" }}>🔒</div>
              <h2 style={{ color:C.textPrimary,fontSize:"18px",fontWeight:"normal",
                margin:"0 0 6px",fontFamily:font }}>Your Privacy</h2>
              <p style={{ color:C.textMuted,fontSize:"9px",letterSpacing:"2px",
                textTransform:"uppercase",fontStyle:"italic",margin:0 }}>
                How Selah protects you</p>
            </div>

            <div style={{ color:C.textSoft,fontSize:"12px",fontStyle:"italic",lineHeight:"1.9" }}>
              <div style={{ display:"flex",alignItems:"center",gap:"10px",marginBottom:"8px" }}>
                <span style={{ fontSize:"16px" }}>🛡️</span>
                <p style={{ fontWeight:"bold",color:C.sage,margin:0 }}>End-to-End Encryption</p>
              </div>
              <p style={{ margin:"0 0 18px" }}>
                Every word you type — every reflection, notebook entry, and session — is encrypted
                the moment it leaves your device. Not even we can read it. Your thoughts belong to you.
              </p>

              <div style={{ display:"flex",alignItems:"center",gap:"10px",marginBottom:"8px" }}>
                <span style={{ fontSize:"16px" }}>🚫</span>
                <p style={{ fontWeight:"bold",color:C.amber,margin:0 }}>Never Sold. Never Shared.</p>
              </div>
              <p style={{ margin:"0 0 18px" }}>
                Your data will never be sold to advertisers, data brokers, or third parties. Period.
                Selah exists to serve you — not to monetize your inner world.
              </p>

              <div style={{ display:"flex",alignItems:"center",gap:"10px",marginBottom:"8px" }}>
                <span style={{ fontSize:"16px" }}>💾</span>
                <p style={{ fontWeight:"bold",color:C.textPrimary,margin:0 }}>Local-First Storage</p>
              </div>
              <p style={{ margin:"0 0 18px" }}>
                Your reflections, journal entries, and mood data are stored locally on your device by default.
                If you choose to enable cloud sync, your data is encrypted before it ever leaves your phone.
              </p>

              <div style={{ display:"flex",alignItems:"center",gap:"10px",marginBottom:"8px" }}>
                <span style={{ fontSize:"16px" }}>🤖</span>
                <p style={{ fontWeight:"bold",color:C.textPrimary,margin:0 }}>AI Sessions Are Private</p>
              </div>
              <p style={{ margin:"0 0 18px" }}>
                Your AI reflection sessions are not stored on any external server after they complete.
                Session content is processed in real-time and not retained by our AI provider for training
                or any other purpose.
              </p>

              <div style={{ display:"flex",alignItems:"center",gap:"10px",marginBottom:"8px" }}>
                <span style={{ fontSize:"16px" }}>🗑️</span>
                <p style={{ fontWeight:"bold",color:C.textPrimary,margin:0 }}>Your Right to Delete</p>
              </div>
              <p style={{ margin:"0 0 0" }}>
                You can wipe all your data at any time from Settings. Full reset removes everything — sessions,
                journal entries, mood history, preferences. No questions asked. No data retained.
              </p>
            </div>

            <button onClick={()=>setShowPrivacy(false)} style={{ width:"100%",marginTop:"20px",
              background:C.accent,border:"none",borderRadius:"3px",color:"#fff",
              fontSize:"10px",letterSpacing:"3px",textTransform:"uppercase",
              padding:"14px",cursor:"pointer",fontFamily:font,fontStyle:"italic" }}>
              Close
            </button>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// ASSESSMENTS
// ═══════════════════════════════════════════════════════
const ASSESSMENTS = {
  personality: {
    id:"personality", icon:"🧩", title:"Personality Type", sub:"Discover how you're wired",
    time:"~6 min", color:"#A8B5A2", questions:[
      {q:"At a gathering, you tend to:",a:"Talk to many people",b:"Have deep conversations with a few"},
      {q:"You recharge by:",a:"Being around people",b:"Spending time alone"},
      {q:"When meeting someone new, you:",a:"Initiate conversation easily",b:"Wait for them to approach"},
      {q:"You're more drawn to:",a:"What is real and actual",b:"What is possible and potential"},
      {q:"You trust more:",a:"Your direct experience",b:"Your gut instinct"},
      {q:"You prefer instructions that are:",a:"Step-by-step and detailed",b:"Big picture and conceptual"},
      {q:"When making decisions, you prioritize:",a:"Logic and fairness",b:"Harmony and feelings"},
      {q:"You'd rather be seen as:",a:"Competent and strong",b:"Compassionate and warm"},
      {q:"Criticism from someone you respect makes you:",a:"Analyze what's valid",b:"Feel it deeply first"},
      {q:"Your workspace is usually:",a:"Organized and structured",b:"Flexible and spontaneous"},
      {q:"Deadlines make you:",a:"Focused — you plan ahead",b:"Creative — you work best under pressure"},
      {q:"You prefer plans that are:",a:"Set and decided",b:"Open and adaptable"},
      {q:"When stressed, you tend to:",a:"Withdraw and overthink",b:"Seek out people for support"},
      {q:"You're better at:",a:"Starting projects",b:"Finishing projects"},
      {q:"People would describe you as more:",a:"Practical and grounded",b:"Imaginative and visionary"},
      {q:"In conflict, you default to:",a:"What makes logical sense",b:"What feels right for everyone"},
    ],
    score: (answers) => {
      let E=0,S=0,T=0,J=0;
      [0,1,2,12].forEach(i=>{ if(answers[i]==="a") E++; });
      [3,4,5,14].forEach(i=>{ if(answers[i]==="a") S++; });
      [6,7,8,15].forEach(i=>{ if(answers[i]==="a") T++; });
      [9,10,11,13].forEach(i=>{ if(answers[i]==="a") J++; });
      const type = (E>=2?"E":"I")+(S>=2?"S":"N")+(T>=2?"T":"F")+(J>=2?"J":"P");
      const descriptions = {
        ISTJ:"The Inspector — Responsible, thorough, dependable. You value tradition and loyalty.",
        ISFJ:"The Protector — Warm, considerate, devoted. You show love through action, not words.",
        INFJ:"The Counselor — Insightful, principled, compassionate. You see what others miss.",
        INTJ:"The Architect — Strategic, determined, independent. You build systems that work.",
        ISTP:"The Craftsman — Observant, practical, analytical. You solve problems by doing.",
        ISFP:"The Composer — Gentle, sensitive, kind. You experience life through feeling.",
        INFP:"The Healer — Idealistic, empathetic, creative. You carry deep convictions quietly.",
        INTP:"The Thinker — Logical, original, curious. You live in the world of ideas.",
        ESTP:"The Dynamo — Bold, direct, resourceful. You thrive in the moment.",
        ESFP:"The Performer — Spontaneous, energetic, fun. You bring life to every room.",
        ENFP:"The Champion — Enthusiastic, creative, sociable. You see potential everywhere.",
        ENTP:"The Visionary — Inventive, strategic, outspoken. You challenge everything.",
        ESTJ:"The Supervisor — Organized, logical, assertive. You get things done right.",
        ESFJ:"The Provider — Caring, social, traditional. You hold communities together.",
        ENFJ:"The Teacher — Charismatic, empathetic, organized. You lead through inspiration.",
        ENTJ:"The Commander — Bold, imaginative, strong-willed. You find a way or make one.",
      };
      return { type, label: type, description: descriptions[type] || "A unique blend of traits." };
    }
  },
  brain: {
    id:"brain", icon:"🧠", title:"Left/Right Brain", sub:"Analytical or creative?",
    time:"~4 min", color:"#C9A96E", questions:[
      {q:"When solving a problem, you first:",a:"Break it into logical steps",b:"Look at the whole picture"},
      {q:"You remember things better by:",a:"Writing notes and lists",b:"Visualizing or associating"},
      {q:"In school, you preferred:",a:"Math, science, grammar",b:"Art, music, creative writing"},
      {q:"When reading, you focus on:",a:"The facts and details",b:"The meaning and themes"},
      {q:"You express yourself better through:",a:"Words and writing",b:"Images, movement, or music"},
      {q:"When given directions, you prefer:",a:"Written step-by-step instructions",b:"A visual map or diagram"},
      {q:"Your thinking style is more:",a:"Sequential — one thing at a time",b:"Holistic — many things at once"},
      {q:"You're more comfortable with:",a:"Certainty and proven methods",b:"Ambiguity and experimentation"},
      {q:"Time feels:",a:"Linear — past, present, future",b:"Fluid — it all blends together"},
      {q:"At work, you excel at:",a:"Analysis, planning, organizing",b:"Brainstorming, designing, connecting"},
      {q:"You make decisions based on:",a:"Data and evidence",b:"Intuition and feeling"},
      {q:"Your desk/room is typically:",a:"Neat and categorized",b:"Creative chaos"},
    ],
    score: (answers) => {
      const left = answers.filter(a=>a==="a").length;
      const pct = Math.round((left/12)*100);
      const label = pct >= 70 ? "Strongly Left-Brain" : pct >= 55 ? "Left-Leaning" : pct >= 45 ? "Balanced" : pct >= 30 ? "Right-Leaning" : "Strongly Right-Brain";
      const descriptions = {
        "Strongly Left-Brain": "You think in systems. Logic, order, and structure are your natural language. You analyze before you act and trust what can be measured.",
        "Left-Leaning": "You lead with logic but have creative instincts. You like frameworks but aren't rigid — you adapt when the data shifts.",
        "Balanced": "You blend analytical and creative thinking fluidly. You can build the spreadsheet and design the vision. This is rare.",
        "Right-Leaning": "You lead with intuition and creativity, but can organize when needed. You see patterns others miss.",
        "Strongly Right-Brain": "You think in images, feelings, and connections. Creativity isn't a skill for you — it's how your mind works. You see the whole before the parts.",
      };
      return { type: `${pct}% Left / ${100-pct}% Right`, label, description: descriptions[label], pct };
    }
  },
  adhd: {
    id:"adhd", icon:"⚡", title:"ADHD/ADD Screening", sub:"Focus & attention patterns",
    time:"~5 min", color:"#C4785C",
    disclaimer: "This is a self-assessment tool, not a clinical diagnosis. If results concern you, please consult a healthcare professional.",
    questions:[
      {q:"How often do you have difficulty sustaining attention on tasks?",opts:["Rarely","Sometimes","Often","Very often"]},
      {q:"How often do you lose things necessary for tasks (keys, phone, wallet)?",opts:["Rarely","Sometimes","Often","Very often"]},
      {q:"How often are you easily distracted by unrelated thoughts or stimuli?",opts:["Rarely","Sometimes","Often","Very often"]},
      {q:"How often do you have difficulty organizing tasks and activities?",opts:["Rarely","Sometimes","Often","Very often"]},
      {q:"How often do you avoid tasks that require sustained mental effort?",opts:["Rarely","Sometimes","Often","Very often"]},
      {q:"How often do you fail to give close attention to details?",opts:["Rarely","Sometimes","Often","Very often"]},
      {q:"How often do you fidget, tap, or feel restless when sitting?",opts:["Rarely","Sometimes","Often","Very often"]},
      {q:"How often do you feel driven by a motor — unable to stay still?",opts:["Rarely","Sometimes","Often","Very often"]},
      {q:"How often do you talk excessively or interrupt others?",opts:["Rarely","Sometimes","Often","Very often"]},
      {q:"How often do you have difficulty waiting your turn?",opts:["Rarely","Sometimes","Often","Very often"]},
      {q:"How often do you start tasks but lose focus and fail to finish?",opts:["Rarely","Sometimes","Often","Very often"]},
      {q:"How often do you hyperfocus on interesting things but can't focus on boring ones?",opts:["Rarely","Sometimes","Often","Very often"]},
      {q:"How often do you forget appointments or obligations?",opts:["Rarely","Sometimes","Often","Very often"]},
      {q:"How often do you feel mentally foggy or spacey?",opts:["Rarely","Sometimes","Often","Very often"]},
    ],
    score: (answers) => {
      const vals = answers.map(a=>["Rarely","Sometimes","Often","Very often"].indexOf(a));
      const total = vals.reduce((s,v)=>s+v,0);
      const max = 42;
      const pct = Math.round((total/max)*100);
      const label = pct >= 70 ? "High indicators" : pct >= 45 ? "Moderate indicators" : pct >= 25 ? "Mild indicators" : "Low indicators";
      const inattention = vals.slice(0,6).reduce((s,v)=>s+v,0);
      const hyperactive = vals.slice(6,10).reduce((s,v)=>s+v,0);
      const descriptions = {
        "High indicators": "Your responses suggest significant attention and focus challenges. This doesn't define you — many brilliant people navigate ADHD. Consider speaking with a professional who can provide proper evaluation and support strategies.",
        "Moderate indicators": "You show some patterns consistent with attention difficulties. These could be ADHD-related or situational (stress, sleep, life changes). A professional can help distinguish and provide tools.",
        "Mild indicators": "You show minor attention patterns that are common in the general population. If they don't significantly impact your daily life, they may not require clinical attention.",
        "Low indicators": "Your responses don't suggest significant ADHD patterns. Everyone has occasional focus challenges — yours appear to be within typical range.",
      };
      return { type: `Score: ${total}/${max}`, label, description: descriptions[label], pct, inattention, hyperactive, isScale: true };
    }
  },
  trauma: {
    id:"trauma", icon:"🛡️", title:"Trauma & Fear Response", sub:"How past experiences affect you",
    time:"~5 min", color:"#8A7A6B",
    disclaimer: "This assessment explores emotional responses. If you feel overwhelmed at any point, you can stop. You are safe here.",
    questions:[
      {q:"Do you often feel on guard or hypervigilant, even in safe situations?",opts:["Rarely","Sometimes","Often","Very often"]},
      {q:"Do you avoid places, people, or situations that remind you of painful experiences?",opts:["Rarely","Sometimes","Often","Very often"]},
      {q:"Do you experience sudden emotional reactions that feel bigger than the situation?",opts:["Rarely","Sometimes","Often","Very often"]},
      {q:"Do you have difficulty trusting people, even those who have earned it?",opts:["Rarely","Sometimes","Often","Very often"]},
      {q:"Do you feel emotionally numb or disconnected from your feelings?",opts:["Rarely","Sometimes","Often","Very often"]},
      {q:"Do you have recurring thoughts or memories of painful events you can't control?",opts:["Rarely","Sometimes","Often","Very often"]},
      {q:"Do you feel like you need to be in control of everything to feel safe?",opts:["Rarely","Sometimes","Often","Very often"]},
      {q:"Do you struggle with feeling worthy of love or good things?",opts:["Rarely","Sometimes","Often","Very often"]},
      {q:"Do you freeze, shut down, or dissociate when overwhelmed?",opts:["Rarely","Sometimes","Often","Very often"]},
      {q:"Does your body hold tension, pain, or tightness that seems connected to emotions?",opts:["Rarely","Sometimes","Often","Very often"]},
      {q:"Do you find it hard to set boundaries without guilt or fear?",opts:["Rarely","Sometimes","Often","Very often"]},
      {q:"Do you have a strong startle response (jump easily at sounds, etc.)?",opts:["Rarely","Sometimes","Often","Very often"]},
      {q:"Do people-pleasing or conflict avoidance drive many of your decisions?",opts:["Rarely","Sometimes","Often","Very often"]},
    ],
    score: (answers) => {
      const vals = answers.map(a=>["Rarely","Sometimes","Often","Very often"].indexOf(a));
      const total = vals.reduce((s,v)=>s+v,0);
      const max = 39;
      const pct = Math.round((total/max)*100);
      const label = pct >= 65 ? "Significant impact" : pct >= 40 ? "Moderate impact" : pct >= 20 ? "Mild impact" : "Minimal impact";
      const descriptions = {
        "Significant impact": "Your responses suggest past experiences are significantly shaping how you move through the world — your trust, your reactions, your sense of safety. This is not weakness. It's your nervous system doing what it learned to do. Working with a trauma-informed therapist could be profoundly healing.",
        "Moderate impact": "You carry some protective patterns from past experiences. These once served you, but some may now be limiting your freedom. Awareness is the first step — and you just took it.",
        "Mild impact": "You show some mild protective responses. Everyone carries something. Yours appear manageable, but stay aware of patterns that might limit connection or peace.",
        "Minimal impact": "Your responses suggest you've either processed past difficulties well or haven't experienced significant trauma. Continue building on that foundation of resilience.",
      };
      return { type: `Score: ${total}/${max}`, label, description: descriptions[label], pct, isScale: true };
    }
  },
  anxiety: {
    id:"anxiety", icon:"◈", title:"Anxiety & Stress Level", sub:"Where you stand right now",
    time:"~4 min", color:"#6B8F7B",
    disclaimer: "This reflects your current state, not a permanent condition. Scores change — that's the point.",
    questions:[
      {q:"How often do you feel nervous, anxious, or on edge?",opts:["Rarely","Sometimes","Often","Very often"]},
      {q:"How often are you unable to stop or control worrying?",opts:["Rarely","Sometimes","Often","Very often"]},
      {q:"How often do you worry too much about different things?",opts:["Rarely","Sometimes","Often","Very often"]},
      {q:"How often do you have trouble relaxing?",opts:["Rarely","Sometimes","Often","Very often"]},
      {q:"How often are you so restless it's hard to sit still?",opts:["Rarely","Sometimes","Often","Very often"]},
      {q:"How often do you become easily annoyed or irritable?",opts:["Rarely","Sometimes","Often","Very often"]},
      {q:"How often do you feel afraid something awful might happen?",opts:["Rarely","Sometimes","Often","Very often"]},
      {q:"How often does your mind race before bed?",opts:["Rarely","Sometimes","Often","Very often"]},
      {q:"How often do physical symptoms (headaches, stomach, chest tightness) appear with stress?",opts:["Rarely","Sometimes","Often","Very often"]},
      {q:"How often do you feel overwhelmed by daily responsibilities?",opts:["Rarely","Sometimes","Often","Very often"]},
      {q:"How often do you avoid situations because of fear or worry?",opts:["Rarely","Sometimes","Often","Very often"]},
      {q:"How often do you feel like things are out of your control?",opts:["Rarely","Sometimes","Often","Very often"]},
    ],
    score: (answers) => {
      const vals = answers.map(a=>["Rarely","Sometimes","Often","Very often"].indexOf(a));
      const total = vals.reduce((s,v)=>s+v,0);
      const max = 36;
      const pct = Math.round((total/max)*100);
      const label = pct >= 70 ? "Severe anxiety" : pct >= 45 ? "Moderate anxiety" : pct >= 25 ? "Mild anxiety" : "Minimal anxiety";
      const descriptions = {
        "Severe anxiety": "Your anxiety is running high right now. This doesn't mean it will always be this way — but right now, your nervous system is working overtime. Consider professional support, and use Selah's breathing exercises daily. You deserve relief.",
        "Moderate anxiety": "You're carrying a noticeable level of stress and worry. It's affecting your peace but likely not fully disrupting your life yet. This is the perfect time to build habits — breathing, reflection, and honest processing can shift this.",
        "Mild anxiety": "You have some worry and stress, but it's within a manageable range. Keep building your awareness. The tools you're developing now will serve you when harder seasons come.",
        "Minimal anxiety": "Your anxiety levels are low right now. This is a strong foundation. Use this season to deepen your self-awareness and build resilience for when challenges arise.",
      };
      return { type: `Score: ${total}/${max}`, label, description: descriptions[label], pct, isScale: true };
    }
  },
};

// ═══════════════════════════════════════════════════════
// KNOW YOURSELF — 100 Question AI-Powered Assessment (Deep Tier)
// ═══════════════════════════════════════════════════════
const KNOW_YOURSELF_PHASES = [
  { name:"The Basics", range:[0,19], desc:"Let's start simple — just who you are day to day." },
  { name:"Your World", range:[20,39], desc:"How you move through life and connect with others." },
  { name:"What Drives You", range:[40,59], desc:"The things that matter most and why." },
  { name:"How You Feel", range:[60,79], desc:"Your emotional patterns and inner rhythms." },
  { name:"Who You Are", range:[80,99], desc:"The deeper stuff — purpose, identity, direction." }
];

const KNOW_YOURSELF_QS = [
  // PHASE 1: THE BASICS (1-20)
  {q:"What time of day do you feel most alive?",opts:["Early morning","Late morning / afternoon","Evening","Late at night"]},
  {q:"If you had a free Saturday with zero obligations, you'd probably:",opts:["Stay in and recharge alone","Go somewhere new and explore","Hang out with a few close people","Work on a personal project"]},
  {q:"What kind of music do you reach for when you need to feel something?",opts:["Something chill and mellow","Upbeat and energizing","Emotional and lyrical","I sit in silence"]},
  {q:"How do you start your mornings?",opts:["Slow — I ease into the day","Routine — same steps every time","Chaotic — I figure it out as I go","Intentional — I set the tone early"]},
  {q:"When it comes to food, you're more:",opts:["Eat to live — I don't think about it much","Adventurous — I love trying new things","Comfort-driven — I have my go-to's","Health-focused — I'm mindful about what I eat"]},
  {q:"Your ideal living space looks like:",opts:["Minimal and clean","Cozy and lived-in","Creative and colorful","Doesn't matter — I'm barely home"]},
  {q:"How do you feel about routines?",opts:["I need them to function","I like them but I flex","I resist them — they feel boring","I want them but can't seem to stick to them"]},
  {q:"When you're bored, you usually:",opts:["Scroll through your phone","Start something new","Reach out to someone","Sit with it and think"]},
  {q:"How much does weather affect your mood?",opts:["A lot — rainy days hit different","Somewhat — I notice it","Not really — I'm the same either way","I actually love the darker days"]},
  {q:"What's your relationship with sleep?",opts:["I sleep well and prioritize it","I struggle to fall asleep","I stay up too late on purpose","It's inconsistent — depends on the week"]},
  {q:"If someone handed you $500 right now, you'd:",opts:["Save it","Spend it on an experience","Buy something you've been wanting","Give some away or treat someone"]},
  {q:"When plans change last minute, you:",opts:["Get frustrated — I was mentally prepared","Roll with it — no big deal","Feel relieved honestly","Depends on my mood that day"]},
  {q:"How do you feel about trying new things?",opts:["I love it — variety keeps me going","I'm open but cautious","I prefer what I know works","I want to try more but something holds me back"]},
  {q:"Your phone screen time is:",opts:["Low — I try to stay off it","Moderate — I'm aware of it","High — I know, I know","I haven't checked and I don't want to"]},
  {q:"What type of shows or content do you gravitate toward?",opts:["Documentaries and real stories","Comedy and lighthearted stuff","Drama and deep narratives","Action, thriller, or sci-fi"]},
  {q:"How do you feel about being alone?",opts:["I love it — I recharge alone","It's fine in small doses","I get restless or anxious","I need it but I don't always enjoy it"]},
  {q:"What sounds most like your style?",opts:["Casual and comfortable","Put-together and intentional","Expressive and creative","I don't really think about it"]},
  {q:"How organized is your digital life (emails, files, photos)?",opts:["Very — everything has a place","Somewhat — I try","It's chaos honestly","I clean it up in bursts then let it go"]},
  {q:"When you hear your favorite song, you:",opts:["Turn it up and sing along","Close your eyes and feel it","Share it with someone immediately","Play it on repeat for days"]},
  {q:"If you could master one skill overnight, it would be:",opts:["A musical instrument","A language","A sport or physical skill","A creative art (painting, writing, etc.)"]},

  // PHASE 2: YOUR WORLD (21-40)
  {q:"In a group setting, you're usually the one who:",opts:["Listens more than talks","Keeps the energy going","Connects people to each other","Observes from the edges"]},
  {q:"How many people truly know you?",opts:["One or two","A small circle","A lot of people","Honestly... I'm not sure anyone fully does"]},
  {q:"What do people usually come to you for?",opts:["Advice and perspective","A good time or a laugh","Emotional support","Practical help and solutions"]},
  {q:"When someone disagrees with you, your first instinct is to:",opts:["Explain your reasoning","Listen to their side","Avoid the conflict","Stand firm — you know what you think"]},
  {q:"Your friendships are best described as:",opts:["Few but very deep","Wide but sometimes surface-level","Constantly evolving","Hard to maintain honestly"]},
  {q:"How do you show people you care?",opts:["Acts of service — doing things for them","Quality time — being present","Words — saying what I feel","Gifts or gestures — thoughtful surprises"]},
  {q:"When you're in a room of strangers, you feel:",opts:["Energized — new people are exciting","Neutral — I can handle it","Drained — I'd rather not","Curious but quiet"]},
  {q:"Your relationship with family is:",opts:["Close and supportive","Complicated but I love them","Distant — by choice or circumstance","A work in progress"]},
  {q:"How do you handle being wrong?",opts:["I admit it and move on","It stings but I own it","I get defensive at first","I struggle with it more than I should"]},
  {q:"If you could spend a day with any type of person, it would be:",opts:["Someone who's been through hard things and came out strong","Someone creative and free-spirited","Someone strategic and ambitious","Someone calm, wise, and grounded"]},
  {q:"What kind of conversations light you up?",opts:["Deep and philosophical","Funny and spontaneous","Vulnerable and honest","Ideas and future plans"]},
  {q:"How do you react when someone is going through something hard?",opts:["I try to fix it","I just listen and hold space","I share a similar experience","I check in later — I process slowly"]},
  {q:"How comfortable are you asking for help?",opts:["Very — I know I can't do everything alone","Somewhat — depends who it is","Not very — I'd rather figure it out","I'm working on getting better at it"]},
  {q:"When you meet someone new, you notice:",opts:["How they make you feel","What they talk about","Their energy and body language","Whether they seem genuine"]},
  {q:"Your ideal Friday night is:",opts:["Home — peace and quiet","Out with close friends","Doing something spontaneous","A mix — start chill, end social"]},
  {q:"What do you value most in a relationship?",opts:["Honesty — even when it's hard","Loyalty — showing up consistently","Growth — challenging each other","Freedom — space to be yourself"]},
  {q:"How do you handle gossip?",opts:["I shut it down","I listen but don't contribute","I'm guilty of it sometimes","I avoid people who do it"]},
  {q:"When someone compliments you, you:",opts:["Accept it and say thanks","Deflect or downplay it","Feel uncomfortable","Appreciate it but question if it's real"]},
  {q:"What kind of people drain you?",opts:["Negative and complaining constantly","Controlling and rigid","Fake and surface-level","People who only take and never give"]},
  {q:"How do you feel about vulnerability?",opts:["It's necessary — I try to practice it","It's hard but I respect it","It scares me honestly","I'm more vulnerable than people realize"]},

  // PHASE 3: WHAT DRIVES YOU (41-60)
  {q:"What motivates you to get out of bed most days?",opts:["Responsibility — people depend on me","Curiosity — I want to learn and grow","Goals — I'm working toward something","Honestly, some days I'm not sure"]},
  {q:"Success to you looks like:",opts:["Financial stability and freedom","Doing work that matters","Being at peace with who I am","Having strong, healthy relationships"]},
  {q:"What's more important — being right or being kind?",opts:["Being right — truth matters","Being kind — always","Depends on the situation","Being honest, which is both"]},
  {q:"When you set a goal, you typically:",opts:["Plan every step and execute","Start strong but lose momentum","Keep it flexible and adjust","Avoid setting them — they stress me out"]},
  {q:"What role does faith or spirituality play in your life?",opts:["Central — it shapes everything","Present but private","Exploring — I'm figuring it out","Minimal — I find meaning elsewhere"]},
  {q:"What keeps you up at night?",opts:["The future — uncertainty and plans","The past — things I wish I'd done differently","Relationships — am I enough for people?","My mind just won't turn off"]},
  {q:"If money wasn't a factor, you'd spend your days:",opts:["Traveling and experiencing the world","Creating — art, music, writing, building","Helping people and making a difference","Learning — studying anything that interests me"]},
  {q:"What do you fear more?",opts:["Failure","Being forgotten","Being truly seen","Wasting my potential"]},
  {q:"How do you define strength?",opts:["Pushing through no matter what","Being honest about your weakness","Staying calm in chaos","Choosing to be soft in a hard world"]},
  {q:"What's your relationship with discipline?",opts:["Strong — I can commit when I decide to","Inconsistent — I go through phases","Weak — I struggle with follow-through","I'm building it — it's a process"]},
  {q:"When you think about the future, you feel:",opts:["Excited — so much possibility","Anxious — too much uncertainty","Neutral — I focus on today","Conflicted — I want things I'm not sure I can have"]},
  {q:"What matters more — the journey or the destination?",opts:["The journey — the growth is the point","The destination — results matter","Both equally","I haven't figured that out yet"]},
  {q:"How do you handle failure?",opts:["Analyze what went wrong and try again","Feel it deeply then bounce back","Avoid thinking about it","It hits hard and takes me a while"]},
  {q:"What kind of impact do you want to have?",opts:["Change systems or create something lasting","Inspire people through my story","Help the people closest to me thrive","Leave something behind that matters"]},
  {q:"Your biggest strength is probably:",opts:["My mind — I think deeply and clearly","My heart — I feel things and care hard","My resilience — I keep going","My creativity — I see things differently"]},
  {q:"What do you need more of in your life right now?",opts:["Structure and direction","Joy and lightness","Connection and belonging","Rest and recovery"]},
  {q:"When you're passionate about something, you:",opts:["Go all in — obsessively","Talk about it to everyone","Quietly pursue it on your own","Wish you had more time for it"]},
  {q:"What does freedom mean to you?",opts:["Not being controlled by anyone","Having options and flexibility","Being at peace inside — no matter what's happening outside","Financial independence"]},
  {q:"How do you feel about competition?",opts:["I thrive on it","I compete with myself, not others","It stresses me out","I like friendly competition but nothing intense"]},
  {q:"What would your 10-year-old self think of you right now?",opts:["They'd be proud","They'd be confused","They'd be disappointed","They'd be surprised"]},

  // PHASE 4: HOW YOU FEEL (61-80)
  {q:"How often do you feel truly at peace?",opts:["Often — I've built that into my life","Sometimes — in certain moments","Rarely — my mind is always going","I'm not sure I know what that feels like"]},
  {q:"When you're sad, you:",opts:["Let yourself feel it","Distract yourself","Push through and keep moving","Isolate until it passes"]},
  {q:"What emotion do you experience the most?",opts:["Anxiety or restlessness","Contentment or calm","Frustration or impatience","Sadness or heaviness"]},
  {q:"How well do you know your own triggers?",opts:["Very well — I've done the work","Somewhat — I'm learning","Not well — things catch me off guard","I know them but can't always manage them"]},
  {q:"When you feel overwhelmed, what helps most?",opts:["Being alone and quiet","Talking it out with someone","Moving my body — walking, exercise","Writing or processing internally"]},
  {q:"How do you handle anger?",opts:["I express it directly","I hold it in until I can't","I rarely feel angry","It comes out sideways — sarcasm, withdrawal"]},
  {q:"When was the last time you cried?",opts:["Recently — I cry when I need to","A while ago — I hold it in","I honestly can't remember","I wanted to but couldn't"]},
  {q:"Your stress shows up as:",opts:["Overthinking and mental loops","Physical tension — headaches, stomach, chest","Irritability and short temper","Shutting down and going numb"]},
  {q:"How comfortable are you sitting with uncomfortable emotions?",opts:["I'm learning to do it","I avoid them at all costs","I can handle it for a bit","I actually process best through discomfort"]},
  {q:"What's your relationship with joy?",opts:["I feel it often and freely","I feel guilty when I'm happy","It comes in small quiet moments","I'm chasing it but it feels distant"]},
  {q:"When something great happens, your first instinct is to:",opts:["Share it with someone you love","Savor it quietly","Wonder when it'll end","Feel like you don't deserve it"]},
  {q:"How do you feel about change?",opts:["I welcome it — growth requires it","I adapt but it takes me time","I resist it — I like stability","I crave it but fear it at the same time"]},
  {q:"Do you feel like your emotions are too much for people?",opts:["Sometimes — I tone myself down","Yes — I've been told that","No — I'm pretty even-keeled","I don't show enough emotion honestly"]},
  {q:"What's the hardest emotion for you to express?",opts:["Sadness — I don't want to seem weak","Anger — I don't want to hurt anyone","Love — it makes me feel exposed","Need — I don't want to be a burden"]},
  {q:"How do you feel at the end of most days?",opts:["Accomplished — I did what I could","Drained — it takes everything","Restless — like I should have done more","Grateful — even on hard days"]},
  {q:"What does your inner voice sound like?",opts:["Encouraging — I'm my own coach","Critical — I'm hard on myself","Quiet — I don't hear much","Conflicted — it changes depending on the day"]},
  {q:"When you think about your mental health, you'd say it's:",opts:["Strong — I'm in a good season","A work in progress","Struggling but I'm trying","Something I haven't really addressed"]},
  {q:"What do you wish people understood about you?",opts:["How much I actually feel underneath","That I'm doing my best","That I need space sometimes","That I care more than I show"]},
  {q:"How often do you feel grateful?",opts:["Daily — I practice it","When good things happen","Not as often as I should","I struggle with it honestly"]},
  {q:"If your emotions had a weather pattern, it'd be:",opts:["Partly cloudy with sun breaks","Steady and clear most days","Unpredictable storms","Overcast with rare sunshine"]},

  // PHASE 5: WHO YOU ARE (81-100)
  {q:"What do you think your purpose is?",opts:["I have a clear sense of it","I have an idea but it's forming","I have no idea and it bothers me","I don't think about it much"]},
  {q:"When you look in the mirror, what do you see?",opts:["Someone becoming who they're meant to be","Someone still figuring it out","Someone who's been through a lot","Someone I'm learning to love"]},
  {q:"What part of yourself are you most proud of?",opts:["My heart — how deeply I care","My mind — how I think and process","My resilience — what I've survived","My growth — how far I've come"]},
  {q:"What part of yourself do you struggle with most?",opts:["Self-doubt — I question myself constantly","Consistency — I start and stop","My temper or emotional reactions","Feeling like I'm behind in life"]},
  {q:"Do you feel like you're living authentically?",opts:["Yes — I'm finally being real","Mostly — with some masks still on","No — I play a role for others","I'm getting closer"]},
  {q:"What does healing look like to you?",opts:["Letting go of things I can't change","Understanding why I am the way I am","Building a life I don't need to escape from","Being honest with myself and others"]},
  {q:"If you could tell your younger self one thing, it would be:",opts:["It gets better — keep going","Trust yourself more","The things that hurt you aren't your fault","Don't rush — everything comes in time"]},
  {q:"What kind of person do you want to become?",opts:["Someone at peace — steady and grounded","Someone who inspires others","Someone who broke the cycle","Someone who truly knows themselves"]},
  {q:"What's holding you back from being that person?",opts:["Fear","Past experiences","Lack of clarity","Nothing — I'm on my way"]},
  {q:"How do you want to be remembered?",opts:["As someone who was real and honest","As someone who made others feel seen","As someone who never gave up","As someone who loved deeply"]},
  {q:"What does your soul need right now?",opts:["Rest — real, deep rest","Direction — a clear path forward","Connection — to feel less alone","Permission — to be who I really am"]},
  {q:"Do you believe you're capable of change?",opts:["Absolutely — I've already proven it","I want to — but I have doubts","I believe it for others more than myself","I'm starting to"]},
  {q:"What would you do if you knew you couldn't fail?",opts:["Start a business or creative project","Move somewhere completely new","Have the hard conversation I've been avoiding","Go back to school or learn something new"]},
  {q:"The thing I'm most afraid to admit is:",opts:["I'm lonely","I don't know who I am without my struggles","I'm scared I'll always feel this way","I need more help than I ask for"]},
  {q:"When life gets quiet, what surfaces?",opts:["Gratitude — I notice what's good","Anxiety — the silence is loud","Sadness — things I haven't dealt with","Clarity — I think best in stillness"]},
  {q:"What gives you hope?",opts:["People who've overcome what I'm facing","Small moments of beauty and grace","My own progress — even if it's slow","Faith that there's a bigger plan"]},
  {q:"Right now, the version of yourself you're building is:",opts:["Stronger than the one before","Softer and more open","More honest","Still unclear — but I'm showing up"]},
  {q:"If Selah could help you with one thing, it would be:",opts:["Finding clarity about who I am","Building habits that actually stick","Processing things I've never talked about","Discovering what makes me come alive"]},
  {q:"The one word that best describes where you are in life right now:",opts:["Searching","Growing","Surviving","Becoming"]},
  {q:"After 100 questions — how do you feel?",opts:["Seen — like something understood me","Curious — I want to know my results","Emotional — that went deeper than I expected","Ready — to do something with this"]},
];

function KnowYourselfQuiz({ C, font, onBack, onComplete, userName }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const qs = KNOW_YOURSELF_QS;
  const phase = KNOW_YOURSELF_PHASES.find(p => current >= p.range[0] && current <= p.range[1]);
  const prevPhase = current > 0 ? KNOW_YOURSELF_PHASES.find(p => (current-1) >= p.range[0] && (current-1) <= p.range[1]) : null;
  const isNewPhase = phase && (!prevPhase || phase.name !== prevPhase.name);
  const [showPhaseIntro, setShowPhaseIntro] = useState(false);
  const progress = ((current)/qs.length)*100;

  // Show phase intro when entering a new phase
  const answer = (val) => {
    const newAnswers = [...answers, val];
    setAnswers(newAnswers);
    if (current + 1 >= qs.length) {
      // All done — send to AI
      analyzeResults(newAnswers);
    } else {
      const nextPhase = KNOW_YOURSELF_PHASES.find(p => (current+1) >= p.range[0] && (current+1) <= p.range[1]);
      if (nextPhase && nextPhase.name !== phase.name) {
        setTimeout(() => { setShowPhaseIntro(true); setCurrent(current + 1); }, 200);
      } else {
        setTimeout(() => setCurrent(current + 1), 200);
      }
    }
  };

  const analyzeResults = async (allAnswers) => {
    setLoading(true);
    const qaText = allAnswers.map((a, i) => `Q${i+1}: ${qs[i].q}\nA: ${a}`).join("\n\n");
    try {
      const r = await fetch("/api/chat", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          messages:[{role:"user",content:`You are a personality & lifestyle analyst for a mental wellness app called Selah. A user named ${userName||"someone"} just completed a 100-question self-discovery assessment. Analyze their answers holistically and provide:

1. PERSONALITY SNAPSHOT (2-3 sentences capturing who they are — their energy, how they move through the world, what makes them unique)

2. CORE TRAITS (list exactly 5 key personality traits you see, each with a one-sentence explanation)

3. RECOMMENDED HOBBIES & ACTIVITIES (list exactly 8 specific hobbies or activities tailored to their personality and interests — be specific, not generic. For each one, write one sentence explaining why it fits them)

4. THINGS TO TRY THIS WEEK (list exactly 3 small, actionable things they could try this week based on what you learned about them)

5. A WORD FOR THEM (a brief, personal, 2-3 sentence message speaking directly to them based on everything you learned — make it encouraging and real, not generic)

Format your response EXACTLY like this with these exact headers:
PERSONALITY_SNAPSHOT:
(your text)

CORE_TRAITS:
1. Trait Name — explanation
2. Trait Name — explanation
3. Trait Name — explanation
4. Trait Name — explanation
5. Trait Name — explanation

RECOMMENDED_HOBBIES:
1. Hobby Name — why it fits
2. Hobby Name — why it fits
3. Hobby Name — why it fits
4. Hobby Name — why it fits
5. Hobby Name — why it fits
6. Hobby Name — why it fits
7. Hobby Name — why it fits
8. Hobby Name — why it fits

TRY_THIS_WEEK:
1. Activity — why
2. Activity — why
3. Activity — why

A_WORD_FOR_YOU:
(your message)

Here are all 100 questions and their answers:

${qaText}`}]
        })
      });
      const d = await r.json();
      if(d.error) throw new Error(d.error?.message||"API error");
      const text = d.content?.[0]?.text || d.choices?.[0]?.message?.content || "";
      
      // Parse sections
      const getSection = (key) => {
        const regex = new RegExp(key + ":\\s*([\\s\\S]*?)(?=(?:PERSONALITY_SNAPSHOT|CORE_TRAITS|RECOMMENDED_HOBBIES|TRY_THIS_WEEK|A_WORD_FOR_YOU):|$)");
        const match = text.match(regex);
        return match ? match[1].trim() : "";
      };
      
      setResult({
        snapshot: getSection("PERSONALITY_SNAPSHOT"),
        traits: getSection("CORE_TRAITS"),
        hobbies: getSection("RECOMMENDED_HOBBIES"),
        tryThisWeek: getSection("TRY_THIS_WEEK"),
        wordForYou: getSection("A_WORD_FOR_YOU"),
        raw: text
      });
    } catch(e) {
      setResult({
        snapshot: "We weren't able to fully analyze your results right now, but your answers have been saved.",
        traits: "", hobbies: "", tryThisWeek: "", wordForYou: "Thank you for being honest through all 100 questions. That takes real courage. Come back and try again soon.",
        raw: ""
      });
    }
    setLoading(false);
  };

  // Intro screen
  if (!started) return (
    <div style={{ minHeight:"100vh",background:C.bgPrimary,fontFamily:font,
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
      padding:"40px 24px",textAlign:"center" }}>
      <span style={{ fontSize:"48px",marginBottom:"16px" }}>🪞</span>
      <h2 style={{ color:C.textPrimary,fontSize:"24px",fontWeight:"normal",margin:"0 0 8px" }}>Know Yourself</h2>
      <p style={{ color:C.accent,fontSize:"10px",letterSpacing:"3px",textTransform:"uppercase",margin:"0 0 20px" }}>100 Questions · AI-Powered Results</p>
      <div style={{ background:C.bgSecondary,borderRadius:"12px",padding:"24px",maxWidth:"380px",marginBottom:"24px",border:`1px solid ${C.border}`,textAlign:"left" }}>
        <p style={{ color:C.textSoft,fontSize:"13px",fontStyle:"italic",lineHeight:"2",margin:"0 0 16px" }}>
          This isn't a test. There are no right or wrong answers. It's 100 questions designed to help Selah understand who you are — your personality, your interests, your rhythms, and what makes you come alive.
        </p>
        <p style={{ color:C.textSoft,fontSize:"13px",fontStyle:"italic",lineHeight:"2",margin:"0 0 16px" }}>
          At the end, AI will analyze your answers and recommend hobbies, activities, and things to try based on your unique personality.
        </p>
        <p style={{ color:C.textMuted,fontSize:"11px",fontStyle:"italic",lineHeight:"1.8",margin:0 }}>
          5 phases · ~15-20 minutes · Your answers stay on your device
        </p>
      </div>
      <div style={{ display:"flex",flexDirection:"column",gap:"8px",width:"100%",maxWidth:"300px" }}>
        {KNOW_YOURSELF_PHASES.map((p,i)=>(
          <div key={p.name} style={{ display:"flex",alignItems:"center",gap:"12px",
            background:C.bgSecondary,borderRadius:"8px",padding:"10px 14px" }}>
            <span style={{ color:C.accent,fontSize:"11px",fontWeight:"bold",minWidth:"20px" }}>{i+1}</span>
            <div>
              <span style={{ color:C.textPrimary,fontSize:"12px",fontWeight:"bold",fontFamily:font }}>{p.name}</span>
              <p style={{ color:C.textMuted,fontSize:"10px",fontStyle:"italic",margin:"2px 0 0" }}>{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <button onClick={()=>setStarted(true)} style={{ marginTop:"28px",background:C.accent,border:"none",
        borderRadius:"3px",color:"#fff",fontSize:"10px",letterSpacing:"4px",
        textTransform:"uppercase",padding:"18px 56px",cursor:"pointer",
        fontFamily:font,fontStyle:"italic",boxShadow:`0 2px 12px ${C.accent}33` }}>
        Begin
      </button>
      <button onClick={onBack} style={{ marginTop:"12px",background:"none",border:"none",color:C.textMuted,
        fontSize:"12px",fontStyle:"italic",cursor:"pointer" }}>← Go back</button>
    </div>
  );

  // Loading screen — AI analyzing
  if (loading) return (
    <div style={{ minHeight:"100vh",background:C.bgPrimary,fontFamily:font,
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
      padding:"40px 24px",textAlign:"center" }}>
      <span style={{ fontSize:"48px",marginBottom:"20px",animation:"pulse 2s ease-in-out infinite" }}>🪞</span>
      <h2 style={{ color:C.textPrimary,fontSize:"20px",fontWeight:"normal",margin:"0 0 12px" }}>Analyzing your answers...</h2>
      <p style={{ color:C.textSoft,fontSize:"13px",fontStyle:"italic",lineHeight:"1.8",maxWidth:"300px" }}>
        Selah is reading through all 100 of your responses to build a personalized profile just for you.
      </p>
      <div style={{ width:"200px",height:"3px",background:C.bgSecondary,borderRadius:"3px",marginTop:"20px",overflow:"hidden" }}>
        <div style={{ width:"60%",height:"100%",background:C.accent,borderRadius:"3px",
          animation:"loading 2s ease-in-out infinite" }}/>
      </div>
      <style>{`@keyframes loading { 0%{width:20%;margin-left:0} 50%{width:60%;margin-left:20%} 100%{width:20%;margin-left:80%} }`}</style>
    </div>
  );

  // Results screen
  if (result) {
    const parseList = (text) => text.split("\n").filter(l=>l.trim()).map(l=>l.replace(/^\d+\.\s*/,"").trim());
    return (
      <div style={{ minHeight:"100vh",background:C.bgPrimary,fontFamily:font,
        padding:"36px 20px 80px",boxSizing:"border-box" }}>
        <div style={{ maxWidth:"480px",margin:"0 auto" }}>
          <div style={{ textAlign:"center",marginBottom:"28px" }}>
            <span style={{ fontSize:"40px" }}>🪞</span>
            <h2 style={{ color:C.textPrimary,fontSize:"22px",fontWeight:"normal",margin:"12px 0 4px" }}>
              Your Results
            </h2>
            <p style={{ color:C.accent,fontSize:"10px",letterSpacing:"3px",textTransform:"uppercase" }}>Know Yourself Assessment</p>
          </div>

          {/* Personality Snapshot */}
          {result.snapshot && (
            <div style={{ background:`${C.accent}10`,border:`1px solid ${C.accent}33`,
              borderRadius:"12px",padding:"20px",marginBottom:"16px" }}>
              <p style={{ color:C.accent,fontSize:"9px",letterSpacing:"3px",textTransform:"uppercase",margin:"0 0 10px",fontWeight:"bold" }}>Who You Are</p>
              <p style={{ color:C.textPrimary,fontSize:"14px",fontStyle:"italic",lineHeight:"2",margin:0 }}>
                {result.snapshot}
              </p>
            </div>
          )}

          {/* Core Traits */}
          {result.traits && (
            <div style={{ background:C.bgSecondary,border:`1px solid ${C.border}`,
              borderRadius:"12px",padding:"20px",marginBottom:"16px" }}>
              <p style={{ color:C.accent,fontSize:"9px",letterSpacing:"3px",textTransform:"uppercase",margin:"0 0 12px",fontWeight:"bold" }}>Core Traits</p>
              {parseList(result.traits).map((trait,i)=>(
                <div key={i} style={{ padding:"8px 0",borderBottom:i<4?`1px solid ${C.border}`:"none" }}>
                  <p style={{ color:C.textPrimary,fontSize:"13px",lineHeight:"1.8",margin:0,fontFamily:font }}>
                    {trait}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Recommended Hobbies */}
          {result.hobbies && (
            <div style={{ background:C.bgSecondary,border:`1px solid ${C.border}`,
              borderRadius:"12px",padding:"20px",marginBottom:"16px" }}>
              <p style={{ color:C.sage,fontSize:"9px",letterSpacing:"3px",textTransform:"uppercase",margin:"0 0 12px",fontWeight:"bold" }}>Recommended For You</p>
              {parseList(result.hobbies).map((hobby,i)=>(
                <div key={i} style={{ display:"flex",gap:"10px",alignItems:"flex-start",
                  padding:"10px 0",borderBottom:i<7?`1px solid ${C.border}`:"none" }}>
                  <span style={{ color:C.sage,fontSize:"14px",minWidth:"20px",fontWeight:"bold" }}>{i+1}</span>
                  <p style={{ color:C.textPrimary,fontSize:"13px",lineHeight:"1.8",margin:0,fontFamily:font }}>
                    {hobby}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Try This Week */}
          {result.tryThisWeek && (
            <div style={{ background:`${C.terra}08`,border:`1px solid ${C.terra}33`,
              borderRadius:"12px",padding:"20px",marginBottom:"16px" }}>
              <p style={{ color:C.terra,fontSize:"9px",letterSpacing:"3px",textTransform:"uppercase",margin:"0 0 12px",fontWeight:"bold" }}>Try This Week</p>
              {parseList(result.tryThisWeek).map((item,i)=>(
                <div key={i} style={{ padding:"8px 0",borderBottom:i<2?`1px solid ${C.terra}22`:"none" }}>
                  <p style={{ color:C.textPrimary,fontSize:"13px",lineHeight:"1.8",margin:0,fontFamily:font }}>
                    {item}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* A Word For You */}
          {result.wordForYou && (
            <div style={{ background:`${C.accent}08`,border:`1px solid ${C.accent}22`,
              borderRadius:"12px",padding:"24px",marginBottom:"24px",textAlign:"center" }}>
              <p style={{ color:C.accent,fontSize:"9px",letterSpacing:"3px",textTransform:"uppercase",margin:"0 0 12px",fontWeight:"bold" }}>A Word For You</p>
              <p style={{ color:C.textPrimary,fontSize:"15px",fontStyle:"italic",lineHeight:"2",margin:0 }}>
                {result.wordForYou}
              </p>
            </div>
          )}

          <div style={{ display:"flex",gap:"10px" }}>
            <button onClick={()=>onComplete({ ...result, answersCount:100, date:new Date().toISOString() })} style={{
              flex:1,background:C.accent,border:"none",borderRadius:"3px",color:"#fff",
              fontSize:"10px",letterSpacing:"3px",textTransform:"uppercase",padding:"16px",
              cursor:"pointer",fontFamily:font,fontStyle:"italic" }}>
              Save Results
            </button>
            <button onClick={()=>{setCurrent(0);setAnswers([]);setResult(null);setStarted(false);}} style={{
              background:"none",border:`1px solid ${C.border}`,borderRadius:"3px",
              color:C.textMuted,fontSize:"10px",letterSpacing:"2px",textTransform:"uppercase",
              padding:"16px 20px",cursor:"pointer",fontFamily:font,fontStyle:"italic" }}>
              Retake
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Phase intro screen
  if (showPhaseIntro && phase) return (
    <div style={{ minHeight:"100vh",background:C.bgPrimary,fontFamily:font,
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
      padding:"40px 24px",textAlign:"center" }}>
      <p style={{ color:C.accent,fontSize:"10px",letterSpacing:"3px",textTransform:"uppercase",margin:"0 0 12px" }}>
        Phase {KNOW_YOURSELF_PHASES.indexOf(phase)+1} of 5
      </p>
      <h2 style={{ color:C.textPrimary,fontSize:"24px",fontWeight:"normal",margin:"0 0 12px" }}>{phase.name}</h2>
      <p style={{ color:C.textSoft,fontSize:"14px",fontStyle:"italic",lineHeight:"1.8",maxWidth:"320px",margin:"0 0 8px" }}>
        {phase.desc}
      </p>
      <p style={{ color:C.textMuted,fontSize:"11px",fontStyle:"italic",margin:"0 0 28px" }}>
        Questions {phase.range[0]+1}–{phase.range[1]+1}
      </p>
      <button onClick={()=>setShowPhaseIntro(false)} style={{ background:C.accent,border:"none",
        borderRadius:"3px",color:"#fff",fontSize:"10px",letterSpacing:"4px",
        textTransform:"uppercase",padding:"16px 48px",cursor:"pointer",
        fontFamily:font,fontStyle:"italic" }}>
        Continue
      </button>
    </div>
  );

  // Question screen
  const q = qs[current];
  return (
    <div style={{ minHeight:"100vh",background:C.bgPrimary,fontFamily:font,
      padding:"36px 20px 80px",boxSizing:"border-box" }}>
      <div style={{ maxWidth:"480px",margin:"0 auto" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px" }}>
          <button onClick={onBack} style={{ background:"none",border:"none",
            cursor:"pointer",color:C.textMuted,fontSize:"16px",padding:"4px" }}>←</button>
          <span style={{ color:C.textMuted,fontSize:"11px",fontStyle:"italic" }}>
            {current+1} of 100
          </span>
          <span style={{ fontSize:"18px" }}>🪞</span>
        </div>
        {/* Phase label */}
        <p style={{ color:C.accent,fontSize:"9px",letterSpacing:"3px",textTransform:"uppercase",margin:"0 0 8px" }}>
          {phase?.name || ""}
        </p>
        <div style={{ background:C.bgSecondary,borderRadius:"6px",height:"4px",marginBottom:"28px",overflow:"hidden" }}>
          <div style={{ background:C.accent,height:"100%",borderRadius:"6px",
            width:`${progress}%`,transition:"width 0.4s ease" }}/>
        </div>
        <h2 style={{ color:C.textPrimary,fontSize:"18px",fontWeight:"normal",lineHeight:"1.7",
          margin:"0 0 28px",minHeight:"60px" }}>
          {q.q}
        </h2>
        <div style={{ display:"flex",flexDirection:"column",gap:"10px" }}>
          {q.opts.map((opt,i) => (
            <button key={opt} onClick={()=>answer(opt)} style={{
              background:C.bgSecondary,border:`1.5px solid ${C.border}`,
              borderRadius:"10px",padding:"16px 18px",cursor:"pointer",
              textAlign:"left",color:C.textSoft,fontSize:"13px",fontStyle:"italic",
              fontFamily:font,transition:"all 0.15s ease" }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=C.accent+"66";e.currentTarget.style.background=`${C.accent}08`;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.bgSecondary;}}>
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function AssessmentsScreen({ C, font, setScreen, assessmentResults, setAssessmentResults, tier, isTrialActive, onUpgrade, userName }) {
  const [activeTest, setActiveTest] = useState(null);
  const [showKnowYourself, setShowKnowYourself] = useState(false);
  const tests = Object.values(ASSESSMENTS);
  const canAccessDeep = hasAccess(tier, "deep", isTrialActive);
  const kyResult = assessmentResults?.knowYourself;

  if (showKnowYourself) {
    return <KnowYourselfQuiz C={C} font={font} userName={userName}
      onBack={()=>setShowKnowYourself(false)}
      onComplete={(result)=>{
        setAssessmentResults(prev=>({...prev, knowYourself: result}));
        setShowKnowYourself(false);
      }}/>;
  }

  if (activeTest) {
    return <AssessmentQuiz C={C} font={font} test={ASSESSMENTS[activeTest]}
      onBack={()=>setActiveTest(null)}
      onComplete={(result)=>{
        setAssessmentResults(prev=>({...prev, [activeTest]: { ...result, date: new Date().toISOString() }}));
        setActiveTest(null);
      }}/>;
  }

  return (
    <div style={{ minHeight:"100vh",background:C.bgPrimary,fontFamily:font,
      padding:"36px 20px 100px",boxSizing:"border-box" }}>
      <div style={{ maxWidth:"480px",margin:"0 auto" }}>
        <div style={{ display:"flex",alignItems:"center",gap:"12px",marginBottom:"24px" }}>
          <button onClick={()=>setScreen("home")} style={{ background:"none",border:"none",
            cursor:"pointer",color:C.textMuted,fontSize:"20px",padding:"4px 8px 4px 0" }}>←</button>
          <div>
            <Label text="Self-Discovery" color={C.accent} font={font}/>
            <h1 style={{ color:C.textPrimary,fontSize:"22px",fontWeight:"normal",margin:"0" }}>
              Know Yourself Better
            </h1>
          </div>
        </div>
        <p style={{ color:C.textSoft,fontSize:"13px",fontStyle:"italic",lineHeight:"1.9",margin:"0 0 24px" }}>
          These assessments help you understand your patterns, your wiring, and where you are right now. None of them define you — they illuminate you.
        </p>

        {/* KNOW YOURSELF — Featured Assessment (Deep Tier) */}
        <div style={{ background:`linear-gradient(135deg, ${C.accent}12, ${C.sage}12)`,
          border:`2px solid ${canAccessDeep?C.accent+"55":C.amber+"44"}`,
          borderRadius:"16px",padding:"22px",marginBottom:"20px",cursor:canAccessDeep?"pointer":"default",
          position:"relative",overflow:"hidden" }}
          onClick={()=>{ if(canAccessDeep) setShowKnowYourself(true); }}>
          {/* Deep tier badge */}
          <div style={{ position:"absolute",top:"12px",right:"12px",background:canAccessDeep?C.accent:C.amber,
            borderRadius:"20px",padding:"3px 10px" }}>
            <span style={{ color:"#fff",fontSize:"8px",letterSpacing:"2px",textTransform:"uppercase",fontWeight:"bold" }}>
              {canAccessDeep?"Deep":"Deep Tier"}
            </span>
          </div>
          <div style={{ display:"flex",gap:"14px",alignItems:"flex-start" }}>
            <span style={{ fontSize:"32px" }}>🪞</span>
            <div style={{ flex:1 }}>
              <h3 style={{ color:C.textPrimary,fontSize:"17px",fontWeight:"bold",fontFamily:font,margin:"0 0 4px" }}>Know Yourself</h3>
              <p style={{ color:C.textSoft,fontSize:"12px",fontStyle:"italic",lineHeight:"1.7",margin:"0 0 8px" }}>
                100 questions. AI-powered results. Discover your personality, get personalized hobby recommendations, and find what makes you come alive.
              </p>
              <div style={{ display:"flex",gap:"12px",alignItems:"center" }}>
                <span style={{ color:C.textMuted,fontSize:"10px",letterSpacing:"1px" }}>~15-20 min</span>
                <span style={{ color:C.textMuted,fontSize:"10px" }}>·</span>
                <span style={{ color:C.textMuted,fontSize:"10px",letterSpacing:"1px" }}>5 phases</span>
                <span style={{ color:C.textMuted,fontSize:"10px" }}>·</span>
                <span style={{ color:C.accent,fontSize:"10px",letterSpacing:"1px",fontWeight:"bold" }}>AI Results</span>
              </div>
              {kyResult && (
                <div style={{ marginTop:"8px",background:`${C.accent}15`,borderRadius:"8px",padding:"6px 12px",display:"inline-block" }}>
                  <span style={{ color:C.accent,fontSize:"10px",fontWeight:"bold" }}>✓ Completed · Tap to retake</span>
                </div>
              )}
            </div>
          </div>
          {!canAccessDeep && (
            <div style={{ marginTop:"14px",textAlign:"center" }}>
              <button onClick={(e)=>{e.stopPropagation();onUpgrade();}} style={{
                background:C.amber,border:"none",borderRadius:"3px",color:"#fff",
                fontSize:"9px",letterSpacing:"3px",textTransform:"uppercase",
                padding:"10px 24px",cursor:"pointer",fontFamily:font,fontStyle:"italic" }}>
                Unlock with Deep Reflection Plan
              </button>
            </div>
          )}
        </div>

        <p style={{ color:C.textMuted,fontSize:"9px",letterSpacing:"2px",textTransform:"uppercase",margin:"0 0 12px" }}>All Tiers</p>

        {tests.map(t => {
          const result = assessmentResults?.[t.id];
          return (
            <div key={t.id} style={{ background:C.bgSecondary,border:`1.5px solid ${result?t.color+"44":C.border}`,
              borderRadius:"12px",padding:"18px",marginBottom:"12px",cursor:"pointer",
              transition:"all 0.2s ease" }}
              onClick={()=>setActiveTest(t.id)}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=t.color+"88";e.currentTarget.style.transform="translateY(-1px)";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=result?t.color+"44":C.border;e.currentTarget.style.transform="translateY(0)";}}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
                <div style={{ display:"flex",gap:"12px",alignItems:"flex-start",flex:1 }}>
                  <span style={{ fontSize:"24px" }}>{t.icon}</span>
                  <div>
                    <h3 style={{ color:C.textPrimary,fontSize:"15px",fontWeight:"bold",fontFamily:font,margin:"0 0 3px" }}>{t.title}</h3>
                    <p style={{ color:C.textMuted,fontSize:"11px",fontStyle:"italic",margin:"0 0 4px" }}>{t.sub}</p>
                    <span style={{ color:C.textMuted,fontSize:"10px",letterSpacing:"1px" }}>{t.time}</span>
                  </div>
                </div>
                {result ? (
                  <div style={{ textAlign:"right",flexShrink:0 }}>
                    <div style={{ background:`${t.color}22`,borderRadius:"8px",padding:"4px 10px",marginBottom:"4px" }}>
                      <span style={{ color:t.color,fontSize:"10px",fontWeight:"bold",letterSpacing:"1px" }}>{result.label}</span>
                    </div>
                    <span style={{ color:C.textMuted,fontSize:"9px",fontStyle:"italic" }}>Tap to retake</span>
                  </div>
                ) : (
                  <span style={{ color:t.color,fontSize:"18px",marginTop:"4px" }}>→</span>
                )}
              </div>
            </div>
          );
        })}
        <p style={{ color:C.textMuted,fontSize:"10px",fontStyle:"italic",textAlign:"center",
          lineHeight:"1.8",marginTop:"16px" }}>
          These are self-reflection tools, not clinical diagnoses or medical assessments. Results are AI-generated and not reviewed by licensed professionals. Do not use these results to self-diagnose or replace evaluation by a licensed mental health provider. If results concern you, please consult a qualified professional. Selah assumes no liability for interpretations of assessment results.
        </p>
      </div>
    </div>
  );
}

function AssessmentQuiz({ C, font, test, onBack, onComplete }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [showDisclaimer, setShowDisclaimer] = useState(!!test.disclaimer);
  const qs = test.questions;
  const isScale = !!qs[0]?.opts;

  if (showDisclaimer) return (
    <div style={{ minHeight:"100vh",background:C.bgPrimary,fontFamily:font,
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
      padding:"40px 24px",textAlign:"center" }}>
      <span style={{ fontSize:"40px",marginBottom:"16px" }}>{test.icon}</span>
      <h2 style={{ color:C.textPrimary,fontSize:"20px",fontWeight:"normal",margin:"0 0 16px" }}>{test.title}</h2>
      <div style={{ background:`${test.color}12`,border:`1px solid ${test.color}33`,
        borderRadius:"12px",padding:"20px",maxWidth:"360px",marginBottom:"24px" }}>
        <p style={{ color:C.textSoft,fontSize:"13px",fontStyle:"italic",lineHeight:"1.9",margin:0 }}>
          {test.disclaimer}
        </p>
      </div>
      <button onClick={()=>setShowDisclaimer(false)} style={{ background:test.color,border:"none",
        borderRadius:"3px",color:"#fff",fontSize:"10px",letterSpacing:"4px",
        textTransform:"uppercase",padding:"16px 48px",cursor:"pointer",
        fontFamily:font,fontStyle:"italic",marginBottom:"12px" }}>
        Begin Assessment
      </button>
      <button onClick={onBack} style={{ background:"none",border:"none",color:C.textMuted,
        fontSize:"12px",fontStyle:"italic",cursor:"pointer" }}>← Go back</button>
    </div>
  );

  if (result) return (
    <div style={{ minHeight:"100vh",background:C.bgPrimary,fontFamily:font,
      padding:"36px 20px 80px",boxSizing:"border-box" }}>
      <div style={{ maxWidth:"480px",margin:"0 auto" }}>
        <div style={{ textAlign:"center",marginBottom:"24px" }}>
          <span style={{ fontSize:"40px" }}>{test.icon}</span>
          <h2 style={{ color:C.textPrimary,fontSize:"22px",fontWeight:"normal",margin:"12px 0 4px" }}>
            {test.title}
          </h2>
          <div style={{ display:"inline-block",background:`${test.color}22`,borderRadius:"10px",
            padding:"6px 18px",marginBottom:"8px" }}>
            <span style={{ color:test.color,fontSize:"18px",fontWeight:"bold",fontFamily:font }}>{result.label}</span>
          </div>
          {result.type && (
            <p style={{ color:C.textMuted,fontSize:"12px",fontStyle:"italic",margin:"4px 0 0" }}>{result.type}</p>
          )}
        </div>

        {result.isScale && result.pct !== undefined && (
          <div style={{ background:C.bgSecondary,borderRadius:"10px",padding:"16px",
            marginBottom:"16px",border:`1px solid ${C.border}` }}>
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:"6px" }}>
              <span style={{ color:C.textMuted,fontSize:"10px",fontStyle:"italic" }}>Low</span>
              <span style={{ color:C.textMuted,fontSize:"10px",fontStyle:"italic" }}>High</span>
            </div>
            <div style={{ background:C.bgPrimary,borderRadius:"6px",height:"12px",overflow:"hidden" }}>
              <div style={{ background:test.color,height:"100%",borderRadius:"6px",
                width:`${result.pct}%`,transition:"width 1s ease" }}/>
            </div>
            <p style={{ color:test.color,fontSize:"11px",fontWeight:"bold",textAlign:"center",
              margin:"8px 0 0" }}>{result.pct}%</p>
          </div>
        )}

        <div style={{ background:`${test.color}10`,border:`1px solid ${test.color}33`,
          borderRadius:"12px",padding:"20px",marginBottom:"20px" }}>
          <p style={{ color:C.textPrimary,fontSize:"14px",fontStyle:"italic",lineHeight:"2",margin:0 }}>
            {result.description}
          </p>
        </div>

        <div style={{ display:"flex",gap:"10px" }}>
          <button onClick={()=>onComplete(result)} style={{ flex:1,background:test.color,border:"none",
            borderRadius:"3px",color:"#fff",fontSize:"10px",letterSpacing:"3px",
            textTransform:"uppercase",padding:"16px",cursor:"pointer",fontFamily:font,fontStyle:"italic" }}>
            Save Results
          </button>
          <button onClick={()=>{setCurrent(0);setAnswers([]);setResult(null);}} style={{
            background:"none",border:`1px solid ${C.border}`,borderRadius:"3px",
            color:C.textMuted,fontSize:"10px",letterSpacing:"2px",textTransform:"uppercase",
            padding:"16px 20px",cursor:"pointer",fontFamily:font,fontStyle:"italic" }}>
            Retake
          </button>
        </div>
      </div>
    </div>
  );

  const progress = ((current+1)/qs.length)*100;
  const q = qs[current];

  const answer = (val) => {
    const newAnswers = [...answers, val];
    setAnswers(newAnswers);
    if (current + 1 >= qs.length) {
      setTimeout(() => setResult(test.score(newAnswers)), 400);
    } else {
      setTimeout(() => setCurrent(current + 1), 200);
    }
  };

  return (
    <div style={{ minHeight:"100vh",background:C.bgPrimary,fontFamily:font,
      padding:"36px 20px 80px",boxSizing:"border-box" }}>
      <div style={{ maxWidth:"480px",margin:"0 auto" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px" }}>
          <button onClick={onBack} style={{ background:"none",border:"none",
            cursor:"pointer",color:C.textMuted,fontSize:"16px",padding:"4px" }}>←</button>
          <span style={{ color:C.textMuted,fontSize:"11px",fontStyle:"italic" }}>
            {current+1} of {qs.length}
          </span>
          <span style={{ fontSize:"18px" }}>{test.icon}</span>
        </div>
        <div style={{ background:C.bgSecondary,borderRadius:"6px",height:"4px",marginBottom:"28px",overflow:"hidden" }}>
          <div style={{ background:test.color,height:"100%",borderRadius:"6px",
            width:`${progress}%`,transition:"width 0.4s ease" }}/>
        </div>
        <h2 style={{ color:C.textPrimary,fontSize:"18px",fontWeight:"normal",lineHeight:"1.7",
          margin:"0 0 28px",minHeight:"60px" }}>
          {q.q}
        </h2>
        {isScale ? (
          <div style={{ display:"flex",flexDirection:"column",gap:"10px" }}>
            {q.opts.map((opt,i) => (
              <button key={opt} onClick={()=>answer(opt)} style={{
                background:C.bgSecondary,border:`1.5px solid ${C.border}`,
                borderRadius:"10px",padding:"16px 18px",cursor:"pointer",
                textAlign:"left",transition:"all 0.2s ease",
                display:"flex",alignItems:"center",gap:"12px" }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=test.color;e.currentTarget.style.background=`${test.color}10`;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.bgSecondary;}}>
                <div style={{ width:"28px",height:"28px",borderRadius:"50%",
                  background:`${test.color}${15+i*10}`,display:"flex",alignItems:"center",
                  justifyContent:"center",flexShrink:0 }}>
                  <span style={{ color:test.color,fontSize:"11px",fontWeight:"bold" }}>{i+1}</span>
                </div>
                <span style={{ color:C.textPrimary,fontSize:"14px",fontFamily:font }}>{opt}</span>
              </button>
            ))}
          </div>
        ) : (
          <div style={{ display:"flex",flexDirection:"column",gap:"10px" }}>
            <button onClick={()=>answer("a")} style={{
              background:C.bgSecondary,border:`1.5px solid ${C.border}`,
              borderRadius:"10px",padding:"18px 20px",cursor:"pointer",
              textAlign:"left",transition:"all 0.2s ease" }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=test.color;e.currentTarget.style.background=`${test.color}10`;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.bgSecondary;}}>
              <span style={{ color:C.textPrimary,fontSize:"14px",fontFamily:font,lineHeight:"1.7" }}>{q.a}</span>
            </button>
            <button onClick={()=>answer("b")} style={{
              background:C.bgSecondary,border:`1.5px solid ${C.border}`,
              borderRadius:"10px",padding:"18px 20px",cursor:"pointer",
              textAlign:"left",transition:"all 0.2s ease" }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=test.color;e.currentTarget.style.background=`${test.color}10`;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.bgSecondary;}}>
              <span style={{ color:C.textPrimary,fontSize:"14px",fontFamily:font,lineHeight:"1.7" }}>{q.b}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// SUBSCRIPTION SCREEN
// ═══════════════════════════════════════════════════════
function SubscriptionScreen({ C, font, onBack, currentTier, onSelectTier, trialDaysLeft, userEmail, onStripeEmail, onAutoLogin }) {
  const [billing, setBilling] = useState("monthly");
  const [sel, setSel] = useState(null);
  const [showCompare, setShowCompare] = useState(false);

  const TIERS=[
    {id:"free",name:"The Reset",
      monthly:0, annual:0,
      color:C.textMuted,
      tagline:"7 days to explore Selah.",
      features:["Full access for 7 days","AI reflection sessions","Breathing exercises","Notebook & mood tracking","Crisis resources — always"],
      locked:[]},
    {id:"foundation",name:"Foundation",
      monthly:6, annual:50,
      color:C.accent,
      tagline:"Unlimited reflection. Your space, fully yours.",
      features:["Unlimited AI reflections","Daily or weekly anchor refresh","Quick check-in (2-min mode)","Self-discovery assessments","Full session history & streaks","All themes, fonts & customization","\"This Time Last Month\" insights"],
      locked:[]},
    {id:"growth",name:"Growth",
      monthly:12, annual:80,
      color:C.amber, badge:"Most Popular",
      tagline:"Selah starts to know you.",
      features:["Everything in Foundation","Twice-daily anchor refresh","Growth Mirror & AI observations","Personalized check-in questions","Weekly recap email","AI daily encouragement","Tone & faith customization"],
      locked:[]},
    {id:"deep",name:"Deep Reflection",
      monthly:15, annual:100,
      color:C.terra, badge:"Best Value",
      tagline:"The full Selah experience. Nothing held back.",
      features:["Everything in Growth","Hourly anchor refresh","Know Yourself — 100-question AI personality assessment","Pattern detection across sessions","Guided challenges (7, 14, 30-day)","Exclusive AI tones (Mentor, Coach)","Custom reflection categories","Extended conversation memory","Priority responses & early access"],
      locked:[]},
  ];

  // Simple comparison rows — scannable, pushes toward Deep
  const COMPARE_ROWS = [
    { feature:"AI Reflection Sessions",       free:"7 days",  foundation:"Unlimited", growth:"Unlimited",  deep:"Unlimited" },
    { feature:"Biblical Reflections",           free:"—",       foundation:"✓",         growth:"✓",          deep:"✓" },
    { feature:"Armor Up (morning sequence)",      free:"—",       foundation:"✓",         growth:"✓",          deep:"✓" },
    { feature:"Quick Check-in",                free:"Trial",   foundation:"✓",         growth:"✓",          deep:"✓" },
    { feature:"Armor Up (morning sequence)",      free:"—",       foundation:"✓",         growth:"✓",          deep:"✓" },
    { feature:"The Bench (saved insights)",       free:"—",       foundation:"✓",         growth:"✓",          deep:"✓" },
    { feature:"Prayer Wall",                      free:"View",    foundation:"✓",         growth:"✓",          deep:"✓" },
    { feature:"Self-Discovery Assessments",    free:"—",       foundation:"✓",         growth:"✓",          deep:"✓" },
    { feature:"Know Yourself (100Q AI Test)",  free:"—",       foundation:"—",         growth:"—",          deep:"✓" },
    { feature:"Themes & Customization",        free:"—",       foundation:"✓",         growth:"✓",          deep:"✓" },
    { feature:"Personalized Check-in Questions",free:"—",      foundation:"—",         growth:"✓",          deep:"✓" },
    { feature:"Weekly Recap Email",            free:"—",       foundation:"—",         growth:"✓",          deep:"✓" },
    { feature:"AI Encouragement & Resources",  free:"—",       foundation:"—",         growth:"✓",          deep:"✓" },
    { feature:"AI-Matched Resources & Search",  free:"—",       foundation:"Books only", growth:"✓",          deep:"✓" },
    { feature:"Growth Mirror & Observations",  free:"—",       foundation:"—",         growth:"✓",          deep:"✓" },
    { feature:"Tone & Faith Customization",    free:"—",       foundation:"—",         growth:"✓",          deep:"✓" },
    { feature:"Monthly Wellness Goal",          free:"—",       foundation:"—",         growth:"✓",          deep:"✓" },
    { feature:"Pattern Detection",             free:"—",       foundation:"—",         growth:"—",          deep:"✓" },
    { feature:"\"This Time Last Month\"",      free:"—",       foundation:"✓",         growth:"✓",          deep:"✓" },
    { feature:"Guided Challenges",             free:"—",       foundation:"—",         growth:"—",          deep:"✓" },
    { feature:"Exclusive AI Tones",            free:"—",       foundation:"—",         growth:"—",          deep:"✓" },
    { feature:"Custom Reflection Categories",  free:"—",       foundation:"—",         growth:"—",          deep:"✓" },
    { feature:"Extended Memory & Priority",    free:"—",       foundation:"—",         growth:"—",          deep:"✓" },
  ];

  const active = sel ? TIERS.find(t=>t.id===sel) : null;

  const getPrice = (t) => {
    if (t.monthly === 0) return { display:"Free", sub:"forever" };
    if (billing === "annual" && t.annual) return { display:`$${t.annual}`, sub:"/year" };
    return { display:`$${t.monthly}`, sub:"/month" };
  };

  const getMonthly = (t) => {
    if (t.monthly === 0) return null;
    if (billing === "annual" && t.annual) return `$${(t.annual/12).toFixed(0)}/mo`;
    return null;
  };

  const getSavings = (t) => {
    if (!t.annual || t.monthly === 0 || billing !== "annual") return null;
    const fullYear = t.monthly * 12;
    const pct = Math.round((1 - t.annual / fullYear) * 100);
    const saved = fullYear - t.annual;
    return { pct, saved };
  };

  // Stripe Payment Links — LIVE
  const STRIPE_LINKS = {
    foundation_monthly: "https://buy.stripe.com/eVq3codv89r0fUv8KZdjO05",
    foundation_annual: "https://buy.stripe.com/eVq5kwfDg9r08s3gdrdjO04",
    growth_monthly: "https://buy.stripe.com/dRm14g3Uy9r00ZBgdrdjO03",
    growth_annual: "https://buy.stripe.com/5kQ28k76K7iS5fR7GVdjO07",
    deep_monthly: "https://buy.stripe.com/14A6oAcr48mWcIjd1fdjO01",
    deep_annual: "https://buy.stripe.com/4gM8wI8aO5aK9w7f9ndjO00",
  };

  const [paymentPending, setPaymentPending] = useState(false);
  const [pendingTier, setPendingTier] = useState(null);
  const [verifyEmail, setVerifyEmail] = useState(userEmail || "");
  const [verifyStatus, setVerifyStatus] = useState(null); // null | 'checking' | 'success' | 'not_found' | 'error'
  const [verifyAttempts, setVerifyAttempts] = useState(0);

  const handleSubscribe = () => {
    if (!sel || sel === "free") { onSelectTier("free"); onBack(); return; }
    const linkKey = billing === "annual" && TIERS.find(t=>t.id===sel)?.annual
      ? `${sel}_annual` : `${sel}_monthly`;
    const link = STRIPE_LINKS[linkKey];
    if (link) {
      window.open(link, "_blank");
      setPendingTier(sel);
      setPaymentPending(true);
      setVerifyStatus(null);
      setVerifyAttempts(0);
      setVerifyEmail(userEmail || "");
    }
  };

  const confirmPayment = async () => {
    const email = verifyEmail.trim().toLowerCase();
    if (!email) { setVerifyStatus("no_email"); return; }
    setVerifyStatus("checking");
    try {
      const r = await fetch(`/api/verify-payment?email=${encodeURIComponent(email)}`);
      const d = await r.json();
      if (d.verified && d.tier) {
        setVerifyStatus("success");
        setTimeout(() => {
          onSelectTier(d.tier);
          onStripeEmail(email);
          setPaymentPending(false);
          setPendingTier(null);
          setVerifyStatus(null);
          // Auto-trigger login if not already signed in
          if (!userEmail && onAutoLogin) onAutoLogin(email);
          onBack();
        }, 1200);
      } else {
        setVerifyAttempts(prev => prev + 1);
        setVerifyStatus("not_found");
      }
    } catch (e) {
      setVerifyStatus("error");
    }
  };

  return (
    <div style={{ minHeight:"100vh",background:C.bgPrimary,fontFamily:font,
      padding:"36px 20px 80px",boxSizing:"border-box" }}>
      <div style={{ maxWidth:"480px",margin:"0 auto" }}>
        <div style={{ display:"flex",justifyContent:"space-between",
          alignItems:"center",marginBottom:"24px" }}>
          <button onClick={onBack} style={{ background:"none",border:"none",
            cursor:"pointer",color:C.textMuted,fontSize:"20px",padding:"4px 8px 4px 0" }}>←</button>
          <WaveLogo size={24} color={C.accent}/>
          <div style={{ width:"32px" }}/>
        </div>

        {/* Trial banner */}
        {trialDaysLeft > 0 && currentTier === "free" && (
          <div style={{ background:`${C.amber}12`, border:`1.5px solid ${C.amber}44`,
            borderRadius:"12px", padding:"16px 20px", marginBottom:"20px",
            display:"flex", alignItems:"center", gap:"14px" }}>
            <div style={{ width:"48px",height:"48px",borderRadius:"50%",
              background:`${C.amber}22`, display:"flex",alignItems:"center",
              justifyContent:"center",flexShrink:0 }}>
              <span style={{ fontSize:"22px" }}>⏳</span>
            </div>
            <div>
              <p style={{ color:C.amber,fontSize:"10px",letterSpacing:"2.5px",
                textTransform:"uppercase",fontStyle:"italic",margin:"0 0 4px" }}>
                Free Trial Active
              </p>
              <p style={{ color:C.textPrimary,fontSize:"14px",fontWeight:"bold",margin:"0 0 2px" }}>
                {trialDaysLeft} day{trialDaysLeft===1?"":"s"} remaining
              </p>
              <p style={{ color:C.textSoft,fontSize:"11px",fontStyle:"italic",margin:0 }}>
                All features unlocked except Daily Anchor, Assessments, Biblical Reflections, Resources & Reset. Subscribe to keep access.
              </p>
            </div>
          </div>
        )}

        {trialDaysLeft <= 0 && currentTier === "free" && (
          <div style={{ background:`${C.terra}12`, border:`1.5px solid ${C.terra}44`,
            borderRadius:"12px", padding:"16px 20px", marginBottom:"20px",
            textAlign:"center" }}>
            <p style={{ color:C.terra,fontSize:"10px",letterSpacing:"2.5px",
              textTransform:"uppercase",fontStyle:"italic",margin:"0 0 6px" }}>
              Trial Ended
            </p>
            <p style={{ color:C.textPrimary,fontSize:"15px",fontWeight:"bold",margin:"0 0 4px" }}>
              Your 7-day free trial has expired
            </p>
            <p style={{ color:C.textSoft,fontSize:"12px",fontStyle:"italic",margin:0,lineHeight:"1.7" }}>
              Subscribe below to unlock unlimited reflections, personalized AI, and more.
            </p>
          </div>
        )}

        <div style={{ textAlign:"center",marginBottom:"20px" }}>
          <h1 style={{ color:C.textPrimary,fontSize:"clamp(20px,5vw,24px)",
            fontWeight:"normal",margin:"0 0 8px" }}>Choose Your Plan</h1>
          <p style={{ color:C.textSoft,fontSize:"13px",fontStyle:"italic",lineHeight:"1.8",margin:0 }}>
            Start with 7 days free. Most features unlocked — Anchor, Assessments, Biblical Reflections, Resources & Reset require a paid plan.
          </p>
        </div>

        {/* Monthly / Annual toggle */}
        <div style={{ display:"flex",justifyContent:"center",marginBottom:"20px" }}>
          <div style={{ display:"flex",background:C.bgSecondary,borderRadius:"20px",
            padding:"3px",border:`1px solid ${C.border}` }}>
            {["monthly","annual"].map(b=>{
              const active=billing===b;
              return (
                <button key={b} onClick={()=>setBilling(b)} style={{
                  background:active?C.accent:"transparent",
                  border:"none",borderRadius:"18px",
                  color:active?"#fff":C.textMuted,
                  fontSize:"11px",letterSpacing:"1.5px",textTransform:"uppercase",
                  fontStyle:"italic",fontFamily:font,
                  padding:"10px 22px",cursor:"pointer",
                  transition:"all 0.25s ease",position:"relative" }}>
                  {b==="annual"?"Annual":"Monthly"}
                </button>
              );
            })}
          </div>
        </div>

        {/* Annual Discount Banner */}
        {billing==="annual"&&(
          <div style={{ background:"linear-gradient(135deg, #2C5530 0%, #1a3a1e 100%)",
            borderRadius:"12px", padding:"18px 20px", marginBottom:"20px",
            border:`1.5px solid ${C.sage}44`, position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute",top:"-20px",right:"-20px",width:"80px",height:"80px",
              background:`${C.amber}15`,borderRadius:"50%" }}/>
            <div style={{ display:"flex",alignItems:"center",gap:"14px" }}>
              <div style={{ background:`${C.amber}22`,borderRadius:"10px",padding:"8px 14px",
                flexShrink:0 }}>
                <span style={{ color:C.amber,fontSize:"22px",fontWeight:"bold",fontFamily:font }}>
                  44%
                </span>
              </div>
              <div>
                <p style={{ color:"#fff",fontSize:"15px",fontWeight:"bold",margin:"0 0 4px" }}>
                  Save up to 44% with annual billing
                </p>
                <p style={{ color:"rgba(255,255,255,0.7)",fontSize:"11px",fontStyle:"italic",
                  margin:0,lineHeight:"1.6" }}>
                  Pay once a year. Keep more in your pocket.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tier cards */}
        {TIERS.map(t=>{
          const isSel=sel===t.id;
          const price=getPrice(t);
          const savings=getSavings(t);
          const monthlyEquiv=getMonthly(t);
          const isCurrent = currentTier === t.id;
          return (
            <div key={t.id} onClick={()=>setSel(t.id)} style={{
              background:isSel?`${t.color}15`:C.bgSecondary,
              border:`2px solid ${isSel?t.color+"66":isCurrent?C.sage+"44":"transparent"}`,
              borderRadius:"12px",padding:"16px 18px",marginBottom:"10px",
              cursor:"pointer",transition:"all 0.25s ease",position:"relative" }}>
              {isCurrent&&(
                <div style={{ position:"absolute",top:"-8px",right:"14px",
                  background:C.sage,borderRadius:"8px",padding:"2px 10px" }}>
                  <span style={{ color:"#fff",fontSize:"8px",letterSpacing:"2px",
                    textTransform:"uppercase" }}>Current</span>
                </div>
              )}
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex",alignItems:"center",gap:"8px",flexWrap:"wrap",marginBottom:"4px" }}>
                    {t.badge&&(
                      <div style={{ display:"inline-block",background:`${t.color}22`,
                        borderRadius:"10px",padding:"2px 10px" }}>
                        <span style={{ color:t.color,fontSize:"8px",letterSpacing:"2px",
                          textTransform:"uppercase",fontStyle:"italic" }}>{t.badge}</span>
                      </div>
                    )}
                  </div>
                  <div style={{ display:"flex",alignItems:"center",gap:"8px",marginBottom:"2px" }}>
                    <h3 style={{ color:isSel?t.color:C.textPrimary,fontSize:"15px",
                      fontWeight:"bold",fontFamily:font,margin:0,transition:"color 0.2s ease" }}>
                      {t.name}
                    </h3>
                    {isSel&&<div style={{ width:"18px",height:"18px",borderRadius:"50%",
                      background:t.color,display:"flex",alignItems:"center",justifyContent:"center" }}>
                      <span style={{ color:"#fff",fontSize:"9px" }}>✓</span>
                    </div>}
                  </div>
                  <p style={{ color:C.textMuted,fontSize:"11px",fontStyle:"italic",margin:"0 0 8px" }}>{t.tagline}</p>
                  {isSel&&<div style={{ display:"flex",flexDirection:"column",gap:"4px" }}>
                    {t.features.map(f=>(
                      <div key={f} style={{ display:"flex",gap:"6px",alignItems:"center" }}>
                        <div style={{ width:"4px",height:"4px",borderRadius:"50%",background:t.color }}/>
                        <span style={{ color:C.textSoft,fontSize:"11px",fontStyle:"italic" }}>{f}</span>
                      </div>
                    ))}
                  </div>}
                </div>
                <div style={{ textAlign:"right",flexShrink:0,marginLeft:"14px" }}>
                  <p style={{ color:isSel?t.color:C.textPrimary,fontSize:"20px",fontWeight:"bold",
                    fontFamily:font,margin:0,lineHeight:1 }}>{price.display}</p>
                  <p style={{ color:C.textMuted,fontSize:"10px",fontStyle:"italic",margin:"2px 0 0" }}>
                    {price.sub}
                  </p>
                  {monthlyEquiv&&<p style={{ color:C.amber,fontSize:"9px",fontWeight:"bold",
                    margin:"4px 0 0" }}>({monthlyEquiv})</p>}
                </div>
              </div>
            </div>
          );
        })}

        {/* Compare Plans button */}
        <button onClick={()=>setShowCompare(true)} style={{ width:"100%", marginBottom:"10px",
          background:"transparent", border:`1px solid ${C.accent}44`,
          borderRadius:"8px", padding:"14px", cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"center", gap:"8px",
          transition:"all 0.2s ease" }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor=C.accent;e.currentTarget.style.background=`${C.accent}08`;}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor=C.accent+"44";e.currentTarget.style.background="transparent";}}>
          <span style={{ fontSize:"14px" }}>⚖️</span>
          <span style={{ color:C.accent, fontSize:"10px", letterSpacing:"3px",
            textTransform:"uppercase", fontStyle:"italic", fontFamily:font }}>
            Compare All Plans
          </span>
        </button>

        {/* Comparison overlay */}
        {showCompare && (
          <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)",
            zIndex:500, display:"flex", alignItems:"flex-end", justifyContent:"center" }}
            onClick={(e)=>{if(e.target===e.currentTarget) setShowCompare(false);}}>
            <div style={{ background:C.bgPrimary, borderRadius:"16px 16px 0 0",
              width:"100%", maxWidth:"600px", maxHeight:"85vh", overflow:"hidden",
              display:"flex", flexDirection:"column" }}>
              {/* Header */}
              <div style={{ padding:"20px 20px 14px", borderBottom:`1px solid ${C.border}`,
                display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 }}>
                <div>
                  <h2 style={{ color:C.textPrimary, fontSize:"18px", fontWeight:"normal",
                    fontFamily:font, margin:"0 0 4px" }}>Compare Plans</h2>
                  <p style={{ color:C.textMuted, fontSize:"11px", fontStyle:"italic", margin:0 }}>
                    More features. More growth. Only $3 between tiers.
                  </p>
                </div>
                <button onClick={()=>setShowCompare(false)} style={{ background:"none",
                  border:"none", cursor:"pointer", color:C.textMuted, fontSize:"20px",
                  padding:"4px 8px" }}>✕</button>
              </div>

              {/* Deep Reflection highlight banner */}
              <div style={{ padding:"12px 20px", background:`${C.terra}10`,
                borderBottom:`1px solid ${C.terra}22`, flexShrink:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                  <div style={{ background:`${C.terra}22`, borderRadius:"8px", padding:"4px 10px" }}>
                    <span style={{ color:C.terra, fontSize:"10px", fontWeight:"bold",
                      letterSpacing:"2px", textTransform:"uppercase" }}>Best Value</span>
                  </div>
                  <p style={{ color:C.textSoft, fontSize:"11px", fontStyle:"italic", margin:0, flex:1 }}>
                    Deep Reflection — 6 exclusive features for just $3 more than Growth
                  </p>
                </div>
              </div>

              {/* Sticky column header */}
              <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr",
                gap:"0", borderBottom:`2px solid ${C.border}`, flexShrink:0,
                padding:"10px 16px", background:C.bgSecondary }}>
                <div style={{ padding:"4px 0" }}>
                  <span style={{ color:C.textMuted, fontSize:"8px", letterSpacing:"2px",
                    textTransform:"uppercase" }}>Feature</span>
                </div>
                {TIERS.map(t=>(
                  <div key={t.id} style={{ textAlign:"center", padding:"4px 2px" }}>
                    <p style={{ color:t.id==="deep"?C.terra:t.color, fontSize:"8px", letterSpacing:"1px",
                      textTransform:"uppercase", fontWeight:"bold", margin:"0",
                      fontFamily:font }}>{t.id==="free"?"Free":t.id==="foundation"?"Found.":t.id==="growth"?"Growth":"Deep"}</p>
                    <p style={{ color:C.textMuted, fontSize:"8px", margin:"2px 0 0" }}>
                      {t.monthly===0?"$0":`$${t.monthly}`}
                    </p>
                  </div>
                ))}
              </div>

              {/* Scrollable rows */}
              <div style={{ flex:1, overflowY:"auto", padding:"0 16px 20px" }}>
                {COMPARE_ROWS.map((row, i)=>{
                  const isDeepOnly = row.free==="—" && row.foundation==="—" && row.growth==="—" && row.deep==="✓";
                  return (
                    <div key={i} style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr",
                      gap:"0", padding:"10px 0", borderBottom:`1px solid ${C.border}33`,
                      background:isDeepOnly?`${C.terra}06`:"transparent" }}>
                      <p style={{ color:isDeepOnly?C.terra:C.textSoft, fontSize:"11px",
                        fontStyle:"italic", margin:0, lineHeight:"1.4", paddingRight:"8px",
                        fontWeight:isDeepOnly?"bold":"normal" }}>{row.feature}</p>
                      {["free","foundation","growth","deep"].map(tid=>{
                        const val = row[tid];
                        const isCheck = val === "✓";
                        const isDash = val === "—";
                        const tierColor = TIERS.find(t=>t.id===tid).color;
                        return (
                          <div key={tid} style={{ textAlign:"center", display:"flex",
                            alignItems:"center", justifyContent:"center" }}>
                            {isCheck ? (
                              <div style={{ width:"18px", height:"18px", borderRadius:"50%",
                                background:`${tierColor}22`,
                                display:"flex", alignItems:"center", justifyContent:"center" }}>
                                <span style={{ color:tierColor, fontSize:"10px", fontWeight:"bold" }}>✓</span>
                              </div>
                            ) : isDash ? (
                              <span style={{ color:C.textMuted, fontSize:"12px", opacity:0.25 }}>—</span>
                            ) : (
                              <span style={{ color:C.textSoft, fontSize:"10px", fontStyle:"italic" }}>{val}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}

                {/* Bottom CTA pushing Deep */}
                <div style={{ textAlign:"center", padding:"24px 0 8px" }}>
                  <div style={{ background:`${C.terra}12`, border:`1.5px solid ${C.terra}33`,
                    borderRadius:"12px", padding:"18px 20px", marginBottom:"16px" }}>
                    <p style={{ color:C.terra, fontSize:"10px", letterSpacing:"3px",
                      textTransform:"uppercase", fontStyle:"italic", margin:"0 0 8px" }}>
                      Recommended
                    </p>
                    <p style={{ color:C.textPrimary, fontSize:"16px", fontWeight:"bold",
                      fontFamily:font, margin:"0 0 4px" }}>
                      Deep Reflection — $15/mo
                    </p>
                    <p style={{ color:C.textSoft, fontSize:"12px", fontStyle:"italic",
                      lineHeight:"1.7", margin:"0 0 14px" }}>
                      The full Selah experience. Know Yourself assessment, pattern detection, guided challenges, exclusive tones, and everything else — nothing held back.
                    </p>
                    <button onClick={()=>{setShowCompare(false);setSel("deep");}} style={{
                      background:C.terra, border:"none", borderRadius:"3px",
                      color:"#fff", fontSize:"10px", letterSpacing:"3px",
                      textTransform:"uppercase", padding:"14px 40px", cursor:"pointer",
                      fontFamily:font, fontStyle:"italic",
                      boxShadow:`0 2px 12px ${C.terra}44` }}>
                      Select Deep Reflection
                    </button>
                  </div>
                  <button onClick={()=>setShowCompare(false)} style={{
                    background:"none", border:"none", color:C.textMuted,
                    fontSize:"11px", fontStyle:"italic", cursor:"pointer",
                    fontFamily:font, textDecoration:"underline" }}>
                    Back to plans
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Testimonials */}
        {!showCompare && !paymentPending && (
          <div style={{ background:`${C.bgSecondary}`,borderRadius:"12px",padding:"20px",
            marginBottom:"16px",border:`1px solid ${C.border}` }}>
            <p style={{ color:C.textMuted,fontSize:"9px",letterSpacing:"2.5px",
              textTransform:"uppercase",fontStyle:"italic",margin:"0 0 14px",textAlign:"center" }}>
              What People Are Saying
            </p>
            {[
              { text:"I've tried every journaling app out there. Selah is the first one that actually talks back — and says something worth hearing.", tag:"Clarity & Reflection" },
              { text:"It's not soft. It's not preachy. It just meets you where you are and helps you think straight.", tag:"Mental Wellness" },
              { text:"I opened it expecting another self-help gimmick. Three weeks later I haven't missed a day.", tag:"Daily Discipline" },
            ].map((t,i)=>(
              <div key={i} style={{ padding:"12px 0",borderBottom:i<2?`1px solid ${C.border}`:"none" }}>
                <p style={{ color:C.textSoft,fontSize:"12px",fontStyle:"italic",
                  lineHeight:"1.8",margin:"0 0 6px" }}>"{t.text}"</p>
                <div style={{ display:"flex",alignItems:"center",gap:"6px" }}>
                  <div style={{ width:"4px",height:"4px",borderRadius:"50%",background:C.accent }}/>
                  <span style={{ color:C.accent,fontSize:"8px",letterSpacing:"2px",
                    textTransform:"uppercase",fontStyle:"italic" }}>{t.tag}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Subscribe button */}
        {paymentPending ? (
          <div style={{ background:`${C.sage}12`, border:`1.5px solid ${C.sage}33`,
            borderRadius:"12px", padding:"24px 20px", marginTop:"6px", textAlign:"center" }}>
            {verifyStatus === "success" ? (
              <>
                <span style={{ fontSize:"28px", display:"block", marginBottom:"12px" }}>✅</span>
                <p style={{ color:C.sage, fontSize:"15px", fontWeight:"bold",
                  fontFamily:font, margin:"0 0 8px" }}>Payment Verified!</p>
                <p style={{ color:C.textSoft, fontSize:"12px", fontStyle:"italic",
                  lineHeight:"1.8", margin:0 }}>
                  Activating your plan now...
                </p>
              </>
            ) : (
              <>
                <span style={{ fontSize:"28px", display:"block", marginBottom:"12px" }}>🔐</span>
                <p style={{ color:C.textPrimary, fontSize:"15px", fontWeight:"bold",
                  fontFamily:font, margin:"0 0 8px" }}>Verify Your Payment</p>
                <p style={{ color:C.textSoft, fontSize:"12px", fontStyle:"italic",
                  lineHeight:"1.8", margin:"0 0 16px" }}>
                  A Stripe checkout window has opened. After completing payment, enter the email you used at checkout and tap verify.
                </p>
                <input
                  type="email"
                  value={verifyEmail}
                  onChange={e => setVerifyEmail(e.target.value)}
                  placeholder="Email used at Stripe checkout"
                  style={{
                    width:"100%", padding:"14px 16px", borderRadius:"8px",
                    border:`1.5px solid ${C.border}`, background:C.bgCard,
                    color:C.textPrimary, fontSize:"14px", fontFamily:font,
                    boxSizing:"border-box", marginBottom:"12px", outline:"none",
                  }}
                />
                {verifyStatus === "no_email" && (
                  <p style={{ color:C.terra, fontSize:"11px", fontStyle:"italic", margin:"0 0 12px" }}>
                    Please enter the email you used during checkout.
                  </p>
                )}
                {verifyStatus === "not_found" && (
                  <p style={{ color:C.amber, fontSize:"11px", fontStyle:"italic", margin:"0 0 12px", lineHeight:"1.7" }}>
                    {verifyAttempts < 3
                      ? "Payment not found yet. Stripe can take 1–2 minutes to process. Please wait a moment and try again."
                      : "Still not found. Double-check the email matches what you entered at Stripe checkout. If you just completed payment, please wait a moment and retry."}
                  </p>
                )}
                {verifyStatus === "error" && (
                  <p style={{ color:C.terra, fontSize:"11px", fontStyle:"italic", margin:"0 0 12px" }}>
                    Connection error. Please check your internet and try again.
                  </p>
                )}
                <button onClick={confirmPayment} disabled={verifyStatus === "checking"} style={{ width:"100%",
                  background: verifyStatus === "checking" ? C.textMuted : C.sage,
                  border:"none", borderRadius:"3px",
                  color:"#fff", fontSize:"10px", letterSpacing:"4px", textTransform:"uppercase",
                  padding:"18px", cursor: verifyStatus === "checking" ? "default" : "pointer",
                  fontFamily:font, fontStyle:"italic",
                  boxShadow:`0 4px 16px ${C.sage}44`, marginBottom:"10px",
                  opacity: verifyStatus === "checking" ? 0.7 : 1 }}>
                  {verifyStatus === "checking" ? "Verifying..." : "Verify Payment"}
                </button>
                <button onClick={()=>{setPaymentPending(false);setPendingTier(null);setVerifyStatus(null);setVerifyAttempts(0);}} style={{
                  width:"100%", background:"transparent", border:`1px solid ${C.border}`,
                  borderRadius:"3px", color:C.textMuted, fontSize:"10px", letterSpacing:"2px",
                  textTransform:"uppercase", padding:"14px", cursor:"pointer",
                  fontFamily:font, fontStyle:"italic" }}>
                  Cancel
                </button>
              </>
            )}
          </div>
        ) : sel && sel !== "free" && (
          <button onClick={handleSubscribe} style={{ width:"100%", marginTop:"6px",
            background:active?.color||C.accent, border:"none", borderRadius:"3px",
            color:"#fff", fontSize:"10px", letterSpacing:"4px", textTransform:"uppercase",
            padding:"18px", cursor:"pointer", fontFamily:font, fontStyle:"italic",
            boxShadow:`0 4px 16px ${active?.color||C.accent}44`,
            transition:"all 0.3s ease" }}>
            {STRIPE_LINKS[`${sel}_${billing==="annual"&&TIERS.find(t=>t.id===sel)?.annual?"annual":"monthly"}`]
              ? `Subscribe — ${getPrice(active).display}${getPrice(active).sub}`
              : "Coming Soon — Stay on Free Trial"}
          </button>
        )}

        {sel === "free" && (
          <button onClick={handleSubscribe} style={{ width:"100%", marginTop:"6px",
            background:C.textMuted, border:"none", borderRadius:"3px",
            color:"#fff", fontSize:"10px", letterSpacing:"4px", textTransform:"uppercase",
            padding:"18px", cursor:"pointer", fontFamily:font, fontStyle:"italic" }}>
            Continue Free
          </button>
        )}

        {/* Secure payment note */}
        <div style={{ display:"flex",alignItems:"center",justifyContent:"center",
          gap:"6px",marginTop:"14px",marginBottom:"6px" }}>
          <span style={{ fontSize:"12px" }}>🔒</span>
          <p style={{ color:C.textMuted,fontSize:"10px",fontStyle:"italic",margin:0 }}>
            Secure payment powered by Stripe · Cancel anytime
          </p>
          <p style={{ color:C.textMuted,fontSize:"8px",fontStyle:"italic",margin:"10px 0 0",
            lineHeight:"1.7",maxWidth:"340px",marginLeft:"auto",marginRight:"auto" }}>
            Selah is not therapy or medical advice. Subscription does not create a patient-provider relationship.
            Call 988 or 911 in a crisis.
          </p>
        </div>

        <button onClick={onBack} style={{ width:"100%", marginTop:"10px",
          background:"transparent", border:`1px solid ${C.border}`, borderRadius:"3px",
          color:C.textMuted, fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase",
          padding:"14px", cursor:"pointer", fontFamily:font, fontStyle:"italic" }}>
          Back to Settings
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// FOUNDER NOTE
// ═══════════════════════════════════════════════════════
function FounderNote({ C, font, onClose }) {
  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",
      display:"flex",alignItems:"center",justifyContent:"center",
      zIndex:300,padding:"24px",fontFamily:font }}>
      <div style={{ background:C.bgPrimary,borderRadius:"12px",padding:"32px 28px",
        maxWidth:"420px",width:"100%",maxHeight:"80vh",overflowY:"auto",
        border:`1px solid ${C.accent}33` }}>
        <div style={{ display:"flex",justifyContent:"space-between",
          alignItems:"flex-start",marginBottom:"24px" }}>
          <div>
            <p style={{ color:C.amber,fontSize:"9px",letterSpacing:"3px",
              textTransform:"uppercase",fontStyle:"italic",margin:"0 0 4px" }}>A Note From The Founder</p>
            <WaveLogo size={28} color={C.accent}/>
          </div>
          <button onClick={onClose} style={{ background:"none",border:"none",
            cursor:"pointer",color:C.textMuted,fontSize:"20px",padding:"0" }}>✕</button>
        </div>

        <p style={{ color:C.textSoft,fontSize:"14px",fontStyle:"italic",
          lineHeight:"2.1",margin:"0 0 18px",fontWeight:"bold" }}>
          I know what it's like to not be okay and have no one to tell.
        </p>

        <p style={{ color:C.textSoft,fontSize:"13px",fontStyle:"italic",
          lineHeight:"2.1",margin:"0 0 16px" }}>
          I've been the person lying awake at 2am with a chest full of things I couldn't name. I've smiled through days that were breaking me. I've sat in rooms full of people and felt completely alone. I know what it's like to want to talk but not know where to start — or to feel like your problems aren't "bad enough" to deserve help.
        </p>

        <p style={{ color:C.textSoft,fontSize:"13px",fontStyle:"italic",
          lineHeight:"2.1",margin:"0 0 16px" }}>
          I didn't build Selah because I had it figured out. I built it because I didn't. Because I needed something like this and it didn't exist. A place with no judgment. No waiting rooms. No explaining yourself to someone who doesn't understand. Just a space to breathe, to think, to be honest with yourself for the first time in a long time.
        </p>

        <p style={{ color:C.textSoft,fontSize:"13px",fontStyle:"italic",
          lineHeight:"2.1",margin:"0 0 16px" }}>
          If you're here, I already know something about you — you haven't given up. Something in you is still reaching, still searching, still fighting even when you're tired. That's not weakness. That's the kind of strength most people will never understand.
        </p>

        <p style={{ color:C.textPrimary,fontSize:"14px",fontStyle:"italic",
          lineHeight:"2.1",margin:"0 0 16px",fontWeight:"bold" }}>
          I need you to hear this: the darkness you're sitting in right now is not where your story ends.
        </p>

        <p style={{ color:C.textSoft,fontSize:"13px",fontStyle:"italic",
          lineHeight:"2.1",margin:"0 0 16px" }}>
          You are not too broken. You are not too far gone. You are not too late. The fact that you're here — reading this, trying this — is proof that something inside you still believes there's more. And there is. I promise you there is.
        </p>

        <p style={{ color:C.textSoft,fontSize:"13px",fontStyle:"italic",
          lineHeight:"2.1",margin:"0 0 20px" }}>
          Selah exists because you deserve a place to heal without asking permission. Use it on your hardest days. Use it on your quiet days. Use it when you don't have words — sometimes just showing up is the breakthrough.
        </p>

        <p style={{ color:C.accent,fontSize:"14px",fontStyle:"italic",
          lineHeight:"2.1",margin:"0 0 4px",fontWeight:"bold" }}>
          I'm building this for you. I'm building this with you. And I'm not stopping.
        </p>

        <div style={{ display:"flex",alignItems:"center",gap:"10px",margin:"20px 0 16px" }}>
          <div style={{ flex:1,height:"1px",background:C.accent,opacity:0.3 }}/>
          <span style={{ color:C.textMuted,fontSize:"10px",letterSpacing:"2px",
            textTransform:"uppercase",fontStyle:"italic" }}>ZS</span>
          <div style={{ flex:1,height:"1px",background:C.accent,opacity:0.3 }}/>
        </div>
        <p style={{ color:C.textMuted,fontSize:"11px",fontStyle:"italic",
          textAlign:"center",lineHeight:"1.8",margin:0 }}>
          "Even though I walk through the valley of the shadow of death, I will fear no evil, for you are with me."
        </p>
        <p style={{ color:C.sageLight,fontSize:"9px",letterSpacing:"2px",
          textTransform:"uppercase",textAlign:"center",margin:"6px 0 0" }}>Psalm 23:4</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// FEEDBACK & REVIEW SCREEN
// ═══════════════════════════════════════════════════════
function FeedbackScreen({ C, font, setScreen, feedbackEntries, onSubmit, userName }) {
  const [rating, setRating] = useState(null);
  const [what, setWhat] = useState(""); // what do you like
  const [improve, setImprove] = useState(""); // what to improve
  const [feature, setFeature] = useState(""); // feature request
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating === null) return;
    const entry = {
      id: Date.now(),
      date: new Date().toISOString(),
      rating,
      what: what.trim(),
      improve: improve.trim(),
      feature: feature.trim(),
    };
    onSubmit(entry);
    setSubmitted(true);
    // Send to email in background
    fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rating,
        what: what.trim(),
        improve: improve.trim(),
        feature: feature.trim(),
        userName: userName || "Anonymous",
      }),
    }).catch(() => {}); // silent fail — local save already worked
  };

  if (submitted) return (
    <div style={{ minHeight:"100vh", background:C.bgPrimary, fontFamily:font,
      display:"flex", flexDirection:"column", alignItems:"center",
      justifyContent:"center", padding:"40px 24px", textAlign:"center" }}>
      <div style={{ maxWidth:"400px", width:"100%" }}>
        <div style={{ fontSize:"48px", marginBottom:"16px" }}>🤍</div>
        <h1 style={{ color:C.textPrimary, fontSize:"clamp(20px,5vw,26px)",
          fontWeight:"normal", margin:"0 0 12px" }}>
          This means everything.
        </h1>
        <p style={{ color:C.textSoft, fontSize:"14px", fontStyle:"italic",
          lineHeight:"2", margin:"0 0 8px" }}>
          {userName ? `${userName}, thank you` : "Thank you"} for taking the time. Every piece of feedback shapes what Selah becomes. You're not just using this — you're building it with me.
        </p>
        <p style={{ color:C.accent, fontSize:"13px", fontStyle:"italic",
          lineHeight:"1.9", margin:"0 0 32px" }}>
          I read every single one. — ZS
        </p>
        <button onClick={()=>setScreen("home")} style={{
          background:C.accent, border:"none", borderRadius:"3px",
          color:"#fff", fontSize:"10px", letterSpacing:"3px",
          textTransform:"uppercase", padding:"16px 40px", cursor:"pointer",
          fontFamily:font, fontStyle:"italic" }}>
          Back Home
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:C.bgPrimary, fontFamily:font,
      padding:"32px 20px 100px", boxSizing:"border-box" }}>
      <div style={{ maxWidth:"520px", margin:"0 auto" }}>

        <button onClick={()=>setScreen("home")} style={{ background:"none", border:"none",
          cursor:"pointer", color:C.textMuted, fontSize:"18px", padding:"0 0 20px", display:"block" }}>←</button>

        <Label text="Your Voice Matters" color={C.accent} font={font}/>
        <h1 style={{ color:C.textPrimary, fontSize:"clamp(20px,5vw,26px)",
          fontWeight:"normal", margin:"0 0 8px" }}>Help shape Selah.</h1>
        <p style={{ color:C.textSoft, fontSize:"13px", fontStyle:"italic",
          lineHeight:"1.9", margin:"0 0 28px" }}>
          Selah is still growing — and your honesty helps it grow in the right direction. There are no wrong answers here. Tell me what's working, what's not, and what you wish existed.
        </p>

        {/* Rating */}
        <div style={{ background:C.bgSecondary, borderRadius:"10px",
          padding:"20px", marginBottom:"16px", border:`1px solid ${C.border}` }}>
          <p style={{ color:C.textPrimary, fontSize:"14px", fontFamily:font,
            margin:"0 0 4px" }}>How would you rate your experience?</p>
          <p style={{ color:C.textMuted, fontSize:"11px", fontStyle:"italic", margin:"0 0 16px" }}>
            Be honest — it helps more than being polite.
          </p>
          <div style={{ display:"flex", gap:"8px", justifyContent:"center" }}>
            {[1,2,3,4,5].map(n => (
              <button key={n} onClick={()=>setRating(n)} style={{
                width:"52px", height:"52px", borderRadius:"50%",
                background: rating===n ? `${C.accent}22` : C.bgPrimary,
                border: `2px solid ${rating===n ? C.accent : "transparent"}`,
                cursor:"pointer", transition:"all 0.2s ease",
                display:"flex", alignItems:"center", justifyContent:"center",
                flexDirection:"column", gap:"2px" }}
                onMouseEnter={e=>{if(rating!==n)e.currentTarget.style.borderColor=C.accent+"55";}}
                onMouseLeave={e=>{if(rating!==n)e.currentTarget.style.borderColor="transparent";}}>
                <span style={{ fontSize:"18px" }}>{["😔","😕","😐","🙂","😌"][n-1]}</span>
              </button>
            ))}
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:"8px", padding:"0 4px" }}>
            <span style={{ color:C.textMuted, fontSize:"9px", fontStyle:"italic" }}>Needs work</span>
            <span style={{ color:C.textMuted, fontSize:"9px", fontStyle:"italic" }}>Love it</span>
          </div>
        </div>

        {/* What's working */}
        <div style={{ background:C.bgSecondary, borderRadius:"10px",
          padding:"20px", marginBottom:"16px", border:`1px solid ${C.border}` }}>
          <p style={{ color:C.textPrimary, fontSize:"14px", fontFamily:font,
            margin:"0 0 4px" }}>What's working well?</p>
          <p style={{ color:C.textMuted, fontSize:"11px", fontStyle:"italic", margin:"0 0 12px" }}>
            What keeps you coming back? What feels right?
          </p>
          <textarea value={what} onChange={e=>setWhat(e.target.value)}
            placeholder="The breathing exercises calm me down, the notebook prompts are on point..."
            style={{ width:"100%", minHeight:"80px", boxSizing:"border-box",
              background:C.bgPrimary, border:`1.5px solid ${what?C.accent+"55":"transparent"}`,
              borderRadius:"8px", padding:"12px", color:C.textPrimary,
              fontSize:"13px", fontStyle:"italic", fontFamily:font,
              lineHeight:"1.8", resize:"none", outline:"none",
              transition:"border-color 0.2s ease" }}/>
        </div>

        {/* What needs improvement */}
        <div style={{ background:C.bgSecondary, borderRadius:"10px",
          padding:"20px", marginBottom:"16px", border:`1px solid ${C.border}` }}>
          <p style={{ color:C.textPrimary, fontSize:"14px", fontFamily:font,
            margin:"0 0 4px" }}>What could be better?</p>
          <p style={{ color:C.textMuted, fontSize:"11px", fontStyle:"italic", margin:"0 0 12px" }}>
            Be direct — this is how Selah gets better. Nothing is off limits.
          </p>
          <textarea value={improve} onChange={e=>setImprove(e.target.value)}
            placeholder="Sometimes the AI responses feel generic, I wish the notebook saved automatically..."
            style={{ width:"100%", minHeight:"80px", boxSizing:"border-box",
              background:C.bgPrimary, border:`1.5px solid ${improve?C.terra+"55":"transparent"}`,
              borderRadius:"8px", padding:"12px", color:C.textPrimary,
              fontSize:"13px", fontStyle:"italic", fontFamily:font,
              lineHeight:"1.8", resize:"none", outline:"none",
              transition:"border-color 0.2s ease" }}/>
        </div>

        {/* Feature request */}
        <div style={{ background:C.bgSecondary, borderRadius:"10px",
          padding:"20px", marginBottom:"24px", border:`1px solid ${C.border}` }}>
          <p style={{ color:C.textPrimary, fontSize:"14px", fontFamily:font,
            margin:"0 0 4px" }}>If you could add one thing, what would it be?</p>
          <p style={{ color:C.textMuted, fontSize:"11px", fontStyle:"italic", margin:"0 0 12px" }}>
            Dream big. What would make Selah perfect for you?
          </p>
          <textarea value={feature} onChange={e=>setFeature(e.target.value)}
            placeholder="A community space, guided meditation, a partner mode for couples..."
            style={{ width:"100%", minHeight:"80px", boxSizing:"border-box",
              background:C.bgPrimary, border:`1.5px solid ${feature?C.sage+"55":"transparent"}`,
              borderRadius:"8px", padding:"12px", color:C.textPrimary,
              fontSize:"13px", fontStyle:"italic", fontFamily:font,
              lineHeight:"1.8", resize:"none", outline:"none",
              transition:"border-color 0.2s ease" }}/>
        </div>

        {/* Submit */}
        <button onClick={handleSubmit} disabled={rating===null}
          style={{
            width:"100%", background:rating!==null?C.accent:C.bgCard,
            border:"none", borderRadius:"3px",
            color:rating!==null?"#fff":C.textMuted,
            fontSize:"11px", letterSpacing:"3px", textTransform:"uppercase",
            padding:"18px", cursor:rating!==null?"pointer":"default",
            fontFamily:font, fontStyle:"italic", transition:"all 0.3s ease",
            boxShadow:rating!==null?`0 4px 16px ${C.accent}33`:"none",
            marginBottom:"24px" }}>
          Submit Feedback
        </button>

        {/* Past reviews */}
        {feedbackEntries && feedbackEntries.length > 0 && (
          <div style={{ marginTop:"8px" }}>
            <Label text="Your Past Reviews" color={C.textMuted} font={font}/>
            {feedbackEntries.slice(0,5).map(fb => {
              const d = new Date(fb.date);
              const ago = Math.floor((Date.now() - d.getTime()) / (1000*60*60*24));
              const dateStr = ago === 0 ? "Today" : ago === 1 ? "Yesterday" : `${ago} days ago`;
              return (
                <div key={fb.id} style={{ background:C.bgSecondary, borderRadius:"8px",
                  padding:"14px 16px", marginBottom:"8px", border:`1px solid ${C.border}` }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"6px" }}>
                    <div style={{ display:"flex", gap:"3px" }}>
                      {[1,2,3,4,5].map(n => (
                        <span key={n} style={{ fontSize:"14px", opacity:n<=fb.rating?1:0.2 }}>
                          {["😔","😕","😐","🙂","😌"][n-1]}
                        </span>
                      ))}
                    </div>
                    <span style={{ color:C.textMuted, fontSize:"10px", fontStyle:"italic" }}>{dateStr}</span>
                  </div>
                  {fb.what && <p style={{ color:C.textSoft, fontSize:"11px", fontStyle:"italic",
                    lineHeight:"1.7", margin:"4px 0 0" }}>
                    <span style={{ color:C.accent, fontSize:"9px", letterSpacing:"1px", textTransform:"uppercase" }}>Liked: </span>
                    {fb.what.slice(0,100)}{fb.what.length>100?"...":""}
                  </p>}
                  {fb.improve && <p style={{ color:C.textSoft, fontSize:"11px", fontStyle:"italic",
                    lineHeight:"1.7", margin:"4px 0 0" }}>
                    <span style={{ color:C.terra, fontSize:"9px", letterSpacing:"1px", textTransform:"uppercase" }}>Improve: </span>
                    {fb.improve.slice(0,100)}{fb.improve.length>100?"...":""}
                  </p>}
                </div>
              );
            })}
          </div>
        )}

        <div style={{ textAlign:"center", marginTop:"20px",
          borderTop:`1px solid ${C.border}`, paddingTop:"20px" }}>
          <p style={{ color:C.textMuted, fontSize:"11px", fontStyle:"italic",
            lineHeight:"1.8", margin:0 }}>
            Your voice shapes what Selah becomes.
          </p>
          <p style={{ color:C.accent, fontSize:"9px", letterSpacing:"2px",
            textTransform:"uppercase", margin:"4px 0 0" }}>Every review is read personally</p>
        </div>

      </div>
    </div>
  );
}

// Weekly Feedback Popup
function FeedbackPopup({ C, font, onGoToFeedback, onDismiss }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.55)",
      display:"flex", alignItems:"center", justifyContent:"center",
      zIndex:400, padding:"24px", fontFamily:font }}>
      <div style={{ background:C.bgPrimary, borderRadius:"16px", padding:"32px 24px",
        maxWidth:"360px", width:"100%", textAlign:"center",
        border:`1px solid ${C.accent}33`,
        animation:"fadeInUp 0.4s ease" }}>

        <div style={{ fontSize:"32px", marginBottom:"12px" }}>💬</div>

        <h2 style={{ color:C.textPrimary, fontSize:"20px", fontWeight:"normal",
          margin:"0 0 8px" }}>
          Quick check — how's Selah feeling?
        </h2>
        <p style={{ color:C.textSoft, fontSize:"13px", fontStyle:"italic",
          lineHeight:"1.9", margin:"0 0 24px" }}>
          You've been here a while now. I'd love to know what's working and what's not. Takes about a minute.
        </p>

        <button onClick={onGoToFeedback} style={{
          width:"100%", background:C.accent, border:"none", borderRadius:"3px",
          color:"#fff", fontSize:"10px", letterSpacing:"3px",
          textTransform:"uppercase", padding:"16px", cursor:"pointer",
          fontFamily:font, fontStyle:"italic", marginBottom:"10px",
          boxShadow:`0 2px 12px ${C.accent}33` }}>
          Share My Thoughts
        </button>

        <button onClick={onDismiss} style={{
          width:"100%", background:"none", border:`1px solid ${C.border}`,
          borderRadius:"3px", color:C.textMuted, fontSize:"10px",
          letterSpacing:"2px", textTransform:"uppercase", padding:"14px",
          cursor:"pointer", fontFamily:font, fontStyle:"italic" }}>
          Maybe Later
        </button>

        <p style={{ color:C.textMuted, fontSize:"10px", fontStyle:"italic",
          margin:"14px 0 0" }}>
          This pops up once a week — you can also find it in Settings anytime.
        </p>
      </div>

      <style>{`@keyframes fadeInUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// ANALYTICS TRACKING
// ═══════════════════════════════════════════════════════
const trackEvent = (event, data = {}, userId = null) => {
  try {
    const uid = userId || localStorage.getItem("selah_user_email") || "anon_" + (localStorage.getItem("selah_device_id") || (() => {
      const id = Math.random().toString(36).slice(2, 10);
      localStorage.setItem("selah_device_id", id);
      return id;
    })());
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, data, userId: uid })
    }).catch(() => {});
  } catch {}
};

// ═══════════════════════════════════════════════════════
// ANALYTICS SCREEN (Admin Only)
// ═══════════════════════════════════════════════════════
function AnalyticsScreen({ C, font, setScreen }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState(30);
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/analytics?admin=f7a3d9e2-4c1b-4e8f-b2a6-9d5c3e7f1a04&range=${range}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [range]);

  if (loading) return (
    <div style={{ minHeight:"100vh",background:C.bgPrimary,fontFamily:font,padding:"40px 20px",display:"flex",alignItems:"center",justifyContent:"center" }}>
      <p style={{ color:C.textMuted,fontSize:"13px",fontStyle:"italic" }}>Loading analytics...</p>
    </div>
  );

  if (!data) return (
    <div style={{ minHeight:"100vh",background:C.bgPrimary,fontFamily:font,padding:"40px 20px",textAlign:"center" }}>
      <p style={{ color:C.terra,fontSize:"13px",fontStyle:"italic" }}>Failed to load analytics data.</p>
      <button onClick={()=>setScreen("home")} style={{ marginTop:"16px",background:C.accent,border:"none",borderRadius:"3px",color:"#fff",fontSize:"10px",letterSpacing:"2px",textTransform:"uppercase",padding:"10px 20px",cursor:"pointer",fontFamily:font }}>Back Home</button>
    </div>
  );

  const days = data.days || [];
  const recentEvents = data.recentEvents || [];

  // Compute summary stats
  const today = days[0] || { uniqueUsers:0, events:{} };
  const last7 = days.slice(0, 7);
  const last30 = days.slice(0, 30);

  const totalUsersToday = today.uniqueUsers;
  const totalUsers7d = last7.reduce((s, d) => s + d.uniqueUsers, 0);
  const totalUsers30d = last30.reduce((s, d) => s + d.uniqueUsers, 0);

  // Aggregate events across days
  const aggregateEvents = (daysList) => {
    const agg = {};
    daysList.forEach(d => {
      Object.entries(d.events || {}).forEach(([k, v]) => {
        agg[k] = (agg[k] || 0) + v;
      });
    });
    return agg;
  };

  const events7d = aggregateEvents(last7);
  const events30d = aggregateEvents(last30);
  const eventsToday = today.events || {};

  // Top features
  const sortedFeatures = Object.entries(events30d).sort((a, b) => b[1] - a[1]);

  // Daily active users for chart (last 14 days reversed for chronological)
  const chartDays = days.slice(0, 14).reverse();
  const maxUsers = Math.max(...chartDays.map(d => d.uniqueUsers), 1);

  // Conversion metrics
  const trialStarts30d = events30d.trial_start || 0;
  const upgrades30d = events30d.tier_upgrade || 0;
  const conversionRate = trialStarts30d > 0 ? ((upgrades30d / trialStarts30d) * 100).toFixed(1) : "—";

  // Event name labels
  const eventLabels = {
    app_open:"App Opens", session_start:"Sessions Started", session_complete:"Sessions Completed",
    checkin_complete:"Check-ins", journal_write:"Journal Entries", breathe_start:"Breathing Started",
    feature_tap:"Feature Taps", sub_view:"Subscription Views", tier_upgrade:"Tier Upgrades",
    trial_start:"Trial Starts", anchor_load:"Anchor Loads", challenge_start:"Challenges Started",
    assessment_start:"Assessments Started", story_open:"Stories Opened", reset_game:"Reset Games Played",
    mood_logged:"Moods Logged", push_enabled:"Push Enabled", share_card:"Cards Shared",
    subscription_purchased:"Purchases", subscription_canceled:"Cancellations"
  };

  const StatCard = ({ label, value, sub, color }) => (
    <div style={{ background:C.bgSecondary,borderRadius:"10px",padding:"16px",border:`1px solid ${C.border}`,flex:1 }}>
      <p style={{ color:C.textMuted,fontSize:"9px",letterSpacing:"2px",textTransform:"uppercase",fontStyle:"italic",margin:"0 0 6px" }}>{label}</p>
      <p style={{ color:color||C.textPrimary,fontSize:"24px",fontWeight:"bold",fontFamily:font,margin:"0 0 2px" }}>{value}</p>
      {sub && <p style={{ color:C.textMuted,fontSize:"10px",fontStyle:"italic",margin:0 }}>{sub}</p>}
    </div>
  );

  const TABS = [
    { id:"overview", label:"Overview" },
    { id:"events", label:"Events" },
    { id:"live", label:"Live Feed" },
  ];

  return (
    <div style={{ minHeight:"100vh",background:C.bgPrimary,fontFamily:font,padding:"40px 20px 120px",boxSizing:"border-box" }}>
      <div style={{ maxWidth:"480px",margin:"0 auto" }}>

        {/* Header */}
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"24px" }}>
          <div>
            <p style={{ color:C.amber,fontSize:"9px",letterSpacing:"3px",textTransform:"uppercase",fontStyle:"italic",margin:"0 0 4px" }}>Admin Only</p>
            <h1 style={{ color:C.textPrimary,fontSize:"20px",fontWeight:"normal",margin:0,fontFamily:font }}>Analytics</h1>
          </div>
          <div style={{ display:"flex",gap:"6px" }}>
            {[7,30,90].map(r=>(
              <button key={r} onClick={()=>setRange(r)} style={{
                background:range===r?C.accent:C.bgSecondary,border:`1px solid ${range===r?C.accent:C.border}`,
                borderRadius:"6px",padding:"6px 10px",cursor:"pointer",
                color:range===r?"#fff":C.textMuted,fontSize:"10px",fontFamily:font }}>
                {r}d
              </button>
            ))}
          </div>
        </div>

        {/* Tab bar */}
        <div style={{ display:"flex",gap:"4px",marginBottom:"20px",background:C.bgSecondary,borderRadius:"8px",padding:"3px",border:`1px solid ${C.border}` }}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{
              flex:1,background:tab===t.id?C.bgPrimary:"transparent",border:"none",
              borderRadius:"6px",padding:"8px 0",cursor:"pointer",
              color:tab===t.id?C.textPrimary:C.textMuted,fontSize:"11px",
              fontFamily:font,fontStyle:"italic",transition:"all 0.2s ease",
              boxShadow:tab===t.id?`0 1px 3px ${C.border}`:"none" }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {tab === "overview" && (
          <>
            {/* Key metrics */}
            <div style={{ display:"flex",gap:"8px",marginBottom:"16px" }}>
              <StatCard label="Today" value={totalUsersToday} sub="unique users" color={C.accent}/>
              <StatCard label="7 Days" value={totalUsers7d} sub="unique users" color={C.amber}/>
              <StatCard label="30 Days" value={totalUsers30d} sub="unique users" color={C.sage}/>
            </div>

            {/* DAU Chart */}
            <div style={{ background:C.bgSecondary,borderRadius:"10px",padding:"16px",border:`1px solid ${C.border}`,marginBottom:"16px" }}>
              <p style={{ color:C.textMuted,fontSize:"9px",letterSpacing:"2px",textTransform:"uppercase",fontStyle:"italic",margin:"0 0 12px" }}>Daily Active Users (14d)</p>
              <div style={{ display:"flex",alignItems:"flex-end",gap:"4px",height:"100px" }}>
                {chartDays.map((d, i) => (
                  <div key={d.date} style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:"4px" }}>
                    <span style={{ color:C.textMuted,fontSize:"8px" }}>{d.uniqueUsers}</span>
                    <div style={{
                      width:"100%",borderRadius:"3px 3px 0 0",
                      background: i===chartDays.length-1 ? C.accent : `${C.accent}55`,
                      height:`${Math.max((d.uniqueUsers/maxUsers)*80, 2)}px`,
                      transition:"height 0.3s ease"
                    }}/>
                    <span style={{ color:C.textMuted,fontSize:"7px",transform:"rotate(-45deg)",transformOrigin:"center",whiteSpace:"nowrap" }}>
                      {d.date.slice(5)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Conversion */}
            <div style={{ display:"flex",gap:"8px",marginBottom:"16px" }}>
              <StatCard label="Trial Starts" value={trialStarts30d} sub="last 30d" color={C.amber}/>
              <StatCard label="Upgrades" value={upgrades30d} sub="last 30d" color={C.sage}/>
              <StatCard label="Conversion" value={conversionRate === "—" ? "—" : `${conversionRate}%`} sub="trial → paid" color={C.accent}/>
            </div>

            {/* Today's activity */}
            <div style={{ background:C.bgSecondary,borderRadius:"10px",padding:"16px",border:`1px solid ${C.border}`,marginBottom:"16px" }}>
              <p style={{ color:C.textMuted,fontSize:"9px",letterSpacing:"2px",textTransform:"uppercase",fontStyle:"italic",margin:"0 0 12px" }}>Today's Activity</p>
              {Object.keys(eventsToday).length === 0 ? (
                <p style={{ color:C.textMuted,fontSize:"11px",fontStyle:"italic",margin:0 }}>No events recorded yet today.</p>
              ) : (
                <div style={{ display:"flex",flexDirection:"column",gap:"6px" }}>
                  {Object.entries(eventsToday).sort((a,b)=>b[1]-a[1]).map(([k,v])=>(
                    <div key={k} style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                      <span style={{ color:C.textSoft,fontSize:"11px",fontStyle:"italic" }}>{eventLabels[k]||k}</span>
                      <span style={{ color:C.textPrimary,fontSize:"13px",fontWeight:"bold",fontFamily:font }}>{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* EVENTS TAB */}
        {tab === "events" && (
          <>
            <p style={{ color:C.textMuted,fontSize:"9px",letterSpacing:"2px",textTransform:"uppercase",fontStyle:"italic",margin:"0 0 12px" }}>
              Top Events ({range} days)
            </p>
            {sortedFeatures.length === 0 ? (
              <p style={{ color:C.textMuted,fontSize:"11px",fontStyle:"italic" }}>No events recorded yet.</p>
            ) : (
              <div style={{ display:"flex",flexDirection:"column",gap:"6px" }}>
                {sortedFeatures.map(([event, count]) => {
                  const maxCount = sortedFeatures[0][1] || 1;
                  return (
                    <div key={event} style={{ background:C.bgSecondary,borderRadius:"8px",padding:"12px 14px",border:`1px solid ${C.border}` }}>
                      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"6px" }}>
                        <span style={{ color:C.textSoft,fontSize:"11px",fontStyle:"italic" }}>{eventLabels[event]||event}</span>
                        <span style={{ color:C.textPrimary,fontSize:"14px",fontWeight:"bold",fontFamily:font }}>{count}</span>
                      </div>
                      <div style={{ height:"4px",borderRadius:"2px",background:`${C.accent}15` }}>
                        <div style={{ height:"100%",borderRadius:"2px",background:C.accent,width:`${(count/maxCount)*100}%`,transition:"width 0.3s ease" }}/>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Per-day breakdown */}
            <p style={{ color:C.textMuted,fontSize:"9px",letterSpacing:"2px",textTransform:"uppercase",fontStyle:"italic",margin:"24px 0 12px" }}>
              Daily Breakdown
            </p>
            <div style={{ display:"flex",flexDirection:"column",gap:"6px" }}>
              {days.slice(0, range).filter(d => Object.keys(d.events).length > 0).map(d => (
                <details key={d.date} style={{ background:C.bgSecondary,borderRadius:"8px",border:`1px solid ${C.border}`,overflow:"hidden" }}>
                  <summary style={{ padding:"12px 14px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",color:C.textPrimary,fontSize:"12px",fontFamily:font,listStyle:"none" }}>
                    <span>{d.date}</span>
                    <span style={{ display:"flex",gap:"12px",alignItems:"center" }}>
                      <span style={{ color:C.accent,fontSize:"11px" }}>{d.uniqueUsers} users</span>
                      <span style={{ color:C.textMuted,fontSize:"11px" }}>{Object.values(d.events).reduce((s,v)=>s+v,0)} events</span>
                      <span style={{ color:C.textMuted,fontSize:"10px" }}>▸</span>
                    </span>
                  </summary>
                  <div style={{ padding:"0 14px 12px" }}>
                    {Object.entries(d.events).sort((a,b)=>b[1]-a[1]).map(([k,v])=>(
                      <div key={k} style={{ display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:`1px solid ${C.border}` }}>
                        <span style={{ color:C.textMuted,fontSize:"10px",fontStyle:"italic" }}>{eventLabels[k]||k}</span>
                        <span style={{ color:C.textSoft,fontSize:"10px",fontWeight:"bold" }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </>
        )}

        {/* LIVE FEED TAB */}
        {tab === "live" && (
          <>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px" }}>
              <p style={{ color:C.textMuted,fontSize:"9px",letterSpacing:"2px",textTransform:"uppercase",fontStyle:"italic",margin:0 }}>
                Recent Events (today)
              </p>
              <button onClick={()=>{
                setLoading(true);
                fetch(`/api/analytics?admin=f7a3d9e2-4c1b-4e8f-b2a6-9d5c3e7f1a04&range=${range}`)
                  .then(r=>r.json()).then(d=>{setData(d);setLoading(false);}).catch(()=>setLoading(false));
              }} style={{ background:C.bgSecondary,border:`1px solid ${C.border}`,borderRadius:"6px",padding:"6px 12px",cursor:"pointer",color:C.textMuted,fontSize:"9px",fontFamily:font,fontStyle:"italic" }}>
                Refresh
              </button>
            </div>
            {recentEvents.length === 0 ? (
              <p style={{ color:C.textMuted,fontSize:"11px",fontStyle:"italic" }}>No events yet today.</p>
            ) : (
              <div style={{ display:"flex",flexDirection:"column",gap:"4px" }}>
                {recentEvents.map((ev, i) => (
                  <div key={i} style={{ background:C.bgSecondary,borderRadius:"8px",padding:"10px 14px",border:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex",alignItems:"center",gap:"8px" }}>
                        <span style={{ color:C.accent,fontSize:"11px",fontWeight:"bold",fontFamily:font }}>{eventLabels[ev.event]||ev.event}</span>
                        {ev.data && Object.keys(ev.data).length > 0 && (
                          <span style={{ color:C.textMuted,fontSize:"9px",fontStyle:"italic" }}>
                            {Object.entries(ev.data).map(([k,v])=>`${k}: ${v}`).join(", ")}
                          </span>
                        )}
                      </div>
                      <span style={{ color:C.textMuted,fontSize:"9px",fontStyle:"italic" }}>
                        {ev.userId?.slice(0,20)}{ev.userId?.length>20?"...":""}
                      </span>
                    </div>
                    <span style={{ color:C.textMuted,fontSize:"9px",flexShrink:0 }}>
                      {new Date(ev.time).toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"})}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════
function SelahAppInner() {
  // Load saved state
  const saved = useRef(loadFromStorage()).current;
  const has = (k) => saved && saved[k] !== undefined;

  const [appScreen, setAppScreen] = useState(()=>{
    const s = has("appScreen") ? saved.appScreen : "landing";
    // Safety: if user had old "welcome" state saved, skip to onboarding
    if (s === "welcome") return "onboarding";
    return s;
  });
  const [screen, _setScreen]       = useState("home");
  const setScreen = (s) => { trackEvent("feature_tap", { screen: s }); _setScreen(s); };
  const [themeId, setThemeId]     = useState(has("themeId") ? saved.themeId : "neutral");
  const [fontId, setFontId]       = useState(has("fontId") ? saved.fontId : "serif");
  const [faithLevel, setFaithLevel] = useState(has("faithLevel") ? saved.faithLevel : 2);
  const [userName, setUserName]   = useState(has("userName") ? saved.userName : "");
  const [tier, setTier]           = useState(has("tier") ? saved.tier : "free");
  const isAdmin = new URLSearchParams(window.location.search).get("admin") === "f7a3d9e2-4c1b-4e8f-b2a6-9d5c3e7f1a04";
  const [trialStart, setTrialStart] = useState(has("trialStart") ? saved.trialStart : null);
  const [steadyDays, setSteadyDays] = useState(has("steadyDays") ? saved.steadyDays : 0);
  const [sessionCount, setSessionCount] = useState(has("sessionCount") ? saved.sessionCount : 0);
  const [showFounder, setShowFounder] = useState(false);
  const [showSub, setShowSub]     = useState(false);
  const [showCrisisFromNav, setShowCrisisFromNav] = useState(false);
  const [sharingEnabled, setSharingEnabled] = useState(has("sharingEnabled") ? saved.sharingEnabled : false);
  const [pushEnabled, setPushEnabled] = useState(has("pushEnabled") ? saved.pushEnabled : false);
  const [isMinorUser, setIsMinorUser] = useState(has("isMinorUser") ? saved.isMinorUser : false);
const [consentVerified, setConsentVerified] = useState(false);
useEffect(() => {
  if (!isMinorUser) { setConsentVerified(true); return; }
  const code = localStorage.getItem("selah_consent_code");
  if (!code) { setConsentVerified(false); return; }
  fetch("/api/consent?code=" + code + "&action=check")
    .then(r => r.json())
    .then(d => {
      if (d.status === "approved") {
        setConsentVerified(true);
        localStorage.setItem("selah_consent_status", "approved");
      } else {
        setConsentVerified(false);
      }
    })
    .catch(() => {
      const s = localStorage.getItem("selah_consent_status");
      setConsentVerified(s === "approved");
    });
}, [isMinorUser]);
  const [tone, setTone] = useState(has("tone") ? saved.tone : "direct");
  const [quoteFreq, setQuoteFreq] = useState(has("quoteFreq") ? saved.quoteFreq : "daily");
  const [seasonalMode, setSeasonalMode] = useState(has("seasonalMode") ? saved.seasonalMode : false);
  const [showLateNight, setShowLateNight] = useState(true);
  const [onboardingAnswers, setOnboardingAnswers] = useState(has("onboardingAnswers") ? saved.onboardingAnswers : {});
  const [isFirstVisit, setIsFirstVisit] = useState(has("isFirstVisit") ? saved.isFirstVisit : true);
  const [showTutorial, setShowTutorial] = useState(has("isFirstVisit") ? saved.isFirstVisit : true);
  const [journalEntries, setJournalEntries] = useState(has("journalEntries") ? saved.journalEntries : []);
  const [benchItems, setBenchItems] = useState(has("benchItems") ? saved.benchItems : []);
  const [letters, setLetters] = useState(has("letters") ? saved.letters : []);
  const [moodHistory, setMoodHistory] = useState(has("moodHistory") ? saved.moodHistory : []);
  const [lastVisit, setLastVisit] = useState(has("lastVisit") ? saved.lastVisit : null);
  const [feedbackEntries, setFeedbackEntries] = useState(has("feedbackEntries") ? saved.feedbackEntries : []);
  const [lastFeedbackPrompt, setLastFeedbackPrompt] = useState(has("lastFeedbackPrompt") ? saved.lastFeedbackPrompt : null);
  const [lastActiveDate, setLastActiveDate] = useState(has("lastActiveDate") ? saved.lastActiveDate : null);
  const [bestStreak, setBestStreak] = useState(has("bestStreak") ? saved.bestStreak : 0);
  const [totalActiveDays, setTotalActiveDays] = useState(has("totalActiveDays") ? saved.totalActiveDays : 0);
  const [graceUsedWeek, setGraceUsedWeek] = useState(has("graceUsedWeek") ? saved.graceUsedWeek : null); // {week: string, count: number}
  const [sessionHistory, setSessionHistory] = useState(has("sessionHistory") ? saved.sessionHistory : []);
  const [assessmentResults, setAssessmentResults] = useState(has("assessmentResults") ? saved.assessmentResults : {});
  const [userEmail, setUserEmail] = useState(has("userEmail") ? saved.userEmail : null);
  const [autoLoginEmail, setAutoLoginEmail] = useState(null);
  const [stripeEmail, setStripeEmail] = useState(has("stripeEmail") ? saved.stripeEmail : null);
  const [authToken, setAuthToken] = useState(()=>{ try { return localStorage.getItem("selah_auth_token")||null; } catch { return null; } });
  const [syncStatus, setSyncStatus] = useState(null); // null, "syncing", "synced", "error"

  // ── Trial logic ──
  const trialDaysLeft = (() => {
    if (tier !== "free") return 999; // paid user, no trial limit
    if (!trialStart) return 7; // hasn't started yet
    const elapsed = (Date.now() - trialStart) / (1000 * 60 * 60 * 24);
    return Math.max(0, Math.ceil(7 - elapsed));
  })();
  const adminMode = new URLSearchParams(window.location.search).get("admin") === "f7a3d9e2-4c1b-4e8f-b2a6-9d5c3e7f1a04";
  const effectiveTier = adminMode ? "deep" : tier;
  const isTrialActive = effectiveTier === "free" && trialDaysLeft > 0;

  // ── Streak logic ──
  const getDateStr = (d) => new Date(d).toISOString().split("T")[0]; // "YYYY-MM-DD"
  const todayStr = getDateStr(Date.now());

  // Mark today as active (called on meaningful actions)
  const markActive = () => {
    if (lastActiveDate === todayStr) return; // already counted today

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = getDateStr(yesterday);

    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const twoDaysAgoStr = getDateStr(twoDaysAgo);

    // Get current week key (Monday-based)
    const now = new Date();
    const dayOfWeek = now.getDay() === 0 ? 7 : now.getDay();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - dayOfWeek + 1);
    const currentWeekKey = getDateStr(weekStart);

    const graceCount = (graceUsedWeek?.week === currentWeekKey) ? (graceUsedWeek?.count || 0) : 0;
    const graceRemaining = 2 - graceCount;

    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const threeDaysAgoStr = getDateStr(threeDaysAgo);

    if (lastActiveDate === yesterdayStr) {
      // Consecutive day — extend streak
      const newStreak = steadyDays + 1;
      setSteadyDays(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
    } else if (lastActiveDate === twoDaysAgoStr && graceRemaining >= 1 && steadyDays > 0) {
      // Missed 1 day — use 1 grace day
      const newStreak = steadyDays + 1;
      setSteadyDays(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
      setGraceUsedWeek({ week: currentWeekKey, count: graceCount + 1 });
    } else if (lastActiveDate === threeDaysAgoStr && graceRemaining >= 2 && steadyDays > 0) {
      // Missed 2 consecutive days — use 2 grace days
      const newStreak = steadyDays + 1;
      setSteadyDays(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
      setGraceUsedWeek({ week: currentWeekKey, count: graceCount + 2 });
    } else if (lastActiveDate === todayStr) {
      return;
    } else {
      // Streak broken — start at 1
      setSteadyDays(1);
      if (bestStreak === 0) setBestStreak(1);
    }
    setTotalActiveDays(prev => prev + 1);
    setLastActiveDate(todayStr);
  };

  // Check streak on app load — reset only if missed more than grace allows
  useEffect(() => {
    if (!lastActiveDate || appScreen !== "main") return;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = getDateStr(yesterday);
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const twoDaysAgoStr = getDateStr(twoDaysAgo);

    const now = new Date();
    const dayOfWeek = now.getDay() === 0 ? 7 : now.getDay();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - dayOfWeek + 1);
    const currentWeekKey = getDateStr(weekStart);
    const graceCount = (graceUsedWeek?.week === currentWeekKey) ? (graceUsedWeek?.count || 0) : 0;
    const graceRemaining = 2 - graceCount;

    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const threeDaysAgoStr = getDateStr(threeDaysAgo);

    if (lastActiveDate === todayStr || lastActiveDate === yesterdayStr) return;
    if (lastActiveDate === twoDaysAgoStr && graceRemaining >= 1 && steadyDays > 0) return;
    if (lastActiveDate === threeDaysAgoStr && graceRemaining >= 2 && steadyDays > 0) return;
    setSteadyDays(0);
  }, [appScreen]);

  // Track app open
  useEffect(() => {
    if (appScreen === "main") trackEvent("app_open", { tier: tier, name: userName || "", streak: steadyDays || 0 });
  }, [appScreen]);

  // Save state on every change
  useEffect(() => {
    saveToStorage({
      appScreen: appScreen === "main" ? "main" : appScreen,
      themeId, fontId, faithLevel, userName, tier, trialStart, steadyDays, sessionCount,
      sharingEnabled, pushEnabled, isMinorUser, tone, quoteFreq, onboardingAnswers, isFirstVisit,
      journalEntries, moodHistory, lastVisit: Date.now(),
      feedbackEntries, lastFeedbackPrompt,
      lastActiveDate, bestStreak, totalActiveDays, graceUsedWeek, sessionHistory, assessmentResults, userEmail, stripeEmail, seasonalMode, benchItems, letters,
    });
    // Cloud sync if logged in
    if (authToken) {
      const syncData = {
        appScreen: appScreen === "main" ? "main" : appScreen,
        themeId, fontId, faithLevel, userName, tier, trialStart, steadyDays, sessionCount,
        sharingEnabled, pushEnabled, isMinorUser, tone, quoteFreq, onboardingAnswers, isFirstVisit,
        journalEntries, moodHistory, lastVisit: Date.now(),
        feedbackEntries, lastFeedbackPrompt,
        lastActiveDate, bestStreak, totalActiveDays, graceUsedWeek, sessionHistory, assessmentResults, userEmail, stripeEmail, seasonalMode, benchItems, letters,
      };
      fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${authToken}` },
        body: JSON.stringify({ data: syncData })
      }).then(()=>setSyncStatus("synced")).catch(()=>setSyncStatus("error"));
    }
  }, [appScreen, themeId, fontId, faithLevel, userName, tier, trialStart, steadyDays,
      sessionCount, sharingEnabled, pushEnabled, isMinorUser, tone, quoteFreq, onboardingAnswers,
      isFirstVisit, journalEntries, moodHistory, feedbackEntries, lastFeedbackPrompt,
      lastActiveDate, bestStreak, totalActiveDays, graceUsedWeek, sessionHistory, assessmentResults, userEmail, stripeEmail, letters]);

  // Track returning users
  useEffect(() => {
    if (lastVisit && appScreen === "main") {
      const hoursSince = (Date.now() - lastVisit) / (1000 * 60 * 60);
    }
  }, []);

  // Register service worker for push notifications
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(e => console.error('SW registration failed:', e));
    }
  }, []);

  // PWA install prompt
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
  useEffect(() => {
    // Already installed as PWA — don't show
    if (isStandalone) return;
    const dismissed = localStorage.getItem("selah_install_dismissed");
    if (dismissed) return;

    if (isIOS) {
      // iOS doesn't fire beforeinstallprompt — show custom banner after delay
      setTimeout(() => setShowInstallBanner(true), 5000);
      return;
    }
    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      setTimeout(() => setShowInstallBanner(true), 3000);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const result = await installPrompt.userChoice;
    if (result.outcome === 'accepted') {
      trackEvent("pwa_install");
    }
    setInstallPrompt(null);
    setShowInstallBanner(false);
  };

  const dismissInstall = () => {
    setShowInstallBanner(false);
    try { localStorage.setItem("selah_install_dismissed", Date.now()); } catch {}
  };

  // Re-verify subscription status on every app load for paid users
  useEffect(() => {
    if (tier === "free") return;
    // Don't check in admin mode
    if (new URLSearchParams(window.location.search).get("admin") === "f7a3d9e2-4c1b-4e8f-b2a6-9d5c3e7f1a04") return;
    const checkEmail = stripeEmail || userEmail;
    if (!checkEmail) {
      // Paid tier but no email to verify against — force downgrade
      console.warn("Paid tier with no verification email — resetting to free");
      setTier("free");
      return;
    }
    fetch(`/api/verify-payment?email=${encodeURIComponent(checkEmail)}`)
      .then(r => r.json())
      .then(d => {
        if (d.verified && d.tier) {
          // Subscription still active — update tier in case they upgraded/downgraded
          if (d.tier !== tier) { setTier(d.tier); trackEvent("tier_upgrade", { from: tier, to: d.tier }); }
        } else {
          // Subscription no longer active — downgrade to free
          setTier("free");
        }
      })
      .catch(() => {
        // Network error — don't downgrade, keep current tier
        // Will re-check next time they open the app
      });
  }, []);

  // Auto-verify session and restore data on mount
  useEffect(() => {
    if (!authToken) return;
    fetch("/api/auth", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ action: "verify-token", token: authToken })
    }).then(r=>r.json()).then(d=>{
      if (d.success) {
        setUserEmail(d.email);
        // Check Stripe for active subscription
        fetch(`/api/verify-payment?email=${encodeURIComponent(d.email)}`)
          .then(r=>r.json()).then(pd=>{
            if(pd.verified&&pd.tier){ setTier(pd.tier); setStripeEmail(d.email); }
          }).catch(()=>{});
      } else {
        // Token expired, clear it
        localStorage.removeItem("selah_auth_token");
        setAuthToken(null);
        setUserEmail(null);
      }
    }).catch(()=>{});
  }, []);

  // Log mood from home screen
  const logMood = (moodVal, energy, word) => {
    const entry = {
      date: new Date().toISOString(),
      mood: moodVal,
      energy: energy,
      word: word || "",
    };
    setMoodHistory(prev => [entry, ...prev].slice(0, 90));
    markActive();
    trackEvent("mood_logged", { mood: moodVal, energy });
  };

  const C   = THEMES[themeId].C;
  const font = FONTS[fontId];

  // ── LITURGICAL SEASON ENGINE ──
  const getCurrentSeason = () => {
    const now = new Date();
    const m = now.getMonth() + 1, d = now.getDate(), y = now.getFullYear();
    const easterDate = (yr) => {
      const a=yr%19,b=Math.floor(yr/100),c=yr%100,d2=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d2-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m2=Math.floor((a+11*h+22*l)/451),month=Math.floor((h+l-7*m2+114)/31),day=((h+l-7*m2+114)%31)+1;
      return new Date(yr, month-1, day);
    };
    const easter = easterDate(y);
    const today = new Date(y, m-1, d);
    const diff = (a, b) => Math.round((b - a) / 86400000);

    // Advent: 4 Sundays before Christmas
    const christmas = new Date(y, 11, 25);
    const adventStart = new Date(y, 11, 25 - christmas.getDay() - 21);

    // Lent: Ash Wednesday (46 days before Easter) to Holy Saturday
    const ashWed = new Date(easter.getTime() - 46 * 86400000);
    const holySat = new Date(easter.getTime() - 86400000);

    // Eastertide: Easter to Pentecost
    const pentecost = new Date(easter.getTime() + 49 * 86400000);

    // Christmas season: Dec 25 to Jan 5
    const christmasEnd = new Date(y, 0, 5);
    const isChristmasSeason = (m === 12 && d >= 25) || (m === 1 && d <= 5);

    if (today >= ashWed && today <= holySat) {
      const daysLeft = diff(today, holySat);
      return { id:"lent", name:"Lent", icon:"✝️", daysLeft, accent:"#7A6878", altAccent:"#9E8090",
        anchorTheme:"sacrifice, surrender, self-examination, repentance, wilderness, fasting, preparation for resurrection",
        reflectContext:"It's Lent — a season of honest examination. Gently help the user sit with what needs to be surrendered or faced, without rushing toward resolution.",
      };
    }
    if (today >= easter && today < pentecost) {
      const daysLeft = diff(today, pentecost);
      return { id:"easter", name:"Eastertide", icon:"🌅", daysLeft, accent:"#C4A84E", altAccent:"#D6B85F",
        anchorTheme:"resurrection, new life, hope restored, renewal, joy after suffering, transformation",
        reflectContext:"It's Eastertide — a season of resurrection and renewal. Help the user lean into hope, new beginnings, and what God might be bringing back to life in them.",
      };
    }
    if (today >= adventStart && today < christmas) {
      const daysLeft = diff(today, christmas);
      return { id:"advent", name:"Advent", icon:"🕯️", daysLeft, accent:"#5C4A7A", altAccent:"#7A6090",
        anchorTheme:"waiting, anticipation, hope, preparation, longing, the coming of Christ, stillness before arrival",
        reflectContext:"It's Advent — a season of waiting and longing. Help the user sit with anticipation rather than rushing. What are they waiting for? What are they preparing?",
      };
    }
    if (isChristmasSeason) {
      const christmasEndThisYear = m === 1 ? christmasEnd : new Date(y+1, 0, 5);
      const daysLeft = diff(today, christmasEndThisYear);
      return { id:"christmas", name:"Christmas", icon:"✨", daysLeft, accent:"#B84040", altAccent:"#C4503A",
        anchorTheme:"incarnation, Emmanuel, God with us, joy, wonder, the Word made flesh, presence of God",
        reflectContext:"It's the Christmas season — the celebration of God entering the world. Help the user sit with wonder and the meaning of Emmanuel — God with us — in their own life.",
      };
    }
    if (today >= pentecost) {
      return { id:"ordinary", name:"Ordinary Time", icon:"🌿", daysLeft: null, accent: null,
        anchorTheme: null, reflectContext: null };
    }
    return null;
  };
  const currentSeason = getCurrentSeason();

  // Override accent color during seasonal mode
  const SC = (seasonalMode && currentSeason?.accent)
    ? { ...C, accent: currentSeason.accent, accentAlt: currentSeason.altAccent || C.accentAlt }
    : C;

  // Track subscription views
  useEffect(() => { if (showSub) trackEvent("sub_view", { tier }); }, [showSub]);

  const renderMain = () => {
    if(showSub) return (
      <SubscriptionScreen C={C} font={font}
        onBack={()=>setShowSub(false)}
        currentTier={tier}
        onSelectTier={(t)=>{setTier(t);setShowSub(false);}}
        trialDaysLeft={trialDaysLeft}
        userEmail={userEmail}
        onStripeEmail={setStripeEmail}
        onAutoLogin={async(email)=>{
          try{
            await fetch("/api/auth",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"send-code",email})});
            setAutoLoginEmail(email);
            setScreen("settings");
          }catch{}
        }}/>
    );
    switch(screen) {
      case "home": return (
        <HomeScreen C={SC} font={font} setScreen={setScreen}
          userName={userName} steadyDays={steadyDays}
          showLateNight={showLateNight} sharingEnabled={sharingEnabled}
          onboardingAnswers={onboardingAnswers} faithLevel={faithLevel}
          isFirstVisit={isFirstVisit} onDismissWelcome={()=>{setIsFirstVisit(false);setShowTutorial(false);}}
          showTutorial={showTutorial} setShowTutorial={setShowTutorial}
          onLogMood={logMood} onActive={markActive}
          lastFeedbackPrompt={lastFeedbackPrompt}
          onDismissFeedback={()=>setLastFeedbackPrompt(Date.now())}
          sessionCount={sessionCount}
          tone={tone} quoteFreq={quoteFreq}
          tier={effectiveTier} isTrialActive={isTrialActive} onUpgrade={()=>setShowSub(true)}
          moodHistory={moodHistory} sessionHistory={sessionHistory} journalEntries={journalEntries} setJournalEntries={setJournalEntries}
          seasonalMode={seasonalMode} setSeasonalMode={setSeasonalMode} currentSeason={currentSeason}
          graceUsedWeek={graceUsedWeek} benchItems={benchItems} setBenchItems={setBenchItems}/>
      );
      case "reflect": {
        if (!hasAccess(effectiveTier, "foundation", isTrialActive)) {
          return (
            <div style={{ minHeight:"100vh", background:C.bgPrimary, fontFamily:font,
              padding:"60px 20px", boxSizing:"border-box" }}>
              <div style={{ maxWidth:"480px", margin:"0 auto" }}>
                <button onClick={()=>setScreen("home")} style={{ background:"none",border:"none",
                  cursor:"pointer",color:C.textMuted,fontSize:"20px",marginBottom:"20px" }}>←</button>
                <UpgradeGate C={C} font={font}
                  feature="Unlimited Reflections"
                  requiredTier="foundation"
                  onUpgrade={()=>setShowSub(true)}/>
                <p style={{ color:C.textSoft, fontSize:"12px", fontStyle:"italic",
                  textAlign:"center", lineHeight:"1.8", marginTop:"16px" }}>
                  Your free trial has ended. Subscribe to continue your reflection journey.
                </p>
              </div>
            </div>
          );
        }
        return (
          <ReflectScreen C={SC} font={font} setScreen={setScreen}
            faithLevel={faithLevel} sessionCount={sessionCount} tone={tone}
            isMinorUser={isMinorUser}
            tier={effectiveTier} sessionHistory={sessionHistory}
            seasonalContext={(seasonalMode && currentSeason?.reflectContext) ? currentSeason.reflectContext : null}
            onSessionComplete={(sessionData)=>{
              setSessionCount(s=>s+1);
              markActive();
              trackEvent("session_complete", { category: sessionData?.category || "unknown" });
              if(sessionData) setSessionHistory(prev=>[sessionData,...prev].slice(0,50));
            }}
            onboardingAnswers={onboardingAnswers} userName={userName}
            setBenchItems={setBenchItems}/>
        );
      }
      case "journal": return <JournalScreen C={C} font={font} setScreen={setScreen} entries={journalEntries} setEntries={setJournalEntries} onActive={markActive}/>;
      case "progress": {
        // Progress requires Foundation+ — paid only, trial does NOT unlock
        if ((TIER_LEVELS[effectiveTier]||0) < TIER_LEVELS.foundation) {
          return (
            <div style={{ minHeight:"100vh", background:C.bgPrimary, fontFamily:font,
              padding:"60px 20px", boxSizing:"border-box" }}>
              <div style={{ maxWidth:"480px", margin:"0 auto" }}>
                <button onClick={()=>setScreen("home")} style={{ background:"none",border:"none",
                  cursor:"pointer",color:C.textMuted,fontSize:"20px",marginBottom:"20px" }}>←</button>
                <UpgradeGate C={C} font={font}
                  feature="Progress Tracking"
                  requiredTier="foundation"
                  onUpgrade={()=>setShowSub(true)}/>
              </div>
            </div>
          );
        }
        return <ProgressScreen C={C} font={font} setScreen={setScreen} steadyDays={steadyDays} sessionCount={sessionCount} moodHistory={moodHistory} bestStreak={bestStreak} totalActiveDays={totalActiveDays} sessionHistory={sessionHistory} journalEntries={journalEntries} tier={effectiveTier} onUpgrade={()=>setShowSub(true)}/>;
      }
      case "breathe": return <BreathingExercise C={C} font={font} onClose={()=>setScreen("home")}/>;
      case "prayerwall":
        return <PrayerWallScreen C={SC} font={font}
          tier={effectiveTier} isTrialActive={isTrialActive}
          onUpgrade={()=>setShowSub(true)}
          onClose={()=>setScreen("home")}/>;
      case "bench":
        return <TheBenchScreen C={SC} font={font} setScreen={setScreen}
          benchItems={benchItems} setBenchItems={setBenchItems}/>;
      case "armorup": {
        if (!(TIER_LEVELS[effectiveTier]||0) >= TIER_LEVELS.foundation && !isTrialActive) {
          setScreen("home"); return null;
        }
        return <ArmorUpScreen C={SC} font={font}
          faithLevel={faithLevel}
          onComplete={() => { markActive(); trackEvent("feature_tap", { feature:"armor_up" }); }}
          onClose={() => setScreen("home")}/>;
      }
      case "heavyday":
        return <HeavyDayScreen C={C} font={font} faithLevel={faithLevel} userName={userName} onClose={()=>setScreen("home")}/>;
      case "bestill": {
        // Reset requires Foundation+ — paid only, trial does NOT unlock
        if ((TIER_LEVELS[effectiveTier]||0) < TIER_LEVELS.foundation) {
          return (
            <div style={{ minHeight:"100vh", background:C.bgPrimary, fontFamily:font,
              padding:"60px 20px", boxSizing:"border-box" }}>
              <div style={{ maxWidth:"480px", margin:"0 auto" }}>
                <button onClick={()=>setScreen("home")} style={{ background:"none",border:"none",
                  cursor:"pointer",color:C.textMuted,fontSize:"20px",marginBottom:"20px" }}>←</button>
                <UpgradeGate C={C} font={font}
                  feature="Reset"
                  requiredTier="foundation"
                  onUpgrade={()=>setShowSub(true)}/>
                <p style={{ color:C.textSoft, fontSize:"12px", fontStyle:"italic",
                  textAlign:"center", lineHeight:"1.8", marginTop:"16px" }}>
                  A wordless space to decompress — tap to create light, receive scripture, and just breathe. Subscribe to unlock.
                </p>
              </div>
            </div>
          );
        }
        return <ResetScreen C={C} font={font} onClose={()=>setScreen("home")}/>;
      }
      case "checkin": {
        if (!hasAccess(effectiveTier, "foundation", false)) { // trial does NOT unlock check-in
          return (
            <div style={{ minHeight:"100vh", background:C.bgPrimary, fontFamily:font,
              padding:"60px 20px", boxSizing:"border-box" }}>
              <div style={{ maxWidth:"480px", margin:"0 auto" }}>
                <button onClick={()=>setScreen("home")} style={{ background:"none",border:"none",
                  cursor:"pointer",color:C.textMuted,fontSize:"20px",marginBottom:"20px" }}>←</button>
                <UpgradeGate C={C} font={font}
                  feature="Quick Check-in"
                  requiredTier="foundation"
                  onUpgrade={()=>setShowSub(true)}/>
              </div>
            </div>
          );
        }
        return <QuickCheckIn C={C} font={font} onClose={()=>setScreen("home")}
          onboardingAnswers={onboardingAnswers} faithLevel={faithLevel} userName={userName} onActive={markActive} tone={tone} isMinorUser={isMinorUser} tier={effectiveTier} sessionHistory={sessionHistory}/>;
      }
      case "letters":
        return <LettersToGodScreen C={SC} font={font} setScreen={setScreen}
          letters={letters} setLetters={setLetters} userName={userName}/>;
      case "featureguide":
        return <FeatureGuideScreen C={SC} font={font} setScreen={setScreen}/>;
      case "settings": return (
        <SettingsScreen C={SC} font={font} setScreen={setScreen}
          theme={themeId} setTheme={setThemeId}
          fontId={fontId} setFontId={setFontId}
          faithLevel={faithLevel} setFaithLevel={setFaithLevel}
          sharingEnabled={sharingEnabled} setSharingEnabled={setSharingEnabled}
          pushEnabled={pushEnabled} setPushEnabled={setPushEnabled}
          tone={tone} setTone={setTone}
          quoteFreq={quoteFreq} setQuoteFreq={setQuoteFreq}
          onSubscription={()=>setShowSub(true)}
          onFounder={()=>setShowFounder(true)}
          tier={effectiveTier} trialDaysLeft={trialDaysLeft}
          onReset={()=>{clearStorage();localStorage.removeItem("selah_auth_token");window.location.reload();}}
          userEmail={userEmail} authToken={authToken} syncStatus={syncStatus}
          onLogin={async(email, code)=>{
            const r = await fetch("/api/auth",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"verify-code",email,code})});
            const d = await r.json();
            if(d.success){
              setAuthToken(d.token);
              setUserEmail(d.email);
              localStorage.setItem("selah_auth_token",d.token);
              // Send welcome email (fires once per user, API deduplicates)
              fetch("/api/emails",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"welcome",email:d.email,name:userName||"friend"})}).catch(()=>{});
              // Register trial in Redis for reminder emails
              if(trialStart) {
                fetch("/api/analytics",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({event:"trial_registered",data:{email:d.email,name:userName,trialStart}})}).catch(()=>{});
              }
              // Try to restore cloud data
              try{
                const sr=await fetch("/api/sync",{headers:{"Authorization":`Bearer ${d.token}`}});
                const sd=await sr.json();
                if(sd.data){
                  // Merge: cloud data fills in, but don't overwrite current if user has local data
                  const cloud=sd.data;
                  if(cloud.journalEntries?.length>journalEntries.length) setJournalEntries(cloud.journalEntries);
                  if(cloud.moodHistory?.length>moodHistory.length) setMoodHistory(cloud.moodHistory);
                  if(cloud.sessionHistory?.length>sessionHistory.length) setSessionHistory(cloud.sessionHistory);
                  if(cloud.steadyDays>steadyDays) setSteadyDays(cloud.steadyDays);
                  if(cloud.bestStreak>bestStreak) setBestStreak(cloud.bestStreak);
                  if(cloud.totalActiveDays>totalActiveDays) setTotalActiveDays(cloud.totalActiveDays);
                  if(cloud.sessionCount>sessionCount) setSessionCount(cloud.sessionCount);
                  if(cloud.assessmentResults&&Object.keys(cloud.assessmentResults).length>Object.keys(assessmentResults).length) setAssessmentResults(cloud.assessmentResults);
                  if(cloud.feedbackEntries?.length>feedbackEntries.length) setFeedbackEntries(cloud.feedbackEntries);
                  if(cloud.benchItems?.length>benchItems.length) setBenchItems(cloud.benchItems);
                  if(cloud.onboardingAnswers&&Object.keys(cloud.onboardingAnswers).length>0&&!onboardingAnswers?.name) setOnboardingAnswers(cloud.onboardingAnswers);
                  if(cloud.tier&&cloud.tier!=="free") setTier(cloud.tier);
                  if(cloud.stripeEmail) setStripeEmail(cloud.stripeEmail);
                }
              }catch{}
              // Also check Stripe directly for active subscription
              try{
                const pr=await fetch(`/api/verify-payment?email=${encodeURIComponent(d.email)}`);
                const pd=await pr.json();
                if(pd.verified&&pd.tier){
                  setTier(pd.tier);
                  setStripeEmail(d.email);
                }
              }catch{}
              return {success:true};
            }
            return {success:false,error:d.error};
          }}
          onLogout={async()=>{
            if(authToken) await fetch("/api/auth",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"logout",token:authToken})}).catch(()=>{});
            localStorage.removeItem("selah_auth_token");
            setAuthToken(null);
            setUserEmail(null);
          }}
          onSendCode={async(email)=>{
            const r=await fetch("/api/auth",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"send-code",email})});
            return r.json();
          }}
          autoLoginEmail={autoLoginEmail}
          onClearAutoLogin={()=>setAutoLoginEmail(null)}
          seasonalMode={seasonalMode} setSeasonalMode={setSeasonalMode} currentSeason={currentSeason}
          onShowTour={()=>{ setShowTutorial(true); setScreen("home"); }}/>
      );
      case "resources": {
        // Resources require Foundation+ — paid only, trial does NOT unlock
        if ((TIER_LEVELS[effectiveTier]||0) < TIER_LEVELS.foundation) {
          return (
            <div style={{ minHeight:"100vh", background:C.bgPrimary, fontFamily:font,
              padding:"60px 20px", boxSizing:"border-box" }}>
              <div style={{ maxWidth:"480px", margin:"0 auto" }}>
                <button onClick={()=>setScreen("home")} style={{ background:"none",border:"none",
                  cursor:"pointer",color:C.textMuted,fontSize:"20px",marginBottom:"20px" }}>←</button>
                <UpgradeGate C={C} font={font}
                  feature="Resources"
                  requiredTier="foundation"
                  onUpgrade={()=>setShowSub(true)}/>
              </div>
            </div>
          );
        }
        return <ResourcesScreen C={SC} font={font} setScreen={setScreen} onboardingAnswers={onboardingAnswers} faithLevel={faithLevel} tier={effectiveTier} sessionHistory={sessionHistory} moodHistory={moodHistory}/>;
      }
      case "stories": {
        // Biblical Reflections require Foundation+ — paid only, trial does NOT unlock
        if ((TIER_LEVELS[effectiveTier]||0) < TIER_LEVELS.foundation) {
          return (
            <div style={{ minHeight:"100vh", background:C.bgPrimary, fontFamily:font,
              padding:"60px 20px", boxSizing:"border-box" }}>
              <div style={{ maxWidth:"480px", margin:"0 auto" }}>
                <button onClick={()=>setScreen("home")} style={{ background:"none",border:"none",
                  cursor:"pointer",color:C.textMuted,fontSize:"20px",marginBottom:"20px" }}>←</button>
                <UpgradeGate C={C} font={font}
                  feature="Biblical Reflections"
                  requiredTier="foundation"
                  onUpgrade={()=>setShowSub(true)}/>
                <p style={{ color:C.textSoft, fontSize:"12px", fontStyle:"italic",
                  textAlign:"center", lineHeight:"1.8", marginTop:"16px" }}>
                  Real stories from Scripture — told straight, with reflections that meet you where you are. Subscribe to unlock.
                </p>
              </div>
            </div>
          );
        }
        return <BibleStoriesScreen C={C} font={font} setScreen={setScreen} faithLevel={faithLevel}/>;
      }
      case "assessments": {
        // Assessments require Foundation+ — trial does NOT unlock
        if ((TIER_LEVELS[effectiveTier]||0) < TIER_LEVELS.foundation) {
          return (
            <div style={{ minHeight:"100vh", background:C.bgPrimary, fontFamily:font,
              padding:"60px 20px", boxSizing:"border-box" }}>
              <div style={{ maxWidth:"480px", margin:"0 auto" }}>
                <button onClick={()=>setScreen("home")} style={{ background:"none",border:"none",
                  cursor:"pointer",color:C.textMuted,fontSize:"20px",marginBottom:"20px" }}>←</button>
                <UpgradeGate C={C} font={font}
                  feature="Self-Discovery Assessments"
                  requiredTier="foundation"
                  onUpgrade={()=>setShowSub(true)}/>
                <p style={{ color:C.textSoft, fontSize:"12px", fontStyle:"italic",
                  textAlign:"center", lineHeight:"1.8", marginTop:"16px" }}>
                  Assessments help you understand your personality, patterns, and wiring. Subscribe to unlock them.
                </p>
              </div>
            </div>
          );
        }
        return <AssessmentsScreen C={C} font={font} setScreen={setScreen} assessmentResults={assessmentResults} setAssessmentResults={setAssessmentResults} tier={effectiveTier} isTrialActive={isTrialActive} onUpgrade={()=>setScreen("subscription")} userName={userName}/>;
      }
      case "feedback": return <FeedbackScreen C={C} font={font} setScreen={setScreen}
        feedbackEntries={feedbackEntries} userName={userName}
        onSubmit={(entry)=>{
          setFeedbackEntries(prev=>[entry,...prev]);
          setLastFeedbackPrompt(Date.now());
        }}/>;
      case "analytics": return adminMode ? <AnalyticsScreen C={C} font={font} setScreen={setScreen}/> : null;
      default: return null;
    }
  };

  // Flow routing
  if(appScreen!=="main") {
    const flowContent = (() => {
      if(appScreen==="landing") return <LandingPage onEnter={()=>setAppScreen("privacy")} C={C} font={font}/>;
      if(appScreen==="privacy") return <PrivacyGate onAccept={()=>setAppScreen("splash")} C={C} font={font}/>;
      if(appScreen==="splash") return <SplashScreen onDone={()=>setAppScreen("onboarding")} C={C} font={font}/>;
      if(appScreen==="firstwelcome") return (
        <FirstTimeWelcome C={C} font={font} userName={userName}
          onboardingAnswers={onboardingAnswers}
          onReflect={()=>{ setAppScreen("main"); setTimeout(()=>setScreen("reflect"),100); }}
          onExplore={()=>{ setAppScreen("main"); }}/>
      );
      if(appScreen==="onboarding") return (
        <OnboardingScreen C={C} font={font}
          onDone={(answers)=>{
            if(answers.name){const n=answers.name.trim().split(" ")[0];setUserName(n.charAt(0).toUpperCase()+n.slice(1));}
            if(answers.faith){const fi=answers.faith.includes("None")?0:answers.faith.includes("Minimal")?1:answers.faith.includes("Balanced")?2:3;setFaithLevel(fi);}
            if(answers.gender==="Man") setThemeId("masculine");
            else if(answers.gender==="Woman") setThemeId("warm");
            else setThemeId("warm");
            if(answers.isMinor) setIsMinorUser(true);
            setOnboardingAnswers(answers);
            if (!trialStart) { setTrialStart(Date.now()); trackEvent("trial_start"); }
            setAppScreen("firstwelcome");
          }}/>
      );
      return null;
    })();
    return <ScreenTransition screenKey={appScreen}>{flowContent}</ScreenTransition>;
  }

  return (
    <div style={{ fontFamily:font,background:C.bgPrimary,minHeight:"100vh",
      transition:"background 0.4s ease,color 0.4s ease" }}>



      <ScreenTransition screenKey={screen}>
        {renderMain()}
      </ScreenTransition>

      {/* PWA Install Banner */}
      {showInstallBanner && screen==="home" && (
        <div style={{ position:"fixed",bottom:"80px",left:"50%",transform:"translateX(-50%)",
          width:"calc(100% - 32px)",maxWidth:"460px",
          background:C.bgPrimary,borderRadius:"14px",padding:"16px 18px",
          border:`1.5px solid ${C.sage}44`,zIndex:200,
          boxShadow:`0 8px 32px rgba(0,0,0,0.15)`,
          display:"flex",alignItems:"center",gap:"14px" }}>
          <div style={{ width:"42px",height:"42px",borderRadius:"10px",
            background:`${C.sage}18`,border:`1px solid ${C.sage}33`,
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:"20px",flexShrink:0 }}>✦</div>
          <div style={{ flex:1 }}>
            <p style={{ color:C.textPrimary,fontSize:"13px",fontFamily:font,margin:"0 0 2px" }}>
              Add Selah to your home screen
            </p>
            <p style={{ color:C.textMuted,fontSize:"10px",fontStyle:"italic",margin:0 }}>
              {isIOS ? "Tap the share button, then \"Add to Home Screen\"" : "Open instantly, just like an app"}
            </p>
          </div>
          <div style={{ display:"flex",gap:"6px",flexShrink:0 }}>
            <button onClick={dismissInstall} style={{ background:"none",border:"none",
              color:C.textMuted,fontSize:"10px",cursor:"pointer",padding:"8px",fontFamily:font }}>
              {isIOS ? "Got it" : "Later"}
            </button>
            {!isIOS && (
            <button onClick={handleInstall} style={{ background:C.accent,border:"none",
              borderRadius:"6px",color:"#fff",fontSize:"10px",letterSpacing:"1.5px",
              textTransform:"uppercase",padding:"8px 14px",cursor:"pointer",fontFamily:font }}>
              Install
            </button>
            )}
          </div>
        </div>
      )}

      {!showSub&&screen!=="breathe"&&screen!=="checkin"&&screen!=="bestill"&&screen!=="armorup"&&screen!=="prayerwall"&&screen!=="bench"&&(
        <BottomNav screen={screen} setScreen={setScreen} C={C} font={font} adminMode={adminMode}/>
      )}

      {showFounder&&<FounderNote C={C} font={font} onClose={()=>setShowFounder(false)}/>}

      {/* Floating SOS button — always accessible */}
      {!showSub&&screen!=="breathe"&&screen!=="checkin"&&screen!=="bestill"&&screen!=="armorup"&&screen!=="prayerwall"&&screen!=="bench"&&(
        <button onClick={()=>setShowCrisisFromNav(true)} style={{
          position:"fixed", top:"16px", right:"16px",
          width:"36px", height:"36px", borderRadius:"50%",
          background:`${C.terra}15`, border:`1.5px solid ${C.terra}33`,
          display:"flex", alignItems:"center", justifyContent:"center",
          cursor:"pointer", zIndex:150,
          fontSize:"14px", transition:"all 0.2s ease",
          boxShadow:`0 2px 8px ${C.terra}22` }}
          onMouseEnter={e=>{e.currentTarget.style.background=`${C.terra}25`;e.currentTarget.style.transform="scale(1.08)";}}
          onMouseLeave={e=>{e.currentTarget.style.background=`${C.terra}15`;e.currentTarget.style.transform="scale(1)";}}>
          🤍
        </button>
      )}
      {showCrisisFromNav&&<CrisisPanel onClose={()=>setShowCrisisFromNav(false)} C={C} font={font}/>}
    </div>
  );
}

export default function SelahApp() {
  return <ErrorBoundary><SelahAppInner/></ErrorBoundary>;
}
