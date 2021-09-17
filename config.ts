import { Role, User } from "discord.js";

import { CommandData } from "./src/types/command";

const isOwner = (user: User): boolean => {
  return ["403668506287144981", "188988455554908160"].includes(user.id);
};

export interface IConfig {
  isOwner: (user: User) => boolean;
  permLevels: {
    guildOnly?: boolean;
    level: number;
    name: string;
    check: (data: CommandData | undefined | null) => boolean | undefined;
  }[];
}

export const config: IConfig = {
  isOwner,
  permLevels: [
    {
      level: 0,
      name: "User",
      check: () => true,
    },
    {
      level: 2,
      name: "Helper",
      check: (data): boolean => {
        let helperRole: Role | null;
        if (data && data.guild) {
          helperRole = data.guild.roles.resolve(data.settings.roles.helper);
        } else if (data?.member && data?.member.guild) {
          helperRole = data?.member.guild.roles.resolve(
            data.member.settings.roles.helper
          );
        } else return false;
        return <boolean>(
          (helperRole &&
            ((data && data.member && data.member.roles.cache.has(helperRole.id)) ||
              (data.member && data.member.roles.cache.has(helperRole.id))))
        );
      },
    },
    {
      level: 3,
      name: "Moderator",
      check: (data): boolean => {
        let modRole: Role | null;
        if (data && data.guild) {
          modRole = data.guild.roles.resolve(data.settings.roles.moderator);
        } else if (data?.member && data.guild) {
          modRole = data?.member.guild.roles.resolve(
            data?.member.settings.roles.moderator
          );
        } else return false;
        return Boolean(
          modRole &&
            ((data && data.member && data.member.roles.cache.has(modRole.id)) ||
              (data?.member && data?.member.roles.cache.has(modRole.id)))
        );
      },
    },
    {
      level: 4,
      name: "Administrator",
      check: (data): boolean => {
        let admRole: Role | null;
        if (data && data.guild) {
          admRole = data.guild.roles.resolve(data.settings.roles.admin);
        } else if (data && data.guild) {
          admRole = data.guild.roles.resolve(data.settings.roles.admin);
        } else return false;
        return Boolean(
          (data && data.member && data.member.permissions.has("MANAGE_GUILD")) ||
            (data?.member && data?.member.permissions.has("MANAGE_GUILD")) ||
            (admRole &&
              ((data && data.member && data.member.roles.cache.has(admRole.id)) ||
                (data?.member && data?.member.roles.cache.has(admRole.id))))
        );
      },
    },
    {
      level: 5,
      name: "Server Owner",
      check: (data) =>
        Boolean(
          (data && data.member && data.guild?.ownerId === data.author.id) ||
            (data?.member && data?.member.guild.ownerId === data?.member.id)
        ),
    },
    {
      level: 10,
      name: "Bot Owner",
      check: (data) => isOwner(data!.author!),
    },
  ],
};
