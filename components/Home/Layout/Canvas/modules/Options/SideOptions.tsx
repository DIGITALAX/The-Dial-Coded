import { FunctionComponent } from "react";
import CanvasOption from "../../../../../Common/Miscellaneous/CanvasOption";
import { SideOptionsProps } from "../../types/canvas.types";

const SideOptions: FunctionComponent<SideOptionsProps> = ({}): JSX.Element => {
  return (
    <div className="relative w-fit h-fit grid grid-flow-row auto-rows-auto gap-4">
      <CanvasOption
        image="QmPt4LreaWAN3WRzcUvo7WnVLUrCW73xKPc86vB59HowLz"
        width={25}
        height={25}
      />
      <div className="relative w-fit h-fit grid grid-flow-row auto-rows-auto gap-2">
        <CanvasOption
          image="QmbzpjweonLJNdKqJ2Ybs6c5DwNGewYf77q3ySMbGJzfJN"
          bgColor="black"
          width={20}
          height={20}
        />
        <CanvasOption
          bgColor="black"
          image="QmXeUfWYdWwtec82XniTA7c2dNjfVWqrUUipEg9XyM1kPn"
          width={20}
          height={6}
        />
        <CanvasOption
          image="QmRKP7reAbEFgGrv2KmPdUe1eZgAwVmTzZoWfSLAH4gMEc"
          bgColor="black"
          width={25}
          height={28}
        />
      </div>
      <div className="relative w-fit h-fit grid grid-flow-row auto-rows-auto gap-2">
        <CanvasOption
          image="QmeBHHf7Ueca9bs4xWqNAj4UEgChPkwtpiG68xqPxaavSo"
          bgColor="black"
          width={25}
          height={25}
        />
        <CanvasOption
          image="QmZZhPPzhmsicoiHGKPvqATdQ3JGakrZ2G3mK67goHA9CN"
          bgColor="black"
          width={25}
          height={25}
        />
      </div>
      <div className="relative w-fit h-fit grid grid-flow-row auto-rows-auto gap-2">
        <CanvasOption
          image="QmeNcEGW5pAFjPsgLsTDPgUsEm9sy2b1F1WteotshzcKvW"
          bgColor="black"
          width={28}
          height={20}
        />
        <CanvasOption
          image="QmZJQePuwQBP8vsa86vrPSVwsqwzam3PRbEbNxdgH7bBe9"
          bgColor="black"
          width={28}
          height={20}
        />
      </div>
      <div className="relative w-fit h-fit grid grid-flow-row auto-rows-auto gap-2">
        <CanvasOption
          image="QmcX4FjBExCJvbLvxuTs2VPwzhpoCds1sL97AvxygF9EYE"
          bgColor="black"
          width={25}
          height={25}
        />
        <CanvasOption
          image="QmYMJJ2U8fCWsoiaX2Twmmks8sj3z4bCU5BMNT9dXhnaBj"
          bgColor="black"
          width={25}
          height={25}
        />
      </div>
    </div>
  );
};

export default SideOptions;
