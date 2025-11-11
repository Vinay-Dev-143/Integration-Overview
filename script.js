const sectionsData = [
  {
    key: 'snaplogic',
    name: 'Snaplogic',
    colorClass: 'section--blue',
    servers: ['Server 1','Server 2','Server 3','Server 5','Server 6','Server 4','Server 2','Server 8']
  },
  {
    key: 'ace',
    name: 'ACE',
    colorClass: 'section--orange',
    servers: ['Server 1','Server 3','Server 7','Server 4','Server 6','Server 4','Server 6']
  },
  {
    key: 'redis',
    name: 'Redis',
    colorClass: 'section--purple',
    servers: ['Server 7','Server 2','Server 2','Server 3','Server 3','Server 3','Server 6']
  }
];

function shuffle(arr){
  const a = [...arr];
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

function refreshAll(){
  sectionsData.forEach(s => s.servers = shuffle(s.servers));
  render();
  setLastRefreshed(new Date());
}

function render(){
  const root = document.getElementById('sections');
  root.innerHTML = '';

  sectionsData.forEach(sec => {
    const card = document.createElement('section');
    card.className = `section-card ${sec.colorClass}`;

    const header = document.createElement('div');
    header.className = 'section-header';
    header.innerHTML = `
      <div>${sec.name}</div>
      <div class="spacer"></div>
      <button class="icon-btn" title="Refresh section" data-key="${sec.key}">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path fill="currentColor" d="M12 6V3L8 7l4 4V8c2.76 0 5 2.24 5 5a5 5 0 0 1-9.58 2h-2.2A7 7 0 0 0 19 13c0-3.87-3.13-7-7-7Z" />
        </svg>
      </button>`;

    const body = document.createElement('div');
    body.className = 'section-body';

    const pipeline = document.createElement('div');
    pipeline.className = 'pipeline';

    const nodes = document.createElement('div');
    nodes.className = 'nodes';

    sec.servers.forEach(name => {
      const node = document.createElement('div');
      node.className = 'node';
      node.innerHTML = `<div class="hex"></div><div class="label">${name}</div>`;
      nodes.appendChild(node);
    });

    pipeline.appendChild(nodes);
    body.appendChild(pipeline);

    card.appendChild(header);
    card.appendChild(body);

    root.appendChild(card);
  });

  // Wire per-section refreshes
  document.querySelectorAll('.section-header .icon-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-key');
      const sec = sectionsData.find(s => s.key === key);
      sec.servers = shuffle(sec.servers);
      render();
    });
  });
}

// Global refresh
const refreshAllBtn = document.getElementById('refresh-all');
refreshAllBtn.addEventListener('click', () => {
  refreshAll();
});

// Initial render
render();
setLastRefreshed(new Date());

// Auto refresh every 5 minutes
setInterval(() => {
  refreshAll();
}, 300000);

function setLastRefreshed(date){
  const el = document.getElementById('last-ref');
  if(!el) return;
  const opts = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
  const time = date.toLocaleTimeString([], opts);
  el.textContent = `Last refreshed: ${time}`;
}
