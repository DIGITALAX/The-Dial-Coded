import { FunctionComponent } from "react";
import { PreviewProps } from "../../Home/Layout/Account/types/account.types";
import moment from "moment";
import createProfilePicture from "../../../lib/lens/helpers/createProfilePicture";
import Image from "next/legacy/image";

const Preview: FunctionComponent<PreviewProps> = ({
  searchTarget,
  previewMessages,
  messageProfiles,
  profileLensData,
  handleChosenProfile,
}): JSX.Element => {
  let ipfsRegex = /ipfs:\/\//;
  let gifRegex = /https:\/\/media\.tenor\.com/;
  return (
    <div className="relative w-full h-fit grid grid-flow-row auto-rows-auto overflow-y-scroll">
      {previewMessages &&
        Array.from(previewMessages?.values() as any)?.map(
          (message: any, index: number) => {
            const profileImage = createProfilePicture(profileLensData[index]);
            return (
              <div
                key={index}
                className="relative w-full h-full grid grid-flow-col auto-cols-auto text-black font-dosis text-sm cursor-pointer border-x border-b border-black/50 drop-shadow-md rounded-lg p-2 hover:opacity-70"
                onClick={() => handleChosenProfile(profileLensData[index])}
              >
                <div className="relative col-start-1 w-fit h-fit justify-self-start self-center grid grid-flow-col auto-cols-auto left-4 gap-4">
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
                    <div className="relative w-fit h-fit row-start-1 text-base">
                      @{profileLensData[index]?.handle}
                    </div>
                    <div className="relative w-fit h-fit row-start-2 text-sm">
                      {ipfsRegex.test(message?.content)
                        ? "Sent Image"
                        : gifRegex.test(message?.content)
                        ? "Sent Gif"
                        : message?.content.substring(0,30)}
                    </div>
                  </div>
                </div>
                <div className="relative w-fit h-fit col-start-2 grid grid-flow-col auto-cols-auto justify-self-end self-center">
                  <div className="relative col-start-1 w-fit h-fit  pr-2 text-xs text-offBlack/70">
                    {moment(message?.sent?.toString()).fromNow()}
                  </div>
                </div>
              </div>
            );
          }
        )}
    </div>
  );
};

export default Preview;
