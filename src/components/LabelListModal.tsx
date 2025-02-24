import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CloseIcon, Heading, Icon, Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalHeader } from '@gluestack-ui/themed';
import { Text, TouchableOpacity } from 'react-native';
import { LabelTag } from './LabelTag';

type LabelListModalProps = {
  visible: boolean;
  title: string;
  data: { id: number; name: string; color: string }[];
  onPress: (labelId?: number) => void;
  onClose: () => void;
};

const LabelListModal: React.FC<LabelListModalProps> = props => {
  const { visible, title, data, onPress, onClose } = props;

  return (
    <Modal isOpen={visible} onClose={onClose}>
      <ModalBackdrop />
      <ModalContent width={'85%'} backgroundColor="#ffffff">
        <ModalHeader>
          <Heading size="lg">{title}</Heading>

          <ModalCloseButton>
            <Icon size="lg" as={CloseIcon} />
          </ModalCloseButton>
        </ModalHeader>

        {/* ボディ */}
        <ModalBody>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }} onPress={() => onPress(undefined)}>
            <MaterialCommunityIcons name="label-off" size={24} color={'gray'} />
            <Text style={{ marginLeft: 5 }}>ラベル解除</Text>
          </TouchableOpacity>

          {data.map(label => (
            <TouchableOpacity key={label.id} style={{ marginVertical: 5 }} onPress={() => onPress(label.id)}>
              <LabelTag color={label.color} name={label.name} />
            </TouchableOpacity>
          ))}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export { LabelListModal };
