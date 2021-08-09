import * as React from 'react';

export interface ILoadingProps {}

export const Loading: React.FunctionComponent<ILoadingProps> = (props: React.PropsWithChildren<ILoadingProps>) => {
  return (
    <div className={`z-50 fixed flex items-center justify-center top-0 bottom-0 right-0 left-0 bg-white bg-opacity-80 text-blue-400`}>
      <svg xmlns="http://www.w3.org/2000/svg" className={`h-32 w-32`} viewBox="0 0 45 45" stroke="currentcolor">
        <g fill="none" fillRule="evenodd" transform="translate(1 1)" strokeWidth="2">
          <circle cx="22" cy="22" r="6" strokeOpacity="0">
            <animate attributeName="r" begin="1.5s" dur="3s" values="6;22" calcMode="linear" repeatCount="indefinite"/>
            <animate attributeName="stroke-opacity" begin="1.5s" dur="3s" values="1;0" calcMode="linear" repeatCount="indefinite"/>
            <animate attributeName="stroke-width" begin="1.5s" dur="3s" values="2;0" calcMode="linear" repeatCount="indefinite"/>
          </circle>
          <circle cx="22" cy="22" r="6" strokeOpacity="0">
            <animate attributeName="r" begin="3s" dur="3s" values="6;22" calcMode="linear" repeatCount="indefinite"/>
            <animate attributeName="stroke-opacity" begin="3s" dur="3s" values="1;0" calcMode="linear" repeatCount="indefinite"/>
            <animate attributeName="stroke-width" begin="3s" dur="3s" values="2;0" calcMode="linear" repeatCount="indefinite"/>
          </circle>
          <circle cx="22" cy="22" r="8">
            <animate attributeName="r" begin="0s" dur="1.5s" values="6;1;2;3;4;5;6" calcMode="linear" repeatCount="indefinite"/>
          </circle>
        </g>
      </svg>
    </div>
  );
};