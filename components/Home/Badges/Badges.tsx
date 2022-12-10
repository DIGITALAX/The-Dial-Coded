import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import useBadges from "./hooks/useBadges";

const Badges: FunctionComponent = (): JSX.Element => {
  const { badges, badgeColor, badgeImage } = useBadges();
  return (
    <div className="relative bg-white p-10 w-full h-full grid grid-flow-row auto-rows-auto gap-5">
      <div className="relative w-full h-full row-start-1 grid grid-flow-col auto-cols-auto pb-20">
        <div className="relative uppercase w-fit h-fit text-black font-dosis text-center text-4xl place-self-center leading-loose">
          great place for <br />
          some text here
        </div>
      </div>
      <div className="relative row-start-2 w-full h-full grid grid-flow-row auto-rows-auto gap-5 col-span-1">
        <div className="relative w-fit h-full col-start-1 grid grid-flow-row auto-rows-auto gap-8 col-span-1">
          <div className="relative w-fit h-fit row-start-1 place-self-center cursor-pointer hover:opacity-80 active:opacity-70">
            <Image
              width={40}
              height={40}
              src="https://thedial.infura-ipfs.io/ipfs/QmeEDch97j4u2fKzsSTZk5WxE4CWDppqngEXHmTJ9hne5T"
              alt="forward"
            />
          </div>
          <div className="relative w-fit h-fit row-start-2 place-self-center cursor-pointer hover:opacity-80 scale-x-[-1] active:opacity-70">
            <Image
              width={40}
              height={40}
              src="https://thedial.infura-ipfs.io/ipfs/QmeEDch97j4u2fKzsSTZk5WxE4CWDppqngEXHmTJ9hne5T"
              alt="back"
            />
          </div>
        </div>

        <div className="relative w-fit h-fit font-dosis text-black place-self-center text-right text-[1.5vw] col-start-2">
          canvas and drafts as process in the public memory <br />
          audience growth through reach and reflex <br />
          records
        </div>
        <div className="relative col-start-3 w-fit h-full grid grid-cols-5 grid-flow-col-dense grid-rows-3 gap-3 justify-self-end">
          {badges?.map((badge: string, index: number) => {
            return (
              <div className="relative w-20 h-20 rounded-lg border-2 border-offBlack grid grid-flow-col auto-cols-auto cursor-pointer"
              key={index}>
                <Image
                  src={`https://thedial.infura-ipfs.io/ipfs/${badgeImage[index]}`}
                  layout="fill"
                  objectFit="cover"
                />
                <div
                  id={badgeColor[index]}
                  className="relative w-full h-full col-start-1 grid grid-flow-col auto-cols-auto rounded-md p-1"
                >
                  <div className="relative col-start-1 place-self-center w-full h-full grid grid-flow-col auto-cols-auto rounded-full border-2 border-offBlack">
                    <Image
                      src={`https://thedial.infura-ipfs.io/ipfs/QmVxMmLejwVJrDAfV1vgYVwJyxP29i2K51LiqxK62adPbg`}
                      layout="fill"
                      objectFit="cover"
                      className="hover:rotate-12"
                    />
                    <div className="relative w-fit h-fit place-self-center capitalize font-dosis text-black text-xs text-center">
                      {badge}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Badges;
