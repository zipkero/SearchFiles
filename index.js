import SearchFiles from './SearchFiles.js';
const sf = new SearchFiles();

const getFiles = async () => {
    const fileList = await sf.search("./pages", {        
        mapFn: null,
        extensions: ["cs"],
        filters: []
    })
    console.log(fileList);
}

getFiles();
