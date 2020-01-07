import saveNameComponent, {defaults as saveNameDefaults} from './component/saveName.js'
import storageComponent from './component/util/storage.js'
import dispatcher from './component/util/dispatcher.js'

/**
 * Register your modules here
 * 
 * key - module name / identifier
 * value - configuration
 *  "component"
 *      Required: true
 *  "singleton"
 *      Required: false
 *      Default: false
 *  "defaults"
 *      Required: false
 *      Default: {}
 * 
 */
export const modules = {
    'saveName': {'component': saveNameComponent, 'singleton': false, 'defaults': saveNameDefaults},
    'storage.textField': {'component': storageComponent('textField'), 'singleton': true},
    'dispatcher': {'component': dispatcher, 'singleton': true}
};