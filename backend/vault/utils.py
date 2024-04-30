from random import randint, choice, shuffle
import string
from passwordmanager.settings import MAX_PASS_LEN, MIN_PASS_LEN


class PasswordGenerator:
    def __init__(self, password_len: int = 12, has_upper_case=True, has_lower_case=True, has_digits=True, has_symbols=True):
        """User will decide how long their password should be, and whether it should contain upper case, 
        lower case, digits, symbols or any combination of the above. This class will automatically 
        assign the number of each character group"""
        self.upper_case_letters = string.ascii_uppercase
        self.lower_case_letters = string.ascii_lowercase
        self.digits = string.digits
        self.symbols = "!@#$%^&*()-_=+[]{};:,.?"

        self.password_len = password_len
        self.has_upper_case = has_upper_case
        self.has_lower_case = has_lower_case
        self.has_digits = has_digits
        self.has_symbols = has_symbols
        self.validate_password_len(self.password_len)

        # distribute the available positions among character groups
        # Should have max and min password length constraints
        # cannot be all false

        # Store the booleans in a list for easy processing.
        group_flags = [has_upper_case, has_lower_case, has_digits, has_symbols]

        # Initialize counts for each group to 0. Use a dict to map attributes for readability.
        self.counts = {'nbr_upper': 0, 'nbr_lower': 0,
                       'nbr_digits': 0, 'nbr_symbols': 0}

        # List of group names for direct mapping and assignment later.
        group_names = list(self.counts.keys())

        # Filter indices of active groups based on their flags.
        active_indices = [idx for idx, flag in enumerate(group_flags) if flag]
        self.password_len = int(password_len)

        # Distribute total_len across active groups.
        for _ in range(self.password_len):
            idx = active_indices[randint(0, len(active_indices) - 1)]
            self.counts[group_names[idx]] += 1

    def validate_password_len(self, password_len):
        if not (MIN_PASS_LEN <= password_len <= MAX_PASS_LEN):
            raise ValueError(
                f"Password length must be between {MIN_PASS_LEN} and {MAX_PASS_LEN} characters.")

    def is_config_valid(self):
        """at least one of the configuration choices are selected"""
        if not any([self.has_upper_case, self.has_lower_case, self.has_digits, self.has_symbols]):
            raise ValueError(
                "Choose at least one of the character groups.")
        else:
            return True

    def generate(self):
        # Create a pool of candidates to fill in the password

        # randomly pick from digits nbr_digits
        digit_candidates = [choice(self.digits)
                            for _ in range(self.counts['nbr_digits'])]
        # randomly pick from letters nbr_letters
        upper_letter_candidates = [
            choice(self.upper_case_letters) for _ in range(self.counts['nbr_upper'])]
        lower_letter_candidates = [
            choice(self.lower_case_letters) for _ in range(self.counts['nbr_lower'])]
        # randomly pick from symbols nbr_symbols
        symbols_candidates = [choice(self.symbols)
                              for _ in range(self.counts['nbr_symbols'])]

        candidates = []
        candidates.extend(digit_candidates)
        candidates.extend(upper_letter_candidates)
        candidates.extend(lower_letter_candidates)
        candidates.extend(symbols_candidates)

        # replace the placeholders of password at random index
        shuffle(candidates)
        return ''.join(candidates)
