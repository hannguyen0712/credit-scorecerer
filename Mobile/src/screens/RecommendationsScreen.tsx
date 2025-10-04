import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import {Card, Title, Paragraph, Button, Chip, FAB} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';

import {useTheme} from '../contexts/ThemeContext';
import {RecommendationService} from '../services/RecommendationService';
import RecommendationCard from '../components/RecommendationCard';
import {Recommendation} from '../types/Recommendation';

const RecommendationsScreen: React.FC = () => {
  const {theme} = useTheme();
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const queryClient = useQueryClient();

  const {
    data: recommendations,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['recommendations'],
    queryFn: RecommendationService.getRecommendations,
  });

  const markCompletedMutation = useMutation({
    mutationFn: RecommendationService.markRecommendationCompleted,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['recommendations']});
    },
  });

  const handleRecommendationAction = async (recommendation: Recommendation) => {
    try {
      if (recommendation.type === 'payment') {
        Alert.alert(
          'Make Payment',
          `Pay $${recommendation.impact.savings} to improve your credit score?`,
          [
            {text: 'Cancel', style: 'cancel'},
            {
              text: 'Pay Now',
              onPress: () => {
                // Navigate to payment screen or process payment
                console.log('Processing payment...');
                markCompletedMutation.mutate(recommendation.id);
              },
            },
          ]
        );
      } else if (recommendation.type === 'education') {
        // Navigate to education content
        console.log('Opening education content...');
      } else {
        // Handle other recommendation types
        console.log('Executing recommendation:', recommendation.action);
        markCompletedMutation.mutate(recommendation.id);
      }
    } catch (error) {
      console.error('Error handling recommendation:', error);
    }
  };

  const filteredRecommendations = recommendations?.filter((rec: any) => {
    if (filter === 'all') return true;
    return rec.priority === filter;
  }) || [];

  const getFilterColor = (priority: string) => {
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

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}>
        
        {/* Header */}
        <Card style={[styles.headerCard, {backgroundColor: theme.colors.surface}]}>
          <Card.Content>
            <View style={styles.headerContent}>
              <View>
                <Title style={[styles.headerTitle, {color: theme.colors.text}]}>
                  AI Recommendations
                </Title>
                <Paragraph style={[styles.headerSubtitle, {color: theme.colors.textSecondary}]}>
                  Personalized tips to optimize your credit health
                </Paragraph>
              </View>
              <Icon name="psychology" size={32} color={theme.colors.primary} />
            </View>
          </Card.Content>
        </Card>

        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          {(['all', 'high', 'medium', 'low'] as const).map((priority) => (
            <Chip
              key={priority}
              selected={filter === priority}
              onPress={() => setFilter(priority)}
              style={[
                styles.filterChip,
                {
                  backgroundColor: filter === priority
                    ? getFilterColor(priority === 'all' ? 'medium' : priority) + '20'
                    : theme.colors.surface,
                },
              ]}
              textStyle={{
                color: filter === priority
                  ? getFilterColor(priority === 'all' ? 'medium' : priority)
                  : theme.colors.text,
              }}>
              {priority === 'all' ? 'All' : priority.charAt(0).toUpperCase() + priority.slice(1)}
            </Chip>
          ))}
        </View>

        {/* Recommendations List */}
        {filteredRecommendations.length > 0 ? (
          filteredRecommendations.map((recommendation) => (
            <RecommendationCard
              key={recommendation.id}
              recommendation={recommendation}
              onAction={handleRecommendationAction}
            />
          ))
        ) : (
          <Card style={[styles.emptyCard, {backgroundColor: theme.colors.surface}]}>
            <Card.Content style={styles.emptyContent}>
              <Icon name="lightbulb-outline" size={48} color={theme.colors.textSecondary} />
              <Title style={[styles.emptyTitle, {color: theme.colors.text}]}>
                No Recommendations
              </Title>
              <Paragraph style={[styles.emptyText, {color: theme.colors.textSecondary}]}>
                {filter === 'all'
                  ? 'You\'re doing great! No recommendations at the moment.'
                  : `No ${filter} priority recommendations found.`}
              </Paragraph>
            </Card.Content>
          </Card>
        )}

        {/* AI Insights */}
        <Card style={[styles.insightsCard, {backgroundColor: theme.colors.surface}]}>
          <Card.Content>
            <View style={styles.insightsHeader}>
              <Icon name="insights" size={24} color={theme.colors.primary} />
              <Title style={[styles.insightsTitle, {color: theme.colors.text}]}>
                AI Insights
              </Title>
            </View>
            <Paragraph style={[styles.insightsText, {color: theme.colors.textSecondary}]}>
              Our AI analyzes your spending patterns, payment history, and credit utilization to provide personalized recommendations that can improve your credit score and save you money.
            </Paragraph>
            <View style={styles.insightsStats}>
              <View style={styles.statItem}>
                <Paragraph style={[styles.statValue, {color: theme.colors.primary}]}>
                  {recommendations?.length || 0}
                </Paragraph>
                <Paragraph style={[styles.statLabel, {color: theme.colors.textSecondary}]}>
                  Active Tips
                </Paragraph>
              </View>
              <View style={styles.statItem}>
                <Paragraph style={[styles.statValue, {color: theme.colors.success}]}>
                  {recommendations?.reduce((sum: number, rec: any) => sum + rec.impact.creditScore, 0) || 0}
                </Paragraph>
                <Paragraph style={[styles.statLabel, {color: theme.colors.textSecondary}]}>
                  Potential Points
                </Paragraph>
              </View>
              <View style={styles.statItem}>
                <Paragraph style={[styles.statValue, {color: theme.colors.warning}]}>
                  ${recommendations?.reduce((sum: number, rec: any) => sum + rec.impact.savings, 0) || 0}
                </Paragraph>
                <Paragraph style={[styles.statLabel, {color: theme.colors.textSecondary}]}>
                  Potential Savings
                </Paragraph>
              </View>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        icon="refresh"
        style={[styles.fab, {backgroundColor: theme.colors.primary}]}
        onPress={() => refetch()}
        label="Refresh AI Analysis"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  headerCard: {
    marginBottom: 16,
    elevation: 2,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  filterChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  emptyCard: {
    marginBottom: 16,
    elevation: 1,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  insightsCard: {
    marginTop: 16,
    elevation: 1,
  },
  insightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  insightsText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  insightsStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
});

export default RecommendationsScreen;
