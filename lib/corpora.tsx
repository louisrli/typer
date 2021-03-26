/**
 * String query keys for corpora.
 */

interface CorpusInfo {
  // User readable string.
  renderName: string;
  // User readable extended description.
  description: string;
  // User visible key used in the query.
  queryKey: string;
  // URL of the JSON data that will be used to fetch the phrase data.
  url: string;
}

export const Corpora: Record<string, CorpusInfo> = {
  RU_ADJ_NOUN_SWAP: {
    renderName: 'Russian most common adjective noun pairs',
    description:
      'Most common Russian adjectives and nouns by embedding distance.',
    queryKey: 'ru_adj_noun_swap',
    url:
      'https://gist.githubusercontent.com/louisrli/69e266b8b203d3d745f5c031d8678c18/raw/4234a70d393d0b9bbd729b101b973c3c1bd9d1f4/gistfile1.txt',
  },
};
