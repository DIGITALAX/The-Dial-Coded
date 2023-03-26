import NextDocument, { Html, Head, Main, NextScript } from "next/document";
import React from "react";

class Document extends NextDocument {
  render() {
    return (
      <Html>
        <Head>
          <meta name="og:url" content="https://thedial.xyz/" />
          <meta name="og:title" content="The Dial" />
          <meta
            name="og:description"
            content="An ever evolving canvas you can use with friends."
          />
          <meta name="og:image" content="https://thedial.xyz/card.png/" />
          <meta name="twitter:card" content="summary" />
          <meta name="og:url" content="https://thedial.xyz/" />
          <meta name="og:image" content="https://thedial.xyz/card.png/" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@igitalax_" />
          <meta name="twitter:creator" content="@digitalax_" />
          <meta name="twitter:image" content="https://thedial.xyz/card.png/" />
          <meta name="twitter:url" content="https://thedial.xyz/" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="canonical" href="https://thedial.xyz/" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="true"
          />
          <link
            rel="preload"
            href="/fonts/DosisRegular.ttf"
            as="font"
            crossOrigin=""
            type="font/ttf"
          />
          <link
            rel="preload"
            href="/fonts/DS-DIGI.ttf"
            as="font"
            crossOrigin=""
            type="font/ttf"
          />
          <link
            rel="preload"
            href="/fonts/DS-DIGIT.ttf"
            as="font"
            crossOrigin=""
            type="font/ttf"
          />
          <link
            rel="preload"
            href="/fonts/DS-DIGII.ttf"
            as="font"
            crossOrigin=""
            type="font/ttf"
          />
          <link
            rel="preload"
            href="/fonts/DS-DIGIB.ttf"
            as="font"
            crossOrigin=""
            type="font/ttf"
          />
          <link
            rel="preload"
            href="/fonts/ClashDisplay.ttf"
            as="font"
            crossOrigin=""
            type="font/ttf"
          />
          <link
            rel="preload"
            href="/fonts/DonJoseBigote.ttf"
            as="font"
            crossOrigin=""
            type="font/ttf"
          />
          <link
            rel="preload"
            href="/fonts/Satoshi-Medium.otf"
            as="font"
            crossOrigin=""
            type="font/otf"
          />
          <link
            rel="preload"
            href="/fonts/multiple.otf"
            as="font"
            crossOrigin=""
            type="font/otf"
          />
          <link
            rel="preload"
            href="/fonts/EarlsRevenge.ttf"
            as="font"
            crossOrigin=""
            type="font/ttf"
          />
          <link
            rel="preload"
            href="/fonts/HermanoAltoStamp.ttf"
            as="font"
            crossOrigin=""
            type="font/ttf"
          />
          <style
            dangerouslySetInnerHTML={{
              __html: `
              @font-face {
                font-family: "Dosis Regular";
                font-weight: 400;
                src: url("./fonts/DosisRegular.ttf");
              }

              @font-face {
                font-family: "Digi Reg";
                font-weight: 400;
                src: url("./fonts/DS-DIGI.ttf");
              }
              
              @font-face {
                font-family: "Digi Bold";
                font-weight: 400;
                src: url("./fonts/DS-DIGIB.ttf");
              }
              
              @font-face {
                font-family: "Digi Italic";
                font-weight: 400;
                src: url("./fonts/DS-DIGII.ttf");
              }
              
              @font-face {
                font-family: "Digi T";
                font-weight: 400;
                src: url("./fonts/DS-DIGIT.ttf");
              }

              @font-face {
                font-family: "Clash Display";
                font-weight: 400;
                src: url("./fonts/ClashDisplay.ttf");
              }

              @font-face {
                font-family: "Don Jose";
                font-weight: 400;
                src: url("./fonts/DonJoseBigote.ttf");
              }

              @font-face {
                font-family: "Satoshi";
                font-weight: 400;
                src: url("./fonts/Satoshi-Medium.otf");
              }

              @font-face {
                font-family: "Multiple";
                font-weight: 400;
                src: url("./fonts/multiple.otf");
              }

              @font-face {
                font-family: "Earls Revenge";
                font-weight: 400;
                src: url("./fonts/EarlsRevenge.ttf");
              }

              @font-face {
                font-family: "Hermano";
                font-weight: 400;
                src: url("/fonts/HermanoAltoStamp.ttf");
              }
            `,
            }}
          ></style>
        </Head>
        <body>
          <script>0</script>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default Document;
