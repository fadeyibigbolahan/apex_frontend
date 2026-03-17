import{r as d,b as V,u as Z,j as e,a as R,L as v,X as ee}from"./index-BPU9ZpYb.js";import{a as E,u as q}from"./index-8ldvlUj0.js";import{m as o}from"./proxy-B5j70qiu.js";import{A as X}from"./arrow-left-Dg86oQX4.js";import{A as y}from"./index-Dczf0Z__.js";import{C as z}from"./circle-check-big-CvbBtW1b.js";import{M as A}from"./mail-Cn0AeXvX.js";import{L as Y}from"./lock-DAgIDc0X.js";import{E as G}from"./eye-off-CSHlFOwX.js";import{E as H}from"./eye-DPjitf78.js";import{A as O}from"./arrow-right-ClgcRwMf.js";const k=({icon:c,label:M,hint:p,error:x,children:h,optional:g})=>e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center justify-between mb-1.5",children:[e.jsx("label",{className:"text-sm font-medium lg:text-gray-700 text-gray-300",children:M}),g&&e.jsx("span",{className:"text-xs text-gray-400",children:"Optional"})]}),e.jsxs("div",{className:"relative",children:[e.jsx("div",{className:"absolute z-10 inset-y-0 left-3 flex items-center pointer-events-none",children:e.jsx(c,{className:"w-5 h-5 lg:text-gray-400 text-gray-300"})}),h]}),p&&!x&&e.jsx("p",{className:"mt-1.5 text-xs text-gray-400",children:p}),x&&e.jsx("p",{className:"mt-1.5 text-xs text-red-400",children:x})]}),xe=()=>{const[c,M]=d.useState({email:"",password:""}),[p,x]=d.useState(""),[h,g]=d.useState(""),[j,$]=d.useState(!1),[f,D]=d.useState(!1),[W,_]=d.useState(!1),[w,F]=d.useState(""),[J,B]=d.useState(!1),[P,S]=d.useState(!1),[I,b]=d.useState(""),{login:K}=V(),Q=Z();d.useEffect(()=>{const a=document.getElementById("login-stars-container");if(a){for(let s=0;s<150;s++){const t=document.createElement("div");t.className="star";const n=Math.random()*100,l=Math.random()*100,i=Math.random()*2.5+.5,r=Math.random()*4+2,u=Math.random()*5,m=Math.random()*.7+.3;t.style.cssText=`
        position: absolute;
        left: ${n}%;
        top: ${l}%;
        width: ${i}px;
        height: ${i}px;
        background: white;
        border-radius: 50%;
        opacity: ${m};
        box-shadow: 0 0 ${i*2}px rgba(255, 255, 255, 0.8);
        animation: twinkle ${r}s ease-in-out infinite;
        animation-delay: ${u}s;
        z-index: 1;
      `,a.appendChild(t)}for(let s=0;s<15;s++){const t=document.createElement("div");t.className="orb";const n=Math.random()*100,l=Math.random()*100,i=Math.random()*150+50,r=Math.random()*20+20,u=Math.random()*10,m=["#481B73","#5A2A71","#723A69","#8A4A61"],C=m[Math.floor(Math.random()*m.length)];t.style.cssText=`
        position: absolute;
        left: ${n}%;
        top: ${l}%;
        width: ${i}px;
        height: ${i}px;
        background: radial-gradient(circle at 30% 30%, ${C}80, transparent 70%);
        border-radius: 50%;
        filter: blur(40px);
        animation: float ${r}s ease-in-out infinite;
        animation-delay: ${u}s;
        pointer-events: none;
        z-index: 0;
      `,a.appendChild(t)}for(let s=0;s<8;s++){const t=document.createElement("div");t.className="shooting-star";const n=Math.random()*100,l=Math.random()*100,i=Math.random()*15,r=Math.random()*3+2;t.style.cssText=`
        position: absolute;
        left: ${n}%;
        top: ${l}%;
        width: 100px;
        height: 2px;
        background: linear-gradient(90deg, rgba(255,255,255,0.8), rgba(255,255,255,0.3), transparent);
        transform: rotate(-45deg);
        filter: blur(1px);
        animation: shoot ${r}s linear infinite;
        animation-delay: ${i}s;
        opacity: 0;
        z-index: 2;
      `,a.appendChild(t)}return()=>{a&&(a.innerHTML="")}}},[]),d.useEffect(()=>{const a=document.getElementById("mobile-stars-container");if(a){for(let s=0;s<80;s++){const t=document.createElement("div");t.className="star";const n=Math.random()*100,l=Math.random()*100,i=Math.random()*2+.5,r=Math.random()*3+2,u=Math.random()*5,m=Math.random()*.6+.2;t.style.cssText=`
        position: absolute;
        left: ${n}%;
        top: ${l}%;
        width: ${i}px;
        height: ${i}px;
        background: white;
        border-radius: 50%;
        opacity: ${m};
        box-shadow: 0 0 ${i*2}px rgba(255, 255, 255, 0.8);
        animation: twinkle ${r}s ease-in-out infinite;
        animation-delay: ${u}s;
        z-index: 1;
      `,a.appendChild(t)}for(let s=0;s<8;s++){const t=document.createElement("div");t.className="orb";const n=Math.random()*100,l=Math.random()*100,i=Math.random()*100+30,r=Math.random()*15+15,u=Math.random()*10,m=["#481B73","#5A2A71","#723A69"],C=m[Math.floor(Math.random()*m.length)];t.style.cssText=`
        position: absolute;
        left: ${n}%;
        top: ${l}%;
        width: ${i}px;
        height: ${i}px;
        background: radial-gradient(circle at 30% 30%, ${C}60, transparent 70%);
        border-radius: 50%;
        filter: blur(30px);
        animation: float ${r}s ease-in-out infinite;
        animation-delay: ${u}s;
        pointer-events: none;
        z-index: 0;
      `,a.appendChild(t)}return()=>{a&&(a.innerHTML="")}}},[]);const N=a=>{const{name:s,value:t}=a.target;M({...c,[s]:s==="email"?t.trim().toLowerCase():t}),x(""),g("")},L=async a=>{var s,t,n;if(a.preventDefault(),x(""),g(""),$(!0),!c.email||!c.password){x("Email and password are required"),$(!1);return}try{const l=await E.post(`${q}auth/login`,{email:c.email,password:c.password}),{token:i,data:r}=l.data;localStorage.setItem("token",i),E.defaults.headers.common.Authorization=`Bearer ${i}`,K({id:r.user._id,email:r.user.email,firstName:r.user.firstName,lastName:r.user.lastName,role:r.user.role,referralCode:r.user.referralCode,totalInvested:r.user.totalInvested,totalWithdrawn:r.user.totalWithdrawn,referralBonus:r.user.referralBonus,retradingBonus:r.user.retradingBonus,hasBankDetails:!!((s=r.user.bankDetails)!=null&&s.accountNumber)}),g("Signed in! Redirecting…"),setTimeout(()=>Q(r.user.role==="admin"?"/admin":"/dashboard"),1e3)}catch(l){console.log("error signin",l),x(((n=(t=l.response)==null?void 0:t.data)==null?void 0:n.message)||"Invalid credentials. Please try again.")}finally{$(!1)}},U=async a=>{var s,t;if(a.preventDefault(),b(""),S(!0),!w){b("Please enter your email address"),S(!1);return}try{await E.post(`${q}auth/forgot-password`,{email:w}),B(!0)}catch(n){b(((t=(s=n.response)==null?void 0:s.data)==null?void 0:t.message)||"Failed to send reset email. Please try again.")}finally{S(!1)}},T=()=>{_(!1),B(!1),F(""),b("")};return e.jsxs("div",{className:"flex min-h-screen w-full relative",style:{fontFamily:"'DM Sans', system-ui, sans-serif"},children:[e.jsx("style",{children:`
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

        #login-stars-container, #mobile-stars-container {
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
      `}),e.jsxs("div",{className:"hidden lg:flex lg:w-[55%] relative overflow-hidden flex-col justify-between p-12",children:[e.jsx("div",{className:"absolute inset-0 w-full h-full",style:{background:"linear-gradient(135deg, #1a0b2e 0%, #2d1b3a 40%, #3d2a3a 70%, #4d353a 100%)",zIndex:0}}),e.jsx("div",{id:"login-stars-container"}),e.jsx("div",{className:"absolute inset-0 pointer-events-none",style:{background:"radial-gradient(circle at 30% 40%, rgba(114, 58, 105, 0.15) 0%, transparent 60%), radial-gradient(circle at 70% 60%, rgba(72, 27, 115, 0.1) 0%, transparent 60%)",zIndex:2}}),e.jsxs(o.div,{initial:{opacity:0,y:-12},animate:{opacity:1,y:0},transition:{duration:.5},className:"relative z-10 flex items-center gap-2.5",children:[e.jsx("div",{className:"w-[50px] h-[50px] rounded-lg flex items-center justify-center",children:e.jsx("img",{src:R,alt:"apex logo"})}),e.jsxs("span",{className:"font-semibold text-white text-lg tracking-tight",children:["APEX ",e.jsx("span",{className:"text-purple-300 font-normal",children:"Trading"})]})]}),e.jsxs(o.div,{initial:{opacity:0,y:24},animate:{opacity:1,y:0},transition:{duration:.65,delay:.1},className:"relative z-10",children:[e.jsx("p",{className:"text-xs font-semibold text-purple-300 uppercase tracking-widest mb-4",children:"Welcome back"}),e.jsxs("h2",{className:"serif text-5xl text-white leading-[1.1] mb-5",children:["Good to see",e.jsx("br",{}),"you ",e.jsx("em",{className:"not-italic text-purple-300",children:"again."})]}),e.jsx("p",{className:"text-gray-300 text-base leading-relaxed max-w-sm",children:"Your investments are working while you're away. Sign in to check your returns and manage your portfolio."})]}),e.jsx(o.div,{initial:{opacity:0},animate:{opacity:1},transition:{duration:.6,delay:.25},className:"relative z-10 grid grid-cols-2 gap-3",children:[{value:"15,000+",label:"Active investors",color:"#C084FC"},{value:"₦1.25B+",label:"Total invested",color:"#A855F7"},{value:"₦875M+",label:"Paid out to date",color:"#9333EA"},{value:"99.8%",label:"On-time payments",color:"#D8B4FE"}].map((a,s)=>e.jsxs(o.div,{initial:{opacity:0,y:12},animate:{opacity:1,y:0},transition:{delay:.35+s*.07},className:"glass-card rounded-xl px-4 py-3.5",children:[e.jsx("p",{className:"text-xl font-bold mb-0.5",style:{color:a.color},children:a.value}),e.jsx("p",{className:"text-xs text-gray-400",children:a.label})]},a.label))})]}),e.jsxs("div",{className:"flex-1 flex flex-col lg:bg-white overflow-y-auto relative",style:{zIndex:10},children:[e.jsxs("div",{className:"lg:hidden relative min-h-screen",children:[e.jsx("div",{className:"fixed inset-0 w-full h-full",style:{background:"linear-gradient(135deg, #1a0b2e 0%, #2d1b3a 40%, #3d2a3a 70%, #4d353a 100%)",zIndex:0}}),e.jsx("div",{id:"mobile-stars-container",className:"fixed inset-0"}),e.jsx("div",{className:"fixed inset-0 pointer-events-none",style:{background:"radial-gradient(circle at 50% 50%, rgba(114, 58, 105, 0.15) 0%, transparent 70%)",zIndex:2}}),e.jsxs("div",{className:"relative z-10 flex items-center justify-between p-5 border-b border-purple-500/30 glass-card",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("div",{className:"w-[50px] h-[50px] rounded-lg flex items-center justify-center",children:e.jsx("img",{src:R,alt:"apex logo"})}),e.jsxs("span",{className:"font-semibold text-white",children:["APEX"," ",e.jsx("span",{className:"text-purple-300 font-normal",children:"Trading"})]})]}),e.jsxs(v,{to:"/",className:"text-xs text-gray-300 hover:text-white flex items-center gap-1 transition",children:[e.jsx(X,{className:"w-3.5 h-3.5"})," Home"]})]}),e.jsx("div",{className:"relative z-10 flex-1 flex items-center justify-center p-6 py-10",children:e.jsxs(o.div,{initial:{opacity:0,y:16},animate:{opacity:1,y:0},transition:{duration:.5},className:"w-full max-w-sm",children:[e.jsxs("div",{className:"mb-7",children:[e.jsx("h1",{className:"serif text-3xl text-white mb-1.5",children:"Sign in"}),e.jsx("p",{className:"text-sm text-gray-300",children:"Access your investment dashboard"})]}),e.jsxs(y,{children:[h&&e.jsxs(o.div,{initial:{opacity:0,y:-8},animate:{opacity:1,y:0},exit:{opacity:0},className:"mb-4 flex items-center gap-2.5 bg-emerald-500/20 border border-emerald-500/30 rounded-xl px-4 py-3",children:[e.jsx(z,{className:"w-4 h-4 text-emerald-300 flex-shrink-0"}),e.jsx("p",{className:"text-sm text-emerald-200",children:h})]}),p&&e.jsxs(o.div,{initial:{opacity:0,y:-8},animate:{opacity:1,y:0},exit:{opacity:0},className:"mb-4 flex items-center gap-2.5 bg-red-500/20 border border-red-500/30 rounded-xl px-4 py-3",children:[e.jsx("div",{className:"w-4 h-4 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0",children:e.jsx("span",{className:"text-white text-xs font-bold leading-none",children:"!"})}),e.jsx("p",{className:"text-sm text-red-200",children:p})]})]}),e.jsxs("form",{onSubmit:L,className:"space-y-4",children:[e.jsx(k,{icon:A,label:"Email address",children:e.jsx("input",{type:"email",name:"email",value:c.email,onChange:N,placeholder:"you@example.com",required:!0,autoComplete:"email",className:"input-base mobile-input"})}),e.jsx(k,{icon:Y,label:"Password",children:e.jsxs("div",{className:"relative",children:[e.jsx("input",{type:f?"text":"password",name:"password",value:c.password,onChange:N,placeholder:"••••••••",required:!0,autoComplete:"current-password",className:"input-base mobile-input pr-12"}),e.jsx("button",{type:"button",onClick:()=>D(!f),className:"absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-gray-300 hover:text-white transition",children:f?e.jsx(G,{className:"w-5 h-5"}):e.jsx(H,{className:"w-5 h-5"})})]})}),e.jsx("button",{type:"submit",disabled:j,className:"w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white text-base font-semibold rounded-xl transition-all shadow-lg shadow-purple-600/30 disabled:opacity-60 disabled:cursor-not-allowed mt-2",children:j?e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"})," ","Signing in…"]}):e.jsxs(e.Fragment,{children:["Sign in ",e.jsx(O,{className:"w-4 h-4"})]})})]}),e.jsxs("p",{className:"mt-6 text-center text-sm text-gray-300",children:["Don't have an account?"," ",e.jsx(v,{to:"/register",className:"text-purple-300 hover:text-purple-200 font-semibold",children:"Create account"})]})]})})]}),e.jsx("div",{className:"hidden lg:block",children:e.jsx("div",{className:"flex-1 flex items-center justify-center p-6 py-10",children:e.jsxs(o.div,{initial:{opacity:0,y:16},animate:{opacity:1,y:0},transition:{duration:.5},className:"w-full max-w-sm",children:[e.jsxs("div",{className:"mb-7",children:[e.jsx("h1",{className:"serif text-3xl text-gray-900 mb-1.5",children:"Sign in"}),e.jsx("p",{className:"text-sm text-gray-500",children:"Access your investment dashboard"})]}),e.jsxs(y,{children:[h&&e.jsxs(o.div,{initial:{opacity:0,y:-8},animate:{opacity:1,y:0},exit:{opacity:0},className:"mb-4 flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3",children:[e.jsx(z,{className:"w-4 h-4 text-emerald-600 flex-shrink-0"}),e.jsx("p",{className:"text-sm text-emerald-700",children:h})]}),p&&e.jsxs(o.div,{initial:{opacity:0,y:-8},animate:{opacity:1,y:0},exit:{opacity:0},className:"mb-4 flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3",children:[e.jsx("div",{className:"w-4 h-4 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0",children:e.jsx("span",{className:"text-white text-xs font-bold leading-none",children:"!"})}),e.jsx("p",{className:"text-sm text-red-700",children:p})]})]}),e.jsxs("form",{onSubmit:L,className:"space-y-4",children:[e.jsx(k,{icon:A,label:"Email address",children:e.jsx("div",{className:"relative",children:e.jsx("input",{type:"email",name:"email",value:c.email,onChange:N,placeholder:"you@example.com",required:!0,autoComplete:"email",className:"input-base desktop-input"})})}),e.jsx(k,{icon:Y,label:"Password",children:e.jsxs("div",{className:"relative",children:[e.jsx("input",{type:f?"text":"password",name:"password",value:c.password,onChange:N,placeholder:"••••••••",required:!0,autoComplete:"current-password",className:"input-base desktop-input pr-12"}),e.jsx("button",{type:"button",onClick:()=>D(!f),className:"absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-gray-400 hover:text-gray-600 transition",children:f?e.jsx(G,{className:"w-5 h-5"}):e.jsx(H,{className:"w-5 h-5"})})]})}),e.jsx("button",{type:"submit",disabled:j,className:"w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white text-base font-semibold rounded-xl transition-all shadow-lg shadow-purple-600/30 disabled:opacity-60 disabled:cursor-not-allowed mt-2",children:j?e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"})," ","Signing in…"]}):e.jsxs(e.Fragment,{children:["Sign in ",e.jsx(O,{className:"w-4 h-4"})]})})]}),e.jsxs("p",{className:"mt-6 text-center text-sm text-gray-500",children:["Don't have an account?"," ",e.jsx(v,{to:"/register",className:"text-purple-600 hover:text-purple-700 font-semibold",children:"Create account"})]}),e.jsx("div",{className:"mt-3 text-center",children:e.jsxs(v,{to:"/",className:"inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition",children:[e.jsx(X,{className:"w-3 h-3"})," Back to home"]})})]})})})]}),e.jsx(y,{children:W&&e.jsx("div",{className:"fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4",children:e.jsxs(o.div,{initial:{opacity:0,scale:.95,y:16},animate:{opacity:1,scale:1,y:0},exit:{opacity:0,scale:.95},className:"bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6",children:[e.jsxs("div",{className:"flex items-center justify-between mb-5",children:[e.jsx("h3",{className:"font-semibold text-gray-900",children:"Reset password"}),e.jsx("button",{onClick:T,className:"p-1.5 hover:bg-gray-100 rounded-lg transition text-gray-400 hover:text-gray-600",children:e.jsx(ee,{className:"w-4 h-4"})})]}),e.jsx(y,{mode:"wait",children:J?e.jsxs(o.div,{initial:{opacity:0,y:12},animate:{opacity:1,y:0},className:"text-center py-2",children:[e.jsx("div",{className:"w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4",children:e.jsx(z,{className:"w-6 h-6 text-emerald-600"})}),e.jsx("h4",{className:"font-semibold text-gray-900 mb-1.5",children:"Check your inbox"}),e.jsxs("p",{className:"text-sm text-gray-500 mb-5 leading-relaxed",children:["Reset instructions sent to"," ",e.jsx("span",{className:"font-medium text-gray-700",children:w})]}),e.jsx("button",{onClick:T,className:"text-sm text-purple-600 hover:text-purple-700 font-semibold transition",children:"Back to sign in"})]},"success"):e.jsxs(o.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:[e.jsx("p",{className:"text-sm text-gray-500 mb-5 leading-relaxed",children:"Enter your email and we'll send you instructions to reset your password."}),e.jsx(y,{children:I&&e.jsxs(o.div,{initial:{opacity:0,y:-6},animate:{opacity:1,y:0},exit:{opacity:0},className:"mb-4 flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5",children:[e.jsx("div",{className:"w-3.5 h-3.5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0",children:e.jsx("span",{className:"text-white text-xs font-bold leading-none",children:"!"})}),e.jsx("p",{className:"text-xs text-red-700",children:I})]})}),e.jsxs("form",{onSubmit:U,className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1.5",children:"Email address"}),e.jsxs("div",{className:"relative",children:[e.jsx("div",{className:"absolute inset-y-0 left-3 flex items-center pointer-events-none",children:e.jsx(A,{className:"w-4 h-4 text-gray-400"})}),e.jsx("input",{type:"email",value:w,onChange:a=>{F(a.target.value),b("")},placeholder:"you@example.com",required:!0,autoComplete:"email",className:"w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 focus:bg-white transition-all"})]})]}),e.jsx("button",{type:"submit",disabled:P,className:"w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white text-sm font-semibold rounded-xl transition shadow-sm disabled:opacity-60",children:P?e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"})," ","Sending…"]}):"Send reset instructions"})]})]},"form")})]})})})]})};export{xe as default};
