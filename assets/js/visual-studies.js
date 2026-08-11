/**
 * Visual Studies — Free-form canvas with drag + resize
 */
var VS = (function(){
  'use strict';

  var base = 'assets/images/artworks/';

  // Default layout: x, y, w columns (translated to pixel positions)
  var sections = [
    {
      id: 'early', title: 'Early Age', years: 'Age 9–18',
      text: 'Painting and fiction, these art forms have deeply attracted me since I was a kid. It is art that guides me into humanities area. In my early paintings, I am trying to indicate that my passion to humanities and the enthusiasm about art is deeply rooted in my instinct. I decided to build my career path on this domain. This decision is not made on whim. Rather, it was due to an understanding of one\'s own abilities, the persistent study about art, the devotion for the humanities, and a sense of mission to explore new things.',
      images: ['01-9岁绘画.jpeg','01-14岁绘画.jpeg','01-17岁绘画.jpeg','01-18岁绘画.jpeg']
    },
    {
      id: 'mimic', title: 'Bachelor & Master Period — Mimic Realistic World', years: '2021–2022',
      text: 'The first phase of academic training. The goal was to reproduce the visible world as faithfully as possible — building three-dimensional space on a two-dimensional plane, following the lineage of Greek art through Da Vinci and Michelangelo. However, these kind of cognition about art did not last for a long time. I began to learn theory from thinkers such as Descartes, Kant etc. The world can be mirrored, but we can only know phenomena, never the thing-in-itself. So what is the real thing that I want to reveal in my paintings? What is the real true thing? I was confused, suspect everything and began to write poem.',
      images: ['4 (1).jpeg','4 (2).jpeg','4 (3).jpeg','4 (4).jpeg','4 (5).jpeg','4（6）.jpeg']
    },
    {
      id: 'expression', title: 'Bachelor & Master Period — Cline to Expression', years: '2022–2023',
      text: 'A shift from objective reproduction toward subjective expression. The question changed from "how does the world look?" to "how does the world feel?" — influenced by modern artist and philosopher. Since then, Cézanne began to play a significant role in my art study. Heidegger\'s theory was hard to understand for me, so I began to take online courses to formally study Philosophy.',
      images: ['5 (1).jpeg','5 (11).jpeg','5 (12).jpeg','5 (13).jpeg','5 (14).jpeg','5 (15).jpeg','5 (16).jpeg','5 (17).jpeg','5 (18).jpeg','5 (19).jpeg','5 (20).jpeg','5（21）.jpeg']
    },
    {
      id: 'aura', title: 'Bachelor & Master Period — Finding Aura, Exploring Material Character', years: '2023',
      text: 'The search for aura — that quality Benjamin described as the unique phenomenon of distance, however close. Experiments with materiality: how paint sits on a surface, how texture carries meaning before recognition, how the physical substance of the work communicates before the image resolves.',
      images: ['6 (1).jpeg','6 (2).jpeg','6 (3).jpeg','6 (4).jpeg','6 (5).jpeg','6 (6).jpeg']
    },
    {
      id: 'classical', title: 'Classical & Neoclassical — Academic System Training', years: '2021–2024',
      text: 'Years of systematic academic training. I spent extensive time studying human anatomy, the relationships between point-line-plane, how these elements interact with depicted objects, and their effects on form and aura — what is added, what is lost. This is the craft foundation: the ground on which everything else stands.',
      images: ['7 (1).jpeg','7 (2).jpeg','7 (3).jpeg','7 (4).jpeg','7 (5).jpeg','7 (6).jpeg']
    },
    {
      id: 'authentic', title: 'Authentic Series', years: '2024',
      text: 'Heidegger\'s distinction between Dasein and das Man — authentic and inauthentic existence — led to a series of portraits. Capturing people not as they perform themselves for others — the authentic part behind "das Man", but in moments when the performance drops. More or less, it also projects my emotions towards the depicted object.',
      images: ['1 (3).jpeg','1 (4).jpeg','1 (5).jpeg','1 (6).jpeg','1 (7).jpeg','1 (8).jpeg','1 (9).jpeg','1 (10).jpeg','1 (11).jpeg','1 (12).jpeg','1 (13).jpeg','1 (14).jpeg','1 (15).jpeg','1 (16).jpeg','1 (17).jpeg']
    },
    {
      id: 'shanshui', title: 'ShanShui Series', years: '2024–2025',
      text: 'After studying postcolonial theory, I realized how little I knew about the culture I grew up in. I had been looking at my own tradition through a Western lens. So these works attempt to bridge Chinese landscape aesthetics with Western form. I learn painting language from painters I love: Twombly, Ryman, Cézanne. Cohere them in a Chinese classical landscape painting structure. Trying to transfer Chinese art logic and ideology through color into an understandable way across time and continent. The semi-transparent mountain: what lies behind the visible.',
      images: ['3 (1.).jpeg','3 (2.).jpeg','3 (3.).jpeg','3 (4.).jpeg','3 (5.).jpeg','3 (5.1).jpeg','3 (5.2).jpeg','3 (6.).jpeg','3 (6.1).jpeg','3 (6.2).jpeg','3 (6.3).jpeg','3 (7.).jpeg','3 (7.1).jpeg','3 (7.2).jpeg','3 (7.3).jpeg']
    }
  ];

  // Persistent layout data: { sectionId: { 'filename': {x,y,w,h} } }
  var layout = {};

  function loadLayout(){
    try{ var s=localStorage.getItem('youcy_vs_layout'); if(s) layout=JSON.parse(s); }catch(e){}
  }
  function saveLayout(){
    try{ localStorage.setItem('youcy_vs_layout',JSON.stringify(layout)); }catch(e){}
  }

  function esc(s){ var d=document.createElement('div');d.textContent=s;return d.innerHTML; }

  // Default layout — exported 2026-08-11, baked into source
  var defaultLayout = {"early":{"01-9岁绘画.jpeg":{"x":70,"y":74,"w":259,"h":180},"01-14岁绘画.jpeg":{"x":392,"y":54,"w":291,"h":219},"01-17岁绘画.jpeg":{"x":735,"y":90,"w":200,"h":160},"01-18岁绘画.jpeg":{"x":954,"y":91,"w":200,"h":160}},"mimic":{"4 (1).jpeg":{"x":180,"y":4,"w":178,"h":215},"4 (2).jpeg":{"x":106,"y":234,"w":303,"h":178},"4 (3).jpeg":{"x":933,"y":204,"w":231,"h":210},"4 (4).jpeg":{"x":882,"y":10,"w":270,"h":181},"4 (5).jpeg":{"x":554,"y":282,"w":186,"h":138},"4（6）.jpeg":{"x":378,"y":16,"w":519,"h":269}},"expression":{"5 (1).jpeg":{"x":40,"y":110,"w":176,"h":188},"5 (11).jpeg":{"x":478,"y":30,"w":131,"h":130},"5 (12).jpeg":{"x":600,"y":20,"w":451,"h":312},"5 (13).jpeg":{"x":936,"y":20,"w":402,"h":290},"5 (14).jpeg":{"x":158,"y":20,"w":200,"h":160},"5 (15).jpeg":{"x":162,"y":200,"w":276,"h":204},"5 (16).jpeg":{"x":354,"y":191,"w":313,"h":306},"5 (17).jpeg":{"x":649,"y":312,"w":332,"h":281},"5 (18).jpeg":{"x":20,"y":352,"w":227,"h":184},"5 (19).jpeg":{"x":228,"y":420,"w":202,"h":162},"5 (20).jpeg":{"x":342,"y":31,"w":141,"h":141},"5（21）.jpeg":{"x":1043,"y":334,"w":160,"h":242}},"aura":{"6 (1).jpeg":{"x":730,"y":33,"w":362,"h":354},"6 (2).jpeg":{"x":502,"y":228,"w":274,"h":183},"6 (3).jpeg":{"x":530,"y":26,"w":230,"h":186},"6 (4).jpeg":{"x":991,"y":155,"w":330,"h":244},"6 (5).jpeg":{"x":103,"y":188,"w":440,"h":215},"6 (6).jpeg":{"x":90,"y":56,"w":400,"h":122}},"classical":{"7 (1).jpeg":{"x":652,"y":8,"w":501,"h":462},"7 (2).jpeg":{"x":529,"y":70,"w":203,"h":305},"7 (3).jpeg":{"x":298,"y":42,"w":214,"h":299},"7 (4).jpeg":{"x":1077,"y":34,"w":158,"h":213},"7 (5).jpeg":{"x":1082,"y":252,"w":96,"h":153},"7 (6).jpeg":{"x":8,"y":10,"w":286,"h":402}},"authentic":{"1 (3).jpeg":{"x":534,"y":667,"w":125,"h":106},"1 (4).jpeg":{"x":1067,"y":674,"w":141,"h":123},"1 (5).jpeg":{"x":363,"y":616,"w":154,"h":197},"1 (6).jpeg":{"x":958,"y":489,"w":221,"h":176},"1 (7).jpeg":{"x":479,"y":21,"w":198,"h":168},"1 (8).jpeg":{"x":687,"y":20,"w":258,"h":201},"1 (9).jpeg":{"x":970,"y":244,"w":227,"h":235},"1 (10).jpeg":{"x":80,"y":28,"w":159,"h":185},"1 (11).jpeg":{"x":268,"y":18,"w":220,"h":210},"1 (12).jpeg":{"x":-18,"y":208,"w":384,"h":289},"1 (13).jpeg":{"x":604,"y":232,"w":353,"h":284},"1 (14).jpeg":{"x":596,"y":506,"w":411,"h":279},"1 (15).jpeg":{"x":270,"y":235,"w":437,"h":383},"1 (16).jpeg":{"x":871,"y":18,"w":387,"h":222},"1 (17).jpeg":{"x":25,"y":551,"w":309,"h":243}},"shanshui":{"3 (1.).jpeg":{"x":507,"y":94,"w":261,"h":160},"3 (2.).jpeg":{"x":-6,"y":66,"w":346,"h":370},"3 (3.).jpeg":{"x":250,"y":84,"w":306,"h":174},"3 (4.).jpeg":{"x":966,"y":56,"w":306,"h":252},"3 (5.).jpeg":{"x":259,"y":266,"w":783,"h":200},"3 (5.1).jpeg":{"x":749,"y":77,"w":240,"h":186},"3 (5.2).jpeg":{"x":1024,"y":306,"w":179,"h":176},"3 (6.).jpeg":{"x":52,"y":478,"w":462,"h":172},"3 (6.1).jpeg":{"x":505,"y":476,"w":238,"h":162},"3 (6.2).jpeg":{"x":50,"y":653,"w":188,"h":120},"3 (6.3).jpeg":{"x":365,"y":660,"w":176,"h":127},"3 (7.).jpeg":{"x":532,"y":648,"w":490,"h":129},"3 (7.1).jpeg":{"x":767,"y":449,"w":254,"h":212},"3 (7.2).jpeg":{"x":1025,"y":641,"w":176,"h":148},"3 (7.3).jpeg":{"x":1029,"y":480,"w":183,"h":155}}};

  function ensureLayout(secId, images){
    if(!layout[secId]) layout[secId]={};
    images.forEach(function(img,idx){
      if(!layout[secId][img]){
        // Use baked-in default if available, otherwise auto-arrange
        if(defaultLayout[secId] && defaultLayout[secId][img]){
          layout[secId][img] = defaultLayout[secId][img];
        } else {
          var cols = 4, w = 200, h = 160, gap = 16;
          var row = Math.floor(idx / cols), col = idx % cols;
          layout[secId][img] = {x:col*(w+gap)+gap, y:row*(h+gap+22)+gap, w:w, h:h};
        }
      }
    });
  }

  function render(){
    var root = document.getElementById('vs-content');
    if(!root) return;

    var h='';
    sections.forEach(function(sec){
      ensureLayout(sec.id, sec.images);
      var totalW = 0, totalH = 0;
      sec.images.forEach(function(img){
        var p = layout[sec.id][img];
        if(p.x+p.w > totalW) totalW = p.x+p.w+20;
        if(p.y+p.h > totalH) totalH = p.y+p.h+60;
      });

      h+='<section class="vs-section">'+
        '<div class="vs-head"><h3>'+esc(sec.title)+'</h3><span class="vs-years">'+esc(sec.years)+'</span></div>'+
        '<p class="vs-text" contenteditable="true" data-section="'+sec.id+'">'+esc(sec.text)+'</p>'+
        '<div class="vs-canvas" id="canvas-'+sec.id+'" style="min-height:'+Math.max(totalH,350)+'px">'+
          '<span class="hint">Drag to reposition · Drag corner to resize · Click to view full</span>';

      sec.images.forEach(function(img){
        var p = layout[sec.id][img];
        var src = base + encodeURI(img);
        var cap = img.replace(/\.(jpeg|jpg)$/i,'');
        h+='<div class="vs-img" id="img-'+sec.id+'-'+img.replace(/[^a-zA-Z0-9]/g,'_')+'" '+
          'data-sec="'+sec.id+'" data-img="'+img+'" '+
          'style="left:'+p.x+'px;top:'+p.y+'px;width:'+p.w+'px;height:'+p.h+'px">'+
          '<img src="'+src+'" alt="'+esc(cap)+'" draggable="false">'+
          '<span class="caption">'+esc(cap)+'</span>'+
          '<div class="resize-handle"></div>'+
        '</div>';
      });

      h+='</div></section>';
    });
    root.innerHTML=h;

    // Bind interact.js
    bindInteract();

    // Bind section text editing
    document.querySelectorAll('.vs-text[contenteditable]').forEach(function(el){
      el.addEventListener('blur',function(){
        var sid=el.getAttribute('data-section');
        for(var i=0;i<sections.length;i++){
          if(sections[i].id===sid){ sections[i].text=el.textContent.trim(); saveSections(); break; }
        }
      });
    });

    // Click canvas background to deselect
    document.querySelectorAll('.vs-canvas').forEach(function(canvas){
      canvas.addEventListener('mousedown',function(e){
        if(e.target===canvas){ deselectAll(); }
      });
    });
  }

  function deselectAll(){
    document.querySelectorAll('.vs-img.active').forEach(function(el){ el.classList.remove('active'); });
  }

  function bindInteract(){
    interact('.vs-img').draggable({
      listeners: {
        start: function(e){ e.target.classList.add('active'); },
        move: function(e){
          var el = e.target;
          var x = (parseFloat(el.getAttribute('data-x')) || parseFloat(el.style.left) || 0) + e.dx;
          var y = (parseFloat(el.getAttribute('data-y')) || parseFloat(el.style.top) || 0) + e.dy;
          el.style.left = x+'px';
          el.style.top = y+'px';
          el.setAttribute('data-x', x);
          el.setAttribute('data-y', y);
        },
        end: function(e){
          var el = e.target;
          el.classList.remove('active');
          persistImg(el);
          el.removeAttribute('data-x');
          el.removeAttribute('data-y');
        }
      }
    }).resizable({
      edges: { bottom:true, right:true },
      listeners: {
        move: function(e){
          var el = e.target;
          var w = e.rect.width;
          var h = e.rect.height;
          el.style.width = w+'px';
          el.style.height = h+'px';
        },
        end: function(e){ persistImg(e.target); }
      }
    }).on('tap', function(e){
      // Single click: select; double-click handled separately
      var el = e.target.closest('.vs-img');
      if(!el) return;
      deselectAll();
      el.classList.add('active');
    });

    // Double-click: lightbox
    document.querySelectorAll('.vs-img').forEach(function(el){
      el.addEventListener('dblclick',function(e){
        e.preventDefault();
        var img = el.querySelector('img');
        if(img){ lightbox(img.src); }
      });
    });
  }

  function persistImg(el){
    var secId = el.getAttribute('data-sec');
    var imgFile = el.getAttribute('data-img');
    if(!secId||!imgFile) return;
    if(!layout[secId]) layout[secId]={};
    layout[secId][imgFile] = {
      x: Math.round(parseFloat(el.style.left)||0),
      y: Math.round(parseFloat(el.style.top)||0),
      w: Math.round(parseFloat(el.style.width)||200),
      h: Math.round(parseFloat(el.style.height)||160)
    };
    saveLayout();
  }

  // Lightbox
  function lightbox(src){
    var lb=document.getElementById('lightbox');
    lb.querySelector('img').src=src;
    lb.classList.add('on');
  }

  function resetLayout(){
    layout={};
    saveLayout();
    sections.forEach(function(sec){ ensureLayout(sec.id, sec.images); });
    render();
  }

  // Section texts persistence
  function loadSections(){
    try{ var s=localStorage.getItem('youcy_vs_texts'); if(s){ var d=JSON.parse(s); sections.forEach(function(sec){ if(d[sec.id]) sec.text=d[sec.id]; }); } }catch(e){}
  }
  function saveSections(){
    var d={}; sections.forEach(function(sec){ d[sec.id]=sec.text; });
    try{ localStorage.setItem('youcy_vs_texts',JSON.stringify(d)); }catch(e){}
  }

  // Lightbox events
  document.addEventListener('DOMContentLoaded',function(){
    var lb=document.getElementById('lightbox');
    if(!lb) return;
    lb.addEventListener('click',function(e){
      if(e.target===lb||e.target.classList.contains('lb-close')) lb.classList.remove('on');
    });
    document.addEventListener('keydown',function(e){ if(e.key==='Escape') lb.classList.remove('on'); });
    // Deselect on Escape also
    document.addEventListener('keydown',function(e){ if(e.key==='Escape') deselectAll(); });
  });

  function init(){
    loadLayout();
    loadSections();
    render();
  }
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded',init); }
  else{ init(); }

  function exportLayout(){
    var data = { layout: layout, texts: {} };
    sections.forEach(function(sec){ data.texts[sec.id] = sec.text; });
    var blob = new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'youcy-visual-studies-layout.json';
    a.click();
  }

  function importLayout(){
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(e){
      var file = e.target.files[0];
      if(!file) return;
      var reader = new FileReader();
      reader.onload = function(ev){
        try{
          var data = JSON.parse(ev.target.result);
          if(data.layout){ layout = data.layout; saveLayout(); }
          if(data.texts){
            sections.forEach(function(sec){ if(data.texts[sec.id]) sec.text = data.texts[sec.id]; });
            saveSections();
          }
          render();
        }catch(err){ alert('Invalid JSON file'); }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  return { resetLayout:resetLayout, lightbox:lightbox, exportLayout:exportLayout, importLayout:importLayout };
})();
