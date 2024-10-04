(() => {
    let location = 'unknown';
    let longitude;
    let latitude;
    let current_weather = '';

    function get_hash(string) { 
        let hash = 0;
        
        if (string.length == 0) return null;
        
        for (var i = 0; i < string.length; i++) {
            let char = string.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }

        if (hash >= 0) {
            return 'A-' + hash;
        }

        return 'B' + hash;
    }

    let get_reverse_geocode = async (lat, lng) => {
        const API_KEY = '66387daf938a2985718011hdf0fe97e';
        let url = 'https://geocode.maps.co/reverse?lat=' + lat + '&lon=' + lng + '&api_key=' + API_KEY;
        let response = await fetch(url);
        let node = await response.json();

        if (node) {
            return {
                suburb: node.address.suburb,
                city: node.address.city,
                postcode: node.address.postcode
            }    
        }

        return null;
    }

    let get_weather = async (lat, lng) => {
        let url = 'https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lng + '&current=temperature_2m,wind_speed_10m,weather_code';
        let response = await fetch(url);
        let node = await response.json();

        if (node) {
            return location + ', ' + node.current.temperature_2m + ' ' + node.current_units.temperature_2m;
        }

        return null;
    }

    let update = async () => {
        let str = await get_weather(latitude, longitude);

        if (str) {
            let el = document.querySelector('.weather');

            if (current_weather === '') {
                el.classList.add('fade-out');
                setTimeout(() => {
                    current_weather = str;
                    el.innerHTML = str;
                    el.classList.remove('fade-out');
                    el.classList.add('fade-in');
                }, 1000)
            } else {
                current_weather = str;
                el.innerText = current_weather;
            }
        }

        setTimeout(update, 5 * 60 * 1000);    
    }

    let init = () => {
        let node = api.get_widget_info('weather');

        if (node) {
            let app = document.querySelector('#app');

            app.style.setProperty('--scale', node["scale"]);
            app.style.setProperty('--color', node["color"]);
            app.style.setProperty('--text-shadow', node["text-shadow"]);
            app.classList.add('text-' + node["text-align"]);

            latitude = node["latitude"];
            longitude = node["longitude"];
            
            get_reverse_geocode(latitude, longitude).then(node => {
                let hash = get_hash(latitude + ',' + longitude);

                if (hash) {
                    localStorage.setItem(hash, JSON.stringify(node));
                }

                location = node.city;

                if (node.suburb) {
                    location = node.suburb;
                }

                update();
            })
        }
    }

    document.addEventListener('DOMContentLoaded' , () => {
        init();
    })
})()

