export default {
  // Anwendungstitel und grundlegende Informationen
  app: {
    title: 'Everything AI Chat',
    subtitle: 'KI-basierter Dateisuchclient mit Everything-Suchdienst'
  },
  
  // Fenstersteuerung
  window: {
    minimize: 'Minimieren',
    maximize: 'Maximieren',
    restore: 'Wiederherstellen',
    close: 'Schließen'
  },
  
  // Verbindungsstatus
  status: {
    connected: 'Verbunden',
    connecting: 'Verbindung wird hergestellt',
    disconnected: 'Getrennt',
    ready: 'Bereit',
    searching: 'Suchen...',
    version: 'Everything v{version}'
  },
  
  // Suchfunktionalität
  search: {
    title: '🔍 Intelligente Dateisuche',
    placeholder: 'Geben Sie eine natürlichsprachige Anfrage ein, KI konvertiert zu Everything-Syntax...',
    button: 'Suchen',
    searching: 'Suchen...',
    clear: 'Ergebnisse löschen',
    export: 'Ergebnisse exportieren',
    duration: 'Suchdauer: {duration}s',
    found: '{count} Dateien gefunden',
    query: 'Verwendete Anfrage: {query}',
    noResults: 'Keine passenden Dateien gefunden',
    noResultsHint: 'Versuchen Sie andere Schlüsselwörter oder prüfen Sie, ob Everything läuft',
    welcome: 'Beginnen Sie Ihre intelligente Suchreise',
    welcomeHint: 'Geben Sie natürliche Sprache ein, KI konvertiert zu präziser Everything-Suchsyntax',
    suggestions: {
      title: '💡 Versuchen Sie diese Suchen:',
      today_images: 'Heutige Bilder',
      large_videos: 'Videos größer als 10MB',
      recent_docs: 'Diese Woche geänderte Dokumente'
    }
  },
  
  // Dateiliste
  fileList: {
    columns: {
      name: 'Name',
      path: 'Pfad',
      size: 'Größe',
      modified: 'Geändert',
      created: 'Erstellt',
      accessed: 'Zugegriffen',
      attributes: 'Attribute',
      runCount: 'Anzahl Ausführungen',
      type: 'Typ'
    },
    sort: {
      ascending: 'Aufsteigend',
      descending: 'Absteigend'
    }
  },
  
  // Debug-Panel
  debug: {
    title: '🤖 KI-Antwort Debug',
    clear: 'Debug-Ausgabe löschen',
    hide: 'Debug-Panel ausblenden',
    empty: 'Warten auf KI-Antwort...',
    emptyHint: 'KI-Echtzeitantwortprozess wird hier nach der Suche angezeigt',
    result: 'Konvertierungsergebnis:',
    error: 'Fehler:',
    timestamp: '{time}'
  },
  
  // Einstellungsdialog
  settings: {
    title: 'Einstellungen',
    close: 'Schließen',
    save: 'Speichern',
    saving: 'Speichern...',
    cancel: 'Abbrechen',
    
    // Spracheinstellungen
    language: {
      title: '🌍 Spracheinstellungen',
      description: 'Anwendungssprache auswählen',
      label: 'Oberflächensprache',
      current: 'Aktuelle Sprache: {language}'
    },
    
    // Anzeigefeld-Konfiguration
    display: {
      title: 'Anzeigefeld-Konfiguration',
      description: 'Wählen Sie aus, welche Felder in Suchergebnissen angezeigt werden sollen',
      fields: {
        accessed: 'Zugriffszeit',
        attributes: 'Dateiattribute',
        created: 'Erstellungszeit',
        recentlyChanged: 'Kürzlich geändert',
        runCount: 'Anzahl Ausführungen',
        fileListFilename: 'Dateilistenname'
      }
    },
    
    // OpenAI-Konfiguration
    openai: {
      title: 'OpenAI-Konfiguration',
      description: 'OpenAI API konfigurieren, um natürlichsprachige zu Everything-Suchsyntax-Konvertierung zu aktivieren',
      apiKey: {
        label: 'API-Schlüssel',
        placeholder: 'sk-...',
        help: 'Ihr OpenAI API-Schlüssel zum Aufrufen von GPT-Modellen für Suchsyntax-Konvertierung'
      },
      baseUrl: {
        label: 'Basis-URL (Optional)',
        placeholder: 'https://api.openai.com/v1',
        help: 'Benutzerdefinierter API-Endpunkt, unterstützt kompatible Drittanbieterdienste'
      },
      model: {
        label: 'Modell',
        placeholder: 'Modell eingeben oder auswählen',
        help: 'Benutzerdefinierten Modellnamen eingeben oder aus Verlauf auswählen'
      },
      // Test-bezogener Text
      test: 'Verbindung testen',
      testing: 'Teste...',
      testSuccess: 'API-Verbindung erfolgreich! Verwendetes Modell: {model}',
      testFailed: 'API-Verbindung fehlgeschlagen: {error}'
    },
    
    // System-Prompt-Konfiguration
    systemPrompt: {
      title: '🤖 KI-System-Prompt-Konfiguration',
      description: 'KI-System-Prompt anpassen, um Qualität und Stil der Suchergebnisse zu optimieren. Der System-Prompt bestimmt, wie KI Ihre natürlichsprachigen Suchen versteht und konvertiert.',
      label: 'System-Prompt',
      placeholder: 'Bitte geben Sie benutzerdefinierten System-Prompt ein...',
      help: 'Der Prompt sollte KI anleiten, wie natürliche Sprache in Everything-Suchsyntax konvertiert wird. Leer lassen für Standard-Prompt.',
      reset: '🔄 Auf Standard zurücksetzen',
      preview: 'Effekt-Vorschau',
      hidePreview: 'Vorschau ausblenden',
      previewTitle: 'Prompt-Vorschau',
      tips: {
        title: '💡 Verwendungstipps',
        guidanceTitle: 'Klare Anleitung',
        guidance: 'Sagen Sie KI, wie Suchabsicht zu verstehen und in Everything-Syntax zu konvertieren ist',
        examplesTitle: 'Beispiele einschließen',
        examples: 'Einige Konvertierungsbeispiele im Prompt verbessern die Genauigkeit',
        conciseTitle: 'Prägnant halten',
        concise: 'Vermeiden Sie zu komplexe Anweisungen, halten Sie Prompt klar und verständlich',
        testTitle: 'Effektivität testen',
        test: 'Nach Änderung können Sie Effektivität durch reale Suche überprüfen'
      }
    },
    
    // Everything-Einstellungen
    everything: {
      title: 'Everything-Einstellungen',
      description: 'Everything HTTP-Dienst automatisch konfigurieren oder Verbindungsparameter manuell festlegen',
      status: 'Everything-Status:',
      test: 'Verbindung testen',
      testing: 'Testen...',
      
      // Automatische Verbindung
      autoConnect: {
        title: '🚀 Ein-Klick-Verbindung zu Everything-Dienst',
        description: 'Everything-Installationsort automatisch suchen, HTTP-Dienst konfigurieren und Verbindung herstellen',
        button: '🔗 Ein-Klick-Verbindung zu Everything-Dienst',
        connecting: 'Verbindung wird hergestellt...',
        manualPath: '📁 Pfad manuell festlegen',
        progress: 'Verbindungsfortschritt:',
        
        manualPathSection: {
          label: 'Everything-Installationspfad',
          placeholder: 'z.B.: C:\\Program Files\\Everything\\Everything.exe',
          help: 'Sie können den vollständigen Pfad zu Everything.exe oder den Installationsverzeichnispfad eingeben',
          confirm: 'Einstellung bestätigen',
          setting: 'Einstellung...'
        },
        
        result: {
          port: '🌐 HTTP-Dienst-Port: {port}',
          installPath: '📁 Installationspfad: {path}',
          credentials: '🔐 Zugangsanmeldedaten (Bitte ordnungsgemäß speichern):',
          username: 'Benutzername:',
          password: 'Passwort:',
          showPassword: 'Passwort anzeigen',
          hidePassword: 'Passwort ausblenden',
          copy: 'Kopieren',
          note: '💡 Diese Anmeldedaten wurden automatisch in der Everything-Konfigurationsdatei gespeichert und werden beim nächsten Start von Everything automatisch angewandt'
        }
      },
      
      // Port-Konfiguration
      port: {
        title: '🌐 Port-Konfiguration',
        description: 'Everything HTTP-Dienst-Verbindungsport konfigurieren',
        auto: 'Automatische Port-Auswahl (Empfohlen)',
        autoDescription: 'System findet automatisch verfügbare Ports, priorisiert übliche Ports wie 8080, 8888 usw.',
        fixed: 'Fester Port',
        fixedDescription: 'Angegebenen festen Port verwenden, Verbindung schlägt fehl, wenn Port belegt ist',
        portLabel: 'Port-Nummer',
        portPlaceholder: '8080',
        portHelp: 'Port-Bereich: 1-65535, empfohlen: 8080, 8888, 9080 usw.',
        portError: 'Bitte geben Sie gültige Port-Nummer ein (1-65535)',
        suggestions: 'Übliche Ports:'
      },
      
      // Aktuelle Konfiguration
      currentConfig: {
        title: 'Aktuelle Konfiguration',
        portMode: 'Port-Modus:',
        httpPort: 'HTTP-Port:',
        configPort: 'Konfig-Port:',
        installPath: 'Installationspfad:',
        authStatus: 'Authentifizierungsstatus:',
        loginUser: 'Login-Benutzer:',
        notSet: 'Nicht festgelegt',
        enabled: '✅ Aktiviert',
        disabled: '❌ Deaktiviert',
        autoMode: 'Auto-Auswahl',
        fixedMode: 'Fester Port'
      },
      
      // Informationen
      info: {
        title: 'Beschreibung:',
        autoConnect: 'Ein-Klick-Verbindung: Automatisches Suchen des Everything-Installationsorts, HTTP-Dienst-Konfiguration, keine manuelle Bedienung erforderlich',
        autoHandle: 'Automatische Behandlung: Schließt automatisch bestehende Everything-Prozesse, ändert Konfigurationsdateien, startet Dienst neu',
        portSelection: 'Port-Auswahl: Automatische Auswahl nicht belegter Ports (Priorisierung von 8080, 8888 usw.)',
        compatibility: 'Kompatibilität: Unterstützt Everything 1.4 und höher'
      }
    },
    
    // Warnung vor ungespeicherten Änderungen
    unsaved: {
      warning: 'Ungespeicherte Änderungen erkannt, wird in 3 Sekunden automatisch gespeichert und geschlossen',
      saveNow: 'Jetzt speichern',
      discard: 'Änderungen verwerfen'
    }
  },
  
  // Nachrichten-Prompts
  messages: {
    success: {
      configSaved: 'Konfiguration erfolgreich gespeichert',
      exported: 'Ergebnisse erfolgreich exportiert',
      connected: 'Everything-Verbindung erfolgreich!',
      pathSet: 'Everything-Pfad erfolgreich festgelegt'
    },
    
    error: {
      configSaveFailed: 'Konfiguration speichern fehlgeschlagen',
      connectionFailed: 'Everything-Verbindung fehlgeschlagen',
      exportFailed: 'Export fehlgeschlagen',
      searchFailed: 'Suche fehlgeschlagen, unbekannter Fehler',
      searchError: 'Fehler während der Suche aufgetreten: {error}',
      loadConfigFailed: 'Konfiguration laden fehlgeschlagen',
      invalidPort: 'Ungültige Port-Nummer',
      pathSetFailed: 'Everything-Pfad-Einstellung fehlgeschlagen'
    },
    
    info: {
      ok: 'OK',
      loading: 'Laden...',
      processing: 'Verarbeitung...',
      testing: 'Testen...'
    }
  },
  
  // Kontextmenü
  contextMenu: {
    open: 'Öffnen',
    openWith: 'Öffnen mit...',
    showInExplorer: 'In Explorer anzeigen',
    copyPath: 'Pfad kopieren',
    copyName: 'Namen kopieren',
    properties: 'Eigenschaften'
  },
  
  // Zeitformat
  time: {
    now: 'Gerade eben',
    minute: 'vor {count} Minute{count, plural, one {} other{n}}',
    hour: 'vor {count} Stunde{count, plural, one {} other{n}}',
    day: 'vor {count} Tag{count, plural, one {} other{en}}',
    week: 'vor {count} Woche{count, plural, one {} other{n}}',
    month: 'vor {count} Monat{count, plural, one {} other{en}}',
    year: 'vor {count} Jahr{count, plural, one {} other{en}}'
  }
}
