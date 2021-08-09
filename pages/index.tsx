import Head from 'next/head'
import React, { SyntheticEvent, useState } from 'react';
import 'tailwindcss/tailwind.css';
import { Page } from '../components/Page';
import { ColorPicker } from '../components/ColorPicker';
import { API } from '../constants/API';
import { Dropdown } from '../components/Dropdown';
import { Favicons } from '../components/Favicons';
import { ClipboardCopyIcon, QuestionMarkCircleIcon } from '@heroicons/react/solid';
import { CopyField } from '../components/CopyField';
import Link from 'next/link';

const defaultLabelColor = "#555555";

const styles = [
  "default",
  "flat",
  "flat-square",
  "plastic"
];

const types = [
  "total",
  "daily",
  "combined"
];

export default function Home() {
  const [ username, setUsername ] = useState('');
  const [ repository, setRepository ] = useState('');
  const [ label, setLabel ] = useState('');
  const [ labelColor, setLabelColor ] = useState(defaultLabelColor);
  const [ countColor, setCountColor ] = useState('#263759');
  const [ badgeStyle, setBadgeStyle ] = useState('default');
  const [ badgeType, setBadgeType ] = useState('total');

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

  const getApi = () => {
    if (badgeType === "total") {
      return API.visitors;
    } else if (badgeType === "daily") {
      return API.daily;
    } else if (badgeType === "combined") {
      return API.combined;
    }
  }

  const getMarkdownCode = () => {
    if (username && repository) {
      const query = getQueryString();
      return `![Visitors](${process.env.NEXT_PUBLIC_VISITOR_API}${getApi()}${query})`;
    }
    return '';
  };

  const getLink = () => {
    if (username && repository) {
      const query = getQueryString();
      return `${process.env.NEXT_PUBLIC_VISITOR_API}${getApi()}${query}`;
    }
    return '';
  };

  const getStatusLink = () => {
    if (username && repository) {
      return `${process.env.NEXT_PUBLIC_SITE_URL}/status/${username}/${repository}`;
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

      <Favicons />

      <Page labelColor={labelColor} countColor={countColor} badgeStyle={badgeStyle} username={username} repository={repository}>
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
                  Repository/Project name
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

              <div className="col-span-12 sm:col-span-4">
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

              <Dropdown items={styles} selected={badgeStyle} title={`Badge style`} triggerUpdate={(style) => setBadgeStyle(style)} />
              
              <Dropdown items={types} selected={badgeType} title={`Badge type`} triggerUpdate={(type) => setBadgeType(type)} />
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

            <CopyField title={`Markdown`} value={getMarkdownCode()} />

            <CopyField title={`Image URL`} value={getLink()} />

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

        <div>
          <div className="mt-8 pb-4 border-b border-gray-200">
            <h3 className="text-xl leading-6 font-medium text-gray-900">Follow up on your visitor hits</h3>
            <p className="mt-2 max-w-4xl text-sm text-gray-500">
              Want to follow up on your visitor hits? With the following links you can do so.
            </p>
          </div>

          <div className="my-4 grid grid-cols-6 gap-6">

            <div className="col-span-12">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status page
              </label>

              {
                getStatusLink() ? (
                  <Link href={getStatusLink()}>
                    <a id="status" className="mt-1 block w-full sm:text-sm text-yellow-700" target="_blank" rel="noopener noreferrer">
                      Click here to go to the status page of: {username}/{repository}
                    </a>
                  </Link>
                ) : (
                  <p className="mt-1 block w-full sm:text-sm text-blue-500">No link, please fill in a username and repository.</p>
                )
              }
            </div>
          </div>
        </div>
      </Page>
    </>
  )
}
