exports.get = function() {
    return {
        contentType: 'application/json',
        body: {
            hits: [
                {id: 1, displayName: "The first"},
                {id: 2, displayName: "The second"},
                {id: 3, displayName: "The third"},
                {id: 4, displayName: "The fourth"},
                {id: 5, displayName: "The fifth"},
            ],
            count: 5,
            total: 5
        }
    };
};