import produce from 'immer';
import { ActionType, createAction, createReducer } from 'typesafe-actions';

// Every N keys, take a snapshot of the accuracy history.
const ACCURACY_HISTORY_FREQUENCY = 100;

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

type Counter = Record<string, number>;

interface StatsState {
  mistakesPerChar: Counter;
  mistakesPerPhrase: Counter;
  numErrorKeyPresses: number;
  numCorrectKeyPresses: number;
  // Recording every key stroke is a bit too tedious, so let's take a snapshot
  // every N keystrokes for now.
  accuracyHistory: number[];
}

const incrementCounter = (key: string, counter: Counter): void => {
  const val = counter[key];
  if (val) {
    counter[key] = val + 1;
  } else {
    counter[key] = 1;
  }
};

export const statsReducer = createReducer<StatsState, StatsActions>({
  mistakesPerChar: {},
  mistakesPerPhrase: {},
  numErrorKeyPresses: 0,
  numCorrectKeyPresses: 0,
  accuracyHistory: [],
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

    const totalKeyPresses =
      draft.numCorrectKeyPresses + draft.numErrorKeyPresses;
    if (totalKeyPresses % ACCURACY_HISTORY_FREQUENCY === 0) {
      draft.accuracyHistory.push(
        draft.numCorrectKeyPresses /
          (draft.numCorrectKeyPresses + draft.numErrorKeyPresses)
      );
    }
  })
);
