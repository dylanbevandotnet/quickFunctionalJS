# Tic Tac Toe
## Interview Question
> Write a class to represent a gamne of tic tac toe

* Adding in extra functionality such as saving to a repository will typically come in via constructor injection. This keeps adding to the complexity of the code as you have to deal with errors from each component. This can lead to multiple nested callbacks or the pyramid of doom!
![](https://bluefletch.com/wp-content/uploads/2017/08/pyramid-of-doom.jpg)
___
### Functional code
* Being able to pipe functions together only if the previous one is successful means that our function code remains on topic, easy to reason about and test.
* By using Reactive Extensions (rxjs) we can make our program even more flexible.