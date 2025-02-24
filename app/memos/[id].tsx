// メモ修正画面
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { Button, StyleSheet, Text, View, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { MemoInputForm } from '../../src/components/MemoInputForm';
import { KeyboardAvoidingView } from '@gluestack-ui/themed';
import * as MemoService from '../../src/services/memoService';
import { Indicator } from '../../src/components/Indicator';

export default function MemoEditScreen() {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams() as { id: string };
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return <Button title="保存" onPress={handleSavePress} />;
      }
    });
  }, [title, content]); // 古い情報をhandleSavePressが見ないように依存関係を設定する

  useEffect(() => {
    let isMounted = true;
    const loadData = async (memoId: string) => {
      try {
        // メモを取得
        const memo = await MemoService.getMemo(memoId);

        if (!memo) {
          Alert.alert('エラー', 'メモが見つかりませんでした。', [{ text: 'OK', onPress: () => router.back() }]);
          return;
        }
        setTitle(memo.title);
        setContent(memo.content);
      } catch (e) {
        Alert.alert('エラー', 'メモの取得に失敗しました。', [{ text: 'OK', onPress: () => router.back() }]);
      }
    };
    // !本来は非マウント時のsetでエラーになるのを避けたいので、isMountedで確認する箇所はset関数の方が良さそう。
    if (isMounted) loadData(id);

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleSavePress = async () => {
    // バリデーション
    if (!title) {
      Alert.alert('確認', 'タイトルを入力してください');
      return;
    }
    setIsLoading(true);
    // メモを更新する
    try {
      await MemoService.editMemo(id, title, content);
      router.back();
    } catch (e) {
      Alert.alert('エラー', 'メモの保存に失敗しました');
      return;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={100}>
      {/* KeyboardAvoidingViewはTextAreaで下の方のテキストをフォーカスして編集できるようにする */}
      <MemoInputForm title={title} content={content} onContentChange={setContent} onTitleChange={setTitle} />
      <Indicator visible={isLoading} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  title: { fontSize: 20, fontWeight: 'bold' }
});
