import {CollectionMaker} from "../../../code/MeteorBase/CollectionMaker";
import {ChatInterface} from "../api/chat-interface";

export const Chats = CollectionMaker.make<ChatInterface>("chats");
