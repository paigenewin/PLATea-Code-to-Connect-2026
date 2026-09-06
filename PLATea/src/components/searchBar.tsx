import { StyleSheet, TextInput, TextInputProps } from 'react-native';

export default function SearchBar({
  style,
  placeholder = 'Search flower name...',
  ...props
}: TextInputProps) {
  return (
    <TextInput
      style={[styles.input, style]}
      placeholder={placeholder}
      placeholderTextColor="#c77a99"
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    color: '#e43c8a',
    height: 52,
    borderWidth: 1,
    borderColor: '#f5a3c9',
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 16,
  },
});
