/**
 * Plugin pour enregistrer globalement tous les composants Argon
 * Usage dans main.js : import ArgonComponents from './plugins/argon-components'
 *                      app.use(ArgonComponents)
 */

import * as components from '@/components';
import * as examples from '@/examples';

export default {
  install(app) {
    // Enregistrement global des composants de base Argon
    Object.keys(components).forEach(componentName => {
      app.component(componentName, components[componentName]);
    });

    // Enregistrement global des composants examples (optionnel)
    // Décommentez si vous souhaitez que tous les composants examples soient disponibles globalement
    /*
    Object.keys(examples).forEach(componentName => {
      app.component(componentName, examples[componentName]);
    });
    */
  }
};

