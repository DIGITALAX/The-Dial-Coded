import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { MainDisplayProps } from "../types/common.types";
import ButtonIcon from "./ButtonIcon";
import Line from "./Line";
import Panel from "./Panel";
import Tape from "./Tape";
import NotificationsBar from "./Notifications/NotificationsBar";
import MixtapeSwitch from "../../Home/Layout/Mixtape/MixtapeSwitch";
import { INFURA_GATEWAY } from "../../../lib/lens/constants";
import AccountSwitch from "../../Home/Layout/Account/AccountSwitch";
import InfiniteScroll from "react-infinite-scroll-component";
import { useMediaQuery } from "@material-ui/core";
import FetchMoreLoading from "../Loaders/FetchMoreLoading";

const MainDisplay: FunctionComponent<MainDisplayProps> = ({
  row,
  title,
  tapeTitles,
  handleTapeSet,
  images,
  message,
  sideImage,
  backgroundImages,
  mixtape,
  loader,
  more,
}): JSX.Element => {
  let queryWindowSize1170: boolean = useMediaQuery("(max-width:1170px)");
  let queryWindowSize830: boolean = useMediaQuery("(max-width:830px)");
  return (
    <div
      className={`relative row-start-${row} bg-white w-full h-fit rounded-lg f5:p-1 flex flex-row`}
    >
      <div className="relative w-full h-fit bg-comp f5:p-4 flex flex-col gap-4 rounded items-center">
        <div className="relative w-full h-fit gap-4 flex flex-row grow">
          <div className="relative w-fit h-fit col-start-1 grid grid-flow-col auto-cols-auto gap-4 self-center justify-self-start hidden sm:contents row-start-1">
            <ButtonIcon
              width={"12"}
              height={"12"}
              col={"1"}
              justify={"start"}
              self={"center"}
            />
            <Line
              col={"2"}
              width={
                !queryWindowSize1170 ? "60" : !queryWindowSize830 ? "20" : "5"
              }
            />
          </div>
          <div className="relative w-fit h-fit font-digiB text-black text-2xl uppercase col-start-1 sm:col-start-2 text-center place-self-center px-10 row-start-1 grow f5:py-0 py-2">
            *{title}*
          </div>
          <div className="relative w-fit h-fit col-start-3 justify-self-end self-center grid grid-flow-col auto-cols-auto gap-4 hidden sm:contents row-start-1">
            <Line
              col={"1"}
              width={
                !queryWindowSize1170 ? "60" : !queryWindowSize830 ? "20" : "5"
              }
            />
            <div className="relative w-fit h-fit col-start-2 grid grid-flow-col auto-cols-auto gap-6 self-center justify-self-end">
              <ButtonIcon
                width={"12"}
                height={"12"}
                col={"1"}
                image={"QmSMt1Et6xQZA6RikNoHg4HQQNeZZLX5Ho7QtmyZmMTGdd"}
                justify={"start"}
                self={"center"}
              />
              <ButtonIcon
                width={"12"}
                height={"12"}
                col={"2"}
                image={"QmURfK4nEow8epVW2B4o9G7F5A2jFbDRX1gE78A988krNw"}
                justify={"end"}
                self={"center"}
              />
            </div>
          </div>
        </div>
        <div className="relative w-full h-full row-start-2 border galaxy:border-4 border-black grid grid-flow-col auto-cols-auto">
          <div className="relative w-full h-full flex flex-col f4:flex-row">
            <div className="relative h-full bg-dullY flex flex-col w-full">
              <Image
                src={`${INFURA_GATEWAY}/ipfs/QmTLN24oXMbEj3QgHX7dD3GWnYwL2GqsP16yvLzm29bk5X`}
                objectFit="cover"
                layout="fill"
                className="absolute"
                draggable={false}
              />
              <div className="relative w-full h-fit hidden f4:grid grid-flow-col auto-cols-auto">
                <Panel col={"1"} />
                <Panel col={"2"} />
              </div>
              <div className="relative w-full f3:min-w-[55rem] w-full h-full grid grid-flow-col auto-cols-auto p-px galaxy:p-2 f5:p-4 self-start">
                {mixtape ? <MixtapeSwitch /> : <AccountSwitch />}
              </div>
            </div>
            <div
              className={`relative w-full h-full contents f3:border-y-4 f3:border-l-4 border-black bg-offBlack overflow-y-scroll`}
            >
              <div
                className="relative min-w-fit h-fit max-h-[50rem] flex flex-col overflow-y-scroll bg-comp"
                id="scrollable"
              >
                {mixtape && (
                  <Tape
                    title="Add New Mixtape"
                    key={1}
                    index={1}
                    handleTapeSet={handleTapeSet}
                    bgColor={"record10"}
                  />
                )}
                <InfiniteScroll
                  // height={"30rem"}
                  scrollableTarget={"scrollable"}
                  loader={<FetchMoreLoading />}
                  hasMore={mixtape ? true : false}
                  next={more ? more : () => {}}
                  dataLength={tapeTitles.length}
                  className={`relative w-full h-fit overflow-y-scroll grid grid-cols-1 f4:grid-cols-1 md:grid-cols-2 auto-rows-auto`}
                  style={{ color: "#131313", fontFamily: "Digi Reg" }}
                >
                  {tapeTitles?.map((title: string, index: number) => {
                    return (
                      <Tape
                        handleTapeSet={handleTapeSet}
                        key={index}
                        bgColor={"feedBackground"}
                        title={title}
                        index={index}
                        sideImage={sideImage}
                        backgroundImages={backgroundImages}
                        mixtape={mixtape}
                        loader={loader}
                      />
                    );
                  })}
                </InfiniteScroll>
                {tapeTitles.length < 11 && (
                  <div
                    className={`relative hidden f4:grid w-full h-full row-start-${
                      tapeTitles.length + 2
                    }`}
                  >
                    {Array.from(Array(11 - tapeTitles.length).keys()).map(
                      (index: number) => {
                        return (
                          <Tape
                            key={index}
                            handleTapeSet={handleTapeSet}
                            bgColor={"feedBackground"}
                            locked={true}
                            index={index}
                            sideImage={
                              "QmRFAf3en6jmyETP2bh2e4nDjmQsxjv7vU7m7q9VhF88Rd"
                            }
                            loader={loader}
                          />
                        );
                      }
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="relative w-full h-full row-start-2">
            <NotificationsBar images={images} message={message} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainDisplay;
