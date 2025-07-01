export type ListItem =
  | {
      type: 'header';
      year: number;
      totalVariation: string;
      totalYield: string;
    }
  | {
      type: 'item';
      month: string;
      variation: string;
      yield: string;
      parentYear: number;
      index: number;
    };