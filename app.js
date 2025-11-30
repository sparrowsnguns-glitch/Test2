/* ========== Konfiguration ========== */
const DOORS = 24;
const REALMODE_START = new Date('2025-12-01T00:00:00'); // lokal (no timezone suffix: uses client locale)
const MAX_FALLBACK_TRIES = 3; // beim Versuch, andere Links direkt nacheinander zu öffnen

/* ========== Seed / VALID_LINKS (starter) ==========
   Wichtig: das ist nur ein Seed. Bitte importiere die geprüfte 200er-Liste später via Adminpanel
*/
const VALID_LINKS = [
  "https://keinverlag.de/499694.text",
  "https://keinverlag.de/504471.text",
  "https://keinverlag.de/492727.text",
  "https://keinverlag.de/352776.text",
  "https://keinverlag.de/267108.text",
  "https://keinverlag.de/486329.text",
  "https://keinverlag.de/470975.text",
  "https://keinverlag.de/159634.text",
  "https://keinverlag.de/248786.text",
  "https://keinverlag.de/248389.text",
  "https://keinverlag.de/137869.text",
  "https://keinverlag.de/375079.text",
  "https://keinverlag.de/415476.text",
  "https://keinverlag.de/481308.text",
  "https://keinverlag.de/504657.text",
  "https://keinverlag.de/504446.text",
  "https://keinverlag.de/504573.text",
  "https://keinverlag.de/504649.text",
  "https://keinverlag.de/504470.text",
  "https://keinverlag.de/493109.text",
  "https://keinverlag.de/502711.text",
  "https://keinverlag.de/352776.text",
  "https://keinverlag.de/267108.text",
  "https://keinverlag.de/499381.text"
];

/* ========== localStorage helpers ========= */
function load(key, fallback){ try{ return JSON.parse(localStorage.getItem(key)) || fallback; }catch(e){ return fallback; } }
function save(key, val){ try{ localStorage.setItem(key, JSON.stringify(val)); }catch(e){} }

/* ========== state ========= */
let doorLinks = load('doorLinks', {}); // {1: 'https...'}
let openedDoors = load('openedDoors', []); // [1,2,5]
let userLinks = load('userLinks', null); // imported pool by admin

const pool = (Array.isArray(userLinks) && userLinks.length > 0) ? userLinks : VALID_LINKS.slice();

/* ========== utils ========= */
function pickRandom(exclude=[]){
  if (!pool || pool.length === 0) return null;
  const filtered = pool.filter(u => !exclude.includes(u));
  return filtered.length ? filtered[Math.floor(Math.random()*filtered.length)] : pool[Math.floor(Math.random()*pool.length)];
}

function assignLink(door){
  if (doorLinks[door]) return doorLinks[door];
  const url = pickRandom();
  doorLinks[door] = url;
  save('doorLinks', doorLinks);
  return url;
}

/* ========== mode ========= */
const now = new Date();
const realMode = now >= REALMODE_START;
document.getElementById('modeNote').textContent = realMode
  ? 'Echter Kalendermodus aktiv: Türchen öffnen sich nur an/ab ihrem Tag.'
  : 'Testmodus aktiv — alle Türen sind anklickbar. Ab 01.12.2025 erfolgt Sperre.';

/* ========== build calendar ========= */
const cal = document.getElementById('calendar');
cal.innerHTML = '';
for (let i=1;i<=DOORS;i++){
  const btn = document.createElement('button');
  btn.className = 'tile';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Tür ' + i);
  const span = document.createElement('span'); span.className='num'; span.textContent = i;
  btn.appendChild(span);

  if (openedDoors.includes(i)) btn.classList.add('open');

  btn.addEventListener('click', () => handleClick(i, btn));
  cal.appendChild(btn);
}

