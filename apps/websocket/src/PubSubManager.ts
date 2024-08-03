import { createClient, RedisClientType } from "redis";
import { User } from "./User";
import UserManager from "./UserManager";

const REDIS_STRING = process.env.REDIS_STRING;

export default class PubSubManager {
  private static instance: PubSubManager | null = null;
  private subscriptions: Map<number, string[]>; // mapping user_id with channels that user is interested in
  private reverseSubscriptions: Map<string, number[]>; // mapping channed with user_id's interested in this channel
  private publishClient: RedisClientType;
  private subscribeClient: RedisClientType;

  private constructor() {
    this.subscriptions = new Map<number, string[]>();
    this.reverseSubscriptions = new Map<string, number[]>();
    this.publishClient = createClient({ url: REDIS_STRING });
    this.subscribeClient = createClient({ url: REDIS_STRING });
    this.publishClient.connect();
    this.subscribeClient.connect();
  }

  public static getInstance(): PubSubManager {
    if (!this.instance) {
      this.instance = new PubSubManager();
    }

    return this.instance;
  }

  public subscribe(user_id: number, channel: string) {
    // checking if user already subscribed
    if (this.subscriptions.get(user_id)?.find((c) => c === channel)) {
      return;
    }

    // user not subscribed so we subscribe it
    this.subscriptions.set(
      user_id,
      (this.subscriptions.get(user_id) || []).concat(channel)
    );

    this.reverseSubscriptions.set(
      channel,
      (this.reverseSubscriptions.get(channel) || []).concat(user_id)
    );

    if (this.reverseSubscriptions.get(channel)?.length === 1) {
      // this is the first time someone is subscibing to this channel
      this.reverseSubscriptions.set(channel, [user_id]);
      this.subscribeClient.subscribe(channel, (message) => {
        this.reverseSubscriptions.get(channel)?.forEach((user_id) => {
          UserManager.getInstance().getUser(user_id)?.emit(message);
        });
      });
    }
  }

  public unsubscribe(user_id: number, channel: string) {
    // removing channel from list of subscribed channels
    this.subscriptions.set(
      user_id,
      this.subscriptions.get(user_id)?.filter((c) => c !== channel) || []
    );

    if (this.subscriptions.get(user_id)?.length === 0) {
      this.subscriptions.delete(user_id);
    }

    // removing user from reverseSubscriptions of channel
    this.reverseSubscriptions.set(
      channel,
      this.reverseSubscriptions.get(channel)?.filter((u) => u !== user_id) || []
    );

    // if this was the last user interested in this channel unsubscribe
    if (this.reverseSubscriptions.get(channel)?.length === 0) {
      this.reverseSubscriptions.delete(channel);
      this.subscribeClient.unsubscribe(channel);
    }
  }

  public publish(channel: string, message: string) {
    this.publishClient.publish(channel, message);
  }

  public userLeft(user_id: number) {
    this.subscriptions
      .get(user_id)
      ?.forEach((channel) => this.unsubscribe(user_id, channel));
  }
}
