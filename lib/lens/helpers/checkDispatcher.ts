import { AnyAction, Dispatch } from "redux";
import createDispatcherRequest from "../../../graphql/mutations/dispatcher";
import checkDispatcherEnabled from "../../../graphql/queries/dispatcher";
import { setDispatcher } from "../../../redux/reducers/dispatcherSlice";

const checkDispatcher = async (
  dispatch: Dispatch<AnyAction>,
  profileId?: string
): Promise<void> => {
  try {
    if (profileId) {
      const res = await checkDispatcherEnabled({
        profileId,
      });
      const value = res.data.profile.dispatcher;
      dispatch(setDispatcher(!value ? false : value));
      if (value) {
        const resDis = await createDispatcherRequest({
          profileId
        })
      }
    }
  } catch (err: any) {
    console.error(err.message);
  }
};

export default checkDispatcher;
