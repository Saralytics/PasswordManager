from secrets import choice, randbelow
from random import randint
import string
from passwordmanager.settings import MAX_PASS_LEN, MIN_PASS_LEN

# TO REFACTOR:
# Do not use boolean flags


class PasswordGenerator:
    def __init__(self, password_len=12, has_upper_case="True", has_lower_case="True", has_digits="True", has_symbols="True"):
        """User will decide how long their password should be, and whether it should contain upper case, 
        lower case, digits, symbols or any combination of the above. This class will automatically 
        assign the number of each character group"""
        
        self.password_len = int(password_len)
        self.validate_password_len(self.password_len)
        self.has_upper_case = has_upper_case.lower() == "true"
        self.has_lower_case = has_lower_case.lower() == "true"
        self.has_digits = has_digits.lower() == "true"
        self.has_symbols = has_symbols.lower() == "true"
        self.upper_case_letters = string.ascii_uppercase
        self.lower_case_letters = string.ascii_lowercase
        self.digits = string.digits
        self.symbols = "!@#$%^&*()-_=+[]{};:,.?"
        # Initialize counts for each group to 0. Use a dict to map attributes for readability.
        self.counts = {'nbr_upper': 0, 'nbr_lower': 0, 'nbr_digits': 0, 'nbr_symbols': 0}


    def validate_password_len(self, password_len):
        if not (MIN_PASS_LEN <= password_len <= MAX_PASS_LEN):
            raise ValueError(f"Password length must be between {MIN_PASS_LEN} and {MAX_PASS_LEN} characters.")  


    def is_config_valid(self):
        """at least one of the configuration choices are selected"""
        if not any([self.has_upper_case, self.has_lower_case, self.has_digits, self.has_symbols]):
            raise ValueError("Choose at least one of the character groups.")
        else:
            return True


    def compose_password_structure(self):
        # distribute the available positions among character groups
        # Store the booleans in a list for easy processing.
        group_flags = [self.has_upper_case, self.has_lower_case, self.has_digits, self.has_symbols]
        # List of group names for direct mapping and assignment later.
        group_names = list(self.counts.keys())
        
        # Filter indices of active groups based on their flags.
        active_indices = [idx for idx, flag in enumerate(group_flags) if flag]
        
        # Distribute total_len across active groups.
        for _ in range(self.password_len):
            idx = active_indices[randint(0, len(active_indices) - 1)]
            self.counts[group_names[idx]] += 1


    def randomly_select_characters(self):
        """Create a pool of candidates to fill in the password"""
        
        # randomly pick from digits nbr_digits and so on
        digit_candidates = [choice(self.digits) for _ in range(self.counts['nbr_digits'])]
        upper_letter_candidates = [choice(self.upper_case_letters) for _ in range(self.counts['nbr_upper'])]
        lower_letter_candidates = [choice(self.lower_case_letters) for _ in range(self.counts['nbr_lower'])]
        symbols_candidates = [choice(self.symbols) for _ in range(self.counts['nbr_symbols'])]

        self.candidates = []
        self.candidates.extend(digit_candidates)
        self.candidates.extend(upper_letter_candidates)
        self.candidates.extend(lower_letter_candidates)
        self.candidates.extend(symbols_candidates)
        
    
    def return_random_order_selected_characters(self):
        # Securely shuffle the list of candidates
        # secrets.randbelow is used to generate a random index to shuffle
        for i in range(len(self.candidates) - 1, 0, -1):
            # Pick a random index from 0 to i
            j = randbelow(i + 1)
            # Swap candidates[i] with the element at random index
            self.candidates[i], self.candidates[j] = self.candidates[j], self.candidates[i]

        return ''.join(self.candidates)
    
    def generate(self):

        self.is_config_valid()

        self.compose_password_structure()
        self.randomly_select_characters()
        self.new_password = self.return_random_order_selected_characters()
        return self.new_password
