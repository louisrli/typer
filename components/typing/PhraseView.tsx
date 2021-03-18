import clsx from 'clsx';
import React from 'react';
import CharacterView from './CharacterView';

interface PhraseProps {
  phrase: string;
  currentCharIndex: number;
}

const PhraseView: React.FC<PhraseProps> = ({ phrase, currentCharIndex }) => {
  const handleClick = () => {
    navigator.clipboard.writeText(phrase);
  };
  return (
    // Note that character view should be a flex-child of these, thus there's some
    // cross-component CSS going on here.
    <div
      className={clsx(
        'flex text-5xl rounded-lg pl-3 pr-3',
        'cursor-pointer select-none',
        'hover:bg-gray-200 active:bg-gray-300'
      )}
      onClick={handleClick}
    >
      {phrase.split('').map((c, i) => (
        <CharacterView char={c} isCurrent={currentCharIndex === i} />
      ))}
    </div>
  );
};

export default PhraseView;
