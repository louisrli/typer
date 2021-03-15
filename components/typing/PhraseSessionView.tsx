import React from 'react';
import { PhraseData } from '../../reducers/typing';
import PhraseView from './PhraseView';
import TranslationAndExamplesView from './TranslationAndExamplesView';

interface PhraseSessionProps {
  // null when session has finished.
  phraseData: PhraseData | null;
  currentCharIndex: number;
}

const PhraseSessionView: React.FC<PhraseSessionProps> = ({
  phraseData,
  currentCharIndex,
}) => {
  React.useEffect(() => {
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
  }, []);
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

export default PhraseSessionView;
