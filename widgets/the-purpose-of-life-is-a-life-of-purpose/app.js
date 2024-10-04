let init = () => {
    let node = api.get_widget_info('the-purpose-of-life-is-a-life-of-purpose');

    if (node) {
        let app = document.querySelector('#app');
        app.style.setProperty('--color', node["color"]);
    }
}

document.addEventListener('DOMContentLoaded' , () => {
    init();
})