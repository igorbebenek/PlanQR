export default function LoginPanel() 
{

  return (
    <div style={styles.container}>
      <input
        type="email"
        placeholder="Email"
        style={styles.input}
      />
      <input
        type="password"
        placeholder="Password"
        style={styles.input}
      />
      <button style={styles.button}>
        Zaloguj
      </button>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    padding: "20px",
  },
  title: {
    fontSize: "24px",
    color: "#fff",
    marginBottom: "20px",
  },
  input: {
    width: "300px",
    padding: "10px",
    margin: "10px 0",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  button: {
    width: "300px",
    padding: "10px",
    backgroundColor: "#00C344",
    border: "none",
    color: "#fff",
    fontSize: "16px",
    borderRadius: "5px",
    cursor: "pointer",
  },
};