import { connect } from 'react-redux';
import React from 'react';
import styled from '@emotion/styled';
import { typingActions } from '../../reducers/typing';
import PhraseView from './PhraseView';
import DefinitionAndExamplesView from './TranslationAndExamplesView';
import { RootState } from '../../lib/store';
import { statsActions } from '../../reducers/stats';
import { Colors, Space } from '../common/Styles';
import PhraseIterationProgressView from './PhraseIterationProgressView';

// Not sure if there's a better way. We don't want things like alt-tabbing etc
// to be counted.
const IGNORED_KEYS = new Set([
  'Alt',
  'Meta',
  'Shift',
  'Tab',
  'Control',
  'Insert',
  'Home',
  'Backspace',
  'Delete',
  'PageUp',
  'PageDown',
  'ContextMenu',
  'CapsLock',
]);

const PhraseSessionDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  border-radius: ${Space[16]};
  box-shadow: 2px;
  max-width: 800px;
  min-height: 600px;
  width: 100%;
  padding: 0 ${Space[64]};
  background-color: ${Colors.primary[100]};
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
`;

const mapStateToProps = (state: RootState) => {
  return {
    phraseData:
      state.typing.phrasePool[state.typing.currentPhraseIndex] || null,
    currentCharIndex: state.typing.currentCharIndex,
    currentPhraseIteration: state.typing.currentPhraseIteration,
    numRequiredPhraseIterations: state.settings.numRequiredPhraseIterations,
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
  currentPhraseIteration,
  numRequiredPhraseIterations,
  handleGameKeypress,
  handleStatKeypress,
}) => {
  React.useEffect(() => {
    if (!phraseData) {
      return undefined;
    }
    const handler = (e: KeyboardEvent) => {
      const pressedKey = e.key;
      if (IGNORED_KEYS.has(pressedKey) || e.ctrlKey) {
        return;
      }
      handleGameKeypress(pressedKey, numRequiredPhraseIterations);
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
  }, [currentPhraseIteration]);

  return (
    <PhraseSessionDiv>
      {phraseData && (
        <>
          <PhraseView
            phrase={phraseData.phrase}
            currentCharIndex={currentCharIndex}
          />
          <PhraseIterationProgressView
            currentPhraseIteration={currentPhraseIteration}
            numRequiredPhraseIterations={numRequiredPhraseIterations}
          />
          <DefinitionAndExamplesView
            definitions={phraseData.definitions}
            examples={phraseData.examples}
          />
        </>
      )}
      {!phraseData && <div>You've finished.</div>}
    </PhraseSessionDiv>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(PhraseSessionView);
