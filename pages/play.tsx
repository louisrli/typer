import { NextPage } from 'next';
import React from 'react';
import Layout from '../components/common/Layout';
import PhraseSessionView from '../components/typing/PhraseSessionView';

const Play: NextPage = () => {
  return (
    <Layout title="Type better">
      <PhraseSessionView />
    </Layout>
  );
};

export default Play;
