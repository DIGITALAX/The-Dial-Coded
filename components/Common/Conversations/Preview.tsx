import { FunctionComponent } from "react";
import { PreviewProps } from "../../Home/Layout/Account/types/account.types";

const Preview: FunctionComponent<PreviewProps> = ({
  searchTarget,
  previewMessages
}): JSX.Element => {
  console.log(previewMessages)
  return <div className="relative w-full h-fit grid grid-flow-row auto-rows-auto">
    {
      (previewMessages as any)?.forEach((message: any, index: number) => {
        console.log(message, index)
        return (
          <div className="relative w-full h-full grid grid-flow-col auto-cols-auto text-black font-dosis text-sm">
            <div className="relative col-start-1 w-fit h-fit">
              pfp afasdfa
            </div>
            <div className="relative w-fit h-fit col-start-2 grid grid-flow-row auto-rows-auto">
              <div className="relative row-start-1 w-fit h-fit">
              </div>
              <div className="relative row-start-1 w-fit h-fit">
                {message?.content}
              </div>
            </div>
          </div>
        )
      })
    }
  </div>;
};

export default Preview;
