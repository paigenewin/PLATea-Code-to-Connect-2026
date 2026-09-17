import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 60,
  },

  // -------------------------
  // BACK BUTTON
  // -------------------------

  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    marginBottom: 14,
  },
  backButtonText: {
    color: '#4F7DED',
    fontSize: 15,
    fontWeight: '600',
  },

  // -------------------------
  // TREE NAME
  // -------------------------

  commonName: {
    fontSize: 30,
    fontWeight: '700',
  },
  scientificName: {
    fontSize: 16,
    fontStyle: 'italic',
    marginTop: 5,
  },

  // -------------------------
  // BLOOM CARD
  // -------------------------

  bloomCard: {
    marginTop: 20,
    padding: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E35CB6',
  },
  bloomStatus: {
    fontSize: 23,
    fontWeight: '700',
    marginTop: 6,
    color: '#E35CA8',
  },
  bloomDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
    color: '#F061B2',
  },

  // -------------------------
  // LOCATE BUTTON
  // -------------------------

  locateButton: {
    height: 50,
    backgroundColor: '#81B963',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  locateButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },

  // -------------------------
  // SECTION HEADINGS
  // -------------------------

  heading: {
    fontSize: 21,
    fontWeight: '700',
    marginTop: 28,
    marginBottom: 8,
  },

  // -------------------------
  // TREE INFORMATION
  // -------------------------

  infoRow: {
    flexDirection: 'row',
    paddingVertical: 13,
    borderBottomWidth: 1,
  },
  infoLabel: {
    width: 120,
    fontSize: 15,
  },
  infoValue: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },

  // -------------------------
  // COMMUNITY
  // -------------------------

  communityCard: {
    paddingVertical: 13,
    paddingHorizontal: 1,

  },
  communityText: {
    fontSize: 15,
  },
  reportItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  reportMessage: {
    fontSize: 15,
  },
  reportDate: {
    fontSize: 12,
    marginTop: 5,
  },
  contributeButton: {
    height: 44,
    backgroundColor: '#ea8dbf',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  contributeButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  contributionArea: {
    marginTop: 12,
  },
  contributionInput: {
    minHeight: 100,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    textAlignVertical: 'top',
  },
  contributionButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    height: 42,
    borderWidth: 1,
    borderColor: '#BBBBBB',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    height: 42,
    backgroundColor: '#64b76c',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.4,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
