// メモ作成画面
import { router, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, View, Text } from 'react-native';
import { MemoInputForm } from '../../src/components/MemoInputForm';
import * as MemoService from '../../src/services/memoService';
import { KeyboardAvoidingView } from '@gluestack-ui/themed';
import { Indicator } from '../../src/components/Indicator';
//Recoil
import { useRecoilValue } from 'recoil';
import { selectedLabelIdState } from '../../src/recoils/selectedLabelIdState';

export default function MemoCreateScreen() {
  const navigation = useNavigation();

  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const selectedLabelId = useRecoilValue(selectedLabelIdState);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return <Button title="作成" onPress={handleCreatePress} />;
      }
    });
  }, [title, content]);

  const handleCreatePress = async () => {
    // バリデーション
    if (!title) {
      Alert.alert('確認', 'タイトルを入力してください');
      return;
    }
    setIsLoading(true);
    try {
      await MemoService.addMemo(selectedLabelId, title, content);
      router.back();
    } catch (e) {
      Alert.alert('エラー', 'メモの作成に失敗しました');
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
    backgroundColor: '#efeff4',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: { fontSize: 20, fontWeight: 'bold' }
});
