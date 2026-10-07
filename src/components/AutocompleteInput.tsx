import type { InputHTMLAttributes } from 'react';

import { Autocomplete, Box } from '@mui/material';

import { matchSuggestions } from '../lib/suggestions';
import { tokens } from '../theme/tokens';
import { TextInput } from './form';

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> & {
  value: string;
  onChange: (text: string) => void;
  options: readonly string[];
};

/** A text input that suggests previously saved values; anything new can still be typed. */
export function AutocompleteInput({ value, onChange, options, ...inputProps }: Props) {
  return (
    <Autocomplete
      freeSolo
      disableClearable
      options={options as string[]}
      inputValue={value}
      // Selecting a suggestion arrives here; a 'reset' from the component itself is ignored
      // so it can never blank the field.
      onInputChange={(_, text, reason) => {
        if (reason !== 'reset') onChange(text);
      }}
      onChange={(_, picked) => {
        if (typeof picked === 'string') onChange(picked);
      }}
      filterOptions={(opts, state) => matchSuggestions(opts, state.inputValue)}
      renderInput={(params) => (
        <Box ref={params.slotProps.input.ref}>
          <TextInput
            {...params.slotProps.htmlInput}
            {...inputProps}
            onFocus={(e) => {
              params.slotProps.htmlInput.onFocus?.(e);
              e.target.select();
            }}
          />
        </Box>
      )}
      slotProps={{
        paper: {
          sx: {
            mt: 0.5,
            backgroundColor: tokens.surface2,
            border: `1px solid ${tokens.border}`,
            color: tokens.text,
            '& .MuiAutocomplete-option': { fontSize: 15, minHeight: 44 },
          },
        },
      }}
    />
  );
}
