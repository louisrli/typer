/**
 * Top-level layout for any pages in SRS.
 */
import { css, Global } from '@emotion/react';
import Head from 'next/head';
import React from 'react';

interface Props {
  title: string;
}

const Layout: React.FC<React.PropsWithChildren<Props>> = ({
  title,
  children,
}) => {
  return (
    <>
      <Global
        styles={css`
          body {
            font-family: 'Roboto', sans-serif;
          }
        `}
      />
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto&display=swap"
          rel="stylesheet"
        />
      </Head>
      {children}
    </>
  );
};

export default Layout;
