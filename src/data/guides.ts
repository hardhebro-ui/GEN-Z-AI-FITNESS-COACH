export interface Guide {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  readTime: string;
  icon: string;
}

export const guides: Guide[] = [
  {
    id: "build-muscle-ai",
    title: "How to Build Muscle with AI",
    description: "Learn how artificial intelligence is revolutionizing hypertrophy and strength training.",
    category: "Muscle Gain",
    readTime: "6 min",
    icon: "Dumbbell",
    content: `
# How to Build Muscle with AI

Artificial Intelligence is no longer just for tech giants; it's becoming the ultimate tool for athletes and bodybuilders. Here's how AI-driven protocols are changing the game of hypertrophy.

## 1. Precision Volume Management
One of the biggest challenges in building muscle is finding the "sweet spot" for volume. Too little, and you don't grow; too much, and you overtrain. AI algorithms can analyze your recovery patterns and performance data to adjust your weekly sets and reps with surgical precision.

## 2. Optimized Exercise Selection
Not all exercises are created equal for every body type. AI can suggest movements based on your biomechanics, injury history, and specific weak points. If your bench press is stalling, the AI might identify a tricep weakness and prioritize close-grip work or weighted dips.

## 3. Real-Time Progressive Overload
Progressive overload is the law of muscle growth. AI fitness engines like Fitin60ai.in calculate exactly when you should increase the weight or add an extra rep, ensuring you're always pushing the boundaries of your physical limit without hitting a plateau.

## 4. The Future of Hypertrophy
As AI models become more sophisticated, they will be able to predict muscle growth rates based on your DNA, blood markers, and sleep quality. We are entering an era of "Hyper-Personalized" fitness where generic plans are obsolete.
    `
  },
  {
    id: "fat-loss-protocol",
    title: "The Ultimate Fat Loss Protocol",
    description: "A deep dive into calorie deficits, macros, and metabolic optimization.",
    category: "Fat Loss",
    readTime: "8 min",
    icon: "Flame",
    content: `
# The Ultimate Fat Loss Protocol

Losing fat is simple in theory (calories in vs. calories out), but complex in practice. This protocol breaks down the science of metabolic optimization.

## 1. The Science of the Deficit
To lose fat, you must be in a caloric deficit. However, a deficit that is too aggressive can lead to muscle loss and metabolic adaptation. AI helps calculate your TDEE (Total Daily Energy Expenditure) accurately, setting a deficit that preserves lean mass while incinerating fat.

## 2. Macro Ratios for Satiety
Protein is your best friend during a cut. It has a high thermic effect and keeps you full. Our AI protocols typically prioritize high protein (1.8g - 2.2g per kg of body weight) to ensure you're losing fat, not muscle.

## 3. NEAT: The Hidden Fat Burner
Non-Exercise Activity Thermogenesis (NEAT) accounts for more calorie burn than your actual workout. Walking, fidgeting, and standing all add up. A successful fat loss protocol focuses on increasing daily step counts alongside structured cardio.

## 4. Refeeds and Diet Breaks
Long-term dieting can crash your hormones. AI-driven plans incorporate strategic refeed days—increasing carbohydrates to restore leptin levels and give you a psychological break, ensuring long-term adherence.
    `
  },
  {
    id: "home-vs-gym",
    title: "Home vs Gym: Which is Better?",
    description: "Comparing the effectiveness of bodyweight training versus heavy iron.",
    category: "Training",
    readTime: "5 min",
    icon: "LayoutGrid",
    content: `
# Home vs Gym: Which is Better?

The age-old debate: Can you build an elite physique at home, or is the gym mandatory? The answer depends on your goals and how you use the tools available.

## The Case for the Gym
**Pros:**
- Access to heavy weights for easier progressive overload.
- Specialized machines for muscle isolation.
- A dedicated environment that boosts motivation.

**Cons:**
- Monthly membership fees.
- Travel time and potential crowds.

## The Case for Home Workouts
**Pros:**
- Zero commute; maximum convenience.
- No membership fees.
- Complete privacy.

**Cons:**
- Limited equipment (unless you invest in a home gym).
- Harder to isolate specific muscles with just bodyweight.

## The AI Solution
The best workout is the one you actually do. AI engines like ours bridge the gap by creating elite bodyweight protocols that utilize "mechanical disadvantage" (like tempo changes and pause reps) to simulate heavy weights, making home workouts incredibly effective for muscle growth.
    `
  },
  {
    id: "mastering-macros",
    title: "Mastering Your Macros",
    description: "Everything you need to know about proteins, fats, and carbohydrates for your body type.",
    category: "Nutrition",
    readTime: "7 min",
    icon: "Activity",
    content: `
# Mastering Your Macros

Calories determine weight, but macros determine body composition. If you want to look "fit" and not just "thin," you need to master your macronutrients.

## 1. Protein: The Building Block
Protein is essential for muscle repair and growth. Aim for 0.8g to 1g per pound of body weight. Sources: Chicken, fish, tofu, eggs, and whey protein.

## 2. Carbohydrates: The Fuel
Carbs are your body's primary energy source for high-intensity training. They are not the enemy! Focus on complex carbs like oats, sweet potatoes, and brown rice.

## 3. Fats: The Hormone Regulator
Fats are crucial for hormone production, including testosterone. Never drop your fats too low. Focus on healthy sources like avocados, nuts, and olive oil.

## 4. Finding Your Balance
Your ideal macro split depends on your body type (Ectomorph, Mesomorph, Endomorph) and your activity level. AI can calculate the perfect ratio to fuel your workouts while keeping you lean.
    `
  },
  {
    id: "progressive-overload",
    title: "Progressive Overload 101",
    description: "The fundamental principle of muscle growth explained for beginners.",
    category: "Education",
    readTime: "4 min",
    icon: "Zap",
    content: `
# Progressive Overload 101

If you do the same thing every day, your body has no reason to change. Progressive overload is the systematic increase in stress placed upon the body during exercise.

## Ways to Overload:
1. **Increase Resistance:** Add more weight to the bar.
2. **Increase Volume:** Do more reps or more sets.
3. **Improve Technique:** Lift the same weight with better form.
4. **Decrease Rest:** Do the same work in less time.
5. **Increase Frequency:** Train the muscle more often.

## Why It Matters
Without progressive overload, you will plateau. Your muscles adapt to the stress you provide; to keep growing, you must keep challenging them. AI tracking is the most efficient way to ensure you're actually progressing week over week.
    `
  },
  {
    id: "supplements-guide",
    title: "Supplements That Actually Work",
    description: "Cutting through the noise to find the scientifically-backed performance enhancers.",
    category: "Supplements",
    readTime: "6 min",
    icon: "Coffee",
    content: `
# Supplements That Actually Work

The supplement industry is full of hype. Most products are a waste of money. However, a few have decades of research backing their effectiveness.

## 1. Creatine Monohydrate
The most researched supplement in history. It helps with ATP production, allowing for more power and strength during short bursts of exercise. 5g a day is the gold standard.

## 2. Whey Protein
A convenient way to hit your daily protein targets. It's fast-digesting, making it ideal for post-workout recovery.

## 3. Caffeine
The ultimate pre-workout. It increases focus, reduces perceived exertion, and can slightly boost fat oxidation.

## 4. Vitamin D and Omega-3s
While not "performance enhancers" in the traditional sense, they are crucial for overall health, bone density, and reducing inflammation, which allows you to train harder and longer.

## The Bottom Line
Supplements are the "cherry on top." They will not fix a bad diet or a lazy workout routine. Focus on the fundamentals first!
    `
  }
];
