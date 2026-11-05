import * as React from 'react';

export interface ISegmentedControlProps {
  selected: string;
  title: string;
  items: string[];
  triggerUpdate: (value: string) => void;
}

export const SegmentedControl: React.FunctionComponent<ISegmentedControlProps> = ({ items, selected, title, triggerUpdate }: React.PropsWithChildren<ISegmentedControlProps>) => {
  const name = title.replace(/ /g, '-').toLowerCase();

  return (
    <fieldset>
      <legend className="block text-sm font-semibold text-ink-900">
        {title}
      </legend>

      <div
        className="mt-2 grid gap-1 p-1 bg-paper-dark rounded-lg"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(4.5rem, 1fr))' }}
      >
        {
          items.map((item) => (
            <label
              key={item}
              className={`relative px-1 py-1.5 text-center whitespace-nowrap text-sm font-medium rounded-md cursor-pointer transition-colors focus-within:ring-2 focus-within:ring-amber-500 ${item === selected ? 'bg-ink-900 text-white' : 'text-ink-500 hover:text-ink-900'}`}
            >
              <input
                type="radio"
                className="sr-only"
                name={name}
                value={item}
                checked={item === selected}
                onChange={() => triggerUpdate(item)}
              />
              {item}
            </label>
          ))
        }
      </div>
    </fieldset>
  );
};
