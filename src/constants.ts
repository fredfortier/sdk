import { EndpointConfig, NetwordId } from './types';

export const RADAR_RELAY_ENDPOINTS = (network: NetwordId): EndpointConfig => {
  switch (network) {
    case NetwordId.Mainnet:
      return {
        radarRestEndpoint: 'https://api-beta.rrdev.io/v2',
        radarWebsocketEndpoint: 'wss://api-beta.rrdev.io/v2'
      };
    case NetwordId.Kovan:
      return {
        radarRestEndpoint: 'https://api.kovan.radarrelay.com/v2',
        radarWebsocketEndpoint: 'wss://ws.kovan.radarrelay.com/ws',
      };
    default:
      throw new Error(`Unsupported Network: ${NetwordId[network] || 'Unknown'}`);
  }
};
