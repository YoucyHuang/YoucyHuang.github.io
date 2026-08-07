/**
 * Writing — Expandable documents with full-text editing + search
 */
var Writing = (function(){
  'use strict';

  // ── Document Data ────────────────────────────
  var defaultDocs = [
    // A: Critical Essays
    { id:'scholar-utopia', cat:'essays', year:'2024', title:'The Scholar-Official\'s Utopia (士大夫的乌托邦)', desc:'Subjectivity and symbolic violence in Chinese literati and European aristocratic portraiture.', text:'[ Full text will be inserted here. Click to edit. ]' },
    { id:'emperor-quotations', cat:'essays', year:'2025', title:'The Emperor of Quotations: Cynicism\'s Golden Shield (名言皇帝)', desc:'How famous quotes function as authority surrogates in Chinese and Western public discourse.', text:'[ Full text will be inserted here. Click to edit. ]' },
    { id:'field-self-cultivation', cat:'essays', year:'2025', title:'From Field to Self-Cultivation: New Confucian Ethics\' Spatial Generative Path (从场域到修身)', desc:'Proposing an inverted path — morality guiding self-cultivation through designed spatial environments.', text:'[ Full text will be inserted here. Click to edit. ]' },
    { id:'water-ganxing', cat:'essays', year:'2025', title:'Water-based Materials, Temporal Structure, and Ganxing (水性材料与感兴)', desc:'How the irreversible material logic of ink painting trains a subject who bears consequences in flowing time.', text:'[ Full text will be inserted here. Click to edit. ]' },
    { id:'robert-ryman', cat:'essays', year:'2025', title:'From Robert Ryman: Body, Trace, and Presence in Painting', desc:'MFA thesis. Ryman\'s white paintings as an inquiry into materiality and the event of viewing.', text:'[ Full text will be inserted here. Click to edit. ]' },
    { id:'involution-lying-flat', cat:'essays', year:'2025', title:'Involution and Lying Flat: Youth Subjectivity in Contemporary China (内卷与躺平)', desc:'Structural analysis of how compressed modernization severed traditional meaning structures.', text:'[ Full text will be inserted here. Click to edit. ]' },
    { id:'aphasia-contemporary-art', cat:'essays', year:'2025', title:'The Aphasia of Contemporary Art (失语的当代艺术)', desc:'Guaren Project core essay. Diagnosing art\'s loss of a position of responsibility under neoliberal governance.', text:'[ Full text will be inserted here. Click to edit. ]' },
    { id:'salgado', cat:'essays', year:'2024', title:'Witness and Transformation: Sebastião Salgado\'s Documentary Photography', desc:'Academic paper on the ethics of aestheticizing suffering in documentary practice.', text:'[ Full text will be inserted here. Click to edit. ]' },
    { id:'zao-wou-ki', cat:'essays', year:'2024', title:'Seeing Mountains as Mountains Again: Zao Wou-Ki\'s Three Metamorphoses', desc:'Tracing Zao Wou-Ki\'s journey through three stages of East-West synthesis.', text:'[ Full text will be inserted here. Click to edit. ]' },
    // B: Fiction
    { id:'family-banquet', cat:'fiction', year:'2025–2026', title:'Family Banquet (家宴)', desc:'Novel. The dining table as courtroom — mother-daughter love, generational silence.', text:'[ Full text will be inserted here. Click to edit. ]' },
    { id:'last-letter', cat:'fiction', year:'2024', title:'The Last Letter to Mother (给母亲的最后一封信)', desc:'Novella, 16,095 words. A daughter\'s unsent letter.', text:'[ Full text will be inserted here. Click to edit. ]' },
    { id:'qingming', cat:'fiction', year:'2025', title:'Qingming, Received (清茗，收)', desc:'AI-assisted short film script with meta-narrative structure.', text:'[ Full text will be inserted here. Click to edit. ]' },
    { id:'blue-stops', cat:'fiction', year:'2025', title:'Blue Stops (蓝止)', desc:'Guizhou batik short film script — tradition, innovation, and a letter.', text:'[ Full text will be inserted here. Click to edit. ]' },
    // C: Poetry
    { id:'poems-early', cat:'poetry', year:'2023–2024', title:'Selected Early Poems: I and Them · Confession of a Clear Wind · Silent Night', desc:'The sea, bodies, death, silence, the distance between people on the same shore.', text:'[ Full text will be inserted here. Click to edit. ]' },
    { id:'poems-late', cat:'poetry', year:'2025–2026', title:'Selected Later Poems: Rebirth · The Small Dark Room · Growth · Returning Home', desc:'Mother, cracks, the well that thirsts, the sun splitting the earth in two.', text:'[ Full text will be inserted here. Click to edit. ]' }
  ];

  var docs = [];

  function loadDocs(){
    try{
      var s=localStorage.getItem('youcy_writing_v2');
      if(s){ docs=JSON.parse(s); return; }
    }catch(e){}
    docs = JSON.parse(JSON.stringify(defaultDocs));
  }

  function saveDocs(){
    try{ localStorage.setItem('youcy_writing_v2',JSON.stringify(docs)); }catch(e){}
  }

  function esc(s){ var d=document.createElement('div');d.textContent=s;return d.innerHTML; }

  // ── Render ────────────────────────────────────
  function render(){
    var catMap = {essays:'cat-essays',fiction:'cat-fiction',poetry:'cat-poetry'};

    Object.keys(catMap).forEach(function(cat){
      var el = document.getElementById(catMap[cat]);
      if(!el) return;
      var catDocs = docs.filter(function(d){ return d.cat===cat; });
      var h='';
      catDocs.forEach(function(doc){
        var wordCount = doc.text ? doc.text.replace(/\s/g,'').length : 0;
        var wcDisplay = wordCount > 0 ? ' · ~'+Math.round(wordCount)+' chars' : '';
        h+='<div class="doc-item" id="doc-'+doc.id+'" onclick="Writing.toggle(\''+doc.id+'\')">'+
          '<span class="doc-title">'+esc(doc.title)+'</span>'+
          '<span class="doc-desc">'+esc(doc.desc)+'</span>'+
          '<span class="doc-year">'+esc(doc.year)+wcDisplay+'</span>'+
          '<span class="expand-hint">Click to expand full text</span>'+
          '<div class="doc-full">'+
            '<div class="editor-toolbar">'+
              '<span class="save-indicator">Editing — changes auto-save</span>'+
              '<span class="word-count" id="wc-'+doc.id+'"></span>'+
            '</div>'+
            '<div class="editor" contenteditable="true" id="editor-'+doc.id+'" '+
              'oninput="Writing.onEdit(\''+doc.id+'\',this.textContent)" '+
              'onclick="event.stopPropagation()">'+esc(doc.text||'')+'</div>'+
          '</div>'+
        '</div>';
      });
      el.innerHTML=h;
    });
  }

  // ── Toggle expand ─────────────────────────────
  function toggle(id){
    var item=document.getElementById('doc-'+id);
    if(!item) return;
    var wasOpen=item.classList.contains('open');
    // Close all
    document.querySelectorAll('.doc-item.open').forEach(function(el){ el.classList.remove('open'); });
    // Toggle this one
    if(!wasOpen){ item.classList.add('open'); item.scrollIntoView({behavior:'smooth',block:'center'}); }
    // Update word count
    updateWC(id);
  }

  function onEdit(id, text){
    var doc=null;
    for(var i=0;i<docs.length;i++){ if(docs[i].id===id){ doc=docs[i];break;} }
    if(doc){ doc.text=text; saveDocs(); }
    updateWC(id);
  }

  function updateWC(id){
    var doc=null;
    for(var i=0;i<docs.length;i++){ if(docs[i].id===id){ doc=docs[i];break;} }
    var wcEl=document.getElementById('wc-'+id);
    if(wcEl && doc){
      var chars=doc.text ? doc.text.replace(/\s/g,'').length : 0;
      wcEl.textContent='~'+Math.round(chars)+' chars';
    }
  }

  // ── Search ────────────────────────────────────
  function openSearch(){
    document.getElementById('search-overlay').classList.add('on');
    setTimeout(function(){ document.getElementById('search-input').focus(); },100);
  }
  function closeSearch(){
    document.getElementById('search-overlay').classList.remove('on');
    document.getElementById('search-input').value='';
    document.getElementById('search-results').innerHTML='';
  }

  function search(q){
    var box=document.getElementById('search-results');
    if(!q||q.trim().length<2){ box.innerHTML=''; return; }
    q=q.toLowerCase().trim();

    var years=q.match(/\b(20\d{2})\b/g);
    var ys=null, ye=null;
    if(years && years.length>=2){ ys=parseInt(years[0]); ye=parseInt(years[1]); }
    else if(years && years.length===1){ ys=parseInt(years[0]); ye=ys; }

    var scored=[];
    docs.forEach(function(doc){
      var full=(doc.title+' '+doc.desc+' '+doc.text+' '+doc.year+' '+doc.cat).toLowerCase();
      var score=0;
      var docYear=parseInt((doc.year.match(/\d{4}/)||[0])[0])||0;
      if(ys!==null && ye!==null && docYear){
        if(docYear>=ys && docYear<=ye) score+=60;
        else if(docYear>=ys-1 && docYear<=ye+1) score+=20;
      }
      var kws=q.replace(/\b20\d{2}\b/g,'').split(/[\s,;·]+/).filter(function(w){return w.length>1;});
      kws.forEach(function(kw){ if(full.indexOf(kw)!==-1) score+=35; });
      if(score>=30) scored.push({doc:doc,score:score});
    });
    scored.sort(function(a,b){return b.score-a.score;});
    scored=scored.slice(0,12);

    if(!scored.length){ box.innerHTML='<p class="sr-empty">No matches.</p>'; return; }
    var h='';
    scored.forEach(function(r){
      h+='<div class="sr-item" onclick="Writing.closeSearch();Writing.toggle(\''+r.doc.id+'\')">'+
        '<span class="sr-title">'+esc(r.doc.title)+'</span>'+
        '<span class="sr-excerpt">'+esc(r.doc.year)+' · '+esc(r.doc.cat)+'</span>'+
      '</div>';
    });
    box.innerHTML=h;
  }

  // ── Keyboard shortcuts ────────────────────────
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'){ closeSearch(); }
    if((e.ctrlKey||e.metaKey) && e.key==='k'){
      e.preventDefault(); openSearch();
    }
  });

  // ── Init ──────────────────────────────────────
  function init(){ loadDocs(); render(); }
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded',init); }
  else{ init(); }

  return { toggle:toggle, onEdit:onEdit, search:search, openSearch:openSearch, closeSearch:closeSearch };
})();
