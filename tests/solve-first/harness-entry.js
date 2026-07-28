import SolveFirstNetworks from '../../src/lib/components/assessments/SolveFirstNetworks.svelte';
import SolveFirstDifferentiation from '../../src/lib/components/assessments/SolveFirstDifferentiation.svelte';

const configs = {
  network: {
    id: 'networks-connect-the-computers',
    moduleId: 'networks-cloud',
    pathId: 'COMP_NETWORKS_SECURITY',
    track: 'computer',
    kind: 'network-routing',
    eyebrow: 'Unmarked problem 06',
    title: 'Connect the Computers',
    sub: 'test',
    rewardLabel: 'Network Architect'
  },
  differentiation: {
    id: 'differentiation-forecourt-flow',
    moduleId: 'differentiation',
    pathId: 'MATH_DIFF',
    track: 'mathematics',
    kind: 'fuel-rate',
    eyebrow: 'Unmarked problem 05',
    title: 'Run the Forecourt',
    sub: 'test',
    rewardLabel: 'Flow Controller'
  }
};

window.__done = [];
window.__mount = (kind = 'network') => {
  window.__app?.$destroy();
  document.getElementById('app').innerHTML = '';
  const Component = kind === 'differentiation' ? SolveFirstDifferentiation : SolveFirstNetworks;
  window.__app = new Component({
    target: document.getElementById('app'),
    props: {
      config: configs[kind],
      onDone: (result) => window.__done.push(result),
      onExit: () => { window.__exited = true; }
    }
  });
};

window.__mount('network');
window.$$ = (selector) => Array.from(document.querySelectorAll(selector));
window.btnByText = (text, selector = 'button') =>
  window.$$(selector).find((button) => (button.textContent || '').trim().toLowerCase().includes(text.toLowerCase()));
window.click = (element) => {
  if (!element) throw new Error('no element');
  if (element.disabled) return 'DISABLED';
  element.click();
  return 'ok';
};
