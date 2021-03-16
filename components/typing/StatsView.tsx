import styled from '@emotion/styled';
import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../lib/store';
import { Colors, Space } from '../common/Styles';

const StatsContainerDiv = styled.div<{ isError: boolean }>`
  color: ${(props) => (props.isError ? Colors.red[600] : 'unset')}; ;
`;

const mapStateToProps = (state: RootState) => {
  return {
    numCorrectKeyPresses: state.stats.numCorrectKeyPresses,
    numErrorKeyPresses: state.stats.numErrorKeyPresses,
  };
};

const StatsView: React.FC<ReturnType<typeof mapStateToProps>> = ({
  numCorrectKeyPresses,
  numErrorKeyPresses,
}) => {
  const accuracy =
    numCorrectKeyPresses + numErrorKeyPresses > 0
      ? numCorrectKeyPresses / (numCorrectKeyPresses + numErrorKeyPresses)
      : null;
  return <StatsContainerDiv>accuracy: {accuracy}</StatsContainerDiv>;
};

export default connect(mapStateToProps)(StatsView);
