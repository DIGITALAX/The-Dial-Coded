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
