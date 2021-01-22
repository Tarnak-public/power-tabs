// [{"name":"untitled","uuid":"6e93652d-6535-4280-a3d4-ffb62ad9e986","open":true,"active":false,"colour":"#ffff00"},{"name":"test","uuid":"fbbea549-130f-442a-bcfc-759ac65269f8","open":true,"active":true,"colour":"#ffff00"}] 
//firefox about:debug , 
class GroupSetting {
  constructor(allGroups, index) {
    let data = allGroups[index];
    this.name = data.name;
    this.uuid = data.uuid;
    this.index = index;
    this.allGroups = allGroups;
    this._hasAssignedDomain = false;
    this.buildView();
  }

  get data() {
    return this.allGroups[this.index];
  }

  save() {
    browser.storage.local.set({ groups: this.allGroups });
  }

  saveNewName() {
    let newText = this._nameEdit.value.trim();
    if (newText) {
      if (this.name !== newText) {
        this._nameEdit.classList.remove("invalid");
        this.data.name = newText;
        this.name = newText;
        this._header.textContent = `Group Settings – ${newText}`;
        this.save();
      }
    }
    else {
      this._nameEdit.classList.add("invalid");
    }
  }

  buildView() {
    var templ = document.getElementById("group-template").content.cloneNode(true);

    this._header = templ.getElementById("groupHeader");
    this._header.id = "";
    this._header.textContent = `Group Settings – ${this.name}`;

    let nameEdit = templ.getElementById("groupName");
    nameEdit.id = "";
    nameEdit.value = this.name;
    this._nameEdit = nameEdit;

    nameEdit.addEventListener("blur", (e) => {
      this.saveNewName();
    });

    nameEdit.addEventListener("keyup", (e) => {
      e.preventDefault();
      if (e.key == "Enter") {
        this.saveNewName();
      }
    });

    let colourEdit = templ.getElementById("groupColour");
    colourEdit.id = "";
    colourEdit.value = this.data.hasOwnProperty("colour") ? this.data.colour : '#000000';

    colourEdit.addEventListener("change", (e) => {
      this.data.colour = colourEdit.value;
      this.save();
    });

    let assignedDomains = templ.getElementById("assignedDomains");
    assignedDomains.id = "";
    this._assignedDomains = assignedDomains;

    assignedDomains.addEventListener("keydown", (e) => {
      if (e.key === "Delete") {
        let selected = [...assignedDomains.children].filter((n) => n.selected).map((n) => {
          assignedDomains.removeChild(n);
          return n.getAttribute("data-key");
        });
        browser.storage.local.remove(selected);
      }
    });

    let deleteGroup = templ.getElementById("deleteGroup");
    deleteGroup.id = "";
    deleteGroup.addEventListener("click", (e) => {
      if (confirm("Are you sure you want to delete this group?")) {
        this.allGroups.splice(this.index, 1);
        this.save();
        clearGroupSettings();
        loadGroupSettings({ groups: this.allGroups });
      }
    });

    this.view = templ;
  }

  addAssignment(domainName) {
    let option = document.createElement("option");
    option.className = "assignment";
    option.textContent = domainName;
    option.setAttribute("data-key", `page:${domainName}`);
    this._assignedDomains.appendChild(option);
  }
}

function loadGroupSettings(data) {
  var groupSettings = document.getElementById("group-settings");
  var lookup = new Map();
  console.log('loadGroupSettings()');

  if (!data.hasOwnProperty("groups")) {
    let el = document.createElement("p");
    el.innerText = "Seems we don't have anything here...";
    groupSettings.appendChild(el);
    return;
  }

  for (let index = 0; index < data.groups.length; ++index) {
    let setting = new GroupSetting(data.groups, index);
    lookup.set(data.groups[index].uuid, setting);
    groupSettings.appendChild(setting.view);
  }

  // check for page assignments
  for (let key of Object.keys(data)) {
    if (key.indexOf("page:") !== 0) {
      continue;
    }

    let setting = lookup.get(data[key].group);
    if (setting) {
      setting.addAssignment(key.slice(5));
    }
  }
}

function clearGroupSettings() {
  let groupSettings = document.getElementById("group-settings");
  while (groupSettings.lastChild && groupSettings.lastChild.id !== "createGroup") {
    groupSettings.removeChild(groupSettings.lastChild);
  }
}

function saveSettings(key, value) {
  let obj = {};
  obj[key] = value;
  browser.storage.local.set(obj);
}

