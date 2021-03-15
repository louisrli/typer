import { ActionType, createAction, createReducer } from 'typesafe-actions';

export const setHideTranslations = createAction(
  'SET_HIDE_TRANSLATIONS',
  (hideTranslations: boolean) => ({ hideTranslations })
)();

const actions = { setHideTranslations };

type SettingsActions = ActionType<typeof actions>;

interface SettingsState {
  hideTranslations: boolean;
}

export const settingsReducer = createReducer<SettingsState, SettingsActions>({
  hideTranslations: false,
}).handleAction(setHideTranslations, (state) => {
  return state;
});
