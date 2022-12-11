import { FunctionComponent } from "react";
import MixButton from "../Miscellaneous/MixButton/MixButton";
import MixSave from "../Miscellaneous/MixSave/MixSave";

const CreateMixtape: FunctionComponent = (): JSX.Element => {
  return <div className="relative w-full h-full grid grid-flow-row auto-rows-auto">
        <div className="relative justify-self-start self-center w-fit h-fit row-start-1 grid grid-flow-col auto-cols-auto gap-4">
            <MixButton col={"1"} bgColor={"select2"} text={"Add new mix"} />
            <MixSave col={"2"} />
        </div>
  </div>;
};

export default CreateMixtape;
