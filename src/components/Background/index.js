import {LinearGradient} from 'expo-linear-gradient';
import styled from 'styled-components/native';

export default styled(LinearGradient).attrs({
  colors: ['#333', '#515151'],
})`
  flex: 1;
`;
