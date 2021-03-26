import { connect } from 'react-redux';
import React from 'react';
import clsx from 'clsx';
import { typingActions } from '../../reducers/typing';
import PhraseView from './PhraseView';
import DefinitionAndExamplesView from './TranslationAndExamplesView';
import { RootState } from '../../lib/store';
import { statsActions } from '../../reducers/stats';
import PhraseIterationProgressView from './PhraseIterationProgressView';
import StatsView from './StatsView';

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

const sayPhrase = (phrase: string) => {
  const speech = new SpeechSynthesisUtterance(phrase);
  speech.rate = 0.8;
  speech.lang = 'ru';
  window.speechSynthesis.speak(speech);
};

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
  skipPhrase: typingActions.skipPhrase,
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
  skipPhrase,
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
      e.preventDefault();
      // Hotkey for speaking again.
      if (e.code === 'Backquote') {
        sayPhrase(phraseData.phrase);
        return;
      }
      handleGameKeypress(pressedKey, numRequiredPhraseIterations);
      handleStatKeypress(pressedKey, phraseData.phrase, currentCharIndex);
    };
    document.addEventListener('keydown', handler);

    return () => {
      document.removeEventListener('keydown', handler);
    };
  }, [phraseData, currentCharIndex, numRequiredPhraseIterations]);

  React.useEffect(() => {
    if (!phraseData) {
      return;
    }
    // Repeat the phrase on every iteration.
    sayPhrase(phraseData.phrase);
  }, [currentPhraseIteration, phraseData]);

  return (
    <div
      className={clsx([
        'flex flex-col justify-center items-center',
        'mx-auto p-16',
        'max-w-4xl h-full',
        'rounded-2xl shadow-md',
        'bg-blue-50',
      ])}
    >
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
            phrase={phraseData.phrase}
            definitions={phraseData.definitions}
            examples={phraseData.examples}
          />
        </>
      )}
      {!phraseData && <div>You've finished.</div>}
      <StatsView />
      <button type="button" onClick={skipPhrase}>
        Skip
      </button>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(PhraseSessionView);
