import Head from 'next/head'
import React, { SyntheticEvent, useState } from 'react';
import 'tailwindcss/tailwind.css';
import { Page } from '../components/Page';
import { ColorPicker } from '../components/ColorPicker';
import { API } from '../constants/API';
import { StyleDropdown } from '../components/StyleDropdown';

const defaultLabelColor = "#555555";

export default function Home() {
  const [ username, setUsername ] = useState('');
  const [ repository, setRepository ] = useState('');
  const [ label, setLabel ] = useState('');
  const [ labelColor, setLabelColor ] = useState(defaultLabelColor);
  const [ countColor, setCountColor ] = useState('#263759');
  const [ badgeStyle, setBadgeStyle ] = useState('default');

  const usernameChange = (e: SyntheticEvent<HTMLInputElement>) => {
    setUsername(e.currentTarget.value || "");
  };

  const repoChange = (e: SyntheticEvent<HTMLInputElement>) => {
    setRepository(e.currentTarget.value || "");
  };

  const labelChange = (e: SyntheticEvent<HTMLInputElement>) => {
    setLabel(e.currentTarget.value || "");
  };

  const getQueryString = () => {
    let query = `?user=${username}&repo=${repository}`;
      
    if (label) {
      query += `&label=${label}`;
    }

    if (labelColor !== defaultLabelColor) {
      query += `&labelColor=${labelColor.replace("#", "%23")}`;
    }

    if (countColor) {
      query += `&countColor=${countColor.replace("#", "%23")}`;
    }

    if (badgeStyle !== "default") {
      query += `&style=${badgeStyle}`;
    }

    return query;
  };

  const getMarkdownCode = () => {
    if (username && repository) {
      const query = getQueryString();
      return `![](${process.env.NEXT_PUBLIC_VISITOR_API}/${API.visitors}${query})`;
    }
    return '';
  };

  const getLink = () => {
    if (username && repository) {
      const query = getQueryString();
      return `${process.env.NEXT_PUBLIC_VISITOR_API}/${API.visitors}${query}`;
    }
    return '';
  };

  return (
    <>
      <Head>
        <title>Create your visitor badge</title>
        <meta name="description" content="Create your visitor badge which you can use on your website or GitHub profile." />
        <meta property="og:description" content="Create your visitor badge which you can use on your website or GitHub profile." />
        <meta property="twitter:description" content="Create your visitor badge which you can use on your website or GitHub profile." />

        <link rel="preconnect" href={process.env.NEXT_PUBLIC_VISITOR_API} />
        
        <meta property="og:type" content="website" />
        <meta property="twitter:card" content="summary_large_image" />

        <meta property="twitter:image" content={`https://visitorbadge.io/preview.png`} />
        <meta property="og:image" content={`https://visitorbadge.io/preview.png`} />

        <meta property="twitter:url" content="" />
        <meta property="og:url" content="" />
      </Head>

      <Page labelColor={labelColor} countColor={countColor} badgeStyle={badgeStyle}>
        <div>
          <div className="pb-4 border-b border-gray-200">
            <h3 className="text-xl leading-6 font-medium text-gray-900">Create your visitor badge</h3>
            <p className="mt-2 max-w-4xl text-sm text-gray-500">
              Fill in the following form to get your visitor badge Markdown and image URL.
            </p>
          </div>

          <div className={`my-4 mb-12`}>
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 sm:col-span-6">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username/Company
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  autoComplete="username"
                  value={username}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Example: estruyf"
                  onChange={usernameChange}
                />
              </div>

              <div className="col-span-12 sm:col-span-6">
                <label htmlFor="repository" className="block text-sm font-medium text-gray-700">
                  Repository name
                </label>
                <input
                  type="text"
                  name="repository"
                  id="repository"
                  autoComplete="repository"
                  value={repository}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Example: github-visitors-badge"
                  onChange={repoChange}
                />
              </div>

              <div className="col-span-12 sm:col-span-3">
                <label htmlFor="label" className="block text-sm font-medium text-gray-700">
                  Label
                </label>
                <input
                  type="text"
                  name="label"
                  id="label"
                  value={label}
                  autoComplete="label"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Default: VISITORS"
                  onChange={labelChange}
                />
              </div>

              <ColorPicker color={labelColor} title={`Label background`} updateColor={(color) => setLabelColor(color)} />

              <ColorPicker color={countColor} title={`Count background`} updateColor={(color) => setCountColor(color)} />

              <StyleDropdown style={badgeStyle} title={`Badge style`} updateStyle={(style) => setBadgeStyle(style)} />
            </div>
          </div>
        </div>

        <div>
          <div className="pb-4 border-b border-gray-200">
            <h3 className="text-xl leading-6 font-medium text-gray-900">The code for you to use</h3>
            <p className="mt-2 max-w-4xl text-sm text-gray-500">
              You can use the generated Markdown code or image URL in any of your projects.
            </p>
          </div>

          <div className="my-4 grid grid-cols-6 gap-6">
            <div className="col-span-6">
              <label htmlFor="markdown" className="block text-sm font-medium text-gray-700">
                Markdown
              </label>
              <input
                type="text"
                name="markdown"
                id="markdown"
                value={getMarkdownCode()}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                disabled
              />
            </div>
            <div className="col-span-6">
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                Image URL
              </label>
              <input
                type="text"
                name="imageUrl"
                id="imageUrl"
                value={getLink()}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                disabled
              />
            </div>

            {
              getLink() && (
                <div className="col-span-6">
                  <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                    Result
                  </label>
      
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={getLink()} alt="Visitor badge" />
                </div>
              )
            }
          </div>
        </div>
      </Page>
    </>
  )
}
