import { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAddTrack } from "../../../../redux/reducers/addTrackSlice";
import { RootState } from "../../../../redux/store";
import useCreateMixtape from "./hooks/useCreateMixtape";
import useMixtapeImages from "./hooks/useMixtapeImages";
import CreateMixtape from "./modules/CreateMixtape";

const MixtapeSwitch: FunctionComponent = (): JSX.Element => {
  const mixtapeType: string | undefined = useSelector(
    (state: RootState) => state.app.layoutReducer.value
  );
  const mixTapeTitle = useSelector(
    (state: RootState) => state.app.mixtapeTitleReducer.value
  );
  const mixTapeSource = useSelector(
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
  } = useCreateMixtape();
  const arrays = useSelector((state: RootState) => state.app.addTrackReducer);
  const { handleRemoveImage, uploadImage, imageLoading } = useMixtapeImages();
  let action: string = "Add New Mixtape";
  const decideStringAction = () => {
    action = mixtapeType as string;
    return action;
  };

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
          chargeCollect={chargeCollect}
          setChargeCollect={setChargeCollect}
          enabledCurrencies={enabledCurrencies}
          setAudienceType={setAudienceType}
          audienceType={audienceType}
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
          titleValue={mixTapeTitle}
          sourceValue={mixTapeSource}
        />
      );
  }
};

export default MixtapeSwitch;
