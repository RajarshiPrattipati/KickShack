import getMenuItems from './menuItems'
import locales from './locales'
import routes from './routes'
import themes from './themes'
import grants from './grants'

const config = {
  firebase_config: {
    apiKey: "AIzaSyAuptJSdlTyPcNPzpfP5FxlawtCgtE61eo",
    authDomain: "kickshack-d6650.firebaseapp.com",
    databaseURL: "https://kickshack-d6650.firebaseio.com",
    projectId: "kickshack-d6650",
    storageBucket: "kickshack-d6650.appspot.com",
    messagingSenderId: "1064607114282"

  },
  firebase_config_dev: {
    apiKey: "AIzaSyDTD3byhhThnysyYiBQdLkKqDEHDB9q40s",
    authDomain: "kickshackdev.firebaseapp.com",
    databaseURL: "https://kickshackdev.firebaseio.com",
    projectId: "kickshackdev",
    storageBucket: "kickshackdev.appspot.com",
    messagingSenderId: "760764660486"

  },
  firebase_providers: [
    'google.com',
    'facebook.com',
    'twitter.com',
    'github.com',
    'password',
    'phone'
  ],
  initial_state: {
    themeSource: {
      isNightModeOn: true,
      source: 'light'
    },
    locale: 'en'
  },
  drawer_width: 256,
  locales,
  themes,
  grants,
  routes,
  getMenuItems,
  firebaseLoad: () => import('./firebase'),
}

export default config
