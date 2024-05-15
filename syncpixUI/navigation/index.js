import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SCREENS from '../screens';
import MainScreen from '../screens/main/Main';
import SettingsScreen from '../screens/settings/Settings';

const Stack = createNativeStackNavigator();

const StackNavigation = () => {
    return(
     <Stack.Navigator initialRouteName={SCREENS.MAIN}>
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
    </Stack.Navigator>
    );
};

export default StackNavigation;