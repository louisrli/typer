import { ActionType, createAction, createReducer } from 'typesafe-actions';

const setHideTranslations = createAction(
  'SET_HIDE_TRANSLATIONS',
  (hideTranslations: boolean) => ({ hideTranslations })
)();

export const settingsActions = { setHideTranslations };

type SettingsActions = ActionType<typeof settingsActions>;

interface SettingsState {
  hideTranslations: boolean;
}

export const settingsReducer = createReducer<SettingsState, SettingsActions>({
  hideTranslations: false,
}).handleAction(setHideTranslations, (state) => {
  return state;
});
