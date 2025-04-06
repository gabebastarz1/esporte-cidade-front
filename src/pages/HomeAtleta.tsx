import React, { useState, useEffect } from "react";
import { Navigate } from 'react-router-dom';
import AgendaSemanal from "../components/AgendaSemanal";
import FaltaAtleta from "../components/FaltaAtleta";
import FaltaProfessor from "../components/FaltaProfessor";
import CalendarioCompromissos from "../components/CalendarioCompromissos";
import useNavigateTo from "../hooks/useNavigateTo";
import HeaderBasic from "../components/navigation/HeaderBasic";
import FooterMobile from "../components/navigation/FooterMobile";
import { useUser, useAuthStatus } from '../hooks/useAuth';
import { useDecodedToken } from '../hooks/useDecodedToken';
import { AppSidebar } from '../components/navigation/AppSidebar-prof';
import {
  SidebarInset,
  SidebarProvider,
} from "../components/ui/sidebar"
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const HomeAtleta = () => {
  const userData = useUser();
  const { fetchUser } = useAuthStatus();
  const decodedToken = useDecodedToken();

  // Adicionando logs para debug
  console.log('decodedToken:', decodedToken);
  console.log('localStorage token:', localStorage.getItem('token'));

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Verifica se temos um usuário logado
        if (!userData) {
          console.log('Sem dados do usuário');
          // Tenta buscar os dados do usuário
          await fetchUser();
          return;
        }

        console.log('Tentando buscar dados do usuário com ID:', userData.id);
        // Busca os dados do usuário pelo ID
        const response = await api.get(`/athletes/${userData.id}`);
        console.log('Resposta da API:', response.data);
        
        if (response.data) {
          // Atualiza o contexto de autenticação
          await fetchUser();
        }
      } catch (error: any) {
        console.error('Error fetching user data:', error);
        if (error.response) {
          console.error('Response status:', error.response.status);
          console.error('Response data:', error.response.data);
        } else {
          console.error('Error details:', error.message || error);
        }
      }
    };

    // Só faz a requisição se tiver dados do usuário
    if (userData) {
      console.log('Iniciando busca de dados do usuário');
      fetchUserData();
    }
  }, [userData, fetchUser]);

  const { user, isAuthenticated } = useAuth();

  if (isAuthenticated === true) {
    return <Navigate to="/" replace />;
  }

  return (
    <SidebarProvider>
      <AppSidebar type="atleta" />
      <SidebarInset>
        <div className="min-h-screen bg-gray-100">
          <HeaderBasic
            type="usuario"
            links={[
              { label: "Home", path: "/home-atleta" },
              { label: "Faltas", path: "/home-atleta/faltas-atleta" },
              { label: "Modalidades", path: "/home-atleta/modalidade" },
              { label: "Horário", path: "/home-atleta/horarios" },
            ]}
          />

          <main className="w-full lg:w-3/4 mx-auto mt-8 p-4">
            <h2 className="text-2xl font-bold mb-4 text-left">
              Olá, <span className="text-[#EB8317]">{decodedToken?.name || 'Usuário'}</span>!
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="col-span-2 bg-[#d9d9d9] p-4 rounded border border-black shadow-md mb-4 md:mb-4 md:mr-4">
                <h3 className="font-semibold mb-2">HORÁRIO SEMANAL</h3>
                <AgendaSemanal />
              </div>

              <div className="row-span-2 bg-[#d9d9d9] p-4 rounded border border-black shadow-md mb-4 md:mb-0 md:mr-4">
                <h3 className="font-semibold mb-2">CALENDÁRIO DE COMPROMISSOS</h3>
                <CalendarioCompromissos />
              </div>

              <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#d9d9d9] p-4 rounded border border-black shadow-md mb-4 md:mb-0 md:mr-4">
                  <h3 className="font-semibold mb-2">AUSÊNCIA DE PROFESSOR</h3>
                  <FaltaProfessor />
                </div>

                <div className="bg-[#d9d9d9] p-4 rounded border border-black shadow-md md:mr-4">
                  <h3 className="font-semibold mb-2">FALTAS</h3>
                  <FaltaAtleta />
                </div>
              </div>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default HomeAtleta;
