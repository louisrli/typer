import React from 'react';
import Link from 'next/link';
import { Corpora } from '../../lib/corpora';

const StartView: React.FC = () => {
  return (
    <div>
      {Object.values(Corpora).map((info) => {
        return (
          <div>
            <Link
              href={{
                pathname: '/play',
                query: {
                  corpus: info.corpusKey,
                },
              }}
            >
              <a>{info.renderName}</a>
            </Link>
            <div>{info.description}</div>
          </div>
        );
      })}
    </div>
  );
};

export default StartView;
