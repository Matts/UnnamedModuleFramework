import {kernelBuilder} from './core/kernel.js';
import {polyfills} from './core/polyfill.js';
import { modules } from './modules.js';

document.addEventListener('DOMContentLoaded', () => {
    polyfills();

    // start the kernel with the known modules
    try {
        const kernel = kernelBuilder(modules)

        // find all modules that are currently required and start them
        document.querySelectorAll('[data-js-module]').forEach(el => {
            kernel.startModule(el.getAttribute('data-js-module'), {...el.dataset})
        });
    } catch(e) {
        console.error(e)
    }
});