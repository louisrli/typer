import 'tailwindcss/tailwind.css';

import React, { FC } from 'react';
import { AppProps } from 'next/app';
import { enableMapSet } from 'immer';
import { wrapper } from '../lib/store';

// I guess this is the entry point.
// https://immerjs.github.io/immer/docs/installation
enableMapSet();

const WrappedApp: FC<AppProps> = ({ Component, pageProps }) => (
  <Component {...pageProps} />
);

export default wrapper.withRedux(WrappedApp);
