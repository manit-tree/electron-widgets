const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
let date = '';

let update = () => {
    let date = new Date();
    let d = date.getDate(); // 0 - 31
    let m = date.getMonth(); // 1 - 12
    let y = date.getFullYear();

    d = (d < 10) ? "0" + d : d;

    let current_date = d + ' ' + MONTHS[m] + ' ' + y;
    
    if (current_date !== date) {
       date = current_date; 
       document.querySelector('.date').innerText = current_date;
    } 
    
    setTimeout(update, 1000);    
}

let init = () => {
    update();

    let node = api.get_widget_info('date');

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