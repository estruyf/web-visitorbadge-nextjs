import Head from 'next/head'
import React, { SyntheticEvent, useState } from 'react';
import 'tailwindcss/tailwind.css';
import { Page } from '../components/Page';
import { ColorPicker } from '../components/ColorPicker';
import { API } from '../constants/API';
import { Dropdown } from '../components/Dropdown';
import { Favicons } from '../components/Favicons';
import { CopyField } from '../components/CopyField';
import Link from 'next/link';
import { useDebounce } from '../hooks/useDebounce';
import { HeartIcon } from '@heroicons/react/24/solid';

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

const labelStyles = [
  "default",
  "upper",
  "lower",
  "none"
];

export default function Home() {
  const [username, setUsername] = useState('');
  const [label, setLabel] = useState('');
  const [labelColor, setLabelColor] = useState(defaultLabelColor);
  const [countColor, setCountColor] = useState('#263759');
  const [badgeStyle, setBadgeStyle] = useState('default');
  const [badgeType, setBadgeType] = useState('total');
  const [labelStyle, setLabelStyle] = useState('default');
  const debounceUsername = useDebounce(username, 1000);

  const usernameChange = (e: SyntheticEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value || "";
    setUsername(value);
  };

  const labelChange = (e: SyntheticEvent<HTMLInputElement>) => {
    setLabel(e.currentTarget.value || "");
  };

  const getQueryString = () => {
    let query = `?path=${encodeURIComponent(debounceUsername)}`;

    if (label) {
      query += `&label=${encodeURIComponent(label)}`;
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

    if (labelStyle !== "default") {
      query += `&labelStyle=${labelStyle}`;
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
    if (debounceUsername) {
      const query = getQueryString();
      return `![Visitors](${process.env.NEXT_PUBLIC_VISITOR_API}${getApi()}${query})`;
    }
    return '';
  };

  const getMarkdownCodeWithStatus = () => {
    if (debounceUsername) {
      const query = getQueryString();
      return `[![Visitors](${process.env.NEXT_PUBLIC_VISITOR_API}${getApi()}${query})](${getStatusLink()})`;
    }
    return '';
  };

  const getHtmlLink = () => {
    if (debounceUsername) {
      const query = getQueryString();
      return `<a href="${getStatusLink()}"><img src="${process.env.NEXT_PUBLIC_VISITOR_API}${getApi()}${query}" /></a>`;
    }
    return '';
  };

  const getLink = () => {
    if (debounceUsername) {
      const query = getQueryString();
      return `${process.env.NEXT_PUBLIC_VISITOR_API}${getApi()}${query}`;
    }
    return '';
  };

  const getStatusLink = () => {
    if (debounceUsername) {
      return `${process.env.NEXT_PUBLIC_SITE_URL}/status?path=${encodeURIComponent(debounceUsername)}`;
    }
    return '';
  };

  return <>
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

    <Page labelColor={labelColor}
      countColor={countColor}
      badgeStyle={badgeStyle}
      username={debounceUsername}>
      <div>
        <div className="pb-4 border-b border-gray-200">
          <h3 className="text-xl leading-6 font-medium text-gray-900">Create your visitor badge</h3>
          <p className="mt-2 max-w-4xl text-base text-gray-500">
            Fill in the following form to get your visitor badge Markdown and image URL.
          </p>
        </div>

        <div className={`my-4 mb-12`}>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                URL or Username/Repository
              </label>
              <input
                type="text"
                name="username"
                id="username"
                autoComplete="username"
                value={username}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Example: https://github.com/estruyf/github-visitors-badge or estruyf/github-visitors-badge"
                onChange={usernameChange}
              />
            </div>

            <div className="col-span-12">
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

            <Dropdown items={labelStyles} selected={labelStyle} title={`Label style`} triggerUpdate={(style) => setLabelStyle(style)} />
          </div>
        </div>
      </div>

      <div className={`mt-16`}>
        <div className="pb-4 border-b border-gray-200">
          <h3 className="text-xl leading-6 font-medium text-gray-900">The code for you to use</h3>
          <p className="mt-2 max-w-4xl text-base text-gray-500">
            You can use the generated Markdown code or image URL in any of your projects.
          </p>
        </div>

        <div className="my-4 grid grid-cols-6 gap-6">

          <CopyField title={`Markdown`} value={getMarkdownCode()} />

          <CopyField title={`Markdown with status link`} value={getMarkdownCodeWithStatus()} />

          <CopyField title={`HTML`} value={getHtmlLink()} />

          <CopyField title={`Image URL`} value={getLink()} />

          {
            getLink() && (
              <div className="col-span-6">
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  Result
                </label>

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={getLink()} alt="Visitor badge" />
              </div>
            )
          }
        </div>
      </div>

      <div className={`mt-16`}>
        <div className="mt-8 pb-4 border-b border-gray-200">
          <h3 className="text-xl leading-6 font-medium text-gray-900">Follow up on your visitor hits</h3>
          <p className="mt-2 max-w-4xl text-base text-gray-500">
            You can keep track of your total hits and <b>two day</b> visitor overview on our status page. By supporting the project, you can extend this to <b>seven days</b>.
          </p>
        </div>

        <div className="my-4">
          <div className="text-sm">
            <div>
              <label htmlFor="status" className="block font-medium text-gray-700">
                Status page
              </label>

              {
                getStatusLink() ? (
                  <Link
                    href={getStatusLink()}
                    id="status"
                    className="block mt-1 text-yellow-700 hover:text-yellow-500 underline underline-offset-2"
                    title='Open status page in new tab'
                    target="_blank"
                    rel="noopener noreferrer">
                    {process.env.NEXT_PUBLIC_SITE_URL}/status?path={`${username || "<URL or Username/Repository>"}`}
                  </Link>
                ) : (
                  <p className="mt-1 block w-full sm:text-sm text-blue-500">No link, please fill in a URL.</p>
                )
              }
            </div>
          </div>
        </div>
      </div>
    </Page>
  </>;
}
