import { EndpointConfig, NetwordId } from './types';

export const RADAR_RELAY_ENDPOINTS = (network: NetwordId): EndpointConfig => {
  switch (network) {
    case NetwordId.Mainnet:
      return {
        radarRestEndpoint: 'https://api-stage.rrdev.io/v0/',
        radarWebsocketEndpoint: 'wss://api-stage.rrdev.io/ws'
      };
    case NetwordId.Kovan:
      return {
        radarRestEndpoint: 'https://api-beta.rrdev.io/v0',
        radarWebsocketEndpoint: 'wss://api-beta.rrdev.io/ws',
      };
    default:
      throw new Error(`Unsupported Network: ${NetwordId[network] || 'Unknown'}`);
  }
};
