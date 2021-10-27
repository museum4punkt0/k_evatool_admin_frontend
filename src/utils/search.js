const searchForWordsInString = (data, search, keys) => {
    const searchArr = search.toString().toLowerCase().split(' ')
    let results = data
    for (let s = 0; s < searchArr.length; s++) {
        results = results.filter((m) => {
            return keys.some((key) =>
                String(m[key]).toLowerCase().includes(searchArr[s]),
            )
        })
    }
    return results
}

export { searchForWordsInString }
