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

  // Proof picker — one large image, no second carousel
  const proofImage = $('#proofImage');
  const proofCaption = $('#proofCaption');
  $$('.proof-pick').forEach(btn => btn.addEventListener('click', () => {
    $$('.proof-pick').forEach(x => x.classList.remove('active'));
    btn.classList.add('active');
    if(proofImage){
      proofImage.classList.add('swapping');
      setTimeout(() => {
        proofImage.src = btn.dataset.proofSrc;
        proofImage.alt = btn.dataset.proofAlt || '';
        proofImage.style.objectPosition = btn.dataset.proofPosition || 'center center';
        proofCaption.textContent = btn.dataset.proofLabel || '';
        proofImage.classList.remove('swapping');
      }, 140);
    }
  }));

  // Archive teaser image selector — one clear image at a time
  const archivePreviewImage = $('#archivePreviewImage');
  const archivePreviewCaption = $('#archivePreviewCaption');
  $$('.archive-thumb').forEach(btn => btn.addEventListener('click', () => {
    $$('.archive-thumb').forEach(x => x.classList.remove('active'));
    btn.classList.add('active');
    if(archivePreviewImage){
      archivePreviewImage.classList.add('swapping');
      setTimeout(() => {
        archivePreviewImage.src = btn.dataset.archiveSrc;
        archivePreviewImage.alt = btn.dataset.archiveAlt || '';
        if(archivePreviewCaption) archivePreviewCaption.textContent = btn.dataset.archiveLabel || '';
        archivePreviewImage.classList.remove('swapping');
      }, 130);
    }
  }));

  // Vibe Forge — guided four-step campaign matcher
  const forgeState = {eventType:'', setting:'', energy:'', stage:''};
  let forgeStep = 0;

  const worldOptions = {
    'Wedding':['Castle + candlelight','Forest + folklore','Industrial + strange','Backyard + intimate','Cosmic + maximalist'],
    'Corporate + Brand':['Gallery + editorial','Immersive world','Polished + cinematic','Playful + interactive','Unexpected venue'],
    'Pride + Community':['Joyful + expansive','Protest + pageantry','Community + cozy','Nightlife + neon','Art + activation'],
    'Party + Milestone':['Dinner + drama','Backyard + intimate','Dance floor + maximalist','Theme turned all the way up','Elegant + strange'],
    'Something Else Entirely':['Site-specific + surprising','Performance + participatory','Intimate + unusual','Big + theatrical','You tell us']
  };

  const weddingSupport = [
    ['Just the ceremony / officiant','Cleric Castleton'],
    ['I planned it — run the day','The One-Shot'],
    ['Help me finish the plan','Co-Op Campaign'],
    ['Start with me from scratch','The Wedding Campaign'],
    ['I need the look','Wedding Outfitting']
  ];
  const customSupport = [
    ['Run the day','Custom Event Campaign'],
    ['Help me shape the plan','Custom Event Campaign'],
    ['Build it with me from scratch','Custom Event Campaign'],
    ['I need the visual world','Custom Event Campaign'],
    ['It’s complicated — in a good way','Custom Event Campaign']
  ];

  const serviceDetails = {
    'Cleric Castleton':{price:'$250',copy:'You have the world. EEK handles the words, cues and ceremony structure so the moment lands without feeling generic.'},
    'The One-Shot':{price:'$3,000',copy:'You did the planning. EEK steps in for the final stretch, wrangles the details and hands you your wedding day back.'},
    'Co-Op Campaign':{price:'$5,000',copy:'You want to keep building — just not alone. Partial planning fills the gaps without taking the story out of your hands.'},
    'The Wedding Campaign':{price:'$8,000',copy:'You have a world to build. Full planning gives EEK room to translate the references, weird details and logistics into one coherent experience.'},
    'Wedding Outfitting':{price:'Variable',copy:'The visual story is the quest. EEK helps source, tailor or build the look so it feels like you from every angle.'},
    'Custom Event Campaign':{price:'Custom',copy:'Your event does not belong in a wedding-planning dropdown. EEK shapes the concept, logistics, vendors, design and execution around what the event actually needs.'}
  };

  const forgeSteps = $$('.forge-step');
  const worldChoices = $('#worldChoices');
  const supportChoices = $('#supportChoices');

  function makeChoiceButton(label, value=label, service=''){
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chip';
    btn.textContent = label;
    btn.dataset.value = value;
    if(service) btn.dataset.service = service;
    return btn;
  }

  function renderWorldChoices(){
    worldChoices.innerHTML = '';
    (worldOptions[forgeState.eventType] || worldOptions['Something Else Entirely']).forEach(label => worldChoices.appendChild(makeChoiceButton(label)));
    bindStepChoices(forgeSteps[1]);
  }

  function renderSupportChoices(){
    supportChoices.innerHTML = '';
    const options = forgeState.eventType === 'Wedding' ? weddingSupport : customSupport;
    options.forEach(([label,service]) => supportChoices.appendChild(makeChoiceButton(label,label,service)));
    bindStepChoices(forgeSteps[3]);
  }

  function bindStepChoices(stepEl){
    stepEl.querySelectorAll('.chip').forEach(btn => {
      if(btn.dataset.bound) return;
      btn.dataset.bound = 'true';
      btn.addEventListener('click', () => {
        const key = stepEl.dataset.key;
        stepEl.querySelectorAll('.chip').forEach(x => x.classList.remove('active'));
        btn.classList.add('active');
        forgeState[key] = btn.dataset.value || btn.textContent.trim();

        if(key === 'eventType'){
          forgeState.setting = '';
          forgeState.stage = '';
          renderWorldChoices();
          renderSupportChoices();
        }

        updateForgeReadout();
        if(forgeStep < forgeSteps.length - 1){
          window.setTimeout(() => goToForgeStep(forgeStep + 1), 230);
        } else {
          finishForge(btn.dataset.service || getServiceName());
        }
      });
    });
  }

  function goToForgeStep(next){
    forgeStep = Math.max(0, Math.min(next, forgeSteps.length - 1));
    forgeSteps.forEach((step,i) => step.classList.toggle('active', i === forgeStep));
    $('#forgeStepCount').textContent = `${forgeStep + 1} of ${forgeSteps.length}`;
    $('#forgeProgressBar').style.width = `${((forgeStep + 1) / forgeSteps.length) * 100}%`;
    $('#forgeBack').disabled = forgeStep === 0;
    $('#forgeHint').textContent = forgeStep === forgeSteps.length - 1 ? 'Choose the closest fit' : 'Choose one to continue';
  }

  function getServiceName(){
    if(!forgeState.stage) return '';
    if(forgeState.eventType !== 'Wedding') return 'Custom Event Campaign';
    const match = weddingSupport.find(([label]) => label === forgeState.stage);
    return match ? match[1] : 'The Wedding Campaign';
  }

  function updateForgeReadout(){
    $('#resultEvent').textContent = forgeState.eventType || 'Not chosen yet';
    $('#resultWorld').textContent = forgeState.setting || 'Not chosen yet';
    $('#resultEnergy').textContent = forgeState.energy || 'Not chosen yet';
    $('#resultSupport').textContent = forgeState.stage || 'Not chosen yet';

    const selections = [forgeState.eventType, forgeState.setting, forgeState.energy, forgeState.stage].filter(Boolean).length;
    if(selections < 4){
      $('#resultEyebrow').textContent = 'Your campaign readout';
      $('#resultTitle').textContent = selections ? 'Taking shape…' : 'Your Campaign';
      $('#resultCopy').textContent = selections ? 'Good. Keep going — the Forge is narrowing the world and the kind of backup that fits it.' : 'Make four quick choices. EEK will recommend the service tier that fits, show its starting price, and turn your answers into a campaign brief.';
      $('#resultMatch').hidden = true;
      $('#resultActions').hidden = true;
      $('#forgeMatchNote').hidden = true;
      $$('.forge-service-card').forEach(card => card.classList.remove('recommended'));
    }
  }

  function finishForge(serviceName){
    const detail = serviceDetails[serviceName] || serviceDetails['Custom Event Campaign'];
    $('#resultEyebrow').textContent = 'Your best fit';
    $('#resultTitle').textContent = serviceName;
    $('#resultCopy').textContent = `${forgeState.eventType} · ${forgeState.setting} · ${forgeState.energy}`;
    $('#matchService').textContent = serviceName;
    $('#matchPrice').textContent = detail.price;
    $('#matchReason').textContent = detail.copy;
    $('#resultMatch').hidden = false;
    $('#resultActions').hidden = false;
    $('#forgeMatchNote').hidden = false;

    $$('.forge-service-card').forEach(card => card.classList.toggle('recommended', card.dataset.service === serviceName));

    const brief = `EVENT: ${forgeState.eventType}\nWORLD: ${forgeState.setting}\nENERGY: ${forgeState.energy}\nBACKUP: ${forgeState.stage}\n\nEEK MATCH: ${serviceName} — ${detail.price}`;
    $('#briefText').textContent = brief;

    if(window.matchMedia('(max-width: 1000px)').matches){
      window.setTimeout(() => $('#forgeResult').scrollIntoView({behavior:'smooth',block:'start'}), 260);
    }
  }

  const forgeServiceMenu = $('#forgeServiceMenu');
  if(forgeServiceMenu && window.matchMedia('(max-width: 720px)').matches){
    forgeServiceMenu.removeAttribute('open');
  }

  forgeSteps.forEach(bindStepChoices);
  renderWorldChoices();
  renderSupportChoices();
  goToForgeStep(0);
  updateForgeReadout();

  $('#forgeBack').addEventListener('click', () => {
    if(forgeStep > 0) goToForgeStep(forgeStep - 1);
  });

  $('#copyBrief').addEventListener('click', async () => {
    try{ await navigator.clipboard.writeText($('#briefText').textContent); $('#copyBrief').textContent='Copied ✓'; setTimeout(()=>$('#copyBrief').textContent='Copy campaign',1600); }catch(e){ alert('Select and copy the campaign manually.'); }
  });
  $('#emailBrief').addEventListener('click', () => {
    const subject = encodeURIComponent('Event Vibe Forge — new inquiry');
    const body = encodeURIComponent('Hi EEK!\n\nHere is the campaign I forged on your site:\n\n' + $('#briefText').textContent + '\n\nI would love to talk next steps.');
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
