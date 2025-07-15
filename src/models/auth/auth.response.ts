export type AuthResponse = {
    message: string;
    data: {
        personal_information_filled: string;
        token: string;
    };
};