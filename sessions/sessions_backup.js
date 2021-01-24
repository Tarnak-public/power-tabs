var sessionsStored = JSON.parse("{}");
/*

*/
function getStoredSessions() {
    let value = browser.storage.local.get("key");

    //get groups json
    //const groups = await browser.storage.local.get("groups");

    console.log("sessionsStored pre load=", sessionsStored);
    //get sessions json
    sessionsStored = browser.storage.local.get("sessions");
    if (sessionsStored == null)
        sessionsStored = JSON.parse("{}");
    console.log("sessionsStored POST load=", sessionsStored);
}