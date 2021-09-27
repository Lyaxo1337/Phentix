import { Model, Schema, model } from "mongoose";

import { ISettings } from "../src/types/mongodb";

const SettingsSchema = new Schema(
  {
    _id: String,
    prefix: { type: String, default: "!" },
    roles: {
      helper: String,
      moderator: String,
      admin: String,
    },
    
    //Planned Permission Level
    /* permLevel: [{level: Number, rolesInCount: String[]}], */
    eco: [{ userID: String, money: { type: Number, default: 0 } }],
    wildcards: [{ trigger: String, content: String }],
  },
  { timestamps: true }
);

export const SettingsModel: Model<ISettings> = model(
  "Settings",
  SettingsSchema
) as unknown as Model<ISettings>;
