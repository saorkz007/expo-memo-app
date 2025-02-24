import { StyleSheet, View, Button } from 'react-native';
import { ListItem } from '@rneui/themed';
import { MaterialCommunityIcons, Foundation } from '@expo/vector-icons';

/**
 * ラベルリストコンポーネント
 */

type LabelListItemProps = {
  color: string; // ラベルの色
  name: string; // ラベル名
  onPress: () => void; // ラベルが押された時の処理
  onEditPress: () => void; // 編集ボタンが押された時の処理
};

const LabelListItem: React.FC<LabelListItemProps> = props => {
  const { color, name, onPress, onEditPress } = props;

  return (
    <View style={styles.container}>
      <ListItem bottomDivider style={styles.listItem} onPress={onPress}>
        <MaterialCommunityIcons name="label" size={24} color={color} style={styles.labelIcon} />

        <ListItem.Content>
          <ListItem.Title style={styles.title}>{name}</ListItem.Title>
        </ListItem.Content>

        <Foundation style={styles.editIcon} name="pencil" size={24} color="gray" onPress={onEditPress} />
      </ListItem>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  labelIcon: {
    marginLeft: 10
  },
  listItem: {
    flex: 1
  },
  title: {
    fontSize: 18
  },
  editIcon: {
    marginRight: 10
  }
});

export { LabelListItem };
