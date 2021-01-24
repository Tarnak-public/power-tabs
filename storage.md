## Storage Layout

This is documentation to better understand and document the current layout of the storage system used in the extension.

### Storage

|         Keys         |   Type  |                              Value                               |
| :------------------: | :-----: | :--------------------------------------------------------------: |
|       `groups`       |  Array  |                   An array of `Group` objects                    |
|  `page:<url here>`   |  Object |                     An `Assignment` object.                      |
| `reverseTabDisplay`  | Boolean |            Whether to reverse tab display in groups.             |
| `openSidebarOnClick` | Boolean | Whether to open the sideback when the toolbar button is clicked. |


### Objects

A list of objects referred.

#### Group

Represents a tab group obviously.

|  Keys  |   Type  |            Value            |
| :----: | :-----: | :-------------------------: |
|  name  |  String |        The group name       |
|  uuid  |  String |    The group's unique ID    |
|  open  | Boolean |  Whether the group is open  |
| active | Boolean | Whether the group is active |


#### Assignment

Represents an automatic assignment. Basically a URL that is assigned to automatically open in a group.

|   Keys   |   Type  |                                Value                                 |
| :------: | :-----: | :------------------------------------------------------------------: |
|  group   |  String |         The group's unique ID that refers to this assignment         |
| neverAsk | Boolean | Whether to ask to redirect if the group differs from the assignment. |


#### Methods 
----
listen.js createGroup()
    browser.storage.local.get return stored groups json:
    about:debugging#/runtime/this-firefox
    about:devtools-toolbox?id=power-tabs%40rapptz-addons.com&type=extension
     "[{"name":"untitled","uuid":"e565f959-3dc2-487a-8823-171e87c502dd","open":true,"active":false,"colour":"#000000"},{"name":"untitled","uuid":"017779f7-8c22-44c8-88d1-171b55abffe5","open":true,"active":false,"colour":"#000000"},{"name":"untitled","uuid":"631aedd6-016d-45a2-8e3e-b34171aaca61","open":true,"active":true,"colour":"#000000"}]"
----
listen.js createTab()
it setting active-group and creating tab by browser.tabs.create() but with known active-group now.
----
listen.js onTabCreated() here during creation of tab, it's assigned to group by :
    browser.sessions.setTabValue(tabInfo.id, "group-id", groupId);
results in sessionstore.jsonlz4as
    "windows": [{
            "tabs": [{
                    "entries": [{
                    "extData": {
                        "extension:power-tabs@rapptz-addons.com:group-id": "\"ee71903a-0c81-4144-a0ad-59abc95092b8\""
                    },

you can read it:
    browser.sessions.getTabValue(message.tabId, "group-id");
----
confirm.js loadData()
seems to be a method which matches tabs to groups during tab creation.
----

------------------------------------------------------------------------
#### helping links

---- web extensions examples:
this one save data to own extensions storage:
https://github.com/mdn/webextensions-examples/tree/master/favourite-colour

edytor online:
https://jsoneditoronline.org/#right=local.disequ&left=cloud.15aa24c3ab9f460287daf4301c810add

https://www.w3schools.com/js/js_json_datatypes.asp



extension anatomy:
https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Anatomy_of_a_WebExtension

decompress lz4json:
https://www.jeffersonscher.com/ffu/bookbackreader.html