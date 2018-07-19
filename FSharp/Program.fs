open System
open System.Reactive.Subjects
open System.Reactive.Linq

type Player =
| Xs
| Os

type Token =
| X
| O
| Empty


type GameBoard = {
    CurrentPlayer : Player
    Tokens: Token[]
}

type GridIndex =
| One
| Two
| Three

type TokenPosition = {
    X: GridIndex
    Y: GridIndex
}

type PlayerMove = {
    Player: Player
    Position: TokenPosition
}

type GameError =
| NotTurnOfPlayer of Player
| GameSquareNotEmpty of Token*TokenPosition

let createNewGame player =
    {
        CurrentPlayer = player
        Tokens = Array.create 9 Empty
    }

let getTokenForPlayer player = 
    match player with
    | Xs -> X
    | Os -> O

let convertTokenPositionToArrayIndex tokenPosition =
    let y = match tokenPosition.Y with
            | One -> 0
            | Two -> 3 
            | Three -> 6
    match tokenPosition.X with
    | One -> y
    | Two -> y + 1
    | Three -> y + 2

let nextPlayer player = 
    match player with
    | Xs -> Os
    | Os -> Xs

let validateTurn (gameBoard, playerMove) =
    match gameBoard.CurrentPlayer = playerMove.Player with
    | true -> Ok (gameBoard, playerMove)
    | _    -> NotTurnOfPlayer playerMove.Player |> Error 

let validateToken (gameBoard, playerMove) =
    let tokenIndex = convertTokenPositionToArrayIndex playerMove.Position
    match gameBoard.Tokens.[tokenIndex] with
    | Empty -> Ok (gameBoard, playerMove)
    | _     ->  let playerToken = getTokenForPlayer playerMove.Player
                GameSquareNotEmpty (playerToken, playerMove.Position) |> Error

let placeToken (gameBoard, playerMove) =
    let tokenIndex = convertTokenPositionToArrayIndex playerMove.Position
    let token = getTokenForPlayer playerMove.Player
    {
        CurrentPlayer = nextPlayer gameBoard.CurrentPlayer
        Tokens = gameBoard.Tokens
                 |> Array.mapi(fun i t -> match i = tokenIndex with 
                                          | true -> token
                                          | false -> t)
    }
    |> Ok

let gamePipe = validateTurn 
               >> Result.bind validateToken
               >> Result.bind placeToken


[<EntryPoint>]
let main argv =
    let gameBoard = createNewGame Xs
    use gameSubject = new ReplaySubject<GameBoard>()
    use moveSubject = new ReplaySubject<PlayerMove>()
    
    let zipWith (f : 'T -> 'U -> 'R) 
                (second: IObservable<'U>) 
                (first: IObservable<'T>)
                : IObservable<'R> =
        Observable.Zip(first, second, f)

    let joined = Observable.Zip(gameSubject, moveSubject, (fun g m -> (g,m)))
        
    let observablePipe boardAndMove = 
        let moveResult = boardAndMove
                         |> gamePipe
        match moveResult with
        | Ok updatedGameState -> gameSubject.OnNext(updatedGameState)
        | Error e -> fst boardAndMove |> gameSubject.OnNext 
    use gameStream = joined.Subscribe(observablePipe)
    
    use printer = gameSubject.Subscribe(fun g -> printfn "Game state is now %A" g)

    
    gameSubject.OnNext(gameBoard)
    let move1 = { Player = Xs; Position = {X = Two; Y = Two} }
    let move2 = { Player = Xs; Position = {X = Two; Y = Two} }
    let move3 = { Player = Os; Position = {X = Two; Y = Two} }
    let move4 = { Player = Os; Position = {X = One; Y = Two} }

    printfn "performing move 1"
    moveSubject.OnNext(move1)
    printfn "performing move 2"
    moveSubject.OnNext(move2)
    printfn "performing move 3"
    moveSubject.OnNext(move3)
    printfn "performing move 4"
    moveSubject.OnNext(move4)
    // let gb x = match x with 
    //            | Ok g -> g
    //            | _ -> failwith "bad game" 
    // printfn "After move One the game is %A" move1
    // let move2 = (gb move1, { Player = Xs; Position = {X = Two; Y = Two} })
    //             |> gamePipe
    // printfn "After move Two the game is %A" move2
    // let move3 = (gb move1, { Player = Os; Position = {X = Two; Y = Two} })
    //             |> gamePipe
    // printfn "After move Three the game is %A" move3
    // let move4 = (gb move1, { Player = Os; Position = {X = One; Y = Two} })
    //             |> gamePipe
    // printfn "After move Four the game is %A" move4    

    System.Console.ReadLine() |> ignore
    0 // return an integer exit code
