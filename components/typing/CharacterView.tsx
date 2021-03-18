import styled from '@emotion/styled';
import clsx from 'clsx';
import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../lib/store';
import { Colors, Space } from '../common/Styles';

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
  // We do a "hack" of replacing whitespace with a bunch to increase the visual
  // spacing on whitespace chars.
  return (
    <CharacterContainerDiv isError={isLastKeyError && isCurrent}>
      <span
        className={clsx({
          'font-bold': isCurrent,
          'whitespace-pre': true,
        })}
      >
        {char.replace(' ', '  ')}
      </span>
      {isCurrent && (
        <div className="-mt-1 text-base text-center select-none">&#9650;</div>
      )}
    </CharacterContainerDiv>
  );
};

export default connect(mapStateToProps)(CharacterView);
