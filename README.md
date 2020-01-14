# UntitledModuleFramework (UMF)

UMF is a lightweight javascript framework written mostly in vanilla Javascript. It provides a few fundamental features that a programmer would ask from a framework, together with extensibility to provide your own features.

## Installation

## Configuration

### Defining modules

```javascript
export const modules = {
    'moduleIdentifier': {'component': componentName, 'singleton': shouldBeSingleton, 'defaults': componentDefaults},
}
```

### Initializing the kernel

```javascript
import {polyfills} from './core/polyfill.js';
import {kernelBuilder} from './core/kernel.js';

document.addEventListener('DOMContentLoaded', () => {
    polyfills();

    // start the kernel with the known modules
    try {
        const kernel = kernelBuilder(modules)
    } catch(e) {
        console.error(e)
    }
});
```

### Starting modules

```javascript
try {
    const kernel = kernelBuilder(modules)

    // find all modules that are currently required and start them
    document.querySelectorAll('[data-js-module]').forEach(el => {
        kernel.startModule(el.getAttribute('data-js-module'), {...el.dataset})
    });
} catch(e) {
    console.error(e)
}
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.