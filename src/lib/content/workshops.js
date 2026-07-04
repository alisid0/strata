// Workshop interaction data for the four starting points.
// Each path has checkpoints that fire after every 3rd BB.

export const LINE_WORKSHOPS = {
  // After BB 003: Segments, Rays, and Lines
  checkpoint_a: [
    {
      type: 'sorting',
      boxes: [
        { id: 'segment', label: 'Segment' },
        { id: 'ray', label: 'Ray' },
        { id: 'line', label: 'Line' }
      ],
      items: [
        { id: 'ruler', label: 'A wooden ruler', box: 'segment' },
        { id: 'laser', label: 'A laser aimed at the night sky', box: 'ray' },
        { id: 'spaghetti', label: 'A piece of dry spaghetti', box: 'segment' },
        { id: 'equator', label: 'The equator on a map', box: 'segment' },
        { id: 'euclid', label: 'A Euclidean line', box: 'line' }
      ]
    },
    {
      type: 'taperase'
    },
    {
      type: 'scenario',
      prompt: 'You turn on a flashlight in a perfectly dark room. The beam shoots out of the bulb, travels across the room, and hits the bedroom door. Did you just create a ray, or a segment?',
      options: [
        { id: 'ray', label: 'A ray. Light goes on forever.', correct: false },
        { id: 'segment', label: 'A segment. The door stopped it.', correct: true }
      ],
      correctFeedback: 'Spot on. The moment that light hits a wall, it gains a second endpoint. The physical world is full of walls.',
      incorrectFeedback: 'The door gave the beam a second endpoint. That makes it a segment.'
    }
  ],

  // After BB 006: The Number Line Playground (placeholder — build next)
  checkpoint_b: []
};

/** Get workshop interactions for a given path and checkpoint index. */
export function getLineWorkshop(checkpointIndex) {
  const keys = Object.keys(LINE_WORKSHOPS);
  if (checkpointIndex < keys.length) {
    return LINE_WORKSHOPS[keys[checkpointIndex]];
  }
  return null;
}
