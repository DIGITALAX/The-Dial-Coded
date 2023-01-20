import createDispatcherRequest from "../../../graphql/mutations/dispatcher";

const handleDispatcher = async (profileId: string, enabled: boolean) => {
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
