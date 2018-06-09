import { RadarEndpointConfig, NetwordId } from './types';

export const RADAR_RELAY_ENDPOINTS = (network: NetwordId): RadarEndpointConfig => {
  switch (network) {
    case NetwordId.Mainnet:
      return {
        endpoint: 'https://api-stage.rrdev.io/v0/',
        websocketEndpoint: 'wss://api-stage.rrdev.io/ws'
      };
    case NetwordId.Kovan:
      return {
        endpoint: 'https://api-beta.rrdev.io/v0',
        websocketEndpoint: 'wss://api-beta.rrdev.io/ws',
      };
    default:
      throw new Error(`Unsupported Network: ${NetwordId[network] || 'Unknown'}`);
  }
};
