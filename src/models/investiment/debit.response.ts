export type DebitResponse = {
  investor: {
    pf: { [key: string]: number };
    pj: { [key: string]: number };
  };
  wise: {
    pf: { [key: string]: number };
    pj: { [key: string]: number };
  };
};
