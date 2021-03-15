import { ActionType, createAction, createReducer } from 'typesafe-actions';

export const handleKeypressStat = createAction(
  'HANDLE_KEYPRESS_STAT',
  (key: string, phrase: string, currentCharIndex: number) => ({
    key,
    phrase,
    currentCharIndex,
  })
)();

const actions = { handleKeypressStat };

type StatsActions = ActionType<typeof actions>;

interface StatsState {
  hideTranslations: boolean;
}

export const statsReducer = createReducer<StatsState, StatsActions>({
  hideTranslations: false,
}).handleAction(handleKeypressStat, (state) => {
  return state;
});
