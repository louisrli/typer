import React from 'react';

interface CharacterProps {
  char: string;
  isCurrent: boolean;
}

const CharacterView: React.FC<CharacterProps> = ({ char }) => {
  return <div>{char}</div>;
};

export default CharacterView;
