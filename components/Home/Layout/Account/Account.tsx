import { FunctionComponent } from "react";
import Interface from "../../../Common/Interface/Interface";

const Account: FunctionComponent = (): JSX.Element => {
  return (
    <div className="relative w-full h-full row-start-2 bg-white grid grid-flow-col auto-cols-auto">
        <Interface title={"Settings"} />
    </div>
  );
};

export default Account;
