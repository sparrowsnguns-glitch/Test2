const USER_LINKS = [
  "https://keinverlag.de/225083.text","https://keinverlag.de/504676.text","https://keinverlag.de/352776.text",
  "https://keinverlag.de/267108.text","https://keinverlag.de/499694.text","https://keinverlag.de/504471.text",
  "https://keinverlag.de/492727.text","https://keinverlag.de/486329.text","https://keinverlag.de/470975.text",
  "https://keinverlag.de/159634.text","https://keinverlag.de/248786.text","https://keinverlag.de/248389.text",
  "https://keinverlag.de/137869.text","https://keinverlag.de/375079.text","https://keinverlag.de/415476.text",
  "https://keinverlag.de/481308.text","https://keinverlag.de/504657.text","https://keinverlag.de/504446.text",
  "https://keinverlag.de/504573.text","https://keinverlag.de/504649.text","https://keinverlag.de/504470.text",
  "https://keinverlag.de/493109.text","https://keinverlag.de/502711.text","https://keinverlag.de/499381.text"
];

const DOORS = 24;
let openedDoors = JSON.parse(localStorage.getItem('openedDoors')||"[]");
const cal = document.getElementById('calendar');
const today = new Date();
const realMode = false; // heute alles anklickbar

function buildCalendar(){
  cal.innerHTML='';
  for(let i=0;i<DOORS;i++){
    const tile = document.createElement('button'); tile.className='tile';
    const inner = document.createElement('div'); inner.className='tile-inner';
    const front = document.createElement('div'); front.className='tile-front';
    const back = document.createElement('div'); back.className='tile-back';
    back.innerHTML = `<span>Tür ${i+1}</span><span class="icon">🎄</span>`;
    front.innerHTML = `<span class="num">${i+1}</span>`;
    inner.appendChild(front); inner.appendChild(back);
    tile.appendChild(inner);

    if(openedDoors.includes(i)) tile.classList.add('open');

    tile.addEventListener('click', ()=>{
      if(!realMode && (i+1)>today.getDate()) { alert(`Tür ${i+1} noch nicht verfügbar.`); return; }
      window.open(USER_LINKS[i],'_blank');
      if(!openedDoors.includes(i)){ openedDoors.push(i); localStorage.setItem('openedDoors',JSON.stringify(openedDoors)); tile.classList.add('open'); }
    });

    cal.appendChild(tile);
  }
}
buildCalendar();

/* Snow Canvas */
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
