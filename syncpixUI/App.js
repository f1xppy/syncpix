import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import StackNavigation from './navigation';
import * as ImagePicker from 'expo-image-picker';

export default function App() {
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  return (
    <NavigationContainer>
      <StackNavigation />
    </NavigationContainer>
  );
}
