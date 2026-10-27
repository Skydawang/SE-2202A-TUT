let nextPlayer = 'X'; // takes a value of either 'X' or 'O' according to the game turns

// Step 1: Initialize the game by setting the value inside next-lbl to nextPlayer
document.getElementById('next-lbl').innerText = nextPlayer;

// This call will create the buttons needed for the gameboard.
createGameBoard();

function createGameBoard()
{
    // Step 2: Programatically add a button with square brackets enclosing an empty space to each cell in the gameboard
    for (let i = 1; i <= 9; i++) {
        let cell = document.getElementById('c' + i);
        cell.innerHTML = '<button>[ ]</button>';
    }

    // Step 3: Programatically add 'takeCell' as an event listener to all the buttons on the board
    let btns = document.querySelectorAll('button');

    for (let i = 0; i < btns.length; i++)
    {
        /*
            Assign an event listener to each of the buttons in btns.
            The event to listen for should be 'click'. You will need to pass 
            the event to takeCell. Review the slides for the trick on how to 
            pass a parameter. (Using an arrow function / anonymous function wrapper)
        */
        btns[i].addEventListener('click', function(event) {
            takeCell(event);
        });
    }
}

// This function will be used to respond to a click event on any of the board buttons.
function takeCell(event)
{
    /*
        Step 4: When the button is clicked, the space inside its square brackets 
        is replaced by the value in the nextPlayer before switching it
    */
    let clickedButton = event.target;
    clickedButton.innerText = '[' + nextPlayer + ']';

    // Make sure the button is clickable only once (disable it)
    clickedButton.disabled = true;

    // Switch the nextPlayer ('X' -> 'O' or 'O' -> 'X')
    nextPlayer = (nextPlayer === 'X') ? 'O' : 'X';

    // Update the value shown in next-lbl
    document.getElementById('next-lbl').innerText = nextPlayer;

    // Step 6: Fill in the if statement inside takeCell to update the value of game-over-label based on isGameOver
    if (isGameOver())
    {
        // let the label with the id 'game-over-lbl' display the words 'Game Over' inside <h1> element
        document.getElementById('game-over-lbl').innerHTML = '<h1>Game Over</h1>';
    }
}

function isGameOver()
{
    // Step 5: This function returns true if all the buttons are disabled and false otherwise 
    let btns = document.querySelectorAll('button');
    for (let i = 0; i < btns.length; i++) {
        if (!btns[i].disabled) {
            return false; // Found at least one button that is still clickable
        }
    }
    return true; // All buttons are disabled
}