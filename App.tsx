import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TelaInicial from './src/telas/Inicial';
import TelaSinaisVitais from './src/telas/SinaisVitais';
import TelaHumor from './src/telas/Humor';
import TelaLembretes from './src/telas/Lembretes';
import TelaLogin from './src/telas/Login';
import TelaCadastro from './src/telas/Cadastro';
import TelaPerfil from './src/telas/Perfil';
import TelaFarmacia from './src/telas/Farmacia';
import TelaEnfermagem from './src/telas/Enfermagem';
import TelaEducacaoFisica from './src/telas/EducacaoFisica';
import TelaPsicologia from './src/telas/Psicologia';
import TelaFisioterapia from './src/telas/Fisioterapia';
import TelaConfiguracoes from './src/telas/Configuracoes';
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

export default function App() {
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
