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
      <div>{translations}</div>
      <div>{examples}</div>
    </div>
  );
};

export default TranslationAndExamplesView;
