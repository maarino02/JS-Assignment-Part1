(function() {
    const OPTIONS = [
        'rock', 
        'paper', 
        'scissors',
    ];
    const COUNTERS = {
        'rock': 'scissors',
        'scissors': 'paper',
        'paper': 'rock',
    };
    const DIALOG = {
        introduction: "Ah, a new challenger, come to best me! Well, if you can win 3 times at the humble game of rock, paper, scissors, perhaps I may yield... Simply answer here when I ask you to.",
        requestInput: "Go ahead, choose 'rock', 'paper', or 'scissors'. Or you can choose 'random' and let me choose for you... See if you can beat me... Or maybe you want to 'quit'?",
        badInput: "I do not know what you are saying...",
        enemyAnnouncement: "And I shall choose...",
        playerWin: "Drat, you won that one...",
        enemyWin: "HAHA, I WIN AGAIN!",
        playerCompleteWin: "... How? How did I lose...?",
        enemyCompleteWin: "How could you possibly hope to defeat me? I am the superior intelligence, after all.",
        replayAfterEnemyWin: "Want to try and best me again?",
        replayAfterPlayerWin: "No! Let me try again! You must have cheated!",
        exitAfterEnemyWin: "Heh, I don't blame you after such a miserable defeat!",
        exitAfterPlayerWin: "Blast... Fine, you get away this time... But I will return! You'll see!",
        playerQuit: "Oh, leaving already? Can't say I blame you...",
        roundDrawResponses: [
            "The next one will get you",
            "How did you know...",
            "Thought I had you with that one...",
        ],
        enemyWinningResponses: [
            "Of course I would be the one ahead.",
            "Naturally, the better of us leads...",
            "To be expected.",
        ],
        playerWinningResponses: [
            "It's not over yet!",
            "I still have a chance!",
            "Perhaps if I...",
        ],
        drawingResponses: [
            "Unexpected...",
            "The tension builds...",
            "I'll get you yet...",
        ],
        miscOptions: [
            "Hmmm...",
            "...",
            "Let me think...",
        ],
    };


    class Game {
        playerScore = 0;
        enemyScore = 0;
        winningScore = 3;

        playerChoice = null;
        enemyChoice = null;
        playerWon = false;

        enemyCanCheat = true;
        enemyCheatChance = 10;

        gameInProgress = true;

        // Text output
        speak(message) {
            if (message && message.length) {
                alert(message);
            }
        }

        // Input request
        ask(message) {
            if (message && message.length) {
                return prompt(message);
            }

            return null;
        }

        // User can choose true/false here
        choose(message) {
            if (message && message.length) {
                return confirm(message);
            }
        }

        // Random number between 0 and `max - 1`
        randomNumber(max) {
            return Math.floor(Math.random() * max);
        }

        // One-off introduction
        introduction() {
            this.speak(DIALOG.introduction);
        }

        // Random interim dialog option
        selectRandomDialogInterim(optionSet) {
            return optionSet[this.randomNumber(optionSet.length)];
        }

        // Update the user on the scores
        announceScore() {
            let scoreString = `And the scores are... Me with ${this.enemyScore}, and you with ${this.playerScore}.${"\n"}`;
            
            if (this.enemyScore < this.winningScore && this.playerScore < this.winningScore) {
                if (this.enemyScore > this.playerScore) {
                    scoreString += this.selectRandomDialogInterim(DIALOG.enemyWinningResponses);
                } else if (this.enemyScore < this.playerScore) {
                    scoreString += this.selectRandomDialogInterim(DIALOG.playerWinningResponses);
                } else {
                    scoreString += this.selectRandomDialogInterim(DIALOG.drawingResponses);
                }
            }

            this.speak(scoreString);
        }

        // The exit speech
        exitSpeech() {
            if (this.playerWon) {
                this.speak(DIALOG.exitAfterPlayerWin);
            } else {
                this.speak(DIALOG.exitAfterEnemyWin);
            }
        }

        // Presented after player quits
        quitSpeech() {
            this.speak(DIALOG.playerQuit);
        }

        // Random selection
        selectRandom() {
            return OPTIONS[this.randomNumber(OPTIONS.length)];
        }

        // Sanitise the user input
        sanitiseInput(inputString) {
            return inputString.toLowerCase().trim();
        }

        // Title case a string
        titleCase(inputString) {
            const parts = inputString.trim().split(' ');
            const formatted = [];

            parts.forEach(
                part => formatted.push(part[0].toUpperCase() + part.slice(1))
            );

            return formatted.join(' ');
        }

        // Parse the users input
        parseUserInput(selectionString) {
            switch (selectionString) {
                case "rock":
                    this.playerChoice = "rock";
                    break;
                case "paper":
                    this.playerChoice = "paper";
                    break;
                case "scissors":
                    this.playerChoice = "scissors";
                    break;
                case "random":
                    this.playerChoice = this.selectRandom();
                    this.speak(`Very well, I shall for choose for you... ${this.titleCase(this.playerChoice)}!`);
                    break;
                case "quit":
                    this.gameInProgress = false;
                    break;
                default:
                    this.speak(DIALOG.badInput);
                    return false;
            }

            return true;
        }

        // Enemy selection
        computerPlay() {
            this.speak(DIALOG.enemyAnnouncement);
            this.enemyChoice = this.selectRandom();
            this.enemyCheated = false;

            if (this.enemyCanCheat) {
                if (this.randomNumber(this.enemyCheatChance) === 0) {
                    this.enemyCheated = true;
                    this.enemyChoice = 'gun';
                } else {
                    this.enemyCheated = false;
                }
            } else {
                this.enemyCheated = false;
            }
            
            this.speak(`${this.enemyChoice.toUpperCase()}!`);
        }

        // User input processing
        processUserInput() {
            let hasInput = false;

            while (!hasInput) {
                const userInput = this.ask(DIALOG.requestInput);

                if (userInput !== null) {
                    hasInput = this.parseUserInput(
                        this.sanitiseInput(userInput)
                    );
                } else {
                    this.gameInProgress = false;
                    break;
                }

                if (this.playerChoice !== null) {
                    this.speak(this.selectRandomDialogInterim(DIALOG.miscOptions));
                }
            }
        }

        // Check the inputs for scoring
        processScoring() {
            const playerWin = COUNTERS[this.playerChoice] === this.enemyChoice;
            const draw = this.playerChoice === this.enemyChoice;
            
            if (draw) {
                this.speak(`${this.titleCase(this.enemyChoice)} vs ${this.playerChoice}.`);
                this.speak(this.selectRandomDialogInterim(DIALOG.roundDrawResponses));
            } else if (playerWin) {
                this.playerScore++;
                this.speak(`And ${this.playerChoice} beats ${this.enemyChoice}...`);
                this.speak(DIALOG.playerWin);
            } else {
                this.enemyScore++;
                this.speak(`${this.titleCase(this.enemyChoice)} beats ${this.playerChoice}...`);
                this.speak(DIALOG.enemyWin);
            }

            this.enemyChoice = null;
            this.playerChoice = null;
        }

        // Check if either side has won
        checkWinCondition() {
            if (this.enemyScore >= this.winningScore) {
                this.speak(DIALOG.enemyCompleteWin);
                this.playerWon = false;
                return true;
            } else if (this.playerScore >= this.winningScore) {
                this.speak(DIALOG.playerCompleteWin);
                this.playerWon = true;
                return true;
            }

            return false;
        }

        // Reset game state
        reset() {
            this.playerWon = false;
            this.playerScore = 0;
            this.enemyScore = 0;
            this.playerChoice = null;
            this.enemyChoice = null;
            this.gameInProgress = true;
        }

        // Play a round
        playRound() {
            this.processUserInput();

            if (this.gameInProgress) {
                this.computerPlay();
                this.processScoring();
            }
        }

        // Run the game
        runGame() {
            let isOver = false;
            let retry = true;

            this.introduction();
            
            retryLoop: while (retry) {
                this.reset();
                isOver = false;

                while (!isOver) {
                    this.playRound();

                    if (!this.gameInProgress) {
                        this.quitSpeech();
                        break retryLoop;
                    }

                    isOver = this.checkWinCondition();
        
                    if (isOver) {
                        let replayLine = (this.enemyScore > this.playerScore) ? DIALOG.replayAfterEnemyWin : DIALOG.replayAfterPlayerWin;
                        retry = this.choose(replayLine);
                    } else {
                        this.announceScore();
                    }
                }
            }

            this.exitSpeech();
        }
    }

    const GAME = new Game();
    GAME.runGame();
})();