import { SafeAreaView, StyleSheet, Text, TouchableOpacity, TextInput, View, Alert } from 'react-native';
import { useNavigation, ParamListBase } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import Icon from 'react-native-vector-icons/FontAwesome';
import { useState } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from './API';
import { resetCache } from '../metro.config';


function Login(): JSX.Element {
  console.log("-- Login()")
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>()
  
  const [userId, setUserId] = useState('');
  const [userPw, setUserPw] = useState('');
  const [disable, setDisable] = useState(true);

  const onIdChange = (newId: string) => {
    newId && userPw ? setDisable(false) : setDisable(true)
    setUserId(newId)
  }

  const onPwChange = (newPw: string) => {
    newPw && userId ? setDisable(false) : setDisable(true)        
    setUserPw(newPw)
  }  

  const gotoRegister = () => {
    navigation.push('Register')
  }

  const gotoMain = () => {
    AsyncStorage.setItem('userId', userId).then(() => {
      navigation.push('Main')
    })
  }

  const onLogin = async() => {
    let fcmToken = await AsyncStorage.getItem('fcmToken') || ""
    api.login(userId, userPw, `${fcmToken}`)
    .then( response => {
      console.log("API login / data = " + JSON.stringify(response.data[0]))
      let {code,message} = response.data[0]
      console.log("API login / code = " + code + ", message = " +  message)

      if (code==0) {
        gotoMain()
      }
      else {
        Alert.alert('오류', message, [{
          text: '확인',
          onPress: () => console.log('cancel Pressed'),
          style:'cancel'
        }])
      }
    })
    .catch(err => {
      console.log(JSON.stringify(err))
    })
 }
  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Icon name="drivers-license" size={80} color={'#3498db'} />  
      </View>
      <View style={styles.container}>
        <TextInput style={styles.input} placeholder={'아이디'} 
                  onChangeText={onIdChange}/>
        <TextInput style={styles.input} placeholder={'패스워드'} 
                  secureTextEntry={true} onChangeText={onPwChange} />
      </View>
      <View style={styles.container}>
        <TouchableOpacity style={disable ? styles.buttonDisable : styles.button} 
                          disabled={disable} onPress={onLogin}>
          <Text style={styles.buttonText}>로그인</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, {marginTop: 5}]} 
                          onPress={gotoRegister}>
          <Text style={styles.buttonText}>회원가입</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView> 
  )
}

// style 부분
const styles = StyleSheet.create({    
  container: {
    flex: 1,
    justifyContent: 'center', // 자식 요소들을 수직으로 중앙정렬
    alignItems: 'center',     // 자식 요소들을 수평으로 중앙정렬
    width: '100%',            // 부모 요소의 폭을 100% 사용함.
  },
  input: {
    width: '70%', // 입력란의 너비 조정
    height: 40, // 입력란의 높이 조정
    borderWidth: 1,
    borderColor: 'gray',
    marginVertical: 10, // 상하 여백 조정
    padding: 10,
  },
  button: {
    width: '70%', // 폭 : 70%
    backgroundColor: '#3498db', // 버튼 배경색
    paddingVertical: 10, // 수직 여백
    paddingHorizontal: 20, // 수평 여백
    borderRadius: 5, // 버튼 모서리 둥글기
  },
  buttonDisable: {
    width: '70%', // 폭 : 70%
    backgroundColor: 'gray', // 버튼 배경색
    paddingVertical: 10, // 수직 여백
    paddingHorizontal: 20, // 수평 여백
    borderRadius: 5, // 버튼 모서리 둥글기
  },
  buttonText: {
    color: 'white', // 버튼 텍스트 색상
    fontSize: 16, // 버튼 텍스트 크기
    textAlign: 'center', // 텍스트 가운데 정렬
  },
});

// export 
export default Login;