import Image from "next/legacy/image";
import { FormEvent, FunctionComponent } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { ImCross } from "react-icons/im";
import { useDispatch, useSelector } from "react-redux";
import createProfilePicture from "../../../../lib/lens/helpers/createProfilePicture";
import { setPublication } from "../../../../redux/reducers/publicationSlice";
import { RootState } from "../../../../redux/store";
import useCollectionModal from "./hooks/useCollectionModal";
import useImageUpload from "./hooks/useImageUpload";
import usePublication from "./hooks/usePublication";
import CollectOptionsModal from "./modules/CollectOptionsModal";
import ImagePicker from "./modules/ImagePicker";
import ImageUploads from "./modules/ImageUploads";
import PostOptions from "./modules/PostOptions";
import Tags from "./modules/Tags";

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
  const {
    uploadImage,
    imageUploading,
    mappedFeaturedFiles,
    handleRemoveImage,
  } = useImageUpload();
  const {
    handlePostDescription,
    handleEmoji,
    postDescription,
    handlePost,
    postLoading,
    postSuccess,
    handleGif,
    handleGifSubmit,
    results,
    searchGif,
    handleSetGif,
    handleRemoveGif,
    gifs,
    handleTags,
    tags,
    handleRemoveTag,
    syncScroll,
    mentionProfiles,
    handleMentionClick,
    textElement,
    caretCoord,
    profilesOpen,
  } = usePublication();

  return (
    <div className="inset-0 justify-center fixed z-20 bg-opacity-50 backdrop-blur-md overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-[60vw] max-h-screen overflow-y-scroll h-fit col-start-1 place-self-center bg-offBlue/70 rounded-md px-4 py-3">
        {collectOptionsModal && (
          <CollectOptionsModal
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
            postLoading={postLoading}
          />
        )}
        {imagePickerModal !== "" && (
          <ImagePicker
            imagePicker={imagePickerModal as string}
            handleEmoji={handleEmoji}
            handleGif={handleGif}
            handleGifSubmit={handleGifSubmit}
            results={results}
            searchGif={searchGif}
            handleSetGif={handleSetGif}
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
            <div
              className="relative w-full h-full col-start-1 grid grid-flow-col auto-cols-auto gap-6 row-start-2"
              id="sized"
            >
              <div
                id="radialPinkBorder"
                className="relative w-full h-full grid grid-flow-col auto-cols-auto p-1.5 rounded-xl"
              >
                <textarea
                  id="post"
                  onScroll={(e: any) => syncScroll(e)}
                  onInput={(e: FormEvent) => {
                    handlePostDescription(e);
                    syncScroll(e);
                  }}
                  ref={textElement}
                  value={postDescription}
                  className={`relative w-full h-32 col-start-1 bg-white/80 rounded-xl grid grid-flow-col auto-cols-auto cursor-text active:opacity-80 p-2 place-self-center z-1 font-dosis text-base overflow-y-scroll`}
                  disabled={postLoading ? true : false}
                  style={{
                    resize: "none",
                  }}
                ></textarea>
                <pre
                  id="highlighting"
                  className={`absolute w-full h-32 col-start-1 bg-white/80 rounded-xl grid grid-flow-col auto-cols-auto cursor-text active:opacity-80 p-2 place-self-center z-0 font-dosis text-base whitespace-pre-wrap overflow-y-scroll`}
                >
                  <code
                    id="highlighted-content"
                    className={`w-full h-full place-self-center text-left whitespace-pre-wrap overflow-y-scroll`}
                  >
                    Have something to share...
                  </code>
                </pre>
                {mentionProfiles?.length > 0 && profilesOpen && (
                  <div
                    className={`absolute w-44 max-h-28 h-fit grid grid-flow-row auto-rows-auto overflow-y-scroll z-2`}
                    style={{
                      top: caretCoord.y + 30,
                      left: caretCoord.x,
                    }}
                  >
                    {mentionProfiles?.map((user: any, index: number) => {
                      const profileImage: string = createProfilePicture(
                        user?.picture
                      );
                      return (
                        <div
                          key={index}
                          className={`relative w-full h-fit px-3 py-2 bg-white col-start-1 grid grid-flow-col auto-cols-auto gap-3 cursor-pointer border-y border-black hover:bg-offBlue`}
                          onClick={() => {
                            handleMentionClick(user);
                          }}
                        >
                          <div className="relative w-fit h-fit col-start-1 text-black font-dosis lowercase place-self-center grid grid-flow-col auto-cols-auto gap-2">
                            <div
                              className={`relative rounded-full flex bg-white w-3 h-3 place-self-center col-start-1`}
                              id="crt"
                            >
                              {profileImage !== "" && (
                                <Image
                                  src={profileImage}
                                  objectFit="cover"
                                  alt="pfp"
                                  layout="fill"
                                  className="relative w-fit h-fit rounded-full self-center"
                                />
                              )}
                            </div>
                            <div className="relative col-start-2 place-self-center w-fit h-fit text-xs">
                              @{user?.handle}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            <div className="relative w-full hit row-start-3">
              <Tags
                handleRemoveTag={handleRemoveTag}
                tags={tags}
                handleTags={handleTags}
              />
            </div>
            <div className="relative w-full h-fit row-start-4 grid grid-flow-col auto-cols-auto">
              <div className="relative w-full h-fit col-start-1 pl-2 self-center">
                <PostOptions
                  dispatch={dispatch}
                  imagePicker={imagePickerModal}
                  uploadImage={uploadImage}
                  imageUploading={imageUploading}
                  postLoading={postLoading}
                />
              </div>
              {gifs && (
                <div className="relative w-28 h-full justify-self-end col-start-2 grid grid-flow-col auto-cols overflow-x-scroll gap-2">
                  {gifs?.map((gif: any, index: number) => {
                    return (
                      <div
                        key={index}
                        className={`col-start-${index} relative w-6 h-full cursor-pointer scale:active-95`}
                        onClick={() => handleRemoveGif(gif)}
                      >
                        <Image src={gif} objectFit="cover" layout="fill" />
                      </div>
                    );
                  })}
                </div>
              )}
              <div
                className={`${
                  gifs ? "col-start-3" : "col-start-2"
                } relative h-8 grid grid-flow-col auto-cols-auto w-20 rounded-md px-2 py-1 bg-white text-black font-dosis justify-self-end self-center ${
                  postDescription !== "" || !imageUploading || !postLoading
                    ? "active:scale-95 cursor-pointer"
                    : "opacity-60"
                }`}
                onClick={() => {
                  (!imageUploading || !postLoading || postDescription !== "") &&
                  !postSuccess
                    ? handlePost()
                    : {};
                }}
              >
                <div
                  className={`relative w-fit h-fit col-start-1 place-self-center text-sm ${
                    (imageUploading || postLoading) && "animate-spin"
                  }`}
                >
                  {imageUploading || postLoading ? (
                    <AiOutlineLoading color="black" size={20} />
                  ) : (
                    !postLoading && !imageUploading && "POST"
                  )}
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
