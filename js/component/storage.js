export default function(storeName) {
    return function(config = []) {
        const itemKey = (key) => {
            return `${storeName}_${key}`;
        }

        return {
            init() {
                console.log('initialized component')
            },
            store(key, value) {
                localStorage.setItem(itemKey(key), value)

                this.dependencies.dispatcher.dispatchEvent(`storage.${storeName}.store`)
                this.dependencies.dispatcher.dispatchEvent(`storage.${storeName}.update`)
            },
            remove(key) {
                localStorage.removeItem(itemKey(key));

                this.dependencies.dispatcher.dispatchEvent(`storage.${storeName}.store`)
                this.dependencies.dispatcher.dispatchEvent(`storage.${storeName}.update`)
            },
            fetch(key) {
                return localStorage.getItem(itemKey(key));
            },
            dependencies: {
                'dispatcher': 'dispatcher'
            }
        }
    }
}