/* ========== click handler & fallback ========= */
function handleClick(doorNum, tileElement){
  // Realmode: only open if allowed
  if (realMode){
    const today = new Date();
    const day = today.getDate();
    if (doorNum > day){
      alert(`Tür ${doorNum} ist noch nicht verfügbar. Verfügbar ab dem ${doorNum}. Dezember.`);
      return;
    }
  }

  // assign if needed
  const url = assignLink(doorNum);

  // open primary
  window.open(url, '_blank');

  // mark opened
  if (!openedDoors.includes(doorNum)){
    openedDoors.push(doorNum);
    save('openedDoors', openedDoors);
    tileElement.classList.add('open');
  }

  // offer fallback flow
  setTimeout(() => {
    const ok = confirm('Falls der Text nicht erreichbar ist: weitere Fallbacks probieren? (öffnet bis zu ' + MAX_FALLBACK_TRIES + ' weitere Tabs)');
    if (!ok) return;
    const used = [url];
    let tries = 0;
    (function next(){
      if (tries >= MAX_FALLBACK_TRIES) return;
      const cand = pickRandom(used);
      if (!cand) return;
      used.push(cand);
      tries++;
      window.open(cand, '_blank');
      setTimeout(next, 500);
    })();
  }, 800);
}

/* ========== Admin (Import/Export/Clear) ========= */
const adminToggle = document.getElementById('adminToggle');
const adminPanel = document.getElementById('adminPanel');
const importTextarea = document.getElementById('importLinks');
const importBtn = document.getElementById('importBtn');
const exportBtn = document.getElementById('exportBtn');
const clearBtn = document.getElementById('clearStorage');
document.getElementById('maxFallbackCount').textContent = MAX_FALLBACK_TRIES;

adminToggle.addEventListener('click', () => {
  const hidden = adminPanel.classList.contains('hidden');
  adminPanel.classList.toggle('hidden', !hidden);
  adminPanel.setAttribute('aria-hidden', hidden ? 'false' : 'true');
});

importBtn.addEventListener('click', ()=> {
  const raw = importTextarea.value.trim();
  if (!raw){ alert('Bitte Links einfügen. Je Link eine Zeile.'); return; }
  const lines = raw.split(/\r?\n/).map(l=>l.trim()).filter(Boolean);
  const ok = lines.filter(l => l.includes('keinverlag.de') && l.includes('.text'));
  if (ok.length === 0){ alert('Keine gültigen Links gefunden.'); return; }
  save('userLinks', ok);
  alert('Importiert ' + ok.length + ' Links. Bitte Seite neu laden, damit der Pool verwendet wird.');
});

exportBtn.addEventListener('click', ()=> {
  const data = { pool: (Array.isArray(userLinks) ? userLinks : VALID_LINKS), doorLinks, openedDoors };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'advent-state.json'; document.body.appendChild(a);
  a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url),2000);
});

clearBtn.addEventListener('click', ()=> {
  if (!confirm('LocalStorage löschen (Türstatus, Zuordnungen)?')) return;
  localStorage.removeItem('doorLinks'); localStorage.removeItem('openedDoors'); localStorage.removeItem('userLinks');
  alert('LocalStorage gelöscht. Seite neu laden.');
});

/* ========== Snow Canvas ========== */
(function snow(){
  const canvas = document.getElementById('snow'); if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let W = canvas.width = innerWidth, H = canvas.height = innerHeight;
  window.addEventListener('resize', ()=>{ W = canvas.width = innerWidth; H = canvas.height = innerHeight; });

  const flakes = []; const COUNT = Math.round(Math.min(260, Math.max(80, W/6)));
  for(let i=0;i<COUNT;i++) flakes.push({ x:Math.random()*W, y:Math.random()*H, r:Math.random()*2.6+0.6, speed:Math.random()*0.6+0.2, sway:Math.random()*0.02+0.002, ang:Math.random()*Math.PI*2, alpha:Math.random()*0.7+0.2 });

  function loop(){ ctx.clearRect(0,0,W,H); ctx.fillStyle='rgba(255,255,255,0.9)'; for(const f of flakes){ f.ang += f.sway; f.y += f.speed + Math.cos(f.ang)*0.2; f.x += Math.sin(f.ang)*0.4; if(f.y>H+10){ f.y=-10; f.x=Math.random()*W; } if(f.x>W+10) f.x=-10; if(f.x<-10) f.x=W+10; ctx.globalAlpha = f.alpha; ctx.beginPath(); ctx.arc(f.x,f.y,f.r,0,Math.PI*2); ctx.fill(); } ctx.globalAlpha=1; requestAnimationFrame(loop); }
  loop();
})();
