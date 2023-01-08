import { FormEvent, FunctionComponent } from "react";
import { TagsProps } from "../../../types/common.types";

const Tags: FunctionComponent<TagsProps> = ({
  tags,
  handleTags,
  handleRemoveTag,
}): JSX.Element => {
  return (
    <div className="relative w-fit h-fit grid grid-flow-col auto-cols-auto font-dosis text-white gap-4">
      <form
        className="relative w-full h-full grid grid-flow-col auto-cols-auto col-start-1"
        onSubmit={
          tags?.length >= 5
            ? (e: FormEvent) => {
                e.preventDefault();
              }
            : (e: FormEvent) => handleTags(e)
        }
      >
        <input
          id="tagSearch"
          className="relative w-32 h-8 text-black rounded-l-md bg-white/60 p-1"
          name={"tag"}
          disabled={tags?.length >= 5 ? true : false}
        />
        <button
          className={`${
            tags?.length >= 5 ? "bg-offBlue/50 cursor-default" : "bg-offBlue"
          } relative h-8 w-fit text-xs rounded-r-md grid grid-flow-col auto-cols-auto px-2`}
          type="submit"
        >
          <div className="relative w-fit h-fit place-self-center">
            Add Discover Tag
          </div>
        </button>
      </form>
      <div className="relative w-full h-fit col-start-2 grid grid-flow-col auto-cols-auto gap-2 place-self-center overflow-x-scroll">
        {tags?.map((tag: string, index: number) => {
          return (
            <div
              key={index}
              onClick={() => handleRemoveTag(tag)}
              id={`record${index + 1}`}
              className={`relative col-start-${
                index + 1
              } w-fit h-fit px-5 font-dosis text-white rounded-lg grid grid-flow-col auto-cols-auto text-lg whitespace-nowrap border-2 border-offYellow`}
            >
              <div className="relative w-fit h-fit place-self-center">
                #{tag}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Tags;
