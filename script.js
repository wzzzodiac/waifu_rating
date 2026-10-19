'use strict';
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),animations=new Set();
function animate(el,frames,options){if(reduced.matches||document.hidden||!el?.animate)return null;const a=el.animate(frames,options);animations.add(a);a.finished.then(()=>animations.delete(a)).catch(()=>animations.delete(a));return a}
function settle(){animations.forEach(a=>a.cancel());animations.clear()}
reduced.addEventListener('change',()=>{if(reduced.matches)settle()});document.addEventListener('visibilitychange',()=>{if(document.hidden)settle()});window.addEventListener('resize',settle);

if(document.body.classList.contains('waifu-page')){
 const file=document.querySelector('#image-file'),portrait=document.querySelector('#portrait'),output=document.querySelector('#rating-output'),stamp=document.querySelector('#verdict-stamp'),status=document.querySelector('#rating-status'),rate=document.querySelector('#rate-image');let stampAnimation=null,readRevision=0;
 function resetRating(){settle();output.textContent='—';output.setAttribute('aria-label','Random rating');stamp.hidden=true;rate.querySelector('span').textContent='Rate image'}
 document.querySelector('#choose-image').addEventListener('click',()=>file.click());
 file.addEventListener('change',()=>{const selected=file.files[0];if(!selected)return;const revision=++readRevision;
  if(!selected.type.startsWith('image/')){status.textContent='Choose an image file.';return}
  const reader=new FileReader();reader.onload=async()=>{const check=new Image();check.src=reader.result;try{await check.decode()}catch{if(revision===readRevision)status.textContent='Could not open that image. Try another one.';return}if(revision!==readRevision)return;portrait.src=reader.result;portrait.classList.add('user-image');portrait.alt='Your selected image, previewed locally';document.querySelector('#image-label').textContent='YOUR IMAGE';document.querySelector('#demo-reset').hidden=false;resetRating();status.textContent='Image ready.';rate.click()};reader.onerror=()=>{if(revision!==readRevision)return;status.textContent='Could not read that image. Try another one.'};reader.readAsDataURL(selected);
 });
 document.querySelector('#demo-reset').addEventListener('click',()=>{readRevision++;portrait.classList.remove('user-image');portrait.src='assets/mika.svg';portrait.alt='Original demo illustration';file.value='';document.querySelector('#image-label').textContent='DEMO IMAGE';document.querySelector('#demo-reset').hidden=true;resetRating();status.textContent='Demo restored.'});
 rate.addEventListener('click',()=>{const from=getComputedStyle(stamp).transform;stampAnimation?.cancel();const score=70+Math.floor(Math.random()*30);output.textContent=score;output.setAttribute('aria-label',`${score} out of 100, random rating`);stamp.hidden=false;rate.querySelector('span').textContent='Rate again';status.textContent=`Rated ${score} out of 100. The score is random.`;stampAnimation=animate(stamp,[{transform:from==='none'?'rotate(10deg) scale(1.25)':from,opacity:.35},{transform:'rotate(10deg) scale(1)',opacity:1}],{duration:300,easing:'cubic-bezier(.2,.7,.2,1)'})});
}
