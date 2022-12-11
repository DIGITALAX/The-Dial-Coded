import { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAddMixtape } from "../../../../redux/reducers/addMixtapeSlice";
import { setAddTrack } from "../../../../redux/reducers/addTrackSlice";
import { setDeleteTrack } from "../../../../redux/reducers/deleteTrackSlice";
import { setEditTrack } from "../../../../redux/reducers/editTrackSlice";
import { RootState } from "../../../../redux/store";
import useCreateMixtape from "../../../Common/Mixtape/hooks/useCreateMixtape";
import CreateMixtape from "./../../../Common/Mixtape/CreateMixtape";

const MixtapeSwitch: FunctionComponent = (): JSX.Element => {
  const mixtapeType: string | undefined = useSelector(
    (state: RootState) => state.app.layoutReducer.value
  );
  const dispatch = useDispatch();
  const { checkValues, handleClicked, valueClicked } = useCreateMixtape();
  const trackNumber = useSelector(
    (state: RootState) => state.app.addTrackReducer.value
  );
  let action: string = "Create";
  const decideStringAction = () => {
    action = mixtapeType as string;
    return action;
  };

  switch (decideStringAction()) {
    default:
      return (
        <CreateMixtape
          valueClicked={valueClicked}
          handleClicked={handleClicked}
          checkValues={checkValues}
          dispatch={dispatch}
          setAddTrack={setAddTrack}
          setAddMixtape={setAddMixtape}
          setEditTrack={setEditTrack}
          setDeleteTrack={setDeleteTrack}
          trackNumber={trackNumber}
        />
      );
  }
};

export default MixtapeSwitch;
