import { FunctionComponent } from "react";
import Sketch from "@uiw/react-color-sketch";
import { ColorPickerProps } from "../../types/canvas.types";

const ColorPicker: FunctionComponent<ColorPickerProps> = ({
  hex,
  setHex,
}): JSX.Element => {
  return (
    <Sketch
      color={hex}
      onChange={(color) => {
        setHex(color.hexa);
      }}
    />
  );
};

export default ColorPicker;
