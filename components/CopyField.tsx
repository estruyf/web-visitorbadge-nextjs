import { ClipboardCopyIcon } from '@heroicons/react/solid';
import * as React from 'react';
import { SyntheticEvent } from 'react';

export interface ICopyFieldProps {
    title: string;
    value: string;
}

export const CopyField: React.FunctionComponent<ICopyFieldProps> = ({title, value}: React.PropsWithChildren<ICopyFieldProps>) => {
  const [ show, setShow ] = React.useState(false);

  const copyToClipboard = (e: SyntheticEvent<HTMLButtonElement>) => {
    const elm = e.currentTarget.parentElement?.querySelector(`input`);
    if (elm) {
      const textArea = document.createElement("textarea");
      textArea.value = elm.value;
      textArea.style.position = 'absolute';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);

      setShow(true);

      setTimeout((elm) => {
        setShow(false);
      }, 1000);
    }
  };

  const elmId = title.replace(/ /g, '-');

  return (
    <div className="col-span-6">
      <label htmlFor={elmId} className="block text-sm font-medium text-gray-700">
      {title}
      </label>

      <div className="mt-1 relative rounded-md shadow-sm">
        <input
          type="text"
          name={elmId}
          id={elmId}
          value={value}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 pl-3 pr-10 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          disabled
        />
        {
          show && (
            <div className={`bg-green absolute top-0 h-full w-full border border-gray-300 rounded-md py-2 pl-3 sm:text-sm`}>
              Copied
            </div>
          )
        }
        <button className={`absolute inset-y-0 right-0 pr-3 items-center ${value ? 'flex' : 'hidden'}`} title={`Copy ${title}`} onClick={copyToClipboard}>
          <ClipboardCopyIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};