global.DATABASE_URL = 'mongodb://admin:admin@ds155192.mlab.com:55192/node-capstone-kids-activity-search-active';

var chai = require('chai');
var chaiHttp = require('chai-http');

var server = require('../server.js');
var Activity = require('../models/activity.js');

var should = chai.should();
var app = server.app;

chai.use(chaiHttp);

describe('node-capstone-kids-activity-search-active', function () {
            before(function (done) {
                server.runServer(function () {
                    Activity.create({
                        name: 'Bike Camp'
                    }, {
                        name: 'Fitness Camp'
                    }, {
                        name: 'Sailing Camp'
                    }, function () {
                        done();
                    });
                });
            });

            describe('node-capstone-kids-activity-search-active', function () {

                    it('should find and list area activities on GET', function (done) {
                            chai.request(app)
                                .get('/activity/' + activity + '/' + state ')
                                    .end(function (err, res) {
                                        should.equal(err, null);
                                        res.should.have.status(200);
                                        res.should.be.json;
                                        res.body.should.be.a('array');
                                        res.body.should.have.length(3);
                                        res.body[0].should.be.a('object');
                                        res.body[0].should.have.property('_id');
                                        res.body[0].should.have.property('name');
                                        res.body[0]._id.should.be.a('string');
                                        res.body[0].name.should.be.a('string');
                                        res.body[0].name.should.equal('Bike Camp');
                                        res.body[1].name.should.equal('Fitness Camp');
                                        res.body[2].name.should.equal('Sailing Camp');
                                        done();
                                    });
                                }); it('should add an activity to My Planner container on POST', function (done) {
                            chai.request(app)
                                .post('/add-to-planner')
                                .send({
                                    'name': 'Ski School'
                                })
                                .end(function (err, res) {
                                    should.equal(err, null);
                                    res.should.have.status(201);
                                    res.should.be.json;
                                    res.body.should.be.a('object');
                                    res.body.should.have.property('name');
                                    res.body.should.have.property('_id');
                                    res.body.name.should.be.a('string');
                                    res.body._id.should.be.a('string');
                                    res.body.name.should.equal('Ski School');
                                    done();
                                });
                        });

                        it('should delete an item on DELETE', function (done) {
                            chai.request(app)
                                .delete('/delete-from-planner')
                                .end(function (err, res) {
                                    res.should.have.status(404);
                                    done();
                                });
                        });

                    });


                after(function (done) {
                    Activity.remove(function () {
                        done();
                    });
                });
            });
