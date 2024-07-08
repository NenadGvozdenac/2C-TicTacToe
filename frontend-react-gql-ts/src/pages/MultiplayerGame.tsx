import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TicTacToeBoardMultiplayer from "../components/TicTacToeBoardMultiplayer";

const SingleplayerGame = () => {
  return (
    <div className='d-flex flex-column justify-content-between min-vh-100'>
      <Navbar />
      <TicTacToeBoardMultiplayer />
      <Footer />
    </div>
  );
};

export default SingleplayerGame;
