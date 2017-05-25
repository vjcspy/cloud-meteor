import {CollectionMaker} from "../../../code/MeteorBase/CollectionMaker";
import {MessageInterface} from "../api/message-interface";

export const Messages = CollectionMaker.make<MessageInterface>("messages");
