// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      jasmine: {
        // Opciones de Jasmine
        random: false, // Ejecutar tests en orden
        seed: null,
        oneFailurePerSpec: true,
        failFast: false,
        timeoutInterval: 10000
      },
      clearContext: false // Dejar visible el reporter Jasmine
    },
    jasmineHtmlReporter: {
      suppressAll: true // Ocultar mensajes duplicados
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/frontend'),
      subdir: '.',
      reporters: [
        { type: 'html' },           // Reporte HTML interactivo
        { type: 'lcov' },           // Para herramientas CI/CD
        { type: 'text-summary' },   // Resumen en consola
        { type: 'cobertura' }       // Formato cobertura para CI
      ],
      // Umbrales mínimos de coverage (50% requerido por rúbrica)
      check: {
        global: {
          statements: 50,
          branches: 40,
          functions: 50,
          lines: 50
        }
      },
      // Archivos a incluir en el coverage
      includeAllSources: true,
      instrumenterOptions: {
        istanbul: { noCompact: true }
      }
    },
    reporters: ['progress', 'kjhtml', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    // Configuración para CI (sin interfaz gráfica)
    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox',
          '--disable-gpu',
          '--disable-translate',
          '--disable-extensions',
          '--disable-dev-shm-usage'
        ]
      },
      // Para pruebas cross-browser en Firefox
      FirefoxHeadless: {
        base: 'Firefox',
        flags: ['-headless']
      }
    },
    singleRun: false,
    restartOnFileChange: true,
    // Timeout para tests más largos (integración)
    browserNoActivityTimeout: 60000,
    captureTimeout: 60000
  });
};
