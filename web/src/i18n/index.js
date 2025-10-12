import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      app: {
        title: 'Torneos MTG',
        tagline: 'Tournament Management System'
      },
      nav: {
        calendar: 'Calendar',
        admin: 'Admin Panel'
      },
      auth: {
        login: 'Login with Google',
        logout: 'Logout'
      },
      tournament: {
        type: 'Type',
        date: 'Date',
        time: 'Time',
        location: 'Location',
        maxPlayers: 'Max Players',
        status: 'Status',
        description: 'Description',
        rules: 'Rules',
        prizes: 'Prizes',
        signups: 'Signups',
        signup: 'Sign Up',
        cancelSignup: 'Cancel Signup',
        spotsAvailable: '{{count}} spots available',
        tournamentFull: 'Tournament Full'
      },
      admin: {
        title: 'Admin Panel',
        createTournament: 'Create Tournament',
        editTournament: 'Edit Tournament',
        deleteTournament: 'Delete Tournament',
        viewSignups: 'View Signups'
      },
      footer: {
        disclaimer: 'This is a community tournament management system. Magic: The Gathering is property of Wizards of the Coast.',
        copyright: '© 2025 Torneos MTG'
      }
    }
  },
  es: {
    translation: {
      app: {
        title: 'Torneos MTG',
        tagline: 'Sistema de Gestión de Torneos'
      },
      nav: {
        calendar: 'Calendario',
        admin: 'Panel de Admin'
      },
      auth: {
        login: 'Iniciar sesión con Google',
        logout: 'Cerrar sesión'
      },
      tournament: {
        type: 'Tipo',
        date: 'Fecha',
        time: 'Hora',
        location: 'Ubicación',
        maxPlayers: 'Jugadores Máx',
        status: 'Estado',
        description: 'Descripción',
        rules: 'Reglas',
        prizes: 'Premios',
        signups: 'Inscripciones',
        signup: 'Inscribirse',
        cancelSignup: 'Cancelar Inscripción',
        spotsAvailable: '{{count}} lugares disponibles',
        tournamentFull: 'Torneo Lleno'
      },
      admin: {
        title: 'Panel de Administración',
        createTournament: 'Crear Torneo',
        editTournament: 'Editar Torneo',
        deleteTournament: 'Eliminar Torneo',
        viewSignups: 'Ver Inscripciones'
      },
      footer: {
        disclaimer: 'Este es un sistema comunitario de gestión de torneos. Magic: The Gathering es propiedad de Wizards of the Coast.',
        copyright: '© 2025 Torneos MTG'
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;

