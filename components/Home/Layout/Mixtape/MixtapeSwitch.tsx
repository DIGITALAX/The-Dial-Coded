import { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAddTrack } from "../../../../redux/reducers/addTrackSlice";
import { RootState } from "../../../../redux/store";
import useCollectionModal from "../../../Common/Modals/Publications/hooks/useCollectionModal";
import useCreateMixtape from "./hooks/useCreateMixtape";
import useMixtapeImages from "./hooks/useMixtapeImages";
import CreateMixtape from "./modules/CreateMixtape";

const MixtapeSwitch: FunctionComponent = (): JSX.Element => {
  const mixtapeType: string | undefined = useSelector(
    (state: RootState) => state.app.layoutReducer.value
  );
  const titleValue = useSelector(
    (state: RootState) => state.app.mixtapeTitleReducer.value
  );
  const sourceValue = useSelector(
    (state: RootState) => state.app.mixtapeSourceReducer.value
  );
  const dispatch = useDispatch();
  const {
    checkValues,
    handleClicked,
    valueClicked,
    mixtapeLoading,
    handleTrackTitle,
    handleSource,
    handleTitle,
    handleRemoveTrack,
    generateMixtape,
  } = useCreateMixtape();
  const arrays = useSelector((state: RootState) => state.app.addTrackReducer);
  const { handleRemoveImage, uploadImage, imageLoading } = useMixtapeImages();
  let action: string = "Create";
  const decideStringAction = () => {
    action = mixtapeType as string;
    return action;
  };

  const {
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
  } = useCollectionModal();

  switch (decideStringAction()) {
    default:
      return (
        <CreateMixtape
          generateMixtape={generateMixtape}
          valueClicked={valueClicked}
          handleClicked={handleClicked}
          checkValues={checkValues}
          dispatch={dispatch}
          setAddTrack={setAddTrack}
          mixtapeLoading={mixtapeLoading}
          handleRemoveImage={handleRemoveImage}
          uploadImage={uploadImage}
          imageArray={arrays?.imageURI}
          titleArray={arrays?.title}
          imageLoading={imageLoading}
          handleTrackTitle={handleTrackTitle}
          handleSource={handleSource}
          handleTitle={handleTitle}
          handleRemoveTrack={handleRemoveTrack}
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
          titleValue={titleValue}
          sourceValue={sourceValue}
        />
      );
  }
};

export default MixtapeSwitch;
