export interface TopicInterface {
  inthestyleof: string[];
  genre: string[];
  format: string[];
  colors: string[];
  lighting: string[];
  engines: string[];
  designtools: string[];
  techniques: string[];
  fashion: string[];
  equipment: string[];
  descriptive: string[];
}

export type UseSampleResult = {
  topics: string[];
  topicValues: TopicInterface;
};
