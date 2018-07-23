# Tic Tac Toe
## Interview Question
> Write a class to represent a gamne of tic tac toe

* Object oriented implementations rely on encapsulation and state mutation. 
* Some things map well to an OO design whereas in most applications the systems start to break down as it becomes harder to define object boundaries and design patterns form to manage some of the complexity.
* It's easy for methods to grow too large, classes to take too many dependencies and tribal knowledge required to navigate the code base.
___
### Functional code
* Write small generic functions that can be composed together to form more complex blocks
* Functions should aim to be side effect free, so no mutation of local state. Same input wil always produce the same output.
* Functions in a true functional language only take one argument. Function currying makes this possible:
```javascript
// regular method
let addNumbers = (x,y) => x + y;
// single argument
let addNumbers = x =>
    y => x + y;
// curried form
let addTen = addNumbers(10);
console.log(addTen(5)); // prints 15
```
* Currying works as a form of Inversion of Control that we aim for in OO designs
```csharp
public class MyClass(IRepository repository)
{
    this.repository = repository;
}

public Task DoSomething(Object thing)
{
    ...
    return this.repository.SaveItem(thing);
}
```
___
```javascript
let doSomething = (repository) =>
    (thing, cb) => {
        return repository.saveItem(thing, cb);
    };

let doSomethingInRedis = doSomething(redisRepository);
let doSomethingInMongo = doSomething(mongoRepository);
```
___
```javascript
//using ramdajs
let doSomething = (repository, cb, thing) => {
    return repository.saveItem(thing, cb);
}

let curriedFn = R.curry(doSomething);
let doSomethingInRedis = (redisRepository, (err,t) => console.log('callback is curried too!'));
doSomethingInReids({id: 100});
```