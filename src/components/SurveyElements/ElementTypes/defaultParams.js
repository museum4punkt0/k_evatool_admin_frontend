const TYPES = {
    SIMPLETEXT: 'simpleText',
    MULTIPLECHOICE: 'multipleChoice',
    VIDEO: 'video',
    EMOJI: 'emoji',
    STARRATING: 'starRating',
    BINARY: 'binary',
    YAYNAY: 'yayNay',
    VOICEINPUT: 'voiceInput',
    TEXTINPUT: 'textInput',
}

const createDefaultQuestion = (languages) => {
    const question = {}
    languages.forEach((language) => {
        question[language.code] = ''
    })
    return question
}

const createDefaultLabel = (languages) => {
    const labels = {}
    languages.forEach((language) => {
        labels[language.code] = ''
    })
    return labels
}

const createTrueLabel = (language) => {
    switch (language.code) {
        case 'de':
            return 'ja'
        case 'en':
            return 'yes'
        case 'fr':
            return 'oui'
        case 'it':
            return 'si'
    }
    return 'true'
}
const createFalseLabel = (language) => {
    switch (language.code) {
        case 'de':
            return 'nein'
        case 'en':
            return 'no'
        case 'fr':
            return 'non'
        case 'it':
            return 'no'
    }
    return 'true'
}

export default (type, languages) => {
    switch (type) {
        case TYPES.SIMPLETEXT: {
            const text = {}
            languages.forEach((language) => {
                text[language.code] = ''
            })
            return {
                text,
            }
        }
        case TYPES.MULTIPLECHOICE: {
            const question = createDefaultQuestion(languages)
            const options = [
                {
                    value: 'value_one',
                    commentable: false,
                    labels: createDefaultLabel(languages),
                },
                {
                    value: 'value_two',
                    commentable: false,
                    labels: createDefaultLabel(languages),
                },
            ]
            return {
                question,
                minSelectable: 1,
                maxSelectable: 1,
                options,
            }
        }
        case TYPES.VIDEO: {
            return {
                videoAssetId: -1,
            }
        }
        case TYPES.EMOJI: {
            return {
                emojis: [],
                question: createDefaultQuestion(languages),
            }
        }
        case TYPES.STARRATING: {
            return {
                question: createDefaultQuestion(languages),
                lowestValueLabel: createDefaultQuestion(languages),
                middleValueLabel: createDefaultQuestion(languages),
                highestValueLabel: createDefaultQuestion(languages),
                numberOfStars: 5,
                allowHalfSteps: false,
            }
        }
        case TYPES.BINARY: {
            const trueLabel = {}
            const falseLabel = {}

            languages.forEach((language) => {
                trueLabel[language.code] = createTrueLabel(language)
                falseLabel[language.code] = createFalseLabel(language)
            })
            return {
                question: createDefaultQuestion(languages),
                trueValue: 'ja',
                falseValue: 'nein',
                trueLabel,
                falseLabel,
            }
        }
        case TYPES.YAYNAY: {
            const trueLabel = {}
            const falseLabel = {}

            languages.forEach((language) => {
                trueLabel[language.code] = createTrueLabel(language)
                falseLabel[language.code] = createFalseLabel(language)
            })
            return {
                question: createDefaultQuestion(languages),
                trueValue: 'ja',
                falseValue: 'nein',
                trueLabel,
                falseLabel,
                assetIds: [],
            }
        }
        case TYPES.VOICEINPUT: {
            return {
                question: createDefaultQuestion(languages),
            }
        }
        case TYPES.TEXTINPUT: {
            return {
                question: createDefaultQuestion(languages),
            }
        }
    }
}
