import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { MainProps } from "../types/feed.types";
import {
  BsSuitHeartFill,
  BsSuitHeart,
  BsCollection,
  BsFillCollectionFill,
} from "react-icons/bs";
import { FaRegCommentDots, FaCommentDots } from "react-icons/fa";
import { AiOutlineRetweet } from "react-icons/ai";

const Main: FunctionComponent<MainProps> = ({ images }): JSX.Element => {
  return (
    <div className="relative w-full h-full col-start-1 grid grid-flow-row auto-rows-auto">
      <div className="relative w-[40vw] h-full rounded-md grid grid-flow-row auto-rows-auto p-6 bg-gradient-to-r from-offBlack via-gray-600 to-black gap-6">
        <div className="relative w-full h-fit row-start-1 grid grid-flow-col auto-cols-auto">
          <div className="relative w-fit h-fit col-start-1 grid grid-flow-col auto-cols-auto gap-3">
            <div className="relative w-fit h-fit col-start-1 self-center justify-self-start">
              <Image src="" width={15} height={15} alt="pfp" />
            </div>
            <div className="relative w-fit h-fit col-start-2 grid grid-flow-row auto-rows-auto place-self-center">
              <div className="relative w-fit h-fit row-start-1 text-white font-dosis text-base self-center">
                username - status
              </div>
              <div
                id="username"
                className="relative w-fit h-fit row-start-2 font-dosis text-base cursor-pointer hover:opacity-70 active:scale-95 self-center"
              >
                @something.lens
              </div>
            </div>
          </div>
        </div>
        <div className="relative w-full h-fit row-start-2 text-left font-dosis grid grid-flow-row auto-rows-auto gap-6 pl-6">
          <div className="relative w-full h-fit row-start-1 text-white text-md self-center justify-self-start">
            Some witty comment.
          </div>
          <div className="relative w-full h-fit row-start-2 text-offBlue text-base self-center justify-self-start">
            #some #other #hashtags #go #here
          </div>
        </div>
        <div className="relative row-start-3 w-fit max-w-full h-fit rounded-lg overflow-x-scroll grid grid-flow-col auto-cols-auto gap-3 pl-6">
          {images?.map((image: string, index: number) => {
            return (
              <div
                key={index}
                className={`relative w-60 h-60 border-2 border-black rounded-lg bg-black grid grid-flow-col auto-cols-auto col-start-${
                  index + 1
                } cursor-pointer hover:opacity-70 active:scale-95`}
              >
                <div className="relative w-full h-full col-start-1 flex">
                  <Image
                    src={`https://thedial.infura-ipfs.io/ipfs/${image}`}
                    layout="fill"
                    objectFit="cover"
                    objectPosition={"center"}
                    className="rounded-md"
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="relative w-full h-fit row-start-4 grid grid-flow-col auto-cols-auto pl-6">
          <div className="relative w-fit h-fit col-start-1 justify-self-start self-center grid grid-flow-col auto-cols-auto gap-4">
            <div className="relative w-fit h-fit col-start-1 grid grid-flow-col auto-cols-auto gap-2 place-self-center">
              <div className="relative w-fit h-fit col-start-1 place-self-center cursor-pointer hover:opacity-70 active:scale-95">
                <BsSuitHeart color="red" size={15} />
              </div>
              <div className="relative w-fit h-fit col-start-2 text-white font-dosis text-xs place-self-center">
                100
              </div>
            </div>
            <div className="relative w-fit h-fit col-start-2 grid grid-flow-col auto-cols-auto gap-2 place-self-center">
              <div className="relative w-fit h-fit col-start-1 place-self-center cursor-pointer hover:opacity-70 active:scale-95">
                <FaRegCommentDots color="#FBEED1" size={15} />
              </div>
              <div className="relative w-fit h-fit col-start-2 place-self-center text-white font-dosis text-xs">
                100
              </div>
            </div>
            <div className="relative w-fit h-fit col-start-3 grid grid-flow-col auto-cols-auto gap-2 place-self-center">
              <div className="relative w-fit h-fit col-start-1 place-self-center cursor-pointer hover:opacity-70 active:scale-95">
                <AiOutlineRetweet color="#FEEA66" size={15} />
              </div>
              <div className="relative w-fit h-fit col-start-2 place-self-center text-white font-dosis text-xs">
                100
              </div>
            </div>
            <div className="relative w-fit h-fit col-start-4 grid grid-flow-col auto-cols-auto gap-2 place-self-center">
              <div className="relative w-fit h-fit col-start-1 place-self-center cursor-pointer hover:opacity-70 active:scale-95">
                <BsCollection size={15} color="#81A8F8" />
              </div>
              <div className="relative w-fit h-fit col-start-2 place-self-center text-white font-dosis text-xs">
                100
              </div>
            </div>
          </div>
          <div className="relative w-fit h-fit col-start-2 justify-self-end self-center"></div>
        </div>
      </div>
    </div>
  );
};

export default Main;
