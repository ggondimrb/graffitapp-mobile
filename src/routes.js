import React from 'react';
import {Image, View} from 'react-native';
import {useSelector} from 'react-redux';

import {Feather} from '@expo/vector-icons';

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

import icon from '~/assets/icon-black.png';

export default function Routes() {
  const signed = useSelector((state) => state.auth.signed);

  const Tab = createBottomTabNavigator();
  const Stack = createStackNavigator();

  function New({navigation}) {
    return (
      <Stack.Navigator
        screenOptions={{headerShown: true, headerTransparent: true}}>
        <Stack.Screen
          options={{
            title: 'Selecionar Arte',
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Feed');
                }}>
                <Feather name="chevron-left" size={30} color="#fff" />
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
                <Feather name="chevron-left" size={30} color="#fff" />
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

  function Home({navigation}) {
    return (
      <Stack.Navigator
        screenOptions={{headerShown: true, headerTransparent: true}}>
        <Stack.Screen
          name="Feed"
          component={Feed}
          options={{
            title: '',
            headerBackground: () => (
              <View style={{backgroundColor: '#131313'}}>
                <Image
                  style={{width: '100%'}}
                  resizeMode="contain"
                  source={icon}
                />
              </View>
            ),
            headerStyle: {
              backgroundColor: '#131313',
            },
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="GraffitiProfile"
          options={{
            headerShown: false,
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Feed');
                }}>
                <Feather
                  style={{position: 'absolute'}}
                  name="chevron-left"
                  size={30}
                  color="#fff"
                />
              </TouchableOpacity>
            ),
          }}
          component={GraffitiProfile}
        />
        <Stack.Screen
          name="New"
          options={{headerShown: false}}
          component={New}
        />
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
            showLabel: false,
            inactiveTintColor: '#c6c6c6',
            resetOnBlur: true,
            style: {
              backgroundColor: '#131313',
            },
          }}>
          <Tab.Screen
            options={{
              tabBarIcon: ({color}) => (
                <Feather name="map" size={20} color={color} />
              ),
            }}
            name="Map"
            component={Map}
          />
          <Tab.Screen
            options={{
              tabBarIcon: ({color}) => (
                <Feather name="home" size={20} color={color} />
              ),
            }}
            name="Home"
            component={Home}
          />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{headerShown: false}}>
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
