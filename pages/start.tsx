import { NextPage } from 'next';
import React from 'react';
import Layout from '../components/common/Layout';
import StartView from '../components/start/StartView';

const Start: NextPage = () => {
  return (
    <Layout title="Type better">
      <StartView />
    </Layout>
  );
};

export default Start;
