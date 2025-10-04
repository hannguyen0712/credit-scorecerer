import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Card, Title, Paragraph, ProgressBar, Chip} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {CircularProgress} from 'react-native-circular-progress';

import {useTheme} from '../contexts/ThemeContext';
import {CreditScore} from '../types/Credit';

interface CreditScoreCardProps {
  creditScore: CreditScore;
}

const CreditScoreCard: React.FC<CreditScoreCardProps> = ({creditScore}) => {
  const {theme} = useTheme();

  const getScoreColor = (score: number) => {
    if (score >= 750) return theme.colors.success;
    if (score >= 700) return theme.colors.info;
    if (score >= 650) return theme.colors.warning;
    return theme.colors.error;
  };

  const getScoreLabel = (score: number) => {
    if (score >= 750) return 'Excellent';
    if (score >= 700) return 'Good';
    if (score >= 650) return 'Fair';
    if (score >= 600) return 'Poor';
    return 'Very Poor';
  };

  const scoreColor = getScoreColor(creditScore.score);
  const scoreLabel = getScoreLabel(creditScore.score);
  const progress = creditScore.score / 850; // Assuming max score is 850

  return (
    <Card style={[styles.card, {backgroundColor: theme.colors.surface}]}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Icon name="credit-card" size={24} color={theme.colors.primary} />
            <Title style={[styles.title, {color: theme.colors.text}]}>
              Credit Score
            </Title>
          </View>
          <Chip
            icon="trending-up"
            style={[styles.scoreChip, {backgroundColor: scoreColor + '20'}]}
            textStyle={{color: scoreColor}}>
            {scoreLabel}
          </Chip>
        </View>

        <View style={styles.scoreContainer}>
          <CircularProgress
            size={120}
            width={8}
            fill={(creditScore.score / 850) * 100}
            tintColor={scoreColor}
            backgroundColor={theme.colors.border}
            rotation={0}
            lineCap="round">
            {() => (
              <View style={styles.scoreContent}>
                <Title style={[styles.scoreText, {color: theme.colors.text}]}>
                  {creditScore.score}
                </Title>
                <Paragraph style={[styles.scoreRange, {color: theme.colors.textSecondary}]}>
                  / 850
                </Paragraph>
              </View>
            )}
          </CircularProgress>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Paragraph style={[styles.detailLabel, {color: theme.colors.textSecondary}]}>
              Last Updated
            </Paragraph>
            <Paragraph style={[styles.detailValue, {color: theme.colors.text}]}>
              {new Date(creditScore.lastUpdated).toLocaleDateString()}
            </Paragraph>
          </View>
          <View style={styles.detailItem}>
            <Paragraph style={[styles.detailLabel, {color: theme.colors.textSecondary}]}>
              Provider
            </Paragraph>
            <Paragraph style={[styles.detailValue, {color: theme.colors.text}]}>
              {creditScore.provider}
            </Paragraph>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <Paragraph style={[styles.progressLabel, {color: theme.colors.textSecondary}]}>
            Score Range: {creditScore.range.min} - {creditScore.range.max}
          </Paragraph>
          <ProgressBar
            progress={progress}
            color={scoreColor}
            style={styles.progressBar}
          />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  scoreChip: {
    alignSelf: 'flex-start',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreContent: {
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  scoreRange: {
    fontSize: 14,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressLabel: {
    fontSize: 12,
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
});

export default CreditScoreCard;

