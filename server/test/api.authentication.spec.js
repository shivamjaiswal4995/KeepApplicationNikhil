const expect = require('chai').expect;
const request = require('supertest');
const app = require('../index');

const payload = {
  username: 'Iron man',
  password: 'billionare'
}

let token = undefined;

describe('Authentication APIs test scenarios', function() {

  it('Signin API with valid credentials and expect a valid token', function(done) { 
    request(app)
      .post('/api/v1/users/signin')
      .send(payload)
      .end((err, res) => {
        if(err) {
          return done(err);
        } else {
          expect(res.statusCode).to.equal(200, 'status code should be 200');
          token = res.text;          
          expect(res.text.length).to.be.above(0, 'generated token must have some length!');
          done();
        }
      });
  });
  // Food for thought, what should happen if a API call happens after signout ,with the token issued earlier which has still not expired

  describe('Negative test scenarios', function() {
    it('Make a API request to a resource with token, which requires authentication, should return the resource data ', function(done) { 
      request(app)
        .get('/api/v1/notes')
        .set('Authorization', 'Bearer ' + token)
        .end((err, res) => {
          if(err){
            return done(err);
          } else  {
            expect(res.statusCode).to.equal(200, 'status code should be 200');            
            expect(res.body.length).to.above(0, 'should have resource data');
            expect(res.body[0].title).to.be.equal('Mastering Algorithms', 'Wrong title!');
            done();
          }
        });
    });
    
    
    it('Make a API request to a resource with invalid token, which requires authentication, should return forbidden status and error ', function(done) { 
      request(app)
        .get('/api/v1/notes')
        .set('Authorization', 'Bearer ' + 'ytytyqoaldk')
        .end((err, res) => {
          if(err){
            return done(err);
          } else  {
            expect(res.statusCode).to.equal(403, 'status code should be 403');
            expect(res.text).to.to.equal('jwt malformed');            
            done();
          }
        });
    });
    
    
    it('Make a API request to a resource without any token, which requires authentication, should return forbidden status and error ', function(done) { 
      request(app)
        .get('/api/v1/notes')
        .end((err, res) => {
          if(err){
            return done(err);
          } else  {
            expect(res.statusCode).to.equal(403, 'status code should be 403');
            expect(res.text).to.to.equal('Not authenticated');            
            done();
          }
        });
    });
  });

});