// NickNameScreen.tsx
import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, Alert, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5'; // 아이콘 추가

const NickNameScreen = () => {
    const [nickname, setNickname] = useState('');
    const [inputNickname, setInputNickname] = useState('');

    useEffect(() => {
        const loadNickname = async () => {
            try {
                const storedNickname = await AsyncStorage.getItem('nickname');
                if (storedNickname !== null) {
                    setNickname(storedNickname);
                    setInputNickname(storedNickname);
                }
            } catch (error) {
                console.error('Failed to load nickname', error);
            }
        };

        loadNickname();
    }, []);

    const saveNickname = async () => {
        if (inputNickname.trim() === '') { // 공백도 체크
            Alert.alert('오류', '닉네임을 입력하세요');
            return;
        }
        try {
            await AsyncStorage.setItem('nickname', inputNickname);
            setNickname(inputNickname);
            Alert.alert('성공', '닉네임이 저장되었습니다.');
        } catch (error) {
            console.error('Failed to save nickname', error);
            Alert.alert('오류', '닉네임 저장을 실패했습니다.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.innerContainer}>
                <TextInput style={styles.input} placeholder='닉네임 입력' 
                value={inputNickname} 
                onChangeText={setInputNickname}
                />
                <TouchableOpacity style={styles.button} onPress={saveNickname}>
                    <Icon name="save" size={20} color="#fff" style={styles.icon} />
                    <Text style={styles.buttonText}>저장</Text>
                </TouchableOpacity>
                <Text style={styles.text}>
                    {nickname ? `현재 닉네임: ${nickname}` : '닉네임이 설정되지 않았습니다.'}
                </Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    innerContainer: { // 중첩된 View 스타일 수정
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    input: {
        height: 40,
        borderWidth: 2,
        borderColor: 'gray',
        marginVertical: 10,
        padding: 10,
        width: '80%',
    },
    button: {
        flexDirection: 'row',
        backgroundColor: '#3498db',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
    icon: {
        marginRight: 10,
    },
    text: {
        color: 'black',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
});

export default NickNameScreen;
