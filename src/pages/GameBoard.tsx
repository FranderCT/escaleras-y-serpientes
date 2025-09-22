import SnakesLaddersBoard from "../components/GameBoard/SnakeLadderBoard"


const GameBoard = () => {
  return (
    <SnakesLaddersBoard
      rows={5}
      cols={6}
      players={[
        { id: 0, name: "Brenda",  color: "#1B6DF5" },
        { id: 1, name: "Samuel",  color: "#16a34a" },
        { id: 2, name: "Frander", color: "#f59e0b" },
      ]}
      jumps={{ 3: 8, 11: 2, 16: 21, 24: 13, 26: 22, 29: 19 }}
      onWin={(w) => console.log("Ganó:", w.name)}
    />
  )
}

export default GameBoard
