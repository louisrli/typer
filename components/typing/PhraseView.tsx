import React from 'react';
import CharacterView from './CharacterView';

interface PhraseProps {
  phrase: string;
  currentCharIndex: number;
}

const PhraseView: React.FC<PhraseProps> = ({ phrase, currentCharIndex }) => {
  return (
    <div>
      {phrase.split('').map((c, i) => (
        <CharacterView char={c} isCurrent={currentCharIndex === i} />
      ))}
    </div>
  );
};

export default PhraseView;
