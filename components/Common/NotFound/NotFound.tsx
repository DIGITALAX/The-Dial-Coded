import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../lib/lens/constants";

const NotFound: FunctionComponent = (): JSX.Element => {
  const router = useRouter();
  return (
    <div className="relative w-full h-screen grid grid-flow-col auto-cols-auto bg-black/70">
      <Head>
        <title>{"Page Not Found"}</title>
        <meta name="og:url" content={`https://thedial.xyz/`} />
        <meta name="og:title" content={"Page Not Found"} />
        <meta name="og:description" content={"Frequency out of range."} />
        <meta property="og:site_name" content="The Dial" />
        <meta property="og:image" content="https://thedial.xyz/card.png/" />
        <meta name="twitter:image" content="https://thedial.xyz/card.png/" />
        <meta name="twitter:url" content="https://thedial.xyz/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="og:type" content="website" />
        <meta name="twitter:site" content="@digitalax" />
        <meta name="twitter:creator" content="@digitalax" />
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
          href="/fonts/DonJoseBigote.ttf"
          as="font"
          crossOrigin=""
          type="font/ttf"
        />
      </Head>
      <div className="col-start-1 relative w-fit h-fit grid grid-flow-row auto-rows-auto place-self-center gap-10">
        <div className="relative w-fit h-fit place-self-center font-digiB text-offWhite text-2xl text-center row-start-1">
          Frequency out of range. <br />
          <br /> Scan your dial to try again.
        </div>
        <div
          className="relative place-self-center w-60 h-60 hover:rotate-3 active:rotate-6 row-start-2"
          onClick={() => router.push("/")}
        >
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmQZ8UwjeizDQkbCiZED8Ya4LxpFD5JbVbNeAdowurHkiY`}
            className="relative w-fit h-fit relative cursor-pointer"
            width={100}
            height={100}
            alt="dial"
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
};

export default NotFound;
