import Image from "next/legacy/image";
import { FormEvent, FunctionComponent } from "react";
import { ImCross } from "react-icons/im";
import { useDispatch } from "react-redux";
import { INFURA_GATEWAY } from "../../../../lib/lens/constants";
import createProfilePicture from "../../../../lib/lens/helpers/createProfilePicture";
import { setFulfillment } from "../../../../redux/reducers/fulfillmentSlice";
import { FulfillmentProps } from "../../types/common.types";

const FulfillmentCanvas: FunctionComponent<FulfillmentProps> = ({
  lensProfile,
  fulfillmentModal,
  postImage,
  notes,
  setNotes,
  amount,
  setAmount,
  sizes,
  setSizes,
  baseColor,
  setBaseColor,
  payment,
  setPayment,
}): JSX.Element => {
  const dispatch = useDispatch();
  const profileImage = createProfilePicture(lensProfile);
  return (
    <div className="inset-0 justify-center fixed z-50 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-full md:w-[80vw] h-4/5 col-start-1 place-self-center rounded-lg p-5 bg-white/50">
        <Image
          src={`${INFURA_GATEWAY}/ipfs/QmSjh6dsibg9yDfBwRfC5YSWFTmwpwPxRDTFG8DzLHzFyB`}
          layout="fill"
          objectFit="cover"
          className="absolute w-full h-full rounded-lg"
        />
        <div className="relative w-full h-full rounded-lg" id="full">
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmSjh6dsibg9yDfBwRfC5YSWFTmwpwPxRDTFG8DzLHzFyB`}
            layout="fill"
            objectFit="cover"
            className="absolute w-full h-full rounded-lg"
          />
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmUWUBwGxo5y8YzU2V52ZCqcNgbuEsLn1g6ngbXsJjbPA4`}
            layout="fill"
            objectFit="cover"
            className="absolute w-full h-full rounded-lg"
          />
          <div className="relative w-full h-full flex flex-col">
            <div className="relative w-full h-28 grid grid-flow-col auto-cols-auto">
              <div className="relative w-10 h-10 rounded-full col-start-1 place-self-start top-4 left-4">
                <Image
                  src={profileImage}
                  draggable={false}
                  layout="fill"
                  objectFit="cover"
                  className="w-full h-full rounded-full"
                />
              </div>
              <div className="relative w-fit h-fit row-start-1 self-start justify-self-end pr-3 pt-3 cursor-pointer">
                <ImCross
                  color="black"
                  size={15}
                  onClick={() =>
                    dispatch(
                      setFulfillment({
                        actionOpen: false,
                        actionImage: "",
                        actionFile: "",
                        actionCatalog: "",
                        actionSku: "",
                      })
                    )
                  }
                />
              </div>
            </div>
            <div className="relative w-full h-fit rounded-xl flex flex-row px-10">
              <div className="relative w-full h-full col-start-1 place-self-center font-herm gap-2 flex flex-col">
                <div className="relative w-fit h-fit text-7xl text-black">
                  SYNTH FULFILLMENT
                </div>
                <div className="relative w-fit h-fit text-3xl text-black/50">
                  SYNC WITH YOUR HYPERLOCAL FOUNDRY
                </div>
              </div>
              <div className="relative w-fit h-full col-start-2 flex flex-col gap-3 justify-content-end">
                <div className="relative w-full h-full grid grid-flow-row auto-rows-auot">
                  <div className="relative w-fit h-fit font-digiR text-black/50">
                    printfile dimensions
                  </div>
                  <div className="relative w-fit h-fit rounded-lg" id="hot">
                    <input
                      disabled={true}
                      className="relative w-60 h-10 rounded-lg border border-azul/50 font-digiR bg-white/70 text-black/50 px-3"
                      value={fulfillmentModal.file}
                    />
                  </div>
                </div>
                <div className="relative w-full h-full grid grid-flow-row auto-rows-auot">
                  <div className="relative w-fit h-fit font-digiR text-black/50">
                    product catalog
                  </div>
                  <div className="relative w-fit h-fit rounded-lg" id="hot">
                    <input
                      disabled={true}
                      className="relative w-60 h-10 rounded-lg border border-azul/50 font-digiR bg-white/70 text-black/50 px-3"
                      value={fulfillmentModal.catalog}
                    />
                  </div>
                </div>
                <div className="relative w-full h-full grid grid-flow-row auto-rows-auot">
                  <div className="relative w-fit h-fit font-digiR text-black/50">
                    product sku
                  </div>
                  <div className="relative w-fit h-fit rounded-lg" id="hot">
                    <input
                      disabled={true}
                      className="relative w-60 h-10 rounded-lg border border-azul/50 font-digiR bg-white/70 text-black/50 px-3"
                      value={fulfillmentModal.sku}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="relative w-full h-fit flex flex-row px-10 items-end">
              <div className="relative w-full h-fit flex flex-col gap-8 ">
                <div className="relative w-fit h-fit flex flex-row gap-20">
                  <div className="relative w-fit h-fit flex flex-col gap-2">
                    <div className="relative font-digiR text-black/50 text-lg">
                      BASE COLOR
                    </div>
                    <div className="relative w-fit h-fit flex flex-row gap-2">
                      {Array.from([
                        "playa",
                        "offBlack",
                        "rojo",
                        "amarillo",
                      ]).map((item: string, index: number) => {
                        return (
                          <div
                            key={index}
                            className={`relative h-4 w-4 border ${
                              baseColor === item ? "border-comp" : "border-none"
                            } bg-${item} cursor-pointer`}
                            onClick={() => setBaseColor(item)}
                          ></div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="relative w-fit h-fit flex flex-col gap-2">
                    <div className="relative font-digiR text-black/50 text-lg">
                      EDIT PAYMENT
                    </div>
                    <div className="relative w-fit h-fit rounded-lg" id="hot">
                      <input
                        className="relative w-60 h-10 rounded-lg border border-azul/50 font-digiR bg-white/70 text-black/50 px-3"
                        defaultValue={lensProfile?.ownedBy}
                        value={payment}
                        onChange={(e: FormEvent) =>
                          setPayment((e.target as any).value)
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="relative w-fit h-fit flex flex-row gap-20">
                  <div className="relative w-fit h-fit flex flex-row gap-2">
                    <div className="relative font-digiR text-black/50 text-lg">
                      AMT.
                    </div>
                    <div className="relative w-fit h-fit rounded-lg" id="hot">
                      <input
                        className="relative w-20 h-10 rounded-lg border border-azul/50 font-digiR bg-white/70 text-black/50 px-3"
                        type={"number"}
                        defaultValue={10}
                        value={amount < 1 ? 1 : amount}
                        onChange={(e: FormEvent) =>
                          setAmount(Number((e.target as any).value))
                        }
                        min={1}
                      />
                    </div>
                  </div>
                  <div className="relative w-fit h-fit flex flex-row gap-2">
                    <div className="relative font-digiR text-black/50 text-lg">
                      SIZES
                    </div>
                    <div className="relative w-fit h-fit flex flex-row gap-2 text-sm font-digiR">
                      {Array.from(["XS", "S", "M", "L", "XL"]).map(
                        (item: string, index: number) => {
                          return (
                            <div
                              className={`relative h-6 w-6 border border-black ${
                                sizes.includes(item) ? "bg-amarillo" : "bg-azul"
                              } grid grid-flow-col auto-cols-auto cursor-pointer`}
                              key={index}
                              onClick={() => {
                                sizes.includes(item)
                                  ? setSizes(
                                      sizes.filter((value) => value !== item)
                                    )
                                  : setSizes([...sizes, item]);
                              }}
                            >
                              <div className="relative flex place-self-center">
                                {item}
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                </div>
                <div className="relative w-fit h-fit flex flex-row gap-3">
                  <div className="relative w-fit h-fit flex flex-row gap-2">
                    <div className="relative font-digiR text-black/50 text-lg">
                      NOTES
                    </div>
                    <div className="relative w-full h-20 rounded-lg" id="hot">
                      <textarea
                        onChange={(e: FormEvent) =>
                          setNotes((e.target as any).value)
                        }
                        value={notes}
                        className="relative w-72 h-full rounded-lg border border-azul/50 font-digiR bg-white/70 text-black/50 p-1"
                        style={{ resize: "none" }}
                      />
                    </div>
                  </div>
                  <div className="relative w-20 h-20 border border-azul/50 rounded-lg bg-spots">
                    <Image
                      src={`${INFURA_GATEWAY}/ipfs/${postImage}`}
                      layout="fill"
                      objectFit="cover"
                      className="flex rounded-lg"
                    />
                  </div>
                </div>
              </div>
              <div className="relative w-fit h-fit flex flex-row gap-2 items-center">
                <div className="relative w-fit h-fit font-herm text-3xl cursor-pointer">
                  CONTINUE?
                </div>
                <div className="relative w-10 h-5 cursor-pointer">
                  <Image
                    src={`${INFURA_GATEWAY}/ipfs/Qmc8B1DveH6Z9U5wiTyUL5mM2MUxF9n7q6bpNeJzghP8nt`}
                    layout="fill"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FulfillmentCanvas;
