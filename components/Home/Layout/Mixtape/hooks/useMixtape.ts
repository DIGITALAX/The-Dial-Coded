import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMixtapePage } from "../../../../../redux/reducers/mixtapePageSlice";
import { Message } from "../../../../Common/types/common.types";
import { UseMixtapeResults } from "../types/mixtape.types";
import { setAddTrack } from "../../../../../redux/reducers/addTrackSlice";
import { setCollectValueType } from "../../../../../redux/reducers/collectValueTypeSlice";
import { RootState } from "../../../../../redux/store";
import { setMixtapeCheck } from "../../../../../redux/reducers/mixtapeCheckSlice";
import { setMixtapeTitle } from "../../../../../redux/reducers/mixtapeTitleSlice";
import { setMixtapeSource } from "../../../../../redux/reducers/mixtapeSourceSlice";
import { profilePublicationsAuth } from "../../../../../graphql/queries/profilePublication";
import lodash from "lodash";
import useCollectionModal from "../../../../Common/Modals/Publications/hooks/useCollectionModal";

const useMixtape = (): UseMixtapeResults => {
  const dispatch = useDispatch();
  const { handleReverseSetCollectValues } = useCollectionModal();
  const mixtapePage = useSelector(
    (state: RootState) => state.app.mixtapePageReducer.value
  );
  const indexerStatus = useSelector(
    (state: RootState) => state.app.indexModalReducer?.value
  );
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const [getMixLoading, setGetMixLoading] = useState<boolean>(false);
  const [mixtapes, setMixtapes] = useState<any[]>([]);
  const [mixtapeTitles, setMixtapeTitles] = useState<string[]>([]);
  const [mixtapeBackgrounds, setMixtapeBackgrounds] = useState<string[]>([]);
  const [paginatedResults, setPaginatedResults] = useState<any>();
  const [updateMix, setUpdateMix] = useState<any>();

  const getMixtapes = async (): Promise<void> => {
    setGetMixLoading(true);
    try {
      const { data } = await profilePublicationsAuth({
        sources: "thedial",
        profileId: lensProfile,
        publicationTypes: ["POST"],
        limit: 30,
        metadata: {
          tags: {
            all: ["dialMixtape"],
          },
        },
      });

      const arr: any[] = [...data?.publications?.items];
      const sortedArr = arr.sort(
        (a: any, b: any) => Date.parse(a.createdAt) - Date.parse(b.createdAt)
      );
      let mBg: string[] = [];
      let mT: string[] = [];
      sortedArr.forEach((item) => {
        mBg.push(item?.metadata.content.split("\n\n")[3].split(",")[0]);
        mT.push(item?.metadata.name);
      });
      setMixtapeBackgrounds(mBg);
      setMixtapeTitles(mT);
      setPaginatedResults(data?.publications?.pageInfo);
      setMixtapes(sortedArr);
    } catch (err: any) {
      console.error(err.message);
    }
    setGetMixLoading(false);
  };

  const getMoreMixtapes = async (): Promise<void> => {
    try {
      const { data } = await profilePublicationsAuth({
        sources: "thedial",
        profileId: lensProfile,
        publicationTypes: ["POST"],
        limit: 30,
        cursor: paginatedResults?.next,
        metadata: {
          tags: {
            all: ["dialMixtape"],
          },
        },
      });

      const arr: any[] = [...data?.publications?.items];
      const sortedArr = arr.sort(
        (a: any, b: any) => Date.parse(a.createdAt) - Date.parse(b.createdAt)
      );
      let mBg: string[] = [];
      let mT: string[] = [];
      sortedArr.forEach((item) => {
        mBg.push(item?.metadata.content.split("\n\n")[3].split(",")[0]);
        mT.push(item?.metadata.name);
      });
      setMixtapeBackgrounds([...mixtapeBackgrounds, ...mBg]);
      setMixtapeTitles([...mixtapeTitles, ...mT]);
      setPaginatedResults(data?.publications?.pageInfo);
      setMixtapes([...mixtapes, ...sortedArr]);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleTapeSet = (title: string): void => {
    dispatch(
      setCollectValueType({
        freeCollectModule: {
          followerOnly: false,
        },
      })
    );
    dispatch(setMixtapePage(title));
  };

  const notificationImages: string[] = [
    "QmWR9hQkHLZ8VwWMCX1mnDUgabniBr7SuvSA4JpDVmUrjX",
    "QmUFEhfqFsKAnTPZaL8Ln9yaz8QPNiJNnuvbStZmXvage3",
    "QmZ6Theb5qCCscnBZhYZK2epoJftL67yLsD3JweBkBXtvK",
    "QmXfuFr8qDbajQ4nCTnrb4bfdrZgD7TymxMziSukyqxHk2",
  ];

  const message: Message = {
    title: "The dial in retro*",
    paragraph: "A New Mix Made For You To Evolve & Enjoy Each Week",
  };

  useEffect(() => {
    dispatch(
      setAddTrack({
        actionImageURI: Array(10).fill(""),
        actionTitle: Array(10).fill("TRACK NAME | SOURCE (shortened)"),
      })
    );
    dispatch(setMixtapeTitle(""));
    dispatch(setMixtapeSource(""));
  }, []);

  useEffect(() => {
    if (mixtapePage === "Add New Mixtape" || !mixtapePage) {
      dispatch(
        setCollectValueType({
          freeCollectModule: {
            followerOnly: false,
          },
        })
      );
      dispatch(
        setAddTrack({
          actionImageURI: Array(10).fill(""),
          actionTitle: Array(10).fill("TRACK NAME | SOURCE (shortened)"),
        })
      );
      dispatch(setMixtapeCheck(undefined));
      dispatch(setMixtapeTitle(""));
      dispatch(setMixtapeSource(""));
      handleReverseSetCollectValues(undefined);
    }  else {
      const mixtape = lodash.find(
        mixtapes,
        (mix) => mix?.metadata?.name === mixtapePage
      );
      handleReverseSetCollectValues(mixtape?.collectModule);
      dispatch(setMixtapeCheck(mixtape?.metadata?.content?.split("\n\n")[1]));
      let images: string[] = [];
      let tracks: string[] = [];
      mixtape?.metadata?.content
        ?.split("\n\n")[3]
        .split(",")
        .forEach((image: any, index: number) => {
          images.push(image);
          tracks.push(
            mixtape?.metadata?.content?.split("\n\n")[2]?.split(",")[index]
          );
        });

      dispatch(
        setAddTrack({
          actionImageURI: images,
          actionTitle: tracks,
        })
      );
      dispatch(setMixtapeTitle(mixtape?.metadata?.name));
      dispatch(setMixtapeSource(mixtape?.metadata?.content?.split("\n\n")[0]));
      setUpdateMix(mixtape);
    }
  }, [mixtapePage]);

  useEffect(() => {
    getMixtapes();
  }, [indexerStatus]);

  return {
    handleTapeSet,
    notificationImages,
    message,
    mixtapeTitles,
    mixtapeBackgrounds,
    getMoreMixtapes,
    getMixLoading,
    mixtapes,
    updateMix,
  };
};
export default useMixtape;
