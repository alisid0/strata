/**
 * observations.js — museum-style “what to observe” booklet for self-study.
 *
 * Numbered entries match the on-view callouts (①–④) and HUD readouts. No
 * questions, no completion state — students read and watch the numbers.
 */

/** Shared steps 1–5: Newton II and friction (both lessons). */
export const CORE_OBSERVATIONS = [
  {
    num: 1,
    title: 'Net force and acceleration',
    body: 'Newton\'s second law: the net horizontal force on the car determines its acceleration. '
      + 'The relationship is F<sub>net</sub> = m·a, so a = F<sub>net</sub> / m. '
      + 'Compare the net force and acceleration readouts in the telemetry panel. '
      + 'The verification line below shows both sides of the equation using the current simulation values.',
    refs: ['observe-fnet', 'observe-accel', 'observe-verify']
  },
  {
    num: 2,
    title: 'Driving force at the tyre',
    body: 'The engine delivers a driving force at the contact patch. This force appears in the traction gauge as demand. '
      + 'It is not independent of friction: the road can only push back up to the grip limit.',
    refs: ['observe-demand', 'observe-grip']
  },
  {
    num: 3,
    title: 'Normal force and the friction limit',
    body: 'The limiting (static) friction force is proportional to the normal force at the tyre: '
      + 'F<sub>max</sub> = μ<sub>s</sub>·N. '
      + 'Watch the rear axle load N and the grip ceiling μ<sub>s</sub>·N in the traction panel. '
      + 'Under acceleration, load transfers to the rear axle and raises the grip limit.',
    refs: ['observe-n', 'observe-grip']
  },
  {
    num: 4,
    title: 'When demand exceeds the grip limit',
    body: 'If the demanded driving force exceeds μ<sub>s</sub>·N, the tyre slides. '
      + 'Kinetic friction μ<sub>k</sub>·N then applies, with μ<sub>k</sub> &lt; μ<sub>s</sub>. '
      + 'The status readout changes when the tyre is gripping versus sliding.',
    refs: ['observe-grip', 'observe-slip']
  },
  {
    num: 5,
    title: 'Surface and the coefficient μ',
    body: 'The road surface sets μ<sub>s</sub> and μ<sub>k</sub>. '
      + 'The same throttle input produces different acceleration on dry tarmac, wet tarmac, gravel, or ice. '
      + 'Change the surface selector and observe how N, the grip limit, and a respond.',
    refs: ['observe-surface', 'observe-grip']
  }
];

/** Step 6 — shown when the braking lesson is selected. */
export const BRAKING_OBSERVATION = {
  num: 6,
  title: 'Braking and stopping distance',
  body: 'Braking applies a force opposite to the direction of motion. '
    + 'Deceleration again follows F<sub>net</sub> / m, with F<sub>net</sub> negative while slowing. '
    + 'The ideal stopping distance from speed v is d = v² / (2μg), assuming all tyres remain at the friction limit. '
    + 'Compare the live speed, brake force, and stopping-distance estimate while braking.',
  refs: ['observe-brake', 'observe-stop-dist', 'observe-verify']
};

export class ObservationBooklet {
  constructor(root) {
    this.root = root;
    this.lessonKey = 'friction';
    this.render();
  }

  setLesson(key) {
    this.lessonKey = key;
    this.render();
  }

  items() {
    const list = [...CORE_OBSERVATIONS];
    if (this.lessonKey === 'brakes') list.push(BRAKING_OBSERVATION);
    return list;
  }

  render() {
    const items = this.items();
    this.root.innerHTML = `
      <h3>What to observe</h3>
      <p class="booklet-intro">Read in order. Each step names a quantity to watch in the panels below and on the view.</p>
      <ol class="booklet-list">
        ${items.map((item) => `
          <li class="booklet-item" data-refs="${item.refs.join(' ')}">
            <span class="booklet-num">${item.num}</span>
            <div class="booklet-text">
              <strong>${item.title}</strong>
              <p>${item.body}</p>
            </div>
          </li>`).join('')}
      </ol>`;

    this.root.querySelectorAll('.booklet-item').forEach((el) => {
      el.addEventListener('mouseenter', () => this.highlightRefs(el.dataset.refs.split(' ')));
      el.addEventListener('mouseleave', () => this.clearHighlight());
    });
  }

  highlightRefs(ids) {
    document.querySelectorAll('[data-observe]').forEach((el) => {
      el.classList.toggle('observe-highlight', ids.includes(el.id));
    });
    document.querySelectorAll('.callout').forEach((el) => {
      el.classList.toggle('callout-active', ids.includes(el.dataset.ref));
    });
  }

  clearHighlight() {
    document.querySelectorAll('.observe-highlight').forEach((el) => el.classList.remove('observe-highlight'));
    document.querySelectorAll('.callout-active').forEach((el) => el.classList.remove('callout-active'));
  }
}
