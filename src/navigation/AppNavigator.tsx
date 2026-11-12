import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TelaInicial from '../screens/Inicial';
import TelaSinaisVitais from '../screens/SinaisVitais';
import TelaHumor from '../screens/Humor';
import TelaLembretes from '../screens/Lembretes';
import TelaLogin from '../screens/Login';
import TelaCadastro from '../screens/Cadastro';
import TelaPerfil from '../screens/Perfil';
import TelaFisioterapia from '../screens/Fisioterapia';
import TelaConfiguracoes from '../screens/Configuracoes';
import TelaSobreUNC from '../screens/SobreUNC';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { buscarPerfil } from '../services/db';
import { useStore } from '../store/useStore';

export type RootStackParamList = {
  Login: undefined;
  Cadastro: undefined;
  Perfil: undefined;
  Inicial: undefined;
  SinaisVitais: undefined;
  Humor: undefined;
  Lembretes: undefined;
  Fisioterapia: undefined;
  Configuracoes: undefined;
  SobreUNC: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export default function AppNavigator() {
  const [sessionChecked, setSessionChecked] = useState(!isSupabaseConfigured);
  const [initialRoute, setInitialRoute] = useState<'Login' | 'Inicial'>('Login');

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return;
    }

    let isMounted = true;

    const carregarPerfilSessao = async (userId: string) => {
      try {
        const perfilNuvem = await buscarPerfil(userId);
        if (perfilNuvem && isMounted) {
          useStore.getState().updatePerfil(perfilNuvem);
        }
      } catch (err) {
        console.warn('Não foi possível sincronizar o perfil da sessão:', err);
      }
    };

    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (!isMounted) return;
        if (session?.user) {
          setInitialRoute('Inicial');
          void carregarPerfilSessao(session.user.id);
        } else {
          setInitialRoute('Login');
        }
      })
      .catch(() => {
        if (isMounted) setInitialRoute('Login');
      })
      .finally(() => {
        if (isMounted) setSessionChecked(true);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        void carregarPerfilSessao(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        if (navigationRef.isReady()) {
          const current = navigationRef.getCurrentRoute()?.name;
          if (current !== 'Login' && current !== 'Cadastro') {
            navigationRef.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (!sessionChecked) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' }}>
        <ActivityIndicator size="large" color="#0056b3" />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#F8F9FA' } }}
      >
        <Stack.Screen name="Login" component={TelaLogin} />
        <Stack.Screen name="Cadastro" component={TelaCadastro} />
        <Stack.Screen name="Perfil" component={TelaPerfil} />
        <Stack.Screen name="Inicial" component={TelaInicial} />
        <Stack.Screen name="SinaisVitais" component={TelaSinaisVitais} />
        <Stack.Screen name="Humor" component={TelaHumor} />
        <Stack.Screen name="Lembretes" component={TelaLembretes} />
        <Stack.Screen name="Fisioterapia" component={TelaFisioterapia} />
        <Stack.Screen name="Configuracoes" component={TelaConfiguracoes} />
        <Stack.Screen name="SobreUNC" component={TelaSobreUNC} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
