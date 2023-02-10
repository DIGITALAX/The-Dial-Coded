import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { profilePublicationsAuth } from "../../../../../graphql/queries/profilePublication";
import { RootState } from "../../../../../redux/store";
import {
  PaginatedFollowersResult,
  PaginatedFollowingResult,
  PublicationSearchResult,
} from "../../../../Common/types/lens.types";
import lodash from "lodash";
import followers from "../../../../../graphql/queries/followers";
import following from "../../../../../graphql/queries/following";
import { useAccount } from "wagmi";
import checkPostReactions from "../../../../../lib/lens/helpers/checkPostReactions";
import checkIfMirrored from "../../../../../lib/lens/helpers/checkIfMirrored";
import checkIfCommented from "../../../../../lib/lens/helpers/checkIfCommented";
import checkIfMixtapeMirror from "../../../../../lib/lens/helpers/checkIfMixtapeMirror";
import getFollowers from "../../../../../lib/lens/helpers/getFollowers";
import getFollowing from "../../../../../lib/lens/helpers/getFollowing";
import checkIfFollowerOnly from "../../../../../lib/lens/helpers/checkIfFollowerOnly";

const useProfile = () => {
  const selectProfile = useSelector(
    (state: RootState) => state.app.accountPageReducer.value
  );
  const profileId = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const indexerModal = useSelector(
    (state: RootState) => state.app.indexModalReducer
  );
  const hearted = useSelector(
    (state: RootState) => state.app.heartedReducer?.direction
  );
  const { address } = useAccount();
  const [userFeed, setUserFeed] = useState<PublicationSearchResult[]>([]);
  const [hasMirrored, setHasMirrored] = useState<boolean[]>([]);
  const [hasCommented, setHasCommented] = useState<boolean[]>([]);
  const [hasReacted, setHasReacted] = useState<boolean[]>([]);
  const [reactionsFeed, setReactionsFeed] = useState<any[]>([]);
  const [paginatedResults, setPaginatedResults] = useState<any>();
  const [profileDataLoading, setProfileDataLoading] = useState<boolean>(false);
  const [mixtapeMirror, setMixtapeMirror] = useState<boolean[]>([]);
  const [followersLoading, setFollowersLoading] = useState<boolean>(false);
  const [followingLoading, setFollowingLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [followerOnly, setFollowerOnly] = useState<boolean[]>([]);
  const [userFollowing, setUserFollowing] = useState<
    PaginatedFollowingResult[]
  >([]);
  const [userFollowers, setUserFollowers] = useState<
    PaginatedFollowersResult[]
  >([]);
  const [paginatedFollowers, setPaginatedFollowers] = useState<any>();
  const [paginatedFollowing, setPaginatedFollowing] = useState<any>();

  const getMoreFollowers = async (): Promise<void> => {
    try {
      const { data } = await followers({
        profileId: profileId,
        limit: 50,
        cursor: paginatedFollowers?.next,
      });
      setUserFollowers([...userFollowers, ...data?.followers?.items]);
      setPaginatedFollowers(data?.followers?.pageInfo);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getMoreFollowing = async (): Promise<void> => {
    try {
      const { data } = await following({
        address: address,
        limit: 50,
        cursor: paginatedFollowing?.next,
      });
      setUserFollowing([...userFollowing, ...data?.following?.items]);
      setPaginatedFollowing(data?.following?.pageInfo);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getUserProfileFeed = async () => {
    setProfileDataLoading(true);
    try {
      const { data } = await profilePublicationsAuth({
        sources: "thedial",
        profileId: profileId,
        publicationTypes: ["POST", "COMMENT", "MIRROR"],
        limit: 30,
      });
      const arr: any[] = [...data?.publications?.items];
      const sortedArr = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      if (!sortedArr || sortedArr?.length < 30) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      const filteredArr = lodash.filter(sortedArr, (arr: any) => {
        if (arr?.__typename === "Post") {
          if (!arr?.metadata?.content.includes("*Dial Mixtape*")) {
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      });
      setUserFeed(filteredArr);
      const isFollowedByMe = await checkIfFollowerOnly(filteredArr, profileId);
      setFollowerOnly(isFollowedByMe as boolean[]);
      setPaginatedResults(data?.publications?.pageInfo);
      const response = await checkPostReactions(filteredArr, profileId);
      setHasReacted(response?.hasReactedArr);
      const mixtapeMirrors = checkIfMixtapeMirror(filteredArr);
      setMixtapeMirror(mixtapeMirrors);
      const hasMirroredArr = await checkIfMirrored(filteredArr, profileId);
      setHasMirrored(hasMirroredArr);
      const hasCommentedArr = await checkIfCommented(filteredArr, profileId);
      setHasCommented(hasCommentedArr);
      setReactionsFeed(response?.reactionsFeedArr);
    } catch (err: any) {
      console.error(err.message);
    }
    setProfileDataLoading(false);
  };

  const getMoreUserProfileFeed = async (): Promise<void> => {
    try {
      console.log(paginatedResults?.next);
      if (!paginatedResults?.next) {
        setHasMore(false);
        return;
      }
      setHasMore(true);
      const { data } = await profilePublicationsAuth({
        sources: "thedial",
        profileId: profileId,
        publicationTypes: ["POST", "COMMENT", "MIRROR"],
        limit: 30,
        cursor: paginatedResults?.next,
      });
      const arr: any[] = [...data?.publications?.items];
      const sortedArr = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      if (sortedArr?.length < 30) {
        setHasMore(false);
      }
      const filteredArr = lodash.filter(sortedArr, (arr) => {
        if (arr?.__typename === "Post") {
          if (!arr?.metadata?.content.includes("*Dial Mixtape*")) {
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      });
      setUserFeed([...userFeed, ...filteredArr]);
      const isFollowedByMe = await checkIfFollowerOnly(filteredArr, profileId);
      setFollowerOnly([...followerOnly, ...(isFollowedByMe as boolean[])]);
      setPaginatedResults(data?.publications?.pageInfo);
      const response = await checkPostReactions(filteredArr, profileId);
      setReactionsFeed([...reactionsFeed, ...response?.reactionsFeedArr]);
      const mixtapeMirrors = checkIfMixtapeMirror(filteredArr);
      setMixtapeMirror([...mixtapeMirror, ...mixtapeMirrors]);
      const hasMirroredArr = await checkIfMirrored(filteredArr, profileId);
      setHasMirrored([...hasMirrored, ...hasMirroredArr]);
      const hasCommentedArr = await checkIfCommented(filteredArr, profileId);
      setHasCommented([...hasCommented, ...hasCommentedArr]);
      setHasReacted([...hasReacted, ...response?.hasReactedArr]);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (selectProfile === "profile feed") {
      getUserProfileFeed();
    }
    if (selectProfile === "stats") {
      getFollowing(
        setFollowingLoading,
        setPaginatedFollowing,
        setUserFollowing,
        address
      );
      getFollowers(
        setFollowersLoading,
        setPaginatedFollowers,
        setUserFollowers,
        profileId
      );
    }
  }, [selectProfile, indexerModal.value, indexerModal.message, hearted]);

  return {
    profileDataLoading,
    getMoreUserProfileFeed,
    userFeed,
    hasMirrored,
    hasCommented,
    hasReacted,
    reactionsFeed,
    userFollowers,
    userFollowing,
    getMoreFollowers,
    getMoreFollowing,
    followersLoading,
    followingLoading,
    mixtapeMirror,
    followerOnly,
    hasMore,
  };
};

export default useProfile;
