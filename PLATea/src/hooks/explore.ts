import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
  },

  searchInput: {
    color:'#e43c8a',
    height: 52,
    borderWidth: 1,
    borderColor: '#f5a3c9',
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 12,
  },

  bloomingButton: {
    height: 44,
    flexDirection: 'row',
    borderWidth: 1,
    backgroundColor: '#ff62ab',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  bloomingButtonPressed: {
    backgroundColor: '#eb0062',
  },

  bloomingButtonText: {
    color: '#fff0f7',
    fontSize: 15,
    fontWeight: '700',
  },

  bloomingButtonTextPressed: {
    color: '#fff0f7',
  },

  emptyState: {
    textAlign: 'center',
    marginTop: 20,
    opacity: 0.6,
  },

  loading: {
    marginTop: 20,
  },

  result: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },

  commonName: {
    fontSize: 18,
    fontWeight: '600',
  },

  scientificName: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 3,
  },

  precinct: {
    fontSize: 13,
    marginTop: 4,
    opacity: 0.6,
  },
});