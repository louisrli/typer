import { ActionType, createAction, createReducer } from 'typesafe-actions';

const handleStatKeypress = createAction(
  'HANDLE_KEYPRESS_STAT',
  (key: string, phrase: string, currentCharIndex: number) => ({
    key,
    phrase,
    currentCharIndex,
  })
)();

export const statsActions = { handleStatKeypress };

type StatsActions = ActionType<typeof statsActions>;

type Counter = Map<string, number>;

interface StatsState {
  mistakesPerChar: Counter;
  mistakesPerPhrase: Counter;
  numErrorKeyPresses: number;
  numCorrectKeyPresses: number;
}

export const statsReducer = createReducer<StatsState, StatsActions>({
  mistakesPerChar: new Map<string, number>(),
  mistakesPerPhrase: new Map<string, number>(),
  numErrorKeyPresses: 0,
  numCorrectKeyPresses: 0,
}).handleAction(handleStatKeypress, (state) => {
  return state;
});
