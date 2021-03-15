import { combineReducers, createStore } from 'redux';
import { MakeStore, createWrapper, Context, HYDRATE } from 'next-redux-wrapper';
import { Action, StateType } from 'typesafe-actions';

export interface State {
  tick: string;
}

const rootReducer = combineReducers({
  typing: typingReducer,
  settings: settingsReducer,
  stats: statsReducer,
});

export type RootState = StateType<typeof rootReducer>;

const reducer = (state: RootState, action) => {
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
