const { contextBridge, ipcRenderer } = require('electron')
const fs = require('fs');

contextBridge.exposeInMainWorld( 'api', {
    send: (channal, data ) => ipcRenderer.invoke(channel, data),
    handle: (channal, callback, event, data ) => ipcRenderer.on( channel, callback( event, data )),    
    hello: () => {console.log('Hello World!:' + __dirname)},
    get_widget_info: (id) => {
        const data = fs.readFileSync(__dirname + '/widgets.json', 'utf8');
        let widgets = JSON.parse(data);
        let v_widget = null;

        for (const widget of widgets) {
            if (widget.id === id) {
                v_widget = widget;
                return v_widget;
            }
        }

        return v_widget;
    }
})