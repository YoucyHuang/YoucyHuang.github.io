/**
 * Writing — Search engine
 */
var Writing = (function(){
  'use strict';

  // Build index from DOM
  function getDocs(){
    var docs=[];
    document.querySelectorAll('.doc-item').forEach(function(el,i){
      var title=el.querySelector('.doc-title')?.textContent||'';
      var desc=el.querySelector('.doc-desc')?.textContent||'';
      var year=el.querySelector('.doc-year')?.textContent||'';
      var cat=el.closest('.writing-cat')?.querySelector('h4')?.textContent||'';
      docs.push({idx:i,title:title,desc:desc,year:year,category:cat});
    });
    return docs;
  }

  function search(q){
    var box=document.getElementById('search-results');
    if(!box) return;
    if(!q||q.trim().length<2){ box.innerHTML='<p class="sr-empty">Results appear here.</p>'; return; }

    q=q.toLowerCase().trim();
    var docs=getDocs();
    if(!docs.length){ box.innerHTML='<p class="sr-empty">No documents indexed.</p>'; return; }

    // Parse year range
    var years=q.match(/\b(20\d{2})\b/g);
    var ys=null, ye=null;
    if(years && years.length>=2){ ys=parseInt(years[0]); ye=parseInt(years[1]); }
    else if(years && years.length===1){ ys=parseInt(years[0]); ye=ys; }

    // Remove years from keyword text
    var kwText = q.replace(/\b20\d{2}\b/g,'');
    var kws = kwText.split(/[\s,;·.、，]+/).filter(function(w){ return w.length>1; });

    // Topic synonyms
    var topicMap = {
      'heidegger':'heidegger','海德格尔':'heidegger','dasein':'heidegger',
      'authenticity':'authenticity','本真':'authenticity',
      'landscape':'landscape','山水':'landscape','山':'landscape',
      'body':'body','身体':'body','embodiment':'body','embodied':'body',
      'cezanne':'cezanne','塞尚':'cezanne',
      'philosophy':'philosophy','哲学':'philosophy',
      'ganxing':'ganxing','感兴':'ganxing',
      'mother':'mother','母亲':'mother','family':'mother',
      'ai':'ai','digital':'ai','artificial':'ai',
      'confucian':'confucian','儒家':'confucian','新儒家':'confucian',
      'governance':'governance','治理':'governance',
      'painting':'painting','绘画':'painting','paint':'painting',
      'fiction':'fiction','小说':'fiction',
      'poetry':'poetry','诗歌':'poetry','诗':'poetry',
      'salgao':'salgao','萨尔加多':'salgao',
      'ryman':'ryman','莱曼':'ryman',
      'zao':'zao','赵无极':'zao','无极':'zao',
      '内卷':'involution','躺平':'involution','involution':'involution',
      'cynicism':'cynicism','犬儒':'cynicism',
      'quotation':'quotation','名言':'quotation','皇帝':'quotation',
      'scholar':'scholar','士大夫':'scholar','乌托邦':'scholar',
      '失语':'aphasia','aphasia':'aphasia','当代艺术':'aphasia',
      'batik':'batik','蜡染':'batik','miao':'batik','苗':'batik',
    };

    var scored=[];
    docs.forEach(function(doc){
      var score=0;
      var full=(doc.title+' '+doc.desc+' '+doc.category+' '+doc.year).toLowerCase();

      // Year match
      var docYear=0;
      var ym=doc.year.match(/\b(20\d{2})/);
      if(ym) docYear=parseInt(ym[0]);
      if(ys!==null && ye!==null && docYear){
        if(docYear>=ys && docYear<=ye) score+=60;
        else if(docYear>=ys-1 && docYear<=ye+1) score+=20;
      }

      // Keyword match
      kws.forEach(function(kw){
        if(full.indexOf(kw)!==-1) score+=35;
      });

      // Topic match
      Object.keys(topicMap).forEach(function(tk){
        if(q.indexOf(tk)!==-1 && full.indexOf(topicMap[tk])!==-1) score+=45;
      });

      // Category match
      if(q.indexOf('essay')!==-1 && doc.category.indexOf('Essay')!==-1) score+=20;
      if(q.indexOf('fiction')!==-1 && doc.category.indexOf('Fiction')!==-1) score+=20;
      if(q.indexOf('poetry')!==-1 && doc.category.indexOf('Poetry')!==-1) score+=20;

      if(score>=30) scored.push({doc:doc,score:score});
    });

    scored.sort(function(a,b){return b.score-a.score;});
    scored=scored.slice(0,15);

    if(!scored.length){ box.innerHTML='<p class="sr-empty">No matches. Try broader keywords or a different time range.</p>'; return; }

    function esc(s){ var d=document.createElement('div');d.textContent=s;return d.innerHTML; }
    var h='';
    scored.forEach(function(r){
      h+='<div class="sr-item" onclick="document.querySelectorAll(\'.doc-item\')['+r.doc.idx+'].scrollIntoView({behavior:\'smooth\',block:\'center\'})">'+
        '<span class="sr-title">'+esc(r.doc.title)+'</span>'+
        '<span class="sr-excerpt">'+esc(r.doc.year)+' · '+esc(r.doc.category.replace(/^[A-C]\.?\s*/,''))+' — '+esc(r.doc.desc.substring(0,100))+'</span>'+
      '</div>';
    });
    box.innerHTML=h;
  }

  return {search:search};
})();
