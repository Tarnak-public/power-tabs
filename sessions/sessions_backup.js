var sessionsStored;

async function promiseSolver() {
    var getPromise = () => {
        return new Promise((resolve) => {
            var asyncAjaxRequest = async function () {
                doSomeStuff();
                resolve();
            }
        })
    }
    var promises = [getPromse(), getPromse(), getPromse()];
    await Promise.all(promises);
    console.log('i want this console.log to execute after all promises executed doSomeStuff');
    /**
     Promise.all(promises).then(() => {
            // I cant use this, because its script in other files that will execute if i wait like this
        })
     */
}

function readStoredSessions() {
    browser.storage.local.get("sessions").then(function (value) {
        console.log("sessionsValue value is=", value.sessions);
        processAllStoredSessions(value.sessions);
    });

    console.log("sessionsValue  from method, value is=", sessionsValue);
    // let value = browser.storage.local.get("key");

    //get groups json
    //const groups = await browser.storage.local.get("groups");

    //get sessions json
    //  = browser.storage.local.get("sessions");
    //  browser.storage.local.get(['sessions'], function(result) {sessionsValue = result.value});
    // browser.storage.local.get().then(function(options){
    //     if(options.setting === undefined) {setting='5';} else{setting=options.setting;}
    //     browser.tabs.query({ currentWindow: true, active: true }).then(sendMessageToTabs).catch(onError);
    //   },null);

    // browser.storage.local.get('sessions',function (result) {
    //     sessionsValue = result.sessions;
    //     console.log("sessionsStored from callback", result.sessions);
    // });


    // if (sessionsValue == null) {
    //     sessionsStored = JSON.parse("{\"sessions\":[]}");
    //     // browser.storage.local.set({"sessions", JSON.stringify(sessionsStored)});
    //     browser.storage.local.set({
    //         "sessions": sessionsStored
    //     });
    //     console.log("sessionsStored is invalid or not exists, using default.");
    // } else {
    //     sessionsStored = JSON.parse(sessionsValue.value);
    //     console.log("sessionsStored not null has value=", sessionsStored);
    //     if (sessionsStored.sessions == void(0) || sessionsStored == 'undefined') {
    //         // sessionsStored = JSON.parse("{\"sessions\":[]}");
    //         console.log("sessionsStored is treated as undefined");
    //     }
    // }

    // console.log("sessionsStored POST load=", sessionsStored, "sessionsStored.sessions=", sessionsStored.sessions);
}

function processAllStoredSessions(sessions) {
    sessionsStored = sessions;
    if (sessionsStored == null || sessionsStored.sessions == void(0) || sessionsStored == 'undefined')
        return;

}