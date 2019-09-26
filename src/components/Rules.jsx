import React from "react";

function Rules() {
    return (
        <div id='rulesSummary'>
            <h2>Rules</h2>
            <p>It's You vs Dealer</p> 
            <p>Each player dealt 3 Cards </p>
            <p>Dealer Hand will be dealt Face Down</p>
            <p>Your hand will be facing up</p>
            <p>When you click the Reveal button, the Dealer Hand will be shown, both hands scored, and a winner will be declared.</p>
            <h2>Scoring</h2>
            <p>Each card is scored as follows:</p>
            <p>2 =2, 3=3…. 10 = 10, </p>
            <p>Picture Cards J / Q / K / A = 10</p>
            <p>A hand scoring over 21 = Bust</p>
            <p>The player with the hand closest to, but less than or equal to 21 wins</p>
        </div>
    )
}

export default Rules;
