import{u as Z,r,j as e,L as q,a as O,X as z,M as Q,T as J}from"./index-CzRleNsx.js";import{A as P}from"./index-DheHe2nH.js";import{m as b}from"./proxy-D35Dg5VQ.js";import{S as K}from"./sparkles-BBoO_E96.js";import{A as _}from"./arrow-right-DKgKc0hh.js";import{C as ee}from"./circle-check-big-DMOvB-_Z.js";import{C as te}from"./copy-CVZw6Gjn.js";import{Z as ae}from"./zap-DWAxADT8.js";const y=l=>new Intl.NumberFormat("en-NG",{style:"currency",currency:"NGN",minimumFractionDigits:0,maximumFractionDigits:0}).format(l),g=[{id:"apex1",name:"APEX 1",accent:"#9333EA",accentLight:"#F3E8FF",accentMid:"#D8B4FE",icon:ae,returnRate:30,duration:"10 working days",payments:"2 payments · 50% each",minAmount:1e4,maxAmount:5e5,features:["Perfect entry point","Returns in 10 working days","50% payout every 5 days","Low minimum capital"],highlight:!1},{id:"apex2",name:"APEX 2",accent:"#A855F7",accentLight:"#FAF5FF",accentMid:"#E9D5FF",icon:J,returnRate:50,duration:"15 working days",payments:"3 equal payments",minAmount:2e4,maxAmount:1e6,features:["Maximum return potential","3 staggered withdrawals","Ideal for serious investors","Higher capital ceiling"],highlight:!0,badge:"Most popular"}],pe=()=>{const l=Z(),[T,v]=r.useState(!1),[j,N]=r.useState(!1),[f,k]=r.useState(!1);r.useState(null);const[M,F]=r.useState("APEX 1"),[c,p]=r.useState(1e5),[L,d]=r.useState("100000"),[A,D]=r.useState(!1),[S,R]=r.useState({totalUsers:0,totalInvested:0,totalWithdrawn:0,activeInvestments:0}),[u,X]=r.useState(!1);r.useEffect(()=>{const t=()=>{D(window.innerWidth<768)};return t(),window.addEventListener("resize",t),()=>window.removeEventListener("resize",t)},[]),r.useEffect(()=>{setTimeout(()=>{R({totalUsers:15420,totalInvested:125e7,totalWithdrawn:875e6,activeInvestments:8321}),X(!0)},1200)},[]),r.useEffect(()=>{(()=>{const a=window.location.hash;if(a){const s=a.replace("#",""),n=document.getElementById(s);n&&setTimeout(()=>{n.scrollIntoView({behavior:"smooth"})},100)}})()},[]),r.useEffect(()=>{const t=document.getElementById("stars-container");if(t){if(t.innerHTML="",A)for(let a=0;a<20;a++){const s=document.createElement("div"),n=Math.random()*100,m=Math.random()*100,i=Math.random()*1.5+.5;s.style.cssText=`
          position: absolute;
          left: ${n}%;
          top: ${m}%;
          width: ${i}px;
          height: ${i}px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          pointer-events: none;
        `,t.appendChild(s)}else{for(let a=0;a<150;a++){const s=document.createElement("div");s.className="star";const n=Math.random()*100,m=Math.random()*100,i=Math.random()*2.5+.5,x=Math.random()*4+2,w=Math.random()*5,h=Math.random()*.7+.3;s.style.cssText=`
          position: absolute;
          left: ${n}%;
          top: ${m}%;
          width: ${i}px;
          height: ${i}px;
          background: white;
          border-radius: 50%;
          opacity: ${h};
          box-shadow: 0 0 ${i*2}px rgba(255, 255, 255, 0.8);
          animation: twinkle ${x}s ease-in-out infinite;
          animation-delay: ${w}s;
          pointer-events: none;
        `,t.appendChild(s)}for(let a=0;a<20;a++){const s=document.createElement("div");s.className="orb";const n=Math.random()*100,m=Math.random()*100,i=Math.random()*150+50,x=Math.random()*20+20,w=Math.random()*10,h=["#481B73","#5A2A71","#723A69","#8A4A61"],W=h[Math.floor(Math.random()*h.length)];s.style.cssText=`
          position: absolute;
          left: ${n}%;
          top: ${m}%;
          width: ${i}px;
          height: ${i}px;
          background: radial-gradient(circle at 30% 30%, ${W}80, transparent 70%);
          border-radius: 50%;
          filter: blur(40px);
          animation: float ${x}s ease-in-out infinite;
          animation-delay: ${w}s;
          pointer-events: none;
        `,t.appendChild(s)}for(let a=0;a<10;a++){const s=document.createElement("div");s.className="shooting-star";const n=Math.random()*100,m=Math.random()*100,i=Math.random()*15,x=Math.random()*3+2;s.style.cssText=`
          position: absolute;
          left: ${n}%;
          top: ${m}%;
          width: 100px;
          height: 2px;
          background: linear-gradient(90deg, rgba(255,255,255,0.8), rgba(255,255,255,0.3), transparent);
          transform: rotate(-45deg);
          filter: blur(1px);
          animation: shoot ${x}s linear infinite;
          animation-delay: ${i}s;
          opacity: 0;
          pointer-events: none;
        `,t.appendChild(s)}}return()=>{t&&(t.innerHTML="")}}},[A]);const o=g.find(t=>t.name===M)||g[0],C=o.returnRate,E=c*C/100,B=c+E,V=t=>{const a=t.target.value;if(a===""){d(""),p(0);return}const s=a.replace(/[^0-9]/g,"");if(s===""){d(""),p(0);return}const n=parseInt(s,10);d(s),p(n)},G=()=>{if(c===0){d("");return}const t=Math.min(Math.max(c,o.minAmount),o.maxAmount);p(t),d(t.toString())},Y=t=>{F(t);const a=g.find(s=>s.name===t);if(a){let s=c;c<a.minAmount?s=a.minAmount:c>a.maxAmount&&(s=a.maxAmount),p(s),d(s.toString())}},H=t=>{const a=Math.min(Math.max(t,o.minAmount),o.maxAmount);p(a),d(a.toString())},U=()=>{navigator.clipboard.writeText("https://apex.com/ref/APEX123456"),N(!0),setTimeout(()=>N(!1),2500)},$=t=>{k(!1);const a=document.getElementById(t);a&&(a.scrollIntoView({behavior:"smooth"}),window.history.pushState(null,"",`#${t}`))},I=[{id:"packages",label:"Packages"},{id:"how-it-works",label:"How it works"},{id:"features",label:"Features"},{id:"testimonials",label:"Testimonials"},{id:"faq",label:"FAQ"}];return e.jsxs("div",{className:"min-h-screen relative",style:{fontFamily:"'DM Sans', system-ui, sans-serif"},children:[e.jsx("style",{children:`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Serif+Display:ital@0;1&display=swap');
        
        * {
          -webkit-tap-highlight-color: transparent;
          -webkit-touch-callout: none;
        }
        
        .serif { font-family: 'DM Serif Display', Georgia, serif; }
        
        .card-hover { 
          transition: transform 0.25s ease, box-shadow 0.25s ease; 
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(147, 51, 234, 0.2);
          will-change: transform;
          transform: translateZ(0);
        }
        
        .card-hover:hover { 
          transform: translateY(-4px); 
          box-shadow: 0 20px 60px -12px rgba(147, 51, 234, 0.3);
          border-color: rgba(147, 51, 234, 0.4);
        }
        
        details > summary { list-style: none; }
        details > summary::-webkit-details-marker { display: none; }
        
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { 
          -webkit-appearance: none; 
          margin: 0; 
        }
        
        input[type=number] { -moz-appearance: textfield; }
        
        /* Glass morphism effects */
        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(147, 51, 234, 0.2);
          will-change: transform;
          transform: translateZ(0);
        }
        
        .glass-card:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(147, 51, 234, 0.4);
        }
        
        /* Text contrast improvements */
        .text-on-dark {
          color: rgba(255, 255, 255, 0.95);
        }
        .text-on-dark-secondary {
          color: rgba(255, 255, 255, 0.7);
        }
        .text-on-dark-muted {
          color: rgba(255, 255, 255, 0.5);
        }
        
        /* Star animations - only on desktop */
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

        #stars-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
          overflow: hidden;
        }

        /* Optimize scrolling */
        .min-h-screen {
          -webkit-overflow-scrolling: touch;
        }

        /* Mobile optimizations */
        @media (max-width: 768px) {
          .glass-card {
            backdrop-filter: blur(5px);
            -webkit-backdrop-filter: blur(5px);
          }
          
          .card-hover:hover {
            transform: none;
            box-shadow: none;
          }
          
          .glass-card:hover {
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(147, 51, 234, 0.2);
          }
          
          .star, .orb, .shooting-star {
            animation: none !important;
          }
          
          @media (prefers-reduced-motion: reduce) {
            *, ::before, ::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
              scroll-behavior: auto !important;
            }
          }
        }

        #root {
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          height: 100vh;
        }
      `}),e.jsx("div",{className:"fixed inset-0 w-full h-full",style:{background:"linear-gradient(135deg, #1a0b2e 0%, #2d1b3a 40%, #3d2a3a 70%, #4d353a 100%)",zIndex:0,willChange:"transform"}}),e.jsx("div",{id:"stars-container"}),e.jsx("div",{className:"fixed inset-0 pointer-events-none",style:{background:"radial-gradient(circle at 30% 40%, rgba(114, 58, 105, 0.15) 0%, transparent 60%), radial-gradient(circle at 70% 60%, rgba(72, 27, 115, 0.1) 0%, transparent 60%)",zIndex:2,willChange:"transform"}}),e.jsxs("nav",{className:"fixed top-0 w-full z-50 bg-black/40 backdrop-blur-xl border-b border-purple-500/20",style:{zIndex:50},children:[e.jsxs("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between",children:[e.jsxs(q,{to:"/",className:"flex items-center gap-2.5",onClick:()=>window.scrollTo({top:0,behavior:"smooth"}),children:[e.jsx("div",{className:"w-[50px] h-[50px] rounded-lg flex items-center justify-center",children:e.jsx("img",{src:O,alt:"apex logo",loading:"lazy"})}),e.jsxs("span",{className:"font-semibold text-white text-lg tracking-tight",children:["APEX ",e.jsx("span",{className:"text-purple-300 font-normal",children:"Trading"})]})]}),e.jsx("div",{className:"hidden md:flex items-center gap-7",children:I.map(t=>e.jsx("button",{onClick:()=>$(t.id),className:"text-base text-gray-300 hover:text-white transition-colors",children:t.label},t.id))}),e.jsxs("div",{className:"hidden md:flex items-center gap-3",children:[e.jsx("button",{onClick:()=>l("/login"),className:"text-base text-gray-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition",children:"Sign in"}),e.jsx("button",{onClick:()=>l("/register"),className:"text-base font-medium text-white bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 px-4 py-2 rounded-lg transition shadow-lg shadow-purple-600/30",children:"Get started"})]}),e.jsx("button",{onClick:()=>k(!f),className:"md:hidden p-2 rounded-lg hover:bg-white/10 transition text-white","aria-label":"Toggle menu",children:f?e.jsx(z,{size:20}):e.jsx(Q,{size:20})})]}),e.jsx(P,{children:f&&e.jsx(b.div,{initial:{opacity:0,height:0},animate:{opacity:1,height:"auto"},exit:{opacity:0,height:0},transition:{duration:.2},className:"md:hidden border-t border-purple-500/20 bg-black/60 backdrop-blur-xl overflow-hidden",children:e.jsxs("div",{className:"px-4 py-4 space-y-1",children:[I.map(t=>e.jsx("button",{onClick:()=>$(t.id),className:"block w-full text-left py-2.5 px-3 text-base text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition",children:t.label},t.id)),e.jsxs("div",{className:"pt-3 space-y-2 border-t border-purple-500/20 mt-3",children:[e.jsx("button",{onClick:()=>l("/login"),className:"w-full py-2.5 text-base border border-purple-500/30 text-white rounded-lg hover:bg-white/10 transition",children:"Sign in"}),e.jsx("button",{onClick:()=>l("/register"),className:"w-full py-2.5 text-base font-medium bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg hover:from-purple-700 hover:to-purple-600 transition",children:"Get started"})]})]})})})]}),e.jsxs("div",{className:"relative",style:{zIndex:10},children:[e.jsx("section",{className:"pt-28 pb-20 md:pt-36 md:pb-28 relative overflow-hidden",children:e.jsx("div",{className:"relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",children:e.jsxs("div",{className:"grid lg:grid-cols-2 gap-16 items-center",children:[e.jsxs(b.div,{initial:{opacity:0,x:-24},animate:{opacity:1,x:0},transition:{duration:.7,ease:[.22,1,.36,1]},viewport:{once:!0},children:[e.jsxs("div",{className:"inline-flex items-center gap-2 bg-white/10 text-purple-200 px-4 py-2 rounded-full text-sm font-medium mb-8 border border-purple-500/30 backdrop-blur-sm",children:[e.jsx(K,{className:"w-4 h-4"}),"Trusted by 15,000+ investors across Nigeria"]}),e.jsxs("h1",{className:"serif text-5xl md:text-6xl lg:text-7xl text-white leading-[1.05] mb-6",children:["Grow your wealth",e.jsx("br",{}),e.jsx("em",{className:"not-italic text-purple-300",children:"intelligently."})]}),e.jsxs("p",{className:"text-xl text-gray-300 leading-relaxed mb-10 max-w-md",children:["Earn up to"," ",e.jsx("strong",{className:"text-white font-semibold",children:"50% returns"})," ","in 15 working days. Start with as little as ₦10,000 and withdraw on a predictable schedule."]}),e.jsx("div",{className:"flex flex-wrap gap-3 mb-14",children:e.jsxs("button",{onClick:()=>l("/register"),className:"inline-flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white text-base font-semibold rounded-xl hover:from-purple-700 hover:to-purple-600 transition shadow-lg shadow-purple-600/30",children:["Start investing ",e.jsx(_,{className:"w-4 h-4"})]})}),e.jsx("div",{className:"grid grid-cols-2 sm:grid-cols-4 gap-3",children:[{label:"Users",value:u?S.totalUsers.toLocaleString():"—"},{label:"Invested",value:u?"₦1.25B+":"—"},{label:"Withdrawn",value:u?"₦875M+":"—"},{label:"Active now",value:u?S.activeInvestments.toLocaleString():"—"}].map(t=>e.jsxs("div",{className:"glass-card rounded-xl p-3",children:[e.jsx("p",{className:"stat-label text-sm text-gray-400 mb-1",children:t.label}),e.jsx("p",{className:"stat-value text-base font-bold text-white",children:t.value})]},t.label))})]}),e.jsxs(b.div,{initial:{opacity:0,scale:.94},animate:{opacity:1,scale:1},transition:{duration:.7,delay:.15,ease:[.22,1,.36,1]},viewport:{once:!0},className:"relative",children:[e.jsx("div",{className:"absolute -inset-px rounded-3xl opacity-40",style:{background:"linear-gradient(135deg, rgba(147,51,234,0.5), rgba(168,85,247,0.3))"}}),e.jsxs("div",{className:"relative glass-card rounded-3xl p-8",children:[e.jsx("p",{className:"text-sm font-semibold text-gray-400 uppercase tracking-widest mb-5",children:"Investment calculator"}),e.jsxs("div",{className:"space-y-4 mb-6",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-sm text-gray-400 mb-2",children:"Package"}),e.jsx("div",{className:"flex gap-2",children:g.map(t=>e.jsx("button",{onClick:()=>Y(t.name),className:`flex-1 text-center py-2 rounded-lg text-base font-semibold transition-all ${M===t.name?t.name==="APEX 1"?"bg-gradient-to-r from-purple-600 to-purple-500 text-white":"bg-gradient-to-r from-purple-500 to-purple-400 text-white":"bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white"}`,children:t.name},t.name))})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm text-gray-400 mb-2",children:"Amount (₦)"}),e.jsxs("div",{className:"flex items-center gap-2 border border-purple-500/30 rounded-lg px-3 py-3 bg-white/5 focus-within:border-purple-400 transition",children:[e.jsx("span",{className:"text-gray-400 text-base",children:"₦"}),e.jsx("input",{type:"text",value:L,onChange:V,onBlur:G,className:"w-full text-base font-semibold text-white outline-none bg-transparent",placeholder:"Enter amount",inputMode:"numeric"})]}),e.jsx("div",{className:"flex gap-2 mt-2 flex-wrap",children:[5e4,1e5,25e4,5e5].map(t=>e.jsxs("button",{onClick:()=>H(t),className:"text-sm bg-white/10 hover:bg-white/20 text-gray-300 px-2 py-1 rounded transition",children:["₦",t.toLocaleString()]},t))}),e.jsxs("p",{className:"text-sm text-gray-500 mt-2",children:["Min: ₦",o.minAmount.toLocaleString()," · Max: ₦",o.maxAmount.toLocaleString()]})]})]}),e.jsxs("div",{className:"bg-white/5 border border-purple-500/20 rounded-xl p-4 space-y-2.5",children:[e.jsxs("div",{className:"flex justify-between text-base",children:[e.jsx("span",{className:"text-gray-400",children:"Principal"}),e.jsx("span",{className:"font-semibold text-white",children:y(c)})]}),e.jsxs("div",{className:"flex justify-between text-base",children:[e.jsxs("span",{className:"text-gray-400",children:["Return (",C,"%)"]}),e.jsxs("span",{className:"font-semibold text-purple-300",children:["+",y(E)]})]}),e.jsx("div",{className:"h-px bg-purple-500/20"}),e.jsxs("div",{className:"flex justify-between text-base",children:[e.jsx("span",{className:"text-gray-300 font-medium",children:"Total payout"}),e.jsx("span",{className:"font-bold text-purple-300 text-lg",children:y(B)})]})]}),e.jsxs("p",{className:"text-sm text-center text-gray-500 mt-4",children:[o.payments," · ",o.duration]})]})]})]})})}),e.jsx("section",{id:"packages",className:"py-24"}),e.jsx("section",{id:"how-it-works",className:"py-24"}),e.jsx("section",{id:"features",className:"py-24"}),e.jsx("section",{id:"testimonials",className:"py-24"}),e.jsx("section",{id:"faq",className:"py-24"}),e.jsx("section",{className:"py-24"}),e.jsx("footer",{className:"py-14 border-t border-purple-500/20"})]}),e.jsx(P,{children:T&&e.jsx("div",{className:"fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4",children:e.jsxs(b.div,{initial:{opacity:0,scale:.95,y:16},animate:{opacity:1,scale:1,y:0},exit:{opacity:0,scale:.95},transition:{duration:.2},className:"glass-card rounded-2xl w-full max-w-sm shadow-2xl p-6",children:[e.jsxs("div",{className:"flex items-center justify-between mb-4",children:[e.jsx("h3",{className:"font-semibold text-white text-lg",children:"Your referral link"}),e.jsx("button",{onClick:()=>v(!1),className:"p-1.5 hover:bg-white/10 rounded-lg transition","aria-label":"Close",children:e.jsx(z,{size:16,className:"text-gray-400"})})]}),e.jsx("p",{className:"text-base text-gray-400 mb-5",children:"Share this link and earn 5% when your friends invest."}),e.jsxs("div",{className:"flex items-center gap-2 bg-white/5 border border-purple-500/30 rounded-xl p-3 mb-4",children:[e.jsx("code",{className:"flex-1 text-sm text-purple-300 truncate font-mono",children:"https://apex.com/ref/APEX123456"}),e.jsx("button",{onClick:U,className:"flex-shrink-0 p-1.5 hover:bg-white/10 rounded-lg transition","aria-label":"Copy link",children:j?e.jsx(ee,{className:"w-4 h-4 text-purple-400"}):e.jsx(te,{className:"w-4 h-4 text-gray-400"})})]}),j&&e.jsx("p",{className:"text-sm text-purple-400 mb-3",children:"Copied to clipboard!"}),e.jsx("p",{className:"text-sm text-gray-500 mb-5",children:"You need an account to earn referral bonuses."}),e.jsx("button",{onClick:()=>{v(!1),l("/register")},className:"w-full py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white text-base font-semibold rounded-xl hover:from-purple-700 hover:to-purple-600 transition",children:"Create account to earn"})]})})})]})};export{pe as default};
