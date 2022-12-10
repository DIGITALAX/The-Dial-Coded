import { FunctionComponent } from "react";
import { IoMdArrowDropright, IoMdArrowDropdown } from "react-icons/io";
import useSamples from "./hooks/useSamples";
import { useDispatch, useSelector } from "react-redux";
import { setTopic } from "../../../../../redux/reducers/topicSlice";
import { RootState } from "../../../../../redux/store";

const Samples: FunctionComponent = (): JSX.Element => {
  const { topics, topicValues } = useSamples();
  const dispatch = useDispatch();
  const selectedTopic: string = useSelector(
    (state: RootState) => state.app.topicReducer.value
  );
  return (
    <div className="relative w-full h-full row-start-2 grid grid-flow-row auto-rows-auto pl-20 gap-6">
      <div className="relative w-full h-fit row-start-1 grid grid-flow-col auto-cols-auto overflow-x-scroll">
        {topics?.map((topic: string, index: number) => {
          return (
            <div
              key={index}
              className={`relative cursor-pointer hover:opacity-70 w-fit h-fit grid grid-flow-col auto-cols-auto gap-1 whitespace-nowrap col-start-${
                index + 1
              }`}
              onClick={() => dispatch(setTopic(topic))}
            >
              <div className="relative w-fit h-fit col-start-1 capitalize font-dosis text-offBlack text-base place-self-center text-center">
                {topic}
              </div>
              <div className="relative w-fit h-fit col-start-2 place-self-center">
                {selectedTopic === topic ? (
                  <IoMdArrowDropdown size={25} color="black" />
                ) : (
                  <IoMdArrowDropright size={25} color="black" />
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="relative w-fit h-fit row-start-2 grid grid-flow-col auto-cols-auto gap-7 pl-10">
        {
          (topicValues[selectedTopic as string])?.map((value: string, index: number) => {
            return (
              <div
                key={index}
                className={`relative w-fit h-fit col-start-${
                  index + 1
                } grid grid-flow-col auto-cols-auto`}
              >
                <div className="relative w-fit h-fit text-black font-dosis text-sm col-start-1 place-self-center underline underline-offset-2 cursor-pointer hover:text-offBlue">
                  {value}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Samples;
