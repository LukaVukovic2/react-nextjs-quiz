import styles from './LoadingSpinner.module.css';

export default function LoadingSpinner({text, scale = 1}: {text: string, scale?: number}) {
  return (
    <div className={styles.container} style={{transform: `scale(${scale})`}}>
      <div className={styles.loader}></div>
      <p className={styles.text}>{text}</p>
    </div>
  );
}
