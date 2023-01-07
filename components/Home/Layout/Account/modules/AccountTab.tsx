import { FormEvent, FunctionComponent } from "react";
import { AccountTabProps } from "../types/account.types";
import lodash from "lodash";
import { SiAddthis } from "react-icons/si";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../../lib/lens/constants";
import { AiOutlineLoading } from "react-icons/ai";

const AccountTab: FunctionComponent<AccountTabProps> = ({
  profile,
  profileImageUploading,
  coverImageUploading,
  accountImageUpload,
  profileImage,
  coverImage,
  accountLoading,
  setProfileData,
  profileLoading,
  profileImageSet,
}): JSX.Element => {
  const location = lodash.filter(
    profile?.attributes,
    (attribute) => attribute?.key === "location"
  );
  const website = lodash.filter(
    profile?.attributes,
    (attribute) => attribute?.key === "website"
  );
  const coverPrefix = (profile as any)?.coverPicture;
  const imagePrefix = (profile as any)?.picture;
  let profileImagePicture: string;
  let coverImagePicture: string;
  if (!imagePrefix?.original) {
    profileImagePicture = "";
  } else if (imagePrefix?.original) {
    if (imagePrefix?.original?.url.includes("http")) {
      profileImagePicture = imagePrefix?.original.url;
    } else {
      const cut = imagePrefix?.original?.url.split("//");
      profileImagePicture = `${INFURA_GATEWAY}/ipfs/${cut[1]}`;
    }
  } else {
    profileImagePicture = imagePrefix?.uri;
  }

  if (!coverPrefix?.original) {
    coverImagePicture = "";
  } else if (coverPrefix?.original) {
    if (coverPrefix?.original?.url.includes("http")) {
      coverImagePicture = coverPrefix?.original.url;
    } else {
      const cut = coverPrefix?.original?.url.split("//");
      coverImagePicture = `${INFURA_GATEWAY}/ipfs/${cut[1]}`;
    }
  } else {
    coverImagePicture = coverPrefix?.uri;
  }

  return (
    <div className="relative w-full h-fit grid grid-flow-row auto-rows-auto gap-16 font-dosis text-offBlack self-start">
      <form
        className="relative row-start-1 w-full h-fit grid grid-flow-row auto-rows-auto self-start gap-4"
        onSubmit={(e: FormEvent) => setProfileData(e)}
      >
        <div className="relative justify-self-start self-center w-fit h-fit row-start-1 grid grid-flow-col auto-cols-auto gap-4 pb-3">
          <div className="relative w-fit h-fit col-start-1 grid grid-flow-col auto-cols-auto gap-2">
            <div className="relative w-fit h-fit col-start-1 place-self-center">
              Profile Id:
            </div>
            <div className="relative w-fit h-fit col-start-2 px-5 py-2 rounded-lg bg-gray-100 place-self-center mix-blend-multiply">
              {profile?.id}
            </div>
          </div>
          <div className="relative w-fit h-fit col-start-2 grid-flow-col auto-cols-auto grid gap-2">
            <div className="relative w-fit h-fit col-start-1 place-self-center">
              Handle:
            </div>
            <div className="relative w-fit h-fit col-start-2 px-5 py-2 rounded-lg bg-gray-100 place-self-center mix-blend-multiply">
              @{profile?.handle}
            </div>
          </div>
          <div className="relative w-fit h-fit col-start-3 grid-flow-col auto-cols-auto grid gap-2">
            <div className="relative w-fit h-fit col-start-1 place-self-center">
              Name:
            </div>
            <input
              className="relative w-40 h-fit col-start-2 p-2 rounded-lg bg-gray-100 place-self-center caret-transparent"
              name="accountName"
              type={"text"}
              defaultValue={profile?.name ? profile?.name : ""}
            />
          </div>
        </div>
        <div className="relative justify-self-start self-center w-fit h-fit row-start-2 grid grid-flow-col auto-cols-auto gap-8 pb-8">
          <div className="relative w-fit h-fit col-start-1 grid grid-flow-col auto-cols-auto gap-2">
            <div className="relative w-fit h-fit col-start-1 place-self-center">
              Location:
            </div>
            <input
              className="relative w-32 h-fit col-start-2 p-2 rounded-lg bg-gray-100 place-self-center caret-transparent"
              name="location"
              type={"text"}
              defaultValue={location[0].value ? (location[0].value as any) : ""}
            />
          </div>
          <div className="relative w-fit h-fit col-start-2 grid-flow-col auto-cols-auto grid gap-2">
            <div className="relative w-fit h-fit col-start-1 place-self-center">
              Website:
            </div>
            <input
              className="relative w-48 h-fit col-start-2 p-2 rounded-lg bg-gray-100 place-self-center caret-transparent"
              name="website"
              type={"text"}
              defaultValue={website[0].value ? (website[0].value as any) : ""}
            />
          </div>
        </div>
        <div className="relative w-full h-fit grid grid-flow-col auto-cols-auto row-start-3 gap-6 pb-2">
          <div className="relative w-full h-fit col-start-1 grid grid-flow-row auto-rows-auto gap-1">
            <div className="relative w-fit h-fit row-start-1 justify-self-start self-center">
              Bio
            </div>
            <textarea
              defaultValue={profile?.bio ? profile?.bio : ""}
              style={{ resize: "none" }}
              name="bio"
              className={`relative w-full h-32 overflow-y-scroll row-start-2 bg-white/80 rounded-xl grid grid-flow-col auto-cols-auto cursor-text active:opacity-80 text-offBlack font-dosis text-base p-2 justify-self-start self-center caret-transparent`}
            ></textarea>
          </div>
          <div className="relative w-full h-fit col-start-2 grid grid-flow-row auto-rows-auto gap-1">
            <div className="relative w-fit h-fit row-start-1 grid grid-flow-col auto-cols-auto font-dosis text-offBlack text-base gap-2">
              <div className="relative w-fit h-fit col-start-1">
                Cover Picture
              </div>
              <label
                className={`relative w-fit h-fit col-start-2 place-self-center ${
                  !coverImageUploading && "cursor-pointer active:scale-95"
                }`}
                onChange={(e: FormEvent) => {
                  !coverImageUploading ? accountImageUpload(e) : {};
                }}
              >
                <SiAddthis color="white" size={20} />
                <input
                  type="file"
                  accept="image/png"
                  hidden
                  id="files"
                  multiple={false}
                  name="cover"
                  className="caret-transparent"
                  disabled={
                    coverImageUploading || accountLoading ? true : false
                  }
                />
              </label>
            </div>
            <div
              className={`relative w-full h-32 row-start-2 place-self-center bg-offWhite rounded-md grid grid-flow-col auto-cols-auto ${
                !coverImage && !coverImagePicture && "mix-blend-multiply"
              }`}
            >
              {(coverImage || coverImagePicture) && !coverImageUploading && (
                <div className="relative w-full h-full col-start-1 grid grid-flow-col auto-cols-auto">
                  <Image
                    src={
                      coverImage
                        ? `${INFURA_GATEWAY}/ipfs/${coverImage}`
                        : coverImagePicture
                    }
                    layout="fill"
                    objectFit="cover"
                    objectPosition={"cover"}
                    className="rounded-md col-start-1 justify-self-start"
                  />
                </div>
              )}
              {coverImageUploading && (
                <div className="relative w-fit h-fit place-self-center">
                  <AiOutlineLoading
                    color="black"
                    size={20}
                    className="relative w-fit h-fit animate-spin place-self-center col-start-1"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="relative w-full h-fit row-start-4 grid grid-flow-col auto-cols-auto gap-56">
          <button
            type="submit"
            className={`relative w-32 h-10 col-start-1 px-3 py-2 bg-offBlue text-white rounded-md grid grid-flow-col auto-cols-auto ${
              !coverImageUploading &&
              !accountLoading &&
              "cursor-pointer hover:opacity-70 active:scale-95"
            } `}
          >
            <div
              className={`relative w-fit h-fit col-start-1 place-self-center`}
            >
              {!accountLoading ? (
                "Save Profile Info"
              ) : (
                <div className="relative w-fit h-fit place-self-center animate-spin">
                  <AiOutlineLoading
                    color="white"
                    size={15}
                    className="relative w-fit h-fit animate-spin place-self-center col-start-1"
                  />
                </div>
              )}
            </div>
          </button>
        </div>
      </form>
      <div className="relative w-fit h-fit row-start-2 grid grid-flow-row auto-rows-auto gap-3">
        <div className="relative w-fit h-fit row-start-1 grid grid-flow-row auto-rows-auto gap-2">
          <div className="relative w-fit h-fit row-start-1 grid grid-flow-col auto-cols-auto font-dosis text-offBlack text-base gap-2">
            <div className="relative w-fit h-fit col-start-1">
              Profile Picture
            </div>
            <label
              className={`relative w-fit h-fit col-start-2 place-self-center ${
                !profileImageUploading && "cursor-pointer active:scale-95"
              }`}
              onChange={(e: FormEvent) => {
                !profileImageUploading ? accountImageUpload(e) : {};
              }}
            >
              <SiAddthis color="white" size={20} />
              <input
                type="file"
                accept="image/png"
                hidden
                required
                id="files"
                multiple={false}
                name="profile"
                className="caret-transparent"
                disabled={
                  profileImageUploading || accountLoading ? true : false
                }
              />
            </label>
          </div>
          <div
            className={`relative w-44 h-44 row-start-2 place-self-center bg-offWhite rounded-md grid grid-flow-col auto-cols-auto ${
              !profileImagePicture && !profileImage && "mix-blend-multiply"
            }`}
          >
            {(profileImage || profileImagePicture) &&
              !profileImageUploading && (
                <div className="relative w-full h-full col-start-1 grid grid-flow-col auto-cols-auto">
                  <Image
                    src={
                      profileImage
                        ? `${INFURA_GATEWAY}/ipfs/${profileImage}`
                        : profileImagePicture
                    }
                    layout="fill"
                    objectFit="cover"
                    objectPosition={"cover"}
                    className="rounded-md col-start-1 justify-self-start"
                  />
                </div>
              )}
            {profileImageUploading && (
              <div className="relative w-fit h-fit place-self-center">
                <AiOutlineLoading
                  color="black"
                  size={20}
                  className="relative w-fit h-fit animate-spin place-self-center col-start-1"
                />
              </div>
            )}
          </div>
        </div>
        <div
          className={`relative w-32 h-10 row-start-2 px-3 py-2 bg-offBlue text-white rounded-md grid grid-flow-col auto-cols-auto ${
            !profileImageUploading &&
            profileImage &&
            !profileLoading &&
            "cursor-pointer hover:opacity-70 active:scale-95"
          } `}
          onClick={() =>
            !profileImage && !profileLoading ? {} : profileImageSet()
          }
        >
          <div className={`relative w-fit h-fit col-start-1 place-self-center`}>
            {!profileImageUploading && !profileLoading ? (
              "Save Pfp"
            ) : (
              <div className="relative w-fit h-fit place-self-center animate-spin">
                <AiOutlineLoading
                  color="white"
                  size={15}
                  className="relative w-fit h-fit animate-spin place-self-center col-start-1"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountTab;
