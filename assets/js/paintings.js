/**
 * Paintings — Cézanne Catalogue
 */
var Paintings = (function(){
  'use strict';

  var periods = [
    { id:'early', label:'Early Practice', years:'Age 9–17',
      text:'I have loved painting and fiction since childhood. These early works are not sophisticated, but they carry something academic training later tried to refine but never replace: the instinct to make marks that mean something.',
      images:['image_03.jpeg','image_04.jpeg','image_01.jpeg','image_31.jpeg','image_14.jpeg','image_12.jpeg'] },
    { id:'academic', label:'Academic Realism & Cézanne', years:'2021–2022',
      text:'Formal academic training at CAA. Early intention: reproduce the visible world, building 3D space on a 2D plane, following Greek art through Da Vinci. Reading Plato, then Kant. At the same time, becoming obsessed with Cézanne — the first painter who showed me that painting is not about reproducing vision, but constructing it.',
      images:['image_39.jpeg','image_40.jpeg','image_41.jpeg','image_42.jpeg','image_43.jpeg','image_44.jpeg','image_45.jpeg','image_46.jpeg'] },
    { id:'heidegger', label:'The Heidegger Turn', years:'2023',
      text:'Took German A1 at 19 because Dasein cannot be translated into Chinese without loss. "The Origin of Art" changed my understanding of painting: not representation, not expression, but a happening of truth — an event in which a world opens.',
      images:['image_47.jpeg','image_48.jpeg','image_49.jpeg','image_50.jpeg','image_51.jpeg','image_52.jpeg'] },
    { id:'authenticity', label:'Authenticity Series', years:'2024',
      text:'Heidegger\'s Dasein vs. das Man led me to a series of portraits capturing people in moments when the performance drops. Not about likeness — about the quiet interval between one mask and the next.',
      images:['image_20.jpeg','image_21.jpeg','image_22.jpeg','image_23.jpeg','image_24.jpeg','image_25.jpeg','image_26.jpeg','image_27.jpeg','image_28.jpeg','image_29.jpeg','image_30.jpeg','image_53.jpeg','image_54.jpeg'] },
    { id:'landscape', label:'Chinese Landscape, Western Language', years:'2024–2025',
      text:'After postcolonial theory, I realized I knew more about Western culture than Chinese — and had been looking at my own tradition through a Western lens. My semi-transparent mountain series attempts to bridge Chinese landscape\'s "moving focus" with Twombly, Ryman, and Cézanne.',
      images:['image_09.jpeg','image_10.jpeg','image_11.jpeg','image_13.jpeg','image_15.jpeg','image_55.jpeg','image_56.jpeg','image_57.jpeg','image_58.jpeg','image_59.jpeg','image_60.jpeg','image_61.jpeg'] },
    { id:'graduation', label:'Graduation & the Turn to DH', years:'2025–2026',
      text:'MFA thesis on Robert Ryman — body, trace, presence. Graduation creation continued the semi-transparent mountain series. In May 2026, built first interactive websites through a rural revitalization project. That opened the door to Digital Humanities.',
      images:['image_62.jpeg','image_63.jpeg','image_64.jpeg','image_65.jpeg','image_06.jpeg','image_07.jpeg','image_08.jpeg','image_16.jpeg','image_17.jpeg'] }
  ];

  var annotations = {};
  var currentAnn = null;
  var thumbSize = 210;

  function loadAnn(){
    try{ var s=localStorage.getItem('youcy_p_ann'); if(s) annotations=JSON.parse(s); }catch(e){}
  }
  function saveAnnAll(){
    try{ localStorage.setItem('youcy_p_ann',JSON.stringify(annotations)); }catch(e){}
  }

  function esc(s){ var d=document.createElement('div'); d.textContent=s; return d.innerHTML; }

  function render(){
    var root = document.getElementById('catalogue');
    if(!root) return;

    var h='';
    periods.forEach(function(p){
      h+='<section class="period-section">'+
        '<div class="period-head"><h2>'+esc(p.label)+'</h2><span class="years">'+esc(p.years)+'</span></div>'+
        '<p class="period-desc">'+esc(p.text)+'</p>'+
        '<div class="catalogue-grid" id="grid-'+p.id+'">';

      p.images.forEach(function(img,i){
        var key=p.id+'/'+img;
        var hasAnn = annotations[key] ? ' · annotated' : '';
        h+='<div class="catalogue-item" data-key="'+key+'" data-img="'+img+'" data-period="'+p.id+'" onclick="Paintings.openAnn(\''+p.id+'\',\''+img+'\')">'+
          '<img src="assets/images/artworks/'+img+'" alt="'+esc(p.label)+' — '+(i+1)+'" loading="lazy">'+
          '<div class="cat-info">'+
            '<span class="cat-title">'+esc(p.label)+' ('+(i+1)+')</span>'+
            '<span class="cat-meta">'+esc(p.years)+hasAnn+'</span>'+
          '</div>'+
        '</div>';
      });

      h+='</div></section>';
    });
    root.innerHTML=h;
    applySize();
  }

  function resize(val){
    thumbSize = parseInt(val);
    document.getElementById('size-label').textContent = val+'px';
    document.documentElement.style.setProperty('--thumb-size', val+'px');
    try{ localStorage.setItem('youcy_thumb',val); }catch(e){}
  }

  function applySize(){
    document.documentElement.style.setProperty('--thumb-size', thumbSize+'px');
  }

  function openAnn(periodId, imgFile){
    var p = null;
    for(var i=0;i<periods.length;i++){ if(periods[i].id===periodId){ p=periods[i]; break; } }
    if(!p) return;
    currentAnn = {periodId:periodId, imgFile:imgFile};
    var key = periodId+'/'+imgFile;
    document.getElementById('ann-title').textContent = p.label + ' ('+imgFile.replace('.jpeg','')+')';
    document.getElementById('ann-meta').textContent = p.years;
    document.getElementById('ann-text').value = annotations[key] || '';
    document.getElementById('ann-panel').classList.add('open');
  }

  function closeAnn(){
    document.getElementById('ann-panel').classList.remove('open');
    currentAnn=null;
  }

  function saveAnn(){
    if(!currentAnn) return;
    var key = currentAnn.periodId+'/'+currentAnn.imgFile;
    annotations[key] = document.getElementById('ann-text').value.trim();
    saveAnnAll();
    closeAnn();
    render(); // refresh to show "annotated" marker
  }

  function initLightbox(){
    var lb=document.getElementById('lightbox');
    if(!lb) return;
    var img=lb.querySelector('img');
    document.addEventListener('click',function(e){
      var item=e.target.closest('.catalogue-item');
      if(!item) return;
      // Don't open lightbox if clicking annotation — annotation opens separately
      e.preventDefault(); e.stopPropagation();
      img.src = item.querySelector('img').src;
      lb.classList.add('on');
    });
    lb.addEventListener('click',function(e){
      if(e.target===lb || e.target.classList.contains('lb-close')) lb.classList.remove('on');
    });
    document.addEventListener('keydown',function(e){
      if(e.key==='Escape'){ lb.classList.remove('on'); closeAnn(); }
    });
  }

  // Load saved thumb size
  try{ var s=localStorage.getItem('youcy_thumb'); if(s) thumbSize=parseInt(s); }catch(e){}

  function init(){
    loadAnn();
    render();
    initLightbox();
    document.getElementById('size-slider').value = thumbSize;
    document.getElementById('size-label').textContent = thumbSize+'px';
  }
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded',init); }
  else{ init(); }

  return { resize:resize, openAnn:openAnn, closeAnn:closeAnn, saveAnn:saveAnn };
})();
