interface ExerciseResult {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

interface ExerciseValues {
  target: number;
  dailyHours: number[];
}

const parseExerciseArguments = (args: string[]): ExerciseValues => {
  if (args.length < 4) {
    throw new Error("Not enough arguments");
  }

  const target = Number(args[2]);
  const dailyHours = args.slice(3).map(Number);

  if (isNaN(target) || dailyHours.some(isNaN)) {
    throw new Error("Provided values were not numbers!");
  }

  return {
    target,
    dailyHours,
  };
};

export const calculateExercises = (
  dailyHours: number[],
  target: number,
): ExerciseResult => {
  const periodLength = dailyHours.length;
  const trainingDays = dailyHours.filter((day) => day > 0).length;
  const totalHours = dailyHours.reduce((sum, day) => sum + day, 0);
  const average = totalHours / periodLength;
  const success = average >= target;

  let rating: number;

  if (average >= target) {
    rating = 3;
  } else if (average >= target * 0.75) {
    rating = 2;
  } else {
    rating = 1;
  }

  let ratingDescription: string;

  if (rating === 3) {
    ratingDescription = "great job, target achieved";
  } else if (rating === 2) {
    ratingDescription = "not too bad but could be better";
  } else {
    ratingDescription = "you need to work harder";
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
};

try {
    const {target, dailyHours} = parseExerciseArguments(process.argv);
    console.log(calculateExercises(dailyHours, target)); 
} catch (error : unknown) {
    let errorMessage = "Something went wrong: ";

    if (error instanceof Error) {
        errorMessage += error.message;
    }

    console.error(errorMessage);
}
