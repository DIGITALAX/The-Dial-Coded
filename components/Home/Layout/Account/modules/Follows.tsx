import Image from "next/legacy/image";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import createProfilePicture from "../../../../../lib/lens/helpers/createProfilePicture";
import { setFollowModal } from "../../../../../redux/reducers/followModalSlice";
import { RootState } from "../../../../../redux/store";
import { FollowProps } from "../types/account.types";

const Follows: FunctionComponent<FollowProps> = ({ follow }): JSX.Element => {
  const profileImage = createProfilePicture(follow);
  const router = useRouter();
  const dispatch = useDispatch();
  const type = useSelector(
    (state: RootState) => state.app.followModalReducer.type
  );
  return (
    <div
      onClick={() => {
        dispatch(
          setFollowModal({
            actionOpen: false,
            actionType: type,
          })
        );
        router.push(`/profile/${follow.handle?.split("lens")[0]}`);
      }}
      className="relative w-4/5 h-fit p-2 drop-shadow-lg grid grid-flow-col bg-gray-50/50 auto-cols-auto rounded-lg border border-gray-50 justify-self-center cursor-pointer"
    >
      <div className="relative w-fit h-fit grid grid-flow-col auto-cols-auto col-start-1 gap-6">
        <div
          className="relative w-8 h-8 rounded-full bg-offBlue col-start-1"
          id="crt"
        >
          {profileImage && (
            <Image
              src={profileImage}
              objectFit="cover"
              layout="fill"
              alt="pfp"
              className="relative w-fit h-fit rounded-full self-center"
            />
          )}
        </div>
        <div className="relative w-fit h-fit place-self-center col-start-2 text-offBlack text-sm">
          @{follow.handle}
        </div>
      </div>
    </div>
  );
};

export default Follows;
