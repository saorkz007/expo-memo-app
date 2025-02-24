import { Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type LabelTagProps = {
  color: string;
  name: string;
};

const LabelTag: React.FC<LabelTagProps> = props => {
  const { color, name } = props;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 4 }}>
      <MaterialCommunityIcons name="label" size={24} color={color} />
      <Text style={{ marginLeft: 5 }}>{name}</Text>
    </View>
  );
};

export { LabelTag };
