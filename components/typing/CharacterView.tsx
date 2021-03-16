import styled from '@emotion/styled';
import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../lib/store';
import { Colors, Space } from '../common/Styles';

// Each of these are a flex-item from the parent div.
const CharacterDiv = styled.div<{ isCurrent: boolean }>`
  font-weight: ${(props) => (props.isCurrent ? 'bold' : 'unset')};
`;

const MarkerDiv = styled.div`
  font-size: ${Space[16]};
  text-align: center;
  margin-top: -${Space[8]};
`;

const CharacterContainerDiv = styled.div<{ isError: boolean }>`
  color: ${(props) => (props.isError ? Colors.red[600] : 'unset')}; ;
`;

const mapStateToProps = (state: RootState) => {
  return {
    isLastKeyError: state.typing.isLastKeyError,
  };
};

interface CharacterProps {
  char: string;
  isCurrent: boolean;
}

const CharacterView: React.FC<
  CharacterProps & ReturnType<typeof mapStateToProps>
> = ({ char, isCurrent, isLastKeyError }) => {
  return (
    <CharacterContainerDiv isError={isLastKeyError && isCurrent}>
      <CharacterDiv isCurrent={isCurrent}>{char}</CharacterDiv>
      {isCurrent && <MarkerDiv>&#9650;</MarkerDiv>}
    </CharacterContainerDiv>
  );
};

export default connect(mapStateToProps)(CharacterView);
