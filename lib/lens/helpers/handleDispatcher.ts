import createDispatcherRequest from "../../../graphql/mutations/dispatcher";

const handleDispatcher = async (profileId: string, enabled: boolean) => {
  console.log({
    profileId,
    enabled,
  })
  try {
    let res: any;
    if (enabled) {
      res = await createDispatcherRequest({
        profileId,
        enable: false,
      });
    } else {
      res = await createDispatcherRequest({
        profileId,
      });
    }
    return res.data.createSetDispatcherTypedData.typedData;
  } catch (err: any) {
    console.error(err.message);
  }
};

export default handleDispatcher;
