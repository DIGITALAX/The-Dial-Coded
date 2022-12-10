import { FunctionComponent } from "react";
import useParameters from "./hooks/useParameters";
import { BsFillEyeFill } from "react-icons/bs";
import { IoMdArrowDropdown } from "react-icons/io";
import lodash from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { setFeedOrder } from "../../../../../redux/reducers/feedOrderSlice";
import { RootState } from "../../../../../redux/store";
import { setFeedType } from "../../../../../redux/reducers/feedTypeSlice";
import { setFeedPriority } from "../../../../../redux/reducers/feedPrioritySlice";
import Image from "next/image";

const Parameters: FunctionComponent = (): JSX.Element => {
  const {
    feedOrder,
    feedType,
    feedPriority,
    orderPriority,
    setPriorityDrop,
    orderType,
    setTypeDrop,
    orderDrop,
    setOrderDrop,
  } = useParameters();
  const dispatch = useDispatch();
  const orderSelected = useSelector(
    (state: RootState) => state.app.feedOrderReducer.value
  );
  const typeSelected = useSelector(
    (state: RootState) => state.app.feedTypeReducer.value
  );
  const prioritySelected = useSelector(
    (state: RootState) => state.app.feedPriorityReducer.value
  );
  return (
    <div className="relative w-full h-full row-start-2 grid grid-flow-col auto-cols-auto">
      <div className="relative w-fit h-fit col-start-1 grid grid-flow-col auto-cols-auto gap-5">
        <div className="relative w-fit h-fit col-start-1 grid grid-flow-row auto-rows-auto">
          <div
            id="select1"
            className={`relative w-32 h-fit px-3 py-2 rounded-t-lg ${
              !orderDrop && "rounded-b-lg"
            } row-start-1 cursor-pointer grid grid-flow-col auto-cols-auto gap-3`}
            onClick={() => {
              setOrderDrop(!orderDrop);
            }}
          >
            <div className="relative w-fit h-fit col-start-1 place-self-center">
              <BsFillEyeFill color="white" size={15} />
            </div>
            <div className="relative w-full h-fit col-start-2 text-white font-dosis lowercase self-center place-self-center grid grid-flow-col auto-cols-auto">
              <div className="relative col-start-1 place-self-center w-fit h-fit">
                {orderSelected}
              </div>
            </div>
            <div className="relative w-fit h-fit col-start-3 self-center justify-self-start">
              <IoMdArrowDropdown color="#FFDE90" size={15} />
            </div>
          </div>
          <div className="relative row-start-2 grid grid-flow-row auto-rows-auto w-32 h-fit cursor-pointer">
            {orderDrop &&
              lodash
                .filter(feedOrder, (item) => item !== orderSelected)
                ?.map((item: string, index: number) => {
                  return (
                    <div
                      id="select1"
                      key={index}
                      className={`relative w-32 h-fit px-3 py-2 ${
                        index === feedOrder.length - 2 && "rounded-b-lg"
                      } col-start-1 grid grid-flow-col auto-cols-auto gap-3 cursor-pointer`}
                      onClick={() => {
                        setOrderDrop(!orderDrop);
                        orderDrop && dispatch(setFeedOrder(item));
                      }}
                    >
                      <div className="relative w-fit h-fit col-start-1 text-white font-dosis lowercase place-self-center grid grid-flow-col auto-cols-auto">
                        <div className="relative col-start-1 place-self-center w-fit h-fit">
                          {orderDrop ? item : orderSelected}
                        </div>
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>
        <div className="relative w-fit h-fit col-start-2 grid grid-flow-row auto-rows-auto">
          <div
            id="select2"
            className={`relative w-32 h-fit px-3 py-2 rounded-t-lg ${
              !orderType && "rounded-b-lg"
            } row-start-1 cursor-pointer grid grid-flow-col auto-cols-auto gap-3`}
            onClick={() => {
              setTypeDrop(!orderType);
            }}
          >
            <div className="relative w-fit h-fit col-start-1 place-self-center">
              <Image
                src="https://thedial.infura-ipfs.io/ipfs/QmUsRo1UyCBix8HHjQ9JrZTshWqS9hLL6ZcAqSn9Prdu98"
                alt="sundial"
                width={20}
                height={20}
              />
            </div>
            <div className="relative w-full h-fit col-start-2 text-white font-dosis lowercase self-center place-self-center grid grid-flow-col auto-cols-auto">
              <div className="relative col-start-1 place-self-center w-fit h-fit">
                {typeSelected}
              </div>
            </div>
            <div className="relative w-fit h-fit col-start-3 self-center justify-self-start">
              <IoMdArrowDropdown color="#FFDE90" size={15} />
            </div>
          </div>
          <div className="relative row-start-2 grid grid-flow-row auto-rows-auto w-32 h-fit cursor-pointer">
            {orderType &&
              lodash
                .filter(feedType, (item) => item !== typeSelected)
                ?.map((item: string, index: number) => {
                  return (
                    <div
                      id="select2"
                      key={index}
                      className={`relative w-32 h-fit px-3 py-2 ${
                        index === feedType.length - 2 && "rounded-b-lg"
                      } col-start-1 grid grid-flow-col auto-cols-auto gap-3 cursor-pointer`}
                      onClick={() => {
                        setTypeDrop(!orderType);
                        orderType && dispatch(setFeedType(item));
                      }}
                    >
                      <div className="relative w-fit h-fit col-start-1 text-white font-dosis lowercase place-self-center grid grid-flow-col auto-cols-auto">
                        <div className="relative col-start-1 place-self-center w-fit h-fit">
                          {orderType ? item : typeSelected}
                        </div>
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>
        <div className="relative w-fit h-fit col-start-3 grid grid-flow-row auto-rows-auto">
          <div
            id="select3"
            className={`relative w-32 h-fit px-3 py-2 rounded-t-lg ${
              !orderPriority && "rounded-b-lg"
            } row-start-1 cursor-pointer grid grid-flow-col auto-cols-auto gap-3`}
            onClick={() => {
              setPriorityDrop(!orderPriority);
            }}
          >
            <div className="relative w-fit h-fit col-start-1 place-self-center">
              <Image
                src="https://thedial.infura-ipfs.io/ipfs/QmVhUPaoLCk8Yz6TfP9p7atJMA6JfDbFB65ZxyqFEMCdyD"
                alt="lightning"
                width={10}
                height={10}
              />
            </div>
            <div className="relative w-full h-fit col-start-2 text-white font-dosis lowercase self-center place-self-center grid grid-flow-col auto-cols-auto">
              <div className="relative col-start-1 place-self-center w-fit h-fit">
                {prioritySelected}
              </div>
            </div>
            <div className="relative w-fit h-fit col-start-3 self-center justify-self-start">
              <IoMdArrowDropdown color="#FFDE90" size={15} />
            </div>
          </div>
          <div className="relative row-start-2 grid grid-flow-row auto-rows-auto w-32 h-fit cursor-pointer">
            {orderPriority &&
              lodash
                .filter(feedPriority, (item) => item !== prioritySelected)
                ?.map((item: string, index: number) => {
                  return (
                    <div
                      id="select3"
                      key={index}
                      className={`relative w-32 h-fit px-3 py-2 ${
                        index === feedPriority.length - 2 && "rounded-b-lg"
                      } col-start-1 grid grid-flow-col auto-cols-auto gap-3 cursor-pointer`}
                      onClick={() => {
                        setPriorityDrop(!orderPriority);
                        orderPriority && dispatch(setFeedPriority(item));
                      }}
                    >
                      <div className="relative w-fit h-fit col-start-1 text-white font-dosis lowercase place-self-center grid grid-flow-col auto-cols-auto">
                        <div className="relative col-start-1 place-self-center w-fit h-fit">
                          {orderPriority ? item : prioritySelected}
                        </div>
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>
      </div>
      <div className="relative w-full h-fit grid grid-flow-col auto-cols-auto"></div>
    </div>
  );
};

export default Parameters;
