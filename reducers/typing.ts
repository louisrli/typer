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

// The number of times a phrase needs to be typed correctly to move on to the
// next one.
const NUM_CORRECT_PHRASE_ITERATIONS = 3;

interface TypingState {
  phrasePool: PhraseData[];
  // The current index of the phrase in phrase pool.
  currentPhraseIndex: number;
  // Each phrase needs to be done NUM_CORRECT_PHRASE_ITERATIONS times.
  currentPhraseIteration: number;
  // The current index of the character within the given phrase.
  currentCharIndex: number;
  // If the user made an error in the last key type.
  isLastKeyError: boolean;
  hasErrorOnCurrentPhrase: boolean;
}

export const typingReducer = createReducer<TypingState, TypingActions>({
  phrasePool: [
    {
      phrase: 'foo',
      examples: [['example0 foo bar', 'translation0 foo bar']],
      translations: ['i am a definition'],
    },
  ],
  currentPhraseIndex: 0,
  currentPhraseIteration: 0,
  currentCharIndex: 0,
  isLastKeyError: false,
  hasErrorOnCurrentPhrase: false,
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

    const isCorrectKey = action.payload.pressedKey === correctChar;
    draft.isLastKeyError = !isCorrectKey;
    if (isCorrectKey) {
      const isOnLastCharacter =
        draft.currentCharIndex === currentPhraseData.phrase.length - 1;
      if (isOnLastCharacter) {
        draft.currentCharIndex = 0;

        draft.currentPhraseIteration++;
        if (draft.currentPhraseIteration === NUM_CORRECT_PHRASE_ITERATIONS) {
          // Move onto the next phrase.
          draft.currentPhraseIteration = 0;
          draft.currentPhraseIndex++;
        }
        // Implicit fallthrough branch -- stay on current phrase.
      } else {
        draft.currentCharIndex++;
      }
    }
    return draft;
  })
);
