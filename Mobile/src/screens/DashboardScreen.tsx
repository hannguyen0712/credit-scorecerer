import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Dimensions,
} from 'react-native';
import {Card, Title, Paragraph, Button, Chip, ProgressBar} from 'react-native-paper';
import {LineChart, PieChart} from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useQuery} from '@tanstack/react-query';

import {useAuth} from '../contexts/AuthContext';
import {useTheme} from '../contexts/ThemeContext';
import {CreditService} from '../services/CreditService';
import {RecommendationService} from '../services/RecommendationService';
import CreditScoreCard from '../components/CreditScoreCard';
import RecommendationCard from '../components/RecommendationCard';
import SpendingOverview from '../components/SpendingOverview';
import QuickActions from '../components/QuickActions';

const {width} = Dimensions.get('window');

const DashboardScreen: React.FC = () => {
  const {user} = useAuth();
  const {theme} = useTheme();

  const {
    data: creditScore,
    isLoading: isCreditLoading,
    refetch: refetchCredit,
  } = useQuery({
    queryKey: ['creditScore'],
    queryFn: CreditService.getCreditScore,
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  const {
    data: recommendations,
    isLoading: isRecommendationsLoading,
    refetch: refetchRecommendations,
  } = useQuery({
    queryKey: ['recommendations'],
    queryFn: RecommendationService.getRecommendations,
    refetchInterval: 600000, // Refetch every 10 minutes
  });

  const {
    data: spendingData,
    isLoading: isSpendingLoading,
    refetch: refetchSpending,
  } = useQuery({
    queryKey: ['spendingData'],
    queryFn: CreditService.getSpendingData,
    refetchInterval: 300000,
  });

  const isRefreshing = isCreditLoading || isRecommendationsLoading || isSpendingLoading;

  const onRefresh = () => {
    refetchCredit();
    refetchRecommendations();
    refetchSpending();
  };

  const chartConfig = {
    backgroundColor: theme.colors.surface,
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(46, 125, 50, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(33, 33, 33, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: theme.colors.primary,
    },
  };

  const spendingChartData = spendingData?.categories?.map((category: any, index: number) => ({
    name: category.name,
    population: category.spent,
    color: category.color,
    legendFontColor: theme.colors.text,
    legendFontSize: 12,
  })) || [];

  return (
    <ScrollView
      style={[styles.container, {backgroundColor: theme.colors.background}]}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }>
      {/* Welcome Section */}
      <Card style={[styles.welcomeCard, {backgroundColor: theme.colors.surface}]}>
        <Card.Content>
          <Title style={[styles.welcomeTitle, {color: theme.colors.text}]}>
            Welcome back, {user?.firstName}! 👋
          </Title>
          <Paragraph style={[styles.welcomeSubtitle, {color: theme.colors.textSecondary}]}>
            Your AI credit assistant is here to help optimize your financial health.
          </Paragraph>
        </Card.Content>
      </Card>

      {/* Credit Score Overview */}
      {creditScore && <CreditScoreCard creditScore={creditScore} />}

      {/* AI Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <Card style={[styles.card, {backgroundColor: theme.colors.surface}]}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Icon name="lightbulb" size={24} color={theme.colors.primary} />
              <Title style={[styles.cardTitle, {color: theme.colors.text}]}>
                AI Recommendations
              </Title>
            </View>
            {recommendations.slice(0, 2).map((recommendation: any) => (
              <RecommendationCard
                key={recommendation.id}
                recommendation={recommendation}
              />
            ))}
            <Button
              mode="outlined"
              onPress={() => {/* Navigate to recommendations screen */}}
              style={styles.viewAllButton}>
              View All Recommendations
            </Button>
          </Card.Content>
        </Card>
      )}

      {/* Spending Overview */}
      {spendingData && <SpendingOverview spendingData={spendingData} />}

      {/* Credit Utilization Chart */}
      {spendingData?.utilization && (
        <Card style={[styles.card, {backgroundColor: theme.colors.surface}]}>
          <Card.Content>
            <Title style={[styles.cardTitle, {color: theme.colors.text}]}>
              Credit Utilization
            </Title>
            <View style={styles.utilizationContainer}>
              <View style={styles.utilizationItem}>
                <Paragraph style={[styles.utilizationLabel, {color: theme.colors.textSecondary}]}>
                  Overall Utilization
                </Paragraph>
                <ProgressBar
                  progress={spendingData.utilization.overall / 100}
                  color={spendingData.utilization.overall > 30 ? theme.colors.error : theme.colors.success}
                  style={styles.progressBar}
                />
                <Paragraph style={[styles.utilizationValue, {color: theme.colors.text}]}>
                  {spendingData.utilization.overall.toFixed(1)}%
                </Paragraph>
              </View>
              <Chip
                icon="info"
                style={[
                  styles.utilizationChip,
                  {
                    backgroundColor: spendingData.utilization.overall > 30
                      ? theme.colors.error + '20'
                      : theme.colors.success + '20',
                  },
                ]}>
                {spendingData.utilization.overall > 30 ? 'High Risk' : 'Good'}
              </Chip>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Quick Actions */}
      <QuickActions />

      {/* Spending Categories Chart */}
      {spendingChartData.length > 0 && (
        <Card style={[styles.card, {backgroundColor: theme.colors.surface}]}>
          <Card.Content>
            <Title style={[styles.cardTitle, {color: theme.colors.text}]}>
              Spending by Category
            </Title>
            <PieChart
              data={spendingChartData}
              width={width - 64}
              height={220}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              center={[10, 10]}
              absolute
            />
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  welcomeCard: {
    marginBottom: 16,
    elevation: 2,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  viewAllButton: {
    marginTop: 16,
  },
  utilizationContainer: {
    marginTop: 16,
  },
  utilizationItem: {
    marginBottom: 16,
  },
  utilizationLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  utilizationValue: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  utilizationChip: {
    alignSelf: 'flex-start',
  },
});

export default DashboardScreen;
