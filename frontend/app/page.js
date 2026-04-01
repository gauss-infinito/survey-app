import Link from "next/link";

export default function Home() {
  return (
    <main>
      <div style={{ maxWidth: "100%", marginLeft: "28px", marginRight: "28px", fontFamily: "system-ui" }}>
        
        <h1>Survey App</h1>

        <p>
          O <strong>Survey App</strong> é uma ferramenta simples para criação de enquetes e coleta de opiniões. Ele ajuda pesquisadores a entender melhor diferentes públicos de forma rápida e acessível.
        </p>

        <h2>Por que aplicar enquetes?</h2>
        <p>
          Enquetes permitem coletar dados diretamente das pessoas, ajudando na tomada de decisões, validação de ideias e compreensão de comportamentos. Quanto mais estruturada a pesquisa, mais confiáveis são os resultados.
        </p>

        <h2>Por que considerar faixa etária?</h2>
        <p>
          Diferentes faixas etárias possuem experiências, necessidades e visões de mundo distintas. Agrupar respostas por idade permite identificar padrões e tendências importantes para análise.
        </p>

        <h2>Por que incluir identidade de gênero?</h2>
        <p>
          No contexto moderno, compreender identidade de gênero vai além de classificações tradicionais. Considerar pessoas <strong>cis</strong>, <strong>trans</strong> e <strong>não-binárias</strong> permite uma análise mais inclusiva e representativa, refletindo melhor a diversidade da sociedade.
        </p>

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Link href="/login">Login</Link> &emsp;
          <Link href="/register">Registre-se</Link>  &emsp;
          <Link href="/recover">Recupere código</Link>  &emsp;
          <Link href="/surveys/create">Crie pesquisa</Link>
          <Link href="/surveys/reply">Responda pesquisa</Link>
          <Link href="/surveys/view">Resultado de pesquisa</Link>
        </div>

      </div>
    </main>
  );
}
