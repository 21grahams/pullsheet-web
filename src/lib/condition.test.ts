import { describe, expect, it } from 'vitest';
import { GRADES, formatCondition, isValidCondition, parseCondition } from './condition';

describe('parseCondition', () => {
  it('reads raw conditions', () => {
    expect(parseCondition('NM')).toEqual({ kind: 'raw', code: 'NM' });
    expect(parseCondition(' mp ')).toEqual({ kind: 'raw', code: 'MP' });
  });

  it('reads graded conditions, including half grades', () => {
    expect(parseCondition('PSA 10')).toEqual({ kind: 'graded', grader: 'PSA', grade: '10' });
    expect(parseCondition('bgs 9.5')).toEqual({ kind: 'graded', grader: 'BGS', grade: '9.5' });
    expect(parseCondition('TAG 1')).toEqual({ kind: 'graded', grader: 'TAG', grade: '1' });
  });

  it('rejects anything else', () => {
    for (const bad of [
      'this is a condition test',
      'MD',
      'PSA',
      'PSA 11',
      'PSA 9.3',
      'XYZ 10',
      'PSA 10 LABEL',
      '',
    ]) {
      expect(parseCondition(bad)).toBeNull();
    }
  });

  it('accepts every current condition in your collection', () => {
    for (const c of ['NM', 'LP', 'PSA 7', 'PSA 10']) expect(isValidCondition(c)).toBe(true);
  });
});

describe('GRADES and formatCondition', () => {
  it('runs 10 down to 1 in half steps', () => {
    expect(GRADES[0]).toBe('10');
    expect(GRADES[1]).toBe('9.5');
    expect(GRADES.at(-1)).toBe('1');
    expect(GRADES).toHaveLength(19);
  });

  it('formats back to the stored text', () => {
    expect(formatCondition({ kind: 'raw', code: 'HP' })).toBe('HP');
    expect(formatCondition({ kind: 'graded', grader: 'CGC', grade: '9.5' })).toBe('CGC 9.5');
  });
});
