import GameManager from "./GameManager";
import PubSubManager from "./PubSubManager";
import { User } from "./User";

export default class UserManager {
  private static instance: UserManager | null = null;
  private users: Map<number, User> = new Map<number, User>();

  private constructor() {}

  static getInstance(): UserManager {
    if (!this.instance) {
      this.instance = new UserManager();
    }

    return this.instance;
  }

  public getUser(user_id: number): User | undefined {
    return this.users.get(user_id);
  }

  public addUser(user: User) {
    this.users.set(user.user_id, user);
    // adding all the socket handlers
    GameManager.getInstance().addHandlers(user);
    // subscribing to all messages in user.user_id channel
    PubSubManager.getInstance().subscribe(user.user_id, `user.${user.user_id}`);
    user.socket.on("close", () => {
      PubSubManager.getInstance().userLeft(user.user_id); // unsubscribe user from all channels
    });
  }
}
