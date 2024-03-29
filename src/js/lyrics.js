import api from './request'
import {renderLyrics, transformLyric} from './render'

function Lyric() {
    this.getLyrics =  function (page, audio) {
        api.getJson('lyric', page).then(data=>{
            if (data.status === 0) {
                let lyric = parseLyric(data.lyric);
                renderLyrics(lyric);
                let curTimes = Object.keys(lyric);
                transformLyric(curTimes, audio);
            }
        });
    };

    function parseLyric(lrc) {
        let lyrics = lrc.split("\n");
        let lrcObj = {};
        for (let i = 0; i < lyrics.length; i++) {
            let lyric = decodeURIComponent(lyrics[i]);
            let timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
            let timeRegExpArr = lyric.match(timeReg);
            if (!timeRegExpArr) continue;
            let clause = lyric.replace(timeReg, '');
            for (let k = 0, h = timeRegExpArr.length; k < h; k++) {
                let t = timeRegExpArr[k];
                let min = Number(String(t.match(/\[\d*/i)).slice(1)),
                    sec = Number(String(t.match(/\:\d*/i)).slice(1)),
                    minSec = Number(String(t.match(/\.\d*/i)).slice(1));
                let time = min * 60 + sec + '.' + minSec;
                lrcObj[time] = clause;
            }
        }
        return lrcObj;
    }
}

export default Lyric