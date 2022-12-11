import { FunctionComponent } from "react";
import { IoMdArrowDropright, IoMdArrowDropdown } from "react-icons/io";
import { TopicProps } from "../types/common.types";

const Topic: FunctionComponent<TopicProps> = ({
  index,
  dispatch,
  setTopic,
  topic,
  selectedTopic,
}): JSX.Element => {
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
};

export default Topic;
