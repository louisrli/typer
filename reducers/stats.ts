import produce from 'immer';
import { ActionType, createAction, createReducer } from 'typesafe-actions';

const handleStatKeypress = createAction(
  'HANDLE_KEYPRESS_STAT',
  (pressedKey: string, phrase: string, currentCharIndex: number) => ({
    pressedKey,
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

const incrementCounter = (key: string, counter: Counter): void => {
  const val = counter.get(key);
  if (val) {
    counter.set(key, val + 1);
  } else {
    counter.set(key, 1);
  }
};

export const statsReducer = createReducer<StatsState, StatsActions>({
  mistakesPerChar: new Map<string, number>(),
  mistakesPerPhrase: new Map<string, number>(),
  numErrorKeyPresses: 0,
  numCorrectKeyPresses: 0,
}).handleAction(handleStatKeypress, (state, action) =>
  produce(state, (draft) => {
    const correctChar = action.payload.phrase[action.payload.currentCharIndex];
    const isCorrect = action.payload.pressedKey === correctChar;
    if (isCorrect) {
      draft.numCorrectKeyPresses++;
    } else {
      draft.numErrorKeyPresses++;
      incrementCounter(correctChar, draft.mistakesPerChar);
      incrementCounter(action.payload.phrase, draft.mistakesPerPhrase);
    }
  })
);
