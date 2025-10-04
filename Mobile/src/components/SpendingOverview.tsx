import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {Card, Title, Paragraph, ProgressBar} from 'react-native-paper';
import {PieChart} from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {useTheme} from '../contexts/ThemeContext';

const {width} = Dimensions.get('window');

interface SpendingData {
  totalSpent: number;
  budget: number;
  categories: Array<{
    name: string;
    spent: number;
    budget: number;
    color: string;
  }>;
  utilization: {
    overall: number;
    byCard: Array<{
      cardId: string;
      cardName: string;
      utilization: number;
    }>;
  };
}

interface SpendingOverviewProps {
  spendingData: SpendingData;
}

const SpendingOverview: React.FC<SpendingOverviewProps> = ({spendingData}) => {
  const {theme} = useTheme();

  const chartData = spendingData.categories.map((category) => ({
    name: category.name,
    population: category.spent,
    color: category.color,
    legendFontColor: theme.colors.text,
    legendFontSize: 12,
  }));

  const budgetProgress = spendingData.budget > 0 ? spendingData.totalSpent / spendingData.budget : 0;
  const isOverBudget = budgetProgress > 1;

  return (
    <Card style={[styles.card, {backgroundColor: theme.colors.surface}]}>
      <Card.Content>
        <View style={styles.header}>
          <Icon name="analytics" size={24} color={theme.colors.primary} />
          <Title style={[styles.title, {color: theme.colors.text}]}>
            Spending Overview
          </Title>
        </View>

        {/* Budget Progress */}
        <View style={styles.budgetContainer}>
          <View style={styles.budgetHeader}>
            <Paragraph style={[styles.budgetLabel, {color: theme.colors.textSecondary}]}>
              Monthly Budget
            </Paragraph>
            <Paragraph style={[styles.budgetAmount, {color: theme.colors.text}]}>
              ${spendingData.totalSpent.toLocaleString()} / ${spendingData.budget.toLocaleString()}
            </Paragraph>
          </View>
          <ProgressBar
            progress={Math.min(budgetProgress, 1)}
            color={isOverBudget ? theme.colors.error : theme.colors.success}
            style={styles.budgetProgress}
          />
          {isOverBudget && (
            <Paragraph style={[styles.overBudgetText, {color: theme.colors.error}]}>
              Over budget by ${(spendingData.totalSpent - spendingData.budget).toLocaleString()}
            </Paragraph>
          )}
        </View>

        {/* Spending Categories Chart */}
        {chartData.length > 0 && (
          <View style={styles.chartContainer}>
            <Title style={[styles.chartTitle, {color: theme.colors.text}]}>
              Spending by Category
            </Title>
            <PieChart
              data={chartData}
              width={width - 64}
              height={200}
              chartConfig={{
                backgroundColor: theme.colors.surface,
                backgroundGradientFrom: theme.colors.surface,
                backgroundGradientTo: theme.colors.surface,
                color: (opacity = 1) => `rgba(46, 125, 50, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(33, 33, 33, ${opacity})`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              center={[10, 10]}
              absolute
            />
          </View>
        )}

        {/* Category Breakdown */}
        <View style={styles.categoriesContainer}>
          {spendingData.categories.map((category, index) => (
            <View key={index} style={styles.categoryItem}>
              <View style={styles.categoryHeader}>
                <View style={[styles.categoryColor, {backgroundColor: category.color}]} />
                <Paragraph style={[styles.categoryName, {color: theme.colors.text}]}>
                  {category.name}
                </Paragraph>
                <Paragraph style={[styles.categoryAmount, {color: theme.colors.text}]}>
                  ${category.spent.toLocaleString()}
                </Paragraph>
              </View>
              <ProgressBar
                progress={category.budget > 0 ? category.spent / category.budget : 0}
                color={category.spent > category.budget ? theme.colors.error : theme.colors.primary}
                style={styles.categoryProgress}
              />
              <Paragraph style={[styles.categoryBudget, {color: theme.colors.textSecondary}]}>
                Budget: ${category.budget.toLocaleString()}
              </Paragraph>
            </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  budgetContainer: {
    marginBottom: 20,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  budgetLabel: {
    fontSize: 14,
  },
  budgetAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  budgetProgress: {
    height: 8,
    borderRadius: 4,
  },
  overBudgetText: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right',
  },
  chartContainer: {
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  categoriesContainer: {
    marginTop: 16,
  },
  categoryItem: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  categoryProgress: {
    height: 4,
    borderRadius: 2,
    marginBottom: 4,
  },
  categoryBudget: {
    fontSize: 12,
  },
});

export default SpendingOverview;

