import { Provider } from "next-auth/providers";

export interface SteamProfile {
  steamid: string;
  communityvisibilitystate: number;
  profilestate: number;
  personaname: string;
  profileurl: string;
  avatar: string;
  avatarmedium: string;
  avatarfull: string;
  personastate: number;
  realname?: string;
  primaryclanid?: string;
  timecreated?: number;
  personastateflags?: number;
  loccountrycode?: string;
}

export default function SteamProvider(): Provider {
  return {
    id: "steam",
    name: "Steam",
    type: "oauth",
    authorization: "https://steamcommunity.com/openid/login",
    token: "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002",
    userinfo: "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002",
    profile(profile: SteamProfile) {
      return {
        id: profile.steamid,
        name: profile.personaname,
        email: null,
        image: profile.avatarfull,
      };
    },
    options: {
      clientId: process.env.STEAM_CLIENT_ID,
      clientSecret: process.env.STEAM_CLIENT_SECRET,
    },
  };
} 