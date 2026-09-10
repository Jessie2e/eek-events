(() => {
  const $ = (s, c=document) => c.querySelector(s);
  const $$ = (s, c=document) => [...c.querySelectorAll(s)];

  // Reveal on scroll
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if(entry.isIntersecting){ entry.target.classList.add('in'); observer.unobserve(entry.target); }
  }), {threshold:.12});
  $$('.reveal').forEach(el => observer.observe(el));

  // Wedding prophecy / dice easter egg
  const prophecies = [
    ['Natural twenty.', 'Your weirdest idea is the one everyone remembers.'],
    ['The party chooses chaos.', 'Add the costume change. You were always going to.'],
    ['Critical success.', 'Your guests will absolutely understand the obscure reference — and the ones who don’t will still think it looks incredible.'],
    ['The quest is clear.', 'Build the wedding around what you love, not around what photographs like somebody else’s Pinterest board.'],
    ['A portal opens.', 'Somewhere between elegant and unhinged is exactly the right amount of you.'],
    ['The cleric approves.', 'Write the ceremony like real humans are getting married. Because they are.']
  ];
  const prophecy = $('#prophecy');
  $('#rollDie').addEventListener('click', () => {
    const [title,text] = prophecies[Math.floor(Math.random()*prophecies.length)];
    $('#prophecyTitle').textContent = title; $('#prophecyText').textContent = text;
    prophecy.classList.add('show');
    $('#rollDie strong').textContent = Math.ceil(Math.random()*20);
  });
  $('#closeProphecy').addEventListener('click', () => prophecy.classList.remove('show'));

  // Case study carousel controls
  const track = $('#caseTrack');
  $('#caseNext').addEventListener('click', () => track.scrollBy({left: track.clientWidth*.72, behavior:'smooth'}));
  $('#casePrev').addEventListener('click', () => track.scrollBy({left: -track.clientWidth*.72, behavior:'smooth'}));

  // Vibe Forge
  const state = {setting:'',energy:'',plot:[],stage:'',idea:''};
  const recommendations = {
    'Need an officiant':['Cleric Castleton','You have the world. Now you need the words, cues and ceremony structure that make the moment land.'],
    '~80 days out':['The One-Shot','You did the planning. EEK can step in for the final stretch, wrangle the details and hand you your wedding day back.'],
    'Halfway planned':['Co-Op Campaign','You want to keep building — just not alone. Partial planning fills the gaps without taking the story out of your hands.'],
    'Need the look':['Wedding Outfitting','The visual story is the quest. EEK can help source, tailor or build the look so it feels like you from every angle.'],
    'Blank page':['The Wedding Campaign','You have a world to build. Full planning gives EEK room to translate the references, the weird details and the logistics into one coherent experience.']
  };

  $$('.question[data-key]').forEach(q => {
    const key = q.dataset.key;
    q.querySelectorAll('.chip').forEach(btn => btn.addEventListener('click', () => {
      const multi = q.querySelector('.choices').classList.contains('multi');
      if(multi){
        btn.classList.toggle('active');
        state[key] = [...q.querySelectorAll('.chip.active')].map(x => x.textContent.trim());
      } else {
        q.querySelectorAll('.chip').forEach(x => x.classList.remove('active'));
        btn.classList.add('active'); state[key] = btn.textContent.trim();
      }
      updateForge();
    }));
  });
  $('#wildIdea').addEventListener('input', e => {state.idea=e.target.value.trim(); updateForge();});

  function updateForge(){
    const rec = recommendations[state.stage] || recommendations['Blank page'];
    $('#resultTitle').textContent = rec[0]; $('#resultCopy').textContent = rec[1];
    const brief = `WORLD: ${state.setting || 'not chosen yet'}\nENERGY: ${state.energy || 'not chosen yet'}\nPLOT TWIST: ${(state.plot && state.plot.length) ? state.plot.join(', ') : 'surprise us'}\nSTAGE: ${state.stage || 'not chosen yet'}\nWILD IDEA: ${state.idea || 'tell us everything'}\n\nEEK MATCH: ${rec[0]}`;
    $('#briefText').textContent = brief;
  }
  $('#copyBrief').addEventListener('click', async () => {
    try{ await navigator.clipboard.writeText($('#briefText').textContent); $('#copyBrief').textContent='Copied ✓'; setTimeout(()=>$('#copyBrief').textContent='Copy brief',1600); }catch(e){ alert('Select and copy the brief manually.'); }
  });
  $('#emailBrief').addEventListener('click', () => {
    const subject = encodeURIComponent('Wedding Vibe Forge — new inquiry');
    const body = encodeURIComponent('Hi EEK!\n\nHere is the wedding world we started building:\n\n' + $('#briefText').textContent + '\n\nWe would love to talk next steps.');
    window.location.href = `mailto:eek@eek.events?subject=${subject}&body=${body}`;
  });

  // Secret: click the logo 5x to open portal mode + confetti burst
  let egg = 0, eggTimer;
  $('#logoEgg').addEventListener('click', (e) => {
    egg++; clearTimeout(eggTimer); eggTimer=setTimeout(()=>egg=0,1400);
    if(egg >= 5){ e.preventDefault(); document.body.classList.toggle('portal-mode'); egg=0; burst(e.clientX || 80, e.clientY || 80); }
  });
  function burst(x,y){
    for(let i=0;i<18;i++){
      const s=document.createElement('i'); s.className='spark'; s.style.left=x+'px'; s.style.top=y+'px';
      const a=Math.random()*Math.PI*2, d=60+Math.random()*150; s.style.setProperty('--x',Math.cos(a)*d+'px'); s.style.setProperty('--y',Math.sin(a)*d+'px');
      s.style.background = i%3===0 ? 'var(--violet)' : i%2===0 ? 'var(--acid)' : 'var(--paper)'; document.body.appendChild(s); setTimeout(()=>s.remove(),950);
    }
  }
})();
