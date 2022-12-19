import Image from "next/image";
import { FunctionComponent } from "react";
import { ViewerProps } from "../types/parameters.types";
import lodash from "lodash";
import { BsFillEyeFill } from "react-icons/bs";
import { IoMdArrowDropdown } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../../../redux/store";
import { setUserViewer } from "../../../../../../../redux/reducers/userViewSlice";
import { INFURA_GATEWAY } from "../../../../../../../lib/lens/constants";
import { setFire } from "../../../../../../../redux/reducers/fireSlice";

const Viewer: FunctionComponent<ViewerProps> = ({
  setUserTypeOpen,
  userTypeOpen,
  userList,
}): JSX.Element => {
  const dispatch = useDispatch();
  const userSelected = useSelector(
    (state: RootState) => state.app.userViewerReducer.value
  );
  const fireCount = useSelector(
    (state: RootState) => state.app.fireReducer.value
  );
  return (
    <div className="relative w-fit h-full grid grid-flow-row auto-rows-auto col-start-2 gap-6 justify-self-end self-start">
      <div className="relative w-fit h-fit col-start-1 grid grid-flow-row auto-rows-auto place-self-center">
        <div
          className={`relative w-40 h-fit px-3 py-2 rounded-t-lg ${
            !userTypeOpen && "rounded-b-lg"
          } row-start-1 cursor-pointer grid grid-flow-col auto-cols-auto gap-2 border-t-2 ${
            userTypeOpen ? "border-b" : "border-b-2"
          } border-x-2 border-black place-self-center bg-white`}
          onClick={() => {
            setUserTypeOpen(!userTypeOpen);
          }}
        >
          <div className="relative w-fit h-fit col-start-1 place-self-center">
            <BsFillEyeFill color="black" size={15} />
          </div>
          <div className="relative w-full h-fit col-start-2 text-black font-dosis lowercase place-self-center grid grid-flow-col auto-cols-auto whitespace-nowrap">
            <div className="relative col-start-1 place-self-center w-fit h-fit">
              {userSelected}
            </div>
          </div>
          <div className="relative w-fit h-fit col-start-3 self-center justify-self-start">
            <IoMdArrowDropdown color="black" size={15} />
          </div>
        </div>
        <div className="absolute w-full h-fit grid grid-flow-row auto-rows-auto row-start-2">
          {userTypeOpen && userSelected !== "Select User" && (
            <div
              className={`relative w-40 h-fit px-3 py-2 row-start-1 cursor-pointer grid grid-flow-col auto-cols-auto gap-2 border-y border-x-2 border-black bg-gray-300 hover:bg-gray-400`}
              onClick={() => {
                dispatch(setUserViewer("Select User"));
              }}
            >
              <div className="relative w-full h-fit text-black font-dosis lowercase place-self-center grid grid-flow-col auto-cols-auto whitespace-nowrap col-start-1">
                <div className="relative col-start-1 place-self-center w-fit h-fit">
                  Reset
                </div>
              </div>
            </div>
          )}
          <div
            className={`relative ${
              userSelected !== "Select User" ? "row-start-3" : "row-start-2"
            } grid grid-flow-row auto-rows-auto w-32 h-fit cursor-pointer`}
          >
            {userTypeOpen &&
              (userSelected === "Select User"
                ? userList
                : lodash.filter(userList, (user) => user !== userSelected)
              )?.map((user: string, index: number) => {
                return (
                  <div
                    key={index}
                    className={`relative w-40 h-fit px-3 py-2 bg-white ${
                      userSelected === "Select User" &&
                      index === userList.length - 1 &&
                      "rounded-b-lg"
                    } 
                    ${
                      userSelected !== "Select User" &&
                      index === userList.length - 2 &&
                      "rounded-b-lg"
                    } 
                    ${
                      userSelected !== "Select User" &&
                      index === userList.length - 2
                        ? "border-b-2"
                        : "border-b"
                    }
                    ${
                      userSelected === "Select User" &&
                      index === userList.length - 1
                        ? "border-b-2"
                        : "border-b"
                    } col-start-1 grid grid-flow-col auto-cols-auto gap-3 cursor-pointer border-x-2 border-t border-black hover:bg-offBlue`}
                    onClick={() => {
                      setUserTypeOpen(!userTypeOpen);
                      userTypeOpen && dispatch(setUserViewer(user));
                    }}
                  >
                    <div className="relative w-fit h-fit col-start-1 text-black font-dosis lowercase place-self-center grid grid-flow-col auto-cols-auto">
                      <div className="relative col-start-1 place-self-center w-fit h-fit">
                        {userTypeOpen ? user : userSelected}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      <div
        className="relative w-fit h-fit col-start-2 row-start-1 cursor-pointer active:scale-95 justify-self-end self-center"
        onClick={() =>
          dispatch(
            setFire(!fireCount ? 0 : fireCount === 5 ? 0 : fireCount + 1)
          )
        }
      >
        <Image
          src={`${INFURA_GATEWAY}/ipfs/QmfNvhTRhR7ginJh2pHTEPTNthM6GWhp8NpfuA9LggqgYQ`}
          width={30}
          height={30}
          alt="venn"
        />
      </div>
      <div
        className="relative w-fit h-fit row-start-2 col-start-2 cursor-pointer active:scale-95 justify-self-end self-center"
        onClick={() =>
          dispatch(
            setFire(!fireCount ? 0 : fireCount === 5 ? 0 : fireCount + 1)
          )
        }
      >
        <Image
          src={`${INFURA_GATEWAY}/ipfs/QmUbXpg43xj51Lvj9uDswhvkBZfXVnwWmaJfwp9jYgRMUT`}
          width={30}
          height={30}
          alt="fire"
        />
      </div>
    </div>
  );
};

export default Viewer;
