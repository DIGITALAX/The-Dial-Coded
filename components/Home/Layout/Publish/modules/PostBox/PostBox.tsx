import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { useDispatch } from "react-redux";
import { INFURA_GATEWAY } from "../../../../../../lib/lens/constants";
import createProfilePicture from "../../../../../../lib/lens/helpers/createProfilePicture";
import { setPublication } from "../../../../../../redux/reducers/publicationSlice";
import { setSignIn } from "../../../../../../redux/reducers/signInSlice";
import { PostBoxProps } from "../../types/post.types";

const PostBox: FunctionComponent<PostBoxProps> = ({
  isConnected,
  openConnectModal,
  lensProfile,
}): JSX.Element => {
  const dispatch = useDispatch();
  const profileImage = createProfilePicture(lensProfile);
  return (
    <div className="relative row-start-1 w-full h-full rounded-xl flex flex-row">
      <div
        id="radialPinkBorder"
        className="relative w-full h-fit f1:h-40 col-start-1 rounded-xl"
      >
        <Image
          src={`${INFURA_GATEWAY}/ipfs/QmPTSfH2nh8S7H4yXWHn3wxBADoGfvj7aD8P4gkLmkKDpw`}
          layout="fill"
          objectFit="cover"
          className="absolute w-full h-full p-2 rounded-xl"
          draggable={false}
        />
        <div className="relative w-full h-full col-start-1 f1:flex-row flex flex-col p-4 gap-6 border-4 border-white/20 rounded-lg">
          {lensProfile && isConnected && (
            <div className="relative w-fit h-fit place-self-center col-start-1 row-start-1 grid grid-flow-row auto-rows-auto">
              <div className="relative w-12 h-12 row-start-1 place-self-center rounded-full">
                {profileImage && (
                  <Image
                    src={profileImage}
                    layout="fill"
                    objectFit="cover"
                    className="relative w-full h-full rounded-full"
                    draggable={false}
                  />
                )}
              </div>
              <div className="relative w-fit h-fit row-start-2 font-dosis text-white text-sm place-self-center">
                @
                {lensProfile?.handle?.length > 15
                  ? lensProfile?.handle.substring(0, 15) + "..."
                  : lensProfile?.handle}
              </div>
            </div>
          )}
          <div
            id="radialPinkBorder"
            className="relative col-start-1 row-start-2 fo:row-start-1 fo:col-start-2 w-full h-36 f1:h-full grid grid-flow-col auto-cols-auto p-1 rounded-xl"
            onClick={
              isConnected
                ? () => {
                    lensProfile
                      ? dispatch(
                          setPublication({
                            actionOpen: true,
                            actionCanvas: false,
                          })
                        )
                      : dispatch(setSignIn(true));
                  }
                : openConnectModal
            }
          >
            <div className="relative w-full h-full col-start-1 bg-white/80 rounded-xl grid grid-flow-col auto-cols-auto cursor-pointer active:opacity-80">
              <div className="relative w-fit h-fit col-start-1 flex flex-row gap-3 pl-4 pt-4">
                <div className="relative col-start-1 w-fit h-fit">
                  <Image
                    src={`${INFURA_GATEWAY}/ipfs/QmYbuYSSdKb5jScR6Jjg3zutgYVAAbikmM3Y4pxmc7GJqr`}
                    width={30}
                    height={30}
                    draggable={false}
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
