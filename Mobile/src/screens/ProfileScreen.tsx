import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {Card, Title, Paragraph, Button, Switch, List, Avatar, Divider} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';

import {useAuth} from '../contexts/AuthContext';
import {useTheme} from '../contexts/ThemeContext';

const ProfileScreen: React.FC = () => {
  const {user, logout, updateProfile} = useAuth();
  const {theme, isDark, toggleTheme} = useTheme();
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState({
    paymentReminders: true,
    creditScoreUpdates: true,
    spendingAlerts: false,
    educationalContent: true,
  });

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleEditProfile = () => {
    // Navigate to edit profile screen
    console.log('Edit profile');
  };

  const handleSecuritySettings = () => {
    // Navigate to security settings
    console.log('Security settings');
  };

  const handlePrivacySettings = () => {
    // Navigate to privacy settings
    console.log('Privacy settings');
  };

  const handleSupport = () => {
    // Navigate to support
    console.log('Support');
  };

  const handleAbout = () => {
    // Navigate to about
    console.log('About');
  };

  return (
    <ScrollView style={[styles.container, {backgroundColor: theme.colors.background}]}>
      {/* Profile Header */}
      <Card style={[styles.profileCard, {backgroundColor: theme.colors.surface}]}>
        <Card.Content>
          <View style={styles.profileHeader}>
            <Avatar.Text
              size={80}
              label={`${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`}
              style={[styles.avatar, {backgroundColor: theme.colors.primary}]}
            />
            <View style={styles.profileInfo}>
              <Title style={[styles.profileName, {color: theme.colors.text}]}>
                {user?.firstName} {user?.lastName}
              </Title>
              <Paragraph style={[styles.profileEmail, {color: theme.colors.textSecondary}]}>
                {user?.email}
              </Paragraph>
              <Button
                mode="outlined"
                onPress={handleEditProfile}
                style={styles.editButton}
                contentStyle={styles.editButtonContent}>
                Edit Profile
              </Button>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Account Settings */}
      <Card style={[styles.settingsCard, {backgroundColor: theme.colors.surface}]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, {color: theme.colors.text}]}>
            Account Settings
          </Title>
          
          <List.Item
            title="Security Settings"
            description="Password, 2FA, and security preferences"
            left={(props) => <List.Icon {...props} icon="security" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={handleSecuritySettings}
            titleStyle={{color: theme.colors.text}}
            descriptionStyle={{color: theme.colors.textSecondary}}
          />
          
          <List.Item
            title="Privacy Settings"
            description="Data sharing and privacy controls"
            left={(props) => <List.Icon {...props} icon="privacy-tip" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={handlePrivacySettings}
            titleStyle={{color: theme.colors.text}}
            descriptionStyle={{color: theme.colors.textSecondary}}
          />
        </Card.Content>
      </Card>

      {/* Notifications */}
      <Card style={[styles.settingsCard, {backgroundColor: theme.colors.surface}]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, {color: theme.colors.text}]}>
            Notifications
          </Title>
          
          <List.Item
            title="Payment Reminders"
            description="Get notified about upcoming payments"
            left={(props) => <List.Icon {...props} icon="payment" />}
            right={() => (
              <Switch
                value={notifications.paymentReminders}
                onValueChange={() => handleNotificationToggle('paymentReminders')}
                color={theme.colors.primary}
              />
            )}
            titleStyle={{color: theme.colors.text}}
            descriptionStyle={{color: theme.colors.textSecondary}}
          />
          
          <List.Item
            title="Credit Score Updates"
            description="Notifications when your score changes"
            left={(props) => <List.Icon {...props} icon="trending-up" />}
            right={() => (
              <Switch
                value={notifications.creditScoreUpdates}
                onValueChange={() => handleNotificationToggle('creditScoreUpdates')}
                color={theme.colors.primary}
              />
            )}
            titleStyle={{color: theme.colors.text}}
            descriptionStyle={{color: theme.colors.textSecondary}}
          />
          
          <List.Item
            title="Spending Alerts"
            description="Alerts for unusual spending patterns"
            left={(props) => <List.Icon {...props} icon="warning" />}
            right={() => (
              <Switch
                value={notifications.spendingAlerts}
                onValueChange={() => handleNotificationToggle('spendingAlerts')}
                color={theme.colors.primary}
              />
            )}
            titleStyle={{color: theme.colors.text}}
            descriptionStyle={{color: theme.colors.textSecondary}}
          />
          
          <List.Item
            title="Educational Content"
            description="Tips and financial education updates"
            left={(props) => <List.Icon {...props} icon="school" />}
            right={() => (
              <Switch
                value={notifications.educationalContent}
                onValueChange={() => handleNotificationToggle('educationalContent')}
                color={theme.colors.primary}
              />
            )}
            titleStyle={{color: theme.colors.text}}
            descriptionStyle={{color: theme.colors.textSecondary}}
          />
        </Card.Content>
      </Card>

      {/* App Settings */}
      <Card style={[styles.settingsCard, {backgroundColor: theme.colors.surface}]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, {color: theme.colors.text}]}>
            App Settings
          </Title>
          
          <List.Item
            title="Dark Mode"
            description={isDark ? 'Dark theme enabled' : 'Light theme enabled'}
            left={(props) => <List.Icon {...props} icon="dark-mode" />}
            right={() => (
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                color={theme.colors.primary}
              />
            )}
            titleStyle={{color: theme.colors.text}}
            descriptionStyle={{color: theme.colors.textSecondary}}
          />
        </Card.Content>
      </Card>

      {/* Support & Info */}
      <Card style={[styles.settingsCard, {backgroundColor: theme.colors.surface}]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, {color: theme.colors.text}]}>
            Support & Information
          </Title>
          
          <List.Item
            title="Help & Support"
            description="Get help with the app"
            left={(props) => <List.Icon {...props} icon="help" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={handleSupport}
            titleStyle={{color: theme.colors.text}}
            descriptionStyle={{color: theme.colors.textSecondary}}
          />
          
          <List.Item
            title="About"
            description="App version and information"
            left={(props) => <List.Icon {...props} icon="info" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={handleAbout}
            titleStyle={{color: theme.colors.text}}
            descriptionStyle={{color: theme.colors.textSecondary}}
          />
        </Card.Content>
      </Card>

      {/* Sign Out */}
      <Card style={[styles.settingsCard, {backgroundColor: theme.colors.surface}]}>
        <Card.Content>
          <Button
            mode="contained"
            onPress={handleLogout}
            style={[styles.logoutButton, {backgroundColor: theme.colors.error}]}
            contentStyle={styles.logoutButtonContent}
            icon="logout">
            Sign Out
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  profileCard: {
    marginBottom: 16,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    marginBottom: 12,
  },
  editButton: {
    alignSelf: 'flex-start',
  },
  editButtonContent: {
    paddingVertical: 4,
  },
  settingsCard: {
    marginBottom: 16,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  logoutButton: {
    borderRadius: 8,
  },
  logoutButtonContent: {
    paddingVertical: 8,
  },
});

export default ProfileScreen;

