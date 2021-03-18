import clsx from 'clsx';
import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../lib/store';

const mapStateToProps = (state: RootState) => {
  return {
    isLastKeyError: state.typing.isLastKeyError,
  };
};

interface CharacterProps {
  char: string;
  isCurrent: boolean;
}

const CharacterView: React.FC<
  CharacterProps & ReturnType<typeof mapStateToProps>
> = ({ char, isCurrent, isLastKeyError }) => {
  // We do a "hack" of replacing whitespace with multiple to increase the visual
  // spacing on whitespace chars.
  const cursorArrow = (
    <div className="-mt-1 text-base text-center select-none">&#9650;</div>
  );
  return (
    <div
      className={clsx({
        'text-red-600': isCurrent && isLastKeyError,
      })}
    >
      <span
        className={clsx({
          'font-bold': isCurrent,
          'whitespace-pre': true,
        })}
      >
        {char.replace(' ', '  ')}
      </span>
      {isCurrent && cursorArrow}
    </div>
  );
};

export default connect(mapStateToProps)(CharacterView);
