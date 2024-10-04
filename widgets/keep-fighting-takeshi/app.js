let init = () => {
    let node = api.get_widget_info('keep-fighting-takeshi');

    if (node) {
        let app = document.querySelector('#app');
        app.style.setProperty('--color', node["color"]);
    }
}

document.addEventListener('DOMContentLoaded' , () => {
    init();
})