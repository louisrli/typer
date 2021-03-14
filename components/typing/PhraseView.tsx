import React from 'react';
import CharacterView from './CharacterView';

interface PhraseProps {
  phrase: string;
  currentIndex: number;
}

const PhraseView: React.FC<PhraseProps> = ({ phrase, currentIndex }) => {
  return (
    <div>
      {phrase.split('').map((c, i) => (
        <CharacterView char={c} isCurrent={currentIndex === i} />
      ))}
    </div>
  );
};

export default PhraseView;
