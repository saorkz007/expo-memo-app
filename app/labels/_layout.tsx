// import { Stack } from 'expo-router';

import { router, Stack } from 'expo-router';
import { Text, TouchableOpacity } from 'react-native';

/**
 * ラベル画面
 * name="labels" は既にapp/_layoutに定義されているので、その配下のnameを定義。
 */
export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="create"
        options={{
          headerTitle: 'ラベル作成',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.dismiss()}>
              <Text>閉じる</Text>
            </TouchableOpacity>
          )
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          headerTitle: 'ラベル修正',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.dismiss()}>
              <Text>閉じる</Text>
            </TouchableOpacity>
          )
        }}
      />
    </Stack>
  );
}
