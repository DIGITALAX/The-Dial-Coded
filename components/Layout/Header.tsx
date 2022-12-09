import Image from "next/image";
import { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setVideo } from "../../redux/reducers/videoSlice";
import { RootState } from "../../redux/store";

const Header: FunctionComponent = (): JSX.Element => {
  const dispatch = useDispatch();
  const video = useSelector((state: RootState) => state.app.videoReducer.value);
  return (
    <div className="absolute w-full h-fit grid grid-flow-col auto-cols-auto justify-between py-10 px-6 z-30">
      <div className="relative w-fit h-fit col-start-1 text-white font-dosis text-7xl">
        THE DIAL
      </div>
      <div className="relative w-fit h-fit grid grid-flow-col auto-cols-auto col-start-2 gap-6 place-self-center">
        <div
          className="relative w-fit h-fit col-start-1 opacity-80 place-self-center cursor-pointer active:scale-95 hover:opacity-60"
          onClick={() => dispatch(setVideo(!video))}
        >
          <Image
            src="https://thedial.infura-ipfs.io/ipfs/Qmb4h9vReob4VXMByg7Go1kUmacjuGAcTxft5Rq4SbSgXY"
            alt="headerIcon1"
            width={50}
            height={50}
          />
        </div>
        <div className="relative w-fit h-fit col-start-2 opacity-80 place-self-center cursor-pointer active:scale-95 hover:opacity-60">
          <Image
            src="https://thedial.infura-ipfs.io/ipfs/QmTUha42rLj2Epo3XYMi5eAyKFryt2TFEhik7jFyfzh2dp"
            alt="headerIcon2"
            width={50}
            height={50}
          />
        </div>
        <div className="relative w-fit h-fit col-start-3 opacity-80 place-self-center cursor-pointer active:scale-95 grid grid-flow-row auto-rows-auto gap-3 hover:opacity-60">
          <div className="relative row-start-1 w-6 h-px bg-white self-center"></div>
          <div className="relative row-start-2 w-6 h-px bg-white self-center"></div>
        </div>
        <div className="relative w-fit h-fit col-start-4 opacity-80 place-self-center cursor-pointer active:scale-95 -top-1 hover:opacity-60">
          <Image
            src="https://thedial.infura-ipfs.io/ipfs/QmcUnJ4YryhceTmwBw9zqGSfym1qqGLiHKrC7F4i8SRbxQ"
            alt="profileIcon"
            width={40}
            height={30}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
