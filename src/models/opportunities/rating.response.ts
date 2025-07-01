export type RatingResponse = {
  intervalMin: number;
  intervalMax: number;
  pillars: {
    pillarRating: string;
    value: number;
    description: string;
  }[];
};
