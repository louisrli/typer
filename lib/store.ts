import { combineReducers, createStore } from 'redux';
import { MakeStore, createWrapper, Context, HYDRATE } from 'next-redux-wrapper';
import { StateType } from 'typesafe-actions';
import { typingReducer } from '../reducers/typing';
import { statsReducer } from '../reducers/stats';
import { settingsReducer } from '../reducers/settings';

const rootReducer = combineReducers({
  typing: typingReducer,
  settings: settingsReducer,
  stats: statsReducer,
});

export type RootState = StateType<typeof rootReducer>;

const reducer = (
  state: RootState,
  action: any
): ReturnType<typeof rootReducer> => {
  // Copied this from documentation for redux next wrapper.
  if (action.type === HYDRATE) {
    const nextState = {
      ...state, // use previous state
      ...action.payload, // apply delta from hydration
    };
    return nextState;
  }
  return rootReducer(state, action);
};

// create a makeStore function
const makeStore: MakeStore<RootState> = (context: Context) =>
  createStore(reducer);

// export an assembled wrapper
export const wrapper = createWrapper<RootState>(makeStore, { debug: true });
