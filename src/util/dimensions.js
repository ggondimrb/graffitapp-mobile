import {Dimensions} from 'react-native';

export function width() {
  return Math.round(Dimensions.get('window').width);
}

export function height() {
  return Math.round(Dimensions.get('window').height);
}
