import clsx from 'clsx';
import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../lib/store';

const MIN_ERROR_OCCURRENCES = 3;
const NUM_ERROR_CHARS_TO_SHOW = 5;

const topCharErrorsSelector = (state: RootState): string[] => {
  const entries: [string, number][] = [];
  for (const char of Object.keys(state.stats.mistakesPerChar)) {
    entries.push([char, state.stats.mistakesPerChar[char]]);
  }
  entries.sort((a, b) => {
    return b[1] - a[1];
  });
  return entries
    .filter((e) => e[1] > MIN_ERROR_OCCURRENCES)
    .map((e) => e[0])
    .slice(0, NUM_ERROR_CHARS_TO_SHOW);
};

// TODO(louisli): Needs to be per corpus as well.
const mapStateToProps = (state: RootState) => {
  return {
    numCorrectKeyPresses: state.stats.numCorrectKeyPresses,
    numErrorKeyPresses: state.stats.numErrorKeyPresses,
    accuracyHistory: state.stats.accuracyHistory,
    numWordsFinished:
      state.typing.progresses[state.typing.currentCorpusKey || '']
        ?.currentPhraseIndex || 0,
    topErrorChars: topCharErrorsSelector(state),
  };
};

const BigStatisticView: React.FC<{
  statistic: React.ReactNode | null;
  unit: string;
  // Text styles won't be applied, let child determine.
  disableTextSizing?: boolean;
}> = ({ statistic, unit, disableTextSizing }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 text-lg">{unit}</div>
      <div
        className={clsx({
          'text-gray-600': true,
          'text-3xl': !disableTextSizing,
        })}
      >
        {statistic || '-'}
      </div>
    </div>
  );
};

/**
 * A nice little view of a character
 */
const FancyCharacterView: React.FC<{ char: string }> = ({ char }) => {
  return (
    <span className="px-1 py-0.5 mx-0.5 text-base text-center bg-gray-200 shadow-inner rounded-md bg-gradient-to-bl from-gray-100 inline-block">
      {char}
    </span>
  );
};

const StatsView: React.FC<ReturnType<typeof mapStateToProps>> = ({
  numCorrectKeyPresses,
  numErrorKeyPresses,
  numWordsFinished,
  topErrorChars,
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
      <BigStatisticView
        disableTextSizing
        statistic={
          topErrorChars.length > 0
            ? topErrorChars.map((c) => <FancyCharacterView char={c} />)
            : null
        }
        unit="Needs work"
      />
    </div>
  );
};

export default connect(mapStateToProps)(StatsView);
