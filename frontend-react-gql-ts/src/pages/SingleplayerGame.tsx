import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TicTacToeBoardSingleplayer from "../components/TicTacToeBoardSingleplayer";

const SingleplayerGame = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const gameid = searchParams.get("gameid");

  return (
    <div className='d-flex flex-column justify-content-between min-vh-100'>
      <Navbar />
      <TicTacToeBoardSingleplayer gameid={gameid || undefined} />
      <Footer />
    </div>
  );
};

export default SingleplayerGame;
