export interface Answer {
  optionIndex: number;
  customText: string;
}

export type AnswersMap = Record<number, Answer>;
