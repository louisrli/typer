import produce from 'immer';
import { ActionType, createAction, createReducer } from 'typesafe-actions';

// Not sure if there's a better way. We don't want things like alt-tabbing etc
// to be counted.
const IGNORED_KEYS = new Set([
  'Alt',
  'Meta',
  'Tab',
  'Control',
  'Insert',
  'Home',
  'Backspace',
  'Delete',
  'PageUp',
  'PageDown',
  'ContextMenu',
  'CapsLock',
]);

export interface PhraseData {
  phrase: string;
  examples?: [string, string][];
  definitions?: string[];
}

const setPhrasePool = createAction(
  'SET_PHRASE_POOL',
  (phrasePool: PhraseData[]) => ({ phrasePool })
)();

const handleGameKeypress = createAction(
  'HANDLE_GAME_KEY_PRESS',
  // JS "key" field.
  (pressedKey: string) => ({ pressedKey })
)();

export const typingActions = {
  handleGameKeypress,
  setPhrasePool,
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
      phrase: 'да',
      examples: [
        ['example0 foo bar', 'translation0 foo bar'],
        [
          'example0 foo bar longer sentence maybe',
          'translation0 foo bar ya ya biatches',
        ],
      ],
      definitions: ['i am a definition'],
    },
  ],
  currentPhraseIndex: 0,
  currentPhraseIteration: 0,
  currentCharIndex: 0,
  isLastKeyError: false,
  hasErrorOnCurrentPhrase: false,
})
  .handleAction(handleGameKeypress, (state, action) =>
    produce(state, (draft) => {
      if (IGNORED_KEYS.has(action.payload.pressedKey)) {
        return;
      }

      const currentPhraseData = state.phrasePool[state.currentPhraseIndex];
      if (!currentPhraseData) {
        return;
      }

      const correctChar = currentPhraseData.phrase[state.currentCharIndex];
      if (!correctChar) {
        // TODO(louisli): this should be a fatal error
        return;
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
    })
  )
  .handleAction(setPhrasePool, (state, action) =>
    produce(state, (draft) => {
      draft.phrasePool = action.payload.phrasePool;
    })
  );
