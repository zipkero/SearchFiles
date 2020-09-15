import fs from 'fs';
import path from 'path';

const promises = fs.promises;

class SearchFiles {
    constructor() {
    }

    async search(targetPath, options) {
        let {
            extensions,
            mapFn,
            type = "and",
            keywords = [],
            filters = [],
        } = options || {};

        extensions = extensions || ["js"];
        filters = filters || [];
        const regexpInfo = {
            ext: '',
            keyword: '',
            // or 조건 /.*([.](body|body|body))$/
            // and 조건 /(?=.*body)(?=.*body)/gm            
        }

        const extFilter = extensions.reduce((arr, cur, idx) => {
            return `${arr}${idx > 0 ? "|" : ""}${cur}`
        }, "");

        const keywordFilter = keywords.reduce((arr, cur, idx) => {
            if (type === "or") {
                return `${arr}${idx > 0 ? "|" : ""}${cur}`
            } else {
                return `${arr}(?=.*${cur})`
            }
        }, "");

        regexpInfo.ext = `.*([.](${extFilter}))$`;
        regexpInfo.keyword = keywordFilter;

        mapFn = mapFn || (({dirent, dirPath, ext}) => {
            return {name: dirent.name, path: path.resolve(dirPath, dirent.name), ext}
        })

        const _getFiles = async (dirPath) => {
            let result = [];
            const dirList = await promises.opendir(dirPath);
            const extRegExp = new RegExp(regexpInfo.ext);
            const keywordRegExp = new RegExp(regexpInfo.keyword, "m");
            for await (const dirent of dirList) {
                let fullPath = path.resolve(dirPath, dirent.name);
                if (dirent.isDirectory()) {
                    result = result.concat(await _getFiles(fullPath));
                } else {
                    let ext = path.extname(fullPath)
                    if (extRegExp.test(ext) === true) {
                        //TODO - 데이터 검색 필터 추가 예정
                        if (keywords.length > 0) {
                            const data = await promises.readFile(fullPath, 'utf-8')

                            if (keywordRegExp.test(data)) {
                                result.push(mapFn({dirent, dirPath, ext}))
                            }
                        } else {
                            result.push(mapFn({dirent, dirPath, ext}))
                        }
                    } else {
                        if (filters.length > 0) {
                            result.push(mapFn({dirent, dirPath, ext}))
                        }
                    }
                }
            }
            return result;
        }

        return await _getFiles(targetPath);
    }
}

export default SearchFiles;