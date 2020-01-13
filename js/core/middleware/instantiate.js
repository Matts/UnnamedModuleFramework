export default next => ({moduleConfig, config, ...others}) => {
    const module = moduleConfig['component'](config);

    return next({moduleConfig, config, ...others, module})
}
