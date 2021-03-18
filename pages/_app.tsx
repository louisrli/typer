import 'tailwindcss/tailwind.css';

import React, { FC } from 'react';
import { AppProps } from 'next/app';
import { enableMapSet } from 'immer';
import { PersistGate } from 'redux-persist/integration/react';
import { useStore } from 'react-redux';
import { wrapper } from '../lib/store';

// I guess this is the entry point.
// https://immerjs.github.io/immer/docs/installation
enableMapSet();

const WrappedApp: FC<AppProps> = ({ Component, pageProps }) => {
  const store = useStore();
  return (
    // eslint-disable-next-line
    <PersistGate persistor={( store as any).__persistor}>
      <Component {...pageProps} />
    </PersistGate>
  );
};

export default wrapper.withRedux(WrappedApp);
