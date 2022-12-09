import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { ImCross } from "react-icons/im";
import { useDispatch } from "react-redux";
import { setPublication } from "../../../../redux/reducers/publicationSlice";

const PublicationModal: FunctionComponent = (): JSX.Element => {
  const dispatch = useDispatch();
  return (
    <div className="absolute flex items-center justify-center fixed w-full h-full z-30 bg-opacity-50 backdrop-blur-sm">
      <div className="relative w-full h-full grid-flow-row auto-rows-auto gap-10">
        <div className="relative w-full row-start-2 h-fit rounded-xl grid grid-flow-col auto-cols-auto">
          <div
            id="radialPinkBorder"
            className="relative w-[60%] h-40 col-start-1 rounded-xl place-self-center"
          >
            <Image
              src="https://thedial.infura-ipfs.io/ipfs/QmPTSfH2nh8S7H4yXWHn3wxBADoGfvj7aD8P4gkLmkKDpw"
              layout="fill"
              objectFit="cover"
              className="absolute w-full h-full p-2 rounded-xl"
            />
            <div className="relative w-full h-full grid grid-flow-row auto-rows-auto gap-10">
              <div className="relative w-fit h-fit row-start-1 self-center justify-self-end pr-3 pt-3 cursor-pointer">
                <ImCross
                  color="white"
                  size={15}
                  onClick={() => dispatch(setPublication(false))}
                />
              </div>
              <div className="relative w-full h-full col-start-1 grid grid-flow-col auto-cols-auto px-4 pb-4 gap-6 row-start-2">
                <div className="relative w-fit h-fit place-self-center col-start-1 col-span-1">
                  <Image
                    src="https://thedial.infura-ipfs.io/ipfs/QmcUnJ4YryhceTmwBw9zqGSfym1qqGLiHKrC7F4i8SRbxQ"
                    height={40}
                    width={40}
                  />
                </div>
                <div
                  id="radialPinkBorder"
                  className="relative col-start-2 w-full h-full grid grid-flow-col auto-cols-auto p-1 rounded-xl col-span-10"
                >
                  <textarea
                    style={{ resize: "none" }}
                    className="relative w-full h-full col-start-1 bg-white/80 rounded-xl grid grid-flow-col auto-cols-auto cursor-text active:opacity-80 text-offBlack font-dosis text-md p-2"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicationModal;
