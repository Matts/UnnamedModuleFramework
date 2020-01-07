export const polyfills = () => {
    Object.prototype.forEach = function(callback, thisArg) {
        thisArg = thisArg || window;
        if(Object.keys(this).length !== 0) {
            for (const key in this) {
                if(this.hasOwnProperty(key)) {
                    const element = this[key];
                    callback.call(thisArg, element, key, this);
                }
            }
        }
    }
}