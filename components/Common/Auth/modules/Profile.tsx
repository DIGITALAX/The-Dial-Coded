import Image from "next/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../lib/lens/constants";
import { setLayout } from "../../../../redux/reducers/layoutSlice";
import { ProfileProps } from "../../types/common.types";

const Profile: FunctionComponent<ProfileProps> = ({
  dispatch,
}): JSX.Element => {
  return (
    <div
      id={"profile"}
      className="relative w-fit h-fit col-start-4 opacity-80 place-self-center cursor-pointer active:scale-95 -top-1 hover:opacity-60"
      onClick={() => dispatch(setLayout("Account"))}
    >
      <Image
        src={`${INFURA_GATEWAY}/ipfs/QmcUnJ4YryhceTmwBw9zqGSfym1qqGLiHKrC7F4i8SRbxQ`}
        alt="profileIcon"
        width={40}
        height={30}
      />
    </div>
  );
};

export default Profile;
