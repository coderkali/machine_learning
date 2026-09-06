"use strict";

// Additional evidence panels use the same structured map as the original tree.
// All dataset rows live in lesson-data.js so file:// works without a server.
(() => {
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const fmt = n => typeof n === "number" ? Number(n.toFixed(4)).toLocaleString("en-US", {maximumFractionDigits:4}) : esc(n);
  const data = () => window.LESSON_DATA;
  const colors = ["#287957", "#396cad", "#a45bc1", "#b47b1a", "#247f8c", "#cb5347"];
  let cleanup = null;

  function table(headers, rows, caption = "") {
    return `<div class="lesson-table-wrap" tabindex="0" role="region" aria-label="${esc(caption || "Worked data table")}"><table class="lesson-table">${caption ? `<caption>${esc(caption)}</caption>` : ""}<thead><tr>${headers.map(h=>`<th scope="col">${esc(h)}</th>`).join("")}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(v=>`<td>${fmt(v)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  }
  function select(id, label, options) {
    return `<label>${label}<select id="${id}">${options.map(([v,t])=>`<option value="${v}">${t}</option>`).join("")}</select></label>`;
  }
  function range(id, label, min, max, step, value) {
    return `<label>${label} <output for="${id}" id="${id}-value">${value}</output><input id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${value}"></label>`;
  }
  function controls(type) {
    if (type === "dbscan") return select("detail-eps", "Neighborhood radius ε", [[.3,"0.30 · notebook baseline"],[.15,"0.15 · smaller neighborhoods"],[.6,"0.60 · wider neighborhoods"]]) + select("detail-view", "Color meaning", [["types","Core / border / noise"],["groups","Discovered cluster IDs"],["raw","Raw points"]]);
    if (type === "lof") return select("detail-dim", "Features used by the model", [[2,"Both features · (7, 2)"],[1,"Feature 1 only · (7, 1)"]]) + select("detail-k", "Nearest neighbors k", [[3,"3 · notebook baseline"],[2,"2 · smaller neighborhood"],[6,"6 · every other row"]]);
    if (type === "isolation") return range("detail-cutoff", "Raw score cutoff", -.7, -.35, .005, -.5) + range("detail-path", "Illustrative mean path (reference = 6)", 1, 12, 1, 3);
    if (type === "ellipse") return '<p class="lesson-note">Reproducible replay: contamination 0.1, random_state 0. One boundary, all 2,000 observations.</p>';
    if (type === "coefficients") return select("detail-row", "Highlight a contribution", [[0,"A · (1, 30)"],[1,"B · (2, 35)"],[2,"C · (3, 50)"],[3,"D · (4, 55)"],[4,"E · (5, 60)"]]);
    if (type === "boosting") return range("detail-rate", "Learning rate η", .01, 1, .01, .01) + range("detail-stages", "Number of corrections", 1, 100, 1, 10);
    if (type === "adaboost") return range("detail-weight", "Mistake weight multiplier", 1, 10, .5, 2);
    if (type === "voting") return select("detail-scenario", "Probability evidence", [["saved","Saved Iris row 0 · five models"],["disagree","Teaching example · three models disagree"]]) + select("detail-voting", "Combination rule", [["soft","Soft · mean probabilities"],["hard","Hard · count class votes"]]);
    return range("detail-trees", "Trees included in the teaching example", 1, 5, 1, 5);
  }

  function markup(concept) {
    const ds = data()?.datasets[concept.datasetId];
    const gallery = Object.entries(concept.plotCells || {}).flatMap(([name, cells]) =>
      (data()?.galleries[name] || []).filter(p=>cells.includes(p.cell)));
    const images = concept.sources.filter(s=>s.type === "image").map(s=>({src:`../${encodeURI(s.path)}`,caption:s.purpose}));
    return `${ds ? `<section class="lesson-evidence" aria-labelledby="detail-title"><p class="section-kicker">Explore the worked evidence</p><h3 id="detail-title">${esc(ds.title)}</h3><p>${esc(ds.note)}</p><div class="lesson-controls">${controls(concept.lessonLab)}</div><canvas id="detail-canvas" role="img" aria-label="${esc(concept.title)} worked visualization"></canvas><div id="detail-readout" class="detail-readout" aria-live="polite"></div><div id="detail-table"></div><a class="lesson-link" href="data-explorer.html#${concept.datasetId}">Inspect every row and all feature columns →</a></section>` : ""}
      ${concept.detailNotes ? `<div class="lesson-evidence">${concept.detailNotes.map(n=>`<p>${esc(n)}</p>`).join("")}</div>` : ""}
      ${concept.workedTable ? `<details class="lesson-evidence"><summary>Every step of the hand calculation</summary>${table(concept.workedTable.headers,concept.workedTable.rows,"Exact salary rows and contributions")}</details>` : ""}
      ${concept.parameters ? `<details class="lesson-evidence" open><summary>Parameters: what changes and why</summary>${table(["Parameter","Notebook setting","Meaning / effect"],concept.parameters,"Model settings")}</details>` : ""}
      ${concept.comparison ? `<details class="lesson-evidence" open><summary>Compare the methods</summary>${table(concept.comparison.headers,concept.comparison.rows,"Different questions produce different flags")}</details>` : ""}
      ${gallery.length || images.length ? `<details class="lesson-evidence"><summary>Original notebook plots & revision sheets (${gallery.length+images.length})</summary><p>Saved outputs, shown unchanged. Notebook cell numbers are zero-based. Reproduced interactive fits above are labeled separately.</p><div class="notebook-gallery">${[...gallery,...images].map(p=>`<figure><a href="${p.src}" target="_blank" rel="noopener"><img src="${p.src}" alt="${esc(p.caption)}" loading="lazy"></a><figcaption>${esc(p.caption)}</figcaption></figure>`).join("")}</div></details>` : ""}
      ${concept.quiz ? `<details class="lesson-evidence"><summary>Check your understanding</summary>${concept.quiz.map(q=>`<p>${esc(q.question)}</p><details><summary>Reveal explanation</summary><p>${esc(q.answer)}</p></details>`).join("")}</details>` : ""}
      ${concept.references ? `<p class="lesson-reference">Verify the method: ${concept.references.map(r=>`<a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.title)}</a>`).join(" · ")}</p>` : ""}`;
  }

  function prepare(canvas, height=330) {
    const width = Math.max(260, canvas.getBoundingClientRect().width);
    const ratio = Math.min(window.devicePixelRatio || 1,2);
    canvas.width=width*ratio;canvas.height=height*ratio;canvas.style.height=height+"px";
    const ctx=canvas.getContext("2d");ctx.setTransform(ratio,0,0,ratio,0,0);
    const style=getComputedStyle(document.documentElement);
    return {ctx,width,height,ink:style.getPropertyValue("--ink").trim()||"#24362f",muted:style.getPropertyValue("--muted").trim()||"#66756d",line:style.getPropertyValue("--line").trim()||"#dce5dc"};
  }
  function scatter(canvas, rows, opts={}) {
    const kit=prepare(canvas,opts.height||340),{ctx,width,height,ink,muted,line}=kit;
    const xs=rows.map(r=>r[0]),ys=rows.map(r=>r[1]);
    let xmin=Math.min(...xs),xmax=Math.max(...xs),ymin=Math.min(...ys),ymax=Math.max(...ys);
    if(opts.boundary){opts.boundary.forEach(([x,y])=>{xmin=Math.min(xmin,x);xmax=Math.max(xmax,x);ymin=Math.min(ymin,y);ymax=Math.max(ymax,y);});}
    if(opts.origin){xmin=Math.min(0,xmin);ymin=Math.min(0,ymin);}
    const dx=(xmax-xmin||1)*.1,dy=(ymax-ymin||1)*.12;xmin-=dx;xmax+=dx;ymin-=dy;ymax+=dy;
    const x=v=>48+(v-xmin)/(xmax-xmin)*(width-68),y=v=>height-43-(v-ymin)/(ymax-ymin)*(height-63);
    ctx.font="11px system-ui";ctx.strokeStyle=line;ctx.fillStyle=muted;
    for(let i=0;i<=4;i++) {let xv=xmin+(xmax-xmin)*i/4,yv=ymin+(ymax-ymin)*i/4;ctx.beginPath();ctx.moveTo(x(xv),20);ctx.lineTo(x(xv),height-43);ctx.moveTo(48,y(yv));ctx.lineTo(width-20,y(yv));ctx.stroke();ctx.textAlign="center";ctx.fillText(fmt(xv),x(xv),height-25);ctx.textAlign="right";ctx.fillText(fmt(yv),43,y(yv)+3);}
    ctx.textAlign="center";ctx.fillText(opts.xLabel||"Feature 1",width/2,height-6);ctx.save();ctx.translate(12,height/2);ctx.rotate(-Math.PI/2);ctx.fillText(opts.yLabel||"Feature 2",0,0);ctx.restore();
    if(opts.before)opts.before({ctx,x,y,width,height});
    if(opts.boundary){ctx.strokeStyle=ink;ctx.lineWidth=2;ctx.beginPath();opts.boundary.forEach(([a,b],i)=>i?ctx.lineTo(x(a),y(b)):ctx.moveTo(x(a),y(b)));ctx.closePath();ctx.stroke();}
    rows.forEach((r,i)=>{const flagged=opts.flags?.[i];ctx.fillStyle=flagged?"#cc4d4d":(opts.pointColors?.[i]||colors[opts.groups?.[i]>=0?opts.groups[i]%colors.length:0]);ctx.strokeStyle=ctx.fillStyle;const size=rows.length>2000?1.6:rows.length>100?2.5:5;
      if(flagged){ctx.beginPath();ctx.moveTo(x(r[0])-3,y(r[1])-3);ctx.lineTo(x(r[0])+3,y(r[1])+3);ctx.moveTo(x(r[0])+3,y(r[1])-3);ctx.lineTo(x(r[0])-3,y(r[1])+3);ctx.stroke();}else{ctx.beginPath();ctx.arc(x(r[0]),y(r[1]),size,0,Math.PI*2);ctx.fill();}
      if(rows.length<=10){ctx.fillStyle=ink;ctx.textAlign="left";ctx.fillText(String.fromCharCode(65+i),x(r[0])+7,y(r[1])-7);}
    });
    if(opts.highlight!=null&&rows[opts.highlight]){const p=rows[opts.highlight];ctx.strokeStyle=ink;ctx.lineWidth=2;ctx.beginPath();ctx.arc(x(p[0]),y(p[1]),9,0,Math.PI*2);ctx.stroke();}
    canvas.setAttribute("aria-label",`${rows.length.toLocaleString()} observations; horizontal ${opts.xLabel||"feature 1"}, vertical ${opts.yLabel||"feature 2"}. ${opts.description||"Values available in the adjacent table."}`);
    return {...kit,x,y};
  }
  function bars(canvas, labels, values, options={}) {
    const {ctx,width,height,ink,line}=prepare(canvas,300),max=options.max||Math.max(...values,1),left=Math.min(115,width*.32);
    ctx.font="12px system-ui";
    labels.forEach((label,i)=>{const yy=30+i*240/labels.length;ctx.fillStyle=ink;ctx.textAlign="right";ctx.fillText(label,left-8,yy+14);ctx.fillStyle=line;ctx.fillRect(left,yy,width-left-54,22);ctx.fillStyle=colors[i%colors.length];ctx.fillRect(left,yy,(width-left-54)*values[i]/max,22);ctx.fillStyle=ink;ctx.textAlign="left";ctx.fillText(fmt(values[i]),width-49,yy+15);});
    canvas.setAttribute("aria-label",labels.map((l,i)=>`${l}: ${fmt(values[i])}`).join("; "));
  }
  const read = id => document.getElementById(id)?.value;
  const metric = (pairs,note) => `<div class="lesson-metrics">${pairs.map(([k,v])=>`<span><small>${esc(k)}</small><strong>${esc(v)}</strong></span>`).join("")}</div><p>${esc(note)}</p>`;
  const argmax = values => values.indexOf(Math.max(...values));

  function render(concept) {
    const canvas=document.getElementById("detail-canvas");if(!canvas)return;
    const output=document.getElementById("detail-readout"),grid=document.getElementById("detail-table");grid.innerHTML="";
    const type=concept.lessonLab,ds=data().datasets[concept.datasetId];
    document.querySelectorAll('.lesson-controls input[type="range"]').forEach(el=>{document.getElementById(el.id+"-value").value=el.value;});
    if(type === "dbscan") {
      const eps=read("detail-eps"),result=data().dbscan[eps],view=read("detail-view"),noise=result.labels.filter(x=>x===-1).length,core=result.core.filter(Boolean).length;
      scatter(canvas,ds.rows,{groups:view==="groups"?result.labels:null,flags:view!=="raw"?result.labels.map(x=>x===-1):null,pointColors:view==="types"?result.core.map(v=>v?colors[0]:colors[3]):null});
      output.innerHTML=metric([["Core",core],["Border",500-core-noise],["Noise",noise],["Clusters",new Set(result.labels.filter(x=>x>=0)).size]],"All 500 points are shown. In point-type view: green dots = core, amber dots = border, red crosses = noise. min_samples stays at 10, including self.");
      grid.innerHTML=table(["ε","Clusters","Noise","In any cluster"],[[.15,5,256,244],[.3,3,25,475],[.6,3,0,500]],"Notebook radius experiment · unchanged data");
    } else if(type === "lof") {
      const dim=read("detail-dim"),k=read("detail-k"),result=data().lof[`${dim}-${k}`];
      scatter(canvas,ds.rows,{flags:result.labels.map(v=>v===-1)});
      output.innerHTML=metric([["Model input",`(7, ${dim})`],["Neighbors",k],["Flagged",result.labels.map((v,i)=>v===-1?String.fromCharCode(65+i):"").filter(Boolean).join(", ")||"None"]],`Both coordinates are displayed. The model uses ${dim==="1"?"only horizontal distances; vertical differences are ignored":"both feature columns"}. Positive LOF > 1.5 is flagged under this auto cutoff. Duplicate one-feature coordinates and tied neighbors make this a small teaching example.`);
      grid.innerHTML=table(["Row","x₁","x₂","Positive LOF","Stored negative LOF","Label"],ds.rows.map((r,i)=>[String.fromCharCode(65+i),...r,result.scores[i],-result.scores[i],result.labels[i]]),"All seven exact rows · scores computed by sklearn");
    } else if(type === "ellipse") {
      const result=data().ellipse;scatter(canvas,ds.rows,{flags:result.labels.map(v=>v===-1),boundary:result.boundary});
      output.innerHTML=metric([["Observations",2000],["Flagged",result.labels.filter(v=>v===-1).length],["Configured fraction","10%"]],"Black line = fitted decision score zero. Blue/green dots = inliers; red crosses = outliers. One ellipse bridges two populations; the count is a configured threshold, not anomaly accuracy.");
    } else if(type === "isolation") {
      const cutoff=+read("detail-cutoff"),paths=+read("detail-path"),raw=data().isolation.raw,flags=raw.map(v=>v<cutoff);scatter(canvas,ds.rows,{flags});
      output.innerHTML=metric([["Flagged",flags.filter(Boolean).length],["Raw cutoff",fmt(cutoff)],["Illustrative original score",(2**(-paths/6)).toFixed(3)]],"All 500 scores come from the notebook's seeded forest experiment. Changing the cutoff relabels fixed scores; it does not retrain trees. The path slider is a separate formula illustration, not a measured path for these rows.");
      grid.innerHTML=table(["Row","Raw score","Decision (raw − cutoff)","Label"],[442,415,181].map(i=>[i,raw[i],raw[i]-cutoff,flags[i]?-1:1]),"Same example rows as the notebook");
    } else if(type === "coefficients") {
      const i=+read("detail-row"),p=ds.rows[i],dx=p[0]-3,dy=p[1]-46;
      scatter(canvas,ds.rows,{origin:true,xLabel:ds.columns[0],yLabel:ds.columns[1],highlight:i,before:({ctx,x,y})=>{ctx.fillStyle="rgba(40,121,87,.18)";ctx.fillRect(Math.min(x(3),x(p[0])),Math.min(y(46),y(p[1])),Math.abs(x(p[0])-x(3)),Math.abs(y(p[1])-y(46)));ctx.strokeStyle=colors[5];ctx.beginPath();ctx.moveTo(x(0),y(22));ctx.lineTo(x(5.5),y(66));ctx.stroke();ctx.fillStyle=colors[3];ctx.beginPath();ctx.arc(x(3),y(46),6,0,Math.PI*2);ctx.fill();}});
      output.innerHTML=metric([["Row product",`${dx} × ${dy} = ${dx*dy}`],["Row square",dx*dx],["Slope","80 ÷ 10 = 8"],["Intercept","46 − 8×3 = 22"]],"Shaded rectangle = the selected row's signed numerator contribution. Gold point = (mean x, mean y). The fitted line passes through this center; all five points remain visible.");
    } else if(type === "boosting") {
      const eta=+read("detail-rate"),stages=+read("detail-stages"),values=[50];for(let i=0;i<stages;i++)values.push(values.at(-1)+eta*(62-values.at(-1)));
      const plot=scatter(canvas,values.map((v,i)=>[i,v]),{xLabel:"Correction stage",yLabel:"Numeric estimate (illustration)"});plot.ctx.strokeStyle=colors[5];plot.ctx.setLineDash([5,4]);plot.ctx.beginPath();plot.ctx.moveTo(plot.x(0),plot.y(62));plot.ctx.lineTo(plot.x(stages),plot.y(62));plot.ctx.stroke();
      output.innerHTML=metric([["Start",50],["Target",62],["After corrections",fmt(values.at(-1))],["Remaining error",fmt(62-values.at(-1))]],"Teaching illustration: every new learner predicts the exact remaining scalar error under squared loss. The notebook fits a classifier; its updates use loss gradients in score space. This curve is not a measured accuracy result.");
      grid.innerHTML=table(["Saved classifier","Stages","Learning rate","Test correct / total"],[["GradientBoostingClassifier",100,.01,"44 / 45"]]);
    } else if(type === "adaboost") {
      const multiplier=+read("detail-weight"),weights=[multiplier,multiplier,1,1,1,1],sum=weights.reduce((a,b)=>a+b,0),values=weights.map(v=>v/sum);
      bars(canvas,["A · wrong","B · wrong","C · correct","D · correct","E · correct","F · correct"],values,{max:1});
      output.innerHTML=metric([["Mistake multiplier",multiplier],["Wrong row weight",fmt(values[0])],["Correct row weight",fmt(values[2])],["Total normalized weight",1]],"Six-row teaching example, not saved Iris weights. All rows started at 1/6; A and B were misclassified. Multiply mistake weights then normalize so the total stays one.");
      grid.innerHTML=table(["Model","Base learner","Maximum stages","Saved test score"],[["AdaBoostClassifier","Depth-3 tree",100,"44 / 45"]]);
    } else if(type === "voting" || type === "forest") {
      const saved=[[0,.2,.8],[.0097861077,.028397951,.961815941],[0,0,1],[.242895311,.242895311,.514209378],[.000132030906,.0599153243,.939952645]];
      const forestExample=[[.1,.2,.7],[.1,.6,.3],[0,.1,.9],[.2,.5,.3],[.1,.2,.7]];
      const illustrative=type==="forest"||read("detail-scenario")==="disagree";
      const probs=type==="forest"?forestExample.slice(0,+read("detail-trees")):illustrative?[[.51,.49],[.51,.49],[.01,.99]]:saved;
      const classes=probs[0].length,means=Array.from({length:classes},(_,c)=>probs.reduce((s,p)=>s+p[c],0)/probs.length),votes=Array.from({length:classes},(_,c)=>probs.filter(p=>argmax(p)===c).length);
      const method=type==="forest"?"soft":read("detail-voting"),values=method==="soft"?means:votes;
      bars(canvas,values.map((_,i)=>`Class ${i}`),values,{max:method==="soft"?1:probs.length});
      output.innerHTML=metric([["Members",probs.length],["Hard winner",argmax(votes)],["Soft winner",argmax(means)],["Selected prediction",argmax(values)]],illustrative?"Teaching probabilities, not predictions fitted in the notebook. Confidence can change the soft winner even when most members vote for another class. Forest classification averages tree probabilities.":"Exact saved soft-transform probabilities for Iris test row 0. Hard counts shown here are derived from these soft-fit members; the notebook's separate hard fit is a different fitted panel. No combined test accuracy is inferred from a single row.");
      grid.innerHTML=table(["Member",...means.map((_,i)=>`P(class ${i})`),"Argmax"],probs.map((p,i)=>[i+1,...p,argmax(p)]),illustrative?"Illustrative member probabilities":"Saved probabilities · 20_Ensemble_methods.ipynb cell 36, row 0");
    } else if(type === "forestRegression") {
      const n=+read("detail-trees"),predictions=[50,60,70,55,65].slice(0,n),average=predictions.reduce((a,b)=>a+b,0)/n;
      bars(canvas,predictions.map((_,i)=>`Tree ${i+1}`),predictions,{max:80});
      output.innerHTML=metric([["Trees",n],["Mean prediction",fmt(average)],["Saved training R²","0.99117"]],"Tree values are an averaging illustration. Open the row explorer for all 10,000 original seeded regression observations. The notebook has no held-out forest regression result yet.");
    }
  }
  function mount(concept) {
    unmount();if(!concept.datasetId)return;
    const root=document.querySelector('.lesson-evidence'),canvas=document.getElementById('detail-canvas');if(!root||!canvas)return;
    const update=()=>render(concept);root.addEventListener('input',update);root.addEventListener('change',update);
    const observer=new ResizeObserver(update);observer.observe(canvas);
    const theme=new MutationObserver(update);theme.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
    update();cleanup=()=>{root.removeEventListener('input',update);root.removeEventListener('change',update);observer.disconnect();theme.disconnect();};
  }
  function unmount(){cleanup?.();cleanup=null;}
  window.LearningDetails={markup,mount,unmount,table,scatter,esc,fmt};
})();
