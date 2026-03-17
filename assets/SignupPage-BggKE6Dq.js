import{r as x,b as O,u as _,d as K,R as Q,j as e,a as L,L as h,G as v,T as V,S as ee}from"./index-BPU9ZpYb.js";import{a as q,u as te}from"./index-8ldvlUj0.js";import{m as l}from"./proxy-B5j70qiu.js";import{A as X}from"./arrow-left-Dg86oQX4.js";import{A as $}from"./index-Dczf0Z__.js";import{C as P}from"./circle-check-big-CvbBtW1b.js";import{M as Y}from"./mail-Cn0AeXvX.js";import{L as S}from"./lock-DAgIDc0X.js";import{E as A}from"./eye-off-CSHlFOwX.js";import{E}from"./eye-DPjitf78.js";import{A as G}from"./arrow-right-ClgcRwMf.js";import{Z as ae}from"./zap-SP5H4uY3.js";const u=({icon:r,label:k,hint:f,error:d,children:b,optional:N})=>e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center justify-between mb-1.5",children:[e.jsx("label",{className:"text-sm font-medium lg:text-gray-700 text-gray-300",children:k}),N&&e.jsx("span",{className:"text-xs text-gray-400",children:"Optional"})]}),e.jsxs("div",{className:"relative",children:[e.jsx("div",{className:"absolute inset-y-0 z-10 left-3 flex items-start pt-4 pointer-events-none",children:e.jsx(r,{className:"w-5 h-5 lg:text-gray-400 text-gray-300"})}),b]}),f&&!d&&e.jsx("p",{className:"mt-1.5 text-xs text-gray-400",children:f}),d&&e.jsx("p",{className:"mt-1.5 text-xs text-red-400",children:d})]}),se=[{icon:v,color:"#C084FC",bg:"rgba(192, 132, 252, 0.15)",title:"5% referral bonus",desc:"Earned on every friend you refer"},{icon:V,color:"#A855F7",bg:"rgba(168, 85, 247, 0.15)",title:"3% retrading bonus",desc:"Reinvest early and get rewarded"},{icon:ee,color:"#9333EA",bg:"rgba(147, 51, 234, 0.15)",title:"Bank-grade security",desc:"256-bit encryption on every transaction"},{icon:ae,color:"#D8B4FE",bg:"rgba(216, 180, 254, 0.15)",title:"Up to 50% returns",desc:"In as little as 15 working days"}],fe=()=>{const[r,k]=x.useState({email:"",password:"",confirmPassword:"",referralCode:""}),[f,d]=x.useState(""),[b,N]=x.useState(""),[C,z]=x.useState(!1),[y,T]=x.useState(!1),[j,F]=x.useState(!1),[w,W]=x.useState({score:0,label:"",color:""}),{login:Z}=O(),H=_(),B=K();x.useEffect(()=>{const t=document.getElementById("register-stars-container");if(t){for(let a=0;a<150;a++){const s=document.createElement("div");s.className="star";const n=Math.random()*100,o=Math.random()*100,i=Math.random()*2.5+.5,c=Math.random()*4+2,g=Math.random()*5,m=Math.random()*.7+.3;s.style.cssText=`
        position: absolute;
        left: ${n}%;
        top: ${o}%;
        width: ${i}px;
        height: ${i}px;
        background: white;
        border-radius: 50%;
        opacity: ${m};
        box-shadow: 0 0 ${i*2}px rgba(255, 255, 255, 0.8);
        animation: twinkle ${c}s ease-in-out infinite;
        animation-delay: ${g}s;
        z-index: 1;
      `,t.appendChild(s)}for(let a=0;a<15;a++){const s=document.createElement("div");s.className="orb";const n=Math.random()*100,o=Math.random()*100,i=Math.random()*150+50,c=Math.random()*20+20,g=Math.random()*10,m=["#481B73","#5A2A71","#723A69","#8A4A61"],I=m[Math.floor(Math.random()*m.length)];s.style.cssText=`
        position: absolute;
        left: ${n}%;
        top: ${o}%;
        width: ${i}px;
        height: ${i}px;
        background: radial-gradient(circle at 30% 30%, ${I}80, transparent 70%);
        border-radius: 50%;
        filter: blur(40px);
        animation: float ${c}s ease-in-out infinite;
        animation-delay: ${g}s;
        pointer-events: none;
        z-index: 0;
      `,t.appendChild(s)}for(let a=0;a<8;a++){const s=document.createElement("div");s.className="shooting-star";const n=Math.random()*100,o=Math.random()*100,i=Math.random()*15,c=Math.random()*3+2;s.style.cssText=`
        position: absolute;
        left: ${n}%;
        top: ${o}%;
        width: 100px;
        height: 2px;
        background: linear-gradient(90deg, rgba(255,255,255,0.8), rgba(255,255,255,0.3), transparent);
        transform: rotate(-45deg);
        filter: blur(1px);
        animation: shoot ${c}s linear infinite;
        animation-delay: ${i}s;
        opacity: 0;
        z-index: 2;
      `,t.appendChild(s)}return()=>{t&&(t.innerHTML="")}}},[]),x.useEffect(()=>{const t=document.getElementById("mobile-stars-container");if(t){for(let a=0;a<80;a++){const s=document.createElement("div");s.className="star";const n=Math.random()*100,o=Math.random()*100,i=Math.random()*2+.5,c=Math.random()*3+2,g=Math.random()*5,m=Math.random()*.6+.2;s.style.cssText=`
        position: absolute;
        left: ${n}%;
        top: ${o}%;
        width: ${i}px;
        height: ${i}px;
        background: white;
        border-radius: 50%;
        opacity: ${m};
        box-shadow: 0 0 ${i*2}px rgba(255, 255, 255, 0.8);
        animation: twinkle ${c}s ease-in-out infinite;
        animation-delay: ${g}s;
        z-index: 1;
      `,t.appendChild(s)}for(let a=0;a<8;a++){const s=document.createElement("div");s.className="orb";const n=Math.random()*100,o=Math.random()*100,i=Math.random()*100+30,c=Math.random()*15+15,g=Math.random()*10,m=["#481B73","#5A2A71","#723A69"],I=m[Math.floor(Math.random()*m.length)];s.style.cssText=`
        position: absolute;
        left: ${n}%;
        top: ${o}%;
        width: ${i}px;
        height: ${i}px;
        background: radial-gradient(circle at 30% 30%, ${I}60, transparent 70%);
        border-radius: 50%;
        filter: blur(30px);
        animation: float ${c}s ease-in-out infinite;
        animation-delay: ${g}s;
        pointer-events: none;
        z-index: 0;
      `,t.appendChild(s)}return()=>{t&&(t.innerHTML="")}}},[]),Q.useEffect(()=>{const a=new URLSearchParams(B.search).get("ref");a&&k(s=>({...s,referralCode:a}))},[B]);const J=t=>{let a=0;t.length>=6&&a++,t.length>=8&&a++,/[A-Z]/.test(t)&&a++,/[0-9]/.test(t)&&a++,/[^A-Za-z0-9]/.test(t)&&a++;const s={0:["Weak","bg-red-400"],1:["Weak","bg-red-400"],2:["Fair","bg-amber-400"],3:["Fair","bg-amber-400"],4:["Strong","bg-emerald-500"],5:["Strong","bg-emerald-500"]},[n,o]=s[a];W({score:a,label:n,color:o})},p=t=>{const{name:a,value:s}=t.target;k({...r,[a]:a==="email"?s.trim().toLowerCase():s}),d(""),N(""),a==="password"&&J(s)},U=()=>!r.email||!r.password||!r.confirmPassword?(d("All fields are required"),!1):/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email)?r.password.length<6?(d("Password must be at least 6 characters"),!1):r.password!==r.confirmPassword?(d("Passwords do not match"),!1):!0:(d("Enter a valid email address"),!1),R=async t=>{var a,s;if(t.preventDefault(),d(""),N(""),z(!0),!U()){z(!1);return}try{const n=await q.post(`${te}auth/register`,{email:r.email,password:r.password,referralCode:r.referralCode||void 0}),{token:o,data:i}=n.data;localStorage.setItem("token",o),q.defaults.headers.common.Authorization=`Bearer ${o}`,Z({id:i.user._id,email:i.user.email,firstName:i.user.firstName,lastName:i.user.lastName,role:i.user.role,referralCode:i.user.referralCode,totalInvested:i.user.totalInvested,totalWithdrawn:i.user.totalWithdrawn,referralBonus:i.user.referralBonus,retradingBonus:i.user.retradingBonus,hasBankDetails:!1}),N("Account created! Redirecting…"),setTimeout(()=>H("/dashboard"),2e3)}catch(n){d(((s=(a=n.response)==null?void 0:a.data)==null?void 0:s.message)||"Registration failed. Please try again.")}finally{z(!1)}},M=r.confirmPassword&&r.password===r.confirmPassword,D=r.confirmPassword&&r.password!==r.confirmPassword;return e.jsxs("div",{className:"flex min-h-screen w-full relative",style:{fontFamily:"'DM Sans', system-ui, sans-serif"},children:[e.jsx("style",{children:`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Serif+Display:ital@0;1&display=swap'); 
        .serif{font-family:'DM Serif Display',Georgia,serif;}
        
        /* Glass morphism effects */
        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(147, 51, 234, 0.2);
        }
        
        /* Input styles - fixed positioning */
        input, select, textarea {
          font-size: 16px !important;
        }
        
        .input-base {
          width: 100%;
          padding: 0.75rem 2.5rem 0.75rem 2.5rem;
          font-size: 16px;
          border-radius: 0.75rem;
          transition: all 0.2s;
        }
        
        /* Desktop input styles */
        .desktop-input {
          background-color: #f9fafb;
          border: 1px solid #e5e7eb;
          color: #111827;
        }
        .desktop-input::placeholder {
          color: #9ca3af;
        }
        .desktop-input:focus {
          background-color: white;
          border-color: #9333EA;
          outline: none;
          ring: 2px solid rgba(147, 51, 234, 0.2);
        }
        
        /* Mobile input styles */
        .mobile-input {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(147, 51, 234, 0.3);
          color: white;
        }
        .mobile-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }
        .mobile-input:focus {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(147, 51, 234, 0.6);
          outline: none;
        }
        
        /* Password strength bar colors */
        .bg-red-400 { background-color: #f87171; }
        .bg-amber-400 { background-color: #fbbf24; }
        .bg-emerald-500 { background-color: #10b981; }
        .bg-gray-100 { background-color: #f3f4f6; }
        .bg-white/10 { background-color: rgba(255, 255, 255, 0.1); }

        /* Star animations */
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(2%, 2%) scale(1.05); }
          50% { transform: translate(-1%, 3%) scale(0.95); }
          75% { transform: translate(-2%, -1%) scale(1.02); }
        }

        @keyframes shoot {
          0% {
            transform: translateX(0) translateY(0) rotate(-45deg);
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            transform: translateX(300px) translateY(300px) rotate(-45deg);
            opacity: 0;
          }
        }

        #register-stars-container, #mobile-stars-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: hidden;
        }

        .star, .orb, .shooting-star {
          will-change: transform, opacity;
        }
      `}),e.jsxs("div",{className:"hidden lg:flex lg:w-[55%] relative overflow-hidden flex-col justify-between p-12",children:[e.jsx("div",{className:"absolute inset-0 w-full h-full",style:{background:"linear-gradient(135deg, #1a0b2e 0%, #2d1b3a 40%, #3d2a3a 70%, #4d353a 100%)",zIndex:0}}),e.jsx("div",{id:"register-stars-container"}),e.jsx("div",{className:"absolute inset-0 pointer-events-none",style:{background:"radial-gradient(circle at 30% 40%, rgba(114, 58, 105, 0.15) 0%, transparent 60%), radial-gradient(circle at 70% 60%, rgba(72, 27, 115, 0.1) 0%, transparent 60%)",zIndex:2}}),e.jsxs(l.div,{initial:{opacity:0,y:-12},animate:{opacity:1,y:0},transition:{duration:.5},className:"relative z-10 flex items-center gap-2.5",children:[e.jsx("div",{className:"w-[50px] h-[50px] rounded-lg flex items-center justify-center",children:e.jsx("img",{src:L,alt:"apex logo"})}),e.jsxs("span",{className:"font-semibold text-white text-lg tracking-tight",children:["APEX ",e.jsx("span",{className:"text-purple-300 font-normal",children:"Trading"})]})]}),e.jsxs(l.div,{initial:{opacity:0,y:24},animate:{opacity:1,y:0},transition:{duration:.65,delay:.1},className:"relative z-10",children:[e.jsx("p",{className:"text-xs font-semibold text-purple-300 uppercase tracking-widest mb-4",children:"Join 15,000+ investors"}),e.jsxs("h2",{className:"serif text-5xl text-white leading-[1.1] mb-5",children:["Your wealth",e.jsx("br",{}),"starts ",e.jsx("em",{className:"not-italic text-purple-300",children:"here."})]}),e.jsx("p",{className:"text-gray-300 text-base leading-relaxed max-w-sm",children:"Create an account in under two minutes and start earning structured returns on your capital."})]}),e.jsx(l.div,{initial:{opacity:0},animate:{opacity:1},transition:{duration:.6,delay:.25},className:"relative z-10 space-y-3",children:se.map((t,a)=>{const s=t.icon;return e.jsxs(l.div,{initial:{opacity:0,x:-16},animate:{opacity:1,x:0},transition:{delay:.3+a*.07},className:"flex items-center gap-4 glass-card rounded-xl px-4 py-3.5",children:[e.jsx("div",{className:"w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",style:{background:t.bg},children:e.jsx(s,{className:"w-4 h-4",style:{color:t.color}})}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-semibold text-white",children:t.title}),e.jsx("p",{className:"text-xs text-gray-400",children:t.desc})]})]},t.title)})})]}),e.jsxs("div",{className:"flex-1 flex flex-col lg:bg-white overflow-y-auto relative",style:{zIndex:10},children:[e.jsxs("div",{className:"lg:hidden relative min-h-screen",children:[e.jsx("div",{className:"fixed inset-0 w-full h-full",style:{background:"linear-gradient(135deg, #1a0b2e 0%, #2d1b3a 40%, #3d2a3a 70%, #4d353a 100%)",zIndex:0}}),e.jsx("div",{id:"mobile-stars-container",className:"fixed inset-0"}),e.jsx("div",{className:"fixed inset-0 pointer-events-none",style:{background:"radial-gradient(circle at 50% 50%, rgba(114, 58, 105, 0.15) 0%, transparent 70%)",zIndex:2}}),e.jsxs("div",{className:"relative z-10 flex items-center justify-between p-5 border-b border-purple-500/30 glass-card",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("div",{className:"w-[50px] h-[50px] rounded-lg flex items-center justify-center",children:e.jsx("img",{src:L,alt:"apex logo"})}),e.jsxs("span",{className:"font-semibold text-white",children:["APEX"," ",e.jsx("span",{className:"text-purple-300 font-normal",children:"Trading"})]})]}),e.jsxs(h,{to:"/",className:"text-xs text-gray-300 hover:text-white flex items-center gap-1 transition",children:[e.jsx(X,{className:"w-3.5 h-3.5"})," Home"]})]}),e.jsx("div",{className:"relative z-10 flex-1 flex items-center justify-center p-6 py-10",children:e.jsxs(l.div,{initial:{opacity:0,y:16},animate:{opacity:1,y:0},transition:{duration:.5},className:"w-full max-w-sm",children:[e.jsxs("div",{className:"mb-7",children:[e.jsx("h1",{className:"serif text-3xl text-white mb-1.5",children:"Create account"}),e.jsx("p",{className:"text-sm text-gray-300",children:"Join Apex Trading and start investing today"})]}),e.jsx($,{children:r.referralCode&&e.jsxs(l.div,{initial:{opacity:0,height:0},animate:{opacity:1,height:"auto"},exit:{opacity:0,height:0},className:"mb-5 flex items-center gap-3 bg-purple-500/20 border border-purple-500/30 rounded-xl px-4 py-3 overflow-hidden",children:[e.jsx(v,{className:"w-4 h-4 text-purple-300 flex-shrink-0"}),e.jsxs("div",{children:[e.jsx("p",{className:"text-xs font-semibold text-purple-200",children:"Referral code applied"}),e.jsx("p",{className:"text-xs text-purple-300",children:"You'll earn a 5% bonus on your first investment"})]})]})}),e.jsxs($,{children:[b&&e.jsxs(l.div,{initial:{opacity:0,y:-8},animate:{opacity:1,y:0},exit:{opacity:0},className:"mb-4 flex items-center gap-2.5 bg-emerald-500/20 border border-emerald-500/30 rounded-xl px-4 py-3",children:[e.jsx(P,{className:"w-4 h-4 text-emerald-300 flex-shrink-0"}),e.jsx("p",{className:"text-sm text-emerald-200",children:b})]}),f&&e.jsxs(l.div,{initial:{opacity:0,y:-8},animate:{opacity:1,y:0},exit:{opacity:0},className:"mb-4 flex items-center gap-2.5 bg-red-500/20 border border-red-500/30 rounded-xl px-4 py-3",children:[e.jsx("div",{className:"w-4 h-4 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0",children:e.jsx("span",{className:"text-white text-xs font-bold leading-none",children:"!"})}),e.jsx("p",{className:"text-sm text-red-200",children:f})]})]}),e.jsxs("form",{onSubmit:R,className:"space-y-4",children:[e.jsx(u,{icon:Y,label:"Email address",children:e.jsx("input",{type:"email",name:"email",value:r.email,onChange:p,placeholder:"you@example.com",required:!0,autoComplete:"email",className:"input-base mobile-input"})}),e.jsxs(u,{icon:S,label:"Password",children:[e.jsxs("div",{className:"relative",children:[e.jsx("input",{type:y?"text":"password",name:"password",value:r.password,onChange:p,placeholder:"••••••••",required:!0,autoComplete:"new-password",className:"input-base mobile-input pr-12"}),e.jsx("button",{type:"button",onClick:()=>T(!y),className:"absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-gray-300 hover:text-white transition",children:y?e.jsx(A,{className:"w-5 h-5"}):e.jsx(E,{className:"w-5 h-5"})})]}),r.password&&e.jsxs("div",{className:"mt-3",children:[e.jsx("div",{className:"flex gap-1 mb-1",children:[1,2,3,4,5].map(t=>e.jsx("div",{className:`h-1 flex-1 rounded-full transition-all duration-300 ${t<=w.score?w.color:"bg-white/10"}`},t))}),e.jsxs("p",{className:"text-xs text-gray-300",children:["Strength:"," ",e.jsx("span",{className:"font-medium text-white",children:w.label})," · ","min. 6 characters"]})]})]}),e.jsxs(u,{icon:S,label:"Confirm password",children:[e.jsxs("div",{className:"relative",children:[e.jsx("input",{type:j?"text":"password",name:"confirmPassword",value:r.confirmPassword,onChange:p,placeholder:"••••••••",required:!0,autoComplete:"new-password",className:`input-base mobile-input pr-12 ${D?"border-red-500/50 focus:ring-red-500/20 focus:border-red-400":M?"border-emerald-500/50 focus:ring-emerald-500/20 focus:border-emerald-400":""}`}),e.jsx("button",{type:"button",onClick:()=>F(!j),className:"absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-gray-300 hover:text-white transition",children:j?e.jsx(A,{className:"w-5 h-5"}):e.jsx(E,{className:"w-5 h-5"})})]}),M&&e.jsxs("p",{className:"mt-1.5 flex items-center gap-1 text-xs text-emerald-300",children:[e.jsx(P,{className:"w-3.5 h-3.5"})," Passwords match"]})]}),e.jsx(u,{icon:v,label:"Referral code",optional:!0,hint:"Enter a code to earn 5% on your first investment",children:e.jsx("input",{type:"text",name:"referralCode",value:r.referralCode,onChange:p,placeholder:"e.g. APEX123456",className:"input-base mobile-input"})}),e.jsxs("div",{className:"flex items-start gap-3 pt-1",children:[e.jsx("input",{type:"checkbox",id:"terms",required:!0,className:"mt-0.5 h-4 w-4 rounded border-gray-300 text-purple-400 focus:ring-purple-500 flex-shrink-0"}),e.jsxs("label",{htmlFor:"terms",className:"text-xs text-gray-300 leading-relaxed",children:["I agree to the"," ",e.jsx(h,{to:"/terms",className:"text-purple-300 hover:text-purple-200 font-medium",children:"Terms of Service"})," ","and"," ",e.jsx(h,{to:"/privacy",className:"text-purple-300 hover:text-purple-200 font-medium",children:"Privacy Policy"})]})]}),e.jsx("button",{type:"submit",disabled:C,className:"w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white text-base font-semibold rounded-xl transition-all shadow-lg shadow-purple-600/30 disabled:opacity-60 disabled:cursor-not-allowed mt-1",children:C?e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"})," ","Creating account…"]}):e.jsxs(e.Fragment,{children:["Create account ",e.jsx(G,{className:"w-4 h-4"})]})})]}),e.jsxs("p",{className:"mt-6 text-center text-sm text-gray-300",children:["Already have an account?"," ",e.jsx(h,{to:"/login",className:"text-purple-300 hover:text-purple-200 font-semibold",children:"Sign in"})]})]})})]}),e.jsx("div",{className:"hidden lg:block",children:e.jsx("div",{className:"flex-1 flex items-center justify-center p-6 py-10",children:e.jsxs(l.div,{initial:{opacity:0,y:16},animate:{opacity:1,y:0},transition:{duration:.5},className:"w-full max-w-sm",children:[e.jsxs("div",{className:"mb-7",children:[e.jsx("h1",{className:"serif text-3xl text-gray-900 mb-1.5",children:"Create account"}),e.jsx("p",{className:"text-sm text-gray-500",children:"Join Apex Trading and start investing today"})]}),e.jsx($,{children:r.referralCode&&e.jsxs(l.div,{initial:{opacity:0,height:0},animate:{opacity:1,height:"auto"},exit:{opacity:0,height:0},className:"mb-5 flex items-center gap-3 bg-purple-50 border border-purple-200 rounded-xl px-4 py-3 overflow-hidden",children:[e.jsx(v,{className:"w-4 h-4 text-purple-600 flex-shrink-0"}),e.jsxs("div",{children:[e.jsx("p",{className:"text-xs font-semibold text-purple-800",children:"Referral code applied"}),e.jsx("p",{className:"text-xs text-purple-600",children:"You'll earn a 5% bonus on your first investment"})]})]})}),e.jsxs($,{children:[b&&e.jsxs(l.div,{initial:{opacity:0,y:-8},animate:{opacity:1,y:0},exit:{opacity:0},className:"mb-4 flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3",children:[e.jsx(P,{className:"w-4 h-4 text-emerald-600 flex-shrink-0"}),e.jsx("p",{className:"text-sm text-emerald-700",children:b})]}),f&&e.jsxs(l.div,{initial:{opacity:0,y:-8},animate:{opacity:1,y:0},exit:{opacity:0},className:"mb-4 flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3",children:[e.jsx("div",{className:"w-4 h-4 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0",children:e.jsx("span",{className:"text-white text-xs font-bold leading-none",children:"!"})}),e.jsx("p",{className:"text-sm text-red-700",children:f})]})]}),e.jsxs("form",{onSubmit:R,className:"space-y-4",children:[e.jsx(u,{icon:Y,label:"Email address",children:e.jsx("div",{className:"relative",children:e.jsx("input",{type:"email",name:"email",value:r.email,onChange:p,placeholder:"you@example.com",required:!0,autoComplete:"email",className:"input-base desktop-input"})})}),e.jsxs(u,{icon:S,label:"Password",children:[e.jsxs("div",{className:"relative",children:[e.jsx("input",{type:y?"text":"password",name:"password",value:r.password,onChange:p,placeholder:"••••••••",required:!0,autoComplete:"new-password",className:"input-base desktop-input pr-12"}),e.jsx("button",{type:"button",onClick:()=>T(!y),className:"absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-gray-400 hover:text-gray-600 transition",children:y?e.jsx(A,{className:"w-5 h-5"}):e.jsx(E,{className:"w-5 h-5"})})]}),r.password&&e.jsxs("div",{className:"mt-3",children:[e.jsx("div",{className:"flex gap-1 mb-1",children:[1,2,3,4,5].map(t=>e.jsx("div",{className:`h-1 flex-1 rounded-full transition-all duration-300 ${t<=w.score?w.color:"bg-gray-100"}`},t))}),e.jsxs("p",{className:"text-xs text-gray-500",children:["Strength:"," ",e.jsx("span",{className:"font-medium text-gray-700",children:w.label})," · ","min. 6 characters"]})]})]}),e.jsxs(u,{icon:S,label:"Confirm password",children:[e.jsxs("div",{className:"relative",children:[e.jsx("input",{type:j?"text":"password",name:"confirmPassword",value:r.confirmPassword,onChange:p,placeholder:"••••••••",required:!0,autoComplete:"new-password",className:`input-base desktop-input pr-12 ${D?"border-red-300 focus:ring-red-500/20 focus:border-red-400":M?"border-emerald-300 focus:ring-emerald-500/20 focus:border-emerald-400":""}`}),e.jsx("button",{type:"button",onClick:()=>F(!j),className:"absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-gray-400 hover:text-gray-600 transition",children:j?e.jsx(A,{className:"w-5 h-5"}):e.jsx(E,{className:"w-5 h-5"})})]}),M&&e.jsxs("p",{className:"mt-1.5 flex items-center gap-1 text-xs text-emerald-600",children:[e.jsx(P,{className:"w-3.5 h-3.5"})," Passwords match"]})]}),e.jsx(u,{icon:v,label:"Referral code",optional:!0,hint:"Enter a code to earn 5% on your first investment",children:e.jsx("input",{type:"text",name:"referralCode",value:r.referralCode,onChange:p,placeholder:"e.g. APEX123456",className:"input-base desktop-input"})}),e.jsxs("div",{className:"flex items-start gap-3 pt-1",children:[e.jsx("input",{type:"checkbox",id:"terms",required:!0,className:"mt-0.5 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 flex-shrink-0"}),e.jsxs("label",{htmlFor:"terms",className:"text-xs text-gray-500 leading-relaxed",children:["I agree to the"," ",e.jsx(h,{to:"/terms",className:"text-purple-600 hover:text-purple-700 font-medium",children:"Terms of Service"})," ","and"," ",e.jsx(h,{to:"/privacy",className:"text-purple-600 hover:text-purple-700 font-medium",children:"Privacy Policy"})]})]}),e.jsx("button",{type:"submit",disabled:C,className:"w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white text-base font-semibold rounded-xl transition-all shadow-lg shadow-purple-600/30 disabled:opacity-60 disabled:cursor-not-allowed mt-1",children:C?e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"})," ","Creating account…"]}):e.jsxs(e.Fragment,{children:["Create account ",e.jsx(G,{className:"w-4 h-4"})]})})]}),e.jsxs("p",{className:"mt-6 text-center text-sm text-gray-500",children:["Already have an account?"," ",e.jsx(h,{to:"/login",className:"text-purple-600 hover:text-purple-700 font-semibold",children:"Sign in"})]}),e.jsx("div",{className:"mt-3 text-center",children:e.jsxs(h,{to:"/",className:"inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition",children:[e.jsx(X,{className:"w-3 h-3"})," Back to home"]})})]})})})]})]})};export{fe as default};
