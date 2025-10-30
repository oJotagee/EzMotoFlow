export declare class EmailService {
    private transporter;
    constructor();
    sendSignatureLink(clientEmail: string, clientName: string, contractId: string, signatureToken: string): Promise<void>;
}
