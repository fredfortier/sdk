import { RadarError } from './RadarError';
import { contractWrappersErrorToHumanReadableError,
  exchangeContractErrorToHumanReadableError } from './ZeroExErrors';

export const ErrorFormatter = {
  formatRadarError(error: Error) {
    const radarErrorMessage =
      contractWrappersErrorToHumanReadableError[error.message] ||
      exchangeContractErrorToHumanReadableError[error.message];

    if (radarErrorMessage) {
      throw new RadarError(radarErrorMessage);
    }
   throw error;
  }
};
