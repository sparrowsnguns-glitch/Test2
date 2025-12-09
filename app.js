/* =================== USER LINKS: 24 KEINVERLAG-URLS =================== */
const USER_LINKS = [
  "https://keinverlag.de/225083.text","https://keinverlag.de/504676.text","https://keinverlag.de/352776.text",
  "https://keinverlag.de/267108.text","https://keinverlag.de/499694.text","https://keinverlag.de/504471.text",
  "https://keinverlag.de/492727.text","https://keinverlag.de/486329.text","https://keinverlag.de/470975.text",
  "https://keinverlag.de/159634.text","https://keinverlag.de/248786.text","https://keinverlag.de/443719.text",
  "https://keinverlag.de/494095.text","https://keinverlag.de/466005.text","https://keinverlag.de/415476.text",
  "https://keinverlag.de/481308.text","https://keinverlag.de/504657.text","https://keinverlag.de/288539.text",
  "https://keinverlag.de/503091.text","https://keinverlag.de/434088.text","https://keinverlag.de/459968.text",
  "https://keinverlag.de/493109.text","https://keinverlag.de/502711.text","https://keinverlag.de/499381.text"
];
/* ===================================================================== */

const DOORS = 24;
let openedDoors = JSON.parse(localStorage.getItem('openedDoors')||"[]");
const cal = document.getElementById('calendar');
const leadEl = document.querySelector('.lead');

const today = new Date();
const realModeStart = new Date('2025-12-01T00:00:00');

// Testmodus aktiv vor dem 01.12.2025
const testMode = today < realModeStart;

// Lead-Text ausblenden ab 01.12.2025
if(today >= realModeStart && leadEl) leadEl.style.display = 'none';

function buildCalendar(){
  cal.innerHTML='';
  for(let i=0;i<DOORS;i++){
    const tile = document.createElement('div'); tile.className='tile';
    const inner = document.createElement('div'); inner.className='tile-inner';
    const front = document.createElement('div'); front.className='tile-front'; front.textContent=`${i+1}`;
    const back = document.createElement('div'); back.className='tile-back';
    back.innerHTML=`<span>Tür ${i+1}</span><span class="icon">🎄</span>`;

    // Kleine Sterne zufällig auf Rückseite
    for(let s=0;s<3;s++){
      const star = document.createElement('div'); star.className='star';
      star.style.top=`${Math.random()*70+10}%`;
      star.style.left=`${Math.random()*70+10}%`;
      back.appendChild(star);
    }

    inner.appendChild(front); inner.appendChild(back);
    tile.appendChild(inner);

    if(openedDoors.includes(i)) tile.classList.add('open');

    tile.addEventListener('click', ()=>{
      if(!testMode && (i+1)>today.getDate()){
        alert(`Tür ${i+1} noch nicht verfügbar.`);
        return;
      }

      tile.classList.add('open');

      const backEl = tile.querySelector('.tile-back');
      backEl.classList.remove('glitter');
      void backEl.offsetWidth; // Reflow
      backEl.classList.add('glitter');

      // Link verzögert nach Animation öffnen
      setTimeout(()=>{ window.open(USER_LINKS[i],'_blank'); }, 900);

      if(!openedDoors.includes(i)){
        openedDoors.push(i); 
        localStorage.setItem('openedDoors',JSON.stringify(openedDoors));
      }
    });

    cal.appendChild(tile);
  }
}
buildCalendar();

/* ===================== Snow Canvas ===================== */
(function snow(){
  const canvas=document.getElementById('snow'); if(!canvas)return;
  const ctx=canvas.getContext('2d');
  let W=canvas.width=innerWidth,H=canvas.height=innerHeight;
  window.addEventListener('resize',()=>{ W=canvas.width=innerWidth; H=canvas.height=innerHeight; });
  const flakes=[]; const COUNT=Math.round(Math.min(260,Math.max(80,W/6)));
  for(let i=0;i<COUNT;i++) flakes.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*2.6+0.6,speed:Math.random()*0.6+0.2,sway:Math.random()*0.02+0.002,ang:Math.random()*Math.PI*2,alpha:Math.random()*0.7+0.2});
  function loop(){ ctx.clearRect(0,0,W,H); ctx.fillStyle='rgba(255,255,255,0.9)';
    for(const f of flakes){ f.ang+=f.sway; f.y+=f.speed+Math.cos(f.ang)*0.2; f.x+=Math.sin(f.ang)*0.4;
      if(f.y>H+10){ f.y=-10; f.x=Math.random()*W; } if(f.x>W+10) f.x=-10; if(f.x<-10) f.x=W+10;
      ctx.globalAlpha=f.alpha; ctx.beginPath(); ctx.arc(f.x,f.y,f.r,0,Math.PI*2); ctx.fill(); }
    ctx.globalAlpha=1; requestAnimationFrame(loop);}
  loop();
})();
