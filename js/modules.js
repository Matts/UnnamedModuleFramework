import saveNameComponent, {defaults as saveNameDefaults} from './component/saveName.js'
import storageComponent from './component/util/storage.js'
import dispatcher from './component/util/dispatcher.js'
import level1 from './component/referenceTest/level1.js'
import level2 from './component/referenceTest/level2.js'
import level3 from './component/referenceTest/level3.js'
import level4 from './component/referenceTest/level4.js'

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
    'dispatcher': {'component': dispatcher, 'singleton': true},
    'level1': {'component': level1, 'singleton': true},
    'level2': {'component': level2, 'singleton': true},
    'level3': {'component': level3, 'singleton': true},
    'level4': {'component': level4, 'singleton': true},
};