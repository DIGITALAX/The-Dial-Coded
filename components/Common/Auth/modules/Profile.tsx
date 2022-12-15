import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../lib/lens/constants";
import { setHamburger } from "../../../../redux/reducers/hamburgerSlice";
import { ProfileProps } from "../../types/common.types";

const Profile: FunctionComponent<ProfileProps> = ({
  dispatch,
  lensProfile,
  authStatus,
  handleAccount
}): JSX.Element => {
  let profileImage: any;
  if (!lensProfile?.picture) {
    profileImage = <></>;
  } else if (lensProfile?.picture?.original) {
    if (lensProfile?.picture.original.url.includes("http")) {
      profileImage = lensProfile?.picture.original.url;
    } else {
      const cut = lensProfile?.picture.original.url.split("/");
      profileImage = `${INFURA_GATEWAY}/ipfs/${cut[2]}`;
    }
  } else {
    profileImage = lensProfile?.picture?.uri;
  }
  return (
    <div
      className="relative w-fit h-fit col-start-1 opacity-80 place-self-center cursor-pointer active:scale-95 -top-1 hover:opacity-60 grid grid-flow-col auto-cols-auto"
      onClick={() =>
        authStatus
          ? handleAccount()
          : dispatch(setHamburger(true))
      }
    >
      <div
        className="relative w-10 h-10 rounded-full col-start-1 place-self-center"
        id={"crt"}
      >
        {authStatus && (
          <Image
            src={profileImage}
            layout="fill"
            objectFit="cover"
            className="w-full h-full rounded-full"
          />
        )}
      </div>
    </div>
  );
};

export default Profile;
