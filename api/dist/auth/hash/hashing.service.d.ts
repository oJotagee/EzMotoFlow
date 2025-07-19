export declare abstract class HashingProtocol {
    abstract hash(password: any): Promise<string>;
    abstract compare(password: any, passwordHash: any): Promise<boolean>;
}
