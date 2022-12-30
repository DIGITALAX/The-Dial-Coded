import { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAddTrack } from "../../../../redux/reducers/addTrackSlice";
import { RootState } from "../../../../redux/store";
import useCollectionModal from "../../../Common/Modals/Publications/hooks/useCollectionModal";
import useCreateMixtape from "./hooks/useCreateMixtape";
import useMixtape from "./hooks/useMixtape";
import useMixtapeImages from "./hooks/useMixtapeImages";
import CreateMixtape from "./modules/CreateMixtape";
import lodash from "lodash";

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
  const { updateMix } = useMixtape();
  const arrays = useSelector((state: RootState) => state.app.addTrackReducer);
  const { handleRemoveImage, uploadImage, imageLoading } = useMixtapeImages();
  let action: string = "Add New Mixtape";
  const decideStringAction = () => {
    action = mixtapeType as string;
    return action;
  };

  const {
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
          titleValue={titleValue}
          sourceValue={sourceValue}
          updateMix={updateMix}
        />
      );
  }
};

export default MixtapeSwitch;
