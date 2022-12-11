import { Dispatch, AnyAction } from "redux";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";

export type ReactionProps = {
  textColor: string;
  commentColor: string;
  mirrorColor: string;
  collectColor: string;
  heartColor: string;
};

export type InterfaceProps = {
  title: string;
};

export type BoxProps = {
  image: string;
  row: string;
  col: string;
  self: string;
  justify: string;
};

export type BadgeProps = {
  badgeColor: string[];
  index: number;
  badge: string;
  badgeImage: string[];
};

export type RewindProps = {
  row: string;
  scale?: string;
};

export type TopicProps = {
  index: number;
  dispatch: Dispatch<AnyAction>;
  setTopic: ActionCreatorWithPayload<string, "topic/setTopic">;
  topic: string;
  selectedTopic: string;
};

export type TopicValuesProps = {
  index: number;
  value: string;
};

export type PanelOptionProps = {
  index: number;
  dispatch: Dispatch<AnyAction>;
  layoutType: string[];
  setLayout: ActionCreatorWithPayload<string, "layout/setLayout">;
  uri: string;
};

export type ArrowProps = {
  handleValue: (e: boolean) => void;
  value: boolean;
};

export type PresetProps = {
  index: number;
  format: string;
};

export type FeedPublicationProps = {
  images: string[];
  row: string;
};

export type OptionMenuProps = {
  col?: string;
  image: string;
  handleOpenDropdown: (e: boolean) => void;
  openDropdown: boolean;
  bgColor: string;
  values: string[];
  dispatch: Dispatch<AnyAction>;
  dispatchFunction: any;
  selectorValue: string | undefined;
  imageWidth: number;
  imageHeight: number;
};

export type LineProps = {
  col: string;
  width: string;
};

export type PanelProps = {
  height: string;
  col: string;
  width: string;
};

export type TapeProps = {
  height: string;
  width: string;
  bgColor: string;
  sideImage?: string;
  title: string;
};

export type MainDisplayProps = {
  width: string;
  height: string;
  row: string;
  title: string;
};

export type ButtonIconProps = {
  bgColor: string;
  width: string;
  height: string;
  image?: string;
  col: string;
  justify: string;
  self: string
};
