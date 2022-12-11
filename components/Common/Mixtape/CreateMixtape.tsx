import { FunctionComponent } from "react";
import MixButton from "../Miscellaneous/Mixtape/MixButton/MixButton";
import MixSave from "../Miscellaneous/Mixtape/MixSave/MixSave";
import MixInput from "../Miscellaneous/Mixtape/MixInput/MixInput";
import MixCheck from "../Miscellaneous/Mixtape/MixCheck/MixCheck";
import TrackInput from "../Miscellaneous/Mixtape/TrackInput/TrackInput";
import { CreateMixtapeProps } from "../types/common.types";

const CreateMixtape: FunctionComponent<CreateMixtapeProps> = ({
  checkValues,
  handleClicked,
  valueClicked,
  dispatch,
  setAddTrack,
  setEditTrack,
  setDeleteTrack,
  setAddMixtape,
  trackNumber,
}): JSX.Element => {
  return (
    <div className="relative col-start-1 w-full h-fit grid grid-flow-row auto-rows-auto self-start gap-10">
      <div className="relative justify-self-start self-center w-fit h-fit row-start-1 grid grid-flow-col auto-cols-auto gap-4 pb-8">
        <MixButton
          col={"1"}
          bgColor={"create"}
          text={"Add new mix"}
          textSize={"xl"}
          width={"fit"}
          border={true}
        />
        <MixSave col={"2"} />
      </div>
      <div className="relative w-full h-fit grid grid-flow-row auto-rows-auto row-start-2 gap-6 pr-10">
        <MixInput row={"1"} name={"source"} title={"Mixtape Name"} />
        <MixInput row={"2"} name={"mixtapeName"} title={"Source"} />
      </div>
      <div className="relative w-full h-fit grid grid-flow-row auto-rows-auto row-start-3 gap-2 pr-10">
        <div className="relative w-fit h-fit col-start-1 font-digiB text-xl text-black place-self-start">
          SELECT ONE:
        </div>
        <div className="relative w-fit h-fit col-start-2 gap-2 grid grid-cols-3 grid-rows-2 grid-rows-dense justify-self-end self-center">
          {checkValues?.map((value: string, index: number) => {
            return (
              <MixCheck
                key={index}
                value={value}
                handleClicked={handleClicked}
                valueClicked={valueClicked}
              />
            );
          })}
        </div>
      </div>
      <div className="relative w-full h-40 overflow-y-scroll grid grid-flow-row auto-rows-auto row-start-4 gap-6">
        {Array.from(Array(10).keys()).map((index: number) => {
          return <TrackInput key={index} index={index} />;
        })}
        {(trackNumber as number) > 0 &&
          Array.from(Array(trackNumber).keys()).map((index: number) => {
            return <TrackInput key={index} index={index + 11} />;
          })}
      </div>
      <div
        className="relative w-fit h-10 row-start-5 justify-self-end"
        onClick={() => dispatch(setAddTrack((trackNumber as number) + 1))}
      >
        <MixButton
          col={"1"}
          bgColor={"add"}
          text={"Add new track"}
          textSize={"sm"}
          width={"fit"}
        />
      </div>
    </div>
  );
};

export default CreateMixtape;
