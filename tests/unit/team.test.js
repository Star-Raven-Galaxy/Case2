import { describe, it, expect } from '@jest/globals';

function validateTeam(assignees) {
  const leads = assignees.filter((a) => a.role === 'lead');
  if (leads.length !== 1) {
    throw new Error('INVALID_TEAM');
  }
  return true;
}

describe('Правила бригады', () => {
  it('ровно один lead — ок', () => {
    expect(validateTeam([
      { technicianId: 'a', role: 'lead' },
      { technicianId: 'b', role: 'member' },
    ])).toBe(true);
  });

  it('нет lead — ошибка', () => {
    expect(() => validateTeam([
      { technicianId: 'a', role: 'member' },
      { technicianId: 'b', role: 'member' },
    ])).toThrow('INVALID_TEAM');
  });

  it('два lead — ошибка', () => {
    expect(() => validateTeam([
      { technicianId: 'a', role: 'lead' },
      { technicianId: 'b', role: 'lead' },
    ])).toThrow('INVALID_TEAM');
  });
});
