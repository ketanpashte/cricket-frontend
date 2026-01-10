export interface ScoringEventOption {
  label: string;
  value: string;
  description?: string;
  shortcut?: string; // NEW FIELD
}
export const RUNS: ScoringEventOption[] = [
  { label: 'Dot', value: '.', shortcut: '0' },
  { label: 'Single', value: '1', shortcut: '1' },
  { label: 'Double', value: '2', shortcut: '2' },
  { label: 'Triple', value: '3', shortcut: '3' },
];

export const BOUNDARIES: ScoringEventOption[] = [
  { label: 'Four', value: '4', shortcut: '4', description: 'Boundary four' },
  { label: 'Six', value: '6', shortcut: '6', description: 'Boundary six' },
];

export const WIDES: ScoringEventOption[] = [
  { label: 'Wd + 1', value: '1w', shortcut: 'W' },
  { label: 'Wd + 2', value: '2w' },
  { label: 'Wd + 3', value: '3w' },
  { label: 'Wd + 4', value: '4w' },
];

export const BYES: ScoringEventOption[] = [
  { label: '1 Bye', value: '1b', shortcut: 'B' },
  { label: '2 Byes', value: '2b' },
  { label: '3 Byes', value: '3b' },
  { label: '4 Byes', value: '4b' },
];

export const LEG_BYES: ScoringEventOption[] = [
  { label: '1 LB', value: '1lb', shortcut: 'L' },
  { label: '2 LB', value: '2lb' },
  { label: '3 LB', value: '3lb' },
  { label: '4 LB', value: '4lb' },
];

export const NO_BALLS: ScoringEventOption[] = [
  { label: 'NB', value: '1nb', shortcut: 'N' },
  { label: '1+ NB', value: '2nb' },
  { label: '2+ NB', value: '3nb' },
  { label: '3+ NB', value: '4nb' },
  { label: '4+ NB', value: '5nb' },
  { label: '6+ NB', value: '7nb' },
];

export const WICKETS: ScoringEventOption[] = [
  { label: 'W', value: 'W', shortcut: 'K' },
  { label: '1 + W', value: '1W' },
  { label: '2 + W', value: '2W' },
  { label: '3 + W', value: '3W' },
  { label: '4 + W', value: '4W' },
];
