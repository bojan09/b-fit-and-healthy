const test = require('node:test');
const assert = require('node:assert/strict');

const anatomy = require('../prototype/js/anatomy-data.js');

test('muscle records use unique stable IDs and valid views', () => {
  const ids = anatomy.muscles.map((muscle) => muscle.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.length >= 16);
  for (const muscle of anatomy.muscles) {
    assert.match(muscle.id, /^[a-z][a-z0-9-]+$/);
    assert.ok(muscle.views.some((view) => view === 'front' || view === 'back'));
  }
});

test('every muscle has complete bilingual educational content', () => {
  const fields = ['name', 'overview', 'function', 'benefits', 'training', 'commonMistake'];
  for (const muscle of anatomy.muscles) {
    for (const field of fields) {
      for (const lang of ['en', 'mk']) {
        assert.equal(typeof muscle[field][lang], 'string', `${muscle.id}.${field}.${lang}`);
        const minimum = field === 'name' ? 2 : 12;
        assert.ok(muscle[field][lang].trim().length > minimum, `${muscle.id}.${field}.${lang} is too short`);
      }
    }
  }
});

test('exercise relationships resolve to real destinations', () => {
  for (const muscle of anatomy.muscles) {
    assert.ok(muscle.exerciseIds.length > 0, `${muscle.id} needs an exercise`);
    for (const exerciseId of muscle.exerciseIds) {
      assert.ok(anatomy.exercises[exerciseId], `${muscle.id} references ${exerciseId}`);
      assert.match(anatomy.exercises[exerciseId].href, /^#\/exercise\?id=/);
    }
  }
});

test('the prototype covers the whole body on front and back views', () => {
  const allViews = new Set(anatomy.muscles.flatMap((muscle) => muscle.views));
  assert.deepEqual([...allViews].sort(), ['back', 'front']);
  for (const group of ['upper', 'core', 'hips', 'legs']) {
    assert.ok(anatomy.muscles.some((muscle) => muscle.bodyGroup === group), `missing ${group}`);
  }
});
