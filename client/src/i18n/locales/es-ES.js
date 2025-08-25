export default {
  // Título de la aplicación e información básica
  app: {
    title: 'Everything AI Chat',
    subtitle: 'Cliente de búsqueda de archivos impulsado por IA basado en el servicio de búsqueda Everything'
  },
  
  // Controles de ventana
  window: {
    minimize: 'Minimizar',
    maximize: 'Maximizar',
    restore: 'Restaurar',
    close: 'Cerrar'
  },
  
  // Estado de conexión
  status: {
    connected: 'Conectado',
    connecting: 'Conectando',
    disconnected: 'Desconectado',
    ready: 'Listo',
    searching: 'Buscando...',
    version: 'Everything v{version}'
  },
  
  // Funcionalidad de búsqueda
  search: {
    title: '🔍 Búsqueda Inteligente de Archivos',
    placeholder: 'Ingrese consulta en lenguaje natural, la IA la convertirá a sintaxis de Everything...',
    button: 'Buscar',
    searching: 'Buscando...',
    clear: 'Limpiar Resultados',
    export: 'Exportar Resultados',
    duration: 'Búsqueda tomó: {duration}s',
    found: 'Encontrados {count} archivos',
    query: 'Usando consulta: {query}',
    noResults: 'No se encontraron archivos coincidentes',
    noResultsHint: 'Intente usar diferentes palabras clave o verifique si Everything está ejecutándose',
    welcome: 'Comience Su Viaje de Búsqueda Inteligente',
    welcomeHint: 'Ingrese lenguaje natural, la IA lo convertirá a sintaxis de búsqueda precisa de Everything',
    suggestions: {
      title: '💡 Pruebe estas búsquedas:',
      today_images: 'Imágenes de hoy',
      large_videos: 'Videos mayores a 10MB',
      recent_docs: 'Documentos modificados esta semana'
    }
  },
  
  // Lista de archivos
  fileList: {
    columns: {
      name: 'Nombre',
      path: 'Ruta',
      size: 'Tamaño',
      modified: 'Modificado',
      created: 'Creado',
      accessed: 'Accedido',
      attributes: 'Atributos',
      runCount: 'Cont. Ejecución',
      type: 'Tipo'
    },
    sort: {
      ascending: 'Ascendente',
      descending: 'Descendente'
    }
  },
  
  // Panel de depuración
  debug: {
    title: '🤖 Debug de Respuesta IA',
    clear: 'Limpiar Salida de Debug',
    hide: 'Ocultar Panel de Debug',
    empty: 'Esperando respuesta de IA...',
    emptyHint: 'El proceso de respuesta IA en tiempo real se mostrará aquí después de la búsqueda',
    result: 'Resultado de conversión:',
    error: 'Error:',
    timestamp: '{time}'
  },
  
  // Diálogo de configuración
  settings: {
    title: 'Configuración',
    close: 'Cerrar',
    save: 'Guardar',
    saving: 'Guardando...',
    cancel: 'Cancelar',
    
    // Configuración de idioma
    language: {
      title: '🌍 Configuración de Idioma',
      description: 'Seleccionar idioma de la interfaz de la aplicación',
      label: 'Idioma de Interfaz',
      current: 'Idioma actual: {language}'
    },
    
    // Configuración de campos de visualización
    display: {
      title: 'Configuración de Campos de Visualización',
      description: 'Seleccionar qué campos mostrar en los resultados de búsqueda',
      fields: {
        accessed: 'Tiempo de Acceso',
        attributes: 'Atributos de Archivo',
        created: 'Tiempo de Creación',
        recentlyChanged: 'Cambiado Recientemente',
        runCount: 'Cont. Ejecución',
        fileListFilename: 'Nombre Lista Archivos'
      }
    },
    
    // Configuración de OpenAI
    openai: {
      title: 'Configuración OpenAI',
      description: 'Configure la API de OpenAI para habilitar la conversión de lenguaje natural a sintaxis de búsqueda Everything',
      apiKey: {
        label: 'Clave API',
        placeholder: 'sk-...',
        help: 'Su Clave API de OpenAI para llamar modelos GPT para convertir sintaxis de búsqueda'
      },
      baseUrl: {
        label: 'URL Base (Opcional)',
        placeholder: 'https://api.openai.com/v1',
        help: 'Endpoint API personalizado, soporta servicios de terceros compatibles'
      },
      model: {
        label: 'Modelo',
        placeholder: 'Ingrese o seleccione modelo',
        help: 'Ingrese nombre de modelo personalizado o seleccione del historial'
      }
    },
    
    // Configuración del prompt del sistema
    systemPrompt: {
      title: '🤖 Configuración de Prompt del Sistema IA',
      description: 'Personalice el prompt del sistema IA para optimizar la calidad y estilo de los resultados de búsqueda. El prompt del sistema determina cómo la IA entiende y convierte sus búsquedas en lenguaje natural.',
      label: 'Prompt del Sistema',
      placeholder: 'Por favor ingrese prompt del sistema personalizado...',
      help: 'El prompt debe guiar a la IA sobre cómo convertir lenguaje natural a sintaxis de búsqueda Everything. Deje vacío para usar prompt por defecto.',
      reset: '🔄 Resetear a Por Defecto',
      preview: 'Vista Previa del Efecto',
      hidePreview: 'Ocultar Vista Previa',
      previewTitle: 'Vista Previa del Prompt',
      tips: {
        title: '💡 Consejos de Uso',
        guidanceTitle: 'Guía Clara',
        guidance: 'Diga a la IA cómo entender la intención de búsqueda y convertir a sintaxis Everything',
        examplesTitle: 'Incluir Ejemplos',
        examples: 'Incluir algunos ejemplos de conversión en el prompt mejorará la precisión',
        conciseTitle: 'Mantener Conciso',
        concise: 'Evite instrucciones demasiado complejas, mantenga el prompt claro y comprensible',
        testTitle: 'Probar Efectividad',
        test: 'Después de la modificación, puede verificar la efectividad a través de búsqueda real'
      }
    },
    
    // Configuración de Everything
    everything: {
      title: 'Configuración de Everything',
      description: 'Auto-configurar servicio HTTP de Everything o establecer parámetros de conexión manualmente',
      status: 'Estado de Everything:',
      test: 'Probar Conexión',
      testing: 'Probando...',
      
      // Conexión automática
      autoConnect: {
        title: '🚀 Conexión de Un Clic al Servicio Everything',
        description: 'Buscar automáticamente la ubicación de instalación de Everything, configurar servicio HTTP y establecer conexión',
        button: '🔗 Conexión de Un Clic al Servicio Everything',
        connecting: 'Conectando...',
        manualPath: '📁 Establecer Ruta Manualmente',
        progress: 'Progreso de Conexión:',
        
        manualPathSection: {
          label: 'Ruta de Instalación de Everything',
          placeholder: 'ej.: C:\\Program Files\\Everything\\Everything.exe',
          help: 'Puede ingresar la ruta completa a Everything.exe o la ruta del directorio de instalación',
          confirm: 'Confirmar Configuración',
          setting: 'Configurando...'
        },
        
        result: {
          port: '🌐 Puerto del Servicio HTTP: {port}',
          installPath: '📁 Ruta de Instalación: {path}',
          credentials: '🔐 Credenciales de Acceso (Por favor guarde apropiadamente):',
          username: 'Nombre de Usuario:',
          password: 'Contraseña:',
          showPassword: 'Mostrar Contraseña',
          hidePassword: 'Ocultar Contraseña',
          copy: 'Copiar',
          note: '💡 Estas credenciales han sido guardadas automáticamente en el archivo de configuración de Everything y se aplicarán automáticamente la próxima vez que Everything inicie'
        }
      },
      
      // Configuración de puerto
      port: {
        title: '🌐 Configuración de Puerto',
        description: 'Configurar puerto de conexión del servicio HTTP de Everything',
        auto: 'Selección Automática de Puerto (Recomendado)',
        autoDescription: 'El sistema encontrará automáticamente puertos disponibles, priorizando puertos comunes como 8080, 8888, etc.',
        fixed: 'Puerto Fijo',
        fixedDescription: 'Usar puerto fijo especificado, la conexión fallará si el puerto está ocupado',
        portLabel: 'Número de Puerto',
        portPlaceholder: '8080',
        portHelp: 'Rango de puerto: 1-65535, recomendado: 8080, 8888, 9080, etc.',
        portError: 'Por favor ingrese número de puerto válido (1-65535)',
        suggestions: 'Puertos comunes:'
      },
      
      // Configuración actual
      currentConfig: {
        title: 'Configuración Actual',
        portMode: 'Modo de Puerto:',
        httpPort: 'Puerto HTTP:',
        configPort: 'Puerto Config:',
        installPath: 'Ruta de Instalación:',
        authStatus: 'Estado de Auth:',
        loginUser: 'Usuario de Login:',
        notSet: 'No Establecido',
        enabled: '✅ Habilitado',
        disabled: '❌ Deshabilitado',
        autoMode: 'Selección Auto',
        fixedMode: 'Puerto Fijo'
      },
      
      // Información
      info: {
        title: 'Descripción:',
        autoConnect: 'Conexión de un clic: Buscar automáticamente ubicación de instalación de Everything, configurar servicio HTTP, no se requiere operación manual',
        autoHandle: 'Manejo automático: Cerrará automáticamente procesos de Everything existentes, modificará archivos de config, reiniciará servicio',
        portSelection: 'Selección de puerto: Selección automática de puertos desocupados (priorizando 8080, 8888, etc.)',
        compatibility: 'Compatibilidad: Soporta Everything 1.4 y superior'
      }
    },
    
    // Advertencia de cambios no guardados
    unsaved: {
      warning: 'Cambios no guardados detectados, se auto-guardará y cerrará en 3 segundos',
      saveNow: 'Guardar Ahora',
      discard: 'Descartar Cambios'
    }
  },
  
  // Mensajes de aviso
  messages: {
    success: {
      configSaved: 'Configuración guardada exitosamente',
      exported: 'Resultados exportados exitosamente',
      connected: '¡Conexión a Everything exitosa!',
      pathSet: 'Ruta de Everything establecida exitosamente'
    },
    
    error: {
      configSaveFailed: 'Fallo al guardar configuración',
      connectionFailed: 'Fallo de conexión a Everything',
      exportFailed: 'Fallo de exportación',
      searchFailed: 'Búsqueda falló, error desconocido',
      searchError: 'Error ocurrió durante búsqueda: {error}',
      loadConfigFailed: 'Fallo al cargar configuración',
      invalidPort: 'Número de puerto inválido',
      pathSetFailed: 'Fallo al establecer ruta de Everything'
    },
    
    info: {
      ok: 'OK',
      loading: 'Cargando...',
      processing: 'Procesando...',
      testing: 'Probando...'
    }
  },
  
  // Menú contextual
  contextMenu: {
    open: 'Abrir',
    openWith: 'Abrir con...',
    showInExplorer: 'Mostrar en Explorador',
    copyPath: 'Copiar Ruta',
    copyName: 'Copiar Nombre',
    properties: 'Propiedades'
  },
  
  // Formato de tiempo
  time: {
    now: 'Ahora mismo',
    minute: 'hace {count} minuto{count, plural, one {} other{s}}',
    hour: 'hace {count} hora{count, plural, one {} other{s}}',
    day: 'hace {count} día{count, plural, one {} other{s}}',
    week: 'hace {count} semana{count, plural, one {} other{s}}',
    month: 'hace {count} mes{count, plural, one {} other{es}}',
    year: 'hace {count} año{count, plural, one {} other{s}}'
  }
}
