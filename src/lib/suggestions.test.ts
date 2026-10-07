import { describe, expect, it } from 'vitest';

import { matchSuggestions, suggestionList } from './suggestions';

describe('suggestionList', () => {
  it('drops blanks and case/space duplicates, sorted A–Z', () => {
    expect(suggestionList(['Mew', ' mew ', 'Charizard  ex', 'charizard ex', '', 'Articuno'])).toEqual([
      'Articuno',
      'Charizard ex',
      'Mew',
    ]);
  });
});

describe('matchSuggestions', () => {
  const options = ['Charizard ex', 'Charmander', 'Mew', 'Mewtwo'];
  it('matches anywhere in the name, ignoring case', () => {
    expect(matchSuggestions(options, 'CHAR')).toEqual(['Charizard ex', 'Charmander']);
    expect(matchSuggestions(options, 'two')).toEqual(['Mewtwo']);
  });
  it('shows nothing until something is typed, and hides an exact match', () => {
    expect(matchSuggestions(options, '  ')).toEqual([]);
    expect(matchSuggestions(options, 'mew')).toEqual(['Mewtwo']);
  });
  it('caps the list', () => {
    expect(matchSuggestions(options, 'm', 2)).toHaveLength(2);
  });
});
