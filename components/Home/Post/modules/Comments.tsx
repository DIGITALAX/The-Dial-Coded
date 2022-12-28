import { useConnectModal } from "@rainbow-me/rainbowkit";
import Image from "next/legacy/image";
import { FormEvent, FunctionComponent } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector } from "react-redux";
import { setSignIn } from "../../../../redux/reducers/signInSlice";
import { RootState } from "../../../../redux/store";
import FeedPublication from "../../../Common/Feed/FeedPublication";
import useCollectionModal from "../../../Common/Modals/Publications/hooks/useCollectionModal";
import useImageUpload from "../../../Common/Modals/Publications/hooks/useImageUpload";
import CollectOptionsModal from "../../../Common/Modals/Publications/modules/CollectOptionsModal";
import ImagePicker from "../../../Common/Modals/Publications/modules/ImagePicker";
import ImageUploads from "../../../Common/Modals/Publications/modules/ImageUploads";
import PostOptions from "../../../Common/Modals/Publications/modules/PostOptions";
import { CommentsProps } from "../types/post.types";

const Comments: FunctionComponent<CommentsProps> = ({
  commentors,
  getMorePostComments,
  dispatch,
  lensProfile,
  isConnected,
  commentPost,
  commentLoading,
  handleCommentDescription,
  commentDescription,
  handleEmoji,
  handleGif,
  handleSetGif,
  results,
  searchGif,
  handleGifSubmit,
  hasMirrored,
  hasReacted,
  hasCommented,
  commentSuccess,
  reactionsFeed,
  gifs,
  handleRemoveGif,
}): JSX.Element => {
  const { openConnectModal } = useConnectModal();
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
  return (
    <div className="relative w-full h-fit row-start-2 grid grid-flow-row auto-rows-auto pt-4 gap-4">
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
          postLoading={commentLoading}
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
      <div className="relative w-full h-full grid grid-flow-col auto-cols-auto place-self-center font-dosis text-offBlack text-lg bg-offBlue p-2 rounded-xl drop-shadow-lg">
        {!lensProfile ? (
          <div>
            <div className="w-full h-48 place-self-center col-start-1 bg-white/90 rounded-xl grid grid-flow-row auto-rows-auto">
              <div className="relative w-fit h-fit place-self-center pt-4 row-start-1">
                Have something to say?
              </div>
              <div
                className="relative h-10 w-32 rounded-md bg-offBlue grid grid-flow-col auto-cols-auto row-start-2 place-self-center grid grid-flow-col auto-cols-auto cursor-pointer active:scale-95 hover:opacity-80"
                onClick={
                  isConnected
                    ? () => dispatch(setSignIn(true))
                    : openConnectModal
                }
              >
                <div className="relative text-white col-start-1 place-self-center px-2 py-1">
                  {isConnected ? "Sign In" : "Connect Wallet"}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full place-self-center col-start-1 grid grid-flow-row auto-rows-auto gap-2">
            <textarea
              onChange={(e: FormEvent) => handleCommentDescription(e)}
              style={{ resize: "none" }}
              value={commentDescription}
              placeholder="Have something to share..."
              className={`relative w-full h-48 overflow-y-scroll row-start-1 bg-white/80 rounded-xl grid grid-flow-col auto-cols-auto cursor-text active:opacity-80 text-offBlack font-dosis text-md p-4 place-self-center drop-shadow-lg caret-transparent focus:caret-transparent`}
              disabled={commentLoading ? true : false}
            ></textarea>
            <div className="relative w-full h-full grid grid-flow-col auto-cols-auto row-start-2">
              <div className="relative w-full h-fit col-start-1 pl-2 place-self-center">
                <PostOptions
                  dispatch={dispatch}
                  imagePicker={imagePickerModal}
                  uploadImage={uploadImage}
                  imageUploading={imageUploading}
                  postLoading={commentLoading}
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
                className={`relative w-32 h-10 px-3 py-1 justify-self-end self-center grid grid-flow-col auto-cols-auto bg-white/95 rounded-md ${
                  gifs ? "col-start-3" : "col-start-2"
                } cursor-pointer hover:opacity-70 active:scale-95`}
                onClick={(e: FormEvent) => commentPost(e)}
              >
                <div
                  className={`relative w-fit h-fit col-start-1 place-self-center ${
                    commentLoading && "animate-spin"
                  }`}
                >
                  {commentLoading ? (
                    <AiOutlineLoading color="black" size={20} />
                  ) : (
                    "Comment"
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {commentors.length > 0 && (
        <div className="relative w-full h-fit grid grid-flow-row auto-rows-auto place-self-center">
          <InfiniteScroll
            hasMore={true}
            dataLength={commentors.length}
            next={getMorePostComments}
            loader={""}
            className="relative w-full h-fit row-start-1 grid grid-flow-row auto-rows-auto gap-3"
          >
            {commentors?.map((commentor: any, index: number) => {
              return (
                <FeedPublication
                  dispatch={dispatch}
                  publication={commentor}
                  key={index}
                  type={"comment"}
                  hasMirrored={hasMirrored?.length > 0 && hasMirrored[index]}
                  hasReacted={hasReacted?.length > 0 && hasReacted[index]}
                  reactionsFeed={reactionsFeed.length > 0 && reactionsFeed[index]}
                  hasCommented={hasCommented?.length > 0 && hasCommented[index]}
                />
              );
            })}
          </InfiniteScroll>
        </div>
      )}
    </div>
  );
};

export default Comments;
