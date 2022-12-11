import { FunctionComponent } from "react";
import Badge from "../../Common/Badge/Badge";
import Rewind from "../../Common/Rewind/Rewind";
import useBadges from "./hooks/useBadges";

const Badges: FunctionComponent = (): JSX.Element => {
  const { badges, badgeColor, badgeImage } = useBadges();
  return (
    <div className="relative bg-white p-10 w-full h-full grid grid-flow-row auto-rows-auto gap-5">
      <div className="relative w-full h-full row-start-1 grid grid-flow-col auto-cols-auto pb-20">
        <div className="relative uppercase w-fit h-fit text-black font-dosis text-center text-4xl place-self-center leading-loose">
          great place for <br />
          some text here
        </div>
      </div>
      <div className="relative row-start-2 w-full h-full grid grid-flow-row auto-rows-auto gap-5 col-span-1">
        <div className="relative w-fit h-full col-start-1 grid grid-flow-row auto-rows-auto gap-8 col-span-1">
          <Rewind row={"1"} />
          <Rewind row="2" scale="-1" />
        </div>
        <div className="relative w-fit h-fit font-dosis text-black place-self-center text-right text-[1.5vw] col-start-2">
          canvas and drafts as process in the public memory <br />
          audience growth through reach and reflex <br />
          records
        </div>
        <div className="relative col-start-3 w-fit h-full grid grid-cols-5 grid-flow-col-dense grid-rows-3 gap-3 justify-self-end">
          {badges?.map((badge: string, index: number) => {
            return (
              <Badge
                badge={badge}
                index={index}
                badgeColor={badgeColor}
                badgeImage={badgeImage}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Badges;
