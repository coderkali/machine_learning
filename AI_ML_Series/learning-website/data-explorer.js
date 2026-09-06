"use strict";
(() => {
  const $=id=>document.getElementById(id),data=window.LESSON_DATA.datasets,ui=window.LearningDetails;
  const links={clouds:"dbscan-clustering",ellipse:"elliptic-envelope",lof:"local-outlier-factor",iris:"voting-ensemble",regression:"random-forest-regression",salary:"linear-regression"};
  let key="clouds",page=0,filtered=[];
  try {if(localStorage.getItem("learning-tree-theme")==="dark")document.documentElement.dataset.theme="dark";}catch{}
  $("explorer-dataset").innerHTML=Object.entries(data).map(([id,d])=>`<option value="${id}">${ui.esc(d.title)}</option>`).join("");
  function setup() {
    const d=data[key];page=0;$("explorer-dataset").value=key;
    ["explorer-x","explorer-y"].forEach(id=>{$(id).innerHTML=d.columns.map((c,i)=>`<option value="${i}">${ui.esc(c)}</option>`).join("");});
    $("explorer-x").value="0";$("explorer-y").value=key==="iris"?"2":"1";
    $("explorer-group").innerHTML='<option value="all">All source groups</option>'+[...new Set(d.groups||[])].sort().map(g=>`<option value="${g}">Group ${g}${key==="iris"?" · "+["Setosa","Versicolor","Virginica"][g]:""}</option>`).join("");
    $("explorer-group").disabled=!d.groups;$("explorer-row").max=d.rows.length-1;$("explorer-row").value=0;
    $("explorer-note").textContent=d.note;
    $("explorer-source").href="../02_data_toolkit_apps/08_sklearn/"+encodeURIComponent(d.source);
    $("explorer-source").textContent=`${d.source} · cell ${d.cell} (zero-based)`;
    $("explorer-concept").href="index.html#concept="+links[key];
    render();
  }
  function render() {
    const d=data[key],gx=$("explorer-group").value,x=+$("explorer-x").value,y=+$("explorer-y").value;
    filtered=d.rows.map((r,i)=>({r,i})).filter(({i})=>gx==="all"||String(d.groups?.[i])===gx);
    const rowInput=$("explorer-row"),row=Number(rowInput.value),valid=rowInput.value!==""&&Number.isInteger(row)&&row>=0&&row<d.rows.length;
    const index=valid?filtered.findIndex(item=>item.i===row):-1;
    ui.scatter($("explorer-canvas"),filtered.map(({r})=>[r[x],r[y]]),{height:420,groups:d.groups?filtered.map(({i})=>d.groups[i]):null,xLabel:d.columns[x],yLabel:d.columns[y],highlight:index>=0?index:null});
    $("explorer-readout").innerHTML=`<div class="lesson-metrics"><span><small>Points drawn</small><strong>${filtered.length.toLocaleString()} / ${d.rows.length.toLocaleString()}</strong></span><span><small>Available columns</small><strong>${d.columns.length}</strong></span><span><small>Selected row ID</small><strong>${valid?row:"Choose a valid integer"}</strong></span></div><p>${valid?d.columns.map((c,i)=>`${ui.esc(c)}: ${ui.fmt(d.rows[row][i])}`).join(" · "):"Enter a row ID within this dataset."}${valid&&index<0?" · This row is outside the selected source-group filter.":""}</p>`;
    page=Math.min(page,Math.max(0,Math.ceil(filtered.length/25)-1));renderTable();
  }
  function renderTable() {
    const d=data[key],rows=filtered.slice(page*25,(page+1)*25);
    $("explorer-table").innerHTML=ui.table(["Row ID",...d.columns,...(d.groups?["Source group"]:[])],rows.map(({r,i})=>[i,...r,...(d.groups?[d.groups[i]]:[])]),"Full feature values · 25 rows per page · chart shows every matching row");
    $("explorer-prev").disabled=page===0;$("explorer-next").disabled=(page+1)*25>=filtered.length;
    $("explorer-page").textContent=`Rows ${filtered.length?page*25+1:0}–${Math.min((page+1)*25,filtered.length)} of ${filtered.length.toLocaleString()}`;
  }
  $("explorer-dataset").addEventListener("change",()=>{key=$("explorer-dataset").value;history.replaceState(null,"","#"+key);setup();});
  ["explorer-x","explorer-y","explorer-group"].forEach(id=>$(id).addEventListener("change",()=>{page=0;render();}));
  $("explorer-row").addEventListener("input",render);
  $("explorer-prev").addEventListener("click",()=>{page--;renderTable();});
  $("explorer-next").addEventListener("click",()=>{page++;renderTable();});
  $("explorer-download").addEventListener("click",()=>{
    const d=data[key],quote=v=>'"'+String(v).replaceAll('"','""')+'"';
    const rows=[["Row ID",...d.columns,...(d.groups?["Source group"]:[])],...filtered.map(({r,i})=>[i,...r,...(d.groups?[d.groups[i]]:[])])];
    const blob=new Blob([rows.map(r=>r.map(quote).join(",")).join("\r\n")],{type:"text/csv;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=`${key}-lesson-rows.csv`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
  window.addEventListener("hashchange",()=>{if(data[location.hash.slice(1)]){key=location.hash.slice(1);setup();}});
  new ResizeObserver(render).observe($("explorer-canvas"));
  key=data[location.hash.slice(1)]?location.hash.slice(1):"clouds";setup();
})();
