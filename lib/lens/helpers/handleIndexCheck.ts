import { AnyAction, Dispatch } from "redux";
import checkIndexed from "../../../graphql/queries/checkIndexed";
import { setIndexModal } from "../../../redux/reducers/indexModalSlice";

const handleIndexCheck = async (
  tx: any,
  dispatch: Dispatch<AnyAction>,
  success: boolean
) => {
  try {
    const indexedStatus = await checkIndexed(tx);
    if (
      (indexedStatus?.data?.hasTxHashBeenIndexed?.metadataStatus?.status ===
        "SUCCESS" &&
        success) ||
      (indexedStatus?.data?.hasTxHashBeenIndexed?.indexed && !success)
    ) {
      dispatch(
        setIndexModal({
          actionValue: true,
          actionMessage: "Successfully Indexed",
        })
      );
    } else {
      dispatch(
        setIndexModal({
          actionValue: true,
          actionMessage: "Post Unsuccessful, Please Try Again",
        })
      );
    }
    setTimeout(() => {
      dispatch(
        setIndexModal({
          actionValue: false,
          actionMessage: undefined,
        })
      );
    }, 3000);
  } catch (err: any) {
    console.error(err.message);
  }
};

export default handleIndexCheck;
