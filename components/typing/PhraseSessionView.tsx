import { connect } from 'react-redux';
import React from 'react';
import { typingActions } from '../../reducers/typing';
import PhraseView from './PhraseView';
import TranslationAndExamplesView from './TranslationAndExamplesView';
import { RootState } from '../../lib/store';
import { statsActions } from '../../reducers/stats';

const mapStateToProps = (state: RootState) => {
  return {
    phraseData:
      state.typing.phrasePool[state.typing.currentPhraseIndex] || null,
    currentCharIndex: state.typing.currentCharIndex,
  };
};

const mapDispatchToProps = {
  handleGameKeypress: typingActions.handleGameKeypress,
  handleStatKeypress: statsActions.handleStatKeypress,
};

type PhraseSessionProps = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;

const PhraseSessionView: React.FC<PhraseSessionProps> = ({
  phraseData,
  currentCharIndex,
  handleGameKeypress,
  handleStatKeypress,
}) => {
  React.useEffect(() => {
    if (!phraseData) {
      return undefined;
    }
    const handler = (e: KeyboardEvent) => {
      const pressedKey = e.key;
      handleGameKeypress(pressedKey);
      handleStatKeypress(pressedKey, phraseData.phrase, currentCharIndex);
    };
    document.addEventListener('keydown', handler);

    return () => {
      document.removeEventListener('keydown', handler);
    };
  }, [phraseData]);

  if (!phraseData) {
    return <>You finished.</>;
  }
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
