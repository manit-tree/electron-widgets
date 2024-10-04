let time = '';

let update_time = () => {
    let date = new Date();
    let h = date.getHours(); // 0 - 23
    let m = date.getMinutes(); // 0 - 59

    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    
    let current_time = h + ':' + m;
    
    if (current_time !== time) {
       time = current_time; 
       document.querySelector('.time').innerText = current_time;
    }

    setTimeout(update_time, 1000);    
}

let init = () => {
    update_time();

    let node = api.get_widget_info('time');

    if (node) {
        let app = document.querySelector('#app');

        app.style.setProperty('--scale', node["scale"]);
        app.style.setProperty('--color', node["color"]);
        app.style.setProperty('--text-shadow', node["text-shadow"]);
        app.classList.add('text-' + node["text-align"]);
    }
}

document.addEventListener('DOMContentLoaded' , () => {
    init();
})