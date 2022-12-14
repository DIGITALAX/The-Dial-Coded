import { FunctionComponent, useRef } from "react";
import Interface from "../../../Common/Interface/Interface";
import useAccount from "./hooks/useAccount";

const Account: FunctionComponent = (): JSX.Element => {
  const { accountTitles, handleTapeSet, notificationImages } = useAccount();
  const account = useRef<null | HTMLDivElement>(null);
  return (
    <div
      className="relative w-full h-full row-start-2 bg-white grid grid-flow-col auto-cols-auto"
      ref={account}
    >
      <Interface
        title={"Settings"}
        tapeTitles={accountTitles}
        handleTapeSet={handleTapeSet}
        images={notificationImages}
        sideImage={"QmRFAf3en6jmyETP2bh2e4nDjmQsxjv7vU7m7q9VhF88Rd"}
      />
    </div>
  );
};

export default Account;
