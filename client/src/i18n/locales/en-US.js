export default {
  // Application title and basic information
  app: {
    title: 'Everything AI Chat',
    subtitle: 'AI-powered file search client based on Everything search service'
  },
  
  // Window controls
  window: {
    minimize: 'Minimize',
    maximize: 'Maximize',
    restore: 'Restore',
    close: 'Close'
  },
  
  // Connection status
  status: {
    connected: 'Connected',
    connecting: 'Connecting',
    disconnected: 'Disconnected',
    ready: 'Ready',
    searching: 'Searching...',
    version: 'Everything v{version}'
  },
  
  // Search functionality
  search: {
    title: '🔍 Smart File Search',
    placeholder: 'Enter natural language query, AI will convert to Everything syntax...',
    button: 'Search',
    searching: 'Searching...',
    clear: 'Clear Results',
    export: 'Export Results',
    duration: 'Search took: {duration}s',
    found: 'Found {count} files',
    query: 'Using query: {query}',
    noResults: 'No matching files found',
    noResultsHint: 'Try using different keywords or check if Everything is running',
    welcome: 'Start Your Smart Search Journey',
    welcomeHint: 'Enter natural language, AI will convert it to Everything precise search syntax',
    suggestions: {
      title: '💡 Try these searches:',
      today_images: "Today's images",
      large_videos: 'Videos larger than 10MB',
      recent_docs: 'Documents modified this week'
    }
  },
  
  // File list
  fileList: {
    columns: {
      name: 'Name',
      path: 'Path',
      size: 'Size',
      modified: 'Modified',
      created: 'Created',
      accessed: 'Accessed',
      attributes: 'Attributes',
      runCount: 'Run Count',
      type: 'Type'
    },
    sort: {
      ascending: 'Ascending',
      descending: 'Descending'
    }
  },
  
  // Debug panel
  debug: {
    title: '🤖 AI Response Debug',
    clear: 'Clear Debug Output',
    hide: 'Hide Debug Panel',
    empty: 'Waiting for AI response...',
    emptyHint: 'Real-time AI response process will be shown here after search',
    result: 'Conversion result:',
    error: 'Error:',
    timestamp: '{time}'
  },
  
  // Settings dialog
  settings: {
    title: 'Settings',
    close: 'Close',
    save: 'Save',
    saving: 'Saving...',
    cancel: 'Cancel',
    
    // Language settings
    language: {
      title: '🌍 Language Settings',
      description: 'Select application interface language',
      label: 'Interface Language',
      current: 'Current language: {language}'
    },
    
    // Display fields configuration
    display: {
      title: 'Display Fields Configuration',
      description: 'Select which fields to display in search results',
      fields: {
        accessed: 'Access Time',
        attributes: 'File Attributes',
        created: 'Creation Time',
        recentlyChanged: 'Recently Changed',
        runCount: 'Run Count',
        fileListFilename: 'File List Name'
      }
    },
    
    // OpenAI configuration
    openai: {
      title: 'OpenAI Configuration',
      description: 'Configure OpenAI API to enable natural language to Everything search syntax conversion',
      apiKey: {
        label: 'API Key',
        placeholder: 'sk-...',
        help: 'Your OpenAI API Key for calling GPT models to convert search syntax'
      },
      baseUrl: {
        label: 'Base URL (Optional)',
        placeholder: 'https://api.openai.com/v1',
        help: 'Custom API endpoint, supports compatible third-party services'
      },
      model: {
        label: 'Model',
        placeholder: 'Enter or select model',
        help: 'Enter custom model name or select from history'
      }
    },
    
    // System prompt configuration
    systemPrompt: {
      title: '🤖 AI System Prompt Configuration',
      description: 'Customize AI system prompt to optimize search result quality and style. The system prompt determines how AI understands and converts your natural language searches.',
      label: 'System Prompt',
      placeholder: 'Please enter custom system prompt...',
      help: 'The prompt should guide AI on how to convert natural language to Everything search syntax. Leave empty to use default prompt.',
      reset: '🔄 Reset to Default',
      preview: 'Preview Effect',
      hidePreview: 'Hide Preview',
      previewTitle: 'Prompt Preview',
      tips: {
        title: '💡 Usage Tips',
        guidance: 'Clear guidance: Tell AI how to understand search intent and convert to Everything syntax',
        examples: 'Include examples: Including some conversion examples in prompt will improve accuracy',
        concise: 'Keep concise: Avoid overly complex instructions, keep prompt clear and understandable',
        test: 'Test effectiveness: After modification, you can verify effectiveness through actual search'
      }
    },
    
    // Everything settings
    everything: {
      title: 'Everything Settings',
      description: 'Auto-configure Everything HTTP service or manually set connection parameters',
      status: 'Everything Status:',
      test: 'Test Connection',
      testing: 'Testing...',
      
      // Auto connect
      autoConnect: {
        title: '🚀 One-Click Connect to Everything Service',
        description: 'Automatically search Everything installation location, configure HTTP service and establish connection',
        button: '🔗 One-Click Connect Everything Service',
        connecting: 'Connecting...',
        manualPath: '📁 Set Path Manually',
        progress: 'Connection Progress:',
        
        manualPathSection: {
          label: 'Everything Installation Path',
          placeholder: 'e.g.: C:\\Program Files\\Everything\\Everything.exe',
          help: 'You can enter the full path to Everything.exe or the installation directory path',
          confirm: 'Confirm Setting',
          setting: 'Setting...'
        },
        
        result: {
          port: '🌐 HTTP Service Port: {port}',
          installPath: '📁 Installation Path: {path}',
          credentials: '🔐 Access Credentials (Please save properly):',
          username: 'Username:',
          password: 'Password:',
          showPassword: 'Show Password',
          hidePassword: 'Hide Password',
          copy: 'Copy',
          note: '💡 These credentials have been automatically saved to Everything configuration file and will be applied automatically next time Everything starts'
        }
      },
      
      // Port configuration
      port: {
        title: '🌐 Port Configuration',
        description: 'Configure Everything HTTP service connection port',
        auto: 'Auto Select Port (Recommended)',
        autoDescription: 'System will automatically find available ports, prioritizing common ports like 8080, 8888, etc.',
        fixed: 'Fixed Port',
        fixedDescription: 'Use specified fixed port, connection will fail if port is occupied',
        portLabel: 'Port Number',
        portPlaceholder: '8080',
        portHelp: 'Port range: 1-65535, recommended: 8080, 8888, 9080, etc.',
        portError: 'Please enter valid port number (1-65535)',
        suggestions: 'Common ports:'
      },
      
      // Current configuration
      currentConfig: {
        title: 'Current Configuration',
        portMode: 'Port Mode:',
        httpPort: 'HTTP Port:',
        configPort: 'Config Port:',
        installPath: 'Installation Path:',
        authStatus: 'Auth Status:',
        loginUser: 'Login User:',
        notSet: 'Not Set',
        enabled: '✅ Enabled',
        disabled: '❌ Disabled',
        autoMode: 'Auto Select',
        fixedMode: 'Fixed Port'
      },
      
      // Info
      info: {
        title: 'Description:',
        autoConnect: 'One-click connect: Automatically search Everything installation location, configure HTTP service, no manual operation required',
        autoHandle: 'Auto handling: Will automatically close existing Everything processes, modify config files, restart service',
        portSelection: 'Port selection: Auto select unoccupied ports (prioritizing 8080, 8888, etc.)',
        compatibility: 'Compatibility: Supports Everything 1.4 and above'
      }
    },
    
    // Unsaved changes warning
    unsaved: {
      warning: 'Unsaved changes detected, will auto-save and close in 3 seconds',
      saveNow: 'Save Now',
      discard: 'Discard Changes'
    }
  },
  
  // Message prompts
  messages: {
    success: {
      configSaved: 'Configuration saved successfully',
      exported: 'Results exported successfully',
      connected: 'Everything connection successful!',
      pathSet: 'Everything path set successfully'
    },
    
    error: {
      configSaveFailed: 'Configuration save failed',
      connectionFailed: 'Everything connection failed',
      exportFailed: 'Export failed',
      searchFailed: 'Search failed, unknown error',
      searchError: 'Error occurred during search: {error}',
      loadConfigFailed: 'Load configuration failed',
      invalidPort: 'Invalid port number',
      pathSetFailed: 'Everything path setting failed'
    },
    
    info: {
      ok: 'OK',
      loading: 'Loading...',
      processing: 'Processing...',
      testing: 'Testing...'
    }
  },
  
  // Context menu (possibly used in main process)
  contextMenu: {
    open: 'Open',
    openWith: 'Open with...',
    showInExplorer: 'Show in Explorer',
    copyPath: 'Copy Path',
    copyName: 'Copy Name',
    properties: 'Properties'
  },
  
  // Time format
  time: {
    now: 'Just now',
    minute: '{count} minute{count, plural, one {} other{s}} ago',
    hour: '{count} hour{count, plural, one {} other{s}} ago',
    day: '{count} day{count, plural, one {} other{s}} ago',
    week: '{count} week{count, plural, one {} other{s}} ago',
    month: '{count} month{count, plural, one {} other{s}} ago',
    year: '{count} year{count, plural, one {} other{s}} ago'
  }
}
