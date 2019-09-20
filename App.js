import { Sentry } from 'react-native-sentry';
import DeviceInfo from 'react-native-device-info';
import App from './src/App';

Sentry.config('https://8041e5db2d60461795bcbc5296f3bcec@sentry.io/1322782', {
  release: DeviceInfo.getReadableVersion(),
  serverName: DeviceInfo.getUniqueID(),
}).install();

export default App;
