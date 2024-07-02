import { useLocation } from "react-router-dom";
import TicTacToeBoard from "../components/TicTacToeBoard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const SingleplayerGame = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const gameid = searchParams.get("gameid");

  return (
    <div className='d-flex flex-column justify-content-between min-vh-100'>
      <Navbar />
      <TicTacToeBoard gameid={gameid || undefined} />
      <Footer />
    </div>
  );
};

export default SingleplayerGame;
