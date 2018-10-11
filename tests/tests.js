var expect = require('chai').expect;
var Foswig = require('../lib/index');
var dictionary = require('./dictionary');

function customRandom(seed) {
	return function() {
		seed += 0.01234;
		if (seed >= 1) {
			seed -= 1;
		}
		return seed;
	};
}

describe('Foswig',function() {
	describe('generateWord',function() {
		it('should generate words of the correct length',function() {
			var markov = new Foswig(2);
			markov.addWordsToChain(dictionary);

			for (var i = 0;i < 100; ++i) {
                while (true) {
                    try {
                        var word = markov.generateWord(2,5,true);
                        break;
                    } catch (err) {
                        // sometimes the word generator cannot satisfy the 
                        // length constraints in the default number of attempts.
                        // This is expected, so we'll just try again
                    }
                }
				expect(word.length).to.be.at.least(2);
				expect(word.length).to.be.at.most(5);
				//console.log(word);
			}
		});

		it('should not generate duplicate words from the input dictionary',function() {
			var markov = new Foswig(2);
			markov.addWordsToChain(dictionary);

			for (var i = 0;i < 100; ++i) {
                try {
                    var word = markov.generateWord(2,5,false);
                    break;
                } catch (err) {
                    // sometimes the word generator cannot satisfy the 
                    // length constraints in the default number of attempts.
                    // This is expected, so we'll just try again
                }
				expect([word]).to.not.have.members(dictionary);
				//console.log(word);
			}
		});

		it('can use a custom random number generator to make reproducible words',function() {
			var markov = new Foswig(2);
			markov.addWordsToChain(dictionary);

			expect(markov.generateWord(2,10,false,undefined,customRandom(0))).to.be.equal('abilinions');
			expect(markov.generateWord(2,10,false,undefined,customRandom(0))).to.be.equal('abilinions');
			expect(markov.generateWord(2,10,false,undefined,customRandom(0.5))).to.be.equal('lipergin');
		});
	});
});

