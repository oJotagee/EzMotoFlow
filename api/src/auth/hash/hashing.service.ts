export abstract class HashingProtocol {
  abstract hash(password): Promise<string>
  abstract compare(password, passwordHash): Promise<boolean>
}
