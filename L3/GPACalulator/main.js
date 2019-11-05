function getScoreById(id) {
    let score = document.getElementById(id).value;
    return parseFloat(score);
}
function calculatorGPA(event) {
    // 防止瀏覽器表單預設會在送出時重整的行為
    event.preventDefault();

    let chineseScore = getScoreById(`chineseScoreInput`);
    let englishScore = getScoreById(`englishScoreInput`);
    let mathScore = getScoreById(`mathScoreInput`);

    let avgScore = Math.round((chineseScore + englishScore + mathScore) / 3 * 100) / 100;
    
    let gpa;
    let color = `secondary`;
    if (avgScore >= 90) {
        gpa = `A+`;
        color = `success`;
    } else if (avgScore >= 80) {
        gpa = `A`;
    } else if (avgScore >= 70) {
        gpa = `B`;
    } else if (avgScore >= 60) {
        gpa = `C`;
    } else {
        gpa = `F`;
        color = `danger`;
    }
    document.getElementById(`result`).innerHTML = `
        <div class="alert alert-${color}" role="alert">
            Average Score is ${avgScore}<br>
            GPA is ${gpa}
        </div>
    `;
}