import Config from 'react-native-config';

export const env = {
  appEnv: Config.APP_ENV ?? 'development',
  defaultSiteId: Config.DEFAULT_SITE_ID ?? 'default-site',
};
