import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TelaInicial from '../screens/Inicial';
import TelaSinaisVitais from '../screens/SinaisVitais';
import TelaHumor from '../screens/Humor';
import TelaLembretes from '../screens/Lembretes';
import TelaLogin from '../screens/Login';
import TelaCadastro from '../screens/Cadastro';
import TelaPerfil from '../screens/Perfil';
import TelaFarmacia from '../screens/Farmacia';
import TelaEnfermagem from '../screens/Enfermagem';
import TelaEducacaoFisica from '../screens/EducacaoFisica';
import TelaPsicologia from '../screens/Psicologia';
import TelaFisioterapia from '../screens/Fisioterapia';
import TelaConfiguracoes from '../screens/Configuracoes';

export type RootStackParamList = {
  Login: undefined;
  Cadastro: undefined;
  Perfil: undefined;
  Inicial: undefined;
  SinaisVitais: undefined;
  Humor: undefined;
  Lembretes: undefined;
  Farmacia: undefined;
  Enfermagem: undefined;
  EducacaoFisica: undefined;
  Psicologia: undefined;
  Fisioterapia: undefined;
  Configuracoes: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#F8F9FA' } }}>
        <Stack.Screen name="Login" component={TelaLogin} />
        <Stack.Screen name="Cadastro" component={TelaCadastro} />
        <Stack.Screen name="Perfil" component={TelaPerfil} />
        <Stack.Screen name="Inicial" component={TelaInicial} />
        <Stack.Screen name="SinaisVitais" component={TelaSinaisVitais} />
        <Stack.Screen name="Humor" component={TelaHumor} />
        <Stack.Screen name="Lembretes" component={TelaLembretes} />
        <Stack.Screen name="Farmacia" component={TelaFarmacia} />
        <Stack.Screen name="Enfermagem" component={TelaEnfermagem} />
        <Stack.Screen name="EducacaoFisica" component={TelaEducacaoFisica} />
        <Stack.Screen name="Psicologia" component={TelaPsicologia} />
        <Stack.Screen name="Fisioterapia" component={TelaFisioterapia} />
        <Stack.Screen name="Configuracoes" component={TelaConfiguracoes} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

