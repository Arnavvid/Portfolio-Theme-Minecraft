const movedWords = new Set();
const wordLastMoved = new Map();
const detectedSentences = new Map();
const sentence_set = {
    "I game usually": "Which game ?",
    "I'm not coding": "What are you upto then ?",
    "When I'm not coding": "Slep.",
    "not coding": "ok ?",
    "I usually game": "Which game ?",
    "I usually read": "Which book ?",
    "usually game": "Unusually game.",
    "usually read": "Unusually read.",
    "usually game or": "Slep",
    "When I game": "Oh ?",
    "I game": "What game ?",
    "I read": "Which book ?",
    "game or read": "Depends on the book.",
    "read or game": "Depends on the book.",
    "game or chess": "Game.",
    "chess or game": "Game.",
    "game or football": "Football.",
    "football or game": "Football.",
    "game or table tennis": "Table tennis.",
    "table tennis or game": "Table tennis.",
    "game or badminton": "Badminton anyday.",
    "badminton or game": "Badminton anyday.",
    "game or watching web series": "Which series ? game if im'm with friends.",
    "watching web series or game": "Which series ? game if im'm with friends.",
    "game or web series": "Which series ? game if im'm with friends.",
    "web series or game": "Which series ? game if im'm with friends.",
    "badminton or watching web series": "Badminton.",
    "watching web series or badminton": "Badminton.",
    "usually game or read": "Good for you.",
    "I usually play badminton": "Every weekend!",
    "I usually play chess": "Send me a request!",
    "I usually play football": "Messi or Ronaldo ?",
    "I usually play table tennis": "I'm out of practice now.",
    "I play badminton": "Every weekend!",
    "I play chess": "Send me a request!",
    "I play football": "Messi or Ronaldo ? Neymar maybe ?",
    "I play table tennis": "I'm out of practice now.",
    "play chess": "e4.",
    "play badminton": "I'll serve.",
    "play table tennis": "I'll take this side.",
    "and football": "Classic.",
    "Bad game": "Which one ?",
    "I like badminton": "I do too!",
    "I like table tennis": "I do too!",
    "I like chess": "I do too!",
    "I like football": "Great ! Which position do you play ?",
    "I like watching web series": "Which one's the best ?",
    "I've already completed Dr House": "Oh great, im on season 6.",
    "I've already completed Breaking Bad": "Same!",
    "I've almost completed Dr House": "Me too!",
    "I've almost completed Breaking Bad": "BCS next.",
    "I've completed Dr House": "Oh great, im almost done.",
    "I've completed Breaking Bad": "Same!",
    "I've completed web series": "Which!",
    "watching web": "Watching what on web ?",
    "web series": "Any favorites?",
    "watching web series": "Same here.",
    "completed series": "Which one ?",
    "I like Breaking Bad": "Who's your favorite character?",
    "I like Dr House": "I like the series",
    "I've already": "Good job.",
    "already completed": "Good.",
    "Breaking Bad": "Great show.",
    "completed Breaking Bad": "Worth it.",
    "I've already completed": "Completed what ?",
    "Bad series": "Which one ?",
    "I'm Breaking Bad": "Good luck,",
    "I'm Bad": "yea, bad at everything.",
    "I'm not Bad": "That's good.",
    "I code": "Nice, what are you building?",
    "I usually play": "Which sport?",
    "I'm coding and gaming": "Productive and fun.",
    "coding or reading": "Reading is more relaxing.",
    "reading or watching": "Depends on the mood.",
    "play game and football": "Busy day!",
    "I completed Dr House": "The finale is wild.",
    "almost completed": "Almost there ? don't stop.",
    "already completed series": "Which one was it?",
    "I play football and badminton": "You're very active.",
    "watching football": "Who's winning?",
    "watching chess": "That takes patience.",
    "I usually play table tennis and chess": "Brain and speed.",
    "I'm not watching": "Doing something better?",
    "I'm not reading or coding": "Just vibing then?",
    "usually I code": "Is it important work?",
    "game and series": "The ultimate weekend.",
    "I completed reading": "Which book was it?",
    "already completed chess": "You mean you won?",
    "bad reading": "Not a good book?",
    "not football": "What sport then?",
    "game and badminton": "Good mix.",
    "I'm reading Breaking Bad": "Wait, the script?",
    "I like Dr House and football": "Smart choice.",
    "I've already played badminton": "How was the score?",
    "completed table tennis": "You mean the tournament?",
    "not gaming": "Taking a break?",
    "I'm not play": "That's not right.",
    "I usually like watching": "Watching what specifically?",
    "I've almost completed game": "Which level are you on?",
    "I'm not football": "I hope not, you're a person.",
    "I like reading and gaming": "A person of culture.",
    "already reading": "Which chapter?",
    "badminton or chess": "Physical or mental?",
    "football or table tennis": "Field or table?",
    "usually coding": "Keep at it.",
    "I'm not watching web series": "Missing out.",
    "watching Dr House": "Is it Lupus?",
    "I've completed gaming": "You finished the whole game?",
    "play and read": "Good balance.",
    "I'm usually bad": "At what exactly?",
    "not already completed": "Take your time.",
    "completed badminton": "You mean the set?",
    "I'm already coding": "Don't let me distract you.",
    "football and chess": "Odd combo, but okay.",
    "I play game": "Which one you playing?",
    "I'm coding": "Happy for you.",
    "completed chess": "Wait, how do you complete chess?",
    "watching badminton": "Much better to play it.",
    "web series or football": "Football anytime.",
    "table tennis or chess": "Chess needs more focus.",
    "I like reading": "What was the last book?",
    "I completed house": "The whole show?",
    "I've already played": "Played what exactly?",
    "usually watching": "Watching what?",
    "I'm not reading": "Too many words?",
    "football and badminton": "You're quite active.",
    "coding or game": "Code first, game later.",
    "I've completed football": "You mean the match?",
    "I like game": "Games are fun.",
    "Bad badminton": "Bad day on the court?",
    "already gaming": "Since when?",
    "usually not coding": "What's the plan then?",
    "I like series": "Which genre?",
    "coding and reading": "Your brain must be tired.",
    "coding and football": "From the desk to the field.",
    "I'm not coding or gaming": "What is left to do?",
    "I'm coding or watching": "Don't get distracted.",
    "I usually play badminton or football": "Both are good cardio.",
    "I usually play table tennis or badminton": "Racket sports only?",
    "I've completed Dr House and Breaking Bad": "You have great taste.",
    "already completed Dr House": "Legendary show.",
    "I like chess and coding": "Logic everywhere.",
    "I'm reading or watching web series": "Screen or paper?",
    "completed table tennis and badminton": "A true athlete.",
    "I play game or chess": "Which one needs more brain?",
    "I'm not watching Dr House": "You should start.",
    "I'm not watching Breaking Bad": "You're missing out.",
    "usually football": "Rain or shine?",
    "usually chess": "What's your rating?",
    "badminton and table tennis": "Which one is faster?",
    "read or coding": "Hard to do both at once.",
    "I've almost completed series": "Which one is next?",
    "already completed football": "Won the league?",
    "I'm reading and gaming": "That's a busy evening.",
    "I'm reading or coding": "One is more important than the other.",
    "not reading and not coding": "Total relaxation.",
    "watching web series and gaming": "Too many screens!",
    "I like reading web series": "You mean reading the subtitles?",
    "I usually play game and chess": "Keep that brain sharp.",
    "I'm already reading Dr House": "Wait, there's a book?",
    "I've completed reading Breaking Bad": "You mean the script?",
    "bad chess": "Hung your queen?",
    "bad football": "Missing the goal again?",
    "game or reading": "Depends on the book.",
    "football and table tennis": "Big ball, small ball.",
    "almost completed badminton": "One more set to go.",
    "not already coding": "Start whenever you're ready.",
    "I'm not game": "Too tired?",
    "When I'm not gaming": "Slep.",
    "When I'm reading": "Don't bother me.",
    "I like playing": "Playing what?",
    "I'm usually playing": "Every day?",
    "completed web": "The whole internet?",
    "I code and I game": "The classic loop.",
    "badminton or football": "Football for the team, badminton for the sweat.",
    "football or badminton": "Football for the team, badminton for the sweat.",
    "badminton or chess": "Physical vs Mental. Tough choice.",
    "chess or badminton": "Physical vs Mental. Tough choice.",
    "badminton or table tennis": "Badminton has more running.",
    "table tennis or badminton": "Badminton has more running.",
    "football or chess": "Muscle or mind?",
    "chess or football": "Muscle or mind?",
    "football or table tennis": "Football is a classic.",
    "table tennis or football": "Football is a classic.",
    "table tennis or badminton": "Racket sports are the best.",
    "badminton or table tennis": "Racket sports are the best.",
    "chess or table tennis": "Chess if you're tired, TT if you're not.",
    "table tennis or chess": "Chess if you're tired, TT if you're not.",
    "chess or web series": "Web series is more relaxing.",
    "web series or chess": "Web series is more relaxing.",
    "reading or football": "Read a book about football?",
    "football or reading": "Read a book about football?",
    "coding or football": "Coding pays the bills, football is for fun.",
    "football or coding": "Coding pays the bills, football is for fun.",
    "coding or badminton": "Badminton is a good break from the screen.",
    "badminton or coding": "Badminton is a good break from the screen.",
    "coding or chess": "Both are just logic puzzles.",
    "chess or coding": "Both are just logic puzzles.",
    "When I read": "Do you learn something new?",
    "When I play football": "Don't get injured.",
    "When I play chess": "Do you have an opening?",
    "When I play badminton": "Serve high.",
    "When I play table tennis": "Watch the spin.",
    "When I'm not reading": "Slep.",
    "When I'm not gaming": "Slep.",
    "When I'm not watching": "Slep.",
    "completed Dr House": "Is it finally over?",
    "almost completed Breaking Bad": "The end is the best part.",
    "already completed reading": "What's the next book?",
    "I'm not coding now": "Take a rest.",
    "already completed game": "Which one did you beat?",
    "almost completed football": "You mean the season?",
    "completed table tennis": "Did you win the match?",
    "already completed chess": "Checkmate?",
    "I like coding and reading": "Sounds like a quiet day.",
    "I like football and chess": "Total opposites.",
    "I like table tennis and badminton": "You must be fast.",
    "I like Dr House and Breaking Bad": "You like complex characters.",
    "I like reading and watching": "Storytelling is great.",
    "usually game and read": "A balanced hobby list.",
    "I play and I code": "Work hard, play hard.",
    "I'm not completed": "Keep going then.",
    "Bad coding": "We all have those days.",
    "Bad chess": "Blunders happen.",
    "not usually": "Sometimes is enough.",
    "already completed web series": "Which one was it?",
    "I'm House": "Everybody lies.",
    "I'm Dr House": "Are you a doctor or a patient?",
    "watching House": "Diagnosis?",
    "watching Dr": "Which doctor? House?",
    "watching Dr House": "It's never Lupus.",
    "I'm Dr": "A medical doctor?",
    "I'm Doctor": "Doctor who?",
    "completed House": "Was the ending good?",
    "almost House": "Almost finished with the series?",
    "already House": "You finished it fast.",
    "I'm Breaking": "Breaking what?",
    "I'm Bad": "Stay out of my territory.",
    "watching Breaking": "Keep watching, it gets intense.",
    "watching Bad": "Breaking Bad?",
    "completed Breaking": "The finale is perfect.",
    "almost Bad": "Almost at the end of the show?",
    "I'm coding web": "Building a website?",
    "I'm coding series": "Like a sequence of numbers?",
    "watching football and badminton": "A lot of sports to track.",
    "reading web": "Reading articles online?",
    "reading series": "A book series?",
    "play series": "A series of games?",
    "usually watching Dr": "Every night?",
    "already completed coding": "Job well done.",
    "not already coding": "Taking a break?",
    "I'm not Doctor": "That's probably for the best.",
    "badminton or read": "Sweat or stay still?",
    "read or badminton": "Sweat or stay still?",
    "chess or read": "Both are quiet.",
    "read or chess": "Both are quiet.",
    "football or web series": "Football is more exciting.",
    "web series or football": "Football is more exciting.",
    "table tennis or read": "TT",
    "read or table tennis": "TT",
    "coding or web series": "Code now, watch later.",
    "web series or coding": "Code now, watch later.",
    "I'm completed": "You're done for the day?",
    "not already": "Not yet?",
    "I'm coding Dr House": "Don't forget the stick",
    "When I'm coding": "Passing error: Missing semicolon.",
    "When I'm watching": "Don't disturb?",
    "usually play game or": "Or what?",
    "completed Dr": "Hi doctor",
    "I'm watching Dr House" : "Which episode ?",
    "House or Breaking Bad": "Two very different types of geniuses.",
    "Breaking Bad or House": "Both have great endings.",
    "I like Dr House or Breaking Bad": "Hard to choose a favorite.",
    "watching Breaking Bad and Dr House": "That is a lot of TV.",
    "completed House and Breaking Bad": "You are a TV legend.",
    "When I'm coding and watching": "How do you focus?",
    "When I'm playing": "Are you winning?",
    "When I'm reading and coding": "That sounds impossible.",
    "When I'm not playing": "Slep.",
    "When I'm not watching web series": "What are you doing instead?",
    "I'm usually coding": "Building something important?",
    "I'm already reading": "No spoilers please.",
    "I'm almost coding": "Just one more video first?",
    "I'm usually reading": "Fiction or non-fiction?",
    "I'm not coding or reading": "Just gaming then?",
    "I'm play": "You mean you are playing?",
    "already completed badminton": "Time for a rematch.",
    "almost completed chess": "Is the king trapped?",
    "already completed table tennis": "You must be fast.",
    "almost completed table tennis": "Keep that paddle up.",
    "already completed football": "Did you win the trophy?",
    "completed reading series": "The whole set?",
    "coding or football": "One for the brain, one for the legs.",
    "coding and chess": "Logic overload.",
    "coding or table tennis": "Table tennis is a good break.",
    "coding and badminton": "Work hard, play hard.",
    "chess or reading": "Both are very quiet.",
    "reading or chess": "Both are very quiet.",
    "badminton or coding": "Get some exercise first.",
    "table tennis or coding": "Small breaks are important.",
    "football or reading": "Physical vs Mental.",
    "watching web": "Any good videos?",
    "not already": "Take your time.",
    "usually I": "Usually you what?",
    "I'm already": "Already? That was fast.",
    "not Bad": "Good to be good.",
    "already House": "You finished the season?",
    "almost Breaking": "The tension is building.",
    "I'm not football": "Correct, you are human.",
    "usually watching web": "Every day?",
    "completed reading House": "You mean the book about the show?",
    "Bad football": "Rough day on the pitch?",
    "Bad table tennis": "Keep practicing your spin.",
    "I usually game or": "Or what? Read?",
    "usually game or read": "A good way to relax.",
    "like watching web": "Watching what?",
    "like watching series": "Any favorites?",
    "watching web series .": "Same here.",
    "I also like": "Like what specifically?",
    "already completed Breaking": "The whole thing?",
    "completed Breaking Bad and": "And what else?",
    "I've already completed Breaking": "A classic show.",
    "already completed Breaking Bad": "Respect.",
    "almost completed Dr": "Almost a doctor?",
    "completed Dr House .": "What did you think of the end?",
    "I've almost completed Dr": "Don't stop now!",
    "almost completed House": "Is it Lupus yet?",
    "coding or read": "Reading is quieter.",
    "game or read .": "Depends on the mood.",
    "play badminton ,": "I'll grab my racket.",
    "play football .": "Who is your team?",
    "completed Breaking Bad and almost": "You watch a lot of great TV.",
    "coding , I usually game": "A classic dev hobby.",
    "I'm coding": "What are you making?",
    "I'm House": "Everybody lies.",
    "I'm Dr": "A medical doctor?",
    "I'm Bad": "Breaking Bad?",
    "I'm reading": "Which part are you at?",
    "I've already": "Finished?",
    "I've almost": "Nearly there.",
    "already completed": "Done and dusted.",
    "almost completed": "So close!"
};


