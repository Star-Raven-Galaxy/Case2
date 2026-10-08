import { describe, it, expect } from '@jest/globals';

const ALLOWED_TRANSITIONS = {
  new: ['in_progress', 'rejected'],
  in_progress: ['done', 'rejected'],
  done: [],
  rejected: [],
};

describe('Переходы статусов заявки', () => {
  it('new → in_progress разрешён', () => {
    expect(ALLOWED_TRANSITIONS.new).toContain('in_progress');
  });

  it('new → done запрещён', () => {
    expect(ALLOWED_TRANSITIONS.new).not.toContain('done');
  });

  it('in_progress → done разрешён', () => {
    expect(ALLOWED_TRANSITIONS.in_progress).toContain('done');
  });

  it('из done переходов нет', () => {
    expect(ALLOWED_TRANSITIONS.done).toEqual([]);
  });

  it('из rejected переходов нет', () => {
    expect(ALLOWED_TRANSITIONS.rejected).toEqual([]);
  });
});
