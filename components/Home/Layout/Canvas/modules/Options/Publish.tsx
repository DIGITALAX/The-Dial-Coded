import { FunctionComponent } from "react";
import CanvasOption from "../../../../../Common/Miscellaneous/CanvasOption";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { RootState } from "../../../../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { PublishProps } from "../../types/canvas.types";
import { AiOutlineLoading } from "react-icons/ai";

const Publish: FunctionComponent<PublishProps> = ({
  handleCanvasPost,
  postLoading,
}): JSX.Element => {
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  return (
    <div className="absolute justify-self-start self-start w-fit h-fit grid grid-flow-row auto-rows-auto gap-2 p-3 z-10">
      <div className="relative row-start-1 w-fit h-fit" id="save-drafts">
        <CanvasOption
          bgColor="black"
          image="QmQSKG8kDsX1pkXysx1sMcFiX6hJjy6ytu5tEeiPoiLUq4"
          width={20}
          height={20}
        />
      </div>
      <ReactTooltip
        anchorId="save-drafts"
        place="right"
        content="Save Drafts::Coming Soon::💯"
        style={{
          fontSize: "10px",
          backgroundColor: "#131313",
          opacity: "0.7",
        }}
      />
      <div
        className="relative row-start-2 w-fit h-fit"
        onClick={
          lensProfile && !postLoading ? () => handleCanvasPost() : () => {}
        }
      >
        {!postLoading ? (
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
    </div>
  );
};

export default Publish;
