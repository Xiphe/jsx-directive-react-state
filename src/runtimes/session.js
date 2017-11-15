import SessionDirective, { bootstrap as sessionBootstrap, Provider } from '../stateProviders/session';
import { registerProvider } from '../StateProviderDirective';
import { createBootstrap } from './helpers';

if (Provider) {
  registerProvider(Provider);
}

export default SessionDirective;
export const bootstrap = createBootstrap('session', sessionBootstrap);
