import { FunctionComponent } from "react";
import { TopicValuesProps } from "../types/common.types";

const TopicValues: FunctionComponent<TopicValuesProps> = ({index, value}): JSX.Element => {
  return (
    <div
      key={index}
      className={`relative w-fit h-fit col-start-${
        index + 1
      } grid grid-flow-col auto-cols-auto whitespace-nowrap`}
    >
      <div className="relative w-fit h-fit text-black font-dosis text-sm col-start-1 place-self-center underline underline-offset-2 cursor-pointer hover:text-offBlue">
        {value}
      </div>
    </div>
  );
};

export default TopicValues;
