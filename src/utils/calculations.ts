
export const calculateBMI = (height: string, weight: string, heightUnit: string, weightUnit: string) => {
  let h = parseFloat(height);
  let w = parseFloat(weight);
  
  if (heightUnit === 'ft/in') {
    if (height.includes("'")) {
      const parts = height.split("'");
      const ft = parseFloat(parts[0]) || 0;
      const inches = parseFloat(parts[1]?.replace('"', '')) || 0;
      h = (ft * 12 + inches) * 2.54;
    } else {
      h = h * 30.48;
    }
  }
  
  if (weightUnit === 'lbs') {
    w = w * 0.453592;
  }

  h = h / 100; // Convert to meters

  if (h > 0 && w > 0) {
    const bmi = w / (h * h);
    let category = '';
    let color = '';
    if (bmi < 18.5) { category = 'Underweight'; color = 'text-blue-400'; }
    else if (bmi < 25) { category = 'Normal'; color = 'text-emerald-600'; }
    else if (bmi < 30) { category = 'Overweight'; color = 'text-amber-400'; }
    else { category = 'Obese'; color = 'text-red-400'; }
    return { value: bmi.toFixed(1), category, color };
  }
  return null;
};
