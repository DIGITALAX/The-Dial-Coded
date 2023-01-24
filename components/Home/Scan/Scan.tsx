import { FunctionComponent } from "react";
import Panel from "./modules/Panel/Panel";
import BackgroundImage from "./modules/BackgroundImage";
import Marquee from "./modules/Marquee";
import SideText from "./modules/SideText";
import Turner from "./modules/Turner";
import useScan from "./hooks/useScan";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../redux/store";
import { useMediaQuery } from "@material-ui/core";
import { ScanProps } from "./types/scan.types";
import Draggable from "react-draggable";
import { AiFillCloseCircle } from "react-icons/ai";
import { setVideo } from "../../../redux/reducers/videoSlice";

const Scan: FunctionComponent<ScanProps> = ({ newLink }): JSX.Element => {
  const {
    currentSetting,
    handleCount,
    canvasURIs,
    mainImage,
    imageArtist,
    imageDescription,
    imageTitle,
    handleQuickSearch,
    handleMoreProfileQuickSearch,
    profileSearchValues,
    publicationSearchValues,
    searchLoading,
    handleChosenSearch,
    dropDown,
    handleKeyDownEnter,
    scanSearchTarget,
  } = useScan();
  const videoOpen = useSelector(
    (state: RootState) => state.app.videoReducer.value
  );
  const dispatch = useDispatch();
  let queryWindowSize1200: boolean = useMediaQuery("(max-width:1200px)");
  return (
    <div className="relative w-full h-full row-start-1 grid grid-flow-row auto-rows-auto">
      <BackgroundImage mainImage={mainImage} />
      <div className="relative w-full h-[75rem] sm:h-[70rem] md:h-screen md:min-h-[50vw] px-2 sm:px-6 grid grid-flow-col auto-cols-auto row-start-1">
        <SideText
          currentSetting={currentSetting}
          imageArtist={imageArtist}
          imageDescription={imageDescription}
          imageTitle={imageTitle}
        />
        {videoOpen && (
          <Draggable
            defaultPosition={{ x: !queryWindowSize1200 ? 200 : 0, y: 20 }}
            cancel=".frame"
            enableUserSelectHack={false}
          >
            <div className="absolute z-40 bg-black w-fit h-fit px-8 pb-8 pt-4 grid grid-flow-col auto-cols-auto cursor-pointer place-self-center">
              <div
                className="relative w-fit h-fit justify-self-end row-start-1 pb-4"
                onClick={() => dispatch(setVideo(false))}
              >
                <AiFillCloseCircle size={25} color={"white"} />
              </div>
              <div className="relative w-fit h-fit justify-self-end row-start-2 border border-white">
                <iframe
                  width={!queryWindowSize1200 ? "900" : "550"}
                  height={!queryWindowSize1200 ? "650" : "400"}
                  src={newLink}
                  title="Digifizzy Stream"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="frame"
                ></iframe>
              </div>
            </div>
          </Draggable>
        )}
        <Turner
          canvasURIs={canvasURIs}
          currentSetting={currentSetting}
          handleCount={handleCount}
          handleQuickSearch={handleQuickSearch}
          handleMoreProfileQuickSearch={handleMoreProfileQuickSearch}
          profileSearchValues={profileSearchValues}
          publicationSearchValues={publicationSearchValues}
          handleChosenSearch={handleChosenSearch}
          searchLoading={searchLoading}
          dropDown={dropDown}
          handleKeyDownEnter={handleKeyDownEnter}
          searchTarget={scanSearchTarget}
        />
      </div>
      <Marquee />
      <Panel />
    </div>
  );
};

export default Scan;
