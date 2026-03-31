interface BmiValues {
  height: number;
  weight: number;
}

const parseArguments = (args: string[]): BmiValues => {
  if (args.length < 4) throw new Error("Not enough arguments");
  if (args.length > 4) throw new Error("Too many arguments");
  const height = Number(args[2]);
  const weight = Number(args[3]);

  if (!isNaN(height) && !isNaN(weight)) {
    return { height, weight };
  } else {
    throw new Error("Provided values were not numbers!");
  }
};

const calculateBmi = (height: number, weight: number): string => {
  if (height <= 0 || weight <= 0) {
    throw new Error("Height and weight must be positive numbers");
  }

  const heightInMeters = height / 100;
  const bmiValue = weight / (heightInMeters * heightInMeters);

  console.log(`BMI: ${bmiValue.toFixed(2)}`);

  if (bmiValue < 18.5) return "Underweight";
  if (bmiValue < 25) return "Normal weight";
  if (bmiValue < 30) return "Overweight";
  return "Obese";
};

try {
  const { height, weight } = parseArguments(process.argv);
  console.log(calculateBmi(height, weight));
} catch (error: unknown) {
  let errorMessage = "Something went wrong: ";
  if (error instanceof Error) {
    errorMessage += error.message;
  }
  console.error(errorMessage);
}
