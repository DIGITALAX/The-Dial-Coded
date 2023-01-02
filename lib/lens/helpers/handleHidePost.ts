import { AnyAction, Dispatch } from "redux";
import hidePublication from "../../../graphql/mutations/hidePublication";
import { setIndexModal } from "../../../redux/reducers/indexModalSlice";

const handleHidePost = async (
  id: string,
  dispatch: Dispatch<AnyAction>
): Promise<void> => {
  try {
    const hidden = await hidePublication({
      publicationId: id,
    });
    if (hidden) {
      dispatch(
        setIndexModal({
          actionValue: true,
          actionMessage: "Post Successfully Hidden",
        })
      );
    }
  } catch (err: any) {
    dispatch(
      setIndexModal({
        actionValue: true,
        actionMessage: "Hide Unsuccessful, Please Try Again",
      })
    );
    console.error(err?.message);
  }
  setTimeout(() => {
    dispatch(
      setIndexModal({
        actionValue: false,
        actionMessage: undefined,
      })
    );
  }, 3000);
};

export default handleHidePost;
