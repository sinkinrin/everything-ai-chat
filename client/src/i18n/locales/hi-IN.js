export default {
  // एप्लिकेशन शीर्षक और मूल जानकारी
  app: {
    title: 'Everything AI Chat',
    subtitle: 'Everything सर्च सेवा पर आधारित AI संचालित फाइल सर्च क्लाइंट'
  },
  
  // विंडो नियंत्रण
  window: {
    minimize: 'छोटा करें',
    maximize: 'बड़ा करें',
    restore: 'पुनर्स्थापित',
    close: 'बंद करें'
  },
  
  // कनेक्शन स्थिति
  status: {
    connected: 'जुड़ा हुआ',
    connecting: 'जुड़ रहा है',
    disconnected: 'डिस्कनेक्ट',
    ready: 'तैयार',
    searching: 'खोज रहे हैं...',
    version: 'Everything v{version}'
  },
  
  // सर्च कार्यक्षमता
  search: {
    title: '🔍 स्मार्ट फाइल सर्च',
    placeholder: 'प्राकृतिक भाषा में क्वेरी दर्ज करें, AI इसे Everything सिंटैक्स में बदल देगा...',
    button: 'खोजें',
    searching: 'खोज रहे हैं...',
    clear: 'परिणाम साफ करें',
    export: 'परिणाम एक्सपोर्ट करें',
    duration: 'खोज में लगा समय: {duration}s',
    found: '{count} फाइलें मिलीं',
    query: 'उपयोग की गई क्वेरी: {query}',
    noResults: 'कोई मेल खाती फाइलें नहीं मिलीं',
    noResultsHint: 'अलग कीवर्ड्स का उपयोग करें या जांचें कि Everything चल रहा है या नहीं',
    welcome: 'अपनी स्मार्ट सर्च यात्रा शुरू करें',
    welcomeHint: 'प्राकृतिक भाषा दर्ज करें, AI इसे Everything की सटीक सर्च सिंटैक्स में बदल देगा',
    suggestions: {
      title: '💡 ये सर्च करके देखें:',
      today_images: 'आज की छवियां',
      large_videos: '10MB से बड़े वीडियो',
      recent_docs: 'इस सप्ताह बदले गए दस्तावेज़'
    }
  },
  
  // फाइल सूची
  fileList: {
    columns: {
      name: 'नाम',
      path: 'पथ',
      size: 'आकार',
      modified: 'संशोधित',
      created: 'बनाया गया',
      accessed: 'एक्सेस किया गया',
      attributes: 'गुण',
      runCount: 'चलने की संख्या',
      type: 'प्रकार'
    },
    sort: {
      ascending: 'आरोही',
      descending: 'अवरोही'
    }
  },
  
  // डिबग पैनल
  debug: {
    title: '🤖 AI रिस्पॉन्स डिबग',
    clear: 'डिबग आउटपुट साफ करें',
    hide: 'डिबग पैनल छुपाएं',
    empty: 'AI रिस्पॉन्स का इंतज़ार...',
    emptyHint: 'सर्च के बाद यहां AI की रियल-टाइम रिस्पॉन्स प्रक्रिया दिखाई जाएगी',
    result: 'रूपांतरण परिणाम:',
    error: 'त्रुटि:',
    timestamp: '{time}'
  },
  
  // सेटिंग्स डायलॉग
  settings: {
    title: 'सेटिंग्स',
    close: 'बंद करें',
    save: 'सेव करें',
    saving: 'सेव हो रहा है...',
    cancel: 'रद्द करें',
    
    // भाषा सेटिंग्स
    language: {
      title: '🌍 भाषा सेटिंग्स',
      description: 'एप्लिकेशन इंटरफेस की भाषा चुनें',
      label: 'इंटरफेस भाषा',
      current: 'वर्तमान भाषा: {language}'
    },
    
    // डिस्प्ले फील्ड कॉन्फ़िगरेशन
    display: {
      title: 'डिस्प्ले फील्ड कॉन्फ़िगरेशन',
      description: 'सर्च परिणामों में कौन से फील्ड दिखाने हैं चुनें',
      fields: {
        accessed: 'एक्सेस समय',
        attributes: 'फाइल गुण',
        created: 'बनाने का समय',
        recentlyChanged: 'हाल ही में बदला गया',
        runCount: 'चलने की संख्या',
        fileListFilename: 'फाइल सूची नाम'
      }
    },
    
    // OpenAI कॉन्फ़िगरेशन
    openai: {
      title: 'OpenAI कॉन्फ़िगरेशन',
      description: 'प्राकृतिक भाषा से Everything सर्च सिंटैक्स रूपांतरण सक्षम करने के लिए OpenAI API कॉन्फ़िगर करें',
      apiKey: {
        label: 'API Key',
        placeholder: 'sk-...',
        help: 'सर्च सिंटैक्स रूपांतरित करने के लिए GPT मॉडल्स को कॉल करने हेतु आपकी OpenAI API Key'
      },
      baseUrl: {
        label: 'Base URL (वैकल्पिक)',
        placeholder: 'https://api.openai.com/v1',
        help: 'कस्टम API एंडपॉइंट, संगत तृतीय पक्ष सेवाओं का समर्थन करता है'
      },
      model: {
        label: 'मॉडल',
        placeholder: 'मॉडल दर्ज करें या चुनें',
        help: 'कस्टम मॉडल नाम दर्ज करें या इतिहास से चुनें'
      },
      // परीक्षण संबंधी टेक्स्ट
      test: 'कनेक्शन परीक्षण',
      testing: 'परीक्षण हो रहा है...',
      testSuccess: 'API कनेक्शन सफल! उपयोग किया गया मॉडल: {model}',
      testFailed: 'API कनेक्शन असफल: {error}'
    },
    
    // सिस्टम प्रॉम्प्ट कॉन्फ़िगरेशन
    systemPrompt: {
      title: '🤖 AI सिस्टम प्रॉम्प्ट कॉन्फ़िगरेशन',
      description: 'सर्च परिणामों की गुणवत्ता और शैली को अनुकूलित करने के लिए AI सिस्टम प्रॉम्प्ट को कस्टमाइज़ करें। सिस्टम प्रॉम्प्ट निर्धारित करता है कि AI आपकी प्राकृतिक भाषा सर्च को कैसे समझता और रूपांतरित करता है।',
      label: 'सिस्टम प्रॉम्प्ट',
      placeholder: 'कृपया कस्टम सिस्टम प्रॉम्प्ट दर्ज करें...',
      help: 'प्रॉम्प्ट AI को गाइड करना चाहिए कि प्राकृतिक भाषा को Everything सर्च सिंटैक्स में कैसे बदलना है। डिफ़ॉल्ट प्रॉम्प्ट उपयोग करने के लिए खाली छोड़ें।',
      reset: '🔄 डिफ़ॉल्ट पर रीसेट करें',
      preview: 'प्रभाव प्रीव्यू',
      hidePreview: 'प्रीव्यू छुपाएं',
      previewTitle: 'प्रॉम्प्ट प्रीव्यू',
      tips: {
        title: '💡 उपयोग टिप्स',
        guidanceTitle: 'स्पष्ट मार्गदर्शन',
        guidance: 'AI को बताएं कि सर्च इंटेंट को कैसे समझना है और Everything सिंटैक्स में कैसे बदलना है',
        examplesTitle: 'उदाहरण शामिल करें',
        examples: 'प्रॉम्प्ट में कुछ रूपांतरण उदाहरण शामिल करने से सटीकता बेहतर होगी',
        conciseTitle: 'संक्षिप्त रखें',
        concise: 'अत्यधिक जटिल निर्देशों से बचें, प्रॉम्प्ट को स्पष्ट और समझने योग्य रखें',
        testTitle: 'प्रभावशीलता का परीक्षण करें',
        test: 'संशोधन के बाद वास्तविक सर्च के माध्यम से प्रभावशीलता की जांच कर सकते हैं'
      }
    },
    
    // Everything सेटिंग्स
    everything: {
      title: 'Everything सेटिंग्स',
      description: 'Everything HTTP सेवा को स्वचालित रूप से कॉन्फ़िगर करें या कनेक्शन पैरामीटर मैन्युअल रूप से सेट करें',
      status: 'Everything स्थिति:',
      test: 'कनेक्शन टेस्ट करें',
      testing: 'टेस्ट हो रहा है...',
      
      // स्वचालित कनेक्शन
      autoConnect: {
        title: '🚀 Everything सेवा का वन-क्लिक कनेक्शन',
        description: 'स्वचालित रूप से Everything इंस्टॉलेशन स्थान खोजें, HTTP सेवा कॉन्फ़िगर करें और कनेक्शन स्थापित करें',
        button: '🔗 Everything सेवा का वन-क्लिक कनेक्शन',
        connecting: 'कनेक्ट हो रहा है...',
        manualPath: '📁 मैन्युअल रूप से पाथ सेट करें',
        progress: 'कनेक्शन प्रगति:',
        
        manualPathSection: {
          label: 'Everything इंस्टॉलेशन पाथ',
          placeholder: 'उदाहरण: C:\\Program Files\\Everything\\Everything.exe',
          help: 'आप Everything.exe का पूरा पाथ या इंस्टॉलेशन डायरेक्टरी पाथ दर्ज कर सकते हैं',
          confirm: 'सेटिंग कन्फ़र्म करें',
          setting: 'सेट हो रहा है...'
        },
        
        result: {
          port: '🌐 HTTP सेवा पोर्ट: {port}',
          installPath: '📁 इंस्टॉलेशन पाथ: {path}',
          credentials: '🔐 एक्सेस क्रेडेंशियल्स (कृपया उचित रूप से सेव करें):',
          username: 'यूज़रनेम:',
          password: 'पासवर्ड:',
          showPassword: 'पासवर्ड दिखाएं',
          hidePassword: 'पासवर्ड छुपाएं',
          copy: 'कॉपी',
          note: '💡 ये क्रेडेंशियल्स स्वचालित रूप से Everything कॉन्फ़िगरेशन फाइल में सेव हो गए हैं और अगली बार Everything शुरू होने पर स्वचालित रूप से लागू होंगे'
        }
      },
      
      // पोर्ट कॉन्फ़िगरेशन
      port: {
        title: '🌐 पोर्ट कॉन्फ़िगरेशन',
        description: 'Everything HTTP सेवा कनेक्शन पोर्ट कॉन्फ़िगर करें',
        auto: 'स्वचालित पोर्ट चयन (अनुशंसित)',
        autoDescription: 'सिस्टम स्वचालित रूप से उपलब्ध पोर्ट्स खोजेगा, सामान्य पोर्ट्स जैसे 8080, 8888 आदि को प्राथमिकता देगा।',
        fixed: 'निश्चित पोर्ट',
        fixedDescription: 'निर्दिष्ट निश्चित पोर्ट का उपयोग करें, पोर्ट कब्जे में होने पर कनेक्शन फेल हो जाएगा',
        portLabel: 'पोर्ट नंबर',
        portPlaceholder: '8080',
        portHelp: 'पोर्ट रेंज: 1-65535, अनुशंसित: 8080, 8888, 9080 आदि।',
        portError: 'कृपया वैध पोर्ट नंबर दर्ज करें (1-65535)',
        suggestions: 'सामान्य पोर्ट्स:'
      },
      
      // वर्तमान कॉन्फ़िगरेशन
      currentConfig: {
        title: 'वर्तमान कॉन्फ़िगरेशन',
        portMode: 'पोर्ट मोड:',
        httpPort: 'HTTP पोर्ट:',
        configPort: 'कॉन्फ़िग पोर्ट:',
        installPath: 'इंस्टॉलेशन पाथ:',
        authStatus: 'प्रमाणीकरण स्थिति:',
        loginUser: 'लॉगिन यूज़र:',
        notSet: 'सेट नहीं',
        enabled: '✅ सक्षम',
        disabled: '❌ अक्षम',
        autoMode: 'स्वचालित चयन',
        fixedMode: 'निश्चित पोर्ट'
      },
      
      // जानकारी
      info: {
        title: 'विवरण:',
        autoConnect: 'वन-क्लिक कनेक्ट: स्वचालित रूप से Everything इंस्टॉलेशन स्थान खोजना, HTTP सेवा कॉन्फ़िगर करना, कोई मैन्युअल ऑपरेशन आवश्यक नहीं',
        autoHandle: 'स्वचालित हैंडलिंग: स्वचालित रूप से मौजूदा Everything प्रक्रियाएं बंद करेगा, कॉन्फ़िग फाइलें संशोधित करेगा, सेवा पुनः आरंभ करेगा',
        portSelection: 'पोर्ट चयन: अनधिकृत पोर्ट्स का स्वचालित चयन (8080, 8888 आदि को प्राथमिकता)',
        compatibility: 'संगतता: Everything 1.4 और उसके बाद के संस्करणों का समर्थन करता है'
      }
    },
    
    // अनसेव्ड चेंजेस चेतावनी
    unsaved: {
      warning: 'अनसेव्ड चेंजेस का पता चला है, 3 सेकंड में ऑटो-सेव होकर बंद हो जाएगा',
      saveNow: 'अभी सेव करें',
      discard: 'चेंजेस रद्द करें'
    }
  },
  
  // संदेश प्रॉम्प्ट्स
  messages: {
    success: {
      configSaved: 'कॉन्फ़िगरेशन सफलतापूर्वक सेव हुआ',
      exported: 'परिणाम सफलतापूर्वक एक्सपोर्ट हुए',
      connected: 'Everything कनेक्शन सफल!',
      pathSet: 'Everything पाथ सफलतापूर्वक सेट हुआ'
    },
    
    error: {
      configSaveFailed: 'कॉन्फ़िगरेशन सेव फेल',
      connectionFailed: 'Everything कनेक्शन फेल',
      exportFailed: 'एक्सपोर्ट फेल',
      searchFailed: 'सर्च फेल, अज्ञात त्रुटि',
      searchError: 'सर्च के दौरान त्रुटि हुई: {error}',
      loadConfigFailed: 'कॉन्फ़िगरेशन लोड फेल',
      invalidPort: 'अमान्य पोर्ट नंबर',
      pathSetFailed: 'Everything पाथ सेटिंग फेल'
    },
    
    info: {
      ok: 'ठीक है',
      loading: 'लोड हो रहा है...',
      processing: 'प्रोसेसिंग...',
      testing: 'टेस्ट हो रहा है...'
    }
  },
  
  // कॉन्टेक्स्ट मेनू
  contextMenu: {
    open: 'खोलें',
    openWith: 'इसके साथ खोलें...',
    showInExplorer: 'एक्सप्लोरर में दिखाएं',
    copyPath: 'पाथ कॉपी करें',
    copyName: 'नाम कॉपी करें',
    properties: 'गुण'
  },
  
  // समय फॉर्मेट
  time: {
    now: 'अभी-अभी',
    minute: '{count} मिनट पहले',
    hour: '{count} घंटे पहले',
    day: '{count} दिन पहले',
    week: '{count} सप्ताह पहले',
    month: '{count} महीने पहले',
    year: '{count} साल पहले'
  }
}
