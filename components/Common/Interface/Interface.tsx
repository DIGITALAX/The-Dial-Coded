import { FunctionComponent } from "react";
import Box from "./Box";
import { InterfaceProps } from "../types/common.types";
import MainDisplay from "./MainDisplay";

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
          <MainDisplay
            row={"2"}
            width={"[80vw"}
            height={"full"}
            title={title}
          />
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
