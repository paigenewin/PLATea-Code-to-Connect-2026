import {
  StyleSheet,
} from 'react-native';


export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  map: {
    flex: 1,
  },

  searchBar: {
    position: 'absolute',
    left: 16,
    right: 16,

    backgroundColor: 'white',

    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    elevation: 5,
  },
});
