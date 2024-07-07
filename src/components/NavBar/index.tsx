import { Link } from "react-router-dom";
import { User } from "../../types";
import Styles from "./index.module.css";
import icon from "/icon.png";

type NavBarProps = {
    me: User,
}

function NavBar(
    { me }: NavBarProps
) {
    return (
        <> {me ?
            <nav className={Styles.bar}>
                <div className={Styles.icon}>
                    <img src={icon} alt="" />
                    <h1>Blazon</h1>
                </div>
                <ul className={Styles.list}>
                    <li>
                        <Link to={"/"} title="Home" className={Styles.home}>
                            <span className="material-icons-round">home</span>
                            <h1>Home</h1>
                        </Link>
                    </li>
                    <li>
                        <Link to={"/explore"} title="Logout" className={Styles.explore}>
                            <span className="material-icons">explore</span>
                            <h1>Explore</h1>
                        </Link>
                    </li>
                    <li>
                        <Link to={"/auth/logout"} title="Logout" className={Styles.logout}>
                            <span className="material-icons">logout</span>
                            <h1>Logout</h1>
                        </Link>
                    </li>
                </ul>
            </nav>
            :
            <></>
        }
        </>
    );
}

export default NavBar;
