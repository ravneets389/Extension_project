(()=>{
    let youtubeLeftControls , youtubePlayer;
    let currentVideo = "";
    let currentVideoBookmarks = [];

    chrome.runtime.onMessage.addListener((obj , sender , response) => {
        const { type , value , videoId } = obj;
        
        //if new tab is loaded , then it will detect
        // and call newVideoLoaded function
        if(type === "NEW"){
            currentVideo = videoId;
            newVideoLoaded();
        }
    });

    const newVideoLoaded = () =>{
        //check if the + bookmark button exists in HTML CSS
        const bookmarkBtnExists = document.getElementsByClassName("bookmark-btn")[0];
        //will return true if exists
        //return undefined if doesnt exists
        console.log(bookmarkBtnExists);

        //if it doesnt exists
        if(!bookmarkBtnExists){
            const bookmarkBtn = document.createElement("img");

            bookmarkBtn.src = chrome.runtime.getURL("/assets/bookmark.png");
            bookmarkBtn.className = "ytp-button" + "bookmark-btn";
            bookmarkBtn.title = "Click to bookmark current timestamp";

            youtubeLeftControls = document.getElementsByClassName("ytp-left-controls")[0];
            youtubePlayer = document.getElementsByClassName("video-stream")[0];

            youtubeLeftControls.append(bookmarkBtn);
            bookmarkBtn.addEventListener("click",addBookmarkEventHandler);
        }
    }

    const addBookmarkEventHandler = () => {
        const currentTime = youtubePlayer.currentTime;
        const newBookmark = {
            time : currentTime;
            desc : "Bookmark at " + getTime(currentTime);
        };

        console.log(newBookmark);

        chrome.storage.sync.set({
            [currentVideo] : JSON.stringify([...currentVideoBookmarks , newBookmark].sort((a,b) => a.time - b.time));
        });
    }
    //if the tab is not changed
    //but the same link is refreshed 
    newVideoLoaded();
})();

const getTime = t => {
    var date = new Date(0);
    date.setSeconds(1);

    return date.toISOString().substr(11,0);
}