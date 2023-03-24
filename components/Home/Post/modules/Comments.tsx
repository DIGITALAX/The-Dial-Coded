import { useConnectModal } from "@rainbow-me/rainbowkit";
import Image from "next/legacy/image";
import { FormEvent, FunctionComponent, useEffect } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector } from "react-redux";
import createProfilePicture from "../../../../lib/lens/helpers/createProfilePicture";
import { setSignIn } from "../../../../redux/reducers/signInSlice";
import { RootState } from "../../../../redux/store";
import FeedPublication from "../../../Common/Feed/modules/FeedPublication";
import useCollectionModal from "../../../Common/Modals/Publications/hooks/useCollectionModal";
import useImageUpload from "../../../Common/Modals/Publications/hooks/useImageUpload";
import CollectOptionsModal from "../../../Common/Modals/Publications/modules/CollectOptionsModal";
import ImagePicker from "../../../Common/Modals/Publications/modules/ImagePicker";
import ImageUploads from "../../../Common/Modals/Publications/modules/ImageUploads";
import PostOptions from "../../../Common/Modals/Publications/modules/PostOptions";
import Tags from "../../../Common/Modals/Publications/modules/Tags";
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
  reactionsFeed,
  handleHidePost,
  tags,
  handleTags,
  handleRemoveTag,
  followerOnly,
  syncScroll,
  caretCoord,
  mentionProfiles,
  profilesOpen,
  handleMentionClick,
  textElement,
  reactionLoaded,
}): JSX.Element => {
  const { openConnectModal } = useConnectModal();
  const collectOptionsModal = useSelector(
    (state: RootState) => state.app.collectOptionsReducer.value
  );
  const imagePickerModal = useSelector(
    (state: RootState) => state.app.emojiPickerReducer.value
  );
  const postImagesDispatched = useSelector(
    (state: RootState) => state.app.postImageReducer.value
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
    handleCollectValues,
  } = useCollectionModal();
  const {
    uploadImage,
    imageUploading,
    mappedFeaturedFiles,
    handleRemoveImage,
    uploadVideo,
    videoUploading,
  } = useImageUpload();
  return (
    <div className="relative w-full h-fit row-start-2 grid grid-flow-row auto-rows-auto pt-4 gap-4">
      {collectOptionsModal && (
        <CollectOptionsModal
          handleCollectValues={handleCollectValues}
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
          handleRemoveImage={handleRemoveImage}
          postLoading={commentLoading}
          postImagesDispatched={postImagesDispatched}
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
            {!followerOnly ? (
              // <textarea
              //   onChange={(e: FormEvent) => handleCommentDescription(e)}
              //   style={{ resize: "none" }}
              //   value={commentDescription}
              //   placeholder="Have something to share..."
              //   className={`relative w-full h-48 overflow-y-scroll row-start-1 bg-white/80 rounded-xl grid grid-flow-col auto-cols-auto cursor-text active:opacity-80 text-offBlack font-dosis text-base p-4 place-self-center drop-shadow-lg caret-transparent`}
              //   disabled={commentLoading || followerOnly ? true : false}
              // ></textarea>
              <div className="relative w-full h-full grid grid-flow-col auto-cols-auto p-1.5 rounded-xl">
                <textarea
                  id="post"
                  onScroll={(e: any) => syncScroll(e, "highlighted-content")}
                  onInput={(e: FormEvent) => {
                    handleCommentDescription(e);
                    syncScroll(e, "highlighted-content");
                  }}
                  ref={textElement}
                  value={commentDescription}
                  className={`relative w-full h-32 col-start-1 bg-white/80 rounded-xl grid grid-flow-col auto-cols-auto cursor-text active:opacity-80 p-2 place-self-center z-1 font-dosis text-base overflow-y-scroll`}
                  disabled={commentLoading || followerOnly ? true : false}
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
                      const profileImage: string = createProfilePicture(user);
                      return (
                        <div
                          key={index}
                          className={`relative w-full h-fit px-3 py-2 bg-white col-start-1 grid grid-flow-col auto-cols-auto gap-3 cursor-pointer border-y border-black hover:bg-offBlue z-2`}
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
                                  draggable={false}
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
            ) : (
              <div className="relative w-full h-48 row-start-1 bg-white/80 rounded-xl p-4 place-self-center drop-shadow-lg grid grid-flow-col auto-cols-auto font-dosis text-offBlack">
                Only followers can comment...
              </div>
            )}
            <div className="relative w-full hit row-start-2">
              <Tags
                handleRemoveTag={handleRemoveTag}
                tags={tags}
                handleTags={handleTags}
              />
            </div>
            <div className="relative w-full h-full grid grid-flow-col auto-cols-auto row-start-3">
              <div className="relative w-full h-fit col-start-1 pl-2 place-self-center py-3 fo:py-0">
                <PostOptions
                  dispatch={dispatch}
                  imagePicker={imagePickerModal}
                  uploadImage={uploadImage}
                  imageUploading={imageUploading}
                  postLoading={commentLoading}
                  videoUploading={videoUploading}
                  uploadVideo={uploadVideo}
                />
              </div>
              <div
                className={`relative w-32 h-10 px-3 py-1 justify-self-end self-center grid grid-flow-col auto-cols-auto bg-white/95 rounded-md col-start-1 row-start-2 fo:row-start-1 fo:col-start-2 ${
                  !followerOnly &&
                  commentDescription !== "" &&
                  !imageUploading &&
                  !commentLoading &&
                  commentDescription.trim().length > 0 &&
                  "cursor-pointer hover:opacity-70 active:scale-95"
                }`}
                onClick={
                  !followerOnly ? (e: FormEvent) => commentPost(e) : () => {}
                }
              >
                <div
                  className={`relative w-fit h-fit col-start-1 place-self-center text-sm fo:text-base ${
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
                  reactionsFeed={
                    reactionsFeed.length > 0 && reactionsFeed[index]
                  }
                  hasCommented={hasCommented?.length > 0 && hasCommented[index]}
                  handleHidePost={handleHidePost}
                  followerOnly={followerOnly}
                  reactionLoaded={reactionLoaded?.[index]}
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
