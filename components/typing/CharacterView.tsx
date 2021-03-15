import styled from '@emotion/styled';
import React from 'react';

const CharacterDiv = styled.span<{ isCurrent: boolean }>`
  font-weight: ${(props) => (props.isCurrent ? 'bold' : 'unset')};
`;
interface CharacterProps {
  char: string;
  isCurrent: boolean;
}

const CharacterView: React.FC<CharacterProps> = ({ char, isCurrent }) => {
  return <CharacterDiv isCurrent={isCurrent}>{char}</CharacterDiv>;
};

export default CharacterView;
