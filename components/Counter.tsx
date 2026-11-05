import * as React from 'react';

export interface ICounterProps {
  value: number;
  className?: string;
}

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export const Counter: React.FunctionComponent<ICounterProps> = ({ value, className }: React.PropsWithChildren<ICounterProps>) => {
  // Starts at zero so that the digits roll to the value after the first paint
  const [shown, setShown] = React.useState(0);

  React.useEffect(() => {
    const frame = requestAnimationFrame(() => setShown(value));
    return () => cancelAnimationFrame(frame);
  }, [value]);

  const formatted = value.toLocaleString('en-US');
  const digitCount = formatted.replace(/\D/g, '').length;
  const shownDigits = String(shown).padStart(digitCount, '0').slice(-digitCount);

  let position = 0;

  return (
    <span className={`odometer ${className || ''}`} role="img" aria-label={formatted}>
      {
        formatted.split('').map((char, idx) => {
          if (!/\d/.test(char)) {
            return <span key={idx} className="odometer-separator">{char}</span>;
          }

          const digit = Number(shownDigits[position]);
          const delay = position * 40;
          position++;

          return (
            <span key={idx} className="odometer-digit">
              <span
                className="odometer-column"
                style={{ transform: `translateY(-${digit * 10}%)`, transitionDelay: `${delay}ms` }}
              >
                {DIGITS.map((d) => <span key={d}>{d}</span>)}
              </span>
            </span>
          );
        })
      }
    </span>
  );
};
