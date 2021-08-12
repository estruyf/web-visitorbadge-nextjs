import { Menu, Transition } from '@headlessui/react';
import * as React from 'react';
import { ChevronDownIcon } from '@heroicons/react/solid'
import { Fragment } from 'react';

export interface IDropdownProps {
  selected: string;
  title: string;
  items: string[];
  triggerUpdate: (style: string) => void;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export const Dropdown: React.FunctionComponent<IDropdownProps> = ({items, selected, title, triggerUpdate}: React.PropsWithChildren<IDropdownProps>) => {
  return (
    <div className="col-span-12 sm:col-span-2">
      <label htmlFor="label" className="block text-sm font-medium text-gray-700">
        {title}
      </label>
      <Menu as="div" className="mt-1 relative inline-block text-left w-full">
      {({ open }) => (
        <>
          <div>
            <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
              {selected}
              <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
            </Menu.Button>
          </div>

          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              static
              className="origin-top-right absolute right-0 mt-2 rounded-md shadow-lg bg-white w-full ring-1 ring-black ring-opacity-5 focus:outline-none z-30"
            >
              <div className="py-1">
                {
                  items.map((item) => (
                    <Menu.Item key={item}>
                      {({ active }) => (
                        <button
                          className={classNames(
                            active ? 'bg-gray-100 text-gray-900 w-full' : 'text-gray-700',
                            'block px-4 py-2 text-sm w-full'
                          )}
                          onClick={() => triggerUpdate(item)}
                        >
                          {item}
                        </button>
                      )}
                    </Menu.Item>
                  ))
                }
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
    </div>
  );
};