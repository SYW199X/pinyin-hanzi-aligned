import React, {useEffect, useState} from 'react'

function LyricsDisplay() {
    const [origLyrics, setLyrics] = useState();
    const [lineLen, setLen] = useState();
    const [numRows, setRows] = useState();
    const [rows, createRows] = useState();
    const [parseFinshed, startConstruction] = useState();
    useEffect(() => {
        fetch('/lyricText/1c.txt')
        .then(res => res.text())
        .then(data => setLyrics(data))
    }, [])
    useEffect(() => {
        if (!origLyrics) return;

        let curr = 0;
        let currMax = 0;
        let currRows = 0;
        for (let c of origLyrics) {
            curr++;
            if (curr > currMax) currMax = curr;
            if (c === '\n') {
                currRows++;
                curr = 0;
            }
        }
        console.log(currMax);
        setLen(currMax-1);
        setRows(currRows);
    }, [origLyrics])

    useEffect(() => {
        if (!rows || !lineLen) return;
        startConstruction(true);
    }, [rows, lineLen])

    useEffect(() => {
        if (!parseFinshed) return;
        let thisRow = '';
        let allRows = [];
        let rowsContained = [];
        let i = 0;
        for (let c of origLyrics) {
            thisRow += <div>{c}</div>;
            if (c === '\n') {
                allRows[i] = thisRow;
                i++;
                thisRow = '';
            }
        }
        console.log(i);
        i = 0;
        for (let row of allRows) {
            rowsContained[i] = <div className='row'>{row}</div>
            i++;
        }
        setRows(rowsContained);
    }, [parseFinshed])
    return (!rows ? <div>loading...</div> :
        <div>
            {rows}
        </div>
    )
}

export default LyricsDisplay
