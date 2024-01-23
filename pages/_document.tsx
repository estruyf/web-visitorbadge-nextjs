import Document, { Html, Head, Main, NextScript } from 'next/document'

export const GA_TRACKING_ID = "G-HMZMVK7EWS";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link href="https://fonts.googleapis.com/css2?family=Baloo+2&family=Montserrat:wght@400;500&display=swap" rel="stylesheet" />

          <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} />
          <script dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${GA_TRACKING_ID}', {
              'page_path': window.location.pathname,
              'anonymize_ip': true
            });`}} />

        </Head>
        <body className={`font-body`}>
          <Main />

          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument