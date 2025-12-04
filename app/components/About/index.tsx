export default function About() {
  return (
    <section id="about" className="about">
      <div className="container">
        <h2>Sobre Nossa Escola</h2>
        <div className="about-content">
          <div className="about-text">
            <p>
              O Espaço de Dança Fernanda Becker é mais que uma escola de dança -
              é um lugar onde sonhos se tornam realidade através do movimento.
              Com anos de experiência e paixão pelo ensino, oferecemos um
              ambiente acolhedor e profissional para dançarinos de todas as
              idades.
            </p>
            <p>
              <strong>Somos uma escola de inclusão</strong>, com grande foco no
              atendimento a alunos especiais. Acreditamos que a dança é uma
              linguagem universal que transcende barreiras e oferece
              oportunidades únicas de desenvolvimento, expressão e socialização
              para todos.
            </p>
            <p>
              Nossa missão é desenvolver não apenas a técnica, mas também a
              expressão artística e a confiança de cada aluno, criando memórias
              e amizades que durarão para toda a vida.
            </p>
          </div>
          <div className="about-features">
            <div className="feature">
              <i className="fas fa-heart"></i>
              <div>
                <h3>Paixão</h3>
                <p>Amor pela dança em cada aula</p>
              </div>
            </div>
            <div className="feature">
              <i className="fas fa-hands-helping"></i>
              <div>
                <h3>Inclusão</h3>
                <p>Atendimento especializado para alunos especiais</p>
              </div>
            </div>
            <div className="feature">
              <i className="fas fa-users"></i>
              <div>
                <h3>Comunidade</h3>
                <p>Uma família de dançarinos</p>
              </div>
            </div>
            <div className="feature">
              <i className="fas fa-star"></i>
              <div>
                <h3>Excelência</h3>
                <p>Qualidade em ensino e técnica</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
