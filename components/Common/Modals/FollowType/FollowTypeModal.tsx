import React, { FunctionComponent } from "react";
import { ImCross } from "react-icons/im";
import { useDispatch, useSelector } from "react-redux";
import { FollowTypeModalProps } from "../../types/common.types";
import { AiOutlineLoading } from "react-icons/ai";
import { setFollowTypeValues } from "../../../../redux/reducers/followTypeValuesSlice";
import { RootState } from "../../../../redux/store";
import FollowInfo from "../../Profile/modules/FollowInfo";

const FollowTypeModal: FunctionComponent<FollowTypeModalProps> = ({
  followInfoLoading,
  followTypedData,
  approvalLoading,
  approveCurrency,
  followLoading,
}): JSX.Element | null => {
  const dispatch = useDispatch();
  const followValues = useSelector(
    (state: RootState) => state.app.followTypeValuesReducer
  );
  return (
    <div className="inset-0 justify-center fixed z-40 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-full md:w-[40vw] h-fit col-start-1 place-self-center bg-offBlue/70 rounded-lg p-2">
        <div className="relative bg-white w-full h-fit rounded-xl grid grid-flow-col auto-cols-auto">
          <div className="relative w-full h-full col-start-1 rounded-xl place-self-center grid grid-flow-row auto-rows-auto gap-10 pb-8">
            <div
              className="relative w-fit h-fit row-start-1 self-center justify-self-end pr-3 pt-3 cursor-pointer"
              onClick={() =>
                dispatch(
                  setFollowTypeValues({
                    actionType: undefined,
                    actionCurrency: undefined,
                    actionAddress: undefined,
                    actionValue: undefined,
                    actionUSD: undefined,
                    actionApproved: undefined,
                    actionModal: false,
                  })
                )
              }
            >
              <ImCross color="black" size={15} />
            </div>
            <div className="relative w-full h-fit grid grid-flow-row auto-rows-auto row-start-3">
              {!followInfoLoading ? (
                followValues?.type?.includes("Revert") ? (
                  <FollowInfo
                    type={"revert"}
                    approvalLoading={approvalLoading}
                    followLoading={followLoading}
                  />
                ) : (
                  <FollowInfo
                    approvalLoading={approvalLoading}
                    type={"fee"}
                    buttonText={followValues?.isApproved ? "Follow" : "Approve"}
                    symbol={followValues?.currency}
                    value={followValues?.value}
                    usd={followValues?.usd}
                    isApproved={followValues?.isApproved}
                    approveCurrency={approveCurrency}
                    followTypedData={followTypedData}
                    followLoading={followLoading}
                  />
                )
              ) : (
                <div className="relative w-full h-60 grid grid-flow-col auto-cols-auto">
                  <div className="relative w-fit h-fit col-start-1 place-self-center animate-spin">
                    <AiOutlineLoading color="black" size={20} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowTypeModal;
