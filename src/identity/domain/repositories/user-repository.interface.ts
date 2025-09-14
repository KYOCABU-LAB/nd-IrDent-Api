export abstract class UserRepository {
  abstract findByUsername(username: string): Promise<any | null>;
}