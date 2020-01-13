let amountModulesInitialized = [];

export default next => ({moduleName, module, config, kernel, ...others}) => {
    if(!amountModulesInitialized.hasOwnProperty(moduleName)) {
        amountModulesInitialized[moduleName] = 0
    }

    const componentDependencies = module.dependencies || {};
    componentDependencies.forEach((dep, key) => {
        if(kernel.getModules().hasOwnProperty(dep)) {
            // if the amount of initializations of a module exceeds the amount of modules within the project, this means that there is a circular reference
            // this is crude and assuming but is less complex than creating a graph with all the dependency connections
            if(amountModulesInitialized[moduleName] > (Object.keys(kernel.getModules()).length ** 2)) {
                throw new Error("complex circular reference detected, all combinations of modules exhausted")
            }

            amountModulesInitialized[moduleName]++;
            module.dependencies[key] = kernel.startModule(dep, config);
            if(!module.hasOwnProperty(key)) {
                module[key] = module.dependencies[key]
            } else {
                console.warn('duplicate key found for dependency {`%s`: `%s`}', key, dep)
            }
        }
    })

    return next({moduleName, module, config, kernel, ...others})
}