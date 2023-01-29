import { FunctionComponent } from "react";
import { PreviewProps } from "../../Home/Layout/Account/types/account.types";
import moment from "moment";
import createProfilePicture from "../../../lib/lens/helpers/createProfilePicture";
import Image from "next/legacy/image";
import { AiOutlineLoading } from "react-icons/ai";

const Preview: FunctionComponent<PreviewProps> = ({
  previewMessages,
  profileLensData,
  handleChosenProfile,
  allConversationsLoading,
}): JSX.Element => {
  let ipfsRegex = /ipfs:\/\//;
  let gifRegex = /https:\/\/media\.tenor\.com/;
  let sortedPreviewMessages: any;
  let sortedProfileLensData: any[] = [];
  if ((previewMessages as any)?.size > 0) {
    sortedPreviewMessages = Array?.from(previewMessages?.values() as any)
      ?.sort((a: any, b: any) => a?.sent - b?.sent)
      ?.reverse();
    sortedProfileLensData = profileLensData
      ?.sort((a: any, b: any) => {
        let dateA = sortedPreviewMessages?.find((o: any) => {
          if (
            o?.conversation?.context?.conversationId?.match(
              new RegExp(a?.id)
            )?.[0] === a?.id
          ) {
            return a?.id;
          }
        })?.sent;
        let dateB = sortedPreviewMessages?.find((o: any) => {
          if (
            o?.conversation?.context?.conversationId?.match(
              new RegExp(b?.id)
            )?.[0] === b?.id
          ) {
            return b?.id;
          }
        })?.sent;
        return dateA - dateB;
      })
      .reverse();
  }
  return (
    <div className="relative w-full h-40 sm:h-full grid grid-flow-row auto-rows-auto overflow-y-scroll">
      {(previewMessages as any)?.size > 0
        ? sortedPreviewMessages?.map((message: any, index: number) => {
            const profileImage = createProfilePicture(
              sortedProfileLensData?.[index]
            );
            return (
              <div
                key={index}
                className="relative w-full h-20 sm:h-16 grid grid-flow-col auto-cols-auto text-black font-dosis text-sm cursor-pointer border-x border-b border-black/50 drop-shadow-md rounded-lg p-2 hover:opacity-70"
                onClick={() =>
                  handleChosenProfile(sortedProfileLensData?.[index])
                }
              >
                <div className="relative row-start-2 sm:row-start-1 col-start-1 w-fit h-fit justify-self-start self-center grid grid-flow-col auto-cols-auto left-4 gap-4">
                  <div
                    className={`relative rounded-full flex bg-white w-6 h-6 place-self-center col-start-1`}
                    id="crt"
                  >
                    {profileImage !== "" && (
                      <Image
                        src={profileImage}
                        objectFit="cover"
                        alt="pfp"
                        layout="fill"
                        className="relative w-fit h-fit rounded-full self-center"
                      />
                    )}
                  </div>
                  <div className="relative col-start-2 grid grid-flow-row auto-rows-auto gap-1">
                    <div className="relative w-fit h-fit row-start-1 text-sm">
                      @
                      {sortedProfileLensData?.[index]?.handle?.length > 15
                        ? sortedProfileLensData?.[index]?.handle?.substring(
                            0,
                            15
                          ) + "..."
                        : sortedProfileLensData?.[index]?.handle}
                    </div>
                    <div className="relative w-fit h-fit row-start-2 text-sm break-all whitespace-pre-wrap">
                      {ipfsRegex.test(message?.content)
                        ? "Sent Image"
                        : gifRegex.test(message?.content)
                        ? "Sent Gif"
                        : message?.content?.substring(0, 20)}
                    </div>
                  </div>
                </div>
                <div className="relative w-fit h-fit col-start-1 row-start-1 sm:col-start-2 grid grid-flow-col auto-cols-auto justify-self-end self-center">
                  <div className="relative col-start-1 w-fit h-fit  pr-2 text-xs text-offBlack/70">
                    {moment(message?.sent?.toString()).fromNow()}
                  </div>
                </div>
              </div>
            );
          })
        : allConversationsLoading && (
            <div className="relative w-fit h-fit justify-self-center grid grid-flow-col auto-cols-auto self-start pt-10">
              <div className="relative col-start-1 place-self-center animate-spin">
                <AiOutlineLoading color="black" size={15} />
              </div>
            </div>
          )}
    </div>
  );
};

export default Preview;
