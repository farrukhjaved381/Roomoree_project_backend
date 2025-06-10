export declare class EmailService {
    private transporter;
    sendVerificationEmail(to: string, token: string): Promise<void>;
    sendResetPasswordEmail(to: string, url: string): Promise<void>;
}
