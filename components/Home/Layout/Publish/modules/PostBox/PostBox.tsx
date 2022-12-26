import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { useDispatch } from "react-redux";
import { INFURA_GATEWAY } from "../../../../../../lib/lens/constants";
import { setPublication } from "../../../../../../redux/reducers/publicationSlice";
import { setSignIn } from "../../../../../../redux/reducers/signInSlice";
import { PostBoxProps } from "../../types/post.types";

const PostBox: FunctionComponent<PostBoxProps> = ({
  isConnected,
  openConnectModal,
  lensProfile,
}): JSX.Element => {
  const dispatch = useDispatch();
  let profileImage: string;
  if (!(lensProfile?.picture as any)?.original) {
    profileImage = "";
  } else if ((lensProfile?.picture as any)?.original) {
    if ((lensProfile?.picture as any)?.original.url.includes("http")) {
      profileImage = (lensProfile?.picture as any)?.original.url;
    } else {
      const cut = (lensProfile?.picture as any)?.original.url.split("/");
      profileImage = `${INFURA_GATEWAY}/ipfs/${cut[2]}`;
    }
  } else {
    profileImage = (lensProfile?.picture as any)?.uri;
  }
  return (
    <div className="relative row-start-1 w-full h-full rounded-xl grid grid-flow-col auto-cols-auto">
      <div
        id="radialPinkBorder"
        className="relative w-full h-40 col-start-1 rounded-xl"
      >
        <Image
          src={`${INFURA_GATEWAY}/ipfs/QmPTSfH2nh8S7H4yXWHn3wxBADoGfvj7aD8P4gkLmkKDpw`}
          layout="fill"
          objectFit="cover"
          className="absolute w-full h-full p-2 rounded-xl"
        />
        <div className="relative w-full h-full col-start-1 grid grid-flow-col auto-cols-auto p-4 gap-6">
          {lensProfile && isConnected && (
            <div className="relative w-fit h-fit place-self-center col-start-1 col-span-1 grid grid-flow-row auto-rows-auto">
              <div className="relative w-12 h-12 row-start-1 place-self-center rounded-full">
                <Image
                  src={profileImage}
                  layout="fill"
                  objectFit="cover"
                  className="relative w-full h-full rounded-full"
                />
              </div>
              <div className="relative w-fit h-fit row-start-2 font-dosis text-white text-sm place-self-center">
                @{lensProfile?.handle}
              </div>
            </div>
          )}
          <div
            id="radialPinkBorder"
            className="relative col-start-2 w-full h-full grid grid-flow-col auto-cols-auto p-1 rounded-xl col-span-10"
            onClick={
              isConnected
                ? () => {
                    lensProfile
                      ? dispatch(setPublication(true))
                      : dispatch(setSignIn(true));
                  }
                : openConnectModal
            }
          >
            <div className="relative w-full h-full col-start-1 bg-white/80 rounded-xl grid grid-flow-col auto-cols-auto cursor-pointer active:opacity-80">
              <div className="relative w-fit h-fit col-start-1 grid grid-flow-col auto-cols-auto gap-3 pl-4 pt-4">
                <div className="relative col-start-1 w-fit h-fit">
                  <Image
                    src={`${INFURA_GATEWAY}/ipfs/QmPzrV58nvgNZW9zTkNpy5YBCZBEs6kTKhai4ZkEFeaWQj`}
                    width={30}
                    height={30}
                  />
                </div>
                <div className="relative col-start-2 w-fit h-fit font-dosis text-offBlack place-self-center">
                  What&apos;s happening?
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostBox;
