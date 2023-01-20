import Image from "next/legacy/image";
import { FormEvent, FunctionComponent } from "react";
import { ViewerProps } from "../types/parameters.types";
import { BsFillEyeFill } from "react-icons/bs";
import { INFURA_GATEWAY } from "../../../../../../../lib/lens/constants";
import { AiOutlineLoading } from "react-icons/ai";
import InfiniteScroll from "react-infinite-scroll-component";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import createProfilePicture from "../../../../../../../lib/lens/helpers/createProfilePicture";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../../../redux/store";
import { setSignIn } from "../../../../../../../redux/reducers/signInSlice";
import { useConnectModal } from "@rainbow-me/rainbowkit";

const Viewer: FunctionComponent<ViewerProps> = ({
  userTypeOpen,
  searchProfiles,
  profileSearch,
  searchLoading,
  handleChosenProfile,
  getMoreProfiles,
  searchTarget,
  dispatcher,
  setDispatcherEnabled,
  dispatcherLoading,
}): JSX.Element => {
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const connected = useSelector(
    (state: RootState) => state.app.walletConnectedReducer.value
  );
  const dispatch = useDispatch();
  const { openConnectModal } = useConnectModal();
  return (
    <div className="relative w-fit h-full grid grid-flow-row auto-rows-auto col-start-2 gap-6 justify-self-end self-start">
      <div className="relative w-fit h-fit col-start-1 grid grid-flow-row auto-rows-auto place-self-center">
        <div
          className={`relative w-60 h-10 pl-3 py-px rounded-lg row-start-1 grid grid-flow-col auto-cols-auto gap-2 border-2 border-black place-self-center bg-white`}
        >
          <div className="relative w-fit h-fit col-start-1 place-self-center">
            <BsFillEyeFill color="black" size={15} />
          </div>
          <div className="relative w-full h-full col-start-2 text-black font-dosis lowercase place-self-center grid grid-flow-col auto-cols-auto whitespace-nowrap">
            <input
              placeholder="search profile"
              value={searchTarget}
              className="relative col-start-1 place-self-center w-full h-full rounded-lg pl-px text-offBlack font-dosis caret-transparent"
              onChange={(e: FormEvent) => searchProfiles(e)}
            />
          </div>
        </div>
        <div
          className={`absolute w-full h-fit grid grid-flow-row auto-rows-auto row-start-2 bg-white z-2 ${
            userTypeOpen && "border-2 border-black"
          }`}
        >
          <div
            className={`relative row-start-1 grid grid-flow-row auto-rows-auto w-full h-fit overflow-y-scroll`}
          >
            {searchLoading ? (
              <div className="relative w-full h-10 px-3 py-2 bg-white col-start-1 grid grid-flow-col auto-cols-auto">
                <div className="relative w-fit h-fit place-self-center animate-spin col-start-1">
                  <AiOutlineLoading color="black" size={15} />
                </div>
              </div>
            ) : (
              profileSearch?.length > 0 &&
              userTypeOpen && (
                <InfiniteScroll
                  hasMore={true}
                  dataLength={profileSearch?.length}
                  next={getMoreProfiles}
                  loader={""}
                  height={"10rem"}
                  className="relative w-full h-fit"
                >
                  {profileSearch?.map((user: any, index: number) => {
                    const profileImage = createProfilePicture(user);
                    return (
                      <div
                        key={index}
                        className={`relative w-full h-fit px-3 py-2 bg-white col-start-1 grid grid-flow-col auto-cols-auto gap-3 cursor-pointer border-y border-black hover:bg-offBlue`}
                        onClick={() => {
                          handleChosenProfile(user);
                        }}
                      >
                        <div className="relative w-fit h-fit col-start-1 text-black font-dosis lowercase place-self-center grid grid-flow-col auto-cols-auto gap-2">
                          <div
                            className={`relative rounded-full flex bg-white w-5 h-5 place-self-center col-start-1`}
                            id="crt"
                          >
                            {profileImage !== "" && (
                              <Image
                                src={profileImage}
                                objectFit="cover"
                                alt="pfp"
                                layout="fill"
                                className="relative w-fit h-fit rounded-full self-center"
                              />
                            )}
                          </div>
                          <div className="relative col-start-2 place-self-center w-fit h-fit text-sm">
                            @{user?.handle}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </InfiniteScroll>
              )
            )}
          </div>
        </div>
      </div>
      <div
        className="relative w-fit h-fit col-start-2 row-start-1 cursor-pointer justify-self-end self-center"
        id="venn-tool"
      >
        <Image
          src={`${INFURA_GATEWAY}/ipfs/QmfNvhTRhR7ginJh2pHTEPTNthM6GWhp8NpfuA9LggqgYQ`}
          width={30}
          height={30}
          alt="venn"
        />
      </div>
      <ReactTooltip
        anchorId="venn-tool"
        place="left"
        content="🔥 Coming Soon 🔥"
        style={{
          fontSize: "9px",
          backgroundColor: "#131313",
          opacity: "0.7",
        }}
      />
      <div
        className={`relative w-fit h-fit row-start-2 col-start-1 justify-self-end self-center  ${
          dispatcherLoading ? "animate-spin" : "cursor-pointer active:scale-95"
        } ${!dispatcher && !dispatcherLoading && "animate-bounce"}`}
        id="toggle-dispatcher"
        onClick={
          !connected
            ? openConnectModal
            : connected && !lensProfile
            ? () => dispatch(setSignIn(true))
            : () => setDispatcherEnabled()
        }
      >
        {!dispatcherLoading ? (
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmYYX6WxNkLmETpnueyAcoGA1V9jypEXqtzXSKgQeN28ra`}
            width={30}
            height={30}
            alt="dispatcher"
          />
        ) : (
          <AiOutlineLoading size={20} color="black" />
        )}
      </div>
      <ReactTooltip
        anchorId="toggle-dispatcher"
        place="left"
        content={!dispatcher ? "Enable Dispatcher" : "Disable Dispatcher"}
        style={{
          fontSize: "9px",
          backgroundColor: "#131313",
          opacity: "0.7",
        }}
      />
      <div
        className="relative w-fit h-fit row-start-2 col-start-2 cursor-pointer justify-self-end self-center"
        id="toggle-fire"
        // onClick={() =>
        //   dispatch(
        //     setFire(fireCount && fireCount === 5 ? 0 : fireCount + 1)
        //   )}
        // }
      >
        <Image
          src={`${INFURA_GATEWAY}/ipfs/QmUbXpg43xj51Lvj9uDswhvkBZfXVnwWmaJfwp9jYgRMUT`}
          width={30}
          height={30}
          alt="fire"
        />
      </div>
      <ReactTooltip
        anchorId="toggle-fire"
        place="left"
        content="🔥 Coming Soon 🔥"
        style={{
          fontSize: "9px",
          backgroundColor: "#131313",
          opacity: "0.7",
        }}
      />
    </div>
  );
};

export default Viewer;
