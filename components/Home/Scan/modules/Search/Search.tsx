import Image from "next/image";
import { FunctionComponent } from "react";
import { useDispatch } from "react-redux";
import { setLayout } from "../../../../../redux/reducers/layoutSlice";
import Categories from "./Categories";
import useSearch from "./hooks/useSearch";
import lodash from "lodash";

const Search: FunctionComponent = (): JSX.Element => {
  const dispatch = useDispatch();
  const { open, setOpen, uris, layoutType } = useSearch();
  return (
    <div className="relative w-full h-full bg-white rounded-t-2xl row-start-3 grid grid-flow-col auto-cols-auto py-6 pl-10 z-10">
      <div className="relative w-fit h-fit col-start-1 gap-3 grid grid-flow-col auto-cols-auto self-center justify-self-start pr-2 pl-3">
        <div className="relative w-fit h-fit col-start-1 gap-6 grid grid-flow-col auto-cols-auto">
          {(!open ? lodash.slice(uris, 0, 3) : uris)?.map(
            (uri: string, index: number) => {
              return (
                <div
                  className={`relative w-fit h-full col-start-${
                    index + 1
                  } grid grid-flow-col auto-cols-auto gap-2 cursor-pointer hover:opacity-80 active:scale-95`}
                  key={index}
                  onClick={() => dispatch(setLayout(layoutType[index]))}
                >
                  <div className="relative w-fit h-fit col-start-1 place-self-center">
                    <Image
                      alt="files"
                      src={`https://thedial.infura-ipfs.io/ipfs/${uri}`}
                      width={30}
                      height={30}
                    />
                  </div>
                  <div className="relative w-fit h-full col-start-2 grid grid-flow-row auto-rows-auto place-self-center">
                    <div className="relative row-start-1 h-2 w-2 rounded-full border border-offBlack self-center"></div>
                    <div className="relative row-start-2 h-2 w-2 rounded-full border border-offBlack self-center"></div>
                    <div className="relative row-start-3 h-2 w-2 rounded-full border border-offBlack self-center"></div>
                  </div>
                </div>
              );
            }
          )}
        </div>
        <div
          className="relative w-fit h-fit col-start-2 grid grid-flow-col auto-cols-auto hover:opacity-80 active:scale-95 cursor-pointer place-self-center pl-6"
          onClick={() => setOpen(!open)}
        >
          <div className="relative w-fit h-fit col-start-1">
            <Image
              width={12}
              height={12}
              alt="leftArrow"
              src="https://thedial.infura-ipfs.io/ipfs/QmeeHhyUcz1SM8KJB2SrY7b7r9uhYFEWuMx45b2a2VgoLB"
            />
          </div>
          <div className="relative w-fit h-fit col-start-2 place-self-center">
            <Image
              width={12}
              height={12}
              alt="centerDot"
              src="https://thedial.infura-ipfs.io/ipfs/QmZSpwDjU9YYru6g44RVPaeeoLAu5YnCkXTCaNfEULzZ3i"
            />
          </div>
          <div className="relative w-fit h-fit col-start-3">
            <Image
              width={12}
              height={12}
              alt="rightArrow"
              src="https://thedial.infura-ipfs.io/ipfs/QmXfG8mpaHad7rVnbqUtGrnCsm9vkXZT3zNa8mugndUS72"
            />
          </div>
        </div>
        <div className="relative w-1 h-full col-start-3 bg-bluey/30"></div>
      </div>
      <Categories />
    </div>
  );
};

export default Search;
