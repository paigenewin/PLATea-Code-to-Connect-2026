import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FlowerBorderMode } from './cherry-blossom-border';

interface FlowerBorderControlsProps {
  mode: FlowerBorderMode;
  onChange: (mode: FlowerBorderMode) => void;
}

const options: { label: string; value: FlowerBorderMode }[] = [
  { label: 'Corners', value: 'corners' },
];

export const FlowerBorderControls: React.FC<FlowerBorderControlsProps> = ({ mode, onChange }) => (
  <View style={styles.container}>
    {options.map((option) => (
      <Pressable
        key={option.value}
        accessibilityRole="button"
        accessibilityState={{ selected: mode === option.value }}
        onPress={() => onChange(option.value)}
        style={[styles.button, mode === option.value && styles.activeButton]}
      >
        <Text style={[styles.label, mode === option.value && styles.activeLabel]}>{option.label}</Text>
      </Pressable>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 72,
    alignSelf: 'center',
    zIndex: 30,
    flexDirection: 'row',
    gap: 6,
    padding: 5,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#6b4660',
    shadowOpacity: 0.16,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 13,
  },
  activeButton: {
    backgroundColor: '#f58fb5',
  },
  label: {
    color: '#6e5262',
    fontSize: 12,
    fontWeight: '600',
  },
  activeLabel: {
    color: '#ffffff',
  },
});
