import dependencies from './middleware/dependencies.js';
import events from './middleware/events.js';
import instantiate from './middleware/instantiate.js';
import singleton from './middleware/singleton.js';
import defaults from './middleware/defaults.js';
import init from './middleware/init.js'
import configuration from './middleware/configuration.js';

export const kernelBuilder = (modules) => {
    const moduleConfigurator = [
        configuration,
        singleton,
        defaults,
        instantiate,
        dependencies,
        events,
        init,
        _ => module => module['module']
    ]

    const configureMiddlewareStack = (stack) => {
        stack = stack.slice();
        stack.reverse();

        let callable = module => module
        stack.forEach(function(middleware) {
            callable = middleware(callable);
        });

        return callable;
    }

    const kernel = {
        configureModule(moduleName, config) {
            return configureMiddlewareStack(moduleConfigurator)({moduleName, config, kernel});
        },
        getModules() {
            return modules
        },
        startModule(moduleName, config) {
            return this.configureModule(moduleName, config);
        },
    }

    return kernel
};