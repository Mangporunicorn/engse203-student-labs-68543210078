(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))o(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const c of a.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&o(c)}).observe(document,{childList:!0,subtree:!0});function r(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(s){if(s.ep)return;s.ep=!0;const a=r(s);fetch(s.href,a)}})();async function h({simulateError:t=!1}={}){if(t)throw new Error("Simulated error: data source is unavailable");const r=await fetch("./data/learning-tasks.json");if(!r.ok)throw new Error(`Unable to load tasks (HTTP ${r.status})`);const o=await r.json();if(!Array.isArray(o))throw new Error("The data source returned an invalid task collection");return o}function y(t){return{todo:"To do",doing:"In progress",done:"Done"}[t]??"Unknown"}function b(t,{query:e="",status:r="all"}={}){const o=e.trim().toLowerCase();return t.filter(s=>{const a=[s.title,s.topic,...s.tags??[]].join(" ").toLowerCase(),c=o===""||a.includes(o),u=r==="all"||s.status===r;return c&&u})}function g(t){return t.reduce((e,r)=>(e.total+=1,r.status==="todo"&&(e.todo+=1),r.status==="doing"&&(e.doing+=1),r.status==="done"&&(e.done+=1),e),{total:0,todo:0,doing:0,done:0})}function i(t){return String(t).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}function d(t,e,r){t.className=`message ${e}`,t.textContent=r}function p(t,e){const r=[{label:"Total",value:e.total},{label:"To do",value:e.todo},{label:"In progress",value:e.doing},{label:"Done",value:e.done}];t.innerHTML=r.map(({label:o,value:s})=>`
        <article class="stat-card">
          <p>${i(o)}</p>
          <strong>${s}</strong>
        </article>
      `).join("")}function m(t,e){if(e.length===0){t.innerHTML=`
      <div class="empty-state">
        <h2>No tasks found</h2>
        <p>Try changing the search text or selected status.</p>
      </div>
    `;return}t.innerHTML=e.map(({week:r,title:o,topic:s,status:a,tags:c=[]})=>`
        <article class="task-card">
          <div class="task-meta">
            <span class="badge">Week ${r}</span>
            <span class="badge">${i(y(a))}</span>
          </div>

          <h2>${i(o)}</h2>
          <p>${i(s)}</p>

          <div class="tags">
            ${c.map(u=>`
                  <span class="tag">${i(u)}</span>
                `).join("")}
          </div>
        </article>
      `).join("")}const n={message:document.querySelector("#app-message"),stats:document.querySelector("#stats"),taskList:document.querySelector("#task-list"),search:document.querySelector("#search"),statusFilter:document.querySelector("#status-filter")},l={tasks:[],query:"",status:"all"};function f(){const t=b(l.tasks,{query:l.query,status:l.status}),e=g(l.tasks);p(n.stats,e),m(n.taskList,t)}async function L(){const e=new URLSearchParams(window.location.search).get("simulateError")==="1";try{d(n.message,"loading","Loading learning tasks..."),n.search.disabled=!0,n.statusFilter.disabled=!0,l.tasks=await h({simulateError:e}),f(),d(n.message,"success",`Successfully loaded ${l.tasks.length} learning tasks.`)}catch(r){l.tasks=[],p(n.stats,g([])),m(n.taskList,[]),d(n.message,"error",r instanceof Error?r.message:"An unexpected error occurred.")}finally{n.search.disabled=!1,n.statusFilter.disabled=!1}}n.search.addEventListener("input",t=>{l.query=t.target.value,f()});n.statusFilter.addEventListener("change",t=>{l.status=t.target.value,f()});L();
