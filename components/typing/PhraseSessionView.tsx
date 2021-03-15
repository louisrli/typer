import { connect } from 'react-redux';
import React from 'react';
import { handleGameKeypress, PhraseData } from '../../reducers/typing';
import PhraseView from './PhraseView';
import TranslationAndExamplesView from './TranslationAndExamplesView';
import { RootState } from '../../lib/store';
import { handleStatKeypress } from '../../reducers/stats';

const mapStateToProps = (state: RootState) => {
  return {
    phraseData:
      state.typing.phrasePool[state.typing.currentPhraseIndex] || null,
    currentCharIndex: state.typing.currentCharIndex,
  };
};

const mapDispatchToProps = {
  handleGameKeypress,
  handleStatKeypress,
};

type PhraseSessionProps = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;

const PhraseSessionView: React.FC<PhraseSessionProps> = ({
  phraseData,
  currentCharIndex,
  handleGameKeypress,
}) => {
  React.useEffect(() => {
    if (!phraseData) {
      return;
    }
    const handler = (e: KeyboardEvent) => {
      const isCorrect = e.key === phraseData.phrase[currentCharIndex];
      if (isCorrect) {
        console.log('foo');
      } else {
      }
    };
    document.addEventListener('keydown', handler);

    return () => {
      document.removeEventListener('keydown', handler);
    };
  }, [phraseData]);
  return (
    <div>
      <PhraseView
        phrase={phraseData.phrase}
        currentCharIndex={currentCharIndex}
      />
      <TranslationAndExamplesView
        translations={phraseData.translations}
        examples={phraseData.examples}
      />
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(PhraseSessionView);
