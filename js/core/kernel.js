export const kernelBuilder = (modules) => {
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

    const configureSingletonModule = (moduleConfig) => {
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

    const configureModuleDefaults = (moduleConfig, config) => {
        const moduleDefaultsExist = moduleConfig.hasOwnProperty('defaults') && moduleConfig['defaults'] !== {}
        if(moduleDefaultsExist) {
            config = {...moduleConfig['defaults'], ...config}
        }

        return config
    }

    const configureModuleDependencies = (module, config) => {
        const componentDependencies = module.dependencies || {};
        componentDependencies.forEach((dep, key) => {
            if(modules.hasOwnProperty(dep)) {
                module.dependencies[key] = self.startModule(dep, config);
                if(!module.hasOwnProperty(key)) {
                    module[key] = module.dependencies[key]
                } else {
                    console.warn('duplicate key found for dependency {`%s`: `%s`}', key, dep)
                }
            }
        })
    }

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

            const singletonConfig = configureSingletonModule(moduleConfig);
            if(typeof singletonConfig !== "function") {
                return singletonConfig
            }

            config = configureModuleDefaults(moduleConfig, config)

            const module = moduleConfig['component'](config); // todo: add defaults
        
            configureModuleDependencies(module, config)
            configureModuleEvents(module)
        
            if(module.hasOwnProperty('init')) {
                module.init()
            }

            singletonConfig(module)
        
            return module;
        }
    }

    return self
};