import Image from "next/legacy/image";
import Link from "next/link";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../../lib/lens/constants";
import { FollowProps } from "../types/account.types";

const Follows: FunctionComponent<FollowProps> = ({ follow }): JSX.Element => {
  let profileImage: string;
  if (!(follow.picture as any)?.original) {
    profileImage = "";
  } else if ((follow.picture as any)?.original) {
    if ((follow.picture as any)?.original?.url?.includes("http")) {
      profileImage = (follow.picture as any)?.original?.url;
    } else {
      const cut = (follow.picture as any)?.original?.url?.split("/");
      profileImage = `${INFURA_GATEWAY}/ipfs/${cut[2]}`;
    }
  } else {
    profileImage = (follow.picture as any)?.uri;
  }
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
        <div
          className="relative w-fit h-fit place-self-center col-start-2 text-offBlack text-sm"
        >
          @{follow.handle}
        </div>
      </div>
    </Link>
  );
};

export default Follows;
