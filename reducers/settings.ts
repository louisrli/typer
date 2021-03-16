import { ActionType, createAction, createReducer } from 'typesafe-actions';

// The number of times a phrase needs to be typed correctly to move on to the
// next one.
const NUM_REQUIRED_PHRASE_ITERATIONS = 3;

const setHideTranslations = createAction(
  'SET_HIDE_TRANSLATIONS',
  (hideTranslations: boolean) => ({ hideTranslations })
)();

export const settingsActions = { setHideTranslations };

type SettingsActions = ActionType<typeof settingsActions>;

interface SettingsState {
  hideTranslations: boolean;
  numRequiredPhraseIterations: number;
}

export const settingsReducer = createReducer<SettingsState, SettingsActions>({
  hideTranslations: false,
  numRequiredPhraseIterations: NUM_REQUIRED_PHRASE_ITERATIONS,
}).handleAction(setHideTranslations, (state) => {
  return state;
});
