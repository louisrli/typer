import styled from '@emotion/styled';
import React from 'react';
import { Space } from '../common/Styles';
import CharacterView from './CharacterView';

const PhraseContainerDiv = styled.div`
  font-size: ${Space[36]};
  // Note that character view should be a flex-child of these, thus there's some
  // cross-component CSS going on here.
  display: flex;
`;

interface PhraseProps {
  phrase: string;
  currentCharIndex: number;
}

const PhraseView: React.FC<PhraseProps> = ({ phrase, currentCharIndex }) => {
  return (
    <PhraseContainerDiv>
      {phrase.split('').map((c, i) => (
        <CharacterView char={c} isCurrent={currentCharIndex === i} />
      ))}
    </PhraseContainerDiv>
  );
};

export default PhraseView;
