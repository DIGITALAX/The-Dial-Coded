import { FunctionComponent } from "react";
import Badge from "../../Common/Badge/Badge";
import Record from "../../Common/Badge/Record";
import Rewind from "../../Common/Miscellaneous/Rewind/Rewind";
import useBadges from "./hooks/useBadges";
import { BadgeInfo } from "./types/badges.types";

const Badges: FunctionComponent = (): JSX.Element => {
  const {
    badgeInfo,
    records,
    totalPages,
    currentPage,
    handlePageDecrease,
    handlePageIncrease,
  } = useBadges();
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
          <Rewind
            row={"1"}
            handleValueChange={handlePageIncrease}
            limitValue={totalPages}
            currentValue={currentPage}
          />
          <Rewind
            row="2"
            scale="-1"
            handleValueChange={handlePageDecrease}
            limitValue={1}
            currentValue={currentPage}
          />
        </div>
        <div className="relative w-fit h-fit font-dosis text-black place-self-center text-right text-[1.5vw] col-start-2">
          canvas and drafts as process in the public memory <br />
          audience growth through reach and reflex <br />
          records
        </div>
        <div className="relative col-start-3 w-fit h-full grid grid-cols-5 grid-flow-col-dense grid-rows-3 gap-3 justify-self-end">
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
