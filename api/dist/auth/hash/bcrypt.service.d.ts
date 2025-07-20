import { HashingProtocol } from './hashing.service';
export declare class BcryptService extends HashingProtocol {
    hash(password: string): Promise<string>;
    compare(password: string, passwordHash: string): Promise<boolean>;
}
