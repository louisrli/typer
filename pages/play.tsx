import { NextPage } from 'next';
import React from 'react';
import Layout from '../components/common/Layout';
import PhraseSessionView from '../components/typing/PhraseSessionView';
import { wrapper } from '../lib/store';
import { PhraseData, typingActions } from '../reducers/typing';

const Play: NextPage = () => {
  return (
    <Layout title="Type better">
      <PhraseSessionView />
    </Layout>
  );
};

const OUR_JANK_DATABASE =
  'https://gist.githubusercontent.com/louisrli/43a875b34c76c1cb80ad3f8b1bcef623/raw/1e6dba05dd7c599b6f73d2a89b473cd9cc3316fd/ru';
export const getServerSideProps = wrapper.getServerSideProps(
  async ({ store, query }) => {
    if (!query.init) {
      return;
    }

    // TODO(louisli): When we get a real server, figure out how this works.
    const gistReq = await fetch(OUR_JANK_DATABASE);
    const json = await gistReq.json();
    const phrasePool: PhraseData[] = [];
    for (const pd of json.phraseData) {
      phrasePool.push({
        phrase: pd.phrase,
        // Prevent error:
        // Reason: `undefined` cannot be serialized as JSON. Please use `null` or
        // omit this value.
        definitions: pd.definitions || null,
        examples: !pd.examples
          ? null
          : pd.examples.map((ex: any) => {
              return [ex.sourceExample?.text, ex.targetExample?.text];
            }),
      });
    }

    store.dispatch(typingActions.setPhrasePool(phrasePool));
  }
);

export default Play;
