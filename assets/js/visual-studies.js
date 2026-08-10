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
      text: 'I have loved painting and fiction since childhood. These early works carry something academic training later tried to refine but never replace: the instinct to make marks that mean something. They are not sophisticated — but they are honest.',
      images: ['01-9岁绘画.jpeg','01-14岁绘画.jpeg','01-17岁绘画.jpeg','01-18岁绘画.jpeg']
    },
    {
      id: 'mimic', title: 'Bachelor & Master Period — Mimic Realistic World', years: '2021–2022',
      text: 'The first phase of academic training. The goal was to reproduce the visible world as faithfully as possible — building three-dimensional space on a two-dimensional plane, following the lineage of Greek art through Da Vinci and Michelangelo. Plato, then Kant: the world can be mirrored, but we can only know phenomena, never the thing-in-itself.',
      images: ['4 (1).jpeg','4 (2).jpeg','4 (3).jpeg','4 (4).jpeg','4 (5).jpeg','4（6）.jpeg']
    },
    {
      id: 'expression', title: 'Bachelor & Master Period — Cline to Expression', years: '2022–2023',
      text: 'A shift from objective reproduction toward subjective expression. The question changed from "how does the world look?" to "how does the world feel?" — influenced by modern philosophy\'s turn toward the perceiving subject. What appears on the canvas is always already filtered through a body.',
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
      text: 'Heidegger\'s distinction between Dasein and das Man — authentic and inauthentic existence — led to a series of portraits. Capturing people not as they perform themselves for others, but in moments when the performance drops. These paintings are not about likeness. They are about the quiet interval between one mask and the next.',
      images: ['1 (3).jpeg','1 (4).jpeg','1 (5).jpeg','1 (6).jpeg','1 (7).jpeg','1 (8).jpeg','1 (9).jpeg','1 (10).jpeg','1 (11).jpeg','1 (12).jpeg','1 (13).jpeg','1 (14).jpeg','1 (15).jpeg','1 (16).jpeg','1 (17).jpeg']
    },
    {
      id: 'shanshui', title: 'ShanShui Series', years: '2024–2025',
      text: 'After postcolonial theory, I realized I knew more about Western culture than the culture I grew up in. I had been looking at my own tradition through a Western lens. These works attempt to bridge Chinese landscape aesthetics — "moving focus," not optical perspective; a walk, not a window — with Western painters I love: Twombly, Ryman, Cézanne.',
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

  function getDefaultPos(idx, total){
    // Arrange in rows of ~4-5, each ~220px wide, ~180px tall, with gaps
    var cols = 4;
    var w = 200, h = 160;
    var gap = 16;
    var row = Math.floor(idx / cols);
    var col = idx % cols;
    return {
      x: col * (w + gap) + gap,
      y: row * (h + gap + 22) + gap, // 22 for caption
      w: w,
      h: h
    };
  }

  function ensureLayout(secId, images){
    if(!layout[secId]) layout[secId]={};
    images.forEach(function(img,idx){
      if(!layout[secId][img]){
        var pos = getDefaultPos(idx, images.length);
        layout[secId][img] = {x:pos.x, y:pos.y, w:pos.w, h:pos.h};
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

  return { resetLayout:resetLayout, lightbox:lightbox };
})();
