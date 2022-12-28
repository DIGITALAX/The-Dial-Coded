import Image from "next/image";
import { FormEvent, FunctionComponent } from "react";
import { ViewerProps } from "../types/parameters.types";
import { BsFillEyeFill } from "react-icons/bs";
import { INFURA_GATEWAY } from "../../../../../../../lib/lens/constants";
import { AiOutlineLoading } from "react-icons/ai";
import InfiniteScroll from "react-infinite-scroll-component";

const Viewer: FunctionComponent<ViewerProps> = ({
  userTypeOpen,
  searchProfiles,
  profileSearch,
  searchLoading,
  handleChosenProfile,
  getMoreProfiles,
  chosenProfile
}): JSX.Element => {
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
              value={chosenProfile ? chosenProfile : undefined}
              className="relative col-start-1 place-self-center w-full h-full rounded-lg pl-px text-offBlack font-dosis caret-transparent"
              onChange={(e: FormEvent) => searchProfiles(e)}
            />
          </div>
        </div>
        <div
          className={`absolute w-full h-fit grid grid-flow-row auto-rows-auto row-start-2 bg-white ${
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
                    return (
                      <div
                        key={index}
                        className={`relative w-full h-fit px-3 py-2 bg-white col-start-1 grid grid-flow-col auto-cols-auto gap-3 cursor-pointer border-y border-black hover:bg-offBlue`}
                        onClick={() => {
                          handleChosenProfile(user);
                        }}
                      >
                        <div className="relative w-fit h-fit col-start-1 text-black font-dosis lowercase place-self-center grid grid-flow-col auto-cols-auto">
                          <div className="relative col-start-1 place-self-center w-fit h-fit text-sm">
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
      <div className="relative w-fit h-fit col-start-2 row-start-1 cursor-pointer active:scale-95 justify-self-end self-center">
        <Image
          src={`${INFURA_GATEWAY}/ipfs/QmfNvhTRhR7ginJh2pHTEPTNthM6GWhp8NpfuA9LggqgYQ`}
          width={30}
          height={30}
          alt="venn"
        />
      </div>
      <div
        className="relative w-fit h-fit row-start-2 col-start-2 cursor-pointer active:scale-95 justify-self-end self-center"
        // onClick={() =>
        //   {console.log(fireCount)
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
    </div>
  );
};

export default Viewer;
