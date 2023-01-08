import followers from "../../../graphql/queries/followers";

const getFollowers = async (
  setLoading: (e: boolean) => void,
  setPaginated: (e: any) => void,
  setFollowers: (e: any[]) => void,
  profileId: string
): Promise<void> => {
  setLoading(true);
  try {
    const { data } = await followers({
      profileId: profileId,
      limit: 50,
    });
    
    setFollowers(data?.followers?.items);
    setPaginated;
    setPaginated(data?.followers?.pageInfo);
  } catch (err: any) {
    console.error(err.message);
  }
  setLoading(false);
};

export default getFollowers;