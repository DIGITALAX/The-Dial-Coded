import Image from "next/legacy/image";
import Link from "next/link";
import { FunctionComponent } from "react";
import createProfilePicture from "../../../../../lib/lens/helpers/createProfilePicture";
import { FollowProps } from "../types/account.types";

const Follows: FunctionComponent<FollowProps> = ({ follow }): JSX.Element => {
  const profileImage = createProfilePicture(follow);
  return (
    <Link
      href={`/profile/${follow.handle?.split("lens")[0]}`}
      className="relative w-4/5 h-fit p-2 drop-shadow-lg grid grid-flow-col bg-gray-50/50 auto-cols-auto rounded-lg border border-gray-50 justify-self-center"
    >
      <div className="relative w-fit h-fit grid grid-flow-col auto-cols-auto col-start-1 gap-6">
        <div className="relative w-8 h-8 rounded-full bg-offBlue col-start-1">
          <Image
            src={profileImage}
            objectFit="cover"
            layout="fill"
            alt="pfp"
            className="relative w-fit h-fit rounded-full self-center"
          />
        </div>
        <div className="relative w-fit h-fit place-self-center col-start-2 text-offBlack text-sm">
          @{follow.handle}
        </div>
      </div>
    </Link>
  );
};

export default Follows;
