import { StyleSheet } from 'react-native';
export const explorestyles = StyleSheet.create({
  handle: {
    backgroundColor: '#f5a3c9',
    width: 40,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    
  },

  bloomingButton: {
    height: 44,
    flexDirection: 'row',
    backgroundColor: '#ff62ab',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
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
    marginTop: 8,
    marginBottom: 8,
    opacity: 0.6,
  },

  loading: {
    marginTop: 8,
    marginBottom: 8,
  },

  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
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

  resultNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  nearestBadge: {
    backgroundColor: '#ffd9ea',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },

  nearestBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#c2116c',
  },

  clearImageSearch: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e43c8a',
    marginBottom: 12,
  },
});
