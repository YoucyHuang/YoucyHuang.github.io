/**
 * Homepage — editable text, drag-to-replace images, export
 */
var Homepage = (function(){
  'use strict';

  // ── Load saved state ─────────────────────────
  function loadState(){
    try{ var s=localStorage.getItem('youcy_homepage'); if(s) return JSON.parse(s); }catch(e){}
    return {};
  }
  function saveState(state){
    try{ localStorage.setItem('youcy_homepage',JSON.stringify(state)); }catch(e){}
  }

  var state = loadState();

  // ── Apply saved text ─────────────────────────
  function applyTexts(){
    document.querySelectorAll('[contenteditable][data-hp]').forEach(function(el){
      var key = el.getAttribute('data-hp');
      if(state[key]) el.textContent = state[key];
    });
    document.querySelectorAll('[data-hp-img]').forEach(function(img){
      var key = img.getAttribute('data-hp-img');
      if(state['img_'+key]) img.src = state['img_'+key];
    });
  }

  // ── Bind text editing ────────────────────────
  function bindEditing(){
    document.querySelectorAll('[contenteditable][data-hp]').forEach(function(el){
      el.addEventListener('blur',function(){
        var key = el.getAttribute('data-hp');
        state[key] = el.textContent.trim();
        saveState(state);
      });
    });
  }

  // ── Drag-to-replace images ───────────────────
  function bindImageDrop(){
    document.querySelectorAll('[data-hp-img]').forEach(function(img){
      var key = img.getAttribute('data-hp-img');

      img.addEventListener('dragover',function(e){
        e.preventDefault();
        e.stopPropagation();
        img.classList.add('drag-over');
      });

      img.addEventListener('dragleave',function(e){
        e.preventDefault();
        img.classList.remove('drag-over');
      });

      img.addEventListener('drop',function(e){
        e.preventDefault();
        e.stopPropagation();
        img.classList.remove('drag-over');

        var file = e.dataTransfer.files[0];
        if(!file || !file.type.match(/image\/(jpeg|png|gif|webp)/)) return;

        var reader = new FileReader();
        reader.onload = function(ev){
          var dataUrl = ev.target.result;
          img.src = dataUrl;
          state['img_'+key] = dataUrl;
          saveState(state);
        };
        reader.readAsDataURL(file);
      });

      // Also allow click to paste
      img.addEventListener('click',function(){
        // Just a visual hint
        img.style.outline = '2px dashed var(--ink)';
        setTimeout(function(){ img.style.outline=''; },800);
      });
    });
  }

  // ── Export ───────────────────────────────────
  function exportAll(){
    // Collect all current state
    document.querySelectorAll('[contenteditable][data-hp]').forEach(function(el){
      state[el.getAttribute('data-hp')] = el.textContent.trim();
    });
    // Images already in state from drop events
    saveState(state);

    var blob = new Blob([JSON.stringify(state,null,2)],{type:'application/json'});
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'youcy-homepage.json';
    a.click();
  }

  // ── Reset ────────────────────────────────────
  function resetAll(){
    localStorage.removeItem('youcy_homepage');
    state = {};
    location.reload();
  }

  // ── Init ─────────────────────────────────────
  function init(){
    applyTexts();
    bindEditing();
    bindImageDrop();
  }
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded',init); }
  else{ init(); }

  return { exportAll:exportAll, resetAll:resetAll };
})();
