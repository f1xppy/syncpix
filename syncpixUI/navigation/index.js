import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SCREENS from '../screens';
import MainScreen from '../screens/main/Main';
import SettingsScreen from '../screens/settings/Settings';
import Testik from '../screens/test/Test';
import AlbumContents from '../screens/album/AlbumContents';

const Stack = createNativeStackNavigator();

const StackNavigation = () => {
    return(
     <Stack.Navigator initialRouteName={SCREENS.SETTINGS}>
        <Stack.Screen 
        name = {SCREENS.MAIN} 
        component={MainScreen}
        options={{headerShown:false}}
        />
        <Stack.Screen 
        name={SCREENS.SETTINGS} 
        component={SettingsScreen} 
        options={{headerShown:false}}
        />
        <Stack.Screen 
        name={SCREENS.TEST} 
        component={Testik} 
        options={{headerShown:true}}
        />
        <Stack.Screen 
        name={SCREENS.ALBUMCONTENTS} 
        component={AlbumContents} 
        options={{headerShown:false}}
        />
    </Stack.Navigator>
    );
};

export default StackNavigation;