import "./Loader.css";

const Loader = ({ size = 50, message = "Cargando..." }) => {
    return (
        <div className="loader-wrapper">
        <div
            className="loader-spinner"
            style={{ width: size, height: size }}
        ></div>
        {message && <p className="loader-text">{message}</p>}
        </div>
    );
};

export default Loader;
