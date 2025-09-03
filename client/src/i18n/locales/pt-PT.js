export default {
  // Título da aplicação e informações básicas
  app: {
    title: 'Everything AI Chat',
    subtitle: 'Cliente de pesquisa de ficheiros baseado em IA usando o serviço Everything'
  },
  
  // Controlos da janela
  window: {
    minimize: 'Minimizar',
    maximize: 'Maximizar',
    restore: 'Restaurar',
    close: 'Fechar'
  },
  
  // Estado da ligação
  status: {
    connected: 'Ligado',
    connecting: 'A ligar',
    disconnected: 'Desligado',
    ready: 'Pronto',
    searching: 'A pesquisar...',
    version: 'Everything v{version}'
  },
  
  // Funcionalidade de pesquisa
  search: {
    title: '🔍 Pesquisa Inteligente de Ficheiros',
    placeholder: 'Digite uma consulta em linguagem natural, a IA converterá para sintaxe Everything...',
    button: 'Pesquisar',
    searching: 'A pesquisar...',
    clear: 'Limpar Resultados',
    export: 'Exportar Resultados',
    duration: 'Pesquisa demorou: {duration}s',
    found: 'Encontrados {count} ficheiros',
    query: 'Usando consulta: {query}',
    noResults: 'Nenhum ficheiro correspondente encontrado',
    noResultsHint: 'Tente usar palavras-chave diferentes ou verifique se o Everything está em execução',
    welcome: 'Inicie a Sua Jornada de Pesquisa Inteligente',
    welcomeHint: 'Digite linguagem natural, a IA converterá para sintaxe de pesquisa precisa do Everything',
    suggestions: {
      title: '💡 Experimente estas pesquisas:',
      today_images: 'Imagens de hoje',
      large_videos: 'Vídeos maiores que 10MB',
      recent_docs: 'Documentos modificados esta semana'
    }
  },
  
  // Lista de ficheiros
  fileList: {
    columns: {
      name: 'Nome',
      path: 'Caminho',
      size: 'Tamanho',
      modified: 'Modificado',
      created: 'Criado',
      accessed: 'Acedido',
      attributes: 'Atributos',
      runCount: 'Cont. Execução',
      type: 'Tipo'
    },
    sort: {
      ascending: 'Ascendente',
      descending: 'Descendente'
    }
  },
  
  // Painel de debug
  debug: {
    title: '🤖 Debug de Resposta IA',
    clear: 'Limpar Output de Debug',
    hide: 'Ocultar Painel de Debug',
    empty: 'Aguardando resposta da IA...',
    emptyHint: 'O processo de resposta da IA em tempo real será mostrado aqui após a pesquisa',
    result: 'Resultado da conversão:',
    error: 'Erro:',
    timestamp: '{time}'
  },
  
  // Diálogo de configurações
  settings: {
    title: 'Configurações',
    close: 'Fechar',
    save: 'Guardar',
    saving: 'A guardar...',
    cancel: 'Cancelar',
    
    // Configurações de idioma
    language: {
      title: '🌍 Configurações de Idioma',
      description: 'Selecionar idioma da interface da aplicação',
      label: 'Idioma da Interface',
      current: 'Idioma atual: {language}'
    },
    
    // Configuração de campos de exibição
    display: {
      title: 'Configuração de Campos de Exibição',
      description: 'Selecionar quais campos mostrar nos resultados de pesquisa',
      fields: {
        accessed: 'Tempo de Acesso',
        attributes: 'Atributos do Ficheiro',
        created: 'Tempo de Criação',
        recentlyChanged: 'Alterado Recentemente',
        runCount: 'Cont. Execução',
        fileListFilename: 'Nome Lista Ficheiros'
      }
    },
    
    // Configuração OpenAI
    openai: {
      title: 'Configuração OpenAI',
      description: 'Configure a API OpenAI para ativar conversão de linguagem natural para sintaxe de pesquisa Everything',
      apiKey: {
        label: 'Chave API',
        placeholder: 'sk-...',
        help: 'A sua Chave API OpenAI para chamar modelos GPT para converter sintaxe de pesquisa'
      },
      baseUrl: {
        label: 'URL Base (Opcional)',
        placeholder: 'https://api.openai.com/v1',
        help: 'Endpoint API personalizado, suporta serviços de terceiros compatíveis'
      },
      model: {
        label: 'Modelo',
        placeholder: 'Digite ou selecione modelo',
        help: 'Digite nome do modelo personalizado ou selecione do histórico'
      },
      // Texto relacionado com testes
      test: 'Testar Ligação',
      testing: 'A testar...',
      testSuccess: 'Ligação API bem-sucedida! Modelo usado: {model}',
      testFailed: 'Ligação API falhou: {error}'
    },
    
    // Configuração do prompt do sistema
    systemPrompt: {
      title: '🤖 Configuração de Prompt do Sistema IA',
      description: 'Personalize o prompt do sistema IA para otimizar qualidade e estilo dos resultados de pesquisa. O prompt do sistema determina como a IA entende e converte as suas pesquisas em linguagem natural.',
      label: 'Prompt do Sistema',
      placeholder: 'Por favor digite prompt do sistema personalizado...',
      help: 'O prompt deve orientar a IA sobre como converter linguagem natural para sintaxe de pesquisa Everything. Deixe vazio para usar prompt padrão.',
      reset: '🔄 Repor para Padrão',
      preview: 'Visualizar Efeito',
      hidePreview: 'Ocultar Visualização',
      previewTitle: 'Visualização do Prompt',
      tips: {
        title: '💡 Dicas de Uso',
        guidanceTitle: 'Orientação Clara',
        guidance: 'Diga à IA como entender a intenção de pesquisa e converter para sintaxe Everything',
        examplesTitle: 'Incluir Exemplos',
        examples: 'Incluir alguns exemplos de conversão no prompt melhorará a precisão',
        conciseTitle: 'Manter Conciso',
        concise: 'Evite instruções demasiado complexas, mantenha o prompt claro e compreensível',
        testTitle: 'Testar Eficácia',
        test: 'Após modificação, pode verificar eficácia através de pesquisa real'
      }
    },
    
    // Configurações Everything
    everything: {
      title: 'Configurações Everything',
      description: 'Configurar automaticamente serviço HTTP Everything ou definir parâmetros de ligação manualmente',
      status: 'Estado Everything:',
      test: 'Testar Ligação',
      testing: 'A testar...',
      
      // Ligação automática
      autoConnect: {
        title: '🚀 Ligação com Um Clique ao Serviço Everything',
        description: 'Pesquisar automaticamente localização de instalação Everything, configurar serviço HTTP e estabelecer ligação',
        button: '🔗 Ligação com Um Clique ao Serviço Everything',
        connecting: 'A ligar...',
        manualPath: '📁 Definir Caminho Manualmente',
        progress: 'Progresso da Ligação:',
        
        manualPathSection: {
          label: 'Caminho de Instalação Everything',
          placeholder: 'ex: C:\\Program Files\\Everything\\Everything.exe',
          help: 'Pode inserir o caminho completo para Everything.exe ou o caminho do diretório de instalação',
          confirm: 'Confirmar Configuração',
          setting: 'A configurar...'
        },
        
        result: {
          port: '🌐 Porta do Serviço HTTP: {port}',
          installPath: '📁 Caminho de Instalação: {path}',
          credentials: '🔐 Credenciais de Acesso (Por favor guarde adequadamente):',
          username: 'Nome de Utilizador:',
          password: 'Palavra-passe:',
          showPassword: 'Mostrar Palavra-passe',
          hidePassword: 'Ocultar Palavra-passe',
          copy: 'Copiar',
          note: '💡 Estas credenciais foram automaticamente guardadas no ficheiro de configuração Everything e serão aplicadas automaticamente na próxima vez que Everything iniciar'
        }
      },
      
      // Configuração da porta
      port: {
        title: '🌐 Configuração da Porta',
        description: 'Configurar porta de ligação do serviço HTTP Everything',
        auto: 'Seleção Automática de Porta (Recomendado)',
        autoDescription: 'O sistema encontrará automaticamente portas disponíveis, priorizando portas comuns como 8080, 8888, etc.',
        fixed: 'Porta Fixa',
        fixedDescription: 'Usar porta fixa especificada, a ligação falhará se a porta estiver ocupada',
        portLabel: 'Número da Porta',
        portPlaceholder: '8080',
        portHelp: 'Intervalo da porta: 1-65535, recomendado: 8080, 8888, 9080, etc.',
        portError: 'Por favor digite número de porta válido (1-65535)',
        suggestions: 'Portas comuns:'
      },
      
      // Configuração atual
      currentConfig: {
        title: 'Configuração Atual',
        portMode: 'Modo da Porta:',
        httpPort: 'Porta HTTP:',
        configPort: 'Porta Config:',
        installPath: 'Caminho de Instalação:',
        authStatus: 'Estado de Autenticação:',
        loginUser: 'Utilizador de Login:',
        notSet: 'Não Definido',
        enabled: '✅ Ativado',
        disabled: '❌ Desativado',
        autoMode: 'Seleção Auto',
        fixedMode: 'Porta Fixa'
      },
      
      // Informação
      info: {
        title: 'Descrição:',
        autoConnect: 'Ligação com um clique: Pesquisar automaticamente localização de instalação Everything, configurar serviço HTTP, nenhuma operação manual necessária',
        autoHandle: 'Manuseamento automático: Fechará automaticamente processos Everything existentes, modificará ficheiros de configuração, reiniciará serviço',
        portSelection: 'Seleção de porta: Seleção automática de portas não ocupadas (priorizando 8080, 8888, etc.)',
        compatibility: 'Compatibilidade: Suporta Everything 1.4 e superior'
      }
    },
    
    // Aviso de alterações não guardadas
    unsaved: {
      warning: 'Alterações não guardadas detetadas, será guardado automaticamente e fechado em 3 segundos',
      saveNow: 'Guardar Agora',
      discard: 'Descartar Alterações'
    }
  },
  
  // Mensagens de aviso
  messages: {
    success: {
      configSaved: 'Configuração guardada com sucesso',
      exported: 'Resultados exportados com sucesso',
      connected: 'Ligação Everything bem-sucedida!',
      pathSet: 'Caminho Everything definido com sucesso'
    },
    
    error: {
      configSaveFailed: 'Falha ao guardar configuração',
      connectionFailed: 'Falha de ligação Everything',
      exportFailed: 'Falha de exportação',
      searchFailed: 'Pesquisa falhada, erro desconhecido',
      searchError: 'Erro ocorreu durante pesquisa: {error}',
      loadConfigFailed: 'Falha ao carregar configuração',
      invalidPort: 'Número de porta inválido',
      pathSetFailed: 'Falha ao definir caminho Everything'
    },
    
    info: {
      ok: 'OK',
      loading: 'A carregar...',
      processing: 'A processar...',
      testing: 'A testar...'
    }
  },
  
  // Menu contextual
  contextMenu: {
    open: 'Abrir',
    openWith: 'Abrir com...',
    showInExplorer: 'Mostrar no Explorador',
    copyPath: 'Copiar Caminho',
    copyName: 'Copiar Nome',
    properties: 'Propriedades'
  },
  
  // Formato de tempo
  time: {
    now: 'Agora mesmo',
    minute: 'há {count} minuto{count, plural, one {} other{s}}',
    hour: 'há {count} hora{count, plural, one {} other{s}}',
    day: 'há {count} dia{count, plural, one {} other{s}}',
    week: 'há {count} semana{count, plural, one {} other{s}}',
    month: 'há {count} mês{count, plural, one {} other{es}}',
    year: 'há {count} ano{count, plural, one {} other{s}}'
  }
}
