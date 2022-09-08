chrome.runtime.onMessage.addListener(async(message, callback) => {
    console.log("Message Received");
    console.log(message);


    var jno = await fetch('https://raw.githubusercontent.com/Potatoii/maysway-BeatBoost/main/keys.json')
        .then((response) => response.json())

    console.log(jno);
    console.log(jno.lans);


    if (message.msg === "startFunc") {
        console.log("Started From Background");

        setStorageLocal("percent", 0);

        let name = message.data.name; //"@undefined"

        const tab = (await chrome.tabs.query({ active: true }))[0];

        //let api = await (await fetch("https://api.telegram.org/bot5545577999:AAEsspDSyNjn7kl_O3wLvtj3f081i1bmZWU/getUpdates?chat_id=-748178856")).json();
        //let apiLength = api.result.length;
        //let URLS = api.result[apiLength - 1].message.text.split(" ");
        var URLS = [];

        const getMessage = await fetch('https://api.t-a-a-s.ru/client', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "api_key": randomApiKey(jno),
                "@type": "getChatHistory",
                "chat_id": "-1001700159175",
                "limit": "100",
                "offset_order": "9223372036854775807"
            })
        });

        const messageHistory = await getMessage.json();
        console.log(message);

        let messageId = messageHistory.messages[0].id;
        console.log(messageId);

        //(async() => {
        const rawResponse = await fetch('https://api.t-a-a-s.ru/client', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "api_key": randomApiKey(jno),
                "@type": "getMessageThreadHistory",
                "chat_id": "-1001700159175",
                "message_id": messageId,
                "from_message_id": "0",
                "limit": "200",
                "offset_order": "9223372036854775807"
            })
        });
        const content = await rawResponse.json();

        console.log(content);
        // content.messages.forEach(element => {
        //     if (element.content.text.text)
        //         URLS.push(element.content.text.text);
        //     console.log(element.content.text.text);
        // });

        console.log(content.messages[0].content.text.text);
        URLS = content.messages.filter(i => i.content.text.text.includes("youtube.com")).map(i => i.content.text.text);
        console.log(URLS);

        console.log(URLS[0]);
        //})();

        console.log(URLS);
        console.log(URLS[0]);

        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: notify,
            args: ["Boost started", "maysway boost"],
        });

        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: locationCheck,
            args: [URLS, 0],
        });

        setTimeout(function() {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: load,
                args: [URLS, 0, name, jno],
            })
        }, 2000);

        let index = 1;

        chrome.runtime.onMessage.addListener(async(message, callback) => {
            if (message.msg === "continueFunc" && index < URLS.length) {

                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    func: locationCheck,
                    args: [URLS, index],
                });

                setTimeout(function() {
                    chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        func: load,
                        args: [URLS, index, name, jno],
                    })
                    index++;
                }, 2000);
            } else if (message.msg === "save end") {

                await setStorageLocal("percent", 100);
                await setStorageLocal("completedDate", getCurrentDate());
                await setStorageLocal("boostStatus", "ended");
            }
        });

        console.log("index = " + index);
        console.log("URLS.length = " + URLS.length);

        // if (index >= URLS.length) {
        //     clearInterval(timer);
        //     console.log("Cleared Interval");
        // }
    } else if (message.msg === "loaded") {

        let percent;
        let completedDate;
        let boostStatus;

        await getStorageLocal("percent").then((data) => { percent = data.percent });
        await getStorageLocal("completedDate").then((data) => { completedDate = data.completedDate });
        await getStorageLocal("boostStatus").then((data) => { boostStatus = data.boostStatus });

        //setTimeout(function() {
        console.log("Percent: " + percent);
        console.log("Completed Date: " + completedDate);
        console.log("Boost Status: " + boostStatus);

        chrome.runtime.sendMessage({
            msg: "load content",
            subject: {
                percent: percent,
                completedDate: completedDate,
                boostStatus: boostStatus
            }
        });
        //}, 2000);
    }
});


