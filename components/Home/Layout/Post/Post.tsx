import { FunctionComponent } from "react";
import Feed from "./modules/Feed/Feed";
import Parameters from "./modules/Parameters/Parameters";
import PostBox from "./modules/PostBox";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import usePost from "./hooks/usePost";

const Post: FunctionComponent = (): JSX.Element => {
  const { openConnectModal } = useConnectModal();
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile
  );
  const { connected } = usePost();
  return (
    <div className="relative w-full h-full row-start-2 grid grid-flow-row auto-rows-auto bg-white p-10 gap-10">
      <PostBox
        openConnectModal={openConnectModal}
        lensProfile={lensProfile}
        isConnected={connected}
      />
      <Parameters />
      <Feed />
    </div>
  );
};

export default Post;
