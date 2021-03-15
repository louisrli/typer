import { ActionType, createAction, createReducer } from 'typesafe-actions';

export const handleStatKeypress = createAction(
  'HANDLE_KEYPRESS_STAT',
  (key: string, phrase: string, currentCharIndex: number) => ({
    key,
    phrase,
    currentCharIndex,
  })
)();

const actions = { handleStatKeypress };

type StatsActions = ActionType<typeof actions>;

interface StatsState {
  hideTranslations: boolean;
}

export const statsReducer = createReducer<StatsState, StatsActions>({
  hideTranslations: false,
}).handleAction(handleStatKeypress, (state) => {
  return state;
});
