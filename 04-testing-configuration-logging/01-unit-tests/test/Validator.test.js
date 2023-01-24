const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    
    
    
    it('Валидатор проверяет строковые поля', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({ name: 'Lalala' });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');
    });


    it('Валидатор не должен быть чувствителен к кейсу типа', () => {
      const validator = new Validator({
        name: {
          type: 'String',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({ name: 'Lalala' });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');
    });
   
   
    it('Проверка не проваливается на первой же ошибке', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
        age: {
          type: 'number',
          min: 18,
          max: 27,
        },
      });

      const errors = validator.validate(
        { name: 111, age: '111' }
      );

      expect(errors).to.have.length(2);
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect string, got number');
      expect(errors[1]).to.have.property('error').and.to.be.equal('expect number, got string');
    });
    
    it('Возвращаются корректные ошибки по максимальным значениям', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
        age: {
          type: 'number',
          min: 18,
          max: 27,
        }
      });

      const errors = validator.validate({ name: 'Lalalalalalalalalalalalalalalalalala', age: 30 });

      expect(errors).to.have.length(2);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too long, expect 20, got 36');
      expect(errors[1]).to.have.property('field').and.to.be.equal('age');
      expect(errors[1]).to.have.property('error').and.to.be.equal('too big, expect 27, got 30');
    });
    
    
    it('Возвращаются корректные ошибки по минимальным значениям', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
        age: {
          type: 'number',
          min: 18,
          max: 27,
        }
      });

      const errors = validator.validate({ name: 'la', age: 2 });

      expect(errors).to.have.length(2);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 2');
      expect(errors[1]).to.have.property('field').and.to.be.equal('age');
      expect(errors[1]).to.have.property('error').and.to.be.equal('too little, expect 18, got 2');
    });
    
    
    it('Не все поля переданы', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
        age: {
          type: 'number',
          min: 18,
          max: 27,
        }
      });

      const errors = validator.validate({ name: 'lalalalala'});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect number, got undefined');
    });
    
    
    it('Объект для проверки не передан', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        }
      });

      const errors = validator.validate();

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('error').and.to.be.equal('object for validating is null');
    });
    
    
    
  });
});