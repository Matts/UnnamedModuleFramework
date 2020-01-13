export default next => ({moduleConfig, config, ...others}) => {
    const moduleDefaultsExist = moduleConfig.hasOwnProperty('defaults') && moduleConfig['defaults'] !== {}
    
    if(moduleDefaultsExist) {
        config = {...moduleConfig['defaults'], ...config}
    }

    return next({moduleConfig, ...others, config})
}