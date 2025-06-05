export declare class EmailService {
    private transporter;
    sendVerificationEmail(to: string, token: string): Promise<void>;
}
