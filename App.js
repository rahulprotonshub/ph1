import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// Redux
import {PersistGate} from 'redux-persist/integration/react';
import {useDispatch, useSelector, Provider} from 'react-redux';
import {setReduxList} from './reducer/reducer_action';
import {persistedStore, store} from './reducer/storeReducer';

const Stack = createNativeStackNavigator();

const App = () => {
  const [showSplash, setSplash] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setSplash(false);
    }, 3000);
  }, []);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistedStore} loading={null}>
        <SafeAreaView style={[styles.backgroundStyle]}>
          <StatusBar barStyle={'light-content'} backgroundColor={'#434343'} />
          {showSplash ? (
            <Splash />
          ) : (
            <NavigationContainer>
              <Stack.Navigator initialRouteName="UserList">
                <Stack.Screen
                  name="UserList"
                  component={UserList}
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name="UserDetails"
                  component={UserDetails}
                  options={{headerShown: false}}
                />
              </Stack.Navigator>
            </NavigationContainer>
          )}
        </SafeAreaView>
      </PersistGate>
    </Provider>
  );
};

const Splash = () => {
  return (
    <View style={[styles.splash]}>
      <Image
        style={[styles.splashImage]}
        source={require('./assets/images/logo.jpeg')}
      />
    </View>
  );
};

function UserList({navigation}) {
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState([]);
  const [list, setList] = useState([]);
  const [keyword, setKeyword] = useState('');

  const dispatch = useDispatch();
  const dataReducer = useSelector(state => state.dataReducer);

  useEffect(() => {
    if (dataReducer == 'undefined' || dataReducer.list.length == 0) {
      fetchApi();
    }
  }, []);

  function fetchApi() {
    setLoader(true);
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(response => response.json())
      .then(json => {
        setLoader(false);
        if (json.length) {
          setData(json);
          setList(json);
          dispatch(setReduxList(json));
        } else {
          alert('No data found');
          setData([]);
          setList([]);
          dispatch(setReduxList([]));
        }
      });
  }

  function onSearch(text) {
    setKeyword(text);
    if (text.length == 0) {
      setList(data);
    } else {
      const newData = data.filter(item => {
        return (
          `${String(item.userId).toUpperCase()}`.indexOf(text.toUpperCase()) >
          -1
        );
      });
      setList(newData);
    }
  }

  function flatListItem(item) {
    return (
      <TouchableOpacity
        style={[styles.flatListItem]}
        onPress={() => navigation.navigate('UserDetails', {userData: item})}>
        <View
          style={[
            {
              flex: 1,
              backgroundColor: green,
              paddingHorizontal: '4%',
              justifyContent: 'center',
            },
          ]}>
          <Text style={[{color: backgroundColor}]}>User Id: {item.userId}</Text>
        </View>

        <View
          style={[
            {
              flex: 1,
              paddingHorizontal: '4%',
              justifyContent: 'center',
            },
          ]}>
          <Text
            style={[{color: backgroundColor, textTransform: 'capitalize'}]}
            numberOfLines={2}
            ellipsizeMode="tail">
            Title: {item.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[{flex: 1, backgroundColor: '#434343'}]}>
      <Text style={[{margin: '5%', color: yellow, textAlign: 'center'}]}>
        Items
      </Text>
      {loader ? (
        <LoaderIndicator />
      ) : (
        <FlatList
          data={dataReducer.list}
          contentContainerStyle={{padding: '3%'}}
          style={[{flex: 1}]}
          renderItem={({item}) => flatListItem(item)}
        />
      )}
    </View>
  );
}

function UserDetails({route}) {
  const item = route.params.userData;

  function textItem(title, value, style) {
    return (
      <Text
        style={[
          {
            color: backgroundColor,
            textTransform: 'capitalize',
            marginVertical: getHeight(1),
          },
          styles.textBold,
          style,
        ]}>
        {`${title}: `}
        <Text
          style={[
            {
              color: backgroundColor,
              textTransform: 'capitalize',
              fontWeight: '300',
            },
          ]}>
          {value}
        </Text>
      </Text>
    );
  }

  return (
    <View style={[styles.userDetails]}>
      <View
        style={[
          styles.flatListItem,
          {minHeight: getHeight(12), borderRadius: getHeight(1)},
        ]}>
        <View
          style={[
            {
              height: getHeight(5),
              backgroundColor: green,
              paddingHorizontal: '4%',
              justifyContent: 'center',
            },
          ]}>
          <Text style={[{color: backgroundColor, fontWeight: 'bold'}]}>
            User Id:{' '}
            <Text style={[{color: backgroundColor}]}>{item.userId}</Text>
          </Text>
        </View>

        <View
          style={[
            {
              paddingHorizontal: '4%',
              justifyContent: 'center',
            },
          ]}>
          {textItem('Title', item.title)}
          {textItem('Details', item.body, [{marginTop: 0}])}
        </View>
      </View>
    </View>
  );
}

export const LoaderIndicator = props => {
  const {value = 'Please wait...', color = '#EE4831'} = props;
  return (
    <View style={[styles.centerLoader]}>
      <ActivityIndicator color={color} size="large" animating={true} />
      <Text style={[{color: color, marginTop: '5%'}]}>{value}</Text>
    </View>
  );
};

const getHeight = percent => {
  return (Dimensions.get('window').height * percent) / 100;
};

const styles = StyleSheet.create({
  backgroundStyle: {
    flex: 1,
    backgroundColor: '#434343',
  },
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#434343',
  },
  splashImage: {
    height: '20%',
    aspectRatio: 1 / 1,
  },
  centerLoader: {
    flex: 1,
    position: 'absolute',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: '#00000080',
    zIndex: 1000,
  },
  flatListItem: {
    minHeight: getHeight(8),
    width: '100%',
    borderRadius: getHeight(2),
    marginBottom: getHeight(2),
    backgroundColor: '#F3EC18',
    overflow: 'hidden',
  },
  textBold: {fontWeight: 'bold'},
  userDetails: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#434343',
    paddingHorizontal: '5%',
  },
});

const green = '#5CD201';
const yellow = '#F3EC18';
const backgroundColor = '#434343';

export default App;