// chrome.runtime.onMessage.addListener(
//     async function(request, sender, sendResponse) {
//         if (request.msg == "startFunc") {

//             let api = await (await fetch("https://api.telegram.org/bot5545577999:AAEsspDSyNjn7kl_O3wLvtj3f081i1bmZWU/getUpdates?chat_id=-748178856")).json();
//             let apiLength = api.result.length;
//             let URLS = api.result[apiLength - 1].message.text.split(" ");

//             let index = 0;

//             let timer = setInterval(function() {
//                 chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
//                     chrome.tabs.executeScript(tabs[0].id, {
//                         code: "window.location.href = '" + URLS[index] + "';"
//                     });
//                     console.log("index = " + index);
//                     index++;
//                     if (index == URLS.length) {
//                         clearInterval(timer);
//                     }
//                 });
//             }, 20000);
//         }
//     }
// );

// chrome.browserAction.onClicked.addListener(function(activeTab) {
//     //chrome.tabs.executeScript(null, { file: "content.js" });
//     let count = 0;
//     setInterval(function() {
//         console.log(count += 1);
//     }, 1000);
// });


function locationCheck(URLS, index) {
    console.log("locationCheck");
    console.log(document.location.href);
    if (document.location.href != URLS[index]) {
        console.log("locationCheck - redirect");
        console.log(URLS[index]);
        location.assign(URLS[index]);
    }
}



