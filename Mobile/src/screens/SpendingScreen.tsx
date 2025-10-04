import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import {Card, Title, Paragraph, Button, Chip, TextInput} from 'react-native-paper';
import {PieChart, BarChart} from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useQuery} from 'react-query';

import {useTheme} from '../contexts/ThemeContext';
import {CreditService} from '../services/CreditService';

const {width} = Dimensions.get('window');

const SpendingScreen: React.FC = () => {
  const {theme} = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  const {
    data: spendingData,
    isLoading,
    refetch,
  } = useQuery('spendingData', CreditService.getSpendingData);

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

  const pieChartData = spendingData?.categories?.map((category: any) => ({
    name: category.name,
    population: category.spent,
    color: category.color,
    legendFontColor: theme.colors.text,
    legendFontSize: 12,
  })) || [];

  const barChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [2500, 2800, 3200, 2900, 3500, 3000],
      },
    ],
  };

  return (
    <ScrollView
      style={[styles.container, {backgroundColor: theme.colors.background}]}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}>
      
      {/* Period Selector */}
      <Card style={[styles.card, {backgroundColor: theme.colors.surface}]}>
        <Card.Content>
          <Title style={[styles.cardTitle, {color: theme.colors.text}]}>
            Spending Period
          </Title>
          <View style={styles.periodSelector}>
            {(['week', 'month', 'year'] as const).map((period) => (
              <Chip
                key={period}
                selected={selectedPeriod === period}
                onPress={() => setSelectedPeriod(period)}
                style={[
                  styles.periodChip,
                  {
                    backgroundColor: selectedPeriod === period
                      ? theme.colors.primary + '20'
                      : theme.colors.surface,
                  },
                ]}
                textStyle={{
                  color: selectedPeriod === period
                    ? theme.colors.primary
                    : theme.colors.text,
                }}>
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Chip>
            ))}
          </View>
        </Card.Content>
      </Card>

      {/* Spending Overview */}
      {spendingData && (
        <Card style={[styles.card, {backgroundColor: theme.colors.surface}]}>
          <Card.Content>
            <View style={styles.overviewHeader}>
              <Icon name="analytics" size={24} color={theme.colors.primary} />
              <Title style={[styles.cardTitle, {color: theme.colors.text}]}>
                Spending Overview
              </Title>
            </View>
            
            <View style={styles.overviewStats}>
              <View style={styles.statItem}>
                <Paragraph style={[styles.statValue, {color: theme.colors.text}]}>
                  ${spendingData.totalSpent.toLocaleString()}
                </Paragraph>
                <Paragraph style={[styles.statLabel, {color: theme.colors.textSecondary}]}>
                  Total Spent
                </Paragraph>
              </View>
              <View style={styles.statItem}>
                <Paragraph style={[styles.statValue, {color: theme.colors.success}]}>
                  ${spendingData.budget.toLocaleString()}
                </Paragraph>
                <Paragraph style={[styles.statLabel, {color: theme.colors.textSecondary}]}>
                  Budget
                </Paragraph>
              </View>
              <View style={styles.statItem}>
                <Paragraph style={[
                  styles.statValue,
                  {color: spendingData.totalSpent > spendingData.budget ? theme.colors.error : theme.colors.success}
                ]}>
                  {spendingData.budget > 0 
                    ? `${((spendingData.totalSpent / spendingData.budget) * 100).toFixed(0)}%`
                    : '0%'
                  }
                </Paragraph>
                <Paragraph style={[styles.statLabel, {color: theme.colors.textSecondary}]}>
                  Used
                </Paragraph>
              </View>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Spending by Category Chart */}
      {pieChartData.length > 0 && (
        <Card style={[styles.card, {backgroundColor: theme.colors.surface}]}>
          <Card.Content>
            <Title style={[styles.cardTitle, {color: theme.colors.text}]}>
              Spending by Category
            </Title>
            <PieChart
              data={pieChartData}
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

      {/* Monthly Trend Chart */}
      <Card style={[styles.card, {backgroundColor: theme.colors.surface}]}>
        <Card.Content>
          <Title style={[styles.cardTitle, {color: theme.colors.text}]}>
            Monthly Spending Trend
          </Title>
          <BarChart
            data={barChartData}
            width={width - 64}
            height={200}
            chartConfig={chartConfig}
            style={styles.chart}
            showValuesOnTopOfBars
            yAxisLabel="$"
            yAxisSuffix=""
          />
        </Card.Content>
      </Card>

      {/* Category Breakdown */}
      {spendingData?.categories && (
        <Card style={[styles.card, {backgroundColor: theme.colors.surface}]}>
          <Card.Content>
            <Title style={[styles.cardTitle, {color: theme.colors.text}]}>
              Category Breakdown
            </Title>
            {spendingData.categories.map((category: any, index: number) => (
              <View key={index} style={styles.categoryItem}>
                <View style={styles.categoryHeader}>
                  <View style={styles.categoryInfo}>
                    <View style={[styles.categoryColor, {backgroundColor: category.color}]} />
                    <Paragraph style={[styles.categoryName, {color: theme.colors.text}]}>
                      {category.name}
                    </Paragraph>
                  </View>
                  <View style={styles.categoryAmounts}>
                    <Paragraph style={[styles.categorySpent, {color: theme.colors.text}]}>
                      ${category.spent.toLocaleString()}
                    </Paragraph>
                    <Paragraph style={[styles.categoryBudget, {color: theme.colors.textSecondary}]}>
                      / ${category.budget.toLocaleString()}
                    </Paragraph>
                  </View>
                </View>
                
                <View style={styles.categoryProgress}>
                  <View style={styles.progressInfo}>
                    <Paragraph style={[styles.progressLabel, {color: theme.colors.textSecondary}]}>
                      {category.budget > 0 
                        ? `${((category.spent / category.budget) * 100).toFixed(0)}% used`
                        : 'No budget set'
                      }
                    </Paragraph>
                    <Paragraph style={[
                      styles.progressRemaining,
                      {color: category.spent > category.budget ? theme.colors.error : theme.colors.success}
                    ]}>
                      {category.spent > category.budget 
                        ? `Over by $${(category.spent - category.budget).toLocaleString()}`
                        : `$${(category.budget - category.spent).toLocaleString()} remaining`
                      }
                    </Paragraph>
                  </View>
                  <View style={styles.progressBarContainer}>
                    <View style={[
                      styles.progressBar,
                      {
                        width: `${Math.min((category.spent / category.budget) * 100, 100)}%`,
                        backgroundColor: category.spent > category.budget ? theme.colors.error : category.color,
                      }
                    ]} />
                  </View>
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>
      )}

      {/* Quick Actions */}
      <Card style={[styles.card, {backgroundColor: theme.colors.surface}]}>
        <Card.Content>
          <Title style={[styles.cardTitle, {color: theme.colors.text}]}>
            Quick Actions
          </Title>
          <View style={styles.quickActions}>
            <Button
              mode="outlined"
              icon="plus"
              style={styles.actionButton}
              onPress={() => console.log('Add transaction')}>
              Add Transaction
            </Button>
            <Button
              mode="outlined"
              icon="tune"
              style={styles.actionButton}
              onPress={() => console.log('Set budget')}>
              Set Budget
            </Button>
            <Button
              mode="outlined"
              icon="analytics"
              style={styles.actionButton}
              onPress={() => console.log('View insights')}>
              View Insights
            </Button>
          </View>
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
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  periodSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  periodChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  overviewStats: {
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
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  categoryItem: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  categoryAmounts: {
    alignItems: 'flex-end',
  },
  categorySpent: {
    fontSize: 16,
    fontWeight: '600',
  },
  categoryBudget: {
    fontSize: 12,
  },
  categoryProgress: {
    marginTop: 8,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 12,
  },
  progressRemaining: {
    fontSize: 12,
    fontWeight: '500',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
    marginBottom: 8,
  },
});

export default SpendingScreen;
