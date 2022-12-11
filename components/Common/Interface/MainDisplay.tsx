import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { MainDisplayProps } from "../types/common.types";
import ButtonIcon from "./ButtonIcon";
import Line from "./Line";
import Panel from "./Panel";
import Tape from "./Tape";

const MainDisplay: FunctionComponent<MainDisplayProps> = ({
  row,
  width,
  height,
  title,
  tapeTitles,
}): JSX.Element => {
  return (
    <div
      className={`relative row-start-${row} bg-white w-${width} h-${height} rounded-lg p-1 grid grid-flow-col auto-cols-auto`}
    >
      <div className="col-start-1 relative w-full h-full bg-comp p-4 grid grid-flow-row auto-rows-auto self-start gap-4 rounded">
        <div className="relative w-full h-fit row-start-1 grid grid-flow-col auto-cols-auto gap-4">
          <div className="relative w-fit h-fit col-start-1 grid grid-flow-col auto-cols-auto gap-4 self-center justify-self-start">
            <ButtonIcon
              width={"12"}
              height={"12"}
              bgColor={"yell"}
              col={"1"}
              justify={"start"}
              self={"center"}
            />
            <Line col={"2"} width={"60"} />
          </div>
          <div className="relative w-fit h-fit font-digiB text-black text-2xl uppercase col-start-2 text-center place-self-center px-10">
            *{title}*
          </div>
          <div className="relative w-fit h-fit col-start-3 justify-self-end self-center grid grid-flow-col auto-cols-auto gap-4">
            <Line col={"1"} width={"60"} />
            <div className="relative w-fit h-fit col-start-2 grid grid-flow-col auto-cols-auto gap-6 self-center justify-self-end">
              <ButtonIcon
                width={"12"}
                height={"12"}
                bgColor={"yell"}
                col={"1"}
                image={"QmSMt1Et6xQZA6RikNoHg4HQQNeZZLX5Ho7QtmyZmMTGdd"}
                justify={"start"}
                self={"center"}
              />
              <ButtonIcon
                width={"12"}
                height={"12"}
                bgColor={"yell"}
                col={"2"}
                image={"QmURfK4nEow8epVW2B4o9G7F5A2jFbDRX1gE78A988krNw"}
                justify={"end"}
                self={"center"}
              />
            </div>
          </div>
        </div>
        <div className="relative w-full h-full row-start-2 border-4 border-black grid grid-flow-row auto-rows-auto">
          <div className="relative w-full h-full row-start-1 grid grid-flow-col auto-cols-auto">
            <div className="relative col-start-1 min-w-full h-fit bg-dullY grid grid-flow-row auto-rows-auto w-full">
              <div className="relative w-full h-fit row-start-1 grid grid-flow-col auto-cols-auto">
                <Panel height={"16"} col={"1"} width={"full"} />
                <Panel height={"16"} col={"2"} width={"full"} />
              </div>
              <div className="relative w-full h-96 row-start-2"></div>
            </div>
            <div className="relative col-start-2 w-fit max-w-fit h-fit grid grid-flow-row auto-rows-auto overflow-y-scroll border-y-4 border-l-4 border-black justify-self-end">
              {tapeTitles?.map((title: string, index: number) => {
                return (
                  <Tape
                    bgColor={"feedBackground"}
                    title={title}
                    index={index}
                  />
                );
              })}
            </div>
          </div>
          <div className="relative w-full h-full row-start-2">hey</div>
        </div>
      </div>
    </div>
  );
};

export default MainDisplay;
