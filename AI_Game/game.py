import random


def choose_target(low=1, high=100, rng=None):
    """Return a random integer between low and high (inclusive).

    Accepts an optional `rng` which should have a `randint(a, b)` method
    (e.g., `random.Random`) to make tests deterministic.
    """
    if rng is None:
        rng = random
    return rng.randint(low, high)


def check_guess(guess, target):
    """Compare guess to target and return 'low', 'high', or 'correct'."""
    if guess < target:
        return "low"
    if guess > target:
        return "high"
    return "correct"


def parse_guess(s):
    """Parse a string into an int. Raises ValueError for invalid input."""
    s = s.strip()
    if s == "":
        raise ValueError("Empty input")
    return int(s)


def main():
    print("Welcome to the Number Guessing Game!")
    while True:
        target = choose_target()
        attempts = 7
        print("I'm thinking of a number between 1 and 100. You have 7 attempts.")

        for attempt in range(1, attempts + 1):
            while True:
                try:
                    user = input(f"Attempt {attempt}/{attempts}. Enter your guess: ")
                    guess = parse_guess(user)
                    break
                except ValueError:
                    print("Please enter a valid integer.")

            result = check_guess(guess, target)
            if result == "correct":
                print(f"Correct! You guessed it in {attempt} attempts.")
                break
            elif result == "low":
                print("Too low.")
            else:
                print("Too high.")

            if attempt == attempts:
                print(f"Out of attempts! The number was {target}.")

        again = input("Play again? (y/n): ").strip().lower()
        if not again.startswith("y"):
            print("Thanks for playing!")
            break


if __name__ == "__main__":
    main()
