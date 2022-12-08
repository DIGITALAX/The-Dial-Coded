import { FunctionComponent } from "react";
import MarqueeText from "react-fast-marquee";

const Marquee: FunctionComponent = (): JSX.Element => {
  return (
    <div className="absolute w-full h-fit grid grid-flow-col auto-cols-auto row-start-2 self-end pb-14">
      <MarqueeText gradient={false} speed={30} direction={"right"}>
        <div className="relative w-full h-fit text-white font-dosis uppercase leading-30 text-[12vw]">
          {" "}
          some kind of big text some kind of big text{" "}
        </div>
      </MarqueeText>
    </div>
  );
};

export default Marquee;
