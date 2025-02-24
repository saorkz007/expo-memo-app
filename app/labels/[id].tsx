// ラベル修正画面
import { Button, ButtonText, Input, InputField, VStack } from '@gluestack-ui/themed';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { ColorPicker } from '../../src/components/ColorPicker';
import { Indicator } from '../../src/components/Indicator';
import * as LabelService from '../../src/services/labelService';

// import * as LabelService from '../../src/services/labelService';

export default function LabelEditScreen() {
  const { id } = useLocalSearchParams(); // expo-routerの仕様上stringで渡ってくる

  const [labelName, setLabelName] = useState<string>('');
  const [color, setColor] = useState<string | undefined>(undefined);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const loadData = async (labelId: number) => {
      try {
        // ラベルを取得する
        const label = await LabelService.getLabel(labelId);
        if (!label) {
          Alert.alert('エラー', 'ラベルが見つかりませんでした', [{ text: 'OK', onPress: () => router.back() }]);
          return;
        }
        setLabelName(label.name);
        setColor(label.color);
      } catch (e) {
        Alert.alert('エラー', 'データの取得に失敗しました', [{ text: 'OK', onPress: () => router.back() }]);
      }
    };
    if (isMounted) {
      const labelId = Number(id);
      loadData(labelId);
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleEditPress = async () => {
    // バリデーション
    if (!labelName) {
      Alert.alert('ラベル名を入力してください');
      return;
    }
    if (!color) {
      Alert.alert('カラーを選択してください');
      return;
    }
    setIsLoading(true);
    try {
      // ラベルを修正する
      await LabelService.editLabel(Number(id), labelName, color);
      router.dismiss();
    } catch (e) {
      Alert.alert('ラベルの作成に失敗しました');
      return;
    } finally {
      setIsLoading(false);
    }
  };
  const handleDeletePress = () => {
    const deleteLabel = async () => {
      setIsLoading(true);
      try {
        // ラベルを削除する
        await LabelService.deleteLabel(Number(id));
        router.dismiss();
      } catch (e) {
        Alert.alert('ラベルの削除に失敗しました');
        return;
      } finally {
        setIsLoading(false);
      }
    };
    Alert.alert('確認', 'ラベルを削除しますか？', [
      { text: 'キャンセル', onPress: () => {} },
      { text: '削除', onPress: deleteLabel }
    ]);
  };

  const handleColorPress = (color: string) => {
    setColor(color);
  };

  return (
    <View style={styles.container}>
      <VStack space="lg">
        <Input variant="underlined" size="md" backgroundColor="$white" borderColor="$warmGray300">
          <InputField defaultValue={labelName} paddingLeft={'$2'} placeholder="ラベル名" onChangeText={setLabelName} />
        </Input>

        <ColorPicker onPress={handleColorPress} defaultColor={color} />

        <VStack space="md">
          <Button size="md" action="primary" marginHorizontal={'$4'} onPress={handleEditPress}>
            <ButtonText>修正</ButtonText>
          </Button>
          <Button size="md" action="negative" marginHorizontal={'$4'} onPress={handleDeletePress}>
            <ButtonText>削除</ButtonText>
          </Button>
        </VStack>
      </VStack>

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
