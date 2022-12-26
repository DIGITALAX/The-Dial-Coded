import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import MainPost from "../../components/Home/Post/modules/MainPost";
import Comments from "../../components/Home/Post/modules/Comments";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useAccount } from "wagmi";
import { setWalletConnected } from "../../redux/reducers/walletConnectedSlice";
import usePostPage from "../../components/Home/Post/hooks/usePostPage";
import usePublication from "../../components/Common/Modals/Publications/hooks/usePublication";
import useMainFeed from "../../components/Home/Layout/Publish/modules/Feed/hooks/useMainFeed";

const Post: NextPage = (): JSX.Element => {
  const {
    query: { id },
  } = useRouter();
  const {
    getPublicationData,
    publicationDataLoading,
    publicationData,
    reactionsPostFeed,
    hasPostCommented,
    hasPostMirrored,
    hasPostReacted,
  } = usePostPage();
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const {
    commentPost,
    commentLoading,
    commentSuccess,
    postDescription,
    handlePostDescription,
    gifs,
    handleEmoji,
    handleGif,
    handleGifSubmit,
    handleRemoveGif,
    handleSetGif,
    results,
    searchGif,
  } = usePublication();
  const {
    getPostComments,
    commentors,
    getMorePostComments,
    hasCommented,
    hasMirrored,
    hasReacted,
    reactionsFeed,
  } = useMainFeed();

  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      getPublicationData(id as string);
      getPostComments(id as string);
    }
  }, [id, lensProfile, commentSuccess]);
  const { isConnected } = useAccount();
  useEffect(() => {
    dispatch(setWalletConnected(isConnected));
  }, [isConnected]);

  return (
    <div className="relative h-auto min-h-screen w-full grid grid-flow-col auto-col-auto overflow-hidden pt-44">
      <div className="relative w-full h-full grid grid-flow-col auto-cols-auto col-start-1 bg-white rounded-t-md bg-white/90">
        {(publicationDataLoading || publicationDataLoading === undefined) &&
        !publicationData &&
        reactionsPostFeed?.length === 0 ? (
          <div className="relative w-full h-screen col-start-1 grid grid-flow-col auto-cols-auto"></div>
        ) : (
          <div className="relative w-4/5 h-fit grid grid-flow-row auto-rows-auto col-start-1 pt-20 justify-self-center">
            <MainPost
              publicationData={publicationData}
              hasPostMirrored={hasPostMirrored}
              hasPostCommented={hasPostCommented}
              hasPostReacted={hasPostReacted}
              reactionsPostFeed={reactionsPostFeed}
            />
            <Comments
              commentors={commentors}
              getMorePostComments={getMorePostComments}
              dispatch={dispatch}
              lensProfile={lensProfile}
              isConnected={isConnected as boolean}
              commentPost={commentPost}
              commentLoading={commentLoading}
              commentDescription={postDescription}
              handleCommentDescription={handlePostDescription}
              handleEmoji={handleEmoji}
              handleGif={handleGif}
              handleGifSubmit={handleGifSubmit}
              handleRemoveGif={handleRemoveGif}
              handleSetGif={handleSetGif}
              results={results}
              searchGif={searchGif}
              gifs={gifs}
              commentSuccess={commentSuccess}
              hasMirrored={hasMirrored}
              hasReacted={hasReacted}
              hasCommented={hasCommented}
              reactionsFeed={reactionsFeed}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;
