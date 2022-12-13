import { FormEvent, FunctionComponent } from "react";
import { ImCross } from "react-icons/im";
import { useDispatch, useSelector } from "react-redux";
import { setPublication } from "../../../../redux/reducers/publicationSlice";
import { RootState } from "../../../../redux/store";
import useCollectionModal from "./hooks/useCollectionModal";
import useImageUpload from "./hooks/useImageUpload";
import usePublication from "./hooks/usePublication";
import CollectOptionsModal from "./modules/CollectOptionsModal";
import ImagePicker from "./modules/ImagePicker";
import ImageUploads from "./modules/ImageUploads";
import PostOptions from "./modules/PostOptions";

const PublicationModal: FunctionComponent = (): JSX.Element => {
  const dispatch = useDispatch();
  const collectOptionsModal = useSelector(
    (state: RootState) => state.app.collectOptionsReducer.value
  );
  const imagePickerModal = useSelector(
    (state: RootState) => state.app.emojiPickerReducer.value
  );
  const {
    enabledCurrencies,
    collectTypes,
    audienceTypes,
    setCollectType,
    collectType,
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
  } = useCollectionModal();
  const {
    uploadImage,
    imageUploading,
    mappedFeaturedFiles,
    handleRemoveImage,
  } = useImageUpload();
  const {
    handlePostDescription,
    hashtags,
    urls,
    handleEmoji,
    postDescription,
  } = usePublication();
  console.log(hashtags, urls);
  return (
    <div className="inset-0 justify-center fixed z-30 bg-opacity-50 backdrop-blur-md overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-[60vw] max-h-screen overflow-y-scroll h-fit col-start-1 place-self-center bg-offBlue/70 rounded-md px-4 py-3">
        {collectOptionsModal && (
          <CollectOptionsModal
            chargeCollect={chargeCollect}
            setChargeCollect={setChargeCollect}
            enabledCurrencies={enabledCurrencies}
            collectTypes={collectTypes}
            audienceTypes={audienceTypes}
            setCollectType={setCollectType}
            collectType={collectType}
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
            dispatch={dispatch}
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
        )}
        {mappedFeaturedFiles?.length !== 0 && (
          <ImageUploads
            mappedFeaturedFiles={mappedFeaturedFiles}
            handleRemoveImage={handleRemoveImage}
          />
        )}
        {imagePickerModal !== "" && (
          <ImagePicker
            imagePicker={imagePickerModal as string}
            handleEmoji={handleEmoji}
          />
        )}
        <div className="relative w-full h-fit rounded-xl grid grid-flow-col auto-cols-auto">
          <div className="relative w-full h-full col-start-1 rounded-xl place-self-center grid grid-flow-row auto-rows-auto gap-4">
            <div className="relative w-fit h-fit row-start-1 self-center justify-self-end pr-3 pt-3 cursor-pointer">
              <ImCross
                color="white"
                size={15}
                onClick={() => dispatch(setPublication(false))}
              />
            </div>
            <div className="relative w-full h-full col-start-1 grid grid-flow-col auto-cols-auto pb-4 gap-6 row-start-2">
              <div
                id="radialPinkBorder"
                className="relative w-full h-full grid grid-flow-col auto-cols-auto p-1 rounded-xl"
              >
                <textarea
                  onChange={(e: FormEvent) => handlePostDescription(e)}
                  style={{ resize: "none" }}
                  value={postDescription}
                  placeholder="Have something to share..."
                  className={`relative w-full h-32 overflow-y-scroll col-start-1 bg-white/80 rounded-xl grid grid-flow-col auto-cols-auto cursor-text active:opacity-80 text-offBlack font-dosis text-md p-2 place-self-center`}
                ></textarea>
              </div>
            </div>
            <div className="relative w-full h-fit row-start-3 grid grid-flow-col auto-cols-auto">
              <div className="relative w-full h-fit col-start-1 pl-2 self-center">
                <PostOptions
                  dispatch={dispatch}
                  imagePicker={imagePickerModal}
                  uploadImage={uploadImage}
                  imageUploading={imageUploading}
                  mappedFeaturedFiles={mappedFeaturedFiles}
                />
              </div>
              <div className="col-start-2 relative h-8 grid grid-flow-col auto-cols-auto w-20 rounded-md px-2 py-1 bg-white text-black font-dosis cursor-pointer active:scale-95 justify-self-end self-center">
                <div className="relative w-fit h-fit col-start-1 place-self-center text-sm">
                  POST
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicationModal;
