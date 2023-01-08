import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import whoReactedublications from "../../../../graphql/queries/whoReactedPublication";
import { RootState } from "../../../../redux/store";
import { PaginatedResultInfo } from "../../types/lens.types";
import lodash from "lodash";
import {
  addReaction,
  removeReaction,
} from "../../../../graphql/mutations/react";
import { setReactionState } from "../../../../redux/reducers/reactionStateSlice";
import { setHearted } from "../../../../redux/reducers/heartedSlice";

const useHearted = () => {
  const {
    query: { id },
  } = useRouter();
  const dispatch = useDispatch();
  const pubId = useSelector(
    (state: RootState) => state.app.reactionStateReducer.value
  );
  const reactions = useSelector(
    (state: RootState) => state.app.reactionStateReducer
  );
  const profileId: any = useSelector(
    (state: RootState) => state?.app?.lensProfileReducer?.profile?.id
  );
  const [reactionLoading, setReactionLoading] = useState<boolean>(false);
  const [reactionInfoLoading, setReactionInfoLoading] =
    useState<boolean>(false);
  const [reacters, setReacters] = useState<any>([]);
  const [reactionPageInfo, setReactionPageInfo] =
    useState<PaginatedResultInfo>();

  // read hearts
  const getReactions = async (): Promise<void> => {
    setReactionInfoLoading(true);
    try {
      const reactions = await whoReactedublications({
        publicationId: id ? id : pubId,
      });
      const upvoteArr = lodash.filter(
        reactions?.data?.whoReactedPublication.items,
        (item) => item.reaction === "UPVOTE"
      );
      const arr: any[] = [...upvoteArr];
      const sortedArr: any[] = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      setReacters(sortedArr);
      setReactionPageInfo(reactions?.data?.whoReactedPublication?.pageInfo);
    } catch (err: any) {
      console.error(err.message);
    }
    setReactionInfoLoading(false);
  };

  const getMorePostReactions = async (): Promise<void> => {
    try {
      const reactions = await whoReactedublications({
        publicationId: id ? id : pubId,
        cursor: reactionPageInfo?.next,
      });
      const arr: any[] = [...reactions?.data?.whoReactedPublication?.items];
      const sortedArr: any[] = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      setReacters([...reacters, ...sortedArr]);
      setReactionPageInfo(reactions?.data.profiles.pageInfo);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  // write hearts
  const reactionPost = async (): Promise<void> => {
    setReactionLoading(true);
    const voteWay = lodash.filter(
      reacters,
      (item) => item?.profile?.id == profileId
    );
    try {
      if (voteWay.length === 0 || voteWay[0]?.reaction === "DOWNVOTE") {
        const add = await addReaction({
          profileId: profileId,
          reaction: "UPVOTE",
          publicationId: id ? id : pubId,
        });
        dispatch(
          setHearted({
            actionDirection: "up",
            actionId: id ? id : pubId,
          })
        );
      } else {
        const remove = await removeReaction({
          profileId: profileId,
          reaction: "DOWNVOTE",
          publicationId: id ? id : pubId,
        });
        dispatch(
          setHearted({
            actionDirection: "down",
            actionId: id ? id : pubId,
          })
        );
      }
    } catch (err: any) {
      console.error(err.message);
    }
    dispatch(
      setReactionState({
        actionOpen: false,
        actionType: "heart",
        actionValue: id ? id : pubId,
      })
    );
    setReactionLoading(false);
  };

  useEffect(() => {
    if (reactions.type === "heart") {
      getReactions();
    }
  }, [reactions.type, reactions.open, id, pubId, reactionLoading]);

  return {
    reactionPost,
    reactionLoading,
    getMorePostReactions,
    reactionInfoLoading,
    reacters,
  };
};

export default useHearted;
