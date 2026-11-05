import { CheckIcon, ClipboardIcon } from '@heroicons/react/24/solid';
import * as React from 'react';

export interface ISnippetsProps {
  snippets: {
    title: string;
    value: string;
  }[];
}

export const Snippets: React.FunctionComponent<ISnippetsProps> = ({ snippets }: React.PropsWithChildren<ISnippetsProps>) => {
  const [active, setActive] = React.useState(snippets[0].title);
  const [copied, setCopied] = React.useState(false);

  const value = snippets.find(s => s.title === active)?.value || '';

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="bg-ink-950 rounded-2xl overflow-hidden">
      <div className="flex flex-wrap gap-1 p-2 border-b border-ink-800">
        {
          snippets.map(({ title }) => (
            <button
              key={title}
              type="button"
              aria-pressed={title === active}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${title === active ? 'bg-ink-800 text-amber-400' : 'text-ink-300 hover:text-white'}`}
              onClick={() => setActive(title)}
            >
              {title}
            </button>
          ))
        }
      </div>

      <div className="flex items-start gap-x-3 p-4">
        <pre
          aria-label={`${active} code`}
          className={`flex-grow min-w-0 min-h-[5rem] font-mono text-sm leading-relaxed whitespace-pre-wrap break-all ${value ? 'text-ink-50' : 'text-ink-300 select-none'}`}
        >
          {value || `We'll generate this once you've added a URL.`}
        </pre>

        {
          value && (
            <button
              type="button"
              className={`inline-flex flex-shrink-0 items-center gap-x-1.5 px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${copied ? 'bg-up text-white' : 'bg-amber-400 text-ink-950 hover:bg-amber-300'}`}
              title={`Copy ${active}`}
              onClick={copyToClipboard}
            >
              {copied ? <CheckIcon className="h-4 w-4" aria-hidden="true" /> : <ClipboardIcon className="h-4 w-4" aria-hidden="true" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          )
        }
      </div>
    </div>
  );
};
