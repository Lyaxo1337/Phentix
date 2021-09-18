import { Document } from "mongoose";

/* SETTINGS */
export interface RawSettings {
  prefix: string;
  createdAt: number;
  updatedAt: number;
  roles: {
    helper: string;
    moderator: string;
    admin: string;
  };
}

export interface ISettings extends RawSettings, Document {}

/* COUNTER */
interface RawCounter {
  index: number;
}

export interface ICounter extends RawCounter, Document {}

/* NAME */
interface RawName {
  userId: string;
  guildId: string;
  name: string;
}

export interface IName extends RawName, Document {}