import { NextPage } from 'next';
import { useRouter } from 'next/dist/client/router';
import React from 'react';
import Layout from '../components/common/Layout';
import PhraseSessionView from '../components/typing/PhraseSessionView';

const Play: NextPage = () => {
  const router = useRouter();
  if (!router.query.corpus) {
    return <Layout title="Type better">That's not a valid corpus.</Layout>;
  }

  return (
    <Layout title="Type better">
      <PhraseSessionView corpusKey={router.query.corpus as string} />
    </Layout>
  );
};

export default Play;
