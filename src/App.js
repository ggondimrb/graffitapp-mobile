import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';

import SplashScreen from 'react-native-splash-screen';

import Routes from './routes';

export default function App() {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return <Routes />;
}
