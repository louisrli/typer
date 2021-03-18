import { combineReducers, createStore } from 'redux';
import { MakeStore, createWrapper, HYDRATE, Context } from 'next-redux-wrapper';
import { StateType } from 'typesafe-actions';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { typingReducer } from '../reducers/typing';
import { statsReducer } from '../reducers/stats';
import { settingsReducer } from '../reducers/settings';

const rootReducer = combineReducers({
  typing: typingReducer,
  settings: settingsReducer,
  stats: statsReducer,
});

export type RootState = StateType<typeof rootReducer>;

const reducer = (state: RootState | undefined, action: any): RootState => {
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
const makeStore: MakeStore<RootState> = (context: Context) => {
  // https://github.com/fazlulkarimweb/with-next-redux-wrapper-redux-persist
  if (typeof window === 'undefined') {
    return createStore(reducer);
  }

  const persistConfig = {
    key: 'nextjs',
    whitelist: ['typing', 'settings', 'stats'],
    storage, // if needed, use a safer storage
  };

  const persistedReducer = persistReducer(persistConfig, reducer);

  const store = createStore(persistedReducer);

  // eslint-disable-next-line
  (store as any).__persistor = persistStore(store);

  return store;
};

// export an assembled wrapper
export const wrapper = createWrapper<RootState>(makeStore);