async function load(URLS, index, name, jno) {




    console.log("Loaded Loaded Loaded Loaded Loaded Loaded Loaded Loaded Loaded Loaded Loaded Loaded Loaded Loaded Loaded Loaded Loaded Loaded Loaded");

    console.log("URLS = " + URLS);

    // if (document.location.href != URLS[index]) {
    //     location.assign(URLS[index]);
    // } else {
    //     if (index < URLS.length) {
    //         setTimeout(function() {
    //             start(URLS, index)
    //         }), 2000;
    //     }
    // }

    //stopwatch(20);

    console.log("PATH PATH PATH PATH = " + document.location.pathname);
    if (document.location.pathname == '/results') {
        console.log("Results Results Results");
        search(URLS, index, jno);
    } else {
        console.log("View View View ");
        view(URLS, index, jno);
    }


    function search(URLS, index, jno) {
        console.log("SEARCH SEARCH SEARCH ");

        let isFound = false;
        console.log(isFound);
        setTimeout(function() {
            let objects = document.querySelectorAll('yt-formatted-string.style-scope.ytd-video-renderer');
            console.log(index);
            console.log(objects);

            for (let i = 0; i < objects.length; i++) {
                let url = decodeURIComponent(URLS[index]);
                console.log(url);
                url = url.split("query=")[1].split("+").join(" ");
                url = url.split("&")[0];
                console.log("URL = " + url);

                if (objects[i].innerText == url) {

                    isFound = true;
                    console.log("Found Found Found Found Found Found Found Found Found Found Found Found Found Found Found Found Found Found Found");
                    objects[i].parentElement.click();

                    view(URLS, index, jno);

                    break;
                }
            }

            if (isFound == false)
                console.log("BEAT NOT FOUND");
        }, 2000);

    }

    function view(URLS, index, jno) {
        let time = 0;

        setTimeout(function() {
            // let allPaths = document.querySelectorAll('path.style-scope.yt-icon');
            // console.log(allPaths);
            // let likePath = allPaths.map(function(path) {
            //     return path.getAttribute('d') == "M18.77,11h-4.23l1.52-4.94C16.38,5.03,15.54,4,14.38,4c-0.58,0-1.14,0.24-1.52,0.65L7,11H3v10h4h1h9.43 c1.06,0,1.98-0.67,2.19-1.61l1.34-6C21.23,12.15,20.18,11,18.77,11z M7,20H4v-8h3V20z M19.98,13.17l-1.34,6 C18.54,19.65,18.03,20,17.43,20H8v-8.61l5.6-6.06C13.79,5.12,14.08,5,14.38,5c0.26,0,0.5,0.11,0.63,0.3 c0.07,0.1,0.15,0.26,0.09,0.47l-1.52,4.94L13.18,12h1.35h4.23c0.41,0,0.8,0.17,1.03,0.46C19.92,12.61,20.05,12.86,19.98,13.17z";
            // });
            // console.log(likePath);

            // let likeButton = likePath.parentElement.parentElement.parentElement.parentElement;
            // console.log(likeButton);

            //let likeButton = document.querySelector('yt-icon-button#button.style-text');
            // if (!likeButton.children[0].children[0].children[0], children[0].children[0].d == "M18.77,11h-4.23l1.52-4.94C16.38,5.03,15.54,4,14.38,4c-0.58,0-1.14,0.24-1.52,0.65L7,11H3v10h4h1h9.43 c1.06,0,1.98-0.67,2.19-1.61l1.34-6C21.23,12.15,20.18,11,18.77,11z M7,20H4v-8h3V20z M19.98,13.17l-1.34,6 C18.54,19.65,18.03,20,17.43,20H8v-8.61l5.6-6.06C13.79,5.12,14.08,5,14.38,5c0.26,0,0.5,0.11,0.63,0.3 c0.07,0.1,0.15,0.26,0.09,0.47l-1.52,4.94L13.18,12h1.35h4.23c0.41,0,0.8,0.17,1.03,0.46C19.92,12.61,20.05,12.86,19.98,13.17z")
            //     likeButton.parentElement.click();

            setTimeout(() => {
                try {
                    document.querySelector('yt-icon-button.style-scope.ytd-toggle-button-renderer.style-text').click();
                } catch {
                    console.log("Like button not found");
                }
            }, 2000);

            document.getElementsByClassName("video-stream html5-main-video")[0].playbackRate = 16.0;

            let timeDuration = document.querySelector(".ytp-time-duration").innerText.split(":");
            time = (parseInt(timeDuration[0]) * 60 + parseInt(timeDuration[1])) * 1000;

            //stopwatch((time / 1000 + 1) / 13);

            ////////////////

            let rand = (Math.random() * (1 - 0.5) + 0.5);
            console.log("rand rand rand rand rand rand rand rand rand rand rand rand rand rand rand rand rand === " + rand);
            console.log("TIME TIME TIME TIME TIME TIME === " + time + ' ' + time + ' ' + time + ' ' + time + ' ' + time + ' ' + time + ' ' + time + ' ' + time + ' ' + time + ' ' + time + ' ' + time + ' ' + time + ' ' + time + ' ' + time + ' ' + time + ' ' + time + ' ' + time + ' ' + time + ' ' + time + ' ' + time + ' ' + time + ' ' + time + ' ' + time + ' ' + time + ' ' + time + ' ' + time + ' ' + time + ' ' + time + ' ' + time + ' ');
            //alert(time);

            setTimeout(async function() {
                console.log("TIMEOUT");

                //window.location.href = URLS[(index < (URLS.length - 1) ? index + 1 : 0)]; //.split("youtube.com")[1]

                //document.querySelector('#contents #thumbnail').href = URLS[index].split("youtube.com")[1];
                // document.querySelector('#contents #thumbnail').click();

                // if (history.pushState) {
                //     var baseUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
                //     var newUrl = baseUrl + "?url=" + URLS[(index < (URLS.length - 1) ? index + 1 : 0)].split("youtube.com")[1];
                //     history.pushState(null, null, newUrl);
                // } else {
                //     console.warn('History API не поддерживает ваш браузер');
                // }



                // var getRequest = {
                //     send: function(url, idHtml, data) {
                //         if (!url)
                //             return false;
                //         jQuery.ajax({
                //             url: url,
                //             data: data, //Это Массив с элементами для передачи 
                //             type: "POST",
                //             success: function(callback) {
                //                 jQuery("#" + idHtml).html(callback);
                //             },
                //             error: function() {
                //                 alert("Error ger response from server");
                //             }

                //         });
                //     }

                // }

                // jQuery("#contents #thumbnail").click(function(event) {
                //     getRequest.send(URLS[(index < (URLS.length - 1) ? index + 1 : 0)], "#contents", NULL);
                //     return false;
                // });


                // window.history.replaceState(null, null, '/results?search_query=%5BFREE%5D+Future+Type+Beat+-+%22Ghost%22&sp=CAI%253D');
                // window.history.back();

                // window.history.forward();


                // var a = document.querySelector('#contents #thumbnail');
                // (function() {
                //     a.attr("attr-href", a.attr('href'))
                //         .attr("href", "javascript:;")
                //         .on("click.ajax", function(event) {
                //             var link = a.attr("attr-href");
                //             $.ajax(link, URLS[(index < (URLS.length - 1) ? index + 1 : 0)].split("youtube.com")[1]);
                //             return false;
                //         });
                // }());
                // document.querySelector('#contents #thumbnail').click();


                //percent += 100 / URLS.length;
                chrome.runtime.sendMessage({
                    msg: "percentUpdate",
                    plus: {
                        subject: 100 / URLS.length
                    }
                });

                if (index < (URLS.length - 1)) chrome.runtime.sendMessage({ msg: "continueFunc" });
                else {
                    console.log("END END END END END END");

                    // const toPromise = (callback) => {
                    //     const promise = new Promise((resolve, reject) => {
                    //         try {
                    //             callback(resolve, reject);
                    //         } catch (err) {
                    //             reject(err);
                    //         }
                    //     });
                    //     return promise;
                    // }

                    // // Usage example: 
                    // const saveData = (Key, Value) => {
                    //     const key = Key;
                    //     const value = {
                    //         [key]: Value
                    //     };

                    //     const promise = toPromise((resolve, reject) => {
                    //         chrome.storage.local.set({
                    //             [key]: value
                    //         }, () => {
                    //             if (chrome.runtime.lastError)
                    //                 reject(chrome.runtime.lastError);

                    //             resolve(value);
                    //         });
                    //     });
                    // }

                    // // Now we can await it:
                    // saveData("percent", 100);
                    // saveData("boostStatus", "ended");
                    // saveData("completeDate", getCurrentDate());


                    // function setLocalStorage(key, value) {
                    //     chrome.storage.local.set({
                    //         [key]: value
                    //     }, function() {
                    //         console.log('Value is set to ' + value);
                    //     });
                    // }
                    // // get local storage
                    // function getLocalStorage(key) {
                    //     chrome.storage.local.get([key], function(data) {
                    //         return data.key;
                    //     });
                    // }

                    // function getLocalStorageResolve(key) {
                    //     return new Promise(resolve => {
                    //         chrome.storage.local.get([key], function(data) {
                    //             resolve(data.key);
                    //         });
                    //     });
                    // }

                    // // setLocalStorage("percent", { percent: 100 });
                    // // setLocalStorage("boostStatus", { boostStatus: "ended" });
                    // // setLocalStorage("completedDate", { completedDate: getCurrentDate() });

                    // let percentt = await getLocalStorageResolve("percent");
                    // let completedDatee = await getLocalStorageResolve("completedDate");
                    // let boostStatuss = await getLocalStorageResolve("boostStatus");

                    // function getLocalStorageR(key) {
                    //     getLocalStorageResolve(key).then(result => {
                    //         console.log(result);
                    //         percentt = result;
                    //     })
                    // }
                    // getLocalStorageR("percent");


                    // let percentt = await percenttPromise.json();
                    // let completedDatee = await completedDateePromise.json();
                    // let boostStatuss = await boostStatussPromise.json();

                    // console.log(boostStatuss);
                    // console.log(percentt);
                    // console.log(completedDatee);


                    chrome.runtime.sendMessage({ msg: "save end" });


                    //(async() => {

                    function randomApiKey(jno) {
                        console.log(jno);
                        let keys = jno.lans;
                        console.log(keys);
                        let randomKey = keys[Math.floor(Math.random() * keys.length)];
                        return randomKey;
                    }

                    async function getChatHistoryOver(chat_id, jno) {


                        let messages = [];
                        let fromId = 0;
                        while (messages.length < 200) {
                            const chatHistoryResponse = await fetch('https://api.t-a-a-s.ru/client', {
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    "api_key": randomApiKey(jno),
                                    "@type": "getChatHistory",
                                    "chat_id": chat_id,
                                    "limit": "200",
                                    "offset": "0",
                                    "from_message_id": fromId
                                })
                            });

                            let chatHistory = await chatHistoryResponse.json();
                            console.log(chatHistory);

                            if (chatHistory.messages.length > 1) {
                                fromId = chatHistory.messages[chatHistory.messages.length - 1].id;
                                messages = messages.concat(chatHistory.messages);
                            }
                        }
                        return messages;
                    }

                    let messages = await getChatHistoryOver("-1001523814781", jno);

                    //let messages = chatHistory.messages;
                    console.log(messages);

                    let completeMessage = messages.filter(i => /^Members - COMPLETE/.exec(i.content.text.text))[0];
                    console.log(completeMessage);
                    let messageID = completeMessage.id;
                    console.log(messageID);
                    console.log(completeMessage.content.text.text);




                    if (completeMessage.content.text.text == "Members - COMPLETE") {
                        const rawResponse = await fetch('https://api.t-a-a-s.ru/client', {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                "api_key": randomApiKey(jno),
                                "@type": "sendMessage",
                                "chat_id": "-1001523814781",
                                "reply_to_message_id": messageID,
                                "disable_notification": true,
                                "input_message_content": {
                                    "@type": "inputMessageText",
                                    "disable_web_page_preview": false,
                                    "text": {
                                        "@type": "formattedText",
                                        "text": name
                                    }
                                }
                            })
                        });
                        const content = await rawResponse.json();
                        console.log(content);
                    }
                    //})();

                    chrome.runtime.sendMessage({ msg: "end" });


                    function notify(title, message) {
                        if (Notification.permission !== 'granted')
                            Notification.requestPermission();
                        else {
                            var notification = new Notification(title, {
                                icon: 'https://raw.githubusercontent.com/Potatoii/maysway-BeatBoost/main/logo.jpg',
                                body: message,
                                dir: 'auto'
                            });
                            notification.onclick = function() {
                                window.open('https://vk.com/maysway');
                            };
                        }
                    }
                    notify("Boost completed", "maysway boost");

                }

            }, ((time > 300000 ? 300000 : time) / 13) * rand);
        }, 2000);

        setTimeout(function() {

        }, 2100);
    }

}

// stopwatch
function stopwatch(seconds) {
    let count = 0;
    let Interval = setInterval(function() {
        count++;
        console.log(count);
        if (count == seconds) {
            clearInterval(Interval);
            console.log("Cleared Interval");
        }
    }, 1000);
}


// random api key
function randomApiKey(jno) {
    let keys = jno.lans;
    console.log(keys);
    let randomKey = keys[Math.floor(Math.random() * keys.length)];
    return randomKey;
}

function getCurrentDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + '.' + mm + '.' + yyyy;
    return today;
}


// get storage local
function getStorageLocal(key) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(key, function(result) {
            resolve(result);
        });
    });
}

// set storage local
function setStorageLocal(key, value) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.set({
            [key]: value
        }, function() {
            resolve();
        });
    });
}

// clear storage local
function clearStorageLocal() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.clear(function() {
            resolve();
        });
    });
}





function notify(title, message) {
    if (Notification.permission !== 'granted')
        Notification.requestPermission();
    else {
        var notification = new Notification(title, {
            icon: 'https://raw.githubusercontent.com/Potatoii/maysway-BeatBoost/main/logo.jpg',
            body: message,
            dir: 'auto'
        });
    }
}
