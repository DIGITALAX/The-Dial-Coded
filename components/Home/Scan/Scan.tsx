import { FunctionComponent } from "react";
import Search from "./Search/Search";
import BackgroundImage from "./BackgroundImage";
import Marquee from "./Marquee";
import SideText from "./SideText";
import Turner from "./Turner";

const Scan: FunctionComponent = (): JSX.Element => {
  return (
    <div className="relative w-full h-full row-start-1 grid grid-flow-row auto-rows-auto">
      <BackgroundImage />
      <div className="relative w-full h-screen px-6 grid grid-flow-col auto-cols-auto row-start-1">
        <SideText />
        <Turner />
      </div>
      <Marquee />
      <Search />
    </div>
  );
};

export default Scan;
