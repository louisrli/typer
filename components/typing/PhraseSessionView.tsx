import { connect } from 'react-redux';
import React from 'react';
import styled from '@emotion/styled';
import { typingActions } from '../../reducers/typing';
import PhraseView from './PhraseView';
import TranslationAndExamplesView from './TranslationAndExamplesView';
import { RootState } from '../../lib/store';
import { statsActions } from '../../reducers/stats';
import { Space } from '../common/Styles';

const PhraseSessionDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  border: 1px solid grey;
  border-radius: ${Space[4]};
  max-width: 800px;
  min-height: 600px;
`;

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

  React.useEffect(() => {
    const speech = new SpeechSynthesisUtterance('спасиво');
    speech.lang = 'ru';
    window.speechSynthesis.speak(speech);
  }, [phraseData]);

  if (!phraseData) {
    return <>You finished.</>;
  }

  return (
    <PhraseSessionDiv>
      <PhraseView
        phrase={phraseData.phrase}
        currentCharIndex={currentCharIndex}
      />
      <TranslationAndExamplesView
        translations={phraseData.translations}
        examples={phraseData.examples}
      />
    </PhraseSessionDiv>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(PhraseSessionView);
