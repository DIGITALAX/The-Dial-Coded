import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../lib/lens/constants";
import Badge from "../../Common/Badge/Badge";
import Record from "../../Common/Badge/Record";
import Rewind from "../../Common/Miscellaneous/Rewind/Rewind";
import useBadges from "./hooks/useBadges";
import { BadgeInfo } from "./types/badges.types";
import { useMediaQuery } from "@material-ui/core";

const Badges: FunctionComponent = (): JSX.Element => {
  const {
    badgeInfo,
    records,
    totalPages,
    currentPage,
    handlePageDecrease,
    handlePageIncrease,
  } = useBadges();
  let queryWindowSize768: boolean = useMediaQuery("(max-width:768px)");
  return (
    <div className="relative bg-white bottom-0 p-10 w-full h-full grid grid-flow-row auto-rows-auto gap-5 z-0 row-start-1">
      <div className="relative w-full h-full row-start-1 col-start-1 grid grid-flow-col auto-cols-auto py-32">
        <div className="relative uppercase w-2/3 h-fit text-black font-digiB text-center text-base md:text-3xl place-self-center leading-loose">
          Shrink the distance between drafts, awards winning creation, and
          casual reactions to your infinite record collection.
        </div>
      </div>
      <div className="relative row-start-2 w-fit lg:w-full h-full grid grid-flow-row auto-rows-auto gap-5">
        <div className="relative w-fit h-full col-span-3 col-start-1 grid grid-flow-row auto-rows-auto gap-8 md:col-span-1 lg:row-start-1 row-start-2 lg:justify-self-start justify-self-center justify-self-start">
          <Rewind
            row={queryWindowSize768 ? "2" : "1"}
            scale={queryWindowSize768 ? "-1" : "1"}
            handleValueChange={
              queryWindowSize768 ? handlePageDecrease : handlePageIncrease
            }
            limitValue={queryWindowSize768 ? 1 : totalPages}
            currentValue={currentPage}
          />
          <Rewind
            row={"2"}
            handleValueChange={
              queryWindowSize768 ? handlePageIncrease : handlePageDecrease
            }
            limitValue={queryWindowSize768 ? totalPages : 1}
            currentValue={currentPage}
          />
        </div>
        <div className="relative w-full lg:w-2/3 h-80 lg:h-full py-3 place-self-center col-start-1 lg:col-start-2 row-start-1 lg:col-span-1 col-span-3">
          <div className="relative w-full h-full grid grid-flow-col auto-cols-auto">
            <div className="absolute object-cover w-full h-full bg-black">
              <Image
                alt="badgeMain"
                src={`${INFURA_GATEWAY}/ipfs/Qmb3eWA9cT1VTfpM6QG4bYCeGziCzA7A3NeU3CqLAAYiwQ`}
                layout="fill"
                objectFit="cover"
                className="opacity-60"
              />
            </div>
            <div className="relative w-2/3 h-fit text-center text-sm f2:text-base md:text-[1.3rem] lg:text-[1.2vw] font-dosis text-white px-3 place-self-center">
              Struck by the sheer number and size of the waves, we watched in
              fascination as one collector after another scanned the records.
              This machine transforming its contents into a dazzling display of
              light and sound.
            </div>
          </div>
        </div>
        <div className="lg:row-start-1 row-start-3 md:row-start-2 relative col-start-1 col-span-3 md:col-start-2 md:col-span-2 lg:col-span-1 lg:col-start-3 w-fit h-full grid grid-cols-2 f2:grid-cols-3 md:grid-cols-5 md:grid-flow-col-dense md:grid-rows-3 gap-3 justify-self-center lg:justify-self-end">
          {(currentPage === 1 ? badgeInfo : records)?.map(
            (image: string | BadgeInfo, index: number) => {
              return currentPage === 1 ? (
                <Badge
                  key={index}
                  index={index}
                  badgeInfo={image as BadgeInfo}
                />
              ) : (
                <Record
                  index={index}
                  key={index}
                  recordImage={image as string}
                />
              );
            }
          )}
        </div>
      </div>
    </div>
  );
};

export default Badges;
