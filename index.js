import SearchFiles from './SearchFiles.js';

const sf = new SearchFiles();

const getFiles = async () => {
    const fileList = await sf.search("./sample", {
        mapFn: null,
        extensions: ["js"],
        type: 'and',
        keywords: ["Untitled"],
        filters: []
    })
    console.log(fileList);
}


getFiles();
