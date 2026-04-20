import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateQuadrant, scoreEightPercent, routeAutomation, topEightPercentTasks } from '../dist/core/logic.js';

test('quadrant scoring prioritizes urgent + important', () => {
  assert.equal(calculateQuadrant({ urgency: 9, impact: 8, strategic: 4, repeatability: 3 }), 'Q1-Urgent-Important');
});

test('8 percent score remains bounded', () => {
  const score = scoreEightPercent({ impact: 10, strategic: 10, effort: 1, repeatability: 1 });
  assert.ok(score <= 10 && score >= 0);
});

test('automation routing keeps highest human work', () => {
  assert.equal(routeAutomation({ repeatability: 9, effort: 2, strategic: 7, score8: 9 }), 'Keep Human');
  assert.equal(routeAutomation({ repeatability: 9, effort: 2, strategic: 7, score8: 4 }), 'Automate');
});

test('topEightPercentTasks returns at least one', () => {
  const tasks = [
    { score8: 1, archived: false },
    { score8: 4, archived: false },
    { score8: 9, archived: false }
  ];
  const result = topEightPercentTasks(tasks);
  assert.equal(result.length, 1);
  assert.equal(result[0].score8, 9);
});
