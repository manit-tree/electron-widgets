const { app, BrowserWindow, Menu, Tray } = require('electron');
const path = require('node:path');
const fs = require('fs');
let widgets;

const log = str => {
    fs.appendFile(__dirname + '/logs.txt', str, function(err) {
        if (err) throw err;        
    })
}

const get_widget_info = (id) => {
    let v_widget = null;

    if (widgets && Array.isArray(widgets)) {
        for (const widget of widgets) {
            if (widget.id === id) {
                v_widget = widget;
                return v_widget;
            }
        }
    }

    return v_widget;
}

const createWidget = (widget) => {
    if (widget.enable) {
        const win = new BrowserWindow({
            title: widget.id,
            width: Math.round(widget.width * widget.scale),
            height: Math.round(widget.height * widget.scale),
            transparent: true,
            frame: false,
            resizable: false,
            skipTaskbar: true,
            hasShadow: false,
            show: false,
            webPreferences: {
                preload: __dirname + '/preload.js',
                sandbox: false
            }
        })

        win.once('ready-to-show', () => {
            if (widget.x && widget.y) {
                win.setPosition(widget.x, widget.y);
            }

            win.show();
        })

        win.on('moved', evt => {
            let info = get_widget_info(widget.id);
            const pos = win.getPosition();

            if (pos) {
                info.x = pos[0];
                info.y = pos[1];
            }

            fs.writeFile(__dirname + '/widgets.json', JSON.stringify(widgets), err => {
                if (err) {
                    console.log(err);
                }
            })
        })

        win.loadFile(__dirname + '/widgets/' + widget.id + '/index.html');
    }
}

let tray = null;

app.whenReady().then(() => {
    tray = new Tray(__dirname + '/assets/icon.png');

    const contextMenu = Menu.buildFromTemplate([
        {label: 'About'},
        {label: 'Reload', click: () => {
            app.relaunch();
            app.exit();
        }},
        {type: 'separator'},
        {label: 'Exit', click: () => {
            app.exit(0);    
        }}
    ])

    tray.setContextMenu(contextMenu);

    const data = fs.readFileSync(__dirname + '/widgets.json', 'utf8');
    widgets = JSON.parse(data);

    widgets.forEach(widget => {
        createWidget(widget);
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
})

app.on('quit', () => {
})
