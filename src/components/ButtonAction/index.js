import React from 'react';
import Icon from 'react-native-vector-icons/Feather';
import PropTypes from 'prop-types';

import {Container, Text} from './styles';

export default function ButtonAction({children, icon, color, ...rest}) {
  return (
    <Container {...rest}>
      <Icon name={icon} size={40} color={color} />
      <Text>{children}</Text>
    </Container>
  );
}

ButtonAction.propTypes = {
  children: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};
