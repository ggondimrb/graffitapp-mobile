import {Dimensions} from 'react-native';

export function getWidthWindow() {
  return Math.round(Dimensions.get('window').width);
}

export function getHeightWindow() {
  return Math.round(Dimensions.get('window').height);
}
