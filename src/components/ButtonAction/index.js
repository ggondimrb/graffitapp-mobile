import React from 'react';
import {Feather} from '@expo/vector-icons';
import PropTypes from 'prop-types';

import {Container, Text} from './styles';

export default function ButtonAction({children, icon, color, ...rest}) {
  return (
    <Container {...rest}>
      <Feather name={icon} size={40} color={color} />
      <Text>{children}</Text>
    </Container>
  );
}

ButtonAction.propTypes = {
  icon: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};
