import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import MainPost from "../../components/Home/Post/modules/MainPost";
import useMain from "../../components/Home/Layout/Post/modules/Feed/hooks/useMain";
import usePostPage from "../../components/Home/Post/hooks/usePostPage";
import useReactions from "../../components/Common/Feed/hooks/useReactions";
import Comments from "../../components/Home/Post/modules/Comments";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useAccount } from "wagmi";
import { setWalletConnected } from "../../redux/reducers/walletConnectedSlice";

const Post: NextPage = (): JSX.Element => {
  const {
    query: { id },
  } = useRouter();
  const { getPublicationData, publicationDataLoading, publicationData } =
    usePostPage();
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const { didMirror, getMoreMirrors, fetchReactions } = useMain();
  const { getPostComments, getMorePostComments, commentors } = useReactions();
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      getPublicationData(id as string);
      getPostComments(id as string);
    }
  }, [id]);
  const { isConnected } = useAccount();
  useEffect(() => {
    dispatch(setWalletConnected(isConnected));
  }, [isConnected]);

  return (
    <div className="relative h-auto min-h-screen w-full grid grid-flow-col auto-col-auto overflow-hidden pt-44">
      <div className="relative w-full h-full grid grid-flow-col auto-cols-auto col-start-1 bg-white rounded-t-md bg-white/90">
        {(publicationDataLoading || publicationDataLoading === undefined) &&
        !publicationData ? (
          <div className="relative w-full h-screen col-start-1 grid grid-flow-col auto-cols-auto"></div>
        ) : (
          <div className="relative w-full h-fit grid grid-flow-row auto-rows-auto col-start-1 pt-20">
            <MainPost
              publicationData={publicationData}
              didMirror={didMirror}
              fetchReactions={fetchReactions}
              getMoreMirrors={getMoreMirrors}
            />
            <Comments
              commentors={commentors}
              getMorePostComments={getMorePostComments}
              didMirror={didMirror}
              dispatch={dispatch}
              getMoreMirrors={getMoreMirrors}
              lensProfile={lensProfile}
              isConnected={isConnected as boolean}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;
