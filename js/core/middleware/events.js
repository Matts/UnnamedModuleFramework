export default next => ({module, ...rest}) => {
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
    return next({module, ...rest})
}