var selectedItemGroupList = null;
var jsonImported;

/**
 * [Description]
 * react on changing active item in group list, highlight new item
 * @param newActiveItem - li object
 */
function changeGroupListActiveItem(newActiveItem) {
  if (selectedItemGroupList != null && selectedItemGroupList != newActiveItem)
    selectedItemGroupList.className = "";

  newActiveItem.className = "grey";
  selectedItemGroupList = newActiveItem;
  //   console.debug("new active item: " + newActiveItem);
}

/**
 * [Description]
 * read from json and find groupSelected and insert to li urls
 * @param json - from which should read groups
 * @param groupSelected - from this group read urls
 */
function getTabsFromGroupJSON(json, groupSelected) {
  //   console.debug("getTabsFromGroupJSON() groupSelected:", groupSelected);
  //   console.debug("got json:", json);
  let group_names = json.groups[0];
  for (group in group_names) {
    if (group != groupSelected) continue;
    document.getElementById("tabsNames").innerHTML = "Tabs [" + group + "]:";
    document.getElementById("tabsList").innerHTML = "";
    // console.debug("group:", group);
    let urls = group_names[group].urls;
    for (url in urls) {
      addTabsToTabsListFromJson(urls[url]);
      //   console.debug("url:", urls[url]);
    }
  }
}

/**
 * [Description]
 * create url represented by name
 * @param name url
 */
function addTabsToTabsListFromJson(name) {
  var ul = document.getElementById("tabsList");
  var li = document.createElement("li");
  li.appendChild(document.createTextNode(name));
  ul.appendChild(li);
}

async function onImportJSON() {
  let jsonString = document.getElementById("importJSONText").value;
  console.debug("entered string:", jsonString);
  jsonImported = JSON.parse(jsonString);
  console.debug("got json:", jsonImported);
  let group_names = jsonImported.groups[0];
  document.getElementById("groupList").innerHTML = "";
  for (group in group_names) {
    console.debug("group:", group);
    let urls = group_names[group].urls;
    // addGroupToGroupListFromJson(group + " (" + urls.length + ")");
    addGroupToGroupListFromJson(group, urls.length);
    for (url in urls) {
      console.debug("url:", urls[url]);
    }
  }
}

function addGroupToGroupListFromJson(name, tabsCount) {
  var ul = document.getElementById("groupList");
  var li = document.createElement("li");
  li.appendChild(document.createElement("class"));
  let textNode = document.createTextNode(name + " (" + tabsCount + ")");
  li.accessKey = name;
  li.appendChild(textNode);
  ul.appendChild(li);
}
