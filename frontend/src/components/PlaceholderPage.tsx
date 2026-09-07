interface PlaceholderPageProps {
  titulo: string;
  descricao: string;
}

export function PlaceholderPage({ titulo, descricao }: PlaceholderPageProps) {
  return (
    <div>
      <h1>{titulo}</h1>
      <p>{descricao}</p>
    </div>
  );
}
