import { connect } from 'react-redux';
import React from 'react';
import clsx from 'clsx';
import { getRenderInfo, typingActions } from '../../reducers/typing';
import PhraseView from './PhraseView';
import DefinitionAndExamplesView from './TranslationAndExamplesView';
import { RootState } from '../../lib/store';
import { statsActions } from '../../reducers/stats';
import PhraseIterationProgressView from './PhraseIterationProgressView';
import StatsView from './StatsView';
import { loadCorpus } from '../../lib/corpora';

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

type PhraseSessionOwnProps = {
  corpusKey: string;
};

const mapStateToProps = (state: RootState, ownProps: PhraseSessionOwnProps) => {
  return {
    progress: getRenderInfo(ownProps.corpusKey)(state.typing),
    numRequiredPhraseIterations: state.settings.numRequiredPhraseIterations,
  };
};

const mapDispatchToProps = {
  handleGameKeypress: typingActions.handleGameKeypress,
  initializeCorpusProgress: typingActions.initializeCorpusProgress,
  handleStatKeypress: statsActions.handleStatKeypress,
  skipPhrase: typingActions.skipPhrase,
};

type PhraseSessionProps = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps &
  PhraseSessionOwnProps;

const PhraseSessionView: React.FC<PhraseSessionProps> = ({
  corpusKey,
  numRequiredPhraseIterations,
  progress,
  handleGameKeypress,
  handleStatKeypress,
  initializeCorpusProgress,
  skipPhrase,
}) => {
  React.useEffect(() => {
    // If it doesn't exist, it means it wasn't loaded from redux persist. We
    // need to start it.
    async function maybeLoadInitialData() {
      if (!progress) {
        const phrases = await loadCorpus(corpusKey);
        initializeCorpusProgress(corpusKey, phrases);
      }
    }
    maybeLoadInitialData();
  }, []);

  React.useEffect(() => {
    if (!progress || progress.phraseData) {
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
        sayPhrase(progress.phraseData!.phrase);
        return;
      }
      handleGameKeypress(pressedKey, numRequiredPhraseIterations);
      handleStatKeypress(
        pressedKey,
        progress.phraseData!.phrase,
        progress.currentCharIndex
      );
    };
    document.addEventListener('keydown', handler);

    return () => {
      document.removeEventListener('keydown', handler);
    };
  }, [
    progress && progress.phraseData,
    progress && progress.currentCharIndex,
    numRequiredPhraseIterations,
  ]);

  React.useEffect(() => {
    if (!progress || !progress.phraseData) {
      return;
    }
    // Repeat the phrase on every iteration.
    sayPhrase(progress.phraseData.phrase);
  }, [
    progress && progress.currentPhraseIteration,
    progress && progress.phraseData,
  ]);

  if (!progress) {
    // TODO(louisli)
    return <>"Loading..."</>;
  }

  const { phraseData, currentPhraseIteration, currentCharIndex } = progress;
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
