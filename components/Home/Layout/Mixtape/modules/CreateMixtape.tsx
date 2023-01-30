import { FunctionComponent } from "react";
import MixButton from "../../../../Common/Miscellaneous/Mixtape/MixButton/MixButton";
import MixSave from "../../../../Common/Miscellaneous/Mixtape/MixSave/MixSave";
import MixInput from "../../../../Common/Miscellaneous/Mixtape/MixInput/MixInput";
import MixCheck from "../../../../Common/Miscellaneous/Mixtape/MixCheck/MixCheck";
import TrackInput from "../../../../Common/Miscellaneous/Mixtape/TrackInput/TrackInput";
import { CreateMixtapeProps } from "../../../../Common/types/common.types";
import CollectOptions from "./CollectOptions";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { useMediaQuery } from "@material-ui/core";

const CreateMixtape: FunctionComponent<CreateMixtapeProps> = ({
  checkValues,
  handleClicked,
  valueClicked,
  dispatch,
  setAddTrack,
  mixtapeLoading,
  uploadImage,
  handleRemoveImage,
  imageArray,
  imageLoading,
  titleArray,
  handleTrackTitle,
  handleSource,
  handleTitle,
  handleRemoveTrack,
  generateMixtape,
  enabledCurrencies,
  setAudienceType,
  audienceType,
  setEnabledCurrency,
  enabledCurrency,
  setCurrencyDropDown,
  currencyDropDown,
  referral,
  setReferral,
  limit,
  setLimit,
  value,
  setValue,
  collectible,
  setCollectible,
  chargeCollect,
  setChargeCollect,
  limitedEdition,
  setLimitedEdition,
  setTimeLimit,
  timeLimit,
  titleValue,
  sourceValue,
}): JSX.Element => {
  let queryWindowSize500: boolean = useMediaQuery("(max-width:500px)");
  return (
    <div className="relative col-start-1 w-full h-full flex flex-col self-start gap-10 items-start f5:py-0 py-1">
      <div className="relative self-start w-fit h-fit flex flex-row gap-4">
        <MixButton
          col={"1"}
          bgColor={"create"}
          text={"Add new mix"}
          textSize={!queryWindowSize500 ? "xl" : "xs"}
          width={"fit"}
          border={true}
          clickHandle={generateMixtape}
          loader={mixtapeLoading}
        />
        <div
          className="relative w-fit h-fit place-self-center"
          id="save-mixtape"
        >
          <MixSave col={"2"} />
        </div>
        <div className="relative w-fit h-fit f5:flex hidden">
        <ReactTooltip
          anchorId="save-mixtape"
          place="right"
          content="Save Mixtapes::Coming Soon::💯"
          style={{
            fontSize: "10px",
            backgroundColor: "#131313",
            opacity: "0.7",
          }}
        />
        </div>
      </div>
      <div className="relative w-full h-fit flex flex-row xl:flex-nowrap flex-wrap row-start-2 gap-6">
        <MixInput
          col={"1"}
          name={"mixtapeName"}
          title={"Mixtape Name"}
          handleChange={handleTitle}
          value={titleValue}
          loader={mixtapeLoading}
        />
        <MixInput
          col={"2"}
          name={"source"}
          title={"Source"}
          handleChange={handleSource}
          value={sourceValue}
          loader={mixtapeLoading}
        />
      </div>
      <div className="relative w-full h-full flex flex-wrap">
        <div className="relative w-full h-fit flex flex-row f1:flex-nowrap flex-wrap gap-3 pb-6 grow">
          <div className="relative w-fit h-fit font-digiB text-xl text-black place-self-start">
            SET COLLECT OPTIONS:
          </div>
          <div className="relative w-fit h-fit">
            <CollectOptions
              chargeCollect={chargeCollect}
              setChargeCollect={setChargeCollect}
              enabledCurrencies={enabledCurrencies}
              audienceType={audienceType}
              setAudienceType={setAudienceType}
              setEnabledCurrency={setEnabledCurrency}
              enabledCurrency={enabledCurrency}
              setCurrencyDropDown={setCurrencyDropDown}
              currencyDropDown={currencyDropDown}
              value={value}
              setValue={setValue}
              limit={limit}
              setLimit={setLimit}
              referral={referral}
              setReferral={setReferral}
              collectible={collectible}
              setCollectible={setCollectible}
              limitedEdition={limitedEdition}
              setLimitedEdition={setLimitedEdition}
              timeLimit={timeLimit}
              setTimeLimit={setTimeLimit}
            />
          </div>
        </div>
        <div className="relative w-full h-fit flex flex-row f1:flex-nowrap flex-wrap gap-2">
          <div className="relative w-fit h-fit font-digiB text-xl text-black place-self-start">
            SELECT ONE:
          </div>
          <div className="relative w-fit h-fit md:flex md:flex-row md:flex-nowrap grid grid-rows-3 f5:grid-rows-2 grid-flow-col gap-2">
            {checkValues?.map((value: string, index: number) => {
              return (
                <MixCheck
                  key={index}
                  value={value}
                  handleClicked={handleClicked}
                  valueClicked={valueClicked}
                  loader={mixtapeLoading}
                />
              );
            })}
          </div>
        </div>
      </div>
      <div className="relative w-full h-full max-h-44 overflow-y-scroll flex flex-row flex-wrap gap-6 grow">
        {titleArray &&
          titleArray?.length > 0 &&
          Array.from(Array(titleArray?.length).keys()).map((index: number) => {
            return (
              <TrackInput
                key={index}
                index={index}
                uploadImage={uploadImage}
                handleRemoveImage={handleRemoveImage}
                imageLoading={imageLoading}
                titleArray={titleArray}
                imageArray={imageArray as string[]}
                handleTrackTitle={handleTrackTitle}
                handleRemoveTrack={handleRemoveTrack}
                mixtapeLoading={mixtapeLoading}
              />
            );
          })}
      </div>
      <div
        className="relative w-fit h-10 justify-self-end"
        onClick={() =>
          dispatch(
            setAddTrack({
              actionImageURI: [...(imageArray as string[]), ""],
              actionTitle: [...(titleArray as string[]), ""],
            })
          )
        }
      >
        <MixButton
          col={"1"}
          bgColor={"add"}
          text={"Add new track"}
          textSize={"sm"}
          width={"fit"}
          loader={mixtapeLoading}
        />
      </div>
    </div>
  );
};

export default CreateMixtape;
