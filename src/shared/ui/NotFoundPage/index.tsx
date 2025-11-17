import styles from "./NotFoundPage.module.scss";

const NotFoundPage = () => {
  return (
    <div className={styles.not__found}>
      <img src="./not-found.svg" alt="404" />
    </div>
  );
};

export default NotFoundPage;
