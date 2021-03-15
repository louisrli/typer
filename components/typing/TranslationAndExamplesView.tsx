import React from 'react';

interface TranslationAndExamplesProps {
  translations?: string[];
  examples?: [string, string?][];
}

const TranslationAndExamplesView: React.FC<TranslationAndExamplesProps> = ({
  translations,
  examples,
}) => {
  return (
    <div>
      {translations}
      {examples}
    </div>
  );
};

export default TranslationAndExamplesView;
