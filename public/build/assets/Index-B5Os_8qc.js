import{j as n,H as f}from"./app-CSb9wIx_.js";import{A as h}from"./arrow-left-Dpk1S-v1.js";import{D as y}from"./download-UlSG4R7k.js";import"./createLucideIcon-T1bcD0ls.js";function m({title:t}){return n.jsx("div",{style:{fontFamily:"Arial, Helvetica, sans-serif",fontSize:"11pt",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.04em",borderBottom:"1.5px solid #000",paddingBottom:"2px",marginTop:"12px",marginBottom:"6px",color:"#000"},children:t})}function c({profile:t,education:i}){const o=t?.full_name||"Nama Lengkap",s=t?.headline||"",r=t?.email||"",l=t?.phone||"",p=t?.address||"",d=t?.bio||"",a=[];p&&a.push(p),l&&a.push(`${l}`),r&&a.push(r);const x=a.join("  |  "),g={fontFamily:"Arial, Helvetica, sans-serif",fontSize:"10.5pt",color:"#000",lineHeight:"1.4",width:"100%"};return n.jsxs("div",{style:g,children:[n.jsxs("div",{style:{textAlign:"center",marginBottom:"4px"},children:[n.jsx("div",{style:{fontFamily:"Arial, Helvetica, sans-serif",fontSize:"18pt",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",lineHeight:"1.2",color:"#000"},children:o}),s&&n.jsx("div",{style:{fontSize:"10.5pt",fontWeight:400,color:"#222",marginTop:"2px"},children:s}),x&&n.jsx("div",{style:{fontSize:"9.5pt",color:"#111",marginTop:"3px",lineHeight:"1.4"},children:x})]}),d&&n.jsxs(n.Fragment,{children:[n.jsx(m,{title:"Ringkasan"}),n.jsx("p",{style:{margin:"0 0 4px",textAlign:"justify",fontSize:"10pt",color:"#000",lineHeight:"1.45"},children:d})]}),i.length>0&&n.jsxs(n.Fragment,{children:[n.jsx(m,{title:"Pendidikan"}),n.jsx("div",{children:i.map(e=>n.jsxs("div",{style:{marginBottom:"6px"},children:[n.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"baseline"},children:[n.jsx("span",{style:{fontWeight:700,fontSize:"10.5pt"},children:e.institution}),n.jsxs("span",{style:{fontSize:"10pt",whiteSpace:"nowrap",paddingLeft:"12px"},children:[e.start_year," – ",e.end_year==="now"?"Sekarang":e.end_year||"Sekarang"]})]}),e.program_major&&n.jsx("div",{style:{fontStyle:"italic",fontSize:"10pt",color:"#111"},children:["SD","SMP","SMA","SMK"].includes(e.level)?e.program_major:`${e.level} – ${e.program_major}`})]},e.id))})]})]})}function u({profile:t,education:i}){const o=t?.full_name||"CV";return n.jsxs(n.Fragment,{children:[n.jsx(f,{title:`CV – ${o}`}),n.jsxs("div",{className:"no-print",style:{position:"fixed",bottom:"32px",right:"32px",zIndex:100,display:"flex",flexDirection:"column",gap:"12px",alignItems:"flex-end"},children:[n.jsxs("a",{href:"/",style:{display:"flex",alignItems:"center",gap:"8px",background:"#fff",color:"#111827",border:"1px solid #e5e7eb",borderRadius:"12px",padding:"10px 16px",fontSize:"14px",fontWeight:600,fontFamily:"sans-serif",textDecoration:"none",boxShadow:"0 4px 6px -1px rgba(0,0,0,0.1)",transition:"all 0.2s"},children:[n.jsx(h,{size:18})," Beranda"]}),n.jsxs("button",{onClick:()=>window.print(),style:{display:"flex",alignItems:"center",gap:"10px",background:"#111827",color:"#fff",border:"none",borderRadius:"12px",padding:"12px 24px",fontSize:"15px",fontWeight:600,fontFamily:"sans-serif",cursor:"pointer",boxShadow:"0 10px 15px -3px rgba(0,0,0,0.2)",transition:"all 0.2s"},children:[n.jsx(y,{size:18})," Download"]})]}),n.jsx("div",{className:"no-print",style:{minHeight:"100vh",background:"#f3f4f6",padding:"24px 12px",display:"flex",justifyContent:"center",alignItems:"flex-start",overflowX:"hidden"},children:n.jsx("div",{style:{width:"100%",maxWidth:"210mm",minHeight:"297mm",background:"#fff",boxShadow:"0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",padding:"clamp(10mm, 5vw, 15mm) clamp(10mm, 6vw, 18mm)",boxSizing:"border-box",borderRadius:"2px",margin:"0 auto"},children:n.jsx(c,{profile:t,education:i})})}),n.jsx("div",{className:"print-only",children:n.jsx(c,{profile:t,education:i})}),n.jsx("style",{children:`
                @media print {
                    @page {
                        size: A4 portrait;
                        margin: 15mm 18mm 15mm 18mm;
                    }
                    html, body {
                        margin: 0 !important;
                        padding: 0 !important;
                        background: white !important;
                    }
                    .no-print { display: none !important; }
                    .print-only { display: block !important; }
                }

                @media screen and (max-width: 640px) {
                    .no-print {
                        padding: 10px 5px !important;
                    }
                }

                .print-only {
                    display: none;
                }
            `})]})}export{u as default};
