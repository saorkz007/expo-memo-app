import { MaterialIcons } from '@expo/vector-icons';
import { router, useNavigation, useFocusEffect } from 'expo-router';
import { useEffect, useState, useCallback } from 'react';
import { Button, StyleSheet, View, ScrollView, Text, Alert } from 'react-native';
import { LabelListItem } from '../../src/components/LabelListItem';
import { ListItem } from '@rneui/themed';
import { type Label } from '../../src/types/label';
import * as LabelService from '../../src/services/labelService';

// Recoil
import { useRecoilState } from 'recoil';
import { selectedLabelIdState } from '../../src/recoils/selectedLabelIdState';

/**
 * ホーム画面
 */
export default function HomeScreen() {
  const navigation = useNavigation();
  const [labels, setLabels] = useState<Label[]>([]);

  const [selectedLabelId, setSelectedLabelId] = useRecoilState(selectedLabelIdState);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return <MaterialIcons name="new-label" size={24} color="black" onPress={handleLabelAddLabelPress} />;
      }
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          // ラベル一覧を取得する
          const labels = await LabelService.getLabels();
          setLabels(labels);
        } catch (e) {
          Alert.alert('エラー', 'データの取得に失敗しました');
        }
      };
      loadData();
    }, [])
  );

  const handleAllMemoPress = () => {
    setSelectedLabelId(undefined);
    // メモの一覧画面に遷移
    router.push({ pathname: '/memos' });
  };
  const handleLabelPress = (labelId: number) => {
    setSelectedLabelId(labelId);
    // 押されたラベルがフィルターされてメモ一覧画面に遷移
    router.push({ pathname: '/memos' });
  };

  const handleLabelAddLabelPress = () => {
    // ラベルの追加画面に遷移
    router.push({ pathname: '/labels/create' });
  };

  const handleLabelEditLabelPress = (labelId: number) => {
    // ラベルの編集画面に遷移
    router.push({ pathname: `/labels/${labelId}` });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingVertical: 40 }}>
        {/* すべてのメモ */}
        <ListItem bottomDivider onPress={handleAllMemoPress}>
          <ListItem.Content>
            <ListItem.Title>すべてのメモ</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>

        <Text style={styles.sectionText}>ラベル</Text>

        {/* ラベルリスト */}
        {labels.map(item => (
          <LabelListItem
            key={item.id}
            color={item.color}
            name={item.name}
            onPress={() => handleLabelPress(item.id)}
            onEditPress={() => handleLabelEditLabelPress(item.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#efeff4'
  },
  sectionText: { marginTop: 30, marginBottom: 10, marginLeft: 14, fontSize: 14, color: '#707070' },
  title: { fontSize: 20, fontWeight: 'bold' }
});
