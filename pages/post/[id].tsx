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
import { BsFillChatDotsFill } from "react-icons/bs";
import handleHidePost from "../../lib/lens/helpers/handleHidePost";
import getPostComments from "../../lib/lens/helpers/getPostComments";
import NotFound from "../../components/Common/NotFound/NotFound";
import syncScroll from "../../lib/lens/helpers/syncScroll";
import checkDispatcher from "../../lib/lens/helpers/checkDispatcher";
import Head from "next/head";
import PostPageLoading from "../../components/Common/Loaders/PostPageLoading";

const Post: NextPage = (): JSX.Element => {
  const {
    query: { id },
    replace,
  } = useRouter();
  const {
    getPublicationData,
    publicationDataLoading,
    publicationData,
    reactionsPostFeed,
    hasPostCommented,
    hasPostMirrored,
    hasPostReacted,
    followerOnly,
    firstLoad,
  } = usePostPage();

  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const indexerModal = useSelector(
    (state: RootState) => state.app.indexModalReducer
  );
  const hearted = useSelector(
    (state: RootState) => state.app.heartedReducer?.direction
  );
  const {
    commentPost,
    commentLoading,
    commentSuccess,
    postDescription,
    handlePostDescription,
    handleEmoji,
    handleGif,
    handleGifSubmit,
    handleSetGif,
    results,
    searchGif,
    tags,
    handleRemoveTag,
    handleTags,
    caretCoord,
    mentionProfiles,
    profilesOpen,
    handleMentionClick,
    textElement,
  } = usePublication();
  const {
    commentors,
    getMorePostComments,
    hasCommented,
    hasMirrored,
    hasReacted,
    reactionsFeed,
    setCommentInfoLoading,
    setCommentors,
    setCommentPageInfo,
    setReactionsFeed,
    setHasMirrored,
    setHasCommented,
    setHasReacted,
  } = useMainFeed();

  const dispatch = useDispatch();
  useEffect(() => {
    if (id) {
      getPublicationData(id as string);
      getPostComments(
        setCommentInfoLoading,
        setCommentors,
        setCommentPageInfo,
        setReactionsFeed,
        lensProfile,
        setHasMirrored,
        setHasCommented,
        setHasReacted,
        id as string
      );
    }
  }, [
    id,
    lensProfile,
    commentSuccess,
    indexerModal.value,
    indexerModal.message,
    hearted,
  ]);

  const { isConnected } = useAccount();
  useEffect(() => {
    dispatch(setWalletConnected(isConnected));
  }, [isConnected]);

  useEffect(() => {
    checkDispatcher(dispatch, lensProfile);
  }, [lensProfile]);

  if (!publicationData && publicationDataLoading === false) {
    return <NotFound />;
  }

  if (publicationDataLoading && firstLoad) {
    return <PostPageLoading />;
  }

  return (
    <div className="relative h-auto min-h-screen w-full grid grid-flow-col auto-col-auto overflow-hidden pt-72 sm:pt-56 md:pt-44">
      <Head>
        <title>
          {publicationData?.__typename !== "Mirror"
            ? publicationData?.metadata?.name
            : publicationData?.mirrorOf?.metadata?.name}
        </title>
        <meta
          name="og:url"
          content={`https://thedial.xyz/post/${publicationData?.id}`}
        />
        <meta
          name="og:title"
          content={
            publicationData?.__typename !== "Mirror"
              ? publicationData?.metadata?.name
              : publicationData?.mirrorOf?.metadata?.name
          }
        />
        <meta
          name="og:description"
          content={
            publicationData?.__typename !== "Mirror"
              ? publicationData?.metadata?.description
                ? publicationData?.metadata?.description
                : publicationData?.metadata?.content
              : publicationData?.mirrorOf?.metadata?.description
              ? publicationData?.mirrorOf?.metadata?.description
              : publicationData?.mirrorOf?.metadata?.content
          }
        />
        <meta
          name="og:image"
          content={
            !publicationData?.metadata?.media[0]?.original.url &&
            !publicationData?.mirrorOf?.metadata?.media[0]?.original.url
              ? "https://thedial.xyz/card.png/"
              : publicationData?.__typename !== "Mirror"
              ? `https://thedial.infura-ipfs.io/ipfs/${publicationData?.metadata?.media[0]?.original.url}`
              : `https://thedial.infura-ipfs.io/ipfs/${publicationData?.mirrorOf?.metadata?.media[0]?.original.url}`
          }
        />
        <meta name="twitter:card" content="summary" />
        <meta
          name="og:url"
          content={`https://thedial.xyz/post/${publicationData?.id}`}
        />
        <meta
          name="og:image"
          content={
            !publicationData?.metadata?.media[0]?.original.url &&
            !publicationData?.mirrorOf?.metadata?.media[0]?.original.url
              ? "https://thedial.xyz/card.png/"
              : publicationData?.__typename !== "Mirror"
              ? `https://thedial.infura-ipfs.io/ipfs/${publicationData?.metadata?.media[0]?.original.url}`
              : `https://thedial.infura-ipfs.io/ipfs/${publicationData?.mirrorOf?.metadata?.media[0]?.original.url}`
          }
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@digitalax" />
        <meta name="twitter:creator" content="@digitalax" />
        <meta
          name="twitter:image"
          content={
            !publicationData?.metadata?.media[0]?.original.url &&
            !publicationData?.mirrorOf?.metadata?.media[0]?.original.url
              ? "https://thedial.xyz/card.png/"
              : publicationData?.__typename !== "Mirror"
              ? `https://thedial.infura-ipfs.io/ipfs/${publicationData?.metadata?.media[0]?.original.url}`
              : `https://thedial.infura-ipfs.io/ipfs/${publicationData?.mirrorOf?.metadata?.media[0]?.original.url}`
          }
        />
        <meta
          name="twitter:url"
          content={
            !publicationData?.metadata?.media[0]?.original.url &&
            !publicationData?.mirrorOf?.metadata?.media[0]?.original.url
              ? "https://thedial.xyz/card.png/"
              : publicationData?.__typename !== "Mirror"
              ? `https://thedial.infura-ipfs.io/ipfs/${publicationData?.metadata?.media[0]?.original.url}`
              : `https://thedial.infura-ipfs.io/ipfs/${publicationData?.mirrorOf?.metadata?.media[0]?.original.url}`
          }
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="canonical"
          href={
            !publicationData?.metadata?.media[0]?.original.url &&
            !publicationData?.mirrorOf?.metadata?.media[0]?.original.url
              ? "https://thedial.xyz/card.png/"
              : publicationData?.__typename !== "Mirror"
              ? `https://thedial.infura-ipfs.io/ipfs/${publicationData?.metadata?.media[0]?.original.url}`
              : `https://thedial.infura-ipfs.io/ipfs/${publicationData?.mirrorOf?.metadata?.media[0]?.original.url}`
          }
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          rel="preload"
          href="/fonts/DosisRegular.ttf"
          as="font"
          crossOrigin=""
          type="font/ttf"
        />
        <link
          rel="preload"
          href="/fonts/DS-DIGI.ttf"
          as="font"
          crossOrigin=""
          type="font/ttf"
        />
        <link
          rel="preload"
          href="/fonts/DS-DIGIT.ttf"
          as="font"
          crossOrigin=""
          type="font/ttf"
        />
        <link
          rel="preload"
          href="/fonts/DS-DIGII.ttf"
          as="font"
          crossOrigin=""
          type="font/ttf"
        />
        <link
          rel="preload"
          href="/fonts/DS-DIGIB.ttf"
          as="font"
          crossOrigin=""
          type="font/ttf"
        />
        <link
          rel="preload"
          href="/fonts/DonJoseBigote.ttf"
          as="font"
          crossOrigin=""
          type="font/ttf"
        />
        <link
          rel="preload"
          href="/fonts/Satoshi-Medium.otf"
          as="font"
          crossOrigin=""
          type="font/otf"
        />
        <link
          rel="preload"
          href="/fonts/multiple.otf"
          as="font"
          crossOrigin=""
          type="font/otf"
        />
        <link
          rel="preload"
          href="/fonts/EarlsRevenge.ttf"
          as="font"
          crossOrigin=""
          type="font/ttf"
        />
      </Head>
      <div className="relative w-full h-full grid grid-flow-col auto-cols-auto col-start-1 rounded-t-md bg-white/90">
        {(publicationDataLoading || publicationDataLoading === undefined) &&
        !publicationData &&
        reactionsPostFeed?.length === 0 ? (
          <div className="relative w-full h-screen col-start-1 grid grid-flow-col auto-cols-auto"></div>
        ) : (
          <>
            {publicationData?.__typename === "Comment" && (
              <div className="relative w-4/5 row-start-1 h-fit col-start-1 justify-self-center grid grid-flow-col auto-cols-auto pb-2 pt-20">
                <div className="relative w-full h-fit col-start-1 place-self-center font-dosis text-offBlack grid grid-flow-col auto-cols-auto p-2 drop-shadow-lg bg-offWhite/90 rounded-lg text-sm">
                  <div
                    className="relative w-fit h-fit grid-flow-col auto-cols-auto grid justify-self-start self-center gap-1 cursor-pointer active:scale-95"
                    onClick={() =>
                      replace(`/post/${publicationData?.mainPost?.id}`)
                    }
                  >
                    <div className="relative w-fit h-fit col-start-1 place-self-center">
                      Comment of
                    </div>
                    <div className="relative w-fit h-fit col-start-2 text-offBlue place-self-center">
                      {publicationData?.mainPost?.metadata?.name}
                    </div>
                    <div className="relative w-fit h-fit col-start-3 opacity-50 place-self-center">
                      <BsFillChatDotsFill size={12} color="black" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div
              className={`${
                publicationData?.__typename === "Comment"
                  ? "row-start-2"
                  : "row-start-1"
              } relative w-4/5 h-fit grid grid-flow-row auto-rows-auto col-start-1 justify-self-center ${
                publicationData?.__typename !== "Comment" && "pt-20"
              }`}
            >
              <MainPost
                publicationData={publicationData}
                hasPostMirrored={hasPostMirrored}
                hasPostCommented={hasPostCommented}
                hasPostReacted={hasPostReacted}
                reactionsPostFeed={reactionsPostFeed}
                handleHidePost={handleHidePost}
                followerOnly={followerOnly}
              />
              <Comments
                followerOnly={followerOnly}
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
                handleSetGif={handleSetGif}
                results={results}
                searchGif={searchGif}
                commentSuccess={commentSuccess}
                hasMirrored={hasMirrored}
                hasReacted={hasReacted}
                hasCommented={hasCommented}
                reactionsFeed={reactionsFeed}
                handleHidePost={handleHidePost}
                tags={tags}
                handleTags={handleTags}
                handleRemoveTag={handleRemoveTag}
                syncScroll={syncScroll}
                caretCoord={caretCoord}
                mentionProfiles={mentionProfiles}
                profilesOpen={profilesOpen}
                handleMentionClick={handleMentionClick}
                textElement={textElement}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Post;
