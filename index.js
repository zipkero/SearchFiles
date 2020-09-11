import SearchFiles from './SearchFiles.js';
const sf = new SearchFiles();

const getFiles = async () => {
    const fileList = await sf.search("./pages", {
        extensions: [".js"],
        mapFn: null,
        regexFilters: []
    })
    console.log(fileList);
}

getFiles();
