const electron = require("electron");
const url = require("url");
const path = require("path");

const { app, BrowserWindow, Menu } = electron;

let mainWindow;
let addWindow;

// event listener for the app when ready
app.on("ready", function () {
  // create a new window
  mainWindow = new BrowserWindow({});
  // load HTML into window
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "mainWindow.html"),
      protocol: "file:",
      slashes: true,
    })
  );
  // Quit entire app when main window closed
  mainWindow.on("closed", function () {
    app.quit();
  });
  // Build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

// Handle createAddWindow
function createAddWindow() {
  // create a new window
  addWindow = new BrowserWindow({
    width: 400,
    height: 300,
    title: "Add shopping list item",
  });
  // load html into the window
  addWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "addWindow.html"),
      protocol: "file:",
      slashes: true,
    })
  );
  // Handle garbage collection
  addWindow.on("close", function () {
    addWindow = null;
  });
}

// create a main menu template
const mainMenuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "Add Item",
        click() {
          createAddWindow();
        },
      },
      {
        label: "Clear Items",
      },
      {
        label: "Quit",
        accelerator: process.platform == "darwin" ? "Command+Q" : "Ctrl+Q",
        click() {
          app.quit();
        },
      },
    ],
  },
];

// Unexpected behavior in mac: the title is displayed instead of the file label due to above mainMenuTemplate

// Fix: If Mac, add empty object to menu
if (process.platform == "darwin") {
  mainMenuTemplate.unshift({});
}

// Add developer tools items if not in production
if (process.env.NODE_ENV !== "production") {
  mainMenuTemplate.push({
    label: "Developer Tools",
    submenu: [
      {
        label: "Toggle DevTools",
        accelerator: process.platform == "darwin" ? "Command+I" : "Ctrl+I",
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        },
      },
      {
        role: "reload",
      },
    ],
  });
}
