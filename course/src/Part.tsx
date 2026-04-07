import type { CoursePart } from "./types";

const assertNever = (value : never) : never => {
    throw new Error(`Unhandled type: ${JSON.stringify(value)}`);
}

interface PartProps {
    part : CoursePart;
}

const Part = ({ part }: PartProps) => {
  switch (part.kind) {
    case "basic":
      return (
        <div>
          <p>{part.name} {part.exerciseCount}</p>
          <p><i>{part.description}</i></p>
        </div>
      );

    case "group":
      return (
        <div>
          <p>{part.name} {part.exerciseCount}</p>
          <p>project exercises {part.groupProjectCount}</p>
        </div>
      );

    case "background":
      return (
        <div>
          <p>{part.name} {part.exerciseCount}</p>
          <p><i>{part.description}</i></p>
          <p>submit to {part.backgroundMaterial}</p>
        </div>
      );

    case "special":
      return (
        <div>
          <p>{part.name} {part.exerciseCount}</p>
          <p><i>{part.description}</i></p>
          <p>required skills: {part.requirements.join(", ")}</p>
        </div>
      );

    default:
      return assertNever(part);
  }
};

export default Part;