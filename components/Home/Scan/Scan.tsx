import { FunctionComponent } from "react";
import Search from "./modules/Search/Search";
import BackgroundImage from "./modules/BackgroundImage";
import Marquee from "./modules/Marquee";
import SideText from "./modules/SideText";
import Turner from "./modules/Turner";
import useScan from "./hooks/useScan";

const Scan: FunctionComponent = (): JSX.Element => {
  const {
    currentSetting,
    setCount,
    canvasURIs,
    mainImage,
    imageArtist,
    imageDescription,
    imageTitle,
  } = useScan();
  return (
    <div className="relative w-full h-full row-start-1 grid grid-flow-row auto-rows-auto">
      <BackgroundImage currentSetting={currentSetting} mainImage={mainImage} />
      <div className="relative w-full h-screen px-6 grid grid-flow-col auto-cols-auto row-start-1">
        <SideText
          currentSetting={currentSetting}
          imageArtist={imageArtist}
          imageDescription={imageDescription}
          imageTitle={imageTitle}
        />
        <Turner
          canvasURIs={canvasURIs}
          currentSetting={currentSetting}
          setCount={setCount}
        />
      </div>
      <Marquee />
      <Search />
    </div>
  );
};

export default Scan;
