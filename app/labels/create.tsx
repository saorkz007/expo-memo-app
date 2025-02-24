// ラベル作成画面
import { Button, ButtonText, Input, InputField, VStack } from '@gluestack-ui/themed';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { ColorPicker } from '../../src/components/ColorPicker';
import { Indicator } from '../../src/components/Indicator';
import * as LabelService from '../../src/services/labelService';

export default function LabelCreateScreen() {
  const [labelName, setLabelName] = useState<string>('');
  const [color, setColor] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleColorPress = (color: string) => {
    setColor(color);
  };

  const handleCreatePress = async () => {
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
      await LabelService.addLabel(labelName, color);
      router.dismiss();
    } catch (e) {
      Alert.alert('ラベルの作成に失敗しました');
      return;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <VStack space="lg">
        {/* VStack: 縦並びの要素を良い感じにしてくれる */}
        <Input variant="underlined" size="md" backgroundColor="$white" borderColor="$warmGray300">
          <InputField paddingLeft={'$2'} placeholder="ラベル名" onChangeText={setLabelName} />
        </Input>
        <ColorPicker onPress={handleColorPress} />

        <Button size="md" action="primary" marginHorizontal={'$4'} onPress={handleCreatePress}>
          <ButtonText>作成</ButtonText>
        </Button>
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
