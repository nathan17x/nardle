document.addEventListener("DOMContentLoaded", () => {
    
    createSquares();

    const keys = document.querySelectorAll(".keyboard-row button");

    let guessedWords = [[]];
    let availableSpace = 1;

    let word = "crate";
    let guessedWordCount = 0;
    const solutionOccArr = calcOccArr(word);
    console.log(solutionOccArr);
    var currentOccArr;

    function calcOccArr(word){
        let rtn = [];
        for(let i = 0; i<26; i++){
            rtn[i] = 0;
        }
        for(let i = 0; i < 5; i++){
            rtn[word.charCodeAt(i)-97]++;
        }
        return rtn;
    }

    function getCurrentWordArr(){
        const numberOfGuessedWords = guessedWords.length;
        return guessedWords[numberOfGuessedWords - 1];
    }

    function updateGuessedWords(letter){
        const currentWordArr = getCurrentWordArr();
        if(currentWordArr && currentWordArr.length < 5){
            currentWordArr.push(letter);
            const availableSpaceElem = document.getElementById(String(availableSpace));
            availableSpace++;
            availableSpaceElem.textContent = letter;
        }
    }

    function getLetterID(letter){
        return letter.charCodeAt(0) - 97;
    }

    function getTileColor(letter,index){
        const id = getLetterID(letter);
        const isCorrectLetter = word.includes(letter);
        const isCorrectPosition = (letter === word.charAt(index));
        if(isCorrectPosition){
            currentOccArr[id]--;
            return "rgb(83,141,78)";
        }
        if(currentOccArr[id]>0 && currentOccArr[id] <= solutionOccArr[id]){
           currentOccArr[id]--;
           return "rgb(181,159,59)";
        }
        return "rgb(58,58,60)";
    }

    function sleep(milliseconds) {
        const date = Date.now();
        let currentDate = null;
        do {
          currentDate = Date.now();
        } while (currentDate - date < milliseconds);
        return 0;
      }

    function handleSubmitWord(){
        const currentWordArr = getCurrentWordArr();
        if(currentWordArr.length !== 5){
            window.alert('Ha!! Nice try idiot!!!');
            return;
        }
        const currentWord = currentWordArr.join('');
        currentOccArr = calcOccArr(currentWord);
        console.log(currentOccArr);
        const interval = 200;
        const firstLetterId = guessedWordCount * 5 + 1;
        currentWordArr.forEach((letter,index)=>{
            setTimeout(()=>{
                const tileColor = getTileColor(letter,index);
                const letterId = firstLetterId + index;
                const letterEl = document.getElementById(letterId);
                letterEl.classList.add("animate__flipInX");
                letterEl.style = `background-color:${tileColor};border-color:${tileColor};`
            }, interval * index);
        });
        guessedWordCount++;

        setTimeout(()=>{
            if (currentWord === word) {
                window.alert('woot, woot');
                return;
            }
            if (guessedWords.length === 6) {
                window.alert('Darn! the word was "WENDY"!');
                window.alert('WENDEEZ NUTS are in ya mouth!!! jk it was ' + word);
                return;
            }
            else {
                guessedWords.push([]);
                return;
            }    
        },1000);
        
    }

    function createSquares(){
        const gameBoard = document.getElementById('board');

        for (let index = 0; index < 30; index++) {
            let square = document.createElement("div");
            square.classList.add("square");
            square.classList.add("animate__animated");
            square.setAttribute("id", index + 1);
            gameBoard.appendChild(square);
            
        }


    }
    
    function handleDelete(){
        const currentWordArr = getCurrentWordArr();
        const deletedLetter = currentWordArr.pop();
        guessedWords[guessedWords.length-1] = currentWordArr;
        const lastLetterEl = document.getElementById(String(availableSpace-1));
        lastLetterEl.textContent = '';
        availableSpace--;
    }

    for (let i = 0; i < keys.length; i++) {
        keys[i].onclick = ({ target }) => {
            const letter = target.getAttribute("data-key");
            if(letter === 'enter'){
                handleSubmitWord();
                return;
            }
            if(letter === 'del'){
                handleDelete();
                return;
            }

            updateGuessedWords(letter);
        };
        
    }
});