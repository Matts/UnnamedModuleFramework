export default next => ({moduleConfig, ...others}) => {
    const isModuleSingleton = moduleConfig.hasOwnProperty('singleton') && moduleConfig['singleton'] === true
    if(isModuleSingleton) {
        if(moduleConfig.hasOwnProperty('singletonInstance')) {
            return moduleConfig['singletonInstance'];
        } 
    }

    const module = next({moduleConfig, ...others});

    if(isModuleSingleton) {
        moduleConfig['singletonInstance'] = module;
    }

    return module;
}