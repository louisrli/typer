import clsx from 'clsx';
import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../lib/store';

const mapStateToProps = (state: RootState) => {
  return {
    numCorrectKeyPresses: state.stats.numCorrectKeyPresses,
    numErrorKeyPresses: state.stats.numErrorKeyPresses,
    accuracyHistory: state.stats.accuracyHistory,
    numWordsFinished: state.typing.currentPhraseIndex,
  };
};

const BigStatisticView: React.FC<{
  statistic: string | null;
  unit: string;
}> = ({ statistic, unit }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 text-lg">{unit}</div>
      <div className="text-3xl text-gray-600">{statistic || '-'}</div>
    </div>
  );
};

const StatsView: React.FC<ReturnType<typeof mapStateToProps>> = ({
  numCorrectKeyPresses,
  numErrorKeyPresses,
  numWordsFinished,
}) => {
  const accuracy =
    numCorrectKeyPresses + numErrorKeyPresses > 0
      ? numCorrectKeyPresses / (numCorrectKeyPresses + numErrorKeyPresses)
      : null;
  return (
    <div className={clsx('flex justify-around w-full mt-8')}>
      <BigStatisticView
        statistic={accuracy ? `${Math.floor(accuracy * 100)}%` : null}
        unit="Overall accuracy"
      />
      <BigStatisticView statistic={String(numWordsFinished)} unit="Completed" />
    </div>
  );
};

export default connect(mapStateToProps)(StatsView);
