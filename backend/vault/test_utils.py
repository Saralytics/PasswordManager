from django.test import TestCase
from vault.utils import PasswordGenerator
from unittest import skip

class TestPasswordGenerator(TestCase):
    def setUp(self):
        # Setup run before every test method.
        self.generator = PasswordGenerator()

    def test_length(self):
        """Test the generated password has the correct length."""
        password = self.generator.generate()
        self.assertEqual(len(password), self.generator.len_total, "The password length does not match the expected value.")

    def test_composition(self):
        """Test the generated password has the correct composition of digits, letters, and symbols."""
        password = self.generator.generate()
        digit_count = sum(c.isdigit() for c in password)
        letter_count = sum(c.isalpha() for c in password)
        symbol_count = len(password) - digit_count - letter_count

        self.assertEqual(digit_count, self.generator.nbr_digits, "The number of digits in the password is incorrect.")
        self.assertEqual(letter_count, self.generator.nbr_letters, "The number of letters in the password is incorrect.")
        self.assertEqual(symbol_count, self.generator.nbr_symbols, "The number of symbols in the password is incorrect.")

    @skip('Implement this function in password manager')
    def test_no_repeating_characters_consecutively(self):
        """Ensure no characters are repeated consecutively in the password."""
        for _ in range(100):  # Generate multiple passwords to ensure reliability
            password = self.generator.generate()
            self.assertFalse(any(password[i] == password[i+1] for i in range(len(password)-1)))

    @skip('the change in length func is not implemented yet')
    def test_change_in_length(self):
        """Verify password lengths vary correctly when the total length is changed."""
        original_length = self.generator.len_total
        for new_length in range(8, 21):  # Test a range of lengths
            self.generator.len_total = new_length
            password = self.generator.generate()
            self.assertEqual(len(password), new_length)
        self.generator.len_total = original_length  # Reset to original length

    def test_randomness(self):
        """Test that generated passwords are not the same - checks randomness."""
        passwords = set(self.generator.generate() for _ in range(100))
        # Assuming a low probability of collision, expect most passwords to be unique
        self.assertTrue(len(passwords) > 95, "Generated passwords lack randomness")

    @skip('Skip until the logic is improved')
    def test_strength(self):
        """Check if the generated password meets a basic strength criteria."""
        for _ in range(100):
            password = self.generator.generate()
            has_digit = any(char.isdigit() for char in password)
            has_upper = any(char.isupper() for char in password)
            has_lower = any(char.islower() for char in password)
            has_symbol = any(not char.isalnum() for char in password)
            self.assertTrue(all([has_digit, has_upper, has_lower, has_symbol]),
                            "Password does not meet the strength criteria")

    def test_adjustable_composition(self):
        """Test the flexibility of changing the composition (digits, letters, symbols) of the password."""
        self.generator.nbr_digits = 2
        self.generator.nbr_letters = 5
        self.generator.nbr_symbols = 3
        password = self.generator.generate()
        digit_count = sum(c.isdigit() for c in password)
        letter_count = sum(c.isalpha() for c in password)
        symbol_count = sum(not c.isalnum() for c in password)

        self.assertEqual(digit_count, 2)
        self.assertEqual(letter_count, 5)
        self.assertEqual(symbol_count, 3)

    def test_edge_cases(self):
        """Test edge cases for password composition."""
        edge_cases = [
            (1, 0, 0),  # Single symbol
            (2, 1, 0),  # One digit, one symbol
            (3, 0, 1),  # One letter, two symbols
            (4, 2, 1)   # Custom case with minimal length
        ]
        for len_total, nbr_digits, nbr_letters in edge_cases:
            self.generator.len_total = len_total
            self.generator.nbr_digits = nbr_digits
            self.generator.nbr_letters = nbr_letters
            self.generator.nbr_symbols = len_total - nbr_digits - nbr_letters

            password = self.generator.generate()
            self.assertEqual(len(password), len_total, f"Failed in edge case: {len_total, nbr_digits, nbr_letters}")

    @skip('This function need to be fixed')
    def test_invalid_configurations(self):
        """Test the generator's response to invalid configurations."""
        invalid_configs = [
            (4, 11, 0),  # More digits than total length
            (5, 0, 12),  # More letters than total length
            (5, 5, 5)   # Sum of digits and letters exceeds total length
        ]
        for len_total, nbr_digits, nbr_letters in invalid_configs:
            with self.assertRaises(ValueError):
                self.generator.len_total = len_total
                self.generator.nbr_digits = nbr_digits
                self.generator.nbr_letters = nbr_letters
                self.generator.nbr_symbols = len_total - nbr_digits - nbr_letters
                self.generator.generate()

    def test_varied_compositions(self):
        """Test password generation with varied compositions of letters, digits, and symbols."""
        configurations = [
            (15, 3, 5),  # More symbols
            (12, 6, 2),  # More digits
            (10, 2, 6),  # More letters
            (20, 7, 7)   # Large password with equal numbers of letters and digits
        ]
        for len_total, nbr_digits, nbr_letters in configurations:
            self.generator.len_total = len_total
            self.generator.nbr_digits = nbr_digits
            self.generator.nbr_letters = nbr_letters
            self.generator.nbr_symbols = len_total - nbr_digits - nbr_letters

            password = self.generator.generate()
            digit_count = sum(c.isdigit() for c in password)
            letter_count = sum(c.isalpha() for c in password)
            symbol_count = sum(not c.isalnum() for c in password)

            self.assertEqual(digit_count, nbr_digits)
            self.assertEqual(letter_count, nbr_letters)
            self.assertEqual(symbol_count, self.generator.nbr_symbols)


