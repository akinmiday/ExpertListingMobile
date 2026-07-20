import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import FeedScreen from '../screens/FeedScreen';
import SidebarContent from '../components/SidebarContent';
import Header from '../components/Header';
import { Colors } from '../theme/colors';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <SidebarContent {...props} />}
      screenOptions={{
        headerShown: true,
        header: () => <Header routeName="Feed" />,
        drawerPosition: 'right',
        drawerStyle: {
          width: 300,
          backgroundColor: Colors.card,
        },
        drawerType: 'slide',
        swipeEnabled: true,
        lazy: false,
      }}
    >
      <Drawer.Screen name="FeedScreen" component={FeedScreen} />
    </Drawer.Navigator>
  );
}
