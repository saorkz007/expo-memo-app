import { router, useLocalSearchParams, useNavigation, useFocusEffect } from 'expo-router';
import { useEffect, useState, useCallback } from 'react';
import { Button, StyleSheet, Text, View, FlatList, Alert } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { MemoListItem } from '../../src/components/MemoListItem';
import { LabelTag } from '../../src/components/LabelTag';
import { LabelListModal } from '../../src/components/LabelListModal';
import { Label } from '../../src/types/label';
import { Memo } from '../../src/types/memo';
import * as MemoService from '../../src/services/memoService';
import { Indicator } from '../../src/components/Indicator';
import * as LabelService from '../../src/services/labelService';

// Recoil
import { useRecoilValue } from 'recoil';
import { selectedLabelIdState } from '../../src/recoils/selectedLabelIdState';

export default function MemoListScreen() {
  const navigation = useNavigation();
  // const { labelId } = useLocalSearchParams();
  const selectedLabelId = useRecoilValue(selectedLabelIdState);
  const [labels, setLabels] = useState<Label[]>([]);
  const [memos, setMemos] = useState<Memo[]>([]);
  const selectedLabel = labels.find(label => label.id === selectedLabelId);
  const [selectMemoId, setSelectMemoId] = useState<string | undefined>(undefined);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLabelListModalVisible, setIsLabelListModalVisible] = useState(false);

  useEffect(() => {
    navigation.setOptions({ headerRight: () => <Feather name="edit" size={24} color="black" onPress={handleCreatePress} /> });
  }, []);

  useFocusEffect(
    // useFocusEffect: 画面がフォーカスされる度に実行される
    useCallback(() => {
      // useFocusEffectは依存配列を指定できないので、代わりにuseCallbackを使ってselectedLabelIdを依存配列に設定している。(恐らく)
      const loadData = async (labelId: number | undefined) => {
        try {
          // ラベルリストを取得して設定する
          const labels = await LabelService.getLabels();
          setLabels(labels);

          // メモ一覧を取得する
          const memos = await MemoService.getMemos();
          const filteredMemos = labelId ? memos.filter(memo => memo.labelId === labelId) : memos;

          setMemos(filteredMemos);
        } catch (e) {
          Alert.alert('エラー', 'データの取得に失敗しました', [{ text: 'OK', onPress: () => router.back() }]);
        }
      };
      loadData(selectedLabelId);
    }, [selectedLabelId])
  );

  const handleCreatePress = () => {
    router.push({ pathname: '/memos/create' });
  };

  const handleMemoPress = (memoId: string) => {
    router.push({ pathname: `/memos/${memoId}` });
  };

  const handleMemoLongPress = (memoId: string) => {
    setSelectMemoId(memoId);
    setIsLabelListModalVisible(true);
  };
  const handleMemoDeletePress = async (memoId: string) => {
    setIsLoading(true);
    try {
      // メモを削除する
      await MemoService.deleteMemo(memoId);
      setMemos(memos.filter(memo => memo.id !== memoId));
    } catch (e) {
      Alert.alert('エラー', 'メモの削除に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLabelPress = async (labelId?: number) => {
    if (selectMemoId === undefined) {
      return;
    }
    setIsLoading(true);
    try {
      // メモにラベルを設定する
      await MemoService.setLabel(selectMemoId, labelId);
      // メモリストを更新する
      const memos = await MemoService.getMemos();
      const filteredMemos = selectedLabelId ? memos.filter(memo => memo.labelId === selectedLabelId) : memos;
      setMemos(filteredMemos);
      // 後処理
      setSelectMemoId(undefined);
      setIsLabelListModalVisible(false);
    } catch (e) {
      Alert.alert('エラー', 'ラベルの設定に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLabelListModalClose = () => {
    setSelectMemoId(undefined);
    setIsLabelListModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={
          selectedLabel ? (
            <View style={{ margin: 10 }}>
              <LabelTag color={selectedLabel.color} name={selectedLabel.name} />
            </View>
          ) : (
            <></>
          )
        }
        contentContainerStyle={{ paddingBottom: 40 }}
        data={memos}
        renderItem={({ item }) => (
          <MemoListItem
            name={item.title}
            content={item.content}
            onPress={() => handleMemoPress(item.id)}
            onLongPress={() => handleMemoLongPress(item.id)}
            onDeletePress={() => handleMemoDeletePress(item.id)}
            label={selectedLabelId ? undefined : labels.find(label => label.id === item.labelId)} // ラベルが選択されている場合は、メモ一覧でラベルを表示しない
          />
        )}
        keyExtractor={item => item.id}
      />
      <LabelListModal
        visible={isLabelListModalVisible}
        title="ラベル設定"
        data={labels}
        onPress={handleLabelPress}
        onClose={handleLabelListModalClose}
      />
      <Indicator visible={isLoading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#efeff4'
  },
  title: { fontSize: 20, fontWeight: 'bold' }
});
