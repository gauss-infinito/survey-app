export default function Home() {
  return (
    <main>
      <div style={{ width: "277px", marginLeft: "28px" }}>
        <h1>Survey App</h1>
        <a href="/login">Login</a><br />
        <a href="/register">Registre-se</a><br />
        <a href="/recover">Recupere seu código</a><br />  
        <a href="/surveys/create">Crie pesquisa</a>
      </div>
    </main>
  );
}
