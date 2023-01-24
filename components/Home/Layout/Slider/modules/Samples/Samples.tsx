import { FunctionComponent } from "react";
import useSamples from "./hooks/useSamples";
import { useDispatch, useSelector } from "react-redux";
import { setTopic } from "../../../../../../redux/reducers/topicSlice";
import { RootState } from "../../../../../../redux/store";
import { TopicInterface } from "./types/samples.types";
import Topic from "../../../../../Common/Topic/Topic";
import TopicValues from "../../../../../Common/Topic/TopicValues";
import handleAddtoSearch from "../../../../../../lib/lens/helpers/handleAddtoSearch";

const Samples: FunctionComponent = (): JSX.Element => {
  const { topics, topicValues } = useSamples();
  const dispatch = useDispatch();
  const selectedTopic: string = useSelector(
    (state: RootState) => state.app.topicReducer.value
  );
  const searchTarget: string = useSelector(
    (state: RootState) => state.app.searchTargetReducer.value
  );
  return (
    <div className="relative w-full h-full row-start-3 grid grid-flow-row auto-rows-auto pl-3 md:pl-20 gap-6">
      <div className="relative w-full h-fit row-start-1 grid grid-flow-col auto-cols-auto overflow-x-scroll gap-5">
        {topics?.map((topic: string, index: number) => {
          return (
            <Topic
              topic={topic}
              index={index}
              selectedTopic={selectedTopic}
              dispatch={dispatch}
              key={index}
              setTopic={setTopic}
            />
          );
        })}
      </div>
      <div className="relative w-full h-fit row-start-2 grid grid-flow-col auto-cols-auto gap-7 md:pl-10 overflow-x-scroll pr-3 md:pr-0">
        {topicValues[
          selectedTopic
            ?.toLowerCase()
            ?.replaceAll(" ", "") as keyof TopicInterface
        ]?.map((value: string, index: number) => {
          return (
            <TopicValues
              dispatch={dispatch}
              searchTarget={searchTarget}
              handleOnClick={handleAddtoSearch}
              index={index}
              value={value}
              key={index}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Samples;
