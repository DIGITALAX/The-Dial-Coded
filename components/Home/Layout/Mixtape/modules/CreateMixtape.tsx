import { FunctionComponent } from "react";
import MixButton from "../../../../Common/Miscellaneous/Mixtape/MixButton/MixButton";
import MixSave from "../../../../Common/Miscellaneous/Mixtape/MixSave/MixSave";
import MixInput from "../../../../Common/Miscellaneous/Mixtape/MixInput/MixInput";
import MixCheck from "../../../../Common/Miscellaneous/Mixtape/MixCheck/MixCheck";
import TrackInput from "../../../../Common/Miscellaneous/Mixtape/TrackInput/TrackInput";
import { CreateMixtapeProps } from "../../../../Common/types/common.types";
import CollectOptions from "./CollectOptions";

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
  audienceTypes,
  setAudienceType,
  audienceType,
  setEnabledCurrency,
  enabledCurrency,
  setChargeCollectDropDown,
  setAudienceDropDown,
  setCurrencyDropDown,
  chargeCollectDropDown,
  audienceDropDown,
  currencyDropDown,
  referral,
  setReferral,
  limit,
  setLimit,
  value,
  setValue,
  collectible,
  setCollectible,
  collectibleDropDown,
  setCollectibleDropDown,
  chargeCollect,
  setChargeCollect,
  limitedEdition,
  setLimitedEdition,
  limitedDropDown,
  setLimitedDropDown,
  setTimeLimit,
  timeLimit,
  timeLimitDropDown,
  setTimeLimitDropDown,
  handleSetCollectValues,
  titleValue,
  sourceValue
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
          clickHandle={generateMixtape}
        />
        {/* can this be sent as an xmtp ?? private message ?*/}
        <MixSave col={"2"} />
      </div>
      <div className="relative w-full h-fit grid grid-flow-row auto-rows-auto row-start-2 gap-6 ">
        <MixInput
          row={"1"}
          name={"mixtapeName"}
          title={"Mixtape Name"}
          handleChange={handleTitle}
          value={titleValue}
        />
        <MixInput
          row={"2"}
          name={"source"}
          title={"Source"}
          handleChange={handleSource}
          value={sourceValue}
        />
      </div>
      <div className="relative row-start-3 w-full h-fit grid grid-flow gap-2 ">
        <div className="relative w-fit h-fit row-start-1 font-digiB text-xl text-black place-self-start">
          SET COLLECT OPTIONS:
        </div>
        <div className="relative w-fit h-fit row-start-2">
          <CollectOptions
            dispatch={dispatch}
            handleSetCollectValues={handleSetCollectValues}
            chargeCollect={chargeCollect}
            setChargeCollect={setChargeCollect}
            enabledCurrencies={enabledCurrencies}
            audienceTypes={audienceTypes}
            setAudienceType={setAudienceType}
            audienceType={audienceType}
            setEnabledCurrency={setEnabledCurrency}
            enabledCurrency={enabledCurrency}
            setChargeCollectDropDown={setChargeCollectDropDown}
            setAudienceDropDown={setAudienceDropDown}
            setCurrencyDropDown={setCurrencyDropDown}
            chargeCollectDropDown={chargeCollectDropDown}
            audienceDropDown={audienceDropDown}
            currencyDropDown={currencyDropDown}
            value={value}
            setValue={setValue}
            limit={limit}
            setLimit={setLimit}
            referral={referral}
            setReferral={setReferral}
            collectible={collectible}
            setCollectible={setCollectible}
            collectibleDropDown={collectibleDropDown}
            setCollectibleDropDown={setCollectibleDropDown}
            limitedEdition={limitedEdition}
            setLimitedEdition={setLimitedEdition}
            limitedDropDown={limitedDropDown}
            setLimitedDropDown={setLimitedDropDown}
            timeLimit={timeLimit}
            setTimeLimit={setTimeLimit}
            timeLimitDropDown={timeLimitDropDown}
            setTimeLimitDropDown={setTimeLimitDropDown}
          />
        </div>
      </div>
      <div className="relative w-full h-fit grid grid-flow-row auto-rows-auto row-start-4 gap-2 ">
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
      <div className="relative w-full h-fit max-h-44 overflow-y-scroll grid grid-flow-row auto-rows-auto row-start-5 gap-6">
        {titleArray &&
          titleArray?.length > 0 &&
          Array.from(Array(titleArray?.length).keys()).map((index: number) => {
            return (
              <TrackInput
                key={index}
                index={index}
                mixtapeLoading={mixtapeLoading}
                uploadImage={uploadImage}
                handleRemoveImage={handleRemoveImage}
                imageLoading={imageLoading}
                titleArray={titleArray}
                imageArray={imageArray as string[]}
                handleTrackTitle={handleTrackTitle}
                handleRemoveTrack={handleRemoveTrack}
              />
            );
          })}
      </div>
      <div
        className="relative w-fit h-10 row-start-6 justify-self-end"
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
        />
      </div>
    </div>
  );
};

export default CreateMixtape;
