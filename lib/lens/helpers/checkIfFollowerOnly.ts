import followedByMe from "../../../graphql/queries/isFollowedByMe";

const checkIfFollowerOnly = async (
  data: any | any[],
  profileId: string | undefined
): Promise<boolean | boolean[] | void> => {
  if (Array?.isArray(data)) {
    let newArray: boolean[] = [];
    for (let i = 0; i < data?.length; i++) {
      if (data[i]?.referenceModule?.type === "FollowerOnlyReferenceModule") {
        if (profileId) {
          const isFollowing = await followedByMe({
            // id of the pub owner
            profileId: data[i]?.profile?.id,
          });
          if (isFollowing?.data?.profile?.isFollowedByMe) {
            newArray.push(false);
          } else {
            newArray.push(true);
          }
        } else {
          newArray.push(true);
        }
      } else {
        newArray.push(false);
      }
    }
    return newArray;
  } else {
    if (data?.referenceModule?.type === "FollowerOnlyReferenceModule") {
      if (profileId) {
        // if logged in query via auth
        const isFollowing = await followedByMe({
          // id of the pub owner
          profileId: data?.profile?.id,
        });
        if (isFollowing?.data?.profile?.isFollowedByMe) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    } else {
      return false;
    }
  }
};

export default checkIfFollowerOnly;
