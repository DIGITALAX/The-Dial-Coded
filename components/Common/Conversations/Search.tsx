import Image from "next/legacy/image";
import { FormEvent, FunctionComponent } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import InfiniteScroll from "react-infinite-scroll-component";
import { INFURA_GATEWAY } from "../../../lib/lens/constants";
import createProfilePicture from "../../../lib/lens/helpers/createProfilePicture";
import { SearchProps } from "../../Home/Layout/Account/types/account.types";

const Search: FunctionComponent<SearchProps> = ({
  searchMessages,
  searchLoading,
  profileSearch,
  searchMoreMessages,
  handleChosenProfile,
  searchTarget,
  dropdown,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit grid grid-flow-row auto-rows-auto">
      <input
        className="relative rounded-l-lg bg-white grid grid-flow-col auto-cols-auto px-2 w-full h-10 col-start-1 justify-self-start border-2 border-black font-dosis placeholder:text-black row-start-1"
        value={searchTarget}
        placeholder="Start a message..."
        onChange={(e: FormEvent) => searchMessages(e)}
      />
      <div
        className={`absolute row-start-2 grid grid-flow-row auto-rows-auto w-full h-fit overflow-y-scroll z-10`}
      >
        {searchLoading ? (
          <div className="relative w-full h-10 px-3 py-2 bg-white col-start-1 grid grid-flow-col auto-cols-auto border-x-2 border-black border-b-2">
            <div className="relative w-fit h-fit place-self-center animate-spin col-start-1">
              <AiOutlineLoading color="black" size={15} />
            </div>
          </div>
        ) : (
          profileSearch?.length > 0 &&
          dropdown && (
            <InfiniteScroll
              hasMore={true}
              dataLength={profileSearch?.length}
              next={searchMoreMessages}
              loader={""}
              height={"10rem"}
              className="relative w-full h-fit"
            >
              {profileSearch?.map((user: any, index: number) => {
                const profileImage = createProfilePicture(user);
                return (
                  <div
                    key={index}
                    className={`relative w-full h-fit px-3 py-2 bg-white col-start-1 grid grid-flow-col auto-cols-auto gap-3 cursor-pointer border border-black hover:bg-offBlue`}
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
  );
};

export default Search;
