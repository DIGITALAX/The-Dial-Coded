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
  title: string;
  handleTitle: (e: FormEvent) => void;
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
  setShapeFillType: (e: string) => void;
  setThickness: (e: boolean) => void;
  thickness: boolean;
  setBrushWidth: (e: number) => void;
  searchTarget: string;
  handleChangeSearch: (e: FormEvent) => void;
  handleKeyEnter: (e: any) => void;
  searchLoading: boolean;
  quickSearchResults: any[];
  fillImages: string[];
  handleSave: () => Promise<void>;
  draftBoard: boolean;
  setDraftBoard: (e: boolean) => void;
  handleImageAdd: (e: FormEvent) => Promise<void>;
  setTool: (e: string) => void;
  tool: string;
  undo: () => boolean | void;
  redo: () => boolean | void;
  selectedElement: any;
  action: string;
  writingRef: Ref<HTMLTextAreaElement>;
  handleBlur: (e: FormEvent) => void;
  handleClear: () => void;
  handleCanvasPost: () => Promise<void>;
  postLoading: boolean;
  handleCanvasSave: () => Promise<void>;
  saveLoading: boolean;
  zoom: number;
  setZoom: (e: number) => void;
  draftCanvases: Draft[];
  handleShowDraft: (draft: Draft) => void;
  addImageToCanvas: (image: string) => Promise<void>;
  createAuthProvider: () => Promise<void>;
  client: any;
  draftsLoading: boolean;
};

export type ColorPickerProps = {
  hex: string;
  setHex: (e: string) => void;
};

export type SideMenuProps = {
  showSideDrawOptions: boolean;
  setShowSideDrawOptions: (e: boolean) => void;
  handleSave: () => Promise<void>;
  draftBoard: boolean;
  setDraftBoard: (e: boolean) => void;
  handleImageAdd: (e: FormEvent) => Promise<void>;
  undo: () => boolean | void;
  redo: () => boolean | void;
  setTool: (e: string) => void;
  handleClear: () => void;
  zoom: number;
  setZoom: (e: number) => void;
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
  setShapeFillType: (e: string) => void;
  setThickness: (e: boolean) => void;
  thickness: boolean;
  setBrushWidth: (e: number) => void;
  brushWidth: number;
  setTool: (e: string) => void;
};

export type BoardProps = {
  canvasRef: Ref<HTMLCanvasElement>;
  handleMouseDown: (e: MouseEvent) => void;
  handleMouseMove: (e: MouseEvent) => void;
  handleMouseUp: (e: MouseEvent) => void;
  zoom: number;
};

export type SideOptionsProps = {
  handleSave: () => Promise<void>;
  draftBoard: boolean;
  setDraftBoard: (e: boolean) => void;
  handleImageAdd: (e: FormEvent) => Promise<void>;
  undo: () => boolean | void;
  redo: () => boolean | void;
  setTool: (e: string) => void;
  handleClear: () => void;
  zoom: number;
  setZoom: (e: number) => void;
};

export type BottomOptionsProps = {
  colorPicker: boolean;
  setColorPicker: (e: boolean) => void;
  hex: string;
  setHex: (e: string) => void;
  shapes: boolean;
  setShapes: (e: boolean) => void;
  setShapeFillType: (e: string) => void;
  setThickness: (e: boolean) => void;
  thickness: boolean;
  setBrushWidth: (e: number) => void;
  brushWidth: number;
  setTool: (e: string) => void;
};

export interface ElementInterface {
  id: number;
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
  fill?: string;
  text?: string;
  stroke?: string;
  strokeWidth?: number;
  fillStyle?: string;
  image?: HTMLImageElement;
  position?: string;
  lineDash?: number[];
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
  addImageToCanvas: (image: string) => Promise<void>;
};

export type Point = {
  x: number;
  y: number;
};

export type PublishProps = {
  handleCanvasPost: () => Promise<void>;
  postLoading: boolean;
  handleCanvasSave: () => Promise<void>;
  saveLoading: boolean;
};

export type TitleProps = {
  title: string;
  handleTitle: (e: FormEvent) => void;
};

export interface Draft {
  title: string;
  elements: string;
  image: string;
  tags: string[];
  date: string;
}

export type DraftsProps = {
  draftCanvases: Draft[];
  handleShowDraft: (draft: Draft) => void;
  createAuthProvider: () => Promise<void>;
  client: any;
  draftsLoading: boolean;
};

export type UseDraftsResult = {
  saveCanvasNetwork: (file: File, elements: string[]) => Promise<void>;
  draftCanvases: Draft[];
  handleShowDraft: (draft: Draft) => void;
  draftsLoading: boolean;
  createAuthProvider: () => Promise<void>;
  client: any;
};
