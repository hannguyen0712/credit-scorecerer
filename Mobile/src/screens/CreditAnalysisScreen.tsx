import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {Card, Title, Paragraph, ProgressBar, Chip, Button} from 'react-native-paper';
import {LineChart} from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useQuery} from 'react-query';

import {useTheme} from '../contexts/ThemeContext';
import {CreditService} from '../services/CreditService';
import CreditScoreCard from '../components/CreditScoreCard';

const CreditAnalysisScreen: React.FC = () => {
  const {theme} = useTheme();

  const {
    data: creditScore,
    isLoading: isCreditLoading,
    refetch: refetchCredit,
  } = useQuery('creditScore', CreditService.getCreditScore);

  const {
    data: creditCards,
    isLoading: isCardsLoading,
    refetch: refetchCards,
  } = useQuery('creditCards', CreditService.getCreditCards);

  const {
    data: utilization,
    isLoading: isUtilizationLoading,
    refetch: refetchUtilization,
  } = useQuery('utilization', CreditService.getCreditUtilization);

  const isRefreshing = isCreditLoading || isCardsLoading || isUtilizationLoading;

  const onRefresh = () => {
    refetchCredit();
    refetchCards();
    refetchUtilization();
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
  };

  const scoreHistoryData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [680, 695, 710, 720, 715, 720],
        color: (opacity = 1) => `rgba(46, 125, 50, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  return (
    <ScrollView
      style={[styles.container, {backgroundColor: theme.colors.background}]}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }>
      {/* Credit Score Overview */}
      {creditScore && <CreditScoreCard creditScore={creditScore} />}

      {/* Score History Chart */}
      <Card style={[styles.card, {backgroundColor: theme.colors.surface}]}>
        <Card.Content>
          <View style={styles.chartHeader}>
            <Icon name="trending-up" size={24} color={theme.colors.primary} />
            <Title style={[styles.chartTitle, {color: theme.colors.text}]}>
              Score History
            </Title>
          </View>
          <LineChart
            data={scoreHistoryData}
            width={300}
            height={200}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </Card.Content>
      </Card>

      {/* Credit Cards Overview */}
      {creditCards && (
        <Card style={[styles.card, {backgroundColor: theme.colors.surface}]}>
          <Card.Content>
            <Title style={[styles.cardTitle, {color: theme.colors.text}]}>
              Credit Cards
            </Title>
            {creditCards.map((card) => (
              <View key={card.id} style={styles.cardItem}>
                <View style={styles.cardHeader}>
                  <View>
                    <Paragraph style={[styles.cardName, {color: theme.colors.text}]}>
                      {card.name}
                    </Paragraph>
                    <Paragraph style={[styles.cardIssuer, {color: theme.colors.textSecondary}]}>
                      {card.issuer}
                    </Paragraph>
                  </View>
                  <Chip
                    style={[
                      styles.statusChip,
                      {backgroundColor: card.isActive ? theme.colors.success + '20' : theme.colors.error + '20'},
                    ]}
                    textStyle={{
                      color: card.isActive ? theme.colors.success : theme.colors.error,
                    }}>
                    {card.isActive ? 'Active' : 'Inactive'}
                  </Chip>
                </View>

                <View style={styles.cardDetails}>
                  <View style={styles.detailRow}>
                    <Paragraph style={[styles.detailLabel, {color: theme.colors.textSecondary}]}>
                      Balance
                    </Paragraph>
                    <Paragraph style={[styles.detailValue, {color: theme.colors.text}]}>
                      ${card.currentBalance.toLocaleString()}
                    </Paragraph>
                  </View>
                  <View style={styles.detailRow}>
                    <Paragraph style={[styles.detailLabel, {color: theme.colors.textSecondary}]}>
                      Credit Limit
                    </Paragraph>
                    <Paragraph style={[styles.detailValue, {color: theme.colors.text}]}>
                      ${card.creditLimit.toLocaleString()}
                    </Paragraph>
                  </View>
                  <View style={styles.detailRow}>
                    <Paragraph style={[styles.detailLabel, {color: theme.colors.textSecondary}]}>
                      Available Credit
                    </Paragraph>
                    <Paragraph style={[styles.detailValue, {color: theme.colors.success}]}>
                      ${card.availableCredit.toLocaleString()}
                    </Paragraph>
                  </View>
                </View>

                <View style={styles.utilizationContainer}>
                  <Paragraph style={[styles.utilizationLabel, {color: theme.colors.textSecondary}]}>
                    Utilization: {((card.currentBalance / card.creditLimit) * 100).toFixed(1)}%
                  </Paragraph>
                  <ProgressBar
                    progress={card.currentBalance / card.creditLimit}
                    color={card.currentBalance / card.creditLimit > 0.3 ? theme.colors.error : theme.colors.success}
                    style={styles.utilizationBar}
                  />
                </View>

                <View style={styles.cardActions}>
                  <Button
                    mode="outlined"
                    compact
                    style={styles.actionButton}>
                    View Details
                  </Button>
                  <Button
                    mode="contained"
                    compact
                    style={[styles.actionButton, {backgroundColor: theme.colors.primary}]}>
                    Make Payment
                  </Button>
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>
      )}

      {/* Credit Utilization Analysis */}
      {utilization && (
        <Card style={[styles.card, {backgroundColor: theme.colors.surface}]}>
          <Card.Content>
            <Title style={[styles.cardTitle, {color: theme.colors.text}]}>
              Utilization Analysis
            </Title>
            {utilization.map((item, index) => (
              <View key={index} style={styles.utilizationItem}>
                <View style={styles.utilizationHeader}>
                  <Paragraph style={[styles.utilizationCard, {color: theme.colors.text}]}>
                    Card {item.cardId}
                  </Paragraph>
                  <Paragraph style={[styles.utilizationPercent, {color: theme.colors.text}]}>
                    {item.utilization}%
                  </Paragraph>
                </View>
                <ProgressBar
                  progress={item.utilization / 100}
                  color={item.utilization > 30 ? theme.colors.error : theme.colors.success}
                  style={styles.utilizationProgress}
                />
                <Paragraph style={[styles.utilizationAction, {color: theme.colors.textSecondary}]}>
                  {item.recommendedAction}
                </Paragraph>
                <Chip
                  icon={item.impactOnScore === 'positive' ? 'trending-up' : 'trending-down'}
                  style={[
                    styles.impactChip,
                    {
                      backgroundColor: item.impactOnScore === 'positive'
                        ? theme.colors.success + '20'
                        : theme.colors.error + '20',
                    },
                  ]}
                  textStyle={{
                    color: item.impactOnScore === 'positive' ? theme.colors.success : theme.colors.error,
                  }}>
                  {item.impactOnScore === 'positive' ? 'Good Impact' : 'Needs Attention'}
                </Chip>
              </View>
            ))}
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
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  cardItem: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardIssuer: {
    fontSize: 14,
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  cardDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  utilizationContainer: {
    marginBottom: 12,
  },
  utilizationLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  utilizationBar: {
    height: 6,
    borderRadius: 3,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  utilizationItem: {
    marginBottom: 16,
  },
  utilizationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  utilizationCard: {
    fontSize: 14,
    fontWeight: '600',
  },
  utilizationPercent: {
    fontSize: 14,
    fontWeight: '600',
  },
  utilizationProgress: {
    height: 6,
    borderRadius: 3,
    marginBottom: 8,
  },
  utilizationAction: {
    fontSize: 12,
    marginBottom: 8,
  },
  impactChip: {
    alignSelf: 'flex-start',
  },
});

export default CreditAnalysisScreen;

