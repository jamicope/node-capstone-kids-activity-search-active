exports.DATABASE_URL = process.env.DATABASE_URL ||
    global.DATABASE_URL ||
    (process.env.NODE_ENV === 'production' ?
     'mongodb://admin:admin@ds155192.mlab.com:55192/node-capstone-kids-activity-search-active' :
     'mongodb://admin:admin@ds155192.mlab.com:55192/node-capstone-kids-activity-search-active');
exports.PORT = process.env.PORT || 5000;
