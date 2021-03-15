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

interface StatsState {
  hideTranslations: boolean;
}

export const statsReducer = createReducer<StatsState, StatsActions>({
  hideTranslations: false,
}).handleAction(handleStatKeypress, (state) => {
  return state;
});