const words = document.querySelectorAll(".draggable-word");
const chatArea = document.getElementById("hobbies-chat-text");
const hobbiesArea = document.getElementById("hobbies-draggable-area")
console.log(words.length);
let isDragging = false;
let activeWord = null;

let offsetX = 0;
let offsetY = 0;

words.forEach(word =>{
    word.addEventListener("mousedown", (event)=>{
        isDragging = true;
        activeWord = word;

        const rect = word.getBoundingClientRect();
        const areaRect = hobbiesArea.getBoundingClientRect();

        offsetX = event.clientX - rect.left;
        offsetY = event.clientY - rect.top;

        word.style.position = "absolute";
        word.style.left = (rect.left - areaRect.left) + "px";
        word.style.top  = (rect.top  - areaRect.top) + "px";
        word.style.zIndex = "1000";
    });
});

document.addEventListener("mousemove", (event)=>{
    if(!isDragging || !activeWord) return;

    const areaRect = hobbiesArea.getBoundingClientRect();

    activeWord.style.left =
        (event.clientX - areaRect.left - offsetX) + "px";

    activeWord.style.top =
        (event.clientY - areaRect.top - offsetY) + "px";
});


document.addEventListener("mouseup", (event) => {
    if (activeWord) findPhrase(activeWord);
    console.log(currentSentence);
    activeWord = null;
    isDragging = false; 
});

