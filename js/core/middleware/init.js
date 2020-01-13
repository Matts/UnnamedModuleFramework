export default next => ({module, ...others}) => {
    let result = false;

    if(module.hasOwnProperty('init')) {
        result = module.init()
    }

    return next({module, ...others, result})
}