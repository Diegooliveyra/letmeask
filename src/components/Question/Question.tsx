import '../../styles/question.scss';

type QuestionProps = {
  content: string;
  author: {
    name: string;
    avatar: string;
  };
};

export function Question({ content, author }: QuestionProps) {
  return (
    <div className="question">
      <p>{content}</p>
      <footer>
        <div className="user-info">
          <img src={author.avatar} alt={author.name} />
          <p>{author.name}</p>
        </div>
        <div></div>
      </footer>
    </div>
  );
}
