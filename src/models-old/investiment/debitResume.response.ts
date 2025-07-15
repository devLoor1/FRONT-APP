export type DebitResumeResponse = {
    pj: {
        "30": number;
        "60": number;
        "90": number;
    };
    over30Dias: number,
    over60Dias: number,
    over90Dias: number,
};
