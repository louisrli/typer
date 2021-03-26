import { NextPage } from 'next';
import React from 'react';
import Layout from '../components/common/Layout';

const Start: NextPage = () => {
  return (
    <Layout title="Type better">
      <StartView />
    </Layout>
  );
};

export default Start;
