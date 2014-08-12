require('should');

var execPhp = require('..');

describe('Module', function(){
    it('should throw error if user php file not found', function(done){
        (function(){
            execPhp('non-exists-file.php');
        }).should.throw();
        done();
    });
    
    it('should require the right relative file', function(done){
        execPhp('./php/1.php', function(error, result, output){
            output.should.equal('Output');
            done();
        });
    });
    
    it('should has php file method', function(done){
        execPhp('./php/2.php', function(error, result, output){
            result.should.have.property('get_user');
            done();
        });
    });
    
    it('should capture printed string of user php function', function(done){
        execPhp('./php/3.php', function(error, result, output){
            result.get_user(1, function(error, result, output, printed){
                printed.should.equal('1');
                done();
            });
        });
    });
    
    it('should capture printed string on requiring the file', function(done){
        execPhp('./php/4.php', function(error, result, output){
            result.get_user(1, function(error, result, output, printed){
                output.should.equal('2');
                done();
            });
        });
    });
    
    it('should return the right value on execution user php function', function(done){
        execPhp('./php/4.php', function(error, result, output){
            result.get_user(2, function(error, result, output, printed){
                result.should.equal(2);
                done();
            });
        });
    });
    
    it('should not create new object if it already required before', function(done){
        execPhp('./php/5.php', function(error, result, output){
            setTimeout(function(){
                execPhp('./php/5.php', function(err, res, out){
                    out.should.equal(output);
                    done();
                });
            }, 1500);
        });
    });
    
    it('really should execute php function and return right result', function(done){
        execPhp('./php/6.php', function(error, php, outprint){
            php.my_function(1, 2, function(err, result, output, printed){
                result.should.equal(3);
                done();
            });
        });
    });
});