let currentSentence = "";

function findPhrase(word){
    let rect = word.getBoundingClientRect();
    let centerY = rect.top + rect.height / 2;
    let step = 3;
    let word_distance = 20;

    let areaRect = document.getElementById("hobbies-draggable-area").getBoundingClientRect();
    let min_pos = areaRect.left;
    let max_pos = areaRect.right;

    let left_pos = rect.left;
    let right_pos = rect.right;
    let prev_left = rect.left;
    let prev_right = rect.right;

    currentSentence = word.textContent.trim();

    while (left_pos > min_pos || right_pos < max_pos) {
        let pass_cond = true;

        const doc_left = document.elementFromPoint(left_pos, centerY);
        if (doc_left && doc_left.classList.contains("draggable-word") && doc_left !== word) {
            currentSentence = doc_left.textContent.trim() + " " + currentSentence;
            prev_left = doc_left.getBoundingClientRect().left;
            left_pos = prev_left - 2;
            pass_cond = false;
        }

        const doc_right = document.elementFromPoint(right_pos, centerY);
        if (doc_right && doc_right.classList.contains("draggable-word") && doc_right !== word) {
            currentSentence = currentSentence + " " + doc_right.textContent.trim();
            prev_right = doc_right.getBoundingClientRect().right;
            right_pos = prev_right + 2;
            pass_cond = false;
        }

        if (pass_cond) {            
            let condLeft = left_pos > min_pos && Math.abs(left_pos - prev_left) <= word_distance;
            let condRight = right_pos < max_pos && Math.abs(right_pos - prev_right) <= word_distance;

            if (!condLeft && !condRight) break;

            left_pos = condLeft ? left_pos - step : min_pos;
            right_pos = condRight ? right_pos + step : max_pos;
        }
    }
    if (sentence_set.hasOwnProperty(currentSentence.trim())) {
        typeReply(sentence_set[currentSentence.trim()]);
    }
}


function typeReply(reply){
    chatArea.textContent = "";
    for (let i = 0; i < reply.length; i++) {
        setTimeout(function(){
            chatArea.textContent += reply[i];
        }, 60*i);
    }
}


// for (let i =0; i < screenWidth; i+=2){
//     const doc = document.elementFromPoint(i, centerY);

//     if (doc && doc.classList.contains("draggable-word")) {
//         currentSentence += doc.textContent + " ";
//         if (sentence_set.hasOwnProperty(currentSentence.trim())) {
            
//             typeReply(sentence_set[currentSentence.trim()]);
//         }
//         i = doc.getBoundingClientRect().right + 2;
//     }
// }