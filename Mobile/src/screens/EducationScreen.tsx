import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {Card, Title, Paragraph, Button, Chip, Searchbar} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useQuery} from '@tanstack/react-query';

import {useTheme} from '../contexts/ThemeContext';
import {RecommendationService} from '../services/RecommendationService';

interface EducationContent {
  id: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  type: 'article' | 'video' | 'quiz' | 'infographic';
  isCompleted?: boolean;
}

const EducationScreen: React.FC = () => {
  const {theme} = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const {
    data: educationContent,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['educationContent'],
    queryFn: RecommendationService.getEducationalContent,
  });

  const categories = ['all', 'Credit Basics', 'Advanced Tips', 'Financial Planning', 'Credit Cards'];
  const difficulties = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredContent = educationContent?.filter((content: any) => {
    const matchesSearch = content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         content.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || content.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || content.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  }) || [];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return theme.colors.success;
      case 'Intermediate':
        return theme.colors.warning;
      case 'Advanced':
        return theme.colors.error;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article':
        return 'article';
      case 'video':
        return 'play-circle';
      case 'quiz':
        return 'quiz';
      case 'infographic':
        return 'info';
      default:
        return 'school';
    }
  };

  const handleContentPress = (content: EducationContent) => {
    console.log('Opening content:', content.title);
    // Navigate to content detail screen
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <Card style={[styles.headerCard, {backgroundColor: theme.colors.surface}]}>
          <Card.Content>
            <View style={styles.headerContent}>
              <View>
                <Title style={[styles.headerTitle, {color: theme.colors.text}]}>
                  Financial Education
                </Title>
                <Paragraph style={[styles.headerSubtitle, {color: theme.colors.textSecondary}]}>
                  Learn about credit, finances, and smart money management
                </Paragraph>
              </View>
              <Icon name="school" size={32} color={theme.colors.primary} />
            </View>
          </Card.Content>
        </Card>

        {/* Search */}
        <Searchbar
          placeholder="Search educational content..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={[styles.searchbar, {backgroundColor: theme.colors.surface}]}
        />

        {/* Filters */}
        <Card style={[styles.filterCard, {backgroundColor: theme.colors.surface}]}>
          <Card.Content>
            <Title style={[styles.filterTitle, {color: theme.colors.text}]}>
              Categories
            </Title>
            <View style={styles.filterRow}>
              {categories.map((category) => (
                <Chip
                  key={category}
                  selected={selectedCategory === category}
                  onPress={() => setSelectedCategory(category)}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor: selectedCategory === category
                        ? theme.colors.primary + '20'
                        : theme.colors.surface,
                    },
                  ]}
                  textStyle={{
                    color: selectedCategory === category
                      ? theme.colors.primary
                      : theme.colors.text,
                  }}>
                  {category}
                </Chip>
              ))}
            </View>

            <Title style={[styles.filterTitle, {color: theme.colors.text}]}>
              Difficulty
            </Title>
            <View style={styles.filterRow}>
              {difficulties.map((difficulty) => (
                <Chip
                  key={difficulty}
                  selected={selectedDifficulty === difficulty}
                  onPress={() => setSelectedDifficulty(difficulty)}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor: selectedDifficulty === difficulty
                        ? getDifficultyColor(difficulty) + '20'
                        : theme.colors.surface,
                    },
                  ]}
                  textStyle={{
                    color: selectedDifficulty === difficulty
                      ? getDifficultyColor(difficulty)
                      : theme.colors.text,
                  }}>
                  {difficulty}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Content List */}
        {filteredContent.length > 0 ? (
          filteredContent.map((content: any) => (
            <TouchableOpacity
              key={content.id}
              onPress={() => handleContentPress(content)}
              activeOpacity={0.7}>
              <Card style={[styles.contentCard, {backgroundColor: theme.colors.surface}]}>
                <Card.Content>
                  <View style={styles.contentHeader}>
                    <View style={styles.contentInfo}>
                      <Icon
                        name={getTypeIcon(content.type)}
                        size={20}
                        color={theme.colors.primary}
                      />
                      <Title style={[styles.contentTitle, {color: theme.colors.text}]}>
                        {content.title}
                      </Title>
                    </View>
                    {content.isCompleted && (
                      <Icon name="check-circle" size={20} color={theme.colors.success} />
                    )}
                  </View>
                  
                  <Paragraph style={[styles.contentDescription, {color: theme.colors.textSecondary}]}>
                    {content.description}
                  </Paragraph>
                  
                  <View style={styles.contentMeta}>
                    <Chip
                      style={[styles.categoryChip, {backgroundColor: theme.colors.primary + '20'}]}
                      textStyle={{color: theme.colors.primary, fontSize: 10}}>
                      {content.category}
                    </Chip>
                    <Chip
                      style={[
                        styles.difficultyChip,
                        {backgroundColor: getDifficultyColor(content.difficulty) + '20'},
                      ]}
                      textStyle={{color: getDifficultyColor(content.difficulty), fontSize: 10}}>
                      {content.difficulty}
                    </Chip>
                    <Paragraph style={[styles.readTime, {color: theme.colors.textSecondary}]}>
                      {content.readTime}
                    </Paragraph>
                  </View>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          ))
        ) : (
          <Card style={[styles.emptyCard, {backgroundColor: theme.colors.surface}]}>
            <Card.Content style={styles.emptyContent}>
              <Icon name="search-off" size={48} color={theme.colors.textSecondary} />
              <Title style={[styles.emptyTitle, {color: theme.colors.text}]}>
                No Content Found
              </Title>
              <Paragraph style={[styles.emptyText, {color: theme.colors.textSecondary}]}>
                Try adjusting your search or filters to find educational content.
              </Paragraph>
            </Card.Content>
          </Card>
        )}

        {/* Learning Progress */}
        <Card style={[styles.progressCard, {backgroundColor: theme.colors.surface}]}>
          <Card.Content>
            <View style={styles.progressHeader}>
              <Icon name="trending-up" size={24} color={theme.colors.primary} />
              <Title style={[styles.progressTitle, {color: theme.colors.text}]}>
                Learning Progress
              </Title>
            </View>
            <View style={styles.progressStats}>
              <View style={styles.progressItem}>
                <Paragraph style={[styles.progressValue, {color: theme.colors.primary}]}>
                  {educationContent?.filter((c: any) => c.isCompleted).length || 0}
                </Paragraph>
                <Paragraph style={[styles.progressLabel, {color: theme.colors.textSecondary}]}>
                  Completed
                </Paragraph>
              </View>
              <View style={styles.progressItem}>
                <Paragraph style={[styles.progressValue, {color: theme.colors.success}]}>
                  {educationContent?.length || 0}
                </Paragraph>
                <Paragraph style={[styles.progressLabel, {color: theme.colors.textSecondary}]}>
                  Total Content
                </Paragraph>
              </View>
              <View style={styles.progressItem}>
                <Paragraph style={[styles.progressValue, {color: theme.colors.warning}]}>
                    {educationContent?.length ? 
                    `${Math.round(((educationContent?.filter((c: any) => c.isCompleted).length || 0) / educationContent.length) * 100)}%`
                    : '0%'
                  }
                </Paragraph>
                <Paragraph style={[styles.progressLabel, {color: theme.colors.textSecondary}]}>
                  Progress
                </Paragraph>
              </View>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
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
  searchbar: {
    marginBottom: 16,
    elevation: 1,
  },
  filterCard: {
    marginBottom: 16,
    elevation: 1,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 8,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  filterChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  contentCard: {
    marginBottom: 12,
    elevation: 1,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  contentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  contentDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  contentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  categoryChip: {
    marginRight: 8,
    marginBottom: 4,
  },
  difficultyChip: {
    marginRight: 8,
    marginBottom: 4,
  },
  readTime: {
    fontSize: 12,
    marginLeft: 'auto',
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
  progressCard: {
    marginTop: 16,
    elevation: 1,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  progressItem: {
    alignItems: 'center',
  },
  progressValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  progressLabel: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default EducationScreen;
