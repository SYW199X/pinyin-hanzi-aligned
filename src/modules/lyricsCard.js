import React, {useEffect, useState} from 'react'

const SONG = 0;

function LyricsDisplay() {
    const [songs, setSongs] = useState();
    const [title, setTitle] = useState();
    const [origLyrics, setLyrics] = useState();
    const [pinyin, setPinyin] = useState();
    const [lineLen, setLen] = useState();
    const [numRows, setRows] = useState();
    const [rows, createRows] = useState();
    const [style, setStyle] = useState();
    useEffect(() => {
        fetch('manifest.json')
        .then(res => res.json())
        .then(data => {
            setSongs(data.songs);
            return data.songs;
        })
        .then(songs => setTitle(
            <div style={{display: 'flex', flexDirection: 'column', margin: '10px 0'}}>
                <div style={{fontSize: '2em', margin: '10px 0'}}>{songs[SONG].name}</div>
                <div style={{fontSize: '1.5em'}}>{songs[SONG].artist}</div>
            </div>
        ));
    }, [])
    useEffect(() => {
        if (!songs || !title) return;
        fetch(songs[SONG].charLyrics)
        .then(res => res.text())
        .then(data => setLyrics(data))
        fetch(songs[SONG].pinyinLyrics)
        .then(res => res.text())
        .then(data => setPinyin(data))
    }, [songs, title])
    useEffect(() => {
        if (!origLyrics || !pinyin) return;
        let curr = 0;
        let currMax = 0;
        let currRows = 0;
        for (let c of origLyrics) {
            if (c !== ' ') {
                curr++;
            }
            if (curr > currMax) currMax = curr;
            if (c === '\n') {
                currRows++;
                curr = 0;
            }
        }
        console.log(currMax);
        setLen(currMax-2);
        setRows(currRows);
        const rowStyle = {
            display: "grid",
            gridTemplateColumns: `repeat(${currMax-2}, 1fr)`,
            justifyContent: "center"
        }
        setStyle(rowStyle);
    }, [origLyrics, pinyin])

    // Fetch is complete, proceed to next step
    useEffect(() => {
        if (!numRows || !lineLen || !style) return;
        console.log("GO")
        let origLyricsRow = [];
        let pinyinRow = [];
        let allLyricsRows = [];
        let allPinyinRows = [];
        let lyricsRowsContained = [];
        let i = 0;
        let j = 0;
        for (let c of origLyrics) {
            if (c !== ' ') {
                origLyricsRow.push(<div className='box' key={j}>{c}</div>);
                j++;
            }
            if (c === '\n') {
                allLyricsRows[i] = origLyricsRow;
                i++;
                origLyricsRow = [];
            }
        }
        i = j = 0;
        let buffer = [];
        for (let c of pinyin) {
            if (c === ' ') {
                pinyinRow.push(<div className='box' key={j}>{buffer}</div>);
                buffer = [];
            } else if (c === '\n') {
                pinyinRow.push(<div className='box' key={j}>{buffer}</div>)
                allPinyinRows[i] = pinyinRow;
                i++;
                pinyinRow = [];
                buffer = [];
            } else {
                buffer.push(c);
            }
            j++;
        }
        // allLyricsRows = origLyrics.map(() => {})
        i = 0;
        allLyricsRows.forEach((row, index) => {
            let placeholder = [];
            for (let i = 0; i <= (lineLen-row.length)/2; i++) {
                placeholder.push(<div key={i}></div>);
            }
            lyricsRowsContained[index] = 
                <div key={index} className='big-row'>
                    <div style={style} className='row'>{placeholder}{allPinyinRows[index]}</div>
                    <div style={style} className='row'>{placeholder}{row}</div>
                </div>
        });
        createRows(lyricsRowsContained);
        console.log("here");
    }, [lineLen, numRows, style])
    return (!rows ? <div>loading...</div> :
        <>
            <div style={{textAlign: 'center'}}>{title}<br /></div>
            {rows}
        </>
    )
}

export default LyricsDisplay