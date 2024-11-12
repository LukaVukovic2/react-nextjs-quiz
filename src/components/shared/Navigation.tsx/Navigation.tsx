import Link from "next/link";
import { navItems } from "../utils/navigation-items";
import styles from "./Navigation.module.css";

export default function Navigation() {
  return (
    <nav>
      <div className={styles.navList}>
        <div className={styles.navActions}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              className={styles.navLink}
              href={item.href}
            >
              {item.text}
            </Link>
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
