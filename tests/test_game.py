import unittest
import random

from AI_Game import game


class TestGame(unittest.TestCase):
    def test_choose_target_range(self):
        rng = random.Random(0)
        for _ in range(100):
            t = game.choose_target(1, 10, rng=rng)
            self.assertTrue(1 <= t <= 10)

    def test_check_guess(self):
        self.assertEqual(game.check_guess(3, 5), "low")
        self.assertEqual(game.check_guess(7, 5), "high")
        self.assertEqual(game.check_guess(5, 5), "correct")

    def test_parse_guess_valid(self):
        self.assertEqual(game.parse_guess(" 42\n"), 42)

    def test_parse_guess_invalid(self):
        with self.assertRaises(ValueError):
            game.parse_guess("")
        with self.assertRaises(ValueError):
            game.parse_guess("abc")


if __name__ == "__main__":
    unittest.main()
