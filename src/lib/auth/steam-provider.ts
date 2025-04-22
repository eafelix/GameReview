import { Provider } from "next-auth/providers";
import { User } from "next-auth";

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

interface SteamAuthorization {
  url: string;
  params: Record<string, string>;
}

export default function SteamProvider(): Provider {
  const nextAuthUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  
  return {
    id: "steam",
    name: "Steam",
    type: "oauth",
    authorization: {
      url: "https://steamcommunity.com/openid/login",
      params: {
        "openid.ns": "http://specs.openid.net/auth/2.0",
        "openid.mode": "checkid_setup",
        "openid.return_to": `${nextAuthUrl}/api/auth/callback/steam`,
        "openid.realm": nextAuthUrl,
        "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
        "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select",
      },
    } as SteamAuthorization,
    token: "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002",
    userinfo: "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002",
    profile(profile: Record<string, unknown>): User & { id: string } {
      const steamProfile = profile as SteamProfile;
      return {
        id: steamProfile.steamid,
        name: steamProfile.personaname,
        email: null,
        image: steamProfile.avatarfull,
      };
    },
    options: {
      clientId: process.env.STEAM_CLIENT_ID,
      clientSecret: process.env.STEAM_CLIENT_SECRET,
    },
  };
} 