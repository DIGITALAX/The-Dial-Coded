import { HsvaColor, ColorResult } from "@uiw/color-convert";
import { SwatchPresetColor } from "@uiw/react-color-swatch";
import { Ref, MouseEvent, FormEvent } from "react";

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
  showSideDrawOptions: boolean;
  setShowSideDrawOptions: (e: boolean) => void;
  showBottomDrawOptions: boolean;
  setShowBottomDrawOptions: (e: boolean) => void;
  canvasRef: Ref<HTMLCanvasElement>;
  brushWidth: number;
  handleMouseDown: (e: MouseEvent) => void;
  handleMouseMove: (e: MouseEvent) => void;
  handleMouseUp: (e: MouseEvent) => void;
  colorPicker: boolean;
  setColorPicker: (e: boolean) => void;
  shapes: boolean;
  setShapes: (e: boolean) => void;
  pencil: boolean;
  setPencil: (e: boolean) => void;
  setShapeFillType: (e: string[]) => void;
  setOnDrawTracker: (e: boolean) => void;
  setThickness: (e: boolean) => void;
  thickness: boolean;
  setBrushWidth: (e: number) => void;
  searchTarget: string;
  handleChangeSearch: (e: FormEvent) => void;
  handleKeyEnter: (e: any) => void;
  searchLoading: boolean;
  quickSearchResults: any[];
  fillImages: string[];
  setErase: (e: boolean) => void;
  erase: boolean;
  setPan: (e: boolean) => void;
  pan: boolean;
  handleSave: () => void;
  draftBoard: boolean;
  setDraftBoard: (e: boolean) => void;
};

export type ColorPickerProps = {
  hex: string;
  setHex: (e: string) => void;
};

export type SideMenuProps = {
  showSideDrawOptions: boolean;
  setShowSideDrawOptions: (e: boolean) => void;
  handleSave: () => void;
  draftBoard: boolean;
  setDraftBoard: (e: boolean) => void;
};

export type BottomMenuProps = {
  showBottomDrawOptions: boolean;
  setShowBottomDrawOptions: (e: boolean) => void;
  colorPicker: boolean;
  setColorPicker: (e: boolean) => void;
  hex: string;
  setHex: (e: string) => void;
  shapes: boolean;
  setShapes: (e: boolean) => void;
  pencil: boolean;
  setPencil: (e: boolean) => void;
  setShapeFillType: (e: string[]) => void;
  setOnDrawTracker: (e: boolean) => void;
  setThickness: (e: boolean) => void;
  thickness: boolean;
  setBrushWidth: (e: number) => void;
  brushWidth: number;
  setErase: (e: boolean) => void;
  erase: boolean;
  setPan: (e: boolean) => void;
  pan: boolean;
};

export type BoardProps = {
  canvasRef: Ref<HTMLCanvasElement>;
  handleMouseDown: (e: MouseEvent) => void;
  handleMouseMove: (e: MouseEvent) => void;
  handleMouseUp: (e: MouseEvent) => void;
};

export type SideOptionsProps = {
  handleSave: () => void;
  draftBoard: boolean;
  setDraftBoard: (e: boolean) => void;
};

export type BottomOptionsProps = {
  colorPicker: boolean;
  setColorPicker: (e: boolean) => void;
  hex: string;
  setHex: (e: string) => void;
  shapes: boolean;
  setShapes: (e: boolean) => void;
  pencil: boolean;
  setPencil: (e: boolean) => void;
  setShapeFillType: (e: string[]) => void;
  setOnDrawTracker: (e: boolean) => void;
  setThickness: (e: boolean) => void;
  thickness: boolean;
  setBrushWidth: (e: number) => void;
  brushWidth: number;
  setErase: (e: boolean) => void;
  erase: boolean;
  setPan: (e: boolean) => void;
  pan: boolean;
};

export interface ElementInterface {
  type: string;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  roughElement?: any;
  points?: {
    x: number;
    y: number;
  }[];
  color?: string;
  thickness?: number;
}

export interface Point2 {
  x: number;
  y: number;
}

export type BaseProps = {
  searchTarget: string;
  handleChangeSearch: (e: FormEvent) => void;
  handleKeyEnter: (e: any) => void;
  searchLoading: boolean;
  quickSearchResults: any[];
  fillImages: string[];
};
