export const defaults = Object.freeze({
    inputField: "input",
    saveBtn: "button",
    deleteBtn: "button",
    storageEntry: "saveName",
    mirror: false
});

export default function(config = []) {
    const inputField = document.querySelector(config.inputField);

    const saveClicked = () => {
        self.storage.store(config.storageEntry, inputField.value)
    }

    const deleteClicked = () => {
        self.storage.remove(config.storageEntry, inputField.value)
    }

    const updateValueFromStorage = () => {
        inputField.value = self.storage.fetch(config.storageEntry);
    }

    const self = {
        init() {
            updateValueFromStorage();
        },
        events: {
            'click': {
                [config.saveBtn]: saveClicked,
                [config.deleteBtn]: deleteClicked
            },
            'keyup': {
                [config.inputField]: (e) => {
                    self.dispatcher.dispatchEvent('saveName_KeyUp', e.target.value)
                }
            },
            'storage.textField.update': updateValueFromStorage,
            'saveName_KeyUp': (data) => {
                if(config.mirror) {
                    inputField.value = data.detail
                }
            }
        },
        dependencies: {
            'storage': 'storage.textField',
            'dispatcher': 'dispatcher'
        }
    }

	return self
}