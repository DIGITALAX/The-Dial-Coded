import { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import CreateMixtape from "./../../../Common/Mixtape/CreateMixtape";

const MixtapeSwitch: FunctionComponent = (): JSX.Element => {
  const mixtapeType: string | undefined = useSelector(
    (state: RootState) => state.app.layoutReducer.value
  );
  let action: string = "Create";
  const decideStringAction = () => {
    action = mixtapeType as string;
    return action;
  };

  switch (decideStringAction()) {
    default:
      return <CreateMixtape />;
  }
};

export default MixtapeSwitch;
