import { Pressable, StyleSheet, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = TextInputProps & {
  containerStyle?: ViewStyle | ViewStyle[];
  onCameraPress?: () => void;
};

export default function SearchBar({
  style,
  containerStyle,
  placeholder = 'Search flower name...',
  onCameraPress,
  ...props
}: Props) {
  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        style={[styles.input, onCameraPress && styles.inputWithCamera, style]}
        placeholder={placeholder}
        placeholderTextColor="#c77a99"
        {...props}
      />

      {onCameraPress && (
        <Pressable style={styles.cameraButton} onPress={onCameraPress}>
          <Ionicons name="camera" size={22} color="#e43c8a" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 52,
    borderWidth: 1,
    borderColor: '#f5a3c9',
    borderRadius: 14,
    justifyContent: 'center',
  },

  input: {
    flex: 1,
    height: '100%',
    color: '#e43c8a',
    paddingHorizontal: 16,
    fontSize: 16,
  },

  inputWithCamera: {
    paddingRight: 48,
  },

  cameraButton: {
    position: 'absolute',
    right: 6,
    height: 40,
    width: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
