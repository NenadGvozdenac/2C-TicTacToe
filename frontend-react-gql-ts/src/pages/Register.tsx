import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import RegisterForm from "../components/RegisterForm";

export default function Register() {
    return (
        <div className='d-flex flex-column justify-content-between min-vh-100'>
            <Navbar />
            <RegisterForm />
            <Footer />
        </div>
    );
}