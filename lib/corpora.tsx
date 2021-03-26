/**
 * String query keys for corpora.
 */

import invariant from 'ts-invariant';
import { PhraseData } from '../reducers/typing';

interface CorpusInfo {
  // User readable string.
  renderName: string;
  // User readable extended description.
  description: string;
  // User visible key used in the query.
  corpusKey: string;
  // URL of the JSON data that will be used to fetch the phrase data.
  url: string;
}

export const Corpora: Record<string, CorpusInfo> = {
  RU_ADJ_NOUN_SWAP: {
    renderName: 'Russian most common adjective noun pairs',
    description:
      'Most common Russian adjectives and nouns by embedding distance.',
    corpusKey: 'ru_adj_noun_swap',
    url:
      'https://gist.githubusercontent.com/louisrli/69e266b8b203d3d745f5c031d8678c18/raw/4234a70d393d0b9bbd729b101b973c3c1bd9d1f4/gistfile1.txt',
  },
};

/**
 * Loads the corpus using the corpusKey.
 */
export const loadCorpus = async (corpusKey: string): Promise<PhraseData[]> => {
  const info = Object.values(Corpora).find(
    (candidate) => candidate.corpusKey === corpusKey
  );
  // Never should have gotten this far.
  invariant(info);
  const gistReq = await fetch(info!.url);
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
  return phrasePool;
};
