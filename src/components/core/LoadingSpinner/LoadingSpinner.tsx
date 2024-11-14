import styles from './LoadingSpinner.module.css';

export default function LoadingSpinner({text}: {text: string}) {
  return (
    <div className={styles.container}>
      <div className={styles.loader}></div>
      <p className={styles.text}>{text}</p>
    </div>
  );
}
