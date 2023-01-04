import { HsvaColor, ColorResult } from "@uiw/color-convert";
import { SwatchPresetColor } from "@uiw/react-color-swatch";
import { LegacyRef, Ref } from "react";
import CanvasDraw from "react-canvas-draw";

export interface SketchProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "color"> {
  prefixCls?: string;
  width?: number;
  color?: string | HsvaColor;
  presetColors?: false | SwatchPresetColor[];
  editableDisable?: boolean;
  onChange?: (newShade: ColorResult) => void;
}

export type DrawProps = {
  hex: string;
  setHex: (e: string) => void;
  showDrawOptions: boolean;
  setShowDrawOptions: (e: boolean) => void;
  drawing: string | undefined;
  canvasRef: LegacyRef<CanvasDraw> | undefined;
  brushWidth: number;
};

export type ColorPickerProps = {
  hex: string;
  setHex: (e: string) => void;
};

export type MenuProps = {
  hex: string;
  setHex: (e: string) => void;
  showDrawOptions: boolean;
  setShowDrawOptions: (e: boolean) => void;
};

export type BoardProps = {
  drawing: string | undefined;
  canvasRef: LegacyRef<CanvasDraw> | undefined;
  hex: string;
  brushWidth: number;
};

export type DrawOptionsProps = {
  hex: string;
  setHex: (e: string) => void;
};
