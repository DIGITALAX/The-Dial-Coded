import { FunctionComponent } from "react";
import { ImCross } from "react-icons/im";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineLoading } from "react-icons/ai";
import { setCollectNotification } from "../../../../redux/reducers/collectNotificationSlice";
import { RootState } from "../../../../redux/store";

const CollectNotificationModal: FunctionComponent = (): JSX.Element => {
  const dispatch = useDispatch();
  const type = useSelector(
    (state: RootState) => state.app.collectNotificationReducer.type
  );
  return (
    <div className="inset-0 justify-center fixed z-50 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-[40vw] h-fit col-start-1 place-self-center bg-offBlue/80 rounded-lg">
        <div className="relative w-full row-start-2 h-fit rounded-xl grid grid-flow-col auto-cols-auto">
          <div className="relative w-full h-full col-start-1 rounded-xl place-self-center">
            <div className="relative w-full h-full grid grid-flow-row auto-rows-auto gap-10 pb-8">
              <div className="relative w-fit h-fit row-start-1 self-center justify-self-end pr-3 pt-3 cursor-pointer">
                <ImCross
                  color="white"
                  size={15}
                  onClick={() =>
                    dispatch(
                      setCollectNotification({
                        actionOpen: false,
                        actionType: "",
                      })
                    )
                  }
                />
              </div>
              <div className="relative w-full h-fit row-start-2 grid grid-flow-col auto-cols-auto px-4">
                <div className="relative w-fit h-fit font-dosis text-white text-xl place-self-center text-center">
                  {`Please set the ${
                    type === "limit" ? "edition limit" : "publication award"
                  } to greater than 0.`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectNotificationModal;
