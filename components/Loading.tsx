import * as React from 'react';

export interface ILoadingProps { }

export const Loading: React.FunctionComponent<ILoadingProps> = (props: React.PropsWithChildren<ILoadingProps>) => {
  return (
    <div className={`z-50 fixed flex flex-col items-center justify-center top-0 bottom-0 right-0 left-0 bg-white bg-opacity-95 backdrop-blur-sm`}>
      <div className="flex flex-col items-center space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Analytics</h3>
          <p className="text-gray-600">Fetching your visitor statistics...</p>
        </div>

        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce animation-delay-100"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce animation-delay-200"></div>
        </div>
      </div>
    </div>
  );
};