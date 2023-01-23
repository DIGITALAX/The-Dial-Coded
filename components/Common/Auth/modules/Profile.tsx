import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { INFURA_GATEWAY } from "../../../../lib/lens/constants";
import createProfilePicture from "../../../../lib/lens/helpers/createProfilePicture";
import { setHamburger } from "../../../../redux/reducers/hamburgerSlice";
import { RootState } from "../../../../redux/store";
import { ProfileProps } from "../../types/common.types";

const Profile: FunctionComponent<ProfileProps> = ({
  dispatch,
  lensProfile,
  authStatus,
  newNotifications,
}): JSX.Element => {
  const profileImage = createProfilePicture(lensProfile);
  const hamburgerValue = useSelector(
    (state: RootState) => state.app.hamburgerReducer.value
  );
  return (
    <div
      className="relative w-fit h-fit col-start-1 opacity-80 place-self-center cursor-pointer active:scale-95 -top-1 hover:opacity-60 grid grid-flow-col auto-cols-auto"
      onClick={() =>
        dispatch(
          setHamburger(hamburgerValue !== undefined ? !hamburgerValue : true)
        )
      }
    >
      {newNotifications && (
        <div className="absolute w-3 h-3 bg-offBlue z-10 rounded-full grid grid-flow-col auto-cols-auto justify-self-end">
          <div className="w-3 h-3 bg-offBlue rounded-full col-start-1 place-self-center animate-ping"></div>
        </div>
      )}
      <div
        className="relative w-10 h-10 rounded-full col-start-1 place-self-center"
        id={"crt"}
      >
        {authStatus && profileImage && (
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
