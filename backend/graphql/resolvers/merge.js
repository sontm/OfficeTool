
const transformPoll = event => {
    return {
        ...event._doc,
        id: event.id
    }
}

exports.transformPoll = transformPoll;