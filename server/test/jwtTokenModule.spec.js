const expect = require('chai').expect;
const { signJWTToken, verifyJWTToken } = require('../modules');
const config = require('../../config');

const payload = {
	username: "Thor",
	password: "Asgard"
};
let generatedToken = undefined;

describe('JWT Token test scenarios', function() {
	before(function(done) { done(); });
	after(function(done) { done(); });

	it('Assert signing & verification methods exists and are valid', function() {
		expect(signJWTToken).to.not.equal(undefined);
		expect(signJWTToken).to.not.equal(null);
		expect(typeof(signJWTToken)).to.equal('function');
		expect(signJWTToken.length).to.be.above(0, 'this method must have arguments');

		expect(verifyJWTToken).to.not.equal(undefined);
		expect(verifyJWTToken).to.not.equal(null);
		expect(typeof(verifyJWTToken)).to.equal('function');
		expect(verifyJWTToken.length).to.be.above(0, 'this method must have arguments');

		expect(signJWTToken).to.be.an('function');
	});

	it('sign a token with valid payload, signature, secret and expiry time', function(done) { 
		signJWTToken(payload, config.secret, 3600, (err, token) => {
			if(err){
				return done(err);
			} else {
				generatedToken = token;					
				expect(token).to.not.equal(null, "generated token should not be null");
				expect(token.length).to.be.above(0, "generated token should have a length");
				done();
			}
		});
	});
	
	
	it('verification of a valid signed token, must return same payload, which was passed', function(done) { 
		
		verifyJWTToken(generatedToken, config.secret, (err, decoded) => {
			if(err){
				return done(err);
			} else {				
				expect(payload.username).to.be.equal(decoded.username, "Wrong username");
				done();
			}
		})
	});
	
	
	it('verification of a expired token, must return with appropriate error', function(done) { 
		signJWTToken(payload, config.secret, 0, (err, token) => {
			if(err) {
				return done(err);
			} else {
				generatedToken = token;
				expect(token).to.not.equal(null, "generated token should not be null");
				expect(token.length).to.be.above(0, "generated token should have a length");
				verifyJWTToken(generatedToken, config.secret, (err, decoded) => {
					expect(err).to.not.equal(null, "error should not be null in this case(token expired)!");
					expect(err).to.be.equal('jwt expired');
					done();
				});
			}
		})	
	});
	
	
	it('verification of a invalid, must return with appropriate error', function(done) { 
		verifyJWTToken('invalid token ahjahjah', config.secret, (err, decoded) => {
			expect(err).to.not.equal(null, "error should not be null here(invalid token)");
			expect(err).to.be.equal('jwt malformed');
			done();
		});
	});

});