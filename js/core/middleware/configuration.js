export default next => ({moduleName, kernel, ...others}) => {
    const modules = kernel.getModules();

    if(!modules.hasOwnProperty(moduleName)) {
        throw new Error(`tried to initialize module ${moduleName} but it was not found`)
    }
    let moduleConfig = modules[moduleName];
    if(!moduleConfig.hasOwnProperty('component')) {
        throw new Error(`could not initialize module '${moduleName}' due to incorrect configuration: missing 'component'`)
    }

    return next({moduleName, kernel, ...others, moduleConfig})
}