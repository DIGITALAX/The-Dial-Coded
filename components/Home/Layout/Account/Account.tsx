import { FunctionComponent } from "react";
import Interface from "../../../Common/Interface/Interface";
import useAccount from "./hooks/useAccount";

const Account: FunctionComponent = (): JSX.Element => {
  const { accountTitles, handleTapeSet, notificationImages } = useAccount();
  return (
    <div className="relative w-full h-full row-start-2 bg-white grid grid-flow-col auto-cols-auto">
      <Interface
        title={"Settings"}
        tapeTitles={accountTitles}
        handleTapeSet={handleTapeSet}
        images={notificationImages}
      />
    </div>
  );
};

export default Account;
