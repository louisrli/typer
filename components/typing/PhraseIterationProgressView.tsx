/**
 * Shows the iteration progress in the current phrase.
 */
import styled from '@emotion/styled';
import React from 'react';
import { Colors, Space } from '../common/Styles';

const DotsDiv = styled.div<{ isFilled: boolean }>`
  height: ${Space[8]};
  width: ${Space[8]};
  margin: ${Space[4]};
  background-color: ${(props) =>
    props.isFilled ? Colors.mainPrimary : 'transparent'};
  border-radius: 50%;
  border: 2px solid
    ${(props) => (props.isFilled ? Colors.mainPrimary : Colors.neutrals[300])};
  display: inline-block;
`;

interface PhraseIterationProgressProps {
  currentPhraseIteration: number;
  numRequiredPhraseIterations: number;
}

const PhraseIterationProgressView: React.FC<PhraseIterationProgressProps> = ({
  currentPhraseIteration,
  numRequiredPhraseIterations,
}) => {
  const filledDots = Array(currentPhraseIteration).fill(<DotsDiv isFilled />);
  const emptyDots = Array(
    numRequiredPhraseIterations - currentPhraseIteration
  ).fill(<DotsDiv isFilled={false} />);
  return (
    <div style={{ marginTop: Space[16] }}>
      {filledDots.concat(emptyDots).map((d) => (
        <span>{d}</span>
      ))}
    </div>
  );
};

export default PhraseIterationProgressView;
