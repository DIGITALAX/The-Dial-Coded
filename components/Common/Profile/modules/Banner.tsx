import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../lib/lens/constants";
import { BannerProps } from "../types/profile.types";

const Banner: FunctionComponent<BannerProps> = ({
  coverPicture,
}): JSX.Element => {
  let coverImagePictureFormatted: string = "";
  if (coverPicture) {
    if (coverPicture?.original) {
      if (coverPicture?.original?.url.includes("http")) {
        coverImagePictureFormatted = coverPicture?.original.url;
      } else {
        const cut = coverPicture?.original?.url.split("//");
        coverImagePictureFormatted = `${INFURA_GATEWAY}/ipfs/${cut[1]}`;
      }
    } else {
      coverImagePictureFormatted = coverPicture?.uri;
    }
  }

  return (
    <div className="relative w-full h-96 row-start-1 grid grid-flow-col auto-cols-auto opacity-80 bg-white">
      {coverPicture ? (
        <Image
          objectFit="cover"
          objectPosition={"top"}
          layout="fill"
          src={coverImagePictureFormatted}
        />
      ) : (
        <Image
          objectFit="cover"
          objectPosition={"top"}
          layout="fill"
          src={`${INFURA_GATEWAY}/ipfs/QmcDKJt29aMZeFpHtv61R4TZU1MbBXeb5RzfdoY6Ee2hsY`}
        />
      )}
    </div>
  );
};

export default Banner;
