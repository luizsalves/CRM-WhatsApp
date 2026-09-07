import * as signalR from "@microsoft/signalr";
import { getStoredToken } from "./api";

const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:5170/api";
const hubUrl = apiBaseUrl.replace(/\/api\/?$/, "") + "/hubs/conversations";

export function criarConexaoConversas(): signalR.HubConnection {
  return new signalR.HubConnectionBuilder()
    .withUrl(hubUrl, { accessTokenFactory: () => getStoredToken() ?? "" })
    .withAutomaticReconnect()
    .build();
}
