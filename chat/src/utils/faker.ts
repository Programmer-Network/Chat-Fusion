import { IMessage } from "../types";
import { faker } from "@faker-js/faker";

export default class DummyMessageGenerator {
  public static generate(): IMessage {
    return {
      id: faker.string.uuid(),
      content: faker.lorem.sentence(),
      author: faker.person.fullName(),
      badge: faker.image.url(),
      emojis: Array.from({ length: faker.number.int({ min: 0, max: 5 }) }, () =>
        faker.image.url()
      ),
      platform: faker.helpers.arrayElement(["twitch", "kick", "youtube"]),
    };
  }
}
