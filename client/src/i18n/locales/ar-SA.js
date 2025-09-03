export default {
  // عنوان التطبيق والمعلومات الأساسية
  app: {
    title: 'Everything AI Chat',
    subtitle: 'عميل البحث عن الملفات مدعوم بالذكاء الاصطناعي والمستند على خدمة البحث Everything'
  },
  
  // عناصر تحكم النافذة
  window: {
    minimize: 'تصغير',
    maximize: 'تكبير',
    restore: 'استعادة',
    close: 'إغلاق'
  },
  
  // حالة الاتصال
  status: {
    connected: 'متصل',
    connecting: 'جاري الاتصال',
    disconnected: 'غير متصل',
    ready: 'جاهز',
    searching: 'جاري البحث...',
    version: 'Everything v{version}'
  },
  
  // وظائف البحث
  search: {
    title: '🔍 البحث الذكي في الملفات',
    placeholder: 'أدخل استعلام بلغة طبيعية، سيحوله الذكاء الاصطناعي إلى صيغة Everything...',
    button: 'بحث',
    searching: 'جاري البحث...',
    clear: 'مسح النتائج',
    export: 'تصدير النتائج',
    duration: 'وقت البحث: {duration}ثانية',
    found: 'تم العثور على {count} ملف',
    query: 'استعلام مستخدم: {query}',
    noResults: 'لم يتم العثور على ملفات مطابقة',
    noResultsHint: 'جرب استخدام كلمات مفتاحية مختلفة أو تحقق من تشغيل Everything',
    welcome: 'ابدأ رحلة البحث الذكية',
    welcomeHint: 'أدخل لغة طبيعية، سيحولها الذكاء الاصطناعي إلى صيغة بحث Everything الدقيقة',
    suggestions: {
      title: '💡 جرب هذه البحثات:',
      today_images: 'صور اليوم',
      large_videos: 'مقاطع فيديو أكبر من 10 ميجابايت',
      recent_docs: 'المستندات المعدلة هذا الأسبوع'
    }
  },
  
  // قائمة الملفات
  fileList: {
    columns: {
      name: 'الاسم',
      path: 'المسار',
      size: 'الحجم',
      modified: 'معدل',
      created: 'منشأ',
      accessed: 'مُستخدم',
      attributes: 'الخصائص',
      runCount: 'عدد التشغيل',
      type: 'النوع'
    },
    sort: {
      ascending: 'تصاعدي',
      descending: 'تنازلي'
    }
  },
  
  // لوحة التصحيح
  debug: {
    title: '🤖 تصحيح استجابة الذكاء الاصطناعي',
    clear: 'مسح مخرجات التصحيح',
    hide: 'إخفاء لوحة التصحيح',
    empty: 'في انتظار استجابة الذكاء الاصطناعي...',
    emptyHint: 'سيتم عرض عملية استجابة الذكاء الاصطناعي في الوقت الفعلي هنا بعد البحث',
    result: 'نتيجة التحويل:',
    error: 'خطأ:',
    timestamp: '{time}'
  },
  
  // حوار الإعدادات
  settings: {
    title: 'الإعدادات',
    close: 'إغلاق',
    save: 'حفظ',
    saving: 'جاري الحفظ...',
    cancel: 'إلغاء',
    
    // إعدادات اللغة
    language: {
      title: '🌍 إعدادات اللغة',
      description: 'اختر لغة واجهة التطبيق',
      label: 'لغة الواجهة',
      current: 'اللغة الحالية: {language}'
    },
    
    // تكوين حقول العرض
    display: {
      title: 'تكوين حقول العرض',
      description: 'اختر الحقول التي تريد عرضها في نتائج البحث',
      fields: {
        accessed: 'وقت الوصول',
        attributes: 'خصائص الملف',
        created: 'وقت الإنشاء',
        recentlyChanged: 'تم تغييره مؤخراً',
        runCount: 'عدد التشغيل',
        fileListFilename: 'اسم قائمة الملفات'
      }
    },
    
    // تكوين OpenAI
    openai: {
      title: 'تكوين OpenAI',
      description: 'قم بتكوين OpenAI API لتمكين تحويل اللغة الطبيعية إلى صيغة بحث Everything',
      apiKey: {
        label: 'مفتاح API',
        placeholder: 'sk-...',
        help: 'مفتاح OpenAI API الخاص بك لاستدعاء نماذج GPT لتحويل صيغة البحث'
      },
      baseUrl: {
        label: 'URL الأساسي (اختياري)',
        placeholder: 'https://api.openai.com/v1',
        help: 'نقطة نهاية API مخصصة، تدعم خدمات الطرف الثالث المتوافقة'
      },
      model: {
        label: 'النموذج',
        placeholder: 'أدخل أو اختر النموذج',
        help: 'أدخل اسم النموذج المخصص أو اختر من التاريخ'
      },
      // نص متعلق بالاختبار
      test: 'اختبار الاتصال',
      testing: 'جاري الاختبار...',
      testSuccess: 'نجح اتصال API! النموذج المستخدم: {model}',
      testFailed: 'فشل اتصال API: {error}'
    },
    
    // تكوين التلقين النظامي
    systemPrompt: {
      title: '🤖 تكوين تلقين النظام للذكاء الاصطناعي',
      description: 'خصص تلقين النظام للذكاء الاصطناعي لتحسين جودة ونمط نتائج البحث. يحدد تلقين النظام كيف يفهم الذكاء الاصطناعي ويحول عمليات البحث بلغتك الطبيعية.',
      label: 'تلقين النظام',
      placeholder: 'يرجى إدخال تلقين النظام المخصص...',
      help: 'يجب أن يوجه التلقين الذكاء الاصطناعي حول كيفية تحويل اللغة الطبيعية إلى صيغة بحث Everything. اتركه فارغاً لاستخدام التلقين الافتراضي.',
      reset: '🔄 إعادة تعيين إلى الافتراضي',
      preview: 'معاينة التأثير',
      hidePreview: 'إخفاء المعاينة',
      previewTitle: 'معاينة التلقين',
      tips: {
        title: '💡 نصائح الاستخدام',
        guidanceTitle: 'إرشاد واضح',
        guidance: 'أخبر الذكاء الاصطناعي كيفية فهم نية البحث والتحويل إلى صيغة Everything',
        examplesTitle: 'تضمين أمثلة',
        examples: 'تضمين بعض أمثلة التحويل في التلقين سيحسن الدقة',
        conciseTitle: 'اجعلها مختصرة',
        concise: 'تجنب التعليمات المعقدة جداً، اجعل التلقين واضحاً ومفهوماً',
        testTitle: 'اختبار الفعالية',
        test: 'بعد التعديل، يمكنك التحقق من الفعالية من خلال البحث الفعلي'
      }
    },
    
    // إعدادات Everything
    everything: {
      title: 'إعدادات Everything',
      description: 'تكوين خدمة Everything HTTP تلقائياً أو تعيين معاملات الاتصال يدوياً',
      status: 'حالة Everything:',
      test: 'اختبار الاتصال',
      testing: 'جاري الاختبار...',
      
      // الاتصال التلقائي
      autoConnect: {
        title: '🚀 اتصال بنقرة واحدة بخدمة Everything',
        description: 'البحث تلقائياً عن موقع تثبيت Everything، تكوين خدمة HTTP وإنشاء الاتصال',
        button: '🔗 اتصال بنقرة واحدة بخدمة Everything',
        connecting: 'جاري الاتصال...',
        manualPath: '📁 تعيين المسار يدوياً',
        progress: 'تقدم الاتصال:',
        
        manualPathSection: {
          label: 'مسار تثبيت Everything',
          placeholder: 'مثال: C:\\Program Files\\Everything\\Everything.exe',
          help: 'يمكنك إدخال المسار الكامل لـ Everything.exe أو مسار مجلد التثبيت',
          confirm: 'تأكيد الإعداد',
          setting: 'جاري التعيين...'
        },
        
        result: {
          port: '🌐 منفذ خدمة HTTP: {port}',
          installPath: '📁 مسار التثبيت: {path}',
          credentials: '🔐 بيانات اعتماد الوصول (يرجى الحفظ بشكل صحيح):',
          username: 'اسم المستخدم:',
          password: 'كلمة المرور:',
          showPassword: 'إظهار كلمة المرور',
          hidePassword: 'إخفاء كلمة المرور',
          copy: 'نسخ',
          note: '💡 تم حفظ بيانات الاعتماد هذه تلقائياً في ملف تكوين Everything وستطبق تلقائياً في المرة القادمة التي يبدأ فيها Everything'
        }
      },
      
      // تكوين المنفذ
      port: {
        title: '🌐 تكوين المنفذ',
        description: 'تكوين منفذ اتصال خدمة Everything HTTP',
        auto: 'اختيار المنفذ التلقائي (موصى به)',
        autoDescription: 'سيجد النظام تلقائياً المنافذ المتاحة، مع إعطاء الأولوية للمنافذ الشائعة مثل 8080، 8888، إلخ.',
        fixed: 'منفذ ثابت',
        fixedDescription: 'استخدام المنفذ الثابت المحدد، سيفشل الاتصال إذا كان المنفذ مشغولاً',
        portLabel: 'رقم المنفذ',
        portPlaceholder: '8080',
        portHelp: 'نطاق المنفذ: 1-65535، الموصى به: 8080، 8888، 9080، إلخ.',
        portError: 'يرجى إدخال رقم منفذ صحيح (1-65535)',
        suggestions: 'المنافذ الشائعة:'
      },
      
      // التكوين الحالي
      currentConfig: {
        title: 'التكوين الحالي',
        portMode: 'وضع المنفذ:',
        httpPort: 'منفذ HTTP:',
        configPort: 'منفذ التكوين:',
        installPath: 'مسار التثبيت:',
        authStatus: 'حالة المصادقة:',
        loginUser: 'مستخدم تسجيل الدخول:',
        notSet: 'غير معين',
        enabled: '✅ مفعل',
        disabled: '❌ معطل',
        autoMode: 'اختيار تلقائي',
        fixedMode: 'منفذ ثابت'
      },
      
      // المعلومات
      info: {
        title: 'الوصف:',
        autoConnect: 'اتصال بنقرة واحدة: البحث تلقائياً عن موقع تثبيت Everything، تكوين خدمة HTTP، لا حاجة لعملية يدوية',
        autoHandle: 'المعالجة التلقائية: ستغلق تلقائياً عمليات Everything الموجودة، تعدل ملفات التكوين، تعيد تشغيل الخدمة',
        portSelection: 'اختيار المنفذ: اختيار تلقائي للمنافذ غير المشغولة (إعطاء الأولوية لـ 8080، 8888، إلخ)',
        compatibility: 'التوافق: يدعم Everything 1.4 وما فوق'
      }
    },
    
    // تحذير التغييرات غير المحفوظة
    unsaved: {
      warning: 'تم اكتشاف تغييرات غير محفوظة، ستحفظ تلقائياً وتغلق خلال 3 ثوانٍ',
      saveNow: 'احفظ الآن',
      discard: 'تجاهل التغييرات'
    }
  },
  
  // رسائل التنبيه
  messages: {
    success: {
      configSaved: 'تم حفظ التكوين بنجاح',
      exported: 'تم تصدير النتائج بنجاح',
      connected: 'اتصال Everything ناجح!',
      pathSet: 'تم تعيين مسار Everything بنجاح'
    },
    
    error: {
      configSaveFailed: 'فشل في حفظ التكوين',
      connectionFailed: 'فشل اتصال Everything',
      exportFailed: 'فشل التصدير',
      searchFailed: 'فشل البحث، خطأ غير معروف',
      searchError: 'حدث خطأ أثناء البحث: {error}',
      loadConfigFailed: 'فشل تحميل التكوين',
      invalidPort: 'رقم منفذ غير صحيح',
      pathSetFailed: 'فشل تعيين مسار Everything'
    },
    
    info: {
      ok: 'موافق',
      loading: 'جاري التحميل...',
      processing: 'جاري المعالجة...',
      testing: 'جاري الاختبار...'
    }
  },
  
  // القائمة السياقية
  contextMenu: {
    open: 'فتح',
    openWith: 'فتح بواسطة...',
    showInExplorer: 'إظهار في المستكشف',
    copyPath: 'نسخ المسار',
    copyName: 'نسخ الاسم',
    properties: 'الخصائص'
  },
  
  // تنسيق الوقت
  time: {
    now: 'الآن',
    minute: 'منذ {count} دقيقة',
    hour: 'منذ {count} ساعة',
    day: 'منذ {count} يوم',
    week: 'منذ {count} أسبوع',
    month: 'منذ {count} شهر',
    year: 'منذ {count} سنة'
  }
}
