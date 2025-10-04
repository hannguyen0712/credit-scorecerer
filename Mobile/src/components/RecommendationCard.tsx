import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Card, Title, Paragraph, Button, Chip, ProgressBar} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {useTheme} from '../contexts/ThemeContext';
import {Recommendation} from '../types/Recommendation';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onAction?: (recommendation: Recommendation) => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onAction,
}) => {
  const {theme} = useTheme();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return theme.colors.error;
      case 'medium':
        return theme.colors.warning;
      case 'low':
        return theme.colors.info;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return 'payment';
      case 'usage':
        return 'credit-card';
      case 'timing':
        return 'schedule';
      case 'optimization':
        return 'tune';
      case 'education':
        return 'school';
      default:
        return 'lightbulb';
    }
  };

  const priorityColor = getPriorityColor(recommendation.priority);
  const typeIcon = getTypeIcon(recommendation.type);

  return (
    <Card style={[styles.card, {backgroundColor: theme.colors.surface}]}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Icon name={typeIcon} size={20} color={theme.colors.primary} />
            <Title style={[styles.title, {color: theme.colors.text}]}>
              {recommendation.title}
            </Title>
          </View>
          <Chip
            style={[styles.priorityChip, {backgroundColor: priorityColor + '20'}]}
            textStyle={{color: priorityColor, fontSize: 10}}>
            {recommendation.priority.toUpperCase()}
          </Chip>
        </View>

        <Paragraph style={[styles.description, {color: theme.colors.textSecondary}]}>
          {recommendation.description}
        </Paragraph>

        <View style={styles.impactContainer}>
          <View style={styles.impactItem}>
            <Icon name="trending-up" size={16} color={theme.colors.success} />
            <Paragraph style={[styles.impactText, {color: theme.colors.text}]}>
              +{recommendation.impact.creditScore} pts
            </Paragraph>
          </View>
          <View style={styles.impactItem}>
            <Icon name="savings" size={16} color={theme.colors.success} />
            <Paragraph style={[styles.impactText, {color: theme.colors.text}]}>
              ${recommendation.impact.savings}
            </Paragraph>
          </View>
          <View style={styles.impactItem}>
            <Icon name="schedule" size={16} color={theme.colors.info} />
            <Paragraph style={[styles.impactText, {color: theme.colors.text}]}>
              {recommendation.impact.timeframe}
            </Paragraph>
          </View>
        </View>

        <View style={styles.confidenceContainer}>
          <Paragraph style={[styles.confidenceLabel, {color: theme.colors.textSecondary}]}>
            AI Confidence: {recommendation.aiConfidence}%
          </Paragraph>
          <ProgressBar
            progress={recommendation.aiConfidence / 100}
            color={theme.colors.primary}
            style={styles.confidenceBar}
          />
        </View>

        <Button
          mode="contained"
          onPress={() => onAction?.(recommendation)}
          style={[styles.actionButton, {backgroundColor: theme.colors.primary}]}
          contentStyle={styles.actionButtonContent}>
          {recommendation.action}
        </Button>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  priorityChip: {
    alignSelf: 'flex-start',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  impactContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(46, 125, 50, 0.05)',
    borderRadius: 8,
  },
  impactItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  impactText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  confidenceContainer: {
    marginBottom: 16,
  },
  confidenceLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  confidenceBar: {
    height: 4,
    borderRadius: 2,
  },
  actionButton: {
    borderRadius: 8,
  },
  actionButtonContent: {
    paddingVertical: 4,
  },
});

export default RecommendationCard;

