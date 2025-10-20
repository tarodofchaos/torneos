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
      calendar: {
        title: 'Upcoming Tournaments',
        loading: 'Loading tournaments...',
        errorLoading: 'Error loading tournaments',
        noTournaments: 'No tournaments scheduled yet.',
        signupSuccess: 'Successfully signed up for the tournament!'
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
        viewSignups: 'View Signups',
        loading: 'Loading...',
        name: 'Name',
        type: 'Type',
        date: 'Date',
        signups: 'Signups',
        actions: 'Actions',
        confirmDelete: 'Are you sure you want to delete this tournament?',
        failedDelete: 'Failed to delete tournament',
        failedSave: 'Failed to save tournament'
      },
      form: {
        name: 'Name',
        type: 'Type',
        maxPlayers: 'Max Players',
        date: 'Date',
        startTime: 'Start Time',
        location: 'Location',
        description: 'Description',
        rules: 'Rules',
        prizes: 'Prizes',
        status: 'Status',
        saving: 'Saving...',
        updateTournament: 'Update Tournament',
        createTournament: 'Create Tournament',
        cancel: 'Cancel',
        namePlaceholder: 'Commander Night',
        locationPlaceholder: 'Local Game Store, Huelva',
        descriptionPlaceholder: 'Brief description of the tournament...',
        rulesPlaceholder: 'Tournament rules and format details...',
        prizesPlaceholder: 'Prize structure (e.g., 1st: Booster Box, 2nd: 12 Boosters...)'
      },
      signup: {
        spotsRemaining: '{{count}} spots remaining',
        fullMessage: 'This tournament has reached maximum capacity',
        close: 'Close',
        playerName: 'Player Name',
        required: 'Required',
        email: 'Email',
        emailOptional: 'Optional - for updates',
        phone: 'Phone',
        optional: 'Optional',
        notes: 'Notes',
        signingUp: 'Signing up...',
        playerNameRequired: 'Player name is required',
        failedSignup: 'Failed to sign up',
        yourNamePlaceholder: 'Your name',
        emailPlaceholder: 'your.email@example.com',
        phonePlaceholder: '+34 123 456 789',
        notesPlaceholder: 'Any special requirements or comments...',
        noAccountNeeded: 'No account needed! Just enter your name to sign up.'
      },
      manage: {
        title: 'Manage Signups',
        totalSignups: 'Total Signups',
        paid: 'Paid',
        unpaid: 'Unpaid',
        loading: 'Loading signups...',
        noSignups: 'No signups yet',
        signedUp: 'Signed up',
        markAsPaid: 'Mark as paid',
        markAsUnpaid: 'Mark as unpaid',
        sendEmail: 'Send email',
        sendWhatsApp: 'Send WhatsApp',
        removeSignup: 'Remove signup',
        close: 'Close',
        confirmRemove: 'Remove {{name}} from this tournament?',
        failedUpdate: 'Failed to update payment status',
        failedRemove: 'Failed to remove signup',
        noEmail: 'No email provided for this participant',
        noPhone: 'No phone number provided for this participant',
        whatsAppMessage: 'Hi! Regarding {{tournament}} tournament...'
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
      calendar: {
        title: 'Próximos Torneos',
        loading: 'Cargando torneos...',
        errorLoading: 'Error al cargar torneos',
        noTournaments: 'No hay torneos programados aún.',
        signupSuccess: '¡Inscripción exitosa al torneo!'
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
        viewSignups: 'Ver Inscripciones',
        loading: 'Cargando...',
        name: 'Nombre',
        type: 'Tipo',
        date: 'Fecha',
        signups: 'Inscripciones',
        actions: 'Acciones',
        confirmDelete: '¿Está seguro de que desea eliminar este torneo?',
        failedDelete: 'Error al eliminar el torneo',
        failedSave: 'Error al guardar el torneo'
      },
      form: {
        name: 'Nombre',
        type: 'Tipo',
        maxPlayers: 'Jugadores Máx',
        date: 'Fecha',
        startTime: 'Hora de Inicio',
        location: 'Ubicación',
        description: 'Descripción',
        rules: 'Reglas',
        prizes: 'Premios',
        status: 'Estado',
        saving: 'Guardando...',
        updateTournament: 'Actualizar Torneo',
        createTournament: 'Crear Torneo',
        cancel: 'Cancelar',
        namePlaceholder: 'Noche de Commander',
        locationPlaceholder: 'Tienda Local, Huelva',
        descriptionPlaceholder: 'Breve descripción del torneo...',
        rulesPlaceholder: 'Reglas del torneo y detalles del formato...',
        prizesPlaceholder: 'Estructura de premios (ej: 1º: Caja de Sobres, 2º: 12 Sobres...)'
      },
      signup: {
        spotsRemaining: '{{count}} lugares restantes',
        fullMessage: 'Este torneo ha alcanzado su capacidad máxima',
        close: 'Cerrar',
        playerName: 'Nombre del Jugador',
        required: 'Requerido',
        email: 'Email',
        emailOptional: 'Opcional - para actualizaciones',
        phone: 'Teléfono',
        optional: 'Opcional',
        notes: 'Notas',
        signingUp: 'Inscribiendo...',
        playerNameRequired: 'El nombre del jugador es requerido',
        failedSignup: 'Error al inscribirse',
        yourNamePlaceholder: 'Tu nombre',
        emailPlaceholder: 'tu.email@ejemplo.com',
        phonePlaceholder: '+34 123 456 789',
        notesPlaceholder: 'Requisitos especiales o comentarios...',
        noAccountNeeded: '¡No necesitas cuenta! Solo ingresa tu nombre para inscribirte.'
      },
      manage: {
        title: 'Gestionar Inscripciones',
        totalSignups: 'Total Inscripciones',
        paid: 'Pagado',
        unpaid: 'Sin Pagar',
        loading: 'Cargando inscripciones...',
        noSignups: 'Sin inscripciones aún',
        signedUp: 'Inscrito',
        markAsPaid: 'Marcar como pagado',
        markAsUnpaid: 'Marcar como sin pagar',
        sendEmail: 'Enviar email',
        sendWhatsApp: 'Enviar WhatsApp',
        removeSignup: 'Eliminar inscripción',
        close: 'Cerrar',
        confirmRemove: '¿Eliminar a {{name}} de este torneo?',
        failedUpdate: 'Error al actualizar estado de pago',
        failedRemove: 'Error al eliminar inscripción',
        noEmail: 'No hay email proporcionado para este participante',
        noPhone: 'No hay número de teléfono proporcionado para este participante',
        whatsAppMessage: '¡Hola! Respecto al torneo {{tournament}}...'
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

