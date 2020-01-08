export const kernelBuilder = (modules) => {
    /**
     * fetch the module configuration by name
     * 
     * will validate if the configuration exists, and is valid.
     * 
     * @param {string} moduleName 
     */
    const getModuleConfig = (moduleName) => {
        if(!modules.hasOwnProperty(moduleName)) {
            throw new Error(`tried to initialize module ${moduleName} but it was not found`)
        }
        let moduleConfig = modules[moduleName];
        if(!moduleConfig.hasOwnProperty('component')) {
            throw new Error(`could not initialize module '${moduleName}' due to incorrect configuration: missing 'component'`)
        }

        return moduleConfig;
    }

    /**
     * configure the module to be a singleton if that configuration is enabled
     * 
     * @param {array} moduleConfig 
     * 
     * @returns {function(module)} callback to set the module into cache after initialization if it is a singleton
     */
    const configureSingletonModule = (moduleName, moduleConfig) => {
        const isModuleSingleton = moduleConfig.hasOwnProperty('singleton') && moduleConfig['singleton'] === true
        if(isModuleSingleton) {
            if(moduleConfig.hasOwnProperty('singletonInstance')) {
                return moduleConfig['singletonInstance'];
            } 
        }

        return (module) => {
            if(isModuleSingleton) {
                moduleConfig['singletonInstance'] = module;
            }
        }
    }

    /**
     * apply the current configuration to the defaults if applicable
     * 
     * @param {array} moduleConfig 
     * @param {array} config 
     */
    const configureModuleDefaults = (moduleConfig, config) => {
        const moduleDefaultsExist = moduleConfig.hasOwnProperty('defaults') && moduleConfig['defaults'] !== {}
        if(moduleDefaultsExist) {
            config = {...moduleConfig['defaults'], ...config}
        }

        return config
    }

    let amountModulesInitialized = [];


    /**
     * initialize the dependencies and apply them to the module
     * 
     * @param {object} module 
     * @param {array} config 
     */
    const configureModuleDependencies = (moduleName, module, config) => {
        if(!amountModulesInitialized.hasOwnProperty(moduleName)) {
            amountModulesInitialized[moduleName] = 0
        }

        const componentDependencies = module.dependencies || {};
        componentDependencies.forEach((dep, key) => {
            if(modules.hasOwnProperty(dep)) {
                // if the amount of initializations of a module exceeds the amount of modules within the project, this means that there is a circular reference
                // this is crude and assuming but is less complex than creating a graph with all the dependency connections
                if(amountModulesInitialized[moduleName] > (Object.keys(modules).length ** 2)) {
                    throw new Error("complex circular reference detected, all combinations of modules exhausted")
                }

                amountModulesInitialized[moduleName]++;
                module.dependencies[key] = self.startModule(dep, config);
                if(!module.hasOwnProperty(key)) {
                    module[key] = module.dependencies[key]
                } else {
                    console.warn('duplicate key found for dependency {`%s`: `%s`}', key, dep)
                }
            }
        })
    }

    /**
     * get the events and bind them to the document
     * 
     * @param {object} module 
     */
    const configureModuleEvents = (module) => {
        const componentEvents = module.events || {};
        componentEvents.forEach((binds, event) => {
            document.addEventListener(event, function(event) {
                if(typeof binds === "function") {
                    binds(event)
                } else {
                    binds.forEach((callback, attribute) => {
                        if (event.target.matches(attribute)) {
                            callback(event)
                        }
                    })
                }
            })
        })
    }

    const self = {
        startModule(moduleName, config) {
            const moduleConfig = getModuleConfig(moduleName);

            const singletonConfig = configureSingletonModule(moduleName, moduleConfig);

            if(typeof singletonConfig !== "function") {
                return singletonConfig
            }

            config = configureModuleDefaults(moduleConfig, config)

            const module = moduleConfig['component'](config);
        
            singletonConfig(module)

            configureModuleDependencies(moduleName, module, config)
            configureModuleEvents(module)
        
            if(module.hasOwnProperty('init')) {
                module.init()
            }
        
            return module;
        }
    }

    return self
};