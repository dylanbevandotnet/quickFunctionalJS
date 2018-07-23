# Tic Tac Toe
## Interview Question
> Write a class to represent a gamne of tic tac toe

* Talk about how object oriented programming relies on state within an object. Contrast this with functional where state is not maintained as it means functions cannot be pure
* Extend the object oriented sample to validate talk about how the class now contains additional complexity (multiple pathways) in the method (should see the complexity go up in the comlexity plugin).
* Now add in the fact that we need to save the game. IoC would mean that the repository gets passed in through the constructor, now repository errors need to be dealt with by the consuming class. What happens if the class forgets how to deal with the error?
* Talk about how functional programming relies on small components that are used to compose more complex systems. Walk through each function used for the gameboard
* Note that we always aim for pure functions which help with parallelization and unintended side effects. Also makes for easy memoization
* Finish with Reactive streams to show how pipes of data transforms can work