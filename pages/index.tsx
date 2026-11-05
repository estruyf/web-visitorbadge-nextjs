import Head from 'next/head'
import React, { SyntheticEvent, useState } from 'react';
import { Page } from '../components/Page';
import { ColorPicker } from '../components/ColorPicker';
import { API } from '../constants/API';
import { SegmentedControl } from '../components/SegmentedControl';
import { Favicons } from '../components/Favicons';
import { Snippets } from '../components/Snippets';
import { BadgeSample } from '../components/BadgeSample';
import { useDebounce } from '../hooks/useDebounce';

const defaultLabelColor = "#555555";

const inputStyle = "mt-2 block w-full bg-white border border-line rounded-lg py-2.5 px-3 text-base text-ink-900 placeholder-ink-500 hover:border-ink-300 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500";

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
      <title>Create your visitor counter/badge</title>
      <meta name="description" content="Create your visitor counter/badge which you can use on your website or GitHub profile." />
      <meta property="og:description" content="Create your visitor counter/badge which you can use on your website or GitHub profile." />
      <meta property="twitter:description" content="Create your visitor counter/badge which you can use on your website or GitHub profile." />

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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <section className="lg:col-span-5">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-ink-900">Create your visitor counter/badge</h2>
          <p className="mt-2 text-base text-ink-500">
            Fill in the following form to get your visitor badge Markdown and image URL.
          </p>

          <div className="mt-6 space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-ink-900">
                URL or Username/Repository
              </label>
              <input
                type="text"
                name="username"
                id="username"
                autoComplete="off"
                value={username}
                className={inputStyle}
                placeholder="estruyf/github-visitors-badge"
                onChange={usernameChange}
              />
              <p className="mt-1.5 text-sm text-ink-500">A full URL works too, for example https://www.eliostruyf.com</p>
            </div>

            <div>
              <label htmlFor="label" className="block text-sm font-semibold text-ink-900">
                Label
              </label>
              <input
                type="text"
                name="label"
                id="label"
                value={label}
                autoComplete="off"
                className={inputStyle}
                placeholder="Default: VISITORS"
                onChange={labelChange}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <ColorPicker color={labelColor} title={`Label background`} updateColor={(color) => setLabelColor(color)} />

              <ColorPicker color={countColor} title={`Count background`} updateColor={(color) => setCountColor(color)} />
            </div>

            <SegmentedControl items={styles} selected={badgeStyle} title={`Badge style`} triggerUpdate={(style) => setBadgeStyle(style)} />

            <SegmentedControl items={types} selected={badgeType} title={`Badge type`} triggerUpdate={(type) => setBadgeType(type)} />

            <SegmentedControl items={labelStyles} selected={labelStyle} title={`Label style`} triggerUpdate={(style) => setLabelStyle(style)} />
          </div>
        </section>

        <section className="lg:col-span-7 lg:sticky lg:top-6 space-y-6">
          <div>
            <div className="stage flex items-center justify-center min-h-[11rem] p-6 border border-line rounded-2xl">
              {
                getLink() ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={getLink()} className="max-w-full" alt="Visitor badge" />
                ) : (
                  <BadgeSample
                    label={label}
                    labelColor={labelColor}
                    countColor={countColor}
                    badgeStyle={badgeStyle}
                    badgeType={badgeType}
                    labelStyle={labelStyle}
                  />
                )
              }
            </div>
            <p className="mt-2 text-sm text-ink-500">
              {getLink() ? 'Your live badge.' : 'Sample preview. Add a URL to load your real badge.'}
            </p>
          </div>

          <div>
            <h2 className="font-heading text-2xl font-bold text-ink-900">The code for you to use</h2>
            <p className="mt-1 mb-4 text-base text-ink-500">
              You can use the generated Markdown code or image URL in any of your projects.
            </p>

            <Snippets snippets={[
              { title: `Markdown`, value: getMarkdownCode() },
              { title: `Markdown with status link`, value: getMarkdownCodeWithStatus() },
              { title: `HTML`, value: getHtmlLink() },
              { title: `Image URL`, value: getLink() }
            ]} />
          </div>
        </section>
      </div>
    </Page>
  </>;
}
