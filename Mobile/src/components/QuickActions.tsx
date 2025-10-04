import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Card, Title, Paragraph} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {useTheme} from '../contexts/ThemeContext';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  onPress: () => void;
}

const QuickActions: React.FC = () => {
  const {theme} = useTheme();

  const quickActions: QuickAction[] = [
    {
      id: 'payment',
      title: 'Make Payment',
      description: 'Pay your credit card bills',
      icon: 'payment',
      color: theme.colors.primary,
      onPress: () => {
        // Navigate to payment screen
        console.log('Make Payment pressed');
      },
    },
    {
      id: 'analysis',
      title: 'Credit Analysis',
      description: 'View detailed credit insights',
      icon: 'analytics',
      color: theme.colors.info,
      onPress: () => {
        // Navigate to credit analysis screen
        console.log('Credit Analysis pressed');
      },
    },
    {
      id: 'recommendations',
      title: 'AI Tips',
      description: 'Get personalized recommendations',
      icon: 'lightbulb',
      color: theme.colors.warning,
      onPress: () => {
        // Navigate to recommendations screen
        console.log('AI Tips pressed');
      },
    },
    {
      id: 'education',
      title: 'Learn',
      description: 'Financial education content',
      icon: 'school',
      color: theme.colors.secondary,
      onPress: () => {
        // Navigate to education screen
        console.log('Learn pressed');
      },
    },
  ];

  return (
    <Card style={[styles.card, {backgroundColor: theme.colors.surface}]}>
      <Card.Content>
        <Title style={[styles.title, {color: theme.colors.text}]}>
          Quick Actions
        </Title>
        <View style={styles.actionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={[styles.actionItem, {backgroundColor: action.color + '10'}]}
              onPress={action.onPress}
              activeOpacity={0.7}>
              <View style={[styles.actionIcon, {backgroundColor: action.color}]}>
                <Icon name={action.icon} size={24} color={theme.colors.surface} />
              </View>
              <Paragraph style={[styles.actionTitle, {color: theme.colors.text}]}>
                {action.title}
              </Paragraph>
              <Paragraph style={[styles.actionDescription, {color: theme.colors.textSecondary}]}>
                {action.description}
              </Paragraph>
            </TouchableOpacity>
          ))}
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionItem: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default QuickActions;
