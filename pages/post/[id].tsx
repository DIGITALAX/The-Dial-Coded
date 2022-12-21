import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import MainPost from "../../components/Home/Post/modules/MainPost";
import useMain from "../../components/Home/Layout/Post/modules/Feed/hooks/useMain";
import usePostPage from "../../components/Home/Post/hooks/usePostPage";

const Post: NextPage = (): JSX.Element => {
  const {
    query: { id },
  } = useRouter();
  const { getPublicationData, publicationDataLoading, publicationData } =
    usePostPage();
  const { didMirror, getMoreMirrors, fetchReactions } = useMain();

  useEffect(() => {
    if (id) {
      getPublicationData(id as string);
    }
  }, [id]);

  return (
    <div className="relative h-fit w-full grid grid-flow-col auto-col-auto overflow-hidden">
      {(publicationDataLoading || publicationDataLoading === undefined) &&
      !publicationData ? (
        <div className="relative w-full h-screen col-start-1 grid grid-flow-col auto-cols-auto top-60 md:top-44 rounded-t-md bg-white/90 opacity-100"></div>
      ) : (
        <>
          <MainPost
            publicationData={publicationData}
            didMirror={didMirror}
            fetchReactions={fetchReactions}
            getMoreMirrors={getMoreMirrors}
          />
        </>
      )}
    </div>
  );
};

export default Post;
