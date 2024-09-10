import { navItems } from "../navigation-items";
import styles from "./Navigation.module.css";

export default function Navigation() {
  return (
    <nav>
      <div className={styles.navList}>
        <div className={styles.navActions}>
          {navItems.map((item) => (
            <a
              key={item.href}
              className={styles.navLink}
              href={item.href}
            >
              {item.text}
            </a>
          ))}
        </div>
        <div>
          <form
            action="/auth/logout"
            method="post"
          >
            <button className={styles.navLink} type="submit">Logout</button>
          </form>
        </div>
      </div>
    </nav>
  );
}
