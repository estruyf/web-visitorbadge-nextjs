import { ClipboardCopyIcon } from '@heroicons/react/solid';
import * as React from 'react';
import { SyntheticEvent } from 'react';

export interface ICopyFieldProps {
    title: string;
    value: string;
}

export const CopyField: React.FunctionComponent<ICopyFieldProps> = ({title, value}: React.PropsWithChildren<ICopyFieldProps>) => {
  const [ show, setShow ] = React.useState(false);

  const elmId = title.replace(/ /g, '-');

  const copyToClipboard = (e: SyntheticEvent<HTMLButtonElement>) => {
    const elm = e.currentTarget.parentElement?.querySelector(`#${elmId}`);
    if (elm) {
      const textArea = document.createElement("textarea");
      textArea.value = elm.textContent || "";
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

  return (
    <div className="col-span-6">
      <label htmlFor={elmId} className="block text-sm font-medium text-gray-700">
      {title}
      </label>

      <div className="mt-2 relative rounded-md shadow-sm">
        <pre
          id={elmId}
          className={`text-sm bg-blue-500 block w-full border border-gray-300 rounded-md py-2 pl-3 pr-14 leading-loose whitespace-normal break-words ${value ? "text-white" : "text-gray-300 select-none"}`}
        >
          {value || `We'll generate this, once you provided a URL`}
        </pre>

        {
          show && (
            <div className={`flex justify-center items-center font-bold bg-yellow-500 absolute top-0 h-full w-full border border-gray-300 rounded-md py-2 pl-3 text-sm leading-loose z-20`}>
              Copied
            </div>
          )
        }

        <button className={`absolute text-white hover:text-yellow-100 inset-y-0 right-0 pr-3 items-center ${value ? 'flex' : 'hidden'}`} title={`Copy ${title}`} onClick={copyToClipboard}>
          <ClipboardCopyIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};