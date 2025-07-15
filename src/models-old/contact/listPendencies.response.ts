export type ListPendenciesResponse = {
  pendencies: {
    title: string;
    description: string;
    urlClicksign: string | null;
    status: string;
  }[];
};
