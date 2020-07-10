import React from 'react';
import {useSelector} from 'react-redux';

import Icon from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {NavigationContainer} from '@react-navigation/native';

import {TouchableOpacity} from 'react-native';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';

import SignIn from '~/pages/SignIn';
import SignUp from '~/pages/SignUp';

import Main from '~/pages/Main';
import Feed from '~/pages/Arts/Feed';

import GraffitiProfile from '~/pages/Arts/GraffitiProfile';

import SelectArt from '~/pages/Arts/New/SelectArt';
import Confirm from '~/pages/Arts/New/Confirm';

export default function Routes() {
  const signed = useSelector((state) => state.auth.signed);

  const Tab = createBottomTabNavigator();
  const Stack = createStackNavigator();

  function New({navigation}) {
    return (
      <Stack.Navigator>
        <Stack.Screen
          options={{
            title: 'Selecionar Arte',
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Feed');
                }}>
                <MaterialIcons name="chevron-left" size={30} color="#fff" />
              </TouchableOpacity>
            ),
            headerStyle: {
              backgroundColor: '#131313',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
          name="SelectArt"
          component={SelectArt}
        />
        <Stack.Screen
          options={{
            title: 'Confirme os Dados',
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('SelectArt');
                }}>
                <MaterialIcons name="chevron-left" size={30} color="#fff" />
              </TouchableOpacity>
            ),
            headerStyle: {
              backgroundColor: '#131313',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
          name="Confirm"
          component={Confirm}
        />
      </Stack.Navigator>
    );
  }

  function Home() {
    return (
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Feed" component={Feed} />
        <Stack.Screen name="New" component={New} />
      </Stack.Navigator>
    );
  }

  function Map() {
    return (
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen name="GraffitiProfile" component={GraffitiProfile} />
      </Stack.Navigator>
    );
  }

  return (
    <NavigationContainer>
      {signed ? (
        <Tab.Navigator
          tabBarOptions={{
            keyboardHidesTabBar: true,
            activeTintColor: '#fff',
            inactiveTintColor: '#c6c6c6',
            resetOnBlur: true,
            style: {
              backgroundColor: '#131313',
            },
          }}>
          <Tab.Screen
            options={{
              tabBarIcon: ({color}) => (
                <Icon name="map" size={20} color={color} />
              ),
            }}
            name="Map"
            component={Map}
          />
          <Tab.Screen
            options={{
              tabBarIcon: ({color}) => (
                <Icon name="home" size={20} color={color} />
              ),
            }}
            name="Home"
            component={Home}
          />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="SignIn" component={SignIn} />
          <Stack.Screen name="SignUp" component={SignUp} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

// createAppContainer(
//     createSwitchNavigator(
//       {
//         Sign: createSwitchNavigator({SignIn, SignUp}),
//         App: createBottomTabNavigator(
//           {
//             Arts: {
//               screen: createStackNavigator({
//                 Feed,
//                 New: {
//                   screen: createStackNavigator(
//                     {SelectArt, Confirm},
//                     {
//                       defaultNavigationOptions: {
//                         headerTransparent: true,
//                         headerTintColor: '#FFF',
//                         headerLeftContainerStyle: {
//                           marginLeft: 20,
//                         },
//                       },
//                     },
//                   ),
//                   navigationOptions: {
//                     tabBarVisible: false,
//                   },
//                 },
//               }),
//             },
//             Main,
//           },
//           {
//             resetOnBlur: true,
//             tabBarOptions: {
//               keyboardHidesTabBar: true,
//               activeTintColor: '#fff',
//               inactiveTintColor: 'rgba(255,255,255,0.6)',
//               style: {
//                 backgroundColor: '#333',
//               },
//             },
//           },
//         ),
//       },
//       {
//         initialRouteName: isSigned ? 'App' : 'Sign',
//       },
//     ),
//   );
