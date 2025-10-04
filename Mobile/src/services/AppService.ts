import {Platform, PermissionsAndroid} from 'react-native';
import PushNotification from 'react-native-push-notification';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';

export const initializeApp = async (): Promise<void> => {
  try {
    // Initialize push notifications
    await initializePushNotifications();
    
    // Request necessary permissions
    await requestPermissions();
    
    // Initialize other app services
    console.log('App initialized successfully');
  } catch (error) {
    console.error('Error initializing app:', error);
  }
};

const initializePushNotifications = async (): Promise<void> => {
  PushNotification.configure({
    onRegister: function (token: any) {
      console.log('TOKEN:', token);
      // Store token for server communication
    },
    onNotification: function (notification: any) {
      console.log('NOTIFICATION:', notification);
      // Handle notification
    },
    onAction: function (notification: any) {
      console.log('ACTION:', notification.action);
      console.log('NOTIFICATION:', notification);
    },
    onRegistrationError: function (err: any) {
      console.error(err.message, err);
    },
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    popInitialNotification: true,
    requestPermissions: Platform.OS === 'ios',
  });
};

const requestPermissions = async (): Promise<void> => {
  try {
    if (Platform.OS === 'android') {
      // Request notification permission for Android 13+
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        {
          title: 'Notification Permission',
          message: 'AI Credit Optimizer needs permission to send you important updates about your credit health.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Notification permission denied');
      }
    } else {
      // Request notification permission for iOS
      const result = await request(PERMISSIONS.IOS.REMINDERS);
      if (result !== RESULTS.GRANTED) {
        console.log('Notification permission denied');
      }
    }
  } catch (error) {
    console.error('Error requesting permissions:', error);
  }
};
