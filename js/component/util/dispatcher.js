export default function(config = []) {
    return {
        dispatchEvent(event, data = undefined) {
            document.dispatchEvent(new CustomEvent(event, {detail: data}))
        }
    }
}