import { Input, InputField, Textarea, TextareaInput } from '@gluestack-ui/themed';
import { Button, InputAccessoryView, Keyboard, Platform, View } from 'react-native';

type MemoInputFormProps = {
  title: string; // タイトル
  content: string; // 内容
  onTitleChange: (text: string) => void;
  onContentChange: (text: string) => void;
};

const inputAccessoryViewID = 'INPUT_ACCESSORY_VIEW_ID';

const MemoInputForm: React.FC<MemoInputFormProps> = props => {
  const { title, content, onTitleChange, onContentChange } = props;

  return (
    <View style={{ flex: 1, paddingBottom: 100 }}>
      {/* ドル($)はgluestackの書き方 */}
      <Textarea borderWidth={0} minWidth={'$full'} minHeight={'$full'}>
        <Input borderWidth={0} minWidth={'$full'} marginTop={'$4'} marginBottom={'$1'} paddingHorizontal={'$1'}>
          <InputField defaultValue={title} onChangeText={onTitleChange} fontSize={'$2xl'} fontWeight={'$bold'} placeholder="タイトル" />
        </Input>

        <TextareaInput
          scrollEnabled={true}
          paddingHorizontal={'$5'}
          defaultValue={content}
          onChangeText={onContentChange}
          fontSize={'$md'}
          placeholder="メモを入力"
          inputAccessoryViewID={inputAccessoryViewID}
        />
      </Textarea>

      {/* iOSのみ、キーボードの上に閉じるボタンを表示 */}
      {Platform.OS === 'ios' && (
        <InputAccessoryView nativeID={inputAccessoryViewID} backgroundColor={'#F1F1F1'}>
          <View style={{ alignItems: 'flex-end' }}>
            <Button title="閉じる" onPress={() => Keyboard.dismiss()} />
          </View>
        </InputAccessoryView>
      )}
    </View>
  );
};

export { MemoInputForm };
