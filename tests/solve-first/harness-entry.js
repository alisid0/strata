import SolveFirstNetworks from '../../src/lib/components/assessments/SolveFirstNetworks.svelte';
const config = { id:'networks-save-the-broadcast', moduleId:'networks-cloud', pathId:'COMP_NETWORKS_SECURITY',
  track:'computer', kind:'network-routing', eyebrow:'Unmarked problem 05', title:'Save the Broadcast',
  sub:'test', rewardLabel:'Route Architect' };
window.__done = [];
window.__app = new SolveFirstNetworks({
  target: document.getElementById('app'),
  props: { config, onDone: (r)=>window.__done.push(r), onExit: ()=>{ window.__exited = true; } }
});
// helpers
window.$$ = (sel) => Array.from(document.querySelectorAll(sel));
window.btnByText = (t, sel='button') => window.$$(sel).find(b => (b.textContent||'').trim().toLowerCase().includes(t.toLowerCase()));
window.click = (el) => { if(!el) throw new Error('no element'); if(el.disabled) return 'DISABLED'; el.click(); return 'ok'; };
