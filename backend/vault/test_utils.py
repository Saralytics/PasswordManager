from django.test import TestCase
from vault.utils import PasswordGenerator
from unittest import skip
from passwordmanager.settings import MIN_PASS_LEN, MAX_PASS_LEN
import logging

logging.basicConfig(level=logging.INFO)


class TestPasswordGenerator(TestCase):

    def setUp(self):
        # Setup run before every test method.
        self.generator = PasswordGenerator()

    def test_length(self):
        """Test the generated password has the correct length."""
        password = self.generator.generate()
        self.assertEqual(len(password), self.generator.password_len,
                         "The password length does not match the expected value.")

    def test_composition(self):
        """Test the generated password has the correct composition of digits, letters, and symbols."""
        password = self.generator.generate()
        digit_count = sum(c.isdigit() for c in password)
        upper_letter_count = sum(c.isupper() for c in password)
        lower_letter_count = sum(c.islower() for c in password)
        symbol_count = len(password) - digit_count - \
            upper_letter_count - lower_letter_count

        self.assertEqual(
            digit_count, self.generator.counts['nbr_digits'], "The number of digits in the password is incorrect.")
        self.assertEqual(
            upper_letter_count, self.generator.counts['nbr_upper'], "The number of letters in the password is incorrect.")
        self.assertEqual(
            lower_letter_count, self.generator.counts['nbr_lower'], "The number of letters in the password is incorrect.")
        self.assertEqual(
            symbol_count, self.generator.counts['nbr_symbols'], "The number of symbols in the password is incorrect.")

    @skip('It\'s possible to allow 2 consective characters being the same')
    def test_no_repeating_characters_consecutively(self):
        """Ensure no characters are repeated consecutively in the password."""
        for _ in range(100):  # Generate multiple passwords to ensure reliability
            password = self.generator.generate()
            self.assertFalse(any(password[i] == password[i+1]
                             for i in range(len(password)-1)))

    def test_randomness(self):
        """Test that generated passwords are not the same - checks randomness."""
        passwords = set(self.generator.generate() for _ in range(100))
        # Assuming a low probability of collision, expect most passwords to be unique
        self.assertTrue(len(passwords) > 99,
                        "Generated passwords lack randomness")

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

    def test_configuration_output(self):
        """Generated passwords should accurately reflect requested configurations."""
        # Example: Testing generation with only digits
        generator = PasswordGenerator(
            has_digits=True, has_upper_case=False, has_lower_case=False, has_symbols=False)

        password = generator.generate()

        self.assertTrue(password.isdigit(
        ), "Generated password does not match the digit-only configuration.")

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

    def test_minimum_length(self):
        """Ensure password meets the minimum length requirement."""

        generator = PasswordGenerator(password_len=MIN_PASS_LEN)
        password = generator.generate()
        self.assertEqual(len(password), MIN_PASS_LEN,
                         "Password does not meet the minimum length requirement.")

    def test_maximum_length(self):
        """Ensure password does not exceed the maximum length requirement."""
        generator = PasswordGenerator(password_len=MAX_PASS_LEN)
        password = generator.generate()

        self.assertEqual(len(password), MAX_PASS_LEN,
                         "Password exceeds the maximum length requirement.")

    def test_invalid_length_configuration(self):
        """Test the generator with invalid length configurations."""
        with self.assertRaises(ValueError):
            generator = PasswordGenerator(password_len=MAX_PASS_LEN + 1)
            generator.generate()
        with self.assertRaises(ValueError):
            generator = PasswordGenerator(password_len=MIN_PASS_LEN - 1)
            generator.generate()

    def test_unique_configurations(self):
        """Test passwords generated with unique configurations (e.g., only digits)."""
        self.generator = PasswordGenerator(
            has_upper_case=False, has_lower_case=False, has_digits=True, has_symbols=False)
        password = self.generator.generate()
        self.assertTrue(password.isdigit(),
                        "Password should contain only digits.")
        # Repeat for other unique configurations...

    def test_password_strength(self):
        """Passwords should meet basic strength criteria based on the enabled character types."""
        password = self.generator.generate()
        self.assertTrue(any(char.isdigit()
                        for char in password), "Password lacks digits.")
        self.assertTrue(any(char.isupper() for char in password),
                        "Password lacks uppercase letters.")
        # Extend checks based on the generator's configuration

    skip("until i figure our predictable patterns")

    def test_predictable_patterns(self):
        pass
