import { AnyAction, Dispatch } from "redux";
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
    }
  } catch (err: any) {
    console.error(err.message);
  }
};

export default checkDispatcher;
