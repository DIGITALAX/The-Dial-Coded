import { FunctionComponent } from "react";
import CanvasOption from "../../../../../Common/Miscellaneous/CanvasOption";
import "react-tooltip/dist/react-tooltip.css";
import { RootState } from "../../../../../../redux/store";
import { useSelector } from "react-redux";
import { PublishProps } from "../../types/canvas.types";
import { AiOutlineLoading } from "react-icons/ai";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../../../lib/lens/constants";

const Publish: FunctionComponent<PublishProps> = ({
  handleCanvasPost,
  postLoading,
  handleCanvasSave,
  saveLoading,
  handleCanvasPatternPost,
  patternPostLoading,
  canvasType,
  publishModal,
  setPublishModal,
  handleFulfillment,
}): JSX.Element => {
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  return (
    <div className="absolute justify-self-start self-start w-fit h-fit grid grid-flow-row auto-rows-auto gap-2 p-3 z-10 top-10 left-4">
      <div
        className="relative row-start-1 w-fit h-fit"
        onClick={
          lensProfile && !saveLoading && !postLoading
            ? () => handleCanvasSave()
            : () => {}
        }
      >
        {!saveLoading ? (
          <CanvasOption
            bgColor="black"
            image="QmQSKG8kDsX1pkXysx1sMcFiX6hJjy6ytu5tEeiPoiLUq4"
            width={20}
            height={20}
          />
        ) : (
          <div className="relative w-fit h-fit place-self border border-white bg-offBlack w-12 h-12 rounded-md grid grid-flow-col auto-cols-auto">
            <div className="relative w-fit h-fit animate-spin place-self-center">
              <AiOutlineLoading size={20} color={"white"} />
            </div>
          </div>
        )}
      </div>
      <div
        className="relative row-start-2 w-fit h-fit"
        onClick={
          lensProfile
            ? canvasType
              ? !patternPostLoading
                ? () => setPublishModal(!publishModal)
                : () => {}
              : !postLoading
              ? () => handleCanvasPost()
              : () => {}
            : () => {}
        }
      >
        {!postLoading && !patternPostLoading ? (
          <CanvasOption
            bgColor="black"
            image="QmUBtNtbovXo6iXuRofDyg1JvzHND8YwvVr2x9TvyjPv82"
            width={20}
            height={20}
          />
        ) : (
          <div className="relative w-fit h-fit place-self border border-white bg-offBlack w-12 h-12 rounded-md grid grid-flow-col auto-cols-auto">
            <div className="relative w-fit h-fit animate-spin place-self-center">
              <AiOutlineLoading size={20} color={"white"} />
            </div>
          </div>
        )}
      </div>
      {canvasType && publishModal && (
        <div className="relative w-40 h-40 rounded-lg p-px" id="modal">
          <div className="relative w-full h-full bg-dG rounded-lg flex flex-col text-center p-px text-naran font-digiR cursor-default">
            <div
              className="relative w-full h-fit text-center cursor-pointer"
              onClick={() => {
                setPublishModal(false);
                handleCanvasPatternPost();
              }}
            >
              PROCESS SNAPSHOT &gt;
            </div>
            <div className="relative w-full h-full font-digiR text-center grid grid-flow-col auto-cols-auto">
              <div className="relative w-full h-full grid grid-flow-col auto-cols-auto">
                <Image
                  src={`${INFURA_GATEWAY}/ipfs/QmQHDdrJa8NCYkVwtUfRN4y2B52AHMQJ9RrMmK11dN3GcR`}
                  layout="fill"
                  objectFit={"cover"}
                />
                <div className="relative w-fit h-fit place-self-center">OR</div>
              </div>
            </div>
            <div
              className="relative w-full h-fit text-center cursor-pointer"
              onClick={() => {
                setPublishModal(false);
                handleFulfillment();
              }}
            >
              READY TO FULFILL &gt;
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Publish;
