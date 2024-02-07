import React, { useState } from "react";
import Keyboard from "./Keyboard";
import Notification from "./Notification";
import GameBoard from "./GameBoard";
import SingleplayModal from "./SingleplayModal";
import { save } from "../../apis/singleplayApi";

const Wordle = () => {
  const MAX_LETTERS_PER_ROW = 5;
  const MAX_ATTEMPTS = 6;
  const [rightGuess] = useState("ㄱㄱㄱㄱㄱ");
  const [colors, setColors] = useState(Array(MAX_LETTERS_PER_ROW * MAX_ATTEMPTS).fill("white"));
  const [notification, setNotification] = useState("");
  const [inputString, setInputString] = useState(""); // 사용자 입력값 상태
  const [history, setHistory] = useState([]); // 이전 입력 기록을 저장할 배열
  const [currentRow, setCurrentRow] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [result, setResult] = useState({ correct: false, trialCount: 0, correctCount: 0, correctText: "" });

  // Keyboard 컴포넌트에서 문자를 전달받아 inputString 상태 업데이트
  const handleKeyPress = (letter) => {
    if (inputString.length < MAX_LETTERS_PER_ROW) {
      setInputString(inputString + letter);
    } else {
      setNotification("5개 이상의 글자를 입력할 수 없습니다.");
    }
  };

  const handleBackspace = () => {
    setInputString((prevInputString) => prevInputString.slice(0, -1));
  };

  const handleEnter = () => {
    if (inputString.length === MAX_LETTERS_PER_ROW) {
      // 5개의 글자를 입력했을 때
      setNotification("입력완료");
      console.log("Entered value:", inputString);

      const cellColors = calculateColors(inputString); // 각 셀의 색을 계산

      if (inputString === rightGuess) {
        // 정답과 일치하는 경우
        setNotification("정답입니다! 게임 종료");
        setColors((prevColors) => {
          const newColors = [...prevColors];
          cellColors.forEach((color, index) => {
            newColors[(currentRow - 1) * MAX_LETTERS_PER_ROW + index] = color;
          });
          handleGameEnd("win");
          return newColors;
        });
      } else if (currentRow === MAX_ATTEMPTS) {
        // 최대 시도 횟수를 초과한 경우
        setNotification("최대 시도 횟수를 초과했습니다. 게임 종료");
        handleGameEnd("lose");
      } else {
        setHistory((prevHistory) => [...prevHistory, inputString]); // history 배열에 inputString 값 추가
        setColors((prevColors) => {
          const newColors = [...prevColors];
          cellColors.forEach((color, index) => {
            newColors[(currentRow - 1) * MAX_LETTERS_PER_ROW + index] = color;
          });
          return newColors;
        });
        setInputString(""); // inputString 초기화
        setCurrentRow(currentRow + 1); // 다음 줄로 이동
      }
    } else {
      setNotification("5개의 글자를 입력하세요.");
      console.log("5개의 글자를 입력하세요.");
    }
  };

  const calculateColors = (guess) => {
    const colors = [];

    // 정답과 사용자 입력값을 비교하여 색을 결정
    for (let i = 0; i < MAX_LETTERS_PER_ROW; i++) {
      if (guess[i] === rightGuess[i]) {
        // 자리와 글자가 모두 일치하는 경우 (초록색)
        colors.push("#00C853");
      } else if (rightGuess.includes(guess[i])) {
        // 자리는 다르지만 글자가 포함된 경우 (노란색)
        colors.push("#FFEA00");
      } else {
        // 아무 경우도 아닌 경우 (회색)
        colors.push("#C0C0C0");
      }
    }

    return colors;
  };

  const colorsToText = (colors) => {
    let text = "";
    colors.forEach((color) => {
      if (color === "#C0C0C0") {
        text += "0"; // 회색 -> 검정하트
      } else if (color === "#FFEA00") {
        text += "1"; // 노란색 -> 하트
      } else if (color === "#00C853") {
        text += "2"; // 초록색 -> 레몬
      }
    });

    return text;
  };

  // 게임 결과를 저장하는 함수
  const saveGameResult = async (result) => {
    try {
      await save(result); // save 함수를 호출하여 게임 결과를 서버에 저장합니다.
    } catch (error) {
      console.error("Error saving game result:", error);
    }
  };

  // 게임 결과에 따라 모달을 보여줌
  const handleGameEnd = (res) => {
    const newResult = {
      email: "asd@naver.com",
      trialCount: res === "win" ? currentRow : 0,
      correct: res === "win",
      resultText: colorsToText(colors),
    };

    console.log("결과!!!", newResult);
    setResult(newResult);
    saveGameResult(newResult);
    setShowModal(true);
  };

  // 모달 닫기
  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="flex flex-col items-center h-screen">
      <div>테스트</div>
      <GameBoard inputString={inputString} history={history} colors={colors} />
      <Notification message={notification} />
      <Keyboard
        handleKeyPress={handleKeyPress}
        handleBackspace={handleBackspace}
        handleEnter={handleEnter}
        inputString={inputString}
        rightGuess={rightGuess}
      />
      {showModal && <SingleplayModal result={result} onClose={closeModal} />}
    </div>
  );
};
export default Wordle;
