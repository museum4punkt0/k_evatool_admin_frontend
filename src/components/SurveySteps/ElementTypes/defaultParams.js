const TYPES = {
    SIMPLETEXT: 'simpleText',
    MULTIPLECHOICE: 'multipleChoice',
    VIDEO: 'video',
    EMOJI: 'emoji',
    STARRATING: 'starRating',
    BINARY: 'binary',
    YAYNAY: 'yayNay',
}
export default (type, languages) => {
    switch (type) {
        case TYPES.SIMPLETEXT: {
            const text = {}
            languages.forEach((language) => {
                text[language.code] = `text ${language.code}`
            })
            return {
                text,
            }
        }
        case TYPES.MULTIPLECHOICE: {
            const question = {}
            const options = []
            const option = { value: 'value', labels: {} }
            languages.forEach((language, index) => {
                question[language.code] = `question ${language.code}`
                option['labels'][
                    language.code
                ] = `option ${index} (${language.code})`
            })
            options.push(option)
            return {
                question,
                minSelectable: 1,
                maxSelectable: 2,
                options,
            }
        }
        case TYPES.VIDEO: {
            return {
                videoAssetId: -1,
            }
        }
        case TYPES.EMOJI: {
            const question = {}
            languages.forEach((language) => {
                question[language.code] = `question ${language.code}`
            })
            return {
                emojis: [
                    {
                        type: '😍',
                        meaning: 'volle zustimmung',
                    },
                    {
                        type: '😃',
                        meaning: 'zustimmung',
                    },
                    {
                        type: '🙂',
                        meaning: 'neutral',
                    },
                    {
                        type: '😦',
                        meaning: 'ablehnung',
                    },
                    {
                        type: '😡',
                        meaning: 'volle ablehnung',
                    },
                ],
                question,
            }
        }
        case TYPES.STARRATING: {
            const question = {}
            languages.forEach((language) => {
                question[language.code] = `question ${language.code}`
            })
            return {
                numberOfSteps: 5,
                allowHalfSteps: false,
                question,
            }
        }
        case TYPES.BINARY:
        case TYPES.YAYNAY: {
            const question = {}
            const trueLabel = {}
            const falseLabel = {}
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
            languages.forEach((language) => {
                question[language.code] = `question ${language.code}`
                trueLabel[language.code] = createTrueLabel(language)
                falseLabel[language.code] = createFalseLabel(language)
            })
            return {
                question,
                trueValue: 'accepted',
                falseValue: 'declined',
                trueLabel,
                falseLabel,
            }
        }
    }
}
