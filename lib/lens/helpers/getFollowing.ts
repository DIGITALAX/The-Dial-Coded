import following from "../../../graphql/queries/following";

const getFollowing = async (
  setLoading: (e: boolean) => void,
  setPaginated: (e: any) => void,
  setFollowers: (e: any[]) => void,
  address: `0x${string}` | undefined
): Promise<void> => {
  setLoading(true);
  try {
    const { data } = await following({
      address: address,
      limit: 50,
    });
    setFollowers(data?.following?.items);
    setPaginated(data?.following?.pageInfo);
  } catch (err: any) {
    console.error(err.message);
  }
  setLoading(false);
};

export default getFollowing;
