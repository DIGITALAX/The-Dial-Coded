import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import Box from "../Box/Box";
import { InterfaceProps } from "../types/common.types";

const Interface: FunctionComponent<InterfaceProps> = ({
  title,
}): JSX.Element => {
  return (
    <div className="relative w-screen h-full p-10 col-start-1 grid grid-flow-col auto-cols-auto">
      <div className="relative col-start-1 w-fit h-full bg-gradient-to-r from-offBlack via-black/70 to-offBlack rounded-lg grid grid-flow-col auto-cols-auto pt-4 px-4 pb-10 gap-8 justify-self-center">
        <div className="relative w-fit h-full col-start-1 grid grid-flow-row auto-rows-auto gap-8 justify-between">
          <div className="relative row-start-1 place-self-start w-fit h-fit grid grid-flow-row auto-rows-auto gap-6">
            <Box
              image={""}
              col={"1"}
              row={"1"}
              self={"start"}
              justify={"start"}
            />
            <Box
              image={""}
              col={"1"}
              row={"2"}
              self={"start"}
              justify={"start"}
            />
          </div>
          <Box image={""} col={"1"} row={"2"} self={"end"} justify={"start"} />
        </div>
        <div className="relative w-full h-fit col-start-2 grid grid-flow-row auto-rows-auto gap-6">
          <div className="relative row-start-1 w-full h-fit grid grid-flow-col auto-cols-auto self-start justify-between">
            <Box
              image={""}
              col={"1"}
              row={"1"}
              self={"center"}
              justify={"start"}
            />
            <Box
              image={""}
              col={"2"}
              row={"1"}
              self={"center"}
              justify={"end"}
            />
          </div>
          <div className="relative row-start-2 bg-white w-[80vw] h-full rounded-lg p-1 grid grid-flow-col auto-cols-auto">
            <div className="col-start-1 relative w-full h-full bg-comp p-4 grid grid-flow-row auto-rows-auto self-start gap-4 rounded">
              <div className="relative w-full h-fit row-start-1 grid grid-flow-col auto-cols-auto gap-4">
                <div className="relative w-fit h-fit col-start-1 grid grid-flow-col auto-cols-auto gap-4 self-center justify-self-start">
                  <div className="relative w-fit col-start-1 border-4 w-12 h-12 border-black bg-yell grid grid-flow-row auto-rows-auto p-px self-center justify-self-start">
                    <div className="relative row-start-1 w-full h-1 bg-white justify-self-center self-start"></div>
                    <div className="relative row-start-2 w-2/3 justify-self-center self-end bg-black border border-white h-1.5"></div>
                  </div>
                  <div className="relative w-60 h-full col-start-2 grid grid-flow-row auto-rows-auto gap-2 place-self-center">
                    <div className="relative w-full h-2 bg-white border-b-2 border-dcomp row-start-1 place-self-center"></div>
                    <div className="relative w-full h-2 bg-white border-b-2 border-dcomp row-start-2 place-self-center"></div>
                    <div className="relative w-full h-2 bg-white border-b-2 border-dcomp row-start-3 place-self-center"></div>
                  </div>
                </div>
                <div className="relative w-fit h-fit font-digiB text-black text-2xl uppercase col-start-2 text-center place-self-center">
                  *{title}*
                </div>
                <div className="relative w-fit h-fit col-start-3 justify-self-end self-center grid grid-flow-col auto-cols-auto gap-4">
                  <div className="relative w-60 h-full col-start-1 grid grid-flow-row auto-rows-auto gap-2 place-self-center">
                    <div className="relative w-full h-2 bg-white border-b-2 border-dcomp row-start-1 place-self-center"></div>
                    <div className="relative w-full h-2 bg-white border-b-2 border-dcomp row-start-2 place-self-center"></div>
                    <div className="relative w-full h-2 bg-white border-b-2 border-dcomp row-start-3 place-self-center"></div>
                  </div>
                  <div className="relative w-fit h-fit col-start-2 grid grid-flow-col auto-cols-auto gap-6 self-center justify-self-end">
                    <div className="relative col-start-1 border-4 w-12 h-12 border-black grid grid-flow-row auto-rows-auto p-px self-center justify-self-end">
                      <Image
                        src="https://thedial.infura-ipfs.io/ipfs/QmSMt1Et6xQZA6RikNoHg4HQQNeZZLX5Ho7QtmyZmMTGdd"
                        layout="fill"
                        objectFit="cover"
                        objectPosition={"center"}
                        className="absolute"
                      />
                      <div className="relative row-start-1 w-full h-1 bg-white justify-self-center self-start"></div>
                    </div>
                    <div className="relative col-start-2 border-4 w-12 h-12 border-black grid grid-flow-row auto-rows-auto p-px self-center justify-self-end">
                      <Image
                        src="https://thedial.infura-ipfs.io/ipfs/QmURfK4nEow8epVW2B4o9G7F5A2jFbDRX1gE78A988krNw"
                        layout="fill"
                        objectFit="cover"
                        objectPosition={"center"}
                        className="absolute"
                      />
                      <div className="relative row-start-1 w-full h-1 bg-white justify-self-center self-start"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative w-full h-full row-start-2 border-4 border-black grid grid-flow-row auto-rows-auto">
                <div className="relative w-full h-full row-start-1 grid grid-flow-col auto-cols-auto">
                  <div className="relative col-start-1 w-full h-full bg-dullY grid grid-flow-row auto-rows-auto">
                    <div className="relative w-full h-full row-start-1 grid grid-flow-col auto-cols-auto">
                      <div className="relative w-full h-16 col-start-1 border-4 border-black bg-comp grid grid-flow-col auto-cols-auto">
                        <div className="relative col-start-1 w-full h-2 bg-white"></div>
                      </div>
                      <div className="relative w-full h-16 col-start-2 border-4 border-black bg-comp grid grid-flow-col auto-cols-auto">
                        <div className="relative col-start-1 w-full h-2 bg-white"></div>
                      </div>
                    </div>
                    <div className="relative w-full h-full row-start-2"></div>
                  </div>
                  <div className="relative col-start-2 w-80 h-full grid grid-flow-row auto-rows-auto overflow-y-scroll border-4 border-black justify-self-end">
                    <div className="relative w-full h-20 bg-white"></div>
                  </div>
                </div>
                <div className="relative w-full h-full row-start-2">hey</div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative w-fit h-full justify-between col-start-3 grid grid-flow-row auto-rows-auto gap-8 justify-self-end">
          <Box image={""} col={"1"} row={"1"} self={"start"} justify={"end"} />
          <div className="relative row-start-2 place-self-end w-fit h-fit grid grid-flow-row auto-rows-auto gap-6">
            <Box image={""} col={"1"} row={"1"} self={"end"} justify={"end"} />
            <Box image={""} col={"1"} row={"2"} self={"end"} justify={"end"} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interface;
