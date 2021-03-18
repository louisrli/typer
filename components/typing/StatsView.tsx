import clsx from 'clsx';
import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../lib/store';

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
  return (
    <div className={clsx('flex justify-around w-full')}>
      <div>{accuracy ? Number(accuracy).toFixed(2) : '-'}</div>
    </div>
  );
};

export default connect(mapStateToProps)(StatsView);
