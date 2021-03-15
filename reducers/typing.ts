import produce from 'immer';
import { ActionType, createAction, createReducer } from 'typesafe-actions';

export interface PhraseData {
  phrase: string;
  examples?: [string, string][];
  translations?: string[];
}

const handleGameKeypress = createAction(
  'HANDLE_GAME_KEY_PRESS',
  (pressedKey: string) => ({ pressedKey })
)();

export const typingActions = {
  handleGameKeypress,
};

type TypingActions = ActionType<typeof typingActions>;

interface TypingState {
  phrasePool: PhraseData[];
  currentPhraseIndex: number;
  currentCharIndex: number;
  isLastCharError: boolean;
}

export const typingReducer = createReducer<TypingState, TypingActions>({
  phrasePool: [],
  currentPhraseIndex: 0,
  currentCharIndex: 0,
  isLastCharError: false,
}).handleAction(handleGameKeypress, (state, action) =>
  produce(state, (draft) => {
    const currentPhraseData = state.phrasePool[state.currentPhraseIndex];
    if (!currentPhraseData) {
      return draft;
    }

    const correctChar = currentPhraseData.phrase[state.currentCharIndex];
    if (!correctChar) {
      // TODO(louisli): this should be a fatal error
      return draft;
    }

    if (action.payload.pressedKey === correctChar) {
      if (draft.currentCharIndex === currentPhraseData.phrase.length - 1) {
        draft.currentCharIndex = 0;
        draft.currentPhraseIndex++;
      } else {
        draft.currentCharIndex++;
      }
    } else {
      draft.isLastCharError = true;
    }
    return draft;
  })
);
