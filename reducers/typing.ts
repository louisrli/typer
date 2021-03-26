import produce from 'immer';
import invariant from 'ts-invariant';
import { ActionType, createAction, createReducer } from 'typesafe-actions';

type CorpusKey = string;

export interface PhraseData {
  phrase: string;
  examples?: [string, string][];
  definitions?: string[];
}

const setPhrasePool = createAction(
  'SET_PHRASE_POOL',
  (phrasePool: PhraseData[]) => ({ phrasePool })
)();

const skipPhrase = createAction('SKIP_PHRASE')();

const initializeCorpusProgress = createAction(
  'INITIALIZE_CORPUS_PROGRESS',
  (corpusKey: CorpusKey, phraseData?: PhraseData[]) => ({
    corpusKey,
    phraseData,
  })
)();

const setCurrentCorpus = createAction(
  'SET_CURRENT_CORPUS',
  (corpusKey: CorpusKey) => ({ corpusKey })
)();

const handleGameKeypress = createAction(
  'HANDLE_GAME_KEY_PRESS',
  // JS "key" field.
  (pressedKey: string, numRequiredPhraseIterations: number) => ({ pressedKey }),
  (pressedKey: string, numRequiredPhraseIterations: number) => ({
    numRequiredPhraseIterations,
  })
)();

export const typingActions = {
  handleGameKeypress,
  setPhrasePool,
  skipPhrase,
  setCurrentCorpus,
  initializeCorpusProgress,
};

type TypingActions = ActionType<typeof typingActions>;

interface CorpusTypingProgress {
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

/**
 * Similar to CorpusTypingProgress but only the information needed to render.
 */
interface CorpusRenderInfo {
  // Empty when finished.
  phraseData: PhraseData | null;
  currentCharIndex: number;
  currentPhraseIteration: number;
}

/**
 * Selector for getting corpus render info.
 */
export const getRenderInfo = (corpusKey: CorpusKey) => (
  state: TypingState
): CorpusRenderInfo | null => {
  const progress = state.progresses[corpusKey];
  invariant(progress);
  return {
    phraseData: progress.phrasePool[progress.currentPhraseIndex] || null,
    currentCharIndex: progress.currentCharIndex,
    currentPhraseIteration: progress.currentPhraseIteration,
  };
};

interface TypingState {
  progresses: Record<CorpusKey, CorpusTypingProgress>;
  // Just to be lazy about passing it to every action, set it as a state. Could
  // be dangerous -- consider revisiting later.
  currentCorpusKey: string | null;
}

const getProgress = (state: TypingState): CorpusTypingProgress => {
  invariant(state.currentCorpusKey, 'Tried to update with no corpus key set.');
  invariant(
    state.progresses[state.currentCorpusKey!],
    'Tried to update nonexisting corpus'
  );
  return state.progresses[state.currentCorpusKey!];
};

export const typingReducer = createReducer<TypingState, TypingActions>({
  progresses: {},
  currentCorpusKey: null,
})
  .handleAction(initializeCorpusProgress, (state, action) =>
    produce(state, (draft) => {
      draft.progresses[action.payload.corpusKey] = {
        phrasePool: action.payload.phraseData || [],
        currentPhraseIndex: 0,
        currentPhraseIteration: 0,
        currentCharIndex: 0,
        isLastKeyError: false,
        hasErrorOnCurrentPhrase: false,
      };
    })
  )
  .handleAction(handleGameKeypress, (state, action) =>
    produce(state, (draft) => {
      const draftProgress = getProgress(draft);
      const currentPhraseData =
        draftProgress.phrasePool[draftProgress.currentPhraseIndex];
      if (!currentPhraseData) {
        return;
      }

      const correctChar =
        currentPhraseData.phrase[draftProgress.currentCharIndex];
      if (!correctChar) {
        // TODO(louisli): this should be a fatal error
        return;
      }

      const isCorrectKey = action.payload.pressedKey === correctChar;
      draftProgress.isLastKeyError = !isCorrectKey;
      if (isCorrectKey) {
        const isOnLastCharacter =
          draftProgress.currentCharIndex ===
          currentPhraseData.phrase.length - 1;
        if (isOnLastCharacter) {
          draftProgress.currentCharIndex = 0;

          draftProgress.currentPhraseIteration++;
          if (
            draftProgress.currentPhraseIteration ===
            action.meta.numRequiredPhraseIterations
          ) {
            // Move onto the next phrase.
            draftProgress.currentPhraseIteration = 0;
            draftProgress.currentPhraseIndex++;
          }
          // Implicit fallthrough branch -- stay on current phrase.
        } else {
          draftProgress.currentCharIndex++;
        }
      }
    })
  )
  .handleAction(setPhrasePool, (state, action) =>
    produce(state, (draft) => {
      const draftProgress = getProgress(draft);
      draftProgress.phrasePool = action.payload.phrasePool;
    })
  )
  .handleAction(skipPhrase, (state) =>
    produce(state, (draft) => {
      const draftProgress = getProgress(draft);
      draftProgress.currentPhraseIteration = 0;
      draftProgress.currentPhraseIndex++;
      draftProgress.currentCharIndex = 0;
    })
  )
  .handleAction(setCurrentCorpus, (state, action) =>
    produce(state, (draft) => {
      draft.currentCorpusKey = action.payload.corpusKey;
    })
  );