function loadRegularSettings(data) {
  let reverseTabDisplay = document.getElementById("reverseTabDisplay");
  reverseTabDisplay.checked = data.reverseTabDisplay;
  reverseTabDisplay.addEventListener("click", (e) => {
    saveSettings("reverseTabDisplay", reverseTabDisplay.checked);
  });

  let openSidebarOnClick = document.getElementById("openSidebarOnClick");
  openSidebarOnClick.checked = data.openSidebarOnClick;
  openSidebarOnClick.addEventListener("click", (e) => {
    saveSettings("openSidebarOnClick", openSidebarOnClick.checked);
  });

  let discardOnGroupChange = document.getElementById("discardOnGroupChange");
  if (discardOnGroupChange == null)
    return;
  discardOnGroupChange.checked = data.discardOnGroupChange;
  discardOnGroupChange.addEventListener("click", (e) => {
    saveSettings("discardOnGroupChange", discardOnGroupChange.checked);
  });

  if (!browser.tabs.hasOwnProperty("discard")) {
    if (discardOnGroupChange == null)
      return;
    discardOnGroupChange.setAttribute("disabled", 1);
  }

  let hideOnGroupChange = document.getElementById("hideOnGroupChange");
  hideOnGroupChange.checked = data.hideOnGroupChange;
  hideOnGroupChange.addEventListener("click", (e) => {
    saveSettings("hideOnGroupChange", hideOnGroupChange.checked);
  });

  if (!browser.tabs.hasOwnProperty("hide")) {
    hideOnGroupChange.setAttribute("disabled", 1);
  }

  let showActiveGroupBadge = document.getElementById("showActiveGroupBadge");
  showActiveGroupBadge.checked = data.showActiveGroupBadge;
  showActiveGroupBadge.addEventListener("click", (e) => {
    saveSettings("showActiveGroupBadge", showActiveGroupBadge.checked);
  });

  let enablePopup = document.getElementById("enablePopup");
  enablePopup.checked = data.enablePopup;
  enablePopup.addEventListener("click", (e) => {
    saveSettings("enablePopup", enablePopup.checked);
  });

  let darkTheme = document.getElementById("darkTheme");
  darkTheme.checked = data.darkTheme;
  darkTheme.addEventListener("click", (e) => {
    saveSettings("darkTheme", darkTheme.checked);
  });

  let defaultColour = document.getElementById("defaultColour");
  defaultColour.value = data.defaultColour;
  defaultColour.addEventListener("change", (e) => {
    saveSettings("defaultColour", defaultColour.value);
  });
}

async function loadSettings() {
  let data = await browser.storage.local.get();
  loadRegularSettings(data);
  loadGroupSettings(data);
}

async function onGroupCreate(e) {
  let groupSettings = document.getElementById("group-settings");
  let newGroup = await browser.runtime.sendMessage({
    method: "createGroup",
    windowId: null
  });
  let data = await browser.storage.local.get("groups");
  clearGroupSettings();
  loadGroupSettings(data);
}

async function onImportJSON() {
  let jsonString = document.getElementById('importJSONText').value
  // let jsonDefaultString = document.getElementById('hdn').value;

  console.debug('entered string:', jsonString);
  let json = JSON.parse(jsonString);
  console.debug('got json:', json);
  let group_names = json.groups[0];
  document.getElementById("groupList").innerHTML = "";
  for (group in group_names) {
    console.debug('group:', group);
    addGroupToGroupListFromJson(group);
    let urls = group_names[group].urls;
    for (url in urls) {
      console.debug('url:', urls[url]);
    }
  }
}

function addGroupToGroupListFromJson(name) {
  var ul = document.getElementById("groupList");
  var li = document.createElement("li");
  li.appendChild(document.createTextNode(name));
  ul.appendChild(li);
}

function getTabsFromGroupJSON(groupSelected) {
  let jsonString = document.getElementById('importJSONText').value
  console.debug('entered string:', jsonString);
  let json = JSON.parse(jsonString);
  console.debug('got json:', json);
  let group_names = json.groups[0];
  for (group in group_names) {
    if (group != groupSelected)
      continue;
    document.getElementById("tabsList").innerHTML = "";
    console.debug('group:', group);
    let urls = group_names[group].urls;
    for (url in urls) {
      addTabsToTabsListFromJson(urls[url]);
      console.debug('url:', urls[url]);
    }
  }
}

function addTabsToTabsListFromJson(name) {
  var ul = document.getElementById("tabsList");
  var li = document.createElement("li");
  li.appendChild(document.createTextNode(name));
  ul.appendChild(li);
}

function getEventTarget(e) {
  e = e || window.event;
  return e.target || e.srcElement;
}

var ul = document.getElementById('groupList');
ul.onclick = function (event) {
  var target = getEventTarget(event);
  console.debug('selected:', target.innerHTML);
  getTabsFromGroupJSON(target.innerHTML)
};

// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Working_with_files
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Working_with_files#open_files_in_an_extension_using_a_file_picker
document.getElementById("createGroup").addEventListener("click", onGroupCreate);
document.addEventListener("DOMContentLoaded", loadSettings);
document.getElementById("importJSONButton").addEventListener("click", onImportJSON);
document.getElementById('importJSONText').value = document.getElementById('hdn').value;
