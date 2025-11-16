import "../styles/PanelHeader.css";

const PanelHeader = ({ title, showSearch = true, searchValue, setSearchValue }) => {
    return (
        <div className="panel-header">
            <h2 className="panel-header__title">{title}</h2>

            {showSearch && (
                <input
                    type="text"
                    placeholder="Buscar..."
                    className="panel-header__search"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
            )}
        </div>
    );
};

export default PanelHeader